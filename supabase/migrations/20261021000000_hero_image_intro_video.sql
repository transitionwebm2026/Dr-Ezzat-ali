-- ════════════════════════════════════════════════════════════════════════════
--  Hero image + one shared intro video (dashboard page "صورة الواجهة والفيديو التعريفي")
--
--    • hero_image_url   the picture in the hero of every page (empty → doctor_portrait_url).
--    • intro_video_*    one intro video shown on both the home page and the about page,
--                       replacing the separate home_video_* / about_video_* columns.
--
--  Run after 20261020000000_cms_schema.sql: Supabase → SQL Editor → paste & run.
--  The file is idempotent, so running it again is safe.
-- ════════════════════════════════════════════════════════════════════════════

alter table public.site_settings
  add column if not exists hero_image_url             text,
  add column if not exists intro_video_youtube_id     text,
  add column if not exists intro_video_url            text,
  add column if not exists intro_video_thumbnail_url  text;

-- Keep a promo video that was already saved (the home one first, then the about one).
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'site_settings' and column_name = 'home_video_url'
  ) then
    update public.site_settings set
      intro_video_youtube_id    = case when coalesce(home_video_youtube_id, home_video_url) is not null then home_video_youtube_id    else about_video_youtube_id    end,
      intro_video_url           = case when coalesce(home_video_youtube_id, home_video_url) is not null then home_video_url           else about_video_url           end,
      intro_video_thumbnail_url = case when coalesce(home_video_youtube_id, home_video_url) is not null then home_video_thumbnail_url else about_video_thumbnail_url end
    where coalesce(intro_video_youtube_id, intro_video_url) is null;
  end if;
end
$$;

alter table public.site_settings
  drop constraint if exists site_settings_home_video_thumbnail,
  drop constraint if exists site_settings_about_video_thumbnail,
  drop column if exists home_video_youtube_id,
  drop column if exists home_video_url,
  drop column if exists home_video_thumbnail_url,
  drop column if exists about_video_youtube_id,
  drop column if exists about_video_url,
  drop column if exists about_video_thumbnail_url;

-- An uploaded video file must come with its thumbnail (same rule as the videos library).
alter table public.site_settings drop constraint if exists site_settings_intro_video_thumbnail;
alter table public.site_settings
  add constraint site_settings_intro_video_thumbnail check (intro_video_url is null or intro_video_thumbnail_url is not null);

-- Let the API see the new columns right away.
notify pgrst, 'reload schema';
