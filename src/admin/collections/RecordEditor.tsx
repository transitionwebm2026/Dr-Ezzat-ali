'use client';

import { ChevronDown, Plus, Save, Star, X } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { nextSortOrder } from '@/admin/lib/order';
import { extractYoutubeId, slugify, slugPattern } from '@/admin/lib/text';
import { MediaUpload } from '@/admin/media/MediaUpload';
import { usePublish } from '@/admin/publish/PublishProvider';
import { ListControls, moveItem } from '@/admin/ui/ListControls';
import { Badge, BilingualField, Button, Field, FieldGroup, IconButton, Select, TextInput, Toggle } from '@/admin/ui/primitives';
import { useToast } from '@/admin/ui/Toast';
import { cn } from '@/lib/cn';
import { getSupabase } from '@/lib/supabase/client';
import type { CollectionConfig, FieldDef, Row } from './configs';
import { SceneField, VisualField } from './VisualPickers';

type RepeaterDef = Extract<FieldDef, { type: 'repeater' }>;
type Errors = Record<string, string>;

const str = (value: unknown) => (typeof value === 'string' ? value : '');
const strList = (value: unknown) => (Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []);
const rowsOf = (value: unknown): Row[] => (Array.isArray(value) ? value.filter((item): item is Row => typeof item === 'object' && item !== null && !Array.isArray(item)) : []);

/** Database columns (or jsonb keys) written by one field definition. */
function columnsOf(field: FieldDef): string[] {
  switch (field.type) {
    case 'heading':
      return [];
    case 'bilingual':
    case 'bilingual-list':
      return [`${field.name}_ar`, `${field.name}_en`];
    case 'video':
      return [field.name, field.thumbnail, ...(field.youtube ? [field.youtube] : [])];
    case 'visual':
      return [field.icon, field.tone, field.image];
    default:
      return [field.name];
  }
}

/** Empty slugs are generated from their English source field (also inside repeater items). */
function fillSlugs(fields: FieldDef[], row: Row): Row {
  const next: Row = { ...row };
  for (const field of fields) {
    if (field.type === 'text' && field.slugFrom && !str(next[field.name]).trim()) next[field.name] = slugify(str(next[field.slugFrom]));
    if (field.type === 'repeater') next[field.name] = rowsOf(next[field.name]).map((item) => fillSlugs(field.fields, item));
  }
  return next;
}

/** Errors keyed by column; repeater items use `name.index.column`. */
function validateFields(fields: FieldDef[], row: Row, prefix = '', found: Errors = {}): Errors {
  for (const field of fields) {
    const at = (column: string) => `${prefix}${column}`;
    if (field.type === 'bilingual' && field.required && !str(row[`${field.name}_ar`]).trim()) found[at(`${field.name}_ar`)] = 'هذا الحقل مطلوب.';
    if (field.type === 'text' && field.required && !str(row[field.name]).trim()) found[at(field.name)] = 'هذا الحقل مطلوب.';
    if (field.type === 'text' && field.slugFrom && str(row[field.name]) && !slugPattern.test(str(row[field.name])))
      found[at(field.name)] = 'أحرف إنجليزية صغيرة وأرقام وشرطات فقط (مثل: dry-eye).';
    if (field.type === 'number') {
      const n = Number(row[field.name]);
      if (!Number.isInteger(n) || n < field.min || n > field.max) found[at(field.name)] = `رقم صحيح من ${field.min} إلى ${field.max}.`;
    }
    if (field.type === 'date' && !/^\d{4}-\d{2}-\d{2}$/.test(str(row[field.name]))) found[at(field.name)] = 'اختر تاريخاً.';
    if (field.type === 'repeater') {
      const items = rowsOf(row[field.name]);
      items.forEach((item, index) => validateFields(field.fields, item, `${prefix}${field.name}.${index}.`, found));
      if (field.keyField) {
        const seen = new Set<string>();
        items.forEach((item, index) => {
          const key = str(item[field.keyField!]).trim();
          if (!key) return;
          if (seen.has(key)) found[at(`${field.name}.${index}.${field.keyField}`)] = `هذا المعرّف مستخدم في ${field.itemLabel} أخرى — اختر معرّفاً مختلفاً.`;
          seen.add(key);
        });
      }
    }
  }
  return found;
}

