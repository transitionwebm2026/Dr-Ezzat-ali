/**
 * Generates `supabase/seed.sql` — the CMS tables pre-filled with the content currently in the
 * repository (dictionaries + media), so the dashboard starts with the live site instead of empty lists.
 *
 *   npm run cms:seed-sql      (Node 22.18+ / 24: imports the .ts dictionaries directly)
 *
 * The SQL only fills empty tables, so running it twice never duplicates rows.
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { homeDefaults, serviceVisuals, techniqueVisuals, videoSources } from '../src/content/media.ts';
import ar from '../src/i18n/dictionaries/ar.ts';
import en from '../src/i18n/dictionaries/en.ts';

const outFile = fileURLToPath(new URL('../supabase/seed.sql', import.meta.url));

const q = (value) => (value === null || value === undefined || value === '' ? 'null' : `'${String(value).replace(/'/g, "''")}'`);
const text = (value) => `'${String(value ?? '').replace(/'/g, "''")}'`;
const list = (items) => (items.length ? `array[${items.map(text).join(', ')}]::text[]` : `'{}'::text[]`);
const json = (value) => `${text(JSON.stringify(value))}::jsonb`;

function insertIfEmpty(table, columns, rows) {
  const values = rows.map((row) => `      (${row.join(', ')})`).join(',\n');
  return `do $seed$
begin
  if not exists (select 1 from public.${table}) then
    insert into public.${table} (${columns.join(', ')}) values
${values};
  end if;
end
$seed$;`;
}

const pages = [
  ['home', '/'],
  ['about', '/about/'],
  ['services', '/services/'],
  ['reviews', '/reviews/'],
  ['videos', '/videos/'],
  ['articles', '/articles/'],
  ['contact', '/contact/'],
];

const zip = (a, b, fn) => a.map((item, index) => fn(item, b[index] ?? item, index));

// Placeholder contact details mirror src/config/site.ts — replace them in /admin before launch.
const settings = `insert into public.site_settings (
  id, site_title_ar, site_title_en, logo_url, doctor_portrait_url,
  phone, phone_display, whatsapp_number, email,
  address_ar, address_en, map_query, map_directions_url, opening_hours, social_links, nav_cta_enabled
) values (
  1, ${q(ar.meta.defaultTitle)}, ${q(en.meta.defaultTitle)}, '/images/brand/cvo-logo.png', '/images/doctor-portrait.svg',
  '+201000000000', '+20 100 000 0000', '201000000000', 'info@drezzatali.com',
  ${q(ar.clinic.address)}, ${q(en.clinic.address)}, 'Cairo, Egypt', 'https://www.google.com/maps/search/?api=1&query=Cairo%2C%20Egypt',
  ${json(zip(ar.clinic.hours, en.clinic.hours, (a, e) => ({ days_ar: a.days, time_ar: a.time, days_en: e.days, time_en: e.time })))},
  ${json({ facebook: 'https://www.facebook.com/', instagram: 'https://www.instagram.com/', youtube: 'https://www.youtube.com/', tiktok: 'https://www.tiktok.com/' })},
  true
) on conflict (id) do nothing;`;

const footer = `insert into public.footer_settings (id, about_ar, about_en, copyright_ar, copyright_en, quick_links, social_visibility, show_specialties)
values (
  1, ${q(ar.footer.about)}, ${q(en.footer.about)}, ${q(ar.footer.rights)}, ${q(en.footer.rights)},
  ${json(pages.map(([key, path]) => ({ label_ar: ar.nav[key], label_en: en.nav[key], path })))},
  ${json({ facebook: true, instagram: true, youtube: true, tiktok: true })},
  true
) on conflict (id) do nothing;`;

const navigation = insertIfEmpty(
  'navigation_menu',
  ['label_ar', 'label_en', 'path', 'sort_order'],
  pages.map(([key, path], index) => [text(ar.nav[key]), text(en.nav[key]), text(path), (index + 1) * 10]),
);

// Services page specialties, with the icon / colour / illustration they use today, and what they show on the
// home page (the home "surgeries" / "treatments" cards are picked from here).
const specialties = insertIfEmpty(
  'specialties',
  [
    'key', 'title_ar', 'title_en', 'short_ar', 'short_en', 'description_ar', 'description_en',
    'conditions_ar', 'conditions_en', 'techniques', 'duration_ar', 'duration_en', 'recovery_ar', 'recovery_en',
    'icon', 'tone', 'image_url', 'home_section', 'tag', 'summary_ar', 'summary_en', 'sort_order',
  ],
  zip(ar.services.specialties.items, en.services.specialties.items, (a, e, index) => {
    const visual = serviceVisuals[a.id] ?? {};
    const techniques = zip(a.techniques, e.techniques, (ta, te) => ({
      key: ta.id,
      name_ar: ta.name,
      name_en: te.name,
      detail_ar: ta.detail,
      detail_en: te.detail,
      scene: techniqueVisuals[ta.id]?.scene ?? null,
      image_url: techniqueVisuals[ta.id]?.image ?? null,
      home_section: homeDefaults[ta.id]?.section ?? null,
      tag: homeDefaults[ta.id]?.tag ?? null,
    }));
    return [
      text(a.id), text(a.title), text(e.title), text(a.short), text(e.short), text(a.description), text(e.description),
      list(a.conditions), list(e.conditions), json(techniques), text(a.duration), text(e.duration), text(a.recovery), text(e.recovery),
      q(visual.icon), q(visual.tone), q(visual.image), q(homeDefaults[a.id]?.section), q(homeDefaults[a.id]?.tag),
      text(a.summary), text(e.summary), (index + 1) * 10,
    ];
  }),
);

const reviews = insertIfEmpty(
  'reviews',
  ['patient_name_ar', 'patient_name_en', 'rating', 'review_text_ar', 'review_text_en', 'procedure_type_ar', 'procedure_type_en', 'is_featured_on_home', 'sort_order'],
  zip(ar.reviews.items, en.reviews.items, (a, e, index) => [
    text(a.name), text(e.name), a.rating, text(a.quote), text(e.quote), text(a.procedure), text(e.procedure), 'true', (index + 1) * 10,
  ]),
);

const videos = insertIfEmpty(
  'videos',
  ['title_ar', 'title_en', 'category_ar', 'category_en', 'duration', 'youtube_id', 'video_file_url', 'is_featured_on_home', 'sort_order'],
  zip(ar.videos.items, en.videos.items, (a, e, index) => {
    const source = videoSources[a.id] ?? {};
    return [text(a.title), text(e.title), text(a.category), text(e.category), q(a.duration), q(source.youtubeId), q(source.src), String(index < 3), (index + 1) * 10];
  }),
);

const articles = insertIfEmpty(
  'articles',
  [
    'slug', 'category_ar', 'category_en', 'title_ar', 'title_en', 'summary_ar', 'summary_en', 'content_ar', 'content_en',
    'takeaways_ar', 'takeaways_en', 'read_time_minutes', 'published_on', 'is_featured_on_home', 'is_hero_article', 'sort_order',
  ],
  zip(ar.articles.items, en.articles.items, (a, e, index) => [
    text(a.slug), text(a.category), text(e.category), text(a.title), text(e.title), text(a.excerpt), text(e.excerpt),
    text(a.body.join('\n\n')), text(e.body.join('\n\n')), list(a.takeaways), list(e.takeaways),
    a.readTime, text(a.date), String(index < 3), String(index === 0), (index + 1) * 10,
  ]),
);

const faqRows = [
  ...zip(ar.home.faq.items, en.home.faq.items, (a, e) => ['home', a, e]),
  ...ar.services.faq.groups.flatMap((group, g) =>
    zip(group.items, en.services.faq.groups[g].items, (a, e) => [`services_${group.id}`, a, e]),
  ),
];
const faqs = insertIfEmpty(
  'faqs',
  ['page_location', 'question_ar', 'question_en', 'answer_ar', 'answer_en', 'sort_order'],
  faqRows.map(([location, a, e], index) => [text(location), text(a.q), text(e.q), text(a.a), text(e.a), (index + 1) * 10]),
);

const sql = `-- ════════════════════════════════════════════════════════════════════════════
--  Dr. Ezzat Ali — initial CMS content (generated by scripts/generate-seed.mjs — do not edit by hand).
--  Run after the schema migration: Supabase → SQL Editor → paste & run.
--  Only empty tables are filled, so running it again is harmless.
-- ════════════════════════════════════════════════════════════════════════════

${settings}

${footer}

${navigation}

${specialties}

${reviews}

${videos}

${articles}

${faqs}
`;

await writeFile(outFile, sql);
console.log(`✓ Wrote ${fileURLToPath(new URL('../supabase/seed.sql', import.meta.url))}`);
