-- ════════════════════════════════════════════════════════════════════════════
--  Dr. Ezzat Ali — Headless CMS schema
--
--  Security model
--    • RLS is enabled on every table.
--    • anon (visitors + the static build): SELECT published / active rows only,
--      plus INSERT-only on `consultations` (the booking form).
--    • authenticated: full CRUD only when `public.is_admin()` is true, i.e. the user id
--      is listed in `public.admin_users` (Dr.ezzatali.web@hotmail.com — see the end of the file).
--      Signing up alone grants nothing.
--    • Storage: public read for `site-images` / `site-videos`, admin-only write/delete.
--
--  Run once: Supabase Dashboard → SQL Editor → paste & run (or `supabase db push`).
--  The file is idempotent, so running it again is safe.
-- ════════════════════════════════════════════════════════════════════════════


-- ─── Helpers ─────────────────────────────────────────────────────────────────

create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
-- RLS on with no policies: the allowlist can only be changed with the service role / SQL editor.
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admin_users where user_id = (select auth.uid()));
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ─── Global settings (single row, id = 1) ────────────────────────────────────
-- NULL / empty values fall back to the defaults in src/config/site.ts.

create table if not exists public.site_settings (
  id                         smallint primary key default 1 check (id = 1),
  site_title_ar              text,
  site_title_en              text,
  logo_url                   text,
  doctor_portrait_url        text,
  -- Contact (powers the header, hero bar, contact page, footer and floating buttons)
  phone                      text check (phone is null or phone ~ '^\+?[0-9]{6,15}$'),
  phone_display              text,
  secondary_phone            text,
  whatsapp_number            text check (whatsapp_number is null or whatsapp_number ~ '^[0-9]{8,15}$'),
  email                      text,
  emergency_phone            text,
  emergency_note_ar          text,
  emergency_note_en          text,
  -- Location & hours
  address_ar                 text,
  address_en                 text,
  map_query                  text,
  map_directions_url         text,
  opening_hours              jsonb not null default '[]'::jsonb check (jsonb_typeof(opening_hours) = 'array'),
  -- { "facebook": "https://…", "instagram": "…", "youtube": "…", "tiktok": "…" }
  social_links               jsonb not null default '{}'::jsonb check (jsonb_typeof(social_links) = 'object'),
  nav_cta_enabled            boolean not null default true,
  -- Landscape promo videos (YouTube id or uploaded file + compulsory thumbnail)
  home_video_youtube_id      text,
  home_video_url             text,
  home_video_thumbnail_url   text,
  about_video_youtube_id     text,
  about_video_url            text,
  about_video_thumbnail_url  text,
  updated_at                 timestamptz not null default now(),
  constraint site_settings_home_video_thumbnail check (home_video_url is null or home_video_thumbnail_url is not null),
  constraint site_settings_about_video_thumbnail check (about_video_url is null or about_video_thumbnail_url is not null)
);

create table if not exists public.footer_settings (
  id                 smallint primary key default 1 check (id = 1),
  about_ar           text,
  about_en           text,
  copyright_ar       text,
  copyright_en       text,
  -- [{ "label_ar": "…", "label_en": "…", "path": "/about/" }]
  quick_links        jsonb not null default '[]'::jsonb check (jsonb_typeof(quick_links) = 'array'),
  -- { "facebook": true, "instagram": true, "youtube": true, "tiktok": false }
  social_visibility  jsonb not null default '{}'::jsonb check (jsonb_typeof(social_visibility) = 'object'),
  show_specialties   boolean not null default true,
  updated_at         timestamptz not null default now()
);