/** Row → the values saved to the database (trimmed, empty optional values as NULL). */
function toPayload(fields: FieldDef[], row: Row): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  for (const field of fields) {
    if (field.type === 'repeater') {
      payload[field.name] = rowsOf(row[field.name]).map((item) => toPayload(field.fields, item));
      continue;
    }
    for (const column of columnsOf(field)) {
      let value = row[column];
      if (typeof value === 'string') value = value.trim();
      if (field.type === 'bilingual-list') value = strList(value).map((item) => item.trim()).filter(Boolean);
      if (field.type === 'number') value = Number(value);
      if (field.type === 'video' && column === field.youtube) value = extractYoutubeId(str(value));
      // Optional text / media / choice columns are nullable: store NULL rather than '' (e.g. "not on the home page").
      if (['image', 'video', 'text', 'visual', 'scene', 'select'].includes(field.type) && (value === '' || value === undefined)) value = null;
      payload[column] = value;
    }
  }
  return payload;
}

function StringListEditor({ label, items, onChange, dir }: { label: string; items: string[]; onChange: (items: string[]) => void; dir: 'rtl' | 'ltr' }) {
  return (
    <FieldGroup label={label}>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <TextInput dir={dir} value={item} aria-label={`${label} ${index + 1}`} onChange={(e) => onChange(items.map((v, i) => (i === index ? e.target.value : v)))} />
            <ListControls index={index} count={items.length} onMove={(to) => onChange(moveItem(items, index, to))} onRemove={() => onChange(items.filter((_, i) => i !== index))} />
          </div>
        ))}
        <Button variant="outline" size="sm" icon={<Plus aria-hidden className="size-3.5" />} onClick={() => onChange([...items, ''])}>
          إضافة
        </Button>
      </div>
    </FieldGroup>
  );
}

function RatingInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div role="radiogroup" aria-label="التقييم" className="flex gap-1" dir="ltr">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" role="radio" aria-checked={value === n} aria-label={`${n} من 5`} onClick={() => onChange(n)} className="rounded-lg p-1 hover:bg-amber-50">
          <Star aria-hidden className={cn('size-7', n <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-300')} />
        </button>
      ))}
    </div>
  );
}

/** Where a field reads and writes: the record itself, or one item of a repeater. */
type Scope = {
  row: Row;
  set: (column: string, value: unknown) => void;
  /** Error-key prefix: '' for the record, `name.index.` for a repeater item. */
  prefix: string;
  errors: Errors;
  folder: string;
};

