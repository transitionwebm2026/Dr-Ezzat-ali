'use client';

import { ExternalLink, Phone, Save } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useSingletonRow } from '@/admin/hooks/useSingletonRow';
import { latinDigits, nullable, str } from '@/admin/lib/text';
import { BilingualField, Button, Card, ErrorNotice, Field, LoadingBlock, PageActions, TextInput } from '@/admin/ui/primitives';
import { BrandIcon } from '@/components/icons/BrandIcon';
import type { SiteSettingsRow } from '@/lib/cms/types';

type Draft = {
  phone: string;
  phone_display: string;
  secondary_phone: string;
  whatsapp_number: string;
  email: string;
  emergency_phone: string;
  emergency_note_ar: string;
  emergency_note_en: string;
};

const fields: (keyof Draft)[] = [
  'phone',
  'phone_display',
  'secondary_phone',
  'whatsapp_number',
  'email',
  'emergency_phone',
  'emergency_note_ar',
  'emergency_note_en',
];

/** "+20 100-000 0000" → "+201000000000" (the format used for tel: links). */
function normalizePhone(value: string): string {
  const cleaned = latinDigits(value).replace(/[^\d+]/g, '');
  return cleaned.startsWith('00') ? `+${cleaned.slice(2)}` : cleaned;
}

/** WhatsApp wants digits only, international format, no "+" / "00". */
function normalizeWhatsapp(value: string): string {
  return latinDigits(value).replace(/\D/g, '').replace(/^00/, '');
}

