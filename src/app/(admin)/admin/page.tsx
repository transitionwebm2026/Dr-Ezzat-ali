'use client';

import { useAuth } from '@/admin/auth/AuthProvider';
import { LoginView } from '@/admin/auth/LoginView';
import { Dashboard } from '@/admin/dashboard/Dashboard';
import { AdminShell } from '@/admin/layout/AdminShell';
import { LoadingBlock } from '@/admin/ui/primitives';

/** /admin/ — the login screen when signed out, the dashboard overview when signed in as admin. */
export default function AdminHomePage() {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <div className="grid min-h-svh place-items-center">
        <LoadingBlock label="جاري التحقق من الجلسة…" />
      </div>
    );
  }
  if (status === 'signed-out') return <LoginView />;

  return (
    <AdminShell>
      <Dashboard />
    </AdminShell>
  );
}
