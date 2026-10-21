'use client';

import { CornerDownLeft, ExternalLink, Pencil, Plus, Save } from 'lucide-react';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useSingletonRow } from '@/admin/hooks/useSingletonRow';
import { nextSortOrder, persistOrder } from '@/admin/lib/order';
import { MediaUpload } from '@/admin/media/MediaUpload';
import { usePublish } from '@/admin/publish/PublishProvider';
import { isValidLinkPath, LinkPathInput } from '@/admin/ui/LinkPathInput';
import { ListControls, moveItem } from '@/admin/ui/ListControls';
import { Badge, BilingualField, Button, Card, ErrorNotice, Field, IconButton, LoadingBlock, Select, Toggle } from '@/admin/ui/primitives';
import { useToast } from '@/admin/ui/Toast';
import { normalizePath } from '@/lib/cms/paths';
import type { NavigationRow, SiteSettingsRow } from '@/lib/cms/types';
import { getSupabase } from '@/lib/supabase/client';

type Editing = Omit<NavigationRow, 'id' | 'sort_order'> & { id?: string };

// ─── Header settings (CTA toggle + logo) ─────────────────────────────────────

function HeaderSettings() {
  const { row, loading, error, saving, save, reload } = useSingletonRow<SiteSettingsRow>('site_settings');
  const [logo, setLogo] = useState<string | null | undefined>(undefined);

  if (loading) return <LoadingBlock />;
  if (error || !row) return <ErrorNotice message={error ?? 'تعذّر التحميل.'} onRetry={() => void reload()} />;

  const logoValue = logo === undefined ? (row.logo_url ?? null) : logo;

  return (
    <Card title="إعدادات الهيدر" description="الشعار وزر «احجز موعدك» في شريط التنقل العلوي.">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-3">
          <MediaUpload kind="image" folder="brand" label="شعار العيادة" value={logoValue} onChange={setLogo} />
          {logo !== undefined && (
            <Button size="sm" loading={saving} icon={<Save aria-hidden className="size-4" />} onClick={async () => (await save({ logo_url: logoValue })) && setLogo(undefined)}>
              حفظ الشعار
            </Button>
          )}
        </div>
        <Toggle
          checked={row.nav_cta_enabled ?? true}
          disabled={saving}
          onChange={(value) => void save({ nav_cta_enabled: value })}
          label="إظهار زر «احجز موعدك» في الهيدر"
          description="يُحفظ فوراً عند التبديل."
        />
      </div>
    </Card>
  );
}

// ─── Menu links ──────────────────────────────────────────────────────────────

function LinkEditor({ value, rows, onCancel, onSaved }: { value: Editing; rows: NavigationRow[]; onCancel: () => void; onSaved: () => void }) {
  const [draft, setDraft] = useState<Editing>(value);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  // Two levels only: a link that has its own dropdown cannot be moved into another dropdown.
  const hasChildren = Boolean(draft.id && rows.some((row) => row.parent_id === draft.id));
  const parents = hasChildren ? [] : rows.filter((row) => !row.parent_id && row.id !== draft.id);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const found: Record<string, string> = {};
    if (!draft.label_ar.trim()) found.label_ar = 'مطلوب.';
    if (!draft.label_en.trim()) found.label_en = 'Required.';
    if (!isValidLinkPath(draft.path)) found.path = 'اختر صفحة أو أدخل رابطاً صحيحاً.';
    setErrors(found);
    if (Object.keys(found).length) return;

    setBusy(true);
    const supabase = getSupabase();
    const payload = {
      label_ar: draft.label_ar.trim(),
      label_en: draft.label_en.trim(),
      path: normalizePath(draft.path),
      parent_id: draft.parent_id,
      is_active: draft.is_active,
    };
    const siblings = rows.filter((row) => row.parent_id === draft.parent_id);
    const { error: saveError } = draft.id
      ? await supabase.from('navigation_menu').update(payload).eq('id', draft.id)
      : await supabase.from('navigation_menu').insert({ ...payload, sort_order: nextSortOrder(siblings) });
    setBusy(false);
    if (saveError) return toast.error(`لم يتم الحفظ: ${saveError.message}`);
    onSaved();
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-2xl border border-primary-200 bg-primary-50/40 p-4">
      <h3 className="text-base">{draft.id ? 'تعديل الرابط' : 'رابط جديد'}</h3>
      <BilingualField
        label="اسم الرابط"
        ar={draft.label_ar}
        en={draft.label_en}
        required
        errors={{ ar: errors.label_ar, en: errors.label_en }}
        onChange={(l, v) => setDraft((d) => ({ ...d, [`label_${l}`]: v }))}
      />
      <LinkPathInput value={draft.path} error={errors.path} onChange={(path) => setDraft((d) => ({ ...d, path }))} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="المكان" hint="اختر رابطاً رئيسياً لوضع هذا الرابط داخل قائمته المنسدلة.">
          <Select value={draft.parent_id ?? ''} onChange={(e) => setDraft((d) => ({ ...d, parent_id: e.target.value || null }))}>
            <option value="">رابط رئيسي في القائمة</option>
            {parents.map((parent) => (
              <option key={parent.id} value={parent.id}>
                داخل قائمة: {parent.label_ar}
              </option>
            ))}
          </Select>
        </Field>
        <Toggle checked={draft.is_active} onChange={(is_active) => setDraft((d) => ({ ...d, is_active }))} label="ظاهر في الموقع" />
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="submit" loading={busy} icon={<Save aria-hidden className="size-4" />}>
          حفظ الرابط
        </Button>
      </div>
    </form>
  );
}

