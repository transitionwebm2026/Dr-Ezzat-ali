'use client';

import { Plus, Save } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useSingletonRow } from '@/admin/hooks/useSingletonRow';
import { nullable, str } from '@/admin/lib/text';
import { isValidLinkPath, LinkPathInput } from '@/admin/ui/LinkPathInput';
import { ListControls, moveItem } from '@/admin/ui/ListControls';
import { BilingualField, Button, Card, ErrorNotice, Field, LoadingBlock, PageActions, TextInput, Toggle } from '@/admin/ui/primitives';
import { BrandIcon, brandLabels } from '@/components/icons/BrandIcon';
import { normalizePath } from '@/lib/cms/paths';
import { socialNetworks, type FooterSettingsRow, type QuickLink, type SiteSettingsRow, type SocialNetwork } from '@/lib/cms/types';

type Draft = {
  about_ar: string;
  about_en: string;
  copyright_ar: string;
  copyright_en: string;
  show_specialties: boolean;
  quick_links: QuickLink[];
  social_visibility: Record<SocialNetwork, boolean>;
  social_links: Record<SocialNetwork, string>;
};

function toDraft(footer: Partial<FooterSettingsRow>, settings: Partial<SiteSettingsRow>): Draft {
  return {
    about_ar: str(footer.about_ar),
    about_en: str(footer.about_en),
    copyright_ar: str(footer.copyright_ar),
    copyright_en: str(footer.copyright_en),
    show_specialties: footer.show_specialties ?? true,
    quick_links: footer.quick_links ?? [],
    social_visibility: Object.fromEntries(socialNetworks.map((n) => [n, footer.social_visibility?.[n] !== false])) as Record<SocialNetwork, boolean>,
    social_links: Object.fromEntries(socialNetworks.map((n) => [n, str(settings.social_links?.[n])])) as Record<SocialNetwork, string>,
  };
}

type FormProps = {
  footer: Partial<FooterSettingsRow>;
  settings: Partial<SiteSettingsRow>;
  saving: boolean;
  onSave: (footer: Partial<FooterSettingsRow>, settings: Partial<SiteSettingsRow>) => Promise<void>;
};