function FieldControl({ field, scope }: { field: FieldDef; scope: Scope }): ReactNode {
  const { row, set, prefix, errors, folder } = scope;
  const error = (column: string) => errors[`${prefix}${column}`];

  switch (field.type) {
    case 'heading':
      return (
        <div className="border-b border-slate-200 pb-2 pt-2">
          <h3 className="font-heading text-base font-bold text-secondary-800">{field.label}</h3>
          {field.hint && <p className="mt-0.5 text-xs text-slate-500">{field.hint}</p>}
        </div>
      );
    case 'bilingual':
      return (
        <BilingualField
          label={field.label}
          required={field.required}
          multiline={field.multiline}
          rows={field.rows}
          hint={field.hint}
          ar={str(row[`${field.name}_ar`])}
          en={str(row[`${field.name}_en`])}
          errors={{ ar: error(`${field.name}_ar`), en: error(`${field.name}_en`) }}
          onChange={(locale, value) => set(`${field.name}_${locale}`, value)}
        />
      );
    case 'bilingual-list':
      return (
        <div>
          {field.hint && <p className="mb-2 text-xs text-slate-500">{field.hint}</p>}
          <div className="grid gap-4 md:grid-cols-2">
            <StringListEditor label={`${field.label} (عربي)`} dir="rtl" items={strList(row[`${field.name}_ar`])} onChange={(items) => set(`${field.name}_ar`, items)} />
            <StringListEditor label={`${field.label} (English)`} dir="ltr" items={strList(row[`${field.name}_en`])} onChange={(items) => set(`${field.name}_en`, items)} />
          </div>
        </div>
      );
    case 'text':
      return (
        <Field label={field.label} required={field.required} hint={field.hint} error={error(field.name)}>
          <TextInput
            dir={field.ltr ? 'ltr' : undefined}
            placeholder={field.slugFrom ? slugify(str(row[field.slugFrom])) || field.placeholder : field.placeholder}
            value={str(row[field.name])}
            invalid={Boolean(error(field.name))}
            onChange={(e) => set(field.name, e.target.value)}
          />
        </Field>
      );
    case 'number':
      return (
        <Field label={field.label} hint={field.hint} error={error(field.name)}>
          <TextInput type="number" dir="ltr" min={field.min} max={field.max} value={String(row[field.name] ?? '')} onChange={(e) => set(field.name, e.target.value)} />
        </Field>
      );
    case 'date':
      return (
        <Field label={field.label} error={error(field.name)}>
          <TextInput type="date" value={str(row[field.name])} onChange={(e) => set(field.name, e.target.value)} />
        </Field>
      );
    case 'rating':
      return (
        <FieldGroup label={field.label}>
          <RatingInput value={Number(row[field.name]) || 5} onChange={(value) => set(field.name, value)} />
        </FieldGroup>
      );
    case 'toggle':
      return <Toggle checked={Boolean(row[field.name])} onChange={(value) => set(field.name, value)} label={field.label} description={field.hint} />;
    case 'select':
      return (
        <Field label={field.label} hint={field.hint}>
          <Select value={str(row[field.name])} onChange={(e) => set(field.name, e.target.value)}>
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>
      );
    case 'image':
      return (
        <MediaUpload
          kind="image"
          folder={folder}
          label={field.label}
          hint={field.hint}
          error={error(field.name)}
          value={(row[field.name] as string | null) ?? null}
          onChange={(url) => set(field.name, url)}
        />
      );
    case 'video':
      return (
        <div className="space-y-4 rounded-2xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">ارفع ملف الفيديو من جهازك مع صورة الغلاف (إلزامية)، أو ضع رابط يوتيوب. عند وجود الاثنين يُستخدم يوتيوب.</p>
          <div className="grid gap-5 md:grid-cols-2">
            <MediaUpload
              kind="video"
              folder={folder}
              label="ملف الفيديو (طولي 9:16)"
              value={(row[field.name] as string | null) ?? null}
              poster={(row[field.thumbnail] as string | null) ?? null}
              onChange={(url) => set(field.name, url)}
            />
            <MediaUpload
              kind="image"
              folder={folder}
              label="صورة الغلاف (Thumbnail)"
              required={Boolean(row[field.name])}
              error={error(field.thumbnail)}
              hint="طولية 9:16 — مثلاً 720×1280 بكسل."
              value={(row[field.thumbnail] as string | null) ?? null}
              onChange={(url) => set(field.thumbnail, url)}
            />
          </div>
          {field.youtube && (
            <Field label="أو رابط / معرّف يوتيوب" error={error(field.youtube)} hint="يقبل روابط YouTube Shorts أيضاً.">
              <TextInput dir="ltr" placeholder="https://youtube.com/shorts/…" value={str(row[field.youtube])} onChange={(e) => set(field.youtube!, e.target.value)} />
            </Field>
          )}
        </div>
      );
    case 'visual':
      return (
        <VisualField
          label={field.label}
          icon={row[field.icon]}
          tone={row[field.tone]}
          image={(row[field.image] as string | null) ?? null}
          folder={folder}
          imageHint={field.imageHint}
          onChange={(part, value) => set(field[part], value)}
        />
      );
    case 'scene':
      return <SceneField label={field.label} hint={field.hint} value={row[field.name]} onChange={(scene) => set(field.name, scene)} />;
    case 'repeater':
      return <RepeaterField field={field} items={rowsOf(row[field.name])} onChange={(items) => set(field.name, items)} scope={scope} />;
  }
}

