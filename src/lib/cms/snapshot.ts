/**
 * Build-time CMS snapshot. `scripts/cms-pull.mjs` writes `src/content/cms-snapshot.json` before
 * every `dev` / `build` / `typecheck`, so pages stay fully static while their content comes from Supabase.
 * Server-only: never import this from the admin dashboard (it reads live data instead).
 */
import raw from '@/content/cms-snapshot.json';
import type { CmsData, CmsSnapshot } from './types';

const snapshot = raw as unknown as CmsSnapshot;

/** Published Supabase content, or `null` when the site is built from the repository defaults. */
export const cms: CmsData | null = snapshot.source === 'supabase' ? snapshot : null;
