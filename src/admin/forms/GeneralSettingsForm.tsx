'use client';

import { Plus, Save } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useSingletonRow } from '@/admin/hooks/useSingletonRow';
import { nullable, str } from '@/admin/lib/text';
import { MediaUpload } from '@/admin/media/MediaUpload';
import { ListControls, moveItem } from '@/admin/ui/ListControls';
import { BilingualField, Button, Card, ErrorNotice, Field, LoadingBlock, PageActions, TextInput } from '@/admin/ui/primitives';
import type { OpeningHoursSlot, SiteSettingsRow } from '@/lib/cms/types';

type Draft = {
  site_title_ar: string;
  site_title_en: string;
  logo_url: string | null;
  doctor_portrait_url: string | null;
  address_ar: string;
  address_en: string;
  map_query: string;
  map_directions_url: string;
  opening_hours: OpeningHoursSlot[];
};

function toDraft(row: Partial<SiteSettingsRow>): Draft {
  return {
    site_title_ar: str(row.site_title_ar),
    site_title_en: str(row.site_title_en),
    logo_url: row.logo_url ?? null,
    doctor_portrait_url: row.doctor_portrait_url ?? null,
    address_ar: str(row.address_ar),
    address_en: str(row.address_en),
    map_query: str(row.map_query),
    map_directions_url: str(row.map_directions_url),
    opening_hours: row.opening_hours ?? [],
  };
}

const emptySlot: OpeningHoursSlot = { days_ar: '', time_ar: '', days_en: '', time_en: '' };

function GeneralForm({ initial, saving, onSave }: { initial: Partial<SiteSettingsRow>; saving: boolean; onSave: (patch: Partial<SiteSettingsRow>) => Promise<boolean> }) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(initial));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));
  const dirty = JSON.stringify(draft) !== JSON.stringify(toDraft(initial));
  const setSlot = (index: number, patch: Partial<OpeningHoursSlot>) =>
    set('opening_hours', draft.opening_hours.map((slot, i) => (i === index ? { ...slot, ...patch } : slot)));

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const found: Record<string, string> = {};
    if (draft.map_directions_url.trim() && !/^https?:\/\//.test(draft.map_directions_url.trim())) found.directions = 'يجب أن يبدأ الرابط بـ https://';
    setErrors(found);
    if (Object.keys(found).length) return;

    await onSave({
      site_title_ar: nullable(draft.site_title_ar),
      site_title_en: nullable(draft.site_title_en),
      logo_url: draft.logo_url,
      doctor_portrait_url: draft.doctor_portrait_url,
      address_ar: nullable(draft.address_ar),
      address_en: nullable(draft.address_en),
      map_query: nullable(draft.map_query),
      map_directions_url: nullable(draft.map_directions_url),
      opening_hours: draft.opening_hours.filter((slot) => Object.values(slot).some((v) => v.trim())),
    });
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <Card title="هوية الموقع" description="العنوان الذي يظهر في تبويب المتصفح ونتائج البحث، والشعار وصورة الطبيب.">
        <div className="space-y-5">
          <BilingualField
            label="عنوان الموقع"
            ar={draft.site_title_ar}
            en={draft.site_title_en}
            onChange={(l, v) => set(`site_title_${l}`, v)}
            hint="يظهر في تبويب المتصفح: «اسم الصفحة | عنوان الموقع»"
          />
          <div className="grid gap-5 md:grid-cols-2">
            <MediaUpload kind="image" folder="brand" label="شعار العيادة (الهيدر والفوتر)" value={draft.logo_url} onChange={(url) => set('logo_url', url)} hint="يُفضّل PNG بخلفية شفافة، عرض 600px تقريباً." />
            <MediaUpload
              kind="image"
              folder="portrait"
              label="صورة الطبيب (قسم «كلمة الطبيب» وصورة المشاركة)"
              value={draft.doctor_portrait_url}
              onChange={(url) => set('doctor_portrait_url', url)}
              hint="PNG أو WebP مقصوصة بخلفية شفافة، حوالي 1000×1250 بكسل. صورة الواجهة (Hero) لها صفحة مستقلة."
            />
          </div>
        </div>
      </Card>

      <Card title="العنوان والخريطة">
        <div className="space-y-5">
          <BilingualField label="عنوان العيادة" ar={draft.address_ar} en={draft.address_en} onChange={(l, v) => set(`address_${l}`, v)} />
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="البحث في خرائط جوجل" hint="اسم العيادة + الشارع كما يظهر على Google Maps (لعرض الخريطة).">
              <TextInput value={draft.map_query} onChange={(e) => set('map_query', e.target.value)} />
            </Field>
            <Field label="رابط «احصل على الاتجاهات»" error={errors.directions}>
              <TextInput dir="ltr" value={draft.map_directions_url} placeholder="https://maps.app.goo.gl/…" onChange={(e) => set('map_directions_url', e.target.value)} />
            </Field>
          </div>
        </div>
      </Card>

      <Card
        title="مواعيد العمل"
        description="تظهر في الفوتر وصفحة التواصل."
        actions={
          <Button variant="outline" size="sm" icon={<Plus aria-hidden className="size-4" />} onClick={() => set('opening_hours', [...draft.opening_hours, { ...emptySlot }])}>
            إضافة موعد
          </Button>
        }
      >
        <div className="space-y-3">
          {draft.opening_hours.length === 0 && <p className="text-sm text-slate-500">لا توجد مواعيد — سيُعرض الافتراضي.</p>}
          {draft.opening_hours.map((slot, index) => (
            <div key={index} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-3 lg:flex-row lg:items-end">
              <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="الأيام (عربي)">
                  <TextInput value={slot.days_ar} onChange={(e) => setSlot(index, { days_ar: e.target.value })} placeholder="السبت – الأربعاء" />
                </Field>
                <Field label="الوقت (عربي)">
                  <TextInput value={slot.time_ar} onChange={(e) => setSlot(index, { time_ar: e.target.value })} placeholder="4:00 م – 10:00 م" />
                </Field>
                <Field label="Days (English)">
                  <TextInput dir="ltr" value={slot.days_en} onChange={(e) => setSlot(index, { days_en: e.target.value })} placeholder="Saturday – Wednesday" />
                </Field>
                <Field label="Time (English)">
                  <TextInput dir="ltr" value={slot.time_en} onChange={(e) => setSlot(index, { time_en: e.target.value })} placeholder="4:00 PM – 10:00 PM" />
                </Field>
              </div>
              <ListControls
                index={index}
                count={draft.opening_hours.length}
                onMove={(to) => set('opening_hours', moveItem(draft.opening_hours, index, to))}
                onRemove={() => set('opening_hours', draft.opening_hours.filter((_, i) => i !== index))}
              />
            </div>
          ))}
        </div>
      </Card>

      <PageActions dirty={dirty}>
        <Button type="submit" loading={saving} icon={<Save aria-hidden className="size-4" />}>
          حفظ الإعدادات
        </Button>
      </PageActions>
    </form>
  );
}

export function GeneralSettingsForm() {
  const { row, loading, error, saving, save, reload } = useSingletonRow<SiteSettingsRow>('site_settings');
  if (loading) return <LoadingBlock />;
  if (error || !row) return <ErrorNotice message={error ?? 'تعذّر التحميل.'} onRetry={() => void reload()} />;
  return <GeneralForm key={row.updated_at ?? 'new'} initial={row} saving={saving} onSave={save} />;
}
