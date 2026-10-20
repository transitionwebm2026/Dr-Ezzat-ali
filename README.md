# Dr. Ezzat Ali — Ophthalmologist Website

Bilingual (Arabic RTL default / English LTR) static website built with **Next.js 16 (App Router)**, **React 19**,
**TypeScript**, **Tailwind CSS 3** and **Framer Motion**, exported as plain static files for **Hostinger**.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000  (Arabic at /, English at /en/)
npm run build      # static export → /out   (runs scripts/fix-static-export.mjs afterwards)
npm run start      # preview /out locally
npm run typecheck
```

## Deploy to Hostinger

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
