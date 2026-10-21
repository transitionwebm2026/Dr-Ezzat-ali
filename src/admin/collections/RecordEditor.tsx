'use client';

import { Plus, Save, Star, X } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { nextSortOrder } from '@/admin/lib/order';
import { extractYoutubeId, slugify, slugPattern } from '@/admin/lib/text';
import { MediaUpload } from '@/admin/media/MediaUpload';
import { usePublish } from '@/admin/publish/PublishProvider';
import { ListControls, moveItem } from '@/admin/ui/ListControls';
import { BilingualField, Button, Field, FieldGroup, IconButton, Select, TextInput, Toggle } from '@/admin/ui/primitives';
import { useToast } from '@/admin/ui/Toast';
import { cn } from '@/lib/cn';
import { getSupabase } from '@/lib/supabase/client';
import type { CollectionConfig, FieldDef, Row } from './configs';

const str = (value: unknown) => (typeof value === 'string' ? value : '');
const strList = (value: unknown) => (Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []);

/** Database columns written by one field definition. */
function columnsOf(field: FieldDef): string[] {
  switch (field.type) {
    case 'bilingual':
    case 'bilingual-list':
      return [`${field.name}_ar`, `${field.name}_en`];
    case 'video':
      return [field.name, field.thumbnail, ...(field.youtube ? [field.youtube] : [])];
    default:
      return [field.name];
  }
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
          إضافة نقطة
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
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const validate = (row: Row): Record<string, string> => {
    const found: Record<string, string> = {};
    for (const field of config.fields) {
      if (field.type === 'bilingual' && field.required && !str(row[`${field.name}_ar`]).trim()) found[`${field.name}_ar`] = 'هذا الحقل مطلوب.';
      if (field.type === 'text' && field.required && !str(row[field.name]).trim()) found[field.name] = 'هذا الحقل مطلوب.';
      if (field.type === 'text' && field.slugFrom && str(row[field.name]) && !slugPattern.test(str(row[field.name])))
        found[field.name] = 'أحرف إنجليزية صغيرة وأرقام وشرطات فقط (مثل: dry-eye).';
      if (field.type === 'number') {
        const n = Number(row[field.name]);
        if (!Number.isInteger(n) || n < field.min || n > field.max) found[field.name] = `رقم صحيح من ${field.min} إلى ${field.max}.`;
      }
      if (field.type === 'date' && !/^\d{4}-\d{2}-\d{2}$/.test(str(row[field.name]))) found[field.name] = 'اختر تاريخاً.';
    }
    return { ...found, ...config.validate?.(row) };
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const row: Row = { ...draft };

    // Auto-fill slugs from their English source field.
    for (const field of config.fields) {
      if (field.type === 'text' && field.slugFrom && !str(row[field.name]).trim()) row[field.name] = slugify(str(row[field.slugFrom]));
    }
    setDraft(row);
    const found = validate(row);
    setErrors(found);
    if (Object.keys(found).length) {
      toast.error('راجع الحقول المحددة باللون الأحمر.');
      return;
    }

    const payload: Record<string, unknown> = {};
    for (const field of config.fields) {
      for (const column of columnsOf(field)) {
        let value = row[column];
        if (typeof value === 'string') value = value.trim();
        if (field.type === 'bilingual-list') value = strList(value).map((item) => item.trim()).filter(Boolean);
        if (field.type === 'number') value = Number(value);
        if (field.type === 'video' && column === field.youtube) value = extractYoutubeId(str(value));
        // Optional text / media columns are nullable: store NULL rather than ''.
        if ((field.type === 'image' || field.type === 'video' || field.type === 'text') && value === '') value = null;
        payload[column] = value;
      }
    }

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

  const renderField = (field: FieldDef) => {
    switch (field.type) {
      case 'bilingual':
        return (
          <BilingualField
            label={field.label}
            required={field.required}
            multiline={field.multiline}
            rows={field.rows}
            hint={field.hint}
            ar={str(draft[`${field.name}_ar`])}
            en={str(draft[`${field.name}_en`])}
            errors={{ ar: errors[`${field.name}_ar`], en: errors[`${field.name}_en`] }}
            onChange={(locale, value) => set(`${field.name}_${locale}`, value)}
          />
        );
      case 'bilingual-list':
        return (
          <div>
            {field.hint && <p className="mb-2 text-xs text-slate-500">{field.hint}</p>}
            <div className="grid gap-4 md:grid-cols-2">
              <StringListEditor label={`${field.label} (عربي)`} dir="rtl" items={strList(draft[`${field.name}_ar`])} onChange={(items) => set(`${field.name}_ar`, items)} />
              <StringListEditor label={`${field.label} (English)`} dir="ltr" items={strList(draft[`${field.name}_en`])} onChange={(items) => set(`${field.name}_en`, items)} />
            </div>
          </div>
        );
      case 'text':
        return (
          <Field label={field.label} required={field.required} hint={field.hint} error={errors[field.name]}>
            <TextInput
              dir={field.ltr ? 'ltr' : undefined}
              placeholder={field.slugFrom ? slugify(str(draft[field.slugFrom])) || field.placeholder : field.placeholder}
              value={str(draft[field.name])}
              invalid={Boolean(errors[field.name])}
              onChange={(e) => set(field.name, e.target.value)}
            />
          </Field>
        );
      case 'number':
        return (
          <Field label={field.label} hint={field.hint} error={errors[field.name]}>
            <TextInput type="number" dir="ltr" min={field.min} max={field.max} value={String(draft[field.name] ?? '')} onChange={(e) => set(field.name, e.target.value)} />
          </Field>
        );
      case 'date':
        return (
          <Field label={field.label} error={errors[field.name]}>
            <TextInput type="date" value={str(draft[field.name])} onChange={(e) => set(field.name, e.target.value)} />
          </Field>
        );
      case 'rating':
        return (
          <FieldGroup label={field.label}>
            <RatingInput value={Number(draft[field.name]) || 5} onChange={(value) => set(field.name, value)} />
          </FieldGroup>
        );
      case 'toggle':
        return <Toggle checked={Boolean(draft[field.name])} onChange={(value) => set(field.name, value)} label={field.label} description={field.hint} />;
      case 'select':
        return (
          <Field label={field.label}>
            <Select value={str(draft[field.name])} onChange={(e) => set(field.name, e.target.value)}>
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
            folder={config.folder}
            label={field.label}
            hint={field.hint}
            error={errors[field.name]}
            value={(draft[field.name] as string | null) ?? null}
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
                folder={config.folder}
                label="ملف الفيديو (طولي 9:16)"
                value={(draft[field.name] as string | null) ?? null}
                poster={(draft[field.thumbnail] as string | null) ?? null}
                onChange={(url) => set(field.name, url)}
              />
              <MediaUpload
                kind="image"
                folder={config.folder}
                label="صورة الغلاف (Thumbnail)"
                required={Boolean(draft[field.name])}
                error={errors[field.thumbnail]}
                hint="طولية 9:16 — مثلاً 720×1280 بكسل."
                value={(draft[field.thumbnail] as string | null) ?? null}
                onChange={(url) => set(field.thumbnail, url)}
              />
            </div>
            {field.youtube && (
              <Field label="أو رابط / معرّف يوتيوب" error={errors[field.youtube]} hint="يقبل روابط YouTube Shorts أيضاً.">
                <TextInput dir="ltr" placeholder="https://youtube.com/shorts/…" value={str(draft[field.youtube])} onChange={(e) => set(field.youtube!, e.target.value)} />
              </Field>
            )}
          </div>
        );
    }
  };

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
            <div key={field.name}>{renderField(field)}</div>
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
