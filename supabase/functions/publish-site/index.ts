/**
 * publish-site — the static site's "on-demand revalidation".
 *
 * Called by the admin dashboard after a save. It verifies the caller is a CMS admin (public.is_admin()
 * evaluated with the caller's own JWT), then fires a `repository_dispatch` event so GitHub Actions
 * rebuilds the static export from the latest Supabase content and uploads it to Hostinger.
 *
 * Secrets (supabase secrets set …):
 *   GITHUB_TOKEN  fine-grained PAT, this repository only, permission "Contents: Read and write"
 *   GITHUB_REPO   owner/repo, e.g. transitionwebm2026/Dr-Ezzat-ali
 * SUPABASE_URL / SUPABASE_ANON_KEY are provided by the Edge runtime.
 *
 * Deploy: supabase functions deploy publish-site
 */
import { createClient } from 'npm:@supabase/supabase-js@2.117.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const authorization = req.headers.get('Authorization');
  if (!authorization) return json({ error: 'Not signed in' }, 401);

  // Evaluate is_admin() as the caller: an invalid / expired token fails here too.
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false },
  });
  const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
  if (adminError || isAdmin !== true) return json({ error: 'Admins only' }, 403);

  const token = Deno.env.get('GITHUB_TOKEN');
  const repo = Deno.env.get('GITHUB_REPO');
  if (!token || !repo) return json({ error: 'GITHUB_TOKEN / GITHUB_REPO secrets are not set on the publish-site function' }, 500);

  const response = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'dr-ezzat-cms',
    },
    body: JSON.stringify({ event_type: 'cms-publish', client_payload: { requested_at: new Date().toISOString() } }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error('GitHub dispatch failed', response.status, detail);
    return json({ error: `GitHub rejected the publish request (${response.status})` }, 502);
  }

  return json({ ok: true, message: 'Build started — the site updates in ~2–4 minutes.' }, 202);
});
