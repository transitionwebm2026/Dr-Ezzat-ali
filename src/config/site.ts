/**
 * ════════════════════════════════════════════════════════════════════════════
 *  SITE CONFIGURATION — the single place to update clinic details.
 *  Every value marked `REPLACE` is a placeholder and must be updated before launch.
 * ════════════════════════════════════════════════════════════════════════════
 */

export const siteConfig = {
  /** Production domain (no trailing slash). Used for canonical URLs, sitemap & Open Graph. REPLACE */
  url: 'https://www.drezzatali.com',

  /** Phone in E.164 format for `tel:` links. REPLACE */
  phone: '+201000000000',
  /** Human-friendly phone, always rendered left-to-right. REPLACE */
  phoneDisplay: '+20 100 000 0000',

  /** WhatsApp number: digits only, international format without "+" or "00". REPLACE */
  whatsappNumber: '201000000000',

  /** REPLACE */
  email: 'info@drezzatali.com',

  /**
   * Google Maps: the embed uses a plain search query, so no API key is needed.
   * Tip: use the exact clinic name + street as it appears on Google Maps. REPLACE
   */
  map: {
    query: 'Cairo, Egypt',
    directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Cairo%2C%20Egypt',
  },

  /** Social profiles — remove any entry you don't use. REPLACE */
  social: {
    facebook: 'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/',
    youtube: 'https://www.youtube.com/',
    tiktok: 'https://www.tiktok.com/',
  },

  /**
   * Doctor portrait used in the centre of every hero.
   * Best result: a transparent PNG/WebP cut-out (waist-up, ~1000×1250px).
   * Replace `/images/doctor-portrait.svg` with e.g. `/images/doctor-portrait.png`.
   */
  doctorPortrait: '/images/doctor-portrait.svg',

  /**
   * Clinic logo (CVO — Clear Vision Clinic), cropped & optimised from `public/images/Cvo logo.png`.
   * `full` is the complete lock-up (navbar, footer); `mark` is the "CVO" monogram for small square spots.
   * The browser-tab icons live in `src/app` (favicon.ico, icon.png, apple-icon.png).
   */
  logo: {
    full: { src: '/images/brand/cvo-logo.png', width: 640, height: 450 },
    mark: { src: '/images/brand/cvo-mark.png', width: 320, height: 128 },
    alt: 'CVO — Clear Vision Clinic',
  },

  /** "Design & Development" credit badge in the footer. */
  credit: {
    name: 'Transition',
    tagline: 'Design & Development',
    url: 'https://transitioneg.com/',
    logo: '/images/brand/transition-logo.webp',
  },

  /**
   * Landscape videos (16:9). Provide a YouTube video ID **or** a self-hosted MP4 path
   * (e.g. '/videos/intro.mp4' placed in /public/videos). Leave both empty to show the poster only.
   */
  videos: {
    homePromo: { youtubeId: '', src: '' },
    aboutIntro: { youtubeId: '', src: '' },
  },
} as const;

export type SocialNetwork = keyof typeof siteConfig.social;
