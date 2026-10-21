'use client';

import { CalendarDays, Phone, RefreshCw, Trash } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Badge, Button, ErrorNotice, IconButton, LoadingBlock, Select, Tabs } from '@/admin/ui/primitives';
import { useToast } from '@/admin/ui/Toast';
import { BrandIcon } from '@/components/icons/BrandIcon';
import { consultationStatuses, type ConsultationRow, type ConsultationStatus } from '@/lib/cms/types';
import { getSupabase } from '@/lib/supabase/client';

export const statusLabels: Record<ConsultationStatus, string> = {
  new: 'جديد',
  contacted: 'تم التواصل',
  booked: 'تم الحجز',
  completed: 'تم الكشف',
  cancelled: 'ملغي',
};

const statusTones: Record<ConsultationStatus, 'blue' | 'amber' | 'green' | 'slate' | 'rose'> = {
  new: 'blue',
  contacted: 'amber',
  booked: 'green',
  completed: 'slate',
  cancelled: 'rose',
};

type Filter = 'all' | ConsultationStatus;

const PAGE_SIZE = 50;

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short', numberingSystem: 'latn' });
}

/** Booking requests submitted from the contact form (consultations are private: admins only, never published). */
export function ConsultationsInbox() {
  const [rows, setRows] = useState<ConsultationRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('new');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const toast = useToast();

  const load = useCallback(async () => {
    setError(null);
    let query = getSupabase().from('consultations').select('*').order('created_at', { ascending: false }).limit(limit);
    if (filter !== 'all') query = query.eq('status', filter);
    const { data, error: loadError } = await query;
    if (loadError) setError(`تعذّر تحميل الطلبات: ${loadError.message}`);
    else setRows(data as ConsultationRow[]);
  }, [filter, limit]);

  useEffect(() => {
    void load();
  }, [load]);

  const setStatus = async (row: ConsultationRow, status: ConsultationStatus) => {
    const { error: updateError } = await getSupabase().from('consultations').update({ status }).eq('id', row.id);
    if (updateError) return toast.error(`لم يتم التحديث: ${updateError.message}`);
    toast.success(`الحالة الآن: ${statusLabels[status]}`);
    await load();
  };

  const remove = async (row: ConsultationRow) => {
    if (!window.confirm(`حذف طلب «${row.patient_name}» نهائياً؟`)) return;
    const { error: deleteError } = await getSupabase().from('consultations').delete().eq('id', row.id);
    if (deleteError) return toast.error(`لم يتم الحذف: ${deleteError.message}`);
    toast.success('تم حذف الطلب.');
    await load();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs<Filter>
          value={filter}
          onChange={(value) => {
            setFilter(value);
            setLimit(PAGE_SIZE);
          }}
          tabs={[{ id: 'all', label: 'الكل' }, ...consultationStatuses.map((status) => ({ id: status, label: statusLabels[status] }))]}
        />
        <Button variant="outline" size="sm" icon={<RefreshCw aria-hidden className="size-4" />} onClick={() => void load()}>
          تحديث
        </Button>
      </div>

      {error ? (
        <ErrorNotice message={error} onRetry={() => void load()} />
      ) : !rows ? (
        <LoadingBlock />
      ) : rows.length === 0 ? (
        <p className="rounded-2xl border-2 border-dashed border-slate-200 bg-white px-6 py-14 text-center text-sm text-slate-500">لا توجد طلبات هنا.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => {
            const phoneDigits = row.phone.replace(/\D/g, '');
            // Egyptian local numbers (01xxxxxxxxx) → international for WhatsApp.
            const whatsapp = phoneDigits.startsWith('0') && phoneDigits.length === 11 ? `20${phoneDigits.slice(1)}` : phoneDigits;
            return (
              <li key={row.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 font-heading text-base font-bold text-secondary-800">
                      {row.patient_name}
                      <Badge tone={statusTones[row.status]}>{statusLabels[row.status]}</Badge>
                      {row.locale === 'en' && <Badge>English</Badge>}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">وصل في {formatDateTime(row.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select aria-label="حالة الطلب" value={row.status} onChange={(e) => void setStatus(row, e.target.value as ConsultationStatus)} className="w-40 py-2">
                      {consultationStatuses.map((status) => (
                        <option key={status} value={status}>
                          {statusLabels[status]}
                        </option>
                      ))}
                    </Select>
                    <IconButton label="حذف الطلب" onClick={() => void remove(row)} className="hover:bg-rose-50 hover:text-rose-600">
                      <Trash aria-hidden className="size-4" />
                    </IconButton>
                  </div>
                </div>

                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-xs text-slate-500">الهاتف</dt>
                    <dd className="mt-1 flex flex-wrap items-center gap-2">
                      <a href={`tel:${row.phone.replace(/[^\d+]/g, '')}`} dir="ltr" className="inline-flex items-center gap-1 font-bold text-secondary-700 hover:text-primary-600">
                        <Phone aria-hidden className="size-3.5" />
                        {row.phone}
                      </a>
                      <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="مراسلة على واتساب" className="text-whatsapp-dark hover:text-whatsapp">
                        <BrandIcon name="whatsapp" className="size-4" />
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">التاريخ المفضل</dt>
                    <dd className="mt-1 inline-flex items-center gap-1 font-bold text-secondary-700">
                      <CalendarDays aria-hidden className="size-3.5" />
                      {row.preferred_date ?? '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">نوع الاستشارة</dt>
                    <dd className="mt-1 font-bold text-secondary-700">{row.consultation_type ?? '—'}</dd>
                  </div>
                </dl>
                {row.notes && <p className="mt-3 whitespace-pre-line rounded-xl bg-slate-50 p-3 text-sm text-slate-600">{row.notes}</p>}
              </li>
            );
          })}
        </ul>
      )}

      {rows && rows.length === limit && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => setLimit((n) => n + PAGE_SIZE)}>
            عرض المزيد
          </Button>
        </div>
      )}
    </div>
  );
}
