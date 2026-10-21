'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePublish } from '@/admin/publish/PublishProvider';
import { useToast } from '@/admin/ui/Toast';
import { getSupabase } from '@/lib/supabase/client';

type SingletonTable = 'site_settings' | 'footer_settings';

/**
 * Loads / saves a single-row settings table (id = 1). `save` upserts only the fields passed in,
 * so two forms editing different columns of the same row never overwrite each other.
 */
export function useSingletonRow<T extends Record<string, unknown>>(table: SingletonTable) {
  const [row, setRow] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const { schedulePublish } = usePublish();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: loadError } = await getSupabase().from(table).select('*').eq('id', 1).maybeSingle();
    if (loadError) setError(`تعذّر تحميل البيانات: ${loadError.message}`);
    else setRow((data as T | null) ?? ({ id: 1 } as unknown as T));
    setLoading(false);
  }, [table]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = useCallback(
    async (patch: Partial<T>): Promise<boolean> => {
      setSaving(true);
      const { data, error: saveError } = await getSupabase()
        .from(table)
        .upsert({ ...patch, id: 1 }, { onConflict: 'id' })
        .select('*')
        .single();
      setSaving(false);
      if (saveError) {
        toast.error(`لم يتم الحفظ: ${saveError.message}`);
        return false;
      }
      setRow(data as T);
      toast.success('تم الحفظ — سيتم تحديث الموقع تلقائياً.');
      schedulePublish();
      return true;
    },
    [table, toast, schedulePublish],
  );

  return { row, loading, error, saving, save, reload: load };
}
