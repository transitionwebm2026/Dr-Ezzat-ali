# Dr. Ezzat Ali — Ophthalmologist Website

Bilingual (Arabic RTL default / English LTR) static website built with **Next.js 16 (App Router)**, **React 19**,
**TypeScript**, **Tailwind CSS 3** and **Framer Motion**, exported as plain static files for **Hostinger**.

## Quick start

```bash
npm install
cp .env.example .env.local   # Supabase URL + publishable key (optional — without it the repo content is used)
npm run dev        # http://localhost:3000  (Arabic at /, English at /en/, dashboard at /admin/)
npm run build      # pulls CMS content → static export → /out (then runs scripts/fix-static-export.mjs)
npm run start      # preview /out locally
npm run typecheck
```

## Content management (Supabase CMS + `/admin`)

The site stays a **static export** (plain HTML on Hostinger shared hosting); its content lives in **Supabase**.

```
/admin (static client app) ──supabase-js + admin JWT──▶ Supabase (Postgres + RLS, Auth, Storage)
        │ every save                                          ▲
        ▼                                                     │ public key, published rows only
Edge Function `publish-site` (is_admin check) ──repository_dispatch──▶ GitHub Actions:
        npm run build  (scripts/cms-pull.mjs → src/content/cms-snapshot.json → next build)
        → FTP upload of /out to public_html                    ≈ 2–4 minutes after the save
```

- **Security:** RLS on every table. Visitors (anon key) can only `SELECT` published/active rows and `INSERT` a
  consultation request. Writes require a signed-in user listed in `public.admin_users` (`public.is_admin()`), so
  signing up grants nothing. Storage buckets `site-images` / `site-videos` are public-read, admin-only write.
  The `/admin` route guard is client-side (a static host has no middleware) — RLS is the real boundary.
- **No server-side secrets in the site:** the build and the browser only use the publishable key. The service-role
  key is used by `npm run cms:create-admin` on a trusted machine only.
- **Fallbacks:** anything left empty in the CMS falls back to `src/config/site.ts` / the dictionaries. Page-section
  overrides are coerced into the dictionary's shape, so a bad row can't break a page. Without Supabase env vars the
  site builds from the repository content as before.
- **Home page:** reviews, videos and articles are never duplicated — the home sections show rows flagged
  `is_featured_on_home` (first 3 videos / articles; all featured reviews).

### One-time setup

1. **Database** — Supabase → SQL Editor: run the files in `supabase/migrations/` in name order
   (`20261020000000_cms_schema.sql`, then `20261021000000_hero_image_intro_video.sql`), then
   `supabase/seed.sql` (current site content; regenerate with `npm run cms:seed-sql`). All are re-runnable.
2. **Auth** — Authentication → Sign In / Providers: turn **off** "Allow new users to sign up".
   Create the admin: `$env:ADMIN_PASSWORD='…'; npm run cms:create-admin` (needs `SUPABASE_SERVICE_ROLE_KEY` in
   `.env.local`), or Authentication → Users → Add user (auto-confirm), then re-run the last statement of the migration.
3. **Publish function** — GitHub → Settings → Developer settings → fine-grained token for this repo only with
   **Contents: Read and write**. Then:
   ```bash
   npx supabase functions deploy publish-site --project-ref <ref>
   npx supabase secrets set GITHUB_TOKEN=<token> GITHUB_REPO=<owner>/<repo> --project-ref <ref>
   ```
4. **GitHub Actions secrets** — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `FTP_SERVER`,
   `FTP_USERNAME`, `FTP_PASSWORD` (hPanel → Files → FTP Accounts). If your FTP login lands directly inside
   `public_html`, add the repository **variable** `FTP_SERVER_DIR` = `./`.

| Dashboard page            | Table(s)                             |
| ------------------------- | ------------------------------------ |
| الهوية والعنوان والمواعيد  | `site_settings`                      |
| التواصل والأزرار العائمة   | `site_settings` (phone, WhatsApp…)    |
| الهيدر وروابط القائمة      | `navigation_menu`, `site_settings`   |
| الفوتر                    | `footer_settings`, `site_settings`   |
| صورة الواجهة والفيديو      | `site_settings` (hero image, intro video shared by home & about + thumbnail) |
| نصوص أقسام الصفحات         | `page_sections` (registry: `src/lib/cms/sections.ts`) |
| Content libraries         | `surgeries`, `treatments`, `reviews`, `videos`, `articles`, `faqs` |
| طلبات الحجز               | `consultations` (private, never published) |

## Deploy to Hostinger

Automatic: every push to `main` and every CMS save runs `.github/workflows/deploy.yml`.

Manual alternative:

1. `npm run build`
2. In hPanel → **File Manager** → `public_html`, upload the **contents** of `/out` (not the folder itself),
   including the hidden `.htaccess` file.
3. Once SSL is active, uncomment the "Force HTTPS" block in `public/.htaccess` (then rebuild/re-upload).

`.htaccess` already handles clean URLs, the bilingual `404.html`, compression, caching and security headers.

## URLs

