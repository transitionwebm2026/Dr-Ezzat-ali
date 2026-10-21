/**
 * Pulls the published CMS content from Supabase into `src/content/cms-snapshot.json`.
 *
 * Runs automatically before `npm run dev`, `npm run build` and `npm run typecheck`, so every static
 * page is pre-rendered with the latest content. It uses the public anon key and asks for published /
 * active rows only, so drafts can never leak into the static HTML.
 *
 *   NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY  → from .env.local (or CI secrets)
 *   CMS_REQUIRED=1   → fail instead of falling back (used in CI so a Supabase outage never deploys placeholders)
 *   --if-missing     → only create the file when it does not exist yet (fast, offline — used by typecheck)
 *   --watch          → keep pulling every few seconds and rewrite the file when the content changes, so
 *                      `next dev` shows dashboard saves on localhost without a restart (started by scripts/dev.mjs)
 */
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const outFile = fileURLToPath(new URL('../src/content/cms-snapshot.json', import.meta.url));
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const required = process.env.CMS_REQUIRED === '1';

async function save(snapshot) {
  await mkdir(dirname(outFile), { recursive: true });
  await writeFile(outFile, `${JSON.stringify(snapshot, null, 2)}\n`);
}

function fail(message) {
  console.error(`✗ cms-pull: ${message}`);
  process.exit(1);
}

if (process.argv.includes('--if-missing') && existsSync(outFile)) process.exit(0);

if (!url || !key) {
  if (required) fail('NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are not set.');
  console.warn('• cms-pull: Supabase is not configured — building with the content in the repository.');
  await save({ source: 'local' });
  process.exit(0);
}

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

// Fully ordered (id as the last tie-break) so an unchanged database always gives an identical file.
const list = (table, flag = 'is_published') =>
  supabase.from(table).select('*').eq(flag, true).order('sort_order').order('created_at').order('id');

async function pull() {
  const queries = {
    settings: supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
    footer: supabase.from('footer_settings').select('*').eq('id', 1).maybeSingle(),
    navigation: list('navigation_menu', 'is_active'),
    sections: supabase.from('page_sections').select('*').order('section_key'),
    surgeries: list('surgeries'),
    treatments: list('treatments'),
    reviews: list('reviews'),
    videos: list('videos'),
    articles: list('articles'),
    faqs: list('faqs'),
  };

  const entries = await Promise.all(
    Object.entries(queries).map(async ([name, query]) => {
      const { data, error } = await query;
      if (error) throw new Error(`${name}: ${error.message}`);
      return [name, data];
    }),
  );
  return Object.fromEntries(entries);
}

const WATCH_INTERVAL_MS = 4000;

/** Snapshot without its timestamp, to tell whether anything actually changed. */
const contentOf = (snapshot) => JSON.stringify({ ...snapshot, fetchedAt: undefined });

/** Dev only: never returns. Rewriting the file makes `next dev` re-render the open page. */
async function watch() {
  // Started by scripts/dev.mjs: stop together with the dev server.
  process.on('disconnect', () => process.exit(0));
  let last = existsSync(outFile) ? contentOf(JSON.parse(await readFile(outFile, 'utf8'))) : '';
  let failing = false;
  console.log('• cms-pull: watching Supabase — dashboard saves show up on localhost within a few seconds.');
  for (;;) {
    await new Promise((resolve) => setTimeout(resolve, WATCH_INTERVAL_MS));
    try {
      const snapshot = { source: 'supabase', fetchedAt: new Date().toISOString(), ...(await pull()) };
      failing = false;
      if (contentOf(snapshot) === last) continue;
      last = contentOf(snapshot);
      await save(snapshot);
      console.log('↻ cms-pull: new dashboard content pulled.');
    } catch (error) {
      if (!failing) console.warn(`• cms-pull: Supabase unreachable (${error.message}) — retrying.`);
      failing = true;
    }
  }
}

if (process.argv.includes('--watch')) await watch();

try {
  const data = await pull();
  await save({ source: 'supabase', fetchedAt: new Date().toISOString(), ...data });
  const counts = ['surgeries', 'treatments', 'reviews', 'videos', 'articles', 'faqs'].map((name) => `${data[name].length} ${name}`).join(', ');
  console.log(`✓ cms-pull: ${counts}, ${data.sections.length} page sections`);
} catch (error) {
  if (required) fail(error instanceof Error ? error.message : String(error));
  if (existsSync(outFile)) {
    console.warn(`• cms-pull: Supabase unreachable (${error.message}) — keeping the previous snapshot.`);
  } else {
    console.warn(`• cms-pull: Supabase unreachable (${error.message}) — building with the content in the repository.`);
    await save({ source: 'local' });
  }
}
