'use client';

import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@/admin/auth/AuthProvider';
import { LoadingBlock } from '@/admin/ui/primitives';
import { AdminShell } from './AdminShell';

/**
 * Route guard for every /admin/* sub-page: without an admin session the visitor is sent back to the
 * login screen at /admin/. (The static export has no server middleware — this guard is the UX layer;
 * Row Level Security in Postgres is what actually protects the data.)
 */
export function AdminPage({ title, description, actions, children }: { title: string; description?: ReactNode; actions?: ReactNode; children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'signed-out') router.replace('/admin/');
  }, [status, router]);

  if (status !== 'admin') {
    return (
      <div className="grid min-h-svh place-items-center bg-slate-50">
        <LoadingBlock label="جاري التحقق من الجلسة…" />
      </div>
    );
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl">{title}</h1>
            {description && <p className="mt-1.5 max-w-3xl text-sm text-slate-500">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
        {children}
      </div>
    </AdminShell>
  );
}
