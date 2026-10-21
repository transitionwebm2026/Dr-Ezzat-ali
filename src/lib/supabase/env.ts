/** Public Supabase settings, inlined at build time. Kept free of imports so the public site never bundles supabase-js. */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
/** Publishable key (`sb_publishable_…`), or the legacy anon JWT — both are public and RLS-bound. */
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/** False until NEXT_PUBLIC_SUPABASE_URL and a public key are set. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
