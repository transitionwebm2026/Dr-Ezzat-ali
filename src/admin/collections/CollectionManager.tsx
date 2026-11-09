'use client';

import { ArrowLeft, Image as ImageIcon, Pencil, Plus } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { persistOrder } from '@/admin/lib/order';
import { AdminPage } from '@/admin/layout/AdminPage';
import { usePublish } from '@/admin/publish/PublishProvider';
import { ListControls, moveItem } from '@/admin/ui/ListControls';
import { Badge, Button, ErrorNotice, IconButton, LoadingBlock, Tabs } from '@/admin/ui/primitives';
import { useToast } from '@/admin/ui/Toast';
import { cn } from '@/lib/cn';
import { getSupabase } from '@/lib/supabase/client';
import { collections, type CollectionKey, type Row } from './configs';
import { RecordEditor } from './RecordEditor';

type Saved = Row & { id: string; sort_order: number };

/** List + editor for one content library (surgeries, reviews, videos…), driven by its config. */
export function CollectionManager({ collection }: { collection: CollectionKey }) {
  const config = collections[collection];
  const [rows, setRows] = useState<Saved[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [group, setGroup] = useState(config.groupBy?.options[0].value ?? '');
  const [editing, setEditing] = useState<Row | null>(null);
  const toast = useToast();
  const { schedulePublish } = usePublish();

  const load = useCallback(async () => {
    setError(null);
    const { data, error: loadError } = await getSupabase().from(config.table).select('*').order('sort_order').order('created_at');
    if (loadError?.code === 'PGRST205' || loadError?.code === '42P01')
      setError(`جدول «${config.table}» غير موجود بعد في قاعدة البيانات — شغّل ملف الـ migration الخاص به من مجلد supabase/migrations في Supabase → SQL Editor ثم أعد المحاولة.`);
    else if (loadError) setError(`تعذّر تحميل البيانات: ${loadError.message}`);
    else setRows(data as Saved[]);
  }, [config.table]);

  useEffect(() => {
    void load();
  }, [load]);

  // Deep link to one tab, e.g. /admin/faqs/?group=services_before
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('group');
    if (requested && config.groupBy?.options.some((option) => option.value === requested)) setGroup(requested);
  }, [config.groupBy]);

  const visible = (rows ?? []).filter((row) => !config.groupBy || row[config.groupBy.name] === group);

  const afterChange = async (message: string) => {
    toast.success(message);
    schedulePublish();
    await load();
  };

  const move = async (from: number, to: number) => {
    const failed = await persistOrder(config.table, moveItem(visible, from, to));
    if (failed) toast.error(`لم يتم تغيير الترتيب: ${failed}`);
    else await afterChange('تم تغيير الترتيب.');
  };

  const toggleFlag = async (row: Saved, flag: string) => {
    const { error: updateError } = await getSupabase().from(config.table).update({ [flag]: !row[flag] }).eq('id', row.id);
    if (updateError) toast.error(`لم يتم التحديث: ${updateError.message}`);
    else await afterChange('تم التحديث.');
  };

  const remove = async (row: Saved) => {
    if (!window.confirm(`حذف «${config.summary(row).title}» نهائياً؟`)) return;
    const { error: deleteError } = await getSupabase().from(config.table).delete().eq('id', row.id);
    if (deleteError) toast.error(`لم يتم الحذف: ${deleteError.message}`);
    else await afterChange('تم الحذف.');
  };

  const create = () => setEditing({ ...config.defaults, ...(config.groupBy ? { [config.groupBy.name]: group } : {}) });

  return (
    <AdminPage
      title={config.title}
      description={config.description}
      actions={
        <Button icon={<Plus aria-hidden className="size-4" />} onClick={create} disabled={!rows}>
          إضافة {config.singular}
        </Button>
      }
    >
      {config.related && (
        <nav aria-label="صفحات مرتبطة" className="mb-5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500">صفحات مرتبطة:</span>
          {config.related.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-secondary-700 transition hover:border-primary-200 hover:text-primary-700"
            >
              {link.label}
              <ArrowLeft aria-hidden className="size-3.5 ltr:rotate-180" />
            </Link>
          ))}
        </nav>
      )}

      {config.groupBy && (
        <Tabs
          className="mb-5 w-fit"
          value={group}
          onChange={setGroup}
          tabs={config.groupBy.options.map((option) => ({
            id: option.value,
            label: `${option.label} (${(rows ?? []).filter((row) => row[config.groupBy!.name] === option.value).length})`,
          }))}
        />
      )}

      {error ? (
        <ErrorNotice message={error} onRetry={() => void load()} />
      ) : !rows ? (
        <LoadingBlock />
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white px-6 py-14 text-center">
          <p className="text-sm text-slate-500">لا توجد عناصر بعد.</p>
          <Button className="mt-4" variant="outline" icon={<Plus aria-hidden className="size-4" />} onClick={create}>
            إضافة {config.singular}
          </Button>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {visible.map((row, index) => {
            const summary = config.summary(row);
            return (
              <li key={row.id} className={cn('flex flex-col gap-3 rounded-2xl border bg-white p-3 shadow-sm sm:flex-row sm:items-center', row.is_published === false ? 'border-dashed border-slate-300' : 'border-slate-200')}>
                <button type="button" onClick={() => setEditing(row)} className="flex min-w-0 flex-1 items-center gap-3 text-start">
                  <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-100 text-slate-300">
                    {summary.image ? <img src={summary.image} alt="" className="size-full object-cover" /> : <ImageIcon aria-hidden className="size-6" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-heading text-sm font-bold text-secondary-800">{summary.title || '—'}</span>
                    {summary.subtitle && <span className="mt-0.5 line-clamp-2 text-xs text-slate-500">{summary.subtitle}</span>}
                  </span>
                </button>
                <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-end">
                  <div className="flex flex-wrap gap-1.5">
                    {config.flags.map((flag) => {
                      const on = Boolean(row[flag.name]);
                      if (!on && !flag.offLabel && flag.name !== 'is_featured_on_home') return null;
                      return (
                        <button
                          key={flag.name}
                          type="button"
                          onClick={() => void toggleFlag(row, flag.name)}
                          title="اضغط للتبديل"
                          aria-pressed={on}
                          className="rounded-full transition hover:opacity-80"
                        >
                          <Badge tone={on ? flag.tone : 'slate'}>{on ? flag.label : (flag.offLabel ?? `ليس ${flag.label}`)}</Badge>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center">
                    <IconButton label="تعديل" onClick={() => setEditing(row)}>
                      <Pencil aria-hidden className="size-4" />
                    </IconButton>
                    <ListControls index={index} count={visible.length} onMove={(to) => void move(index, to)} onRemove={() => void remove(row)} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {editing && (
        <RecordEditor
          key={String(editing.id ?? 'new')}
          config={config}
          initial={editing}
          siblings={visible}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            void load();
          }}
        />
      )}
    </AdminPage>
  );
}
