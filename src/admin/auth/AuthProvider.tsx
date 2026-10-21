'use client';

import type { Session, User } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';

type Status = 'loading' | 'signed-out' | 'admin';

type AuthContextValue = {
  status: Status;
  user: User | null;
  /** Resolves to an Arabic error message, or `null` on success. */
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/** True when the signed-in user is listed in `public.admin_users` (checked by Postgres, not the browser). */
async function checkAdmin(): Promise<boolean> {
  const { data, error } = await getSupabase().rpc('is_admin');
  return !error && data === true;
}

/**
 * Admin session state. The session (access + refresh token) is persisted by supabase-js and refreshed
 * automatically. A signed-in account that is not an admin is signed out immediately.
 * Note: hiding screens here is only UX — the real guard is Row Level Security on every table.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>(isSupabaseConfigured ? 'loading' : 'signed-out');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = getSupabase();
    let active = true;

    const resolve = async (session: Session | null) => {
      if (!session) {
        if (active) {
          setUser(null);
          setStatus('signed-out');
        }
        return;
      }
      const admin = await checkAdmin();
      if (!active) return;
      if (!admin) {
        await supabase.auth.signOut({ scope: 'local' });
        setUser(null);
        setStatus('signed-out');
        return;
      }
      setUser(session.user);
      setStatus('admin');
    };

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      // supabase-js forbids awaiting other Supabase calls inside this callback, hence the deferral.
      if (event === 'INITIAL_SESSION') window.setTimeout(() => void resolve(session), 0);
      else if (event === 'SIGNED_OUT') {
        setUser(null);
        setStatus('signed-out');
      } else if (session && (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED')) setUser(session.user);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      if (error.status === 429) return 'محاولات كثيرة متتالية. انتظر بضع دقائق ثم حاول مرة أخرى.';
      return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
    }
    if (!(await checkAdmin())) {
      await supabase.auth.signOut({ scope: 'local' });
      return 'هذا الحساب غير مصرح له بالدخول إلى لوحة التحكم.';
    }
    setUser(data.user);
    setStatus('admin');
    return null;
  }, []);

  const signOut = useCallback(async () => {
    // Global scope revokes the refresh token on the server too, not just in this browser.
    await getSupabase().auth.signOut({ scope: 'global' });
    setUser(null);
    setStatus('signed-out');
  }, []);

  const value = useMemo(() => ({ status, user, signIn, signOut }), [status, user, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>');
  return value;
}
