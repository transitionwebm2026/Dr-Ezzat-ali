'use client';

import { ArrowLeft, Inbox, Rocket } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { adminNav } from '@/admin/layout/nav';
import { usePublish } from '@/admin/publish/PublishProvider';
import { Button, Card } from '@/admin/ui/primitives';
import { getSupabase } from '@/lib/supabase/client';

const libraryGroups = adminNav.filter((group) => group.library);
const libraries = libraryGroups.flatMap((group) => group.items);
const tableOf = (href: string) => href.split('/').filter(Boolean).pop()!;

/** Overview: content counts, new booking requests and a manual publish button. */
export function Dashboard() {
  const [counts, setCounts] = useState<Record<string, number | null>>({});
  const [newRequests, setNewRequests] = useState<number | null>(null);
  const { publishNow, status } = usePublish();

  useEffect(() => {
    const supabase = getSupabase();
    for (const item of libraries) {
      const table = tableOf(item.href);
      void supabase
        .from(table)
        .select('id', { count: 'exact', head: true })
        .then(({ count }) => setCounts((c) => ({ ...c, [table]: count ?? null })));
    }
    void supabase
      .from('consultations')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'new')
      .then(({ count }) => setNewRequests(count ?? null));
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl">أهلاً بك</h1>
        <p className="mt-1.5 text-sm text-slate-500">من هنا تدير كل محتوى موقع د. عزت علي. أي تعديل تحفظه يُنشر على الموقع تلقائياً خلال دقائق.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card title="طلبات الحجز الجديدة">
          <div className="flex items-end justify-between gap-4">
            <p className="font-heading text-5xl font-bold text-secondary-800" dir="ltr">
              {newRequests ?? '…'}
            </p>
            <Link href="/admin/consultations/" className="inline-flex items-center gap-1.5 rounded-xl bg-primary-50 px-4 py-2.5 text-sm font-bold text-primary-700 hover:bg-primary-100">
              <Inbox aria-hidden className="size-4" />
              فتح صندوق الطلبات
            </Link>
          </div>
        </Card>

        <Card title="نشر الموقع" description="يُعاد بناء الموقع ورفعه على الاستضافة تلقائياً بعد كل حفظ. استخدم الزر إن أردت النشر يدوياً.">
          <Button icon={<Rocket aria-hidden className="size-4" />} loading={status === 'publishing'} onClick={() => void publishNow()}>
            نشر الآن
          </Button>
        </Card>
      </div>

      {libraryGroups.map((group) => (
        <Card key={group.label} title={group.label}>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className="group flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-primary-200 hover:bg-primary-50/40">
                  <span className="grid size-11 place-items-center rounded-xl bg-primary-50 text-primary-600">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-heading text-sm font-bold text-secondary-800">{label}</span>
                    <span className="text-xs text-slate-500">{counts[tableOf(href)] ?? '…'} عنصر</span>
                  </span>
                  <ArrowLeft aria-hidden className="size-4 text-slate-300 transition group-hover:text-primary ltr:rotate-180" />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
