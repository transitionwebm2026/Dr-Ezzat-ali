/**
 * ════════════════════════════════════════════════════════════════════════════
 *  SITE CONFIGURATION — default clinic details.
 *  Once Supabase is connected, the values saved in the admin dashboard (/admin → site_settings)
 *  override these at build time; anything left empty there falls back to the value below.
 *  Every value marked `REPLACE` is a placeholder and must be updated before launch.
 * ════════════════════════════════════════════════════════════════════════════
 */
import { cms } from '@/lib/cms/snapshot';
import type { SocialNetwork } from '@/lib/cms/types';

type VideoSource = { youtubeId: string; src: string; poster?: string };

const defaults = {
  /** Production domain (no trailing slash). Used for canonical URLs, sitemap & Open Graph. REPLACE */
  url: 'https://www.drezzatali.com',

  /** Phone in E.164 format for `tel:` links. REPLACE */
  phone: '+201000000000',
  /** Human-friendly phone, always rendered left-to-right. REPLACE */
  phoneDisplay: '+20 100 000 0000',
  /** Optional second line shown on the contact page. */
  secondaryPhone: '',
  /** Optional emergency line (+ a short note per language) shown on the contact page. */
  emergency: { phone: '', note: { ar: '', en: '' } },

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
  } as Partial<Record<SocialNetwork, string>>,

  /**
   * Doctor portrait (about-page message, default video poster, social share image).
   * Best result: a transparent PNG/WebP cut-out (waist-up, ~1000×1250px).
   * Replace `/images/doctor-portrait.svg` with e.g. `/images/doctor-portrait.png`.
   */
  doctorPortrait: '/images/doctor-portrait.svg',

  /** Picture in the centre of every hero — same format as the portrait. Set in the CMS; defaults to the portrait. */
  heroImage: '/images/doctor-portrait.svg',

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
   * Landscape intro video (16:9), shown on both the home page and the about page. Provide a YouTube
   * video ID **or** a self-hosted MP4 path (e.g. '/videos/intro.mp4' placed in /public/videos).
   * Leave both empty to show the poster only.
   */
  videos: {
    intro: { youtubeId: '', src: '' } as VideoSource,
  },
};

export type SiteConfig = typeof defaults;
export type { SocialNetwork };

const filled = (value: string | null | undefined): string | undefined => value?.trim() || undefined;

function promoVideo(base: VideoSource, youtubeId: string | null, src: string | null, poster: string | null): VideoSource {
  if (!filled(youtubeId) && !filled(src)) return base;
  return { youtubeId: filled(youtubeId) ?? '', src: filled(src) ?? '', poster: filled(poster) };
}

function withCmsSettings(base: SiteConfig): SiteConfig {
  const s = cms?.settings;
  if (!s) return base;
  const doctorPortrait = filled(s.doctor_portrait_url) ?? base.doctorPortrait;
  return {
    ...base,
    phone: filled(s.phone) ?? base.phone,
    phoneDisplay: filled(s.phone_display) ?? filled(s.phone) ?? base.phoneDisplay,
    secondaryPhone: filled(s.secondary_phone) ?? base.secondaryPhone,
    emergency: {
      phone: filled(s.emergency_phone) ?? base.emergency.phone,
      note: { ar: filled(s.emergency_note_ar) ?? '', en: filled(s.emergency_note_en) ?? '' },
    },
    whatsappNumber: filled(s.whatsapp_number) ?? base.whatsappNumber,
    email: filled(s.email) ?? base.email,
    map: {
      query: filled(s.map_query) ?? base.map.query,
      directionsUrl: filled(s.map_directions_url) ?? base.map.directionsUrl,
    },
    // The CMS list is authoritative: a network without a URL is not shown at all.
    social: Object.fromEntries(Object.entries(s.social_links).filter(([, url]) => filled(url))),
    doctorPortrait,
    heroImage: filled(s.hero_image_url) ?? doctorPortrait,
    logo: filled(s.logo_url) ? { ...base.logo, full: { ...base.logo.full, src: s.logo_url! } } : base.logo,
    videos: {
      intro: promoVideo(base.videos.intro, s.intro_video_youtube_id, s.intro_video_url, s.intro_video_thumbnail_url),
    },
  };
}

export const siteConfig: SiteConfig = withCmsSettings(defaults);

/** Absolute URL for a site-relative asset path (CMS uploads are already absolute). */
export function absoluteUrl(path: string): string {
  return /^https?:\/\//.test(path) ? path : `${siteConfig.url}${path}`;
}
