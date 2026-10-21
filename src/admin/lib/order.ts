import { getSupabase } from '@/lib/supabase/client';

type Sortable = { id: string; sort_order: number };

/** Saves the given order as sort_order 10, 20, 30… — only rows whose value changes are updated. */
export async function persistOrder(table: string, ordered: Sortable[]): Promise<string | null> {
  const supabase = getSupabase();
  const updates = ordered
    .map((row, index) => ({ id: row.id, sort_order: (index + 1) * 10, changed: row.sort_order !== (index + 1) * 10 }))
    .filter((row) => row.changed)
    .map((row) => supabase.from(table).update({ sort_order: row.sort_order }).eq('id', row.id));
  const results = await Promise.all(updates);
  const failed = results.find((result) => result.error);
  return failed?.error?.message ?? null;
}

/** sort_order for a new row appended after `rows`. */
export function nextSortOrder(rows: Sortable[]): number {
  return rows.reduce((max, row) => Math.max(max, row.sort_order), 0) + 10;
}
