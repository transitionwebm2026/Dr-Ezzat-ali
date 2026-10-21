/**
 * Browser Supabase client (public anon / publishable key — safe to ship).
 *
 * The key on its own grants nothing beyond Row Level Security: visitors can read published content
 * and submit a consultation request; every write in the admin dashboard is authorised by the
 * signed-in admin's session token and checked in Postgres by `public.is_admin()`.
 * The service-role key is never used in the website (see scripts/lib/supabase-admin.mjs).
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from './env';

export { isSupabaseConfigured };

let client: SupabaseClient | undefined;

export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.');
  }
  client ??= createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storageKey: 'dr-ezzat-cms-auth',
    },
  });
  return client;
}