function Form({ footer, settings, saving, onSave }: FormProps) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(footer, settings));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));
  const setLink = (index: number, patch: Partial<QuickLink>) => set('quick_links', draft.quick_links.map((link, i) => (i === index ? { ...link, ...patch } : link)));

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const found: Record<string, string> = {};
    draft.quick_links.forEach((link, index) => {
      if (!link.label_ar.trim() || !link.label_en.trim()) found[`link-${index}`] = 'اكتب اسم الرابط بالعربية والإنجليزية.';
      else if (!isValidLinkPath(link.path)) found[`link-${index}`] = 'رابط غير صحيح.';
    });
    for (const network of socialNetworks) {
      const url = draft.social_links[network].trim();
      if (url && !/^https:\/\//.test(url)) found[`social-${network}`] = 'يجب أن يبدأ الرابط بـ https://';
    }
    setErrors(found);
    if (Object.keys(found).length) return;

    await onSave(
      {
        about_ar: nullable(draft.about_ar),
        about_en: nullable(draft.about_en),
        copyright_ar: nullable(draft.copyright_ar),
        copyright_en: nullable(draft.copyright_en),
        show_specialties: draft.show_specialties,
        quick_links: draft.quick_links.map((link) => ({ label_ar: link.label_ar.trim(), label_en: link.label_en.trim(), path: normalizePath(link.path) })),
        social_visibility: draft.social_visibility,
      },
      { social_links: Object.fromEntries(socialNetworks.map((n) => [n, draft.social_links[n].trim()]).filter(([, url]) => url)) },
    );
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <Card title="نصوص الفوتر">
        <div className="space-y-5">
          <BilingualField label="نبذة عن العيادة" multiline rows={3} ar={draft.about_ar} en={draft.about_en} onChange={(l, v) => set(`about_${l}`, v)} />
          <BilingualField
            label="نص حقوق النشر"
            ar={draft.copyright_ar}
            en={draft.copyright_en}
            onChange={(l, v) => set(`copyright_${l}`, v)}
            hint="يظهر بعد «© السنة اسم الطبيب.» — مثال: جميع الحقوق محفوظة."
          />
          <Toggle checked={draft.show_specialties} onChange={(v) => set('show_specialties', v)} label="إظهار عمود «التخصصات» في الفوتر" />
        </div>
      </Card>

      <Card
        title="الروابط السريعة"
        description="إن تركتها فارغة يعرض الفوتر نفس صفحات القائمة الرئيسية."
        actions={
          <Button variant="outline" size="sm" icon={<Plus aria-hidden className="size-4" />} onClick={() => set('quick_links', [...draft.quick_links, { label_ar: '', label_en: '', path: '/' }])}>
            إضافة رابط
          </Button>
        }
      >
        <div className="space-y-3">
          {draft.quick_links.map((link, index) => (
            <div key={index} className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-3">
                  <BilingualField label="اسم الرابط" ar={link.label_ar} en={link.label_en} onChange={(l, v) => setLink(index, { [`label_${l}`]: v })} />
                  <LinkPathInput value={link.path} onChange={(path) => setLink(index, { path })} error={errors[`link-${index}`]} />
                </div>
                <ListControls
                  index={index}
                  count={draft.quick_links.length}
                  onMove={(to) => set('quick_links', moveItem(draft.quick_links, index, to))}
                  onRemove={() => set('quick_links', draft.quick_links.filter((_, i) => i !== index))}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="روابط التواصل الاجتماعي" description="الروابط تظهر في الفوتر وفي شريط «تابعنا» بكل صفحة. اترك الرابط فارغاً لإخفاء الشبكة من الموقع كله.">
        <div className="space-y-3">
          {socialNetworks.map((network) => (
            <div key={network} className="grid items-end gap-3 rounded-xl border border-slate-200 p-3 md:grid-cols-[1fr_auto]">
              <Field
                label={
                  <span className="inline-flex items-center gap-2">
                    <BrandIcon name={network} className="size-4 text-secondary-600" />
                    {brandLabels[network]}
                  </span>
                }
                error={errors[`social-${network}`]}
              >
                <TextInput dir="ltr" placeholder="https://" value={draft.social_links[network]} onChange={(e) => set('social_links', { ...draft.social_links, [network]: e.target.value })} />
              </Field>
              <Toggle
                checked={draft.social_visibility[network]}
                onChange={(v) => set('social_visibility', { ...draft.social_visibility, [network]: v })}
                label="إظهار في الفوتر"
              />
            </div>
          ))}
        </div>
      </Card>

      <PageActions>
        <Button type="submit" loading={saving} icon={<Save aria-hidden className="size-4" />}>
          حفظ الفوتر
        </Button>
      </PageActions>
    </form>
  );
}

export function FooterForm() {
  const footer = useSingletonRow<FooterSettingsRow>('footer_settings');
  const settings = useSingletonRow<SiteSettingsRow>('site_settings');

  if (footer.loading || settings.loading) return <LoadingBlock />;
  const error = footer.error ?? settings.error;
  if (error || !footer.row || !settings.row) {
    return (
      <ErrorNotice
        message={error ?? 'تعذّر التحميل.'}
        onRetry={() => {
          void footer.reload();
          void settings.reload();
        }}
      />
    );
  }

  const onSave = async (footerPatch: Partial<FooterSettingsRow>, settingsPatch: Partial<SiteSettingsRow>) => {
    if (await footer.save(footerPatch)) await settings.save(settingsPatch);
  };

  return (
    <Form
      key={`${footer.row.updated_at}-${settings.row.updated_at}`}
      footer={footer.row}
      settings={settings.row}
      saving={footer.saving || settings.saving}
      onSave={onSave}
    />
  );
}