function MenuLinks() {
  const [rows, setRows] = useState<NavigationRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Editing | null>(null);
  const toast = useToast();
  const { schedulePublish } = usePublish();

  const load = useCallback(async () => {
    setError(null);
    const { data, error: loadError } = await getSupabase().from('navigation_menu').select('*').order('sort_order').order('created_at');
    if (loadError) setError(`تعذّر تحميل القائمة: ${loadError.message}`);
    else setRows(data as NavigationRow[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const afterChange = async (message: string) => {
    toast.success(message);
    schedulePublish();
    await load();
  };

  if (error) return <ErrorNotice message={error} onRetry={() => void load()} />;
  if (!rows) return <LoadingBlock />;

  const topLevel = rows.filter((row) => !row.parent_id);
  const childrenOf = (id: string) => rows.filter((row) => row.parent_id === id);

  const move = async (siblings: NavigationRow[], from: number, to: number) => {
    const failed = await persistOrder('navigation_menu', moveItem(siblings, from, to));
    if (failed) toast.error(`لم يتم تغيير الترتيب: ${failed}`);
    else await afterChange('تم تغيير الترتيب.');
  };

  const remove = async (row: NavigationRow) => {
    const children = childrenOf(row.id).length;
    if (!window.confirm(`حذف «${row.label_ar}»${children ? ` و${children} رابط داخله` : ''}؟`)) return;
    const { error: deleteError } = await getSupabase().from('navigation_menu').delete().eq('id', row.id);
    if (deleteError) toast.error(`لم يتم الحذف: ${deleteError.message}`);
    else await afterChange('تم الحذف.');
  };

  const toggle = async (row: NavigationRow) => {
    const { error: updateError } = await getSupabase().from('navigation_menu').update({ is_active: !row.is_active }).eq('id', row.id);
    if (updateError) toast.error(updateError.message);
    else await afterChange(row.is_active ? 'تم إخفاء الرابط.' : 'تم إظهار الرابط.');
  };

  const newLink = (parent_id: string | null = null): Editing => ({ label_ar: '', label_en: '', path: '/', parent_id, is_active: true });

  const renderRow = (row: NavigationRow, siblings: NavigationRow[], index: number, child = false) => (
    <div className={`flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 ${child ? 'ms-8' : ''}`}>
      {child && <CornerDownLeft aria-hidden className="size-4 shrink-0 text-slate-300 ltr:-scale-x-100" />}
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2 font-heading text-sm font-bold text-secondary-800">
          {row.label_ar}
          <span className="font-sans text-xs font-normal text-slate-400" dir="ltr">
            {row.label_en}
          </span>
          {!row.is_active && <Badge tone="amber">مخفي</Badge>}
        </p>
        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500" dir="ltr">
          {/^https?:/.test(row.path) && <ExternalLink aria-hidden className="size-3" />}
          {row.path}
        </p>
      </div>
      <div className="flex items-center">
        <Button variant="ghost" size="sm" onClick={() => void toggle(row)}>
          {row.is_active ? 'إخفاء' : 'إظهار'}
        </Button>
        {!child && (
          <IconButton label="إضافة رابط داخل قائمته المنسدلة" onClick={() => setEditing(newLink(row.id))}>
            <Plus aria-hidden className="size-4" />
          </IconButton>
        )}
        <IconButton label="تعديل" onClick={() => setEditing({ ...row })}>
          <Pencil aria-hidden className="size-4" />
        </IconButton>
        <ListControls index={index} count={siblings.length} onMove={(to) => void move(siblings, index, to)} onRemove={() => void remove(row)} />
      </div>
    </div>
  );

  return (
    <Card
      title="روابط القائمة الرئيسية"
      description="رتّب الروابط وعدّل أسماءها بالعربية والإنجليزية. الروابط الداخلية تُحوَّل تلقائياً لنسخة /en في الموقع الإنجليزي."
      actions={
        <Button size="sm" icon={<Plus aria-hidden className="size-4" />} onClick={() => setEditing(newLink())}>
          إضافة رابط
        </Button>
      }
    >
      <div className="space-y-2">
        {editing && (
          <LinkEditor
            key={editing.id ?? `new-${editing.parent_id}`}
            value={editing}
            rows={rows}
            onCancel={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              void afterChange('تم حفظ الرابط.');
            }}
          />
        )}
        {topLevel.length === 0 && <p className="text-sm text-slate-500">لا توجد روابط — يعرض الموقع القائمة الافتراضية.</p>}
        {topLevel.map((row, index) => (
          <div key={row.id} className="space-y-2">
            {renderRow(row, topLevel, index)}
            {childrenOf(row.id).map((child, childIndex, siblings) => (
              <div key={child.id}>{renderRow(child, siblings, childIndex, true)}</div>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}

export function NavigationManager() {
  return (
    <div className="space-y-6">
      <HeaderSettings />
      <MenuLinks />
    </div>
  );
}