/** Collapsible list of items (e.g. the technique cards of a specialty): one item open at a time. */
function RepeaterField({ field, items, onChange, scope }: { field: RepeaterDef; items: Row[]; onChange: (items: Row[]) => void; scope: Scope }) {
  const [open, setOpen] = useState<number | null>(null);
  const base = `${scope.prefix}${field.name}.`;
  const hasError = (index: number) => Object.keys(scope.errors).some((key) => key.startsWith(`${base}${index}.`));

  // After a failed save, open the first item that needs fixing.
  useEffect(() => {
    const first = items.findIndex((_, index) => hasError(index));
    if (first >= 0) setOpen(first);
  }, [scope.errors]);

  const update = (index: number, column: string, value: unknown) => onChange(items.map((item, i) => (i === index ? { ...item, [column]: value } : item)));

  const move = (from: number, to: number) => {
    onChange(moveItem(items, from, to));
    if (open === from) setOpen(to);
    else if (open === to) setOpen(from);
  };

  const remove = (index: number) => {
    const title = field.titleField ? str(items[index][field.titleField]) : '';
    if (!window.confirm(`حذف ${field.itemLabel}${title ? ` «${title}»` : ''}؟ (يُحذف نهائياً بعد «حفظ التعديلات»)`)) return;
    onChange(items.filter((_, i) => i !== index));
    if (open === index) setOpen(null);
    else if (open !== null && open > index) setOpen(open - 1);
  };

  const add = () => {
    onChange([...items, { ...field.defaults }]);
    setOpen(items.length);
  };

  return (
    <div className="space-y-2.5">
      {field.hint && <p className="text-xs text-slate-500">{field.hint}</p>}
      {items.length === 0 && <p className="rounded-xl border-2 border-dashed border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500">لا توجد عناصر بعد.</p>}
      {items.map((item, index) => {
        const isOpen = open === index;
        const title = field.titleField ? str(item[field.titleField]) : '';
        const badge = field.badge?.(item);
        return (
          <div key={index} className={cn('rounded-2xl border bg-white', hasError(index) ? 'border-rose-300' : isOpen ? 'border-primary-200 shadow-sm' : 'border-slate-200')}>
            <div className="flex items-center gap-2 p-2 ps-3">
              <button type="button" onClick={() => setOpen(isOpen ? null : index)} aria-expanded={isOpen} className="flex min-w-0 flex-1 items-center gap-3 text-start">
                <span dir="ltr" className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-gradient font-heading text-xs font-bold text-white">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={cn('min-w-0 flex-1 truncate font-heading text-sm font-bold', title ? 'text-secondary-800' : 'text-slate-400')}>
                  {title || `${field.itemLabel} جديدة`}
                </span>
                {badge && <Badge tone="blue">{badge}</Badge>}
                {hasError(index) && <span className="shrink-0 text-xs font-bold text-rose-600">يحتاج مراجعة</span>}
                <ChevronDown aria-hidden className={cn('size-4 shrink-0 text-slate-400 transition-transform', isOpen && 'rotate-180')} />
              </button>
              <ListControls index={index} count={items.length} onMove={(to) => move(index, to)} onRemove={() => remove(index)} removeLabel={`حذف ${field.itemLabel}`} />
            </div>
            {isOpen && (
              <div className="space-y-4 border-t border-slate-100 p-4">
                {field.fields.map((sub) => (
                  <div key={sub.name}>
                    <FieldControl
                      field={sub}
                      scope={{ ...scope, row: item, set: (column, value) => update(index, column, value), prefix: `${base}${index}.` }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <Button variant="outline" size="sm" icon={<Plus aria-hidden className="size-3.5" />} onClick={add}>
        إضافة {field.itemLabel}
      </Button>
    </div>
  );
}

type RecordEditorProps = {
  config: CollectionConfig;
  initial: Row;
  /** Rows of the same list/group — used for the sort order of new items. */
  siblings: Row[];
  onClose: () => void;
  onSaved: () => void;
};

/** Slide-over form generated from the collection's field definitions. */
export function RecordEditor({ config, initial, siblings, onClose, onSaved }: RecordEditorProps) {
  const [draft, setDraft] = useState<Row>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const { schedulePublish } = usePublish();
  const isNew = !initial.id;
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);

  const set = (column: string, value: unknown) => setDraft((d) => ({ ...d, [column]: value }));

  const requestClose = () => {
    if (!dirty || window.confirm('لديك تعديلات غير محفوظة. هل تريد الخروج بدونها؟')) onClose();
  };
  const requestCloseRef = useRef(requestClose);
  requestCloseRef.current = requestClose;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') requestCloseRef.current();
    };
    window.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
    };
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const row = fillSlugs(config.fields, draft);
    setDraft(row);
    const found = { ...validateFields(config.fields, row), ...config.validate?.(row) };
    setErrors(found);
    if (Object.keys(found).length) {
      toast.error('راجع الحقول المحددة باللون الأحمر.');
      return;
    }

    const payload = toPayload(config.fields, row);
    setBusy(true);
    const table = getSupabase().from(config.table);
    const { error } = isNew
      ? await table.insert({ ...payload, sort_order: nextSortOrder(siblings as { id: string; sort_order: number }[]) })
      : await table.update(payload).eq('id', initial.id!);
    setBusy(false);

    if (error) {
      toast.error(error.code === '23505' ? 'هذا المعرّف / الرابط مستخدم بالفعل في عنصر آخر.' : `لم يتم الحفظ: ${error.message}`);
      return;
    }
    toast.success(isNew ? `تمت إضافة ${config.singular}.` : 'تم حفظ التعديلات.');
    schedulePublish();
    onSaved();
  };

  const scope: Scope = { row: draft, set, prefix: '', errors, folder: config.folder };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={isNew ? `إضافة ${config.singular}` : `تعديل ${config.singular}`}>
      <button type="button" aria-label="إغلاق" tabIndex={-1} className="absolute inset-0 bg-secondary-950/40 backdrop-blur-sm" onClick={requestClose} />
      <form onSubmit={onSubmit} noValidate className="absolute inset-y-0 end-0 flex w-full max-w-3xl flex-col bg-slate-50 shadow-elevated">
        <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4">
          <h2 className="text-lg">{isNew ? `إضافة ${config.singular}` : `تعديل ${config.singular}`}</h2>
          <IconButton label="إغلاق" onClick={requestClose}>
            <X aria-hidden className="size-5" />
          </IconButton>
        </header>
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {config.fields.map((field) => (
            <div key={field.name}>
              <FieldControl field={field} scope={scope} />
            </div>
          ))}
        </div>
        <footer className="flex items-center justify-end gap-2 border-t border-slate-200 bg-white px-5 py-3">
          <Button variant="ghost" onClick={requestClose}>
            إلغاء
          </Button>
          <Button type="submit" loading={busy} icon={<Save aria-hidden className="size-4" />}>
            {isNew ? 'إضافة' : 'حفظ التعديلات'}
          </Button>
        </footer>
      </form>
    </div>
  );
}
