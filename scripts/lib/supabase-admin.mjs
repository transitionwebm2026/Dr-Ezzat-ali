/**
 * Service-role Supabase client — bypasses Row Level Security.
 *
 * ⚠️ Node-only, for one-off maintenance scripts run on a trusted machine (e.g. creating the admin user).
 * The website is a static export: this key must never be prefixed with NEXT_PUBLIC_, imported from
 * `src/`, committed, or added to the GitHub Actions build.
 */
import { createClient } from '@supabase/supabase-js';

export function createSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (Supabase → Project Settings → API keys).');
  }
  return createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
}