| Page          | Arabic (default) | English         |
| ------------- | ---------------- | --------------- |
| Home          | `/`              | `/en/`          |
| About         | `/about/`        | `/en/about/`    |
| Services      | `/services/`     | `/en/services/` |
| Reviews       | `/reviews/`      | `/en/reviews/`  |
| Videos        | `/videos/`       | `/en/videos/`   |
| Articles      | `/articles/` (+ `/articles/<slug>/`) | `/en/articles/` |
| Contact       | `/contact/`      | `/en/contact/`  |

Each language has its own root layout, so `<html lang dir>` and fonts are baked into the static HTML (no flash).

## Where to edit content

Once Supabase is connected, edit content in **`/admin`**. The files below hold the **defaults** (used for anything
left empty in the CMS, and as the schema of the page-section editor).

| What                                              | File |
| ------------------------------------------------- | ---- |
| Phone, WhatsApp number, email, map, socials, portrait, promo videos | `src/config/site.ts` |
| Clinic logo (navbar/footer) & footer credit badge | `public/images/brand/` + `logo` / `credit` in `src/config/site.ts` |
| Browser-tab icons                                 | `src/app/favicon.ico`, `icon.png`, `apple-icon.png` |
| All Arabic text                                   | `src/i18n/dictionaries/ar.ts` (source of truth for types) |
| All English text                                  | `src/i18n/dictionaries/en.ts` (must mirror `ar.ts` — TypeScript enforces it) |
| Card photos, video IDs, icons & colour tones      | `src/content/media.ts` |
| Brand colours, shadows, animations                | `tailwind.config.ts` |
| Fonts (`@font-face`)                               | `src/app/globals.css` |

### Before launch — replace placeholder content

The layout ships with realistic **sample** data. Replace every item below with verified information:

- [ ] `src/config/site.ts`: domain, phone, WhatsApp number, email, Google Maps query, social links
- [ ] Doctor portrait: add a transparent PNG/WebP cut-out (≈1000×1250) to `public/images/` and update `doctorPortrait`
- [ ] Clinic address and opening hours (`clinic` in both dictionaries)
- [ ] Statistics (patients, surgeries, years), career timeline dates and certificates/memberships
- [ ] Patient reviews: use **real, consented** testimonials only
- [ ] Video IDs (`src/content/media.ts` and `siteConfig.videos`) — YouTube IDs or MP4 files in `public/videos/`
- [ ] Optional photos for service/article cards (`image` in `src/content/media.ts`); without them a branded illustration is shown

### Brand fonts

Add the licensed files as `public/fonts/al-fares.woff2` (headings) and `public/fonts/ae_Hor.woff2` (body).
Only have `.ttf`? Convert to WOFF2, or change the `url(...)`/`format(...)` in `src/app/globals.css`.
Until then, Arabic falls back to **Cairo** (self-hosted at build time). English uses **Plus Jakarta Sans**.

## Project structure

```
src/
├─ app/
│  ├─ (ar)/                 Arabic root layout (RTL) + 7 pages + articles/[slug]
│  ├─ (en)/en/              English root layout (LTR) + 7 pages + articles/[slug]
│  ├─ global-not-found.tsx  Bilingual 404 (→ /404.html)
│  ├─ sitemap.ts, robots.ts, favicon.ico, icon.png, apple-icon.png, globals.css
├─ views/                   One composition per page (Home, About, Services, …) shared by both locales
├─ components/
│  ├─ hero/                 UnifiedHero (portrait-centred 3-column contract), HeroPortrait, actions, contact bar
│  ├─ layout/               RootDocument, Header, Footer, FloatingActions (WhatsApp + call), JSON-LD
│  ├─ cta/PageCTA           Standard closing call-to-action
│  ├─ reviews/ReviewSlider  Auto-playing, pause-on-hover, swipeable, RTL-aware carousel
│  ├─ contact/              ConsultationForm (→ formatted WhatsApp message), ClinicInfo (map + details)
│  ├─ journey/, faq/, stats/, services/, about/, home/, cards/, media/, motion/, ui/, icons/
├─ i18n/                    Locale config, path helpers, dictionaries
├─ content/media.ts         Non-text media/visual settings
├─ config/site.ts           Clinic details
└─ lib/                     metadata, contact links, formatting, cn
scripts/fix-static-export.mjs   Post-build fix (see below)
```

## Technical notes

- **Hero contract:** on `lg+` every hero is a 3-column grid; the portrait owns the centre column, so text can never
  overlap it. On mobile the stack is headline → copy & CTAs → portrait.
- **Animations** respect the OS "reduce motion" setting (`MotionConfig reducedMotion="user"`). Hero entrance
  animations are pure CSS so the first paint never waits for JavaScript.
- **Videos** use a click-to-load facade (`youtube-nocookie`), so no third-party iframe loads until the visitor presses play.
- **Windows builds:** Next.js 16 writes client-prefetch segment files with backslash paths on Windows, producing
  nested folders the browser can't find. `scripts/fix-static-export.mjs` runs automatically after `npm run build` and
  flattens them (no-op on macOS/Linux).
