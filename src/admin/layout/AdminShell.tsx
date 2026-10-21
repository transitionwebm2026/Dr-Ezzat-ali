'use client';

import { CircleAlert, CircleCheck, ExternalLink, LoaderCircle, LogOut, Menu, Rocket, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '@/admin/auth/AuthProvider';
import { usePublish } from '@/admin/publish/PublishProvider';
import { Button } from '@/admin/ui/primitives';
import { cn } from '@/lib/cn';
import { adminNav } from './nav';

function normalize(path: string) {
  return path.endsWith('/') ? path : `${path}/`;
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = normalize(usePathname() || '/admin/');
  return (
    <nav aria-label="أقسام لوحة التحكم" className="space-y-6 p-4">
      {adminNav.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-3 text-[0.7rem] font-bold uppercase tracking-wide text-secondary-200/60">{group.label}</p>
          <ul className="space-y-0.5">
            {group.items.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 font-heading text-sm font-bold transition-colors',
                      active ? 'bg-white text-secondary-800 shadow-sm' : 'text-secondary-100/80 hover:bg-white/10 hover:text-white',
                    )}
                  >
                    <Icon aria-hidden className={cn('size-[1.1rem] shrink-0', active ? 'text-primary' : 'text-primary-200')} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function PublishIndicator() {
  const { status, error, lastPublishedAt, publishNow } = usePublish();
  const time = lastPublishedAt?.toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit', numberingSystem: 'latn' });

  const state = {
    idle: { icon: null, text: 'كل التعديلات المحفوظة تُنشر تلقائياً', tone: 'text-slate-500' },
    scheduled: { icon: <LoaderCircle aria-hidden className="size-4 animate-spin" />, text: 'سيتم النشر بعد لحظات…', tone: 'text-amber-600' },
    publishing: { icon: <LoaderCircle aria-hidden className="size-4 animate-spin" />, text: 'جاري إرسال طلب النشر…', tone: 'text-primary-700' },
    published: { icon: <CircleCheck aria-hidden className="size-4" />, text: `بدأ النشر ${time ?? ''} — يظهر على الموقع خلال 2–4 دقائق`, tone: 'text-emerald-700' },
    error: { icon: <CircleAlert aria-hidden className="size-4" />, text: `فشل النشر: ${error ?? ''}`, tone: 'text-rose-600' },
  }[status];

  return (
    <div className="flex min-w-0 items-center gap-3">
      <p role="status" title={state.text} className={cn('hidden min-w-0 items-center gap-1.5 truncate text-xs font-bold md:flex', state.tone)}>
        {state.icon}
        <span className="truncate">{state.text}</span>
      </p>
      <Button size="sm" variant="secondary" icon={<Rocket aria-hidden className="size-4" />} loading={status === 'publishing'} onClick={() => void publishNow()}>
        نشر الآن
      </Button>
    </div>
  );
}

/** Responsive dashboard frame: fixed sidebar on desktop, slide-over drawer on mobile, top bar with publish + sign-out. */
export function AdminShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => setDrawerOpen(false), [pathname]);

  const onSignOut = async () => {
    await signOut();
    router.replace('/admin/');
  };

  const brand = (
    <div className="flex items-center gap-3 border-b border-white/10 p-4">
      <span className="rounded-xl bg-white p-1.5">
        <Image src="/images/brand/cvo-mark.png" width={320} height={128} alt="" className="h-6 w-auto" />
      </span>
      <span className="leading-tight">
        <span className="block font-heading text-sm font-bold text-white">د. عزت علي</span>
        <span className="block text-[0.7rem] text-secondary-100/70">إدارة محتوى الموقع</span>
      </span>
    </div>
  );

  return (
    <div className="min-h-svh bg-slate-50 lg:ps-72">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 start-0 z-30 hidden w-72 overflow-y-auto bg-navy-gradient lg:block">
        {brand}
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="القائمة">
          <button type="button" aria-label="إغلاق القائمة" className="absolute inset-0 bg-secondary-950/50" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute inset-y-0 start-0 w-[min(85vw,300px)] overflow-y-auto bg-navy-gradient shadow-elevated">
            <div className="flex items-center justify-between">
              {brand}
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label="إغلاق القائمة" className="me-3 grid size-9 place-items-center rounded-lg text-white hover:bg-white/10">
                <X aria-hidden className="size-5" />
              </button>
            </div>
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="فتح القائمة"
            className="grid size-10 place-items-center rounded-xl text-secondary-700 hover:bg-slate-100 lg:hidden"
          >
            <Menu aria-hidden className="size-5" />
          </button>
          <PublishIndicator />
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-secondary-600 hover:bg-slate-100 sm:inline-flex"
          >
            <ExternalLink aria-hidden className="size-4" />
            عرض الموقع
          </a>
          <span className="hidden max-w-48 truncate text-xs text-slate-400 xl:block" dir="ltr">
            {user?.email}
          </span>
          <Button variant="outline" size="sm" icon={<LogOut aria-hidden className="size-4 rtl:-scale-x-100" />} onClick={() => void onSignOut()}>
            تسجيل الخروج
          </Button>
        </div>
      </header>

      <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}
