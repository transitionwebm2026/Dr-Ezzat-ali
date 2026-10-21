'use client';

import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Image from 'next/image';
import { useState, type FormEvent } from 'react';
import { Button, ErrorNotice, Field, TextInput } from '@/admin/ui/primitives';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { useAuth } from './AuthProvider';

export function LoginView() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError('أدخل البريد الإلكتروني وكلمة المرور.');
      return;
    }
    setBusy(true);
    setError(await signIn(email, password));
    setBusy(false);
  };

  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden bg-gradient-to-b from-surface-tint via-white to-white px-4 py-12">
      <div aria-hidden className="mask-radial absolute inset-0 -z-10 bg-grid" />
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image src="/images/brand/cvo-logo.png" width={640} height={450} alt="CVO — Clear Vision Clinic" className="h-16 w-auto" preload />
          <h1 className="mt-6 text-2xl">لوحة تحكم الموقع</h1>
          <p className="mt-2 text-sm text-slate-500">سجّل الدخول لإدارة محتوى موقع د. عزت علي</p>
        </div>

        <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-elevated sm:p-8">
          {!isSupabaseConfigured && (
            <ErrorNotice message="لم يتم ربط Supabase بعد: أضف NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ثم أعد البناء." />
          )}

          <Field label="البريد الإلكتروني">
            <div className="relative">
              <Mail aria-hidden className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <TextInput
                type="email"
                dir="ltr"
                autoComplete="username"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ps-10 rtl:text-right"
                required
              />
            </div>
          </Field>

          <Field label="كلمة المرور">
            <div className="relative">
              <Lock aria-hidden className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <TextInput
                type={showPassword ? 'text' : 'password'}
                dir="ltr"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pe-11 ps-10 rtl:text-right"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                className="absolute end-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                {showPassword ? <EyeOff aria-hidden className="size-4" /> : <Eye aria-hidden className="size-4" />}
              </button>
            </div>
          </Field>

          {error && <ErrorNotice message={error} />}

          <Button type="submit" loading={busy} disabled={!isSupabaseConfigured} className="w-full">
            تسجيل الدخول
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">هذه الصفحة مخصصة لإدارة الموقع فقط.</p>
      </div>
    </main>
  );
}
