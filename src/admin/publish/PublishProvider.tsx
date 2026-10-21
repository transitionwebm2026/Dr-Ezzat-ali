'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { getSupabase } from '@/lib/supabase/client';

/**
 * Publishing the static site.
 *
 * Every save schedules a publish. After a short quiet period (so a burst of edits becomes one build)
 * the dashboard calls the `publish-site` Edge Function, which checks the caller is an admin and
 * triggers the GitHub Actions workflow: pull content from Supabase → `next build` → upload to Hostinger.
 * The new pages are live ~2–4 minutes later.
 */
const QUIET_PERIOD_MS = 8000;

export type PublishStatus = 'idle' | 'scheduled' | 'publishing' | 'published' | 'error';

type PublishContextValue = {
  status: PublishStatus;
  lastPublishedAt: Date | null;
  error: string | null;
  /** Call after any successful save. */
  schedulePublish: () => void;
  publishNow: () => Promise<void>;
};

const PublishContext = createContext<PublishContextValue | null>(null);

async function describeError(error: unknown): Promise<string> {
  // FunctionsHttpError carries the Response in `context`.
  // A function that was never deployed answers 404, and the browser usually sees that as a failed (CORS) request.
  const response = (error as { context?: Response }).context;
  if (response?.status === 404 || (error as Error).name === 'FunctionsFetchError') {
    return 'خدمة النشر (publish-site) غير مُفعّلة على Supabase بعد — تعديلاتك محفوظة، لكن الموقع المنشور لن يتحدّث حتى تُفعَّل.';
  }
  if (response && typeof response.json === 'function') {
    try {
      const body = await response.json();
      if (body?.error) return String(body.error);
    } catch {
      // fall through
    }
  }
  return error instanceof Error ? error.message : 'تعذّر الاتصال بخدمة النشر.';
}

export function PublishProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<PublishStatus>('idle');
  const [lastPublishedAt, setLastPublishedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const publishNow = useCallback(async () => {
    window.clearTimeout(timer.current);
    setStatus('publishing');
    setError(null);
    const { error: invokeError } = await getSupabase().functions.invoke('publish-site', { body: { source: 'cms' } });
    if (invokeError) {
      setError(await describeError(invokeError));
      setStatus('error');
      return;
    }
    setLastPublishedAt(new Date());
    setStatus('published');
  }, []);

  const schedulePublish = useCallback(() => {
    window.clearTimeout(timer.current);
    setStatus('scheduled');
    timer.current = window.setTimeout(() => void publishNow(), QUIET_PERIOD_MS);
  }, [publishNow]);

  // Leaving the page while a publish is still pending would drop it — ask first.
  useEffect(() => {
    if (status !== 'scheduled' && status !== 'publishing') return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [status]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const value = useMemo(
    () => ({ status, lastPublishedAt, error, schedulePublish, publishNow }),
    [status, lastPublishedAt, error, schedulePublish, publishNow],
  );
  return <PublishContext.Provider value={value}>{children}</PublishContext.Provider>;
}

export function usePublish(): PublishContextValue {
  const value = useContext(PublishContext);
  if (!value) throw new Error('usePublish must be used inside <PublishProvider>');
  return value;
}
