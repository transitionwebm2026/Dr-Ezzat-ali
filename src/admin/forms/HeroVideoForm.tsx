'use client';

import { Save } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useSingletonRow } from '@/admin/hooks/useSingletonRow';
import { extractYoutubeId, str } from '@/admin/lib/text';
import { MediaUpload } from '@/admin/media/MediaUpload';
import { Button, Card, ErrorNotice, Field, LoadingBlock, PageActions, TextInput } from '@/admin/ui/primitives';
import type { SiteSettingsRow } from '@/lib/cms/types';

type Draft = {
  hero_image_url: string | null;
  intro_video_youtube_id: string;
  intro_video_url: string | null;
  intro_video_thumbnail_url: string | null;
};

function toDraft(row: Partial<SiteSettingsRow>): Draft {
  return {
    hero_image_url: row.hero_image_url ?? null,
    intro_video_youtube_id: str(row.intro_video_youtube_id),
    intro_video_url: row.intro_video_url ?? null,
    intro_video_thumbnail_url: row.intro_video_thumbnail_url ?? null,
  };
}

function HeroVideoFields({ initial, saving, onSave }: { initial: Partial<SiteSettingsRow>; saving: boolean; onSave: (patch: Partial<SiteSettingsRow>) => Promise<boolean> }) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(initial));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));
  const dirty = JSON.stringify(draft) !== JSON.stringify(toDraft(initial));

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const found: Record<string, string> = {};
    const youtubeId = extractYoutubeId(draft.intro_video_youtube_id);
    if (draft.intro_video_youtube_id.trim() && !youtubeId) found.youtube = 'رابط أو معرّف يوتيوب غير صحيح.';
    if (draft.intro_video_url && !draft.intro_video_thumbnail_url) found.thumb = 'صورة الغلاف إلزامية عند رفع فيديو.';
    setErrors(found);
    if (Object.keys(found).length) return;

    await onSave({
      hero_image_url: draft.hero_image_url,
      intro_video_youtube_id: youtubeId,
      intro_video_url: draft.intro_video_url,
      intro_video_thumbnail_url: draft.intro_video_thumbnail_url,
    });
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <Card title="صورة الواجهة (Hero)" description="الصورة الكبيرة في أعلى كل صفحات الموقع، بجوار العنوان الرئيسي.">
        <div className="max-w-md">
          <MediaUpload
            kind="image"
            folder="hero"
            label="صورة الواجهة"
            value={draft.hero_image_url}
            onChange={(url) => set('hero_image_url', url)}
            hint="PNG أو WebP مقصوصة بخلفية شفافة، حوالي 1000×1250 بكسل. إن تُركت فارغة تُستخدم صورة الطبيب."
          />
        </div>
      </Card>

      <Card
        title="الفيديو التعريفي"
        description="فيديو واحد يظهر في الصفحة الرئيسية (قسم التعريف) وفي صفحة «عن الطبيب». ضع رابط يوتيوب أو ارفع ملف فيديو من جهازك — عند وجود الاثنين يُستخدم يوتيوب."
      >
        <div className="space-y-5">
          <Field label="رابط أو معرّف فيديو يوتيوب" error={errors.youtube}>
            <TextInput dir="ltr" value={draft.intro_video_youtube_id} placeholder="https://youtu.be/…" onChange={(e) => set('intro_video_youtube_id', e.target.value)} />
          </Field>
          <div className="grid gap-5 md:grid-cols-2">
            <MediaUpload
              kind="video"
              folder="intro-video"
              label="ملف الفيديو"
              value={draft.intro_video_url}
              poster={draft.intro_video_thumbnail_url}
              onChange={(url) => set('intro_video_url', url)}
            />
            <MediaUpload
              kind="image"
              folder="intro-video"
              label="صورة الغلاف (Thumbnail)"
              required={Boolean(draft.intro_video_url)}
              error={errors.thumb}
              value={draft.intro_video_thumbnail_url}
              onChange={(url) => set('intro_video_thumbnail_url', url)}
              hint="تظهر في الصفحتين قبل تشغيل الفيديو. 16:9 — مثلاً 1600×900 بكسل، واترك المهم في المنتصف (تُقصّ الحواف العلوية والسفلية قليلاً في صفحة «عن الطبيب»). بدونها يظهر غلاف تلقائي بصورة الطبيب."
            />
          </div>
        </div>
      </Card>

      <PageActions dirty={dirty}>
        <Button type="submit" loading={saving} icon={<Save aria-hidden className="size-4" />}>
          حفظ
        </Button>
      </PageActions>
    </form>
  );
}

export function HeroVideoForm() {
  const { row, loading, error, saving, save, reload } = useSingletonRow<SiteSettingsRow>('site_settings');
  if (loading) return <LoadingBlock />;
  if (error || !row) return <ErrorNotice message={error ?? 'تعذّر التحميل.'} onRetry={() => void reload()} />;
  return <HeroVideoFields key={row.updated_at ?? 'new'} initial={row} saving={saving} onSave={save} />;
}
