'use client';

import { ImagePlay, RotateCcw, Save } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePublish } from '@/admin/publish/PublishProvider';
import { Badge, Button, Card, ErrorNotice, LoadingBlock, Tabs } from '@/admin/ui/primitives';
import { useToast } from '@/admin/ui/Toast';
import ar from '@/i18n/dictionaries/ar';
import en from '@/i18n/dictionaries/en';
import { cn } from '@/lib/cn';
import { getAtPath, omitPaths, resolveSection, sectionPages, sectionRegistry, type SectionDef, type SectionPage } from '@/lib/cms/sections';
import type { PageSectionRow } from '@/lib/cms/types';
import { getSupabase } from '@/lib/supabase/client';
import { ContentEditor } from './ContentEditor';

type Locale = 'ar' | 'en';
const defaults: Record<Locale, unknown> = { ar, en };

/** Sections whose picture / video is uploaded on the "hero & intro video" page, not edited here. */
function mediaNote(key: string): string | null {
  if (key.endsWith('.hero')) return 'صورة الواجهة';
  if (key === 'home.intro' || key === 'about.video') return 'الفيديو التعريفي وصورة الغلاف';
  return null;
}

type SectionFormProps = { def: SectionDef; row: PageSectionRow | undefined; onSaved: () => Promise<void>; onDirtyChange: (dirty: boolean) => void };

function SectionForm({ def, row, onSaved, onDirtyChange }: SectionFormProps) {
  const initial = useMemo(
    () => ({
      ar: resolveSection(def, getAtPath(defaults.ar, def.key), row?.content_ar),
      en: resolveSection(def, getAtPath(defaults.en, def.key), row?.content_en),
    }),
    [def, row],
  );
  const [draft, setDraft] = useState(initial);
  const [locale, setLocale] = useState<Locale>('ar');
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const { schedulePublish } = usePublish();
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);
  const media = mediaNote(def.key);

  useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange]);

  const save = async () => {
    setBusy(true);
    const { error } = await getSupabase()
      .from('page_sections')
      .upsert({ section_key: def.key, page: def.page, content_ar: omitPaths(draft.ar, def.omit), content_en: omitPaths(draft.en, def.omit) }, { onConflict: 'section_key' });
    setBusy(false);
    if (error) return toast.error(`لم يتم الحفظ: ${error.message}`);
    toast.success('تم حفظ القسم — سيتم تحديث الموقع تلقائياً.');
    schedulePublish();
    await onSaved();
  };

  const restore = async () => {
    if (!window.confirm('استعادة النصوص الأصلية لهذا القسم (بالعربية والإنجليزية)؟')) return;
    setBusy(true);
    const { error } = await getSupabase().from('page_sections').delete().eq('section_key', def.key);
    setBusy(false);
    if (error) return toast.error(`تعذّرت الاستعادة: ${error.message}`);
    toast.success('تمت استعادة النصوص الأصلية.');
    schedulePublish();
    await onSaved();
  };

  return (
    <Card
      title={def.label}
      description={dirty ? 'لديك تعديلات غير محفوظة.' : row ? `آخر تعديل: ${new Date(row.updated_at).toLocaleString('ar-EG', { numberingSystem: 'latn' })}` : 'يعرض النصوص الأصلية للموقع.'}
      actions={
        <>
          {row && (
            <Button variant="ghost" size="sm" icon={<RotateCcw aria-hidden className="size-4" />} onClick={() => void restore()} disabled={busy}>
              استعادة الأصل
            </Button>
          )}
          <Button size="sm" loading={busy} disabled={!dirty} icon={<Save aria-hidden className="size-4" />} onClick={() => void save()}>
            حفظ
          </Button>
        </>
      }
    >
      {media && (
        <p className="mb-5 flex flex-wrap items-center gap-2 rounded-xl bg-primary-50 px-4 py-3 text-sm text-secondary-700">
          <ImagePlay aria-hidden className="size-4 shrink-0 text-primary-600" />
          {media} تُرفع من صفحة
          <Link href="/admin/hero-video/" className="font-bold text-primary-700 underline underline-offset-4 hover:text-primary-800">
            صورة الواجهة والفيديو
          </Link>
        </p>
      )}
      <Tabs
        className="mb-5 w-fit"
        value={locale}
        onChange={setLocale}
        tabs={[
          { id: 'ar', label: 'العربية' },
          { id: 'en', label: 'English' },
        ]}
      />
      <div lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <ContentEditor
          key={locale}
          template={getAtPath(defaults[locale], def.key)}
          value={draft[locale]}
          onChange={(value) => setDraft((d) => ({ ...d, [locale]: value }))}
          path=""
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
          omit={def.omit ?? []}
          fixed={def.fixed ?? []}
        />
      </div>
    </Card>
  );
}

export function SectionsManager() {
  const [rows, setRows] = useState<PageSectionRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<SectionPage>('home');
  const [selected, setSelected] = useState<string>('home.hero');
  const dirty = useRef(false);
  const onDirtyChange = useCallback((value: boolean) => {
    dirty.current = value;
  }, []);
  const canLeave = () => !dirty.current || window.confirm('لديك تعديلات غير محفوظة في هذا القسم. هل تريد تركها؟');

  const load = useCallback(async () => {
    setError(null);
    const { data, error: loadError } = await getSupabase().from('page_sections').select('*');
    if (loadError) setError(`تعذّر تحميل الأقسام: ${loadError.message}`);
    else setRows(data as PageSectionRow[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (error) return <ErrorNotice message={error} onRetry={() => void load()} />;
  if (!rows) return <LoadingBlock />;

  const sections = sectionRegistry.filter((def) => def.page === page);
  const def = sectionRegistry.find((entry) => entry.key === selected) ?? sections[0];
  const row = rows.find((entry) => entry.section_key === def.key);

  const choosePage = (next: SectionPage) => {
    if (!canLeave()) return;
    setPage(next);
    setSelected(sectionRegistry.find((entry) => entry.page === next)!.key);
  };

  const chooseSection = (key: string) => {
    if (key !== def.key && canLeave()) setSelected(key);
  };

  return (
    <div className="space-y-5">
      <Tabs value={page} onChange={choosePage} tabs={sectionPages.map((p) => ({ id: p.id, label: p.label }))} />
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <nav aria-label="أقسام الصفحة" className="h-fit rounded-2xl border border-slate-200 bg-white p-2 lg:sticky lg:top-24">
          <ul className="space-y-0.5">
            {sections.map((entry) => {
              const edited = rows.some((r) => r.section_key === entry.key);
              return (
                <li key={entry.key}>
                  <button
                    type="button"
                    onClick={() => chooseSection(entry.key)}
                    aria-current={entry.key === def.key ? 'true' : undefined}
                    className={cn(
                      'flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-start text-sm font-bold transition-colors',
                      entry.key === def.key ? 'bg-primary-50 text-primary-700' : 'text-secondary-700 hover:bg-slate-50',
                    )}
                  >
                    {entry.label}
                    {edited && <Badge tone="blue">معدّل</Badge>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <SectionForm key={`${def.key}-${row?.updated_at ?? 'default'}`} def={def} row={row} onSaved={load} onDirtyChange={onDirtyChange} />
      </div>
    </div>
  );
}