create table if not exists public.navigation_menu (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid references public.navigation_menu (id) on delete cascade,
  label_ar    text not null check (char_length(label_ar) between 1 and 60),
  label_en    text not null check (char_length(label_en) between 1 and 60),
  -- Internal path without the /en prefix ("/about/", "/services/#lasik") or an absolute URL.
  path        text not null check (path ~ '^(/|https?://)'),
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists navigation_menu_parent_idx on public.navigation_menu (parent_id, sort_order);

-- Structured copy for every page section. `section_key` is the dictionary path it overrides
-- (e.g. "home.hero", "about.timeline"); the allowed keys live in src/lib/cms/sections.ts.
create table if not exists public.page_sections (
  section_key  text primary key check (section_key ~ '^[a-z][a-zA-Z]*(\.[a-zA-Z]+)*$'),
  page         text not null,
  content_ar   jsonb not null default '{}'::jsonb,
  content_en   jsonb not null default '{}'::jsonb,
  updated_at   timestamptz not null default now()
);


-- ─── Content libraries ───────────────────────────────────────────────────────

create table if not exists public.surgeries (
  id              uuid primary key default gen_random_uuid(),
  -- Stable English id: picks the card icon and links to the matching /services/#anchor.
  key             text not null unique check (key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  tag             text,
  title_ar        text not null,
  title_en        text not null default '',
  description_ar  text not null default '',
  description_en  text not null default '',
  image_url       text,
  sort_order      integer not null default 0,
  is_published    boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists public.treatments (
  id              uuid primary key default gen_random_uuid(),
  key             text not null unique check (key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  tag             text,
  title_ar        text not null,
  title_en        text not null default '',
  description_ar  text not null default '',
  description_en  text not null default '',
  image_url       text,
  sort_order      integer not null default 0,
  is_published    boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists public.reviews (
  id                   uuid primary key default gen_random_uuid(),
  patient_name_ar      text not null,
  patient_name_en      text not null default '',
  rating               smallint not null default 5 check (rating between 1 and 5),
  review_text_ar       text not null,
  review_text_en       text not null default '',
  procedure_type_ar    text not null default '',
  procedure_type_en    text not null default '',
  is_featured_on_home  boolean not null default false,
  sort_order           integer not null default 0,
  is_published         boolean not null default true,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create table if not exists public.videos (
  id                   uuid primary key default gen_random_uuid(),
  title_ar             text not null,
  title_en             text not null default '',
  category_ar          text not null default '',
  category_en          text not null default '',
  duration             text,
  video_file_url       text,
  thumbnail_file_url   text,
  youtube_id           text check (youtube_id is null or youtube_id ~ '^[A-Za-z0-9_-]{11}$'),
  is_featured_on_home  boolean not null default false,
  sort_order           integer not null default 0,
  is_published         boolean not null default true,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  -- Every uploaded video must come with its thumbnail image.
  constraint videos_thumbnail_required check (video_file_url is null or thumbnail_file_url is not null)
);

create table if not exists public.articles (
  id                   uuid primary key default gen_random_uuid(),
  slug                 text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category_ar          text not null default '',
  category_en          text not null default '',
  title_ar             text not null,
  title_en             text not null default '',
  summary_ar           text not null default '',
  summary_en           text not null default '',
  -- Body text: paragraphs separated by a blank line.
  content_ar           text not null default '',
  content_en           text not null default '',
  takeaways_ar         text[] not null default '{}',
  takeaways_en         text[] not null default '{}',
  read_time_minutes    smallint not null default 5 check (read_time_minutes between 1 and 120),
  published_on         date not null default current_date,
  featured_image_url   text,
  is_featured_on_home  boolean not null default false,
  is_hero_article      boolean not null default false,
  sort_order           integer not null default 0,
  is_published         boolean not null default true,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- Only one "hero" (featured) article at a time: turning it on for one turns it off for the rest.
create or replace function public.articles_single_hero()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  update public.articles set is_hero_article = false where id <> new.id and is_hero_article;
  return new;
end;
$$;
drop trigger if exists articles_single_hero on public.articles;
create trigger articles_single_hero
  after insert or update of is_hero_article on public.articles
  for each row when (new.is_hero_article)
  execute function public.articles_single_hero();

create table if not exists public.faqs (
  id             uuid primary key default gen_random_uuid(),
  page_location  text not null check (page_location in ('home', 'services_before', 'services_after')),
  question_ar    text not null,
  question_en    text not null default '',
  answer_ar      text not null,
  answer_en      text not null default '',
  sort_order     integer not null default 0,
  is_published   boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists faqs_location_idx on public.faqs (page_location, sort_order);


-- ─── Consultation requests (written by the public booking form) ──────────────

create table if not exists public.consultations (
  id                 uuid primary key default gen_random_uuid(),
  patient_name       text not null check (char_length(patient_name) between 2 and 120),
  phone              text not null check (phone ~ '^\+?[0-9 ()-]{8,20}$'),
  preferred_date     date,
  consultation_type  text check (char_length(consultation_type) <= 120),
  notes              text check (char_length(notes) <= 2000),
  locale             text not null default 'ar' check (locale in ('ar', 'en')),
  status             text not null default 'new' check (status in ('new', 'contacted', 'booked', 'completed', 'cancelled')),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index if not exists consultations_created_idx on public.consultations (created_at desc);


-- ─── Row Level Security ──────────────────────────────────────────────────────

do $$
declare
  t text;
  -- table → condition for public (anon) reads
  public_read constant jsonb := jsonb_build_object(
    'site_settings',   'true',
    'footer_settings', 'true',
    'page_sections',   'true',
    'navigation_menu', 'is_active',
    'surgeries',       'is_published',
    'treatments',      'is_published',
    'reviews',         'is_published',
    'videos',          'is_published',
    'articles',        'is_published',
    'faqs',            'is_published'
  );
begin
  for t in select jsonb_object_keys(public_read) loop
    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists "Public read" on public.%I', t);
    execute format('create policy "Public read" on public.%I for select to anon, authenticated using (%s)', t, public_read ->> t);

    execute format('drop policy if exists "Admin full access" on public.%I', t);
    execute format(
      'create policy "Admin full access" on public.%I for all to authenticated '
      'using ((select public.is_admin())) with check ((select public.is_admin()))', t);

    -- Explicit grants on top of RLS (defence in depth): visitors can only ever read.
    execute format('revoke all on public.%I from anon, authenticated', t);
    execute format('grant select on public.%I to anon', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);

    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
  end loop;
end
$$;

-- Consultations: visitors may only INSERT a new request (never read, edit or delete).
alter table public.consultations enable row level security;

drop policy if exists "Visitors can submit" on public.consultations;
create policy "Visitors can submit" on public.consultations
  for insert to anon, authenticated
  with check (status = 'new');

drop policy if exists "Admin full access" on public.consultations;
create policy "Admin full access" on public.consultations
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

revoke all on public.consultations from anon, authenticated;
grant insert (patient_name, phone, preferred_date, consultation_type, notes, locale) on public.consultations to anon;
grant select, insert, update, delete on public.consultations to authenticated;

drop trigger if exists set_updated_at on public.consultations;
create trigger set_updated_at before update on public.consultations
  for each row execute function public.set_updated_at();


-- ─── Storage buckets ─────────────────────────────────────────────────────────
-- Public buckets: files are readable through their public URL without any policy.
-- Note: the Free plan caps every upload at 50 MB regardless of the bucket limit.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('site-images', 'site-images', true, 10485760,  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']),
  ('site-videos', 'site-videos', true, 52428800, array['video/mp4', 'video/webm', 'video/quicktime'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "CMS admin can list media" on storage.objects;
create policy "CMS admin can list media" on storage.objects
  for select to authenticated
  using (bucket_id in ('site-images', 'site-videos') and (select public.is_admin()));

drop policy if exists "CMS admin can upload media" on storage.objects;
create policy "CMS admin can upload media" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('site-images', 'site-videos') and (select public.is_admin()));

drop policy if exists "CMS admin can update media" on storage.objects;
create policy "CMS admin can update media" on storage.objects
  for update to authenticated
  using (bucket_id in ('site-images', 'site-videos') and (select public.is_admin()))
  with check (bucket_id in ('site-images', 'site-videos') and (select public.is_admin()));

drop policy if exists "CMS admin can delete media" on storage.objects;
create policy "CMS admin can delete media" on storage.objects
  for delete to authenticated
  using (bucket_id in ('site-images', 'site-videos') and (select public.is_admin()));


-- ─── Admin account ───────────────────────────────────────────────────────────
-- 1. Create the user first (never put the password in this file):
--      Dashboard → Authentication → Users → "Add user" → "Create new user",
--      email Dr.ezzatali.web@hotmail.com, tick "Auto Confirm User".
--    or run `npm run cms:create-admin` (see README).
-- 2. Then this statement (re-run it if the user did not exist yet) grants admin rights:

insert into public.admin_users (user_id)
select id from auth.users where lower(email) = lower('Dr.ezzatali.web@hotmail.com')
on conflict (user_id) do nothing;