function ContactForm({ initial, saving, onSave }: { initial: Partial<SiteSettingsRow>; saving: boolean; onSave: (patch: Partial<SiteSettingsRow>) => Promise<boolean> }) {
  const [draft, setDraft] = useState<Draft>(() => Object.fromEntries(fields.map((key) => [key, str(initial[key])])) as Draft);
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({});
  const set = (key: keyof Draft, value: string) => setDraft((d) => ({ ...d, [key]: value }));

  const phone = normalizePhone(draft.phone);
  const whatsapp = normalizeWhatsapp(draft.whatsapp_number);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const found: typeof errors = {};
    if (!/^\+?\d{6,15}$/.test(phone)) found.phone = 'رقم غير صحيح. مثال: ‎+201001234567';
    if (!/^\d{8,15}$/.test(whatsapp)) found.whatsapp_number = 'أرقام فقط بالصيغة الدولية بدون + أو 00. مثال: 201001234567';
    if (draft.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) found.email = 'بريد إلكتروني غير صحيح.';
    setErrors(found);
    if (Object.keys(found).length) return;

    await onSave({
      phone,
      phone_display: nullable(draft.phone_display) ?? phone,
      secondary_phone: nullable(latinDigits(draft.secondary_phone)),
      whatsapp_number: whatsapp,
      email: nullable(draft.email),
      emergency_phone: nullable(latinDigits(draft.emergency_phone)),
      emergency_note_ar: nullable(draft.emergency_note_ar),
      emergency_note_en: nullable(draft.emergency_note_en),
    });
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card title="الهاتف الرئيسي" description="يُستخدم في الهيدر، شريط التواصل أسفل كل واجهة، صفحة التواصل، الفوتر وزر الاتصال العائم.">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="رقم الاتصال" required error={errors.phone} hint="بالصيغة الدولية، مثال: ‎+201001234567">
                <TextInput dir="ltr" inputMode="tel" value={draft.phone} invalid={Boolean(errors.phone)} onChange={(e) => set('phone', e.target.value)} />
              </Field>
              <Field label="طريقة عرض الرقم" hint="كما سيظهر للزائر، مثال: ‎+20 100 123 4567">
                <TextInput dir="ltr" value={draft.phone_display} onChange={(e) => set('phone_display', e.target.value)} />
              </Field>
              <Field label="رقم إضافي (اختياري)" hint="يظهر في صفحة التواصل تحت الرقم الرئيسي.">
                <TextInput dir="ltr" inputMode="tel" value={draft.secondary_phone} onChange={(e) => set('secondary_phone', e.target.value)} />
              </Field>
              <Field label="البريد الإلكتروني" error={errors.email}>
                <TextInput dir="ltr" type="email" value={draft.email} invalid={Boolean(errors.email)} onChange={(e) => set('email', e.target.value)} />
              </Field>
            </div>
          </Card>

          <Card title="واتساب" description="يُستخدم في زر واتساب العائم، أزرار «راسلنا على واتساب»، ونموذج الحجز.">
            <Field label="رقم واتساب" required error={errors.whatsapp_number} hint="أرقام فقط بالصيغة الدولية بدون + أو 00، مثال: 201001234567">
              <TextInput dir="ltr" inputMode="numeric" value={draft.whatsapp_number} invalid={Boolean(errors.whatsapp_number)} onChange={(e) => set('whatsapp_number', e.target.value)} />
            </Field>
            {whatsapp && (
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 hover:underline">
                <ExternalLink aria-hidden className="size-3.5" />
                اختبار الرابط: wa.me/{whatsapp}
              </a>
            )}
          </Card>

          <Card title="تواصل الطوارئ" description="اختياري — يظهر في صفحة التواصل عند إدخال رقم.">
            <div className="space-y-5">
              <Field label="رقم الطوارئ">
                <TextInput dir="ltr" inputMode="tel" value={draft.emergency_phone} onChange={(e) => set('emergency_phone', e.target.value)} />
              </Field>
              <BilingualField
                label="ملاحظة الطوارئ"
                ar={draft.emergency_note_ar}
                en={draft.emergency_note_en}
                onChange={(l, v) => set(`emergency_note_${l}`, v)}
                hint="مثال: متاح على مدار 24 ساعة للحالات الطارئة بعد العمليات."
              />
            </div>
          </Card>
        </div>

        <Card title="معاينة الأزرار العائمة" description="أسفل يسار كل صفحة." className="h-fit xl:sticky xl:top-24">
          <div className="relative h-56 overflow-hidden rounded-2xl bg-gradient-to-b from-surface-tint to-white ring-1 ring-slate-200">
            <div dir="ltr" className="absolute bottom-4 left-4 flex flex-col gap-3">
              <a href={whatsapp ? `https://wa.me/${whatsapp}` : undefined} target="_blank" rel="noopener noreferrer" aria-label="واتساب" className="grid size-12 place-items-center rounded-full bg-whatsapp text-white shadow-whatsapp">
                <BrandIcon name="whatsapp" className="size-6" />
              </a>
              <a href={phone ? `tel:${phone}` : undefined} aria-label="اتصال" className="grid size-12 place-items-center rounded-full bg-brand-gradient text-white shadow-glow ring-4 ring-white/70">
                <Phone aria-hidden className="size-5" />
              </a>
            </div>
            <dl className="absolute end-4 top-4 space-y-2 text-xs">
              <div>
                <dt className="text-slate-500">اتصال</dt>
                <dd dir="ltr" className="font-heading font-bold text-secondary-700">{draft.phone_display || phone || '—'}</dd>
              </div>
              <div>
                <dt className="text-slate-500">واتساب</dt>
                <dd dir="ltr" className="font-heading font-bold text-secondary-700">{whatsapp || '—'}</dd>
              </div>
            </dl>
          </div>
        </Card>
      </div>

      <PageActions>
        <Button type="submit" loading={saving} icon={<Save aria-hidden className="size-4" />}>
          حفظ بيانات التواصل
        </Button>
      </PageActions>
    </form>
  );
}

export function ContactSettingsForm() {
  const { row, loading, error, saving, save, reload } = useSingletonRow<SiteSettingsRow>('site_settings');
  if (loading) return <LoadingBlock />;
  if (error || !row) return <ErrorNotice message={error ?? 'تعذّر التحميل.'} onRetry={() => void reload()} />;
  return <ContactForm key={row.updated_at ?? 'new'} initial={row} saving={saving} onSave={save} />;
}
