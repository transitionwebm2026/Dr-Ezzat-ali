/**
 * Row types for the Supabase CMS tables (see supabase/migrations/*_cms_schema.sql).
 * Bilingual columns come in `_ar` / `_en` pairs.
 */

export const socialNetworks = ['facebook', 'instagram', 'youtube', 'tiktok'] as const;
export type SocialNetwork = (typeof socialNetworks)[number];

export type OpeningHoursSlot = { days_ar: string; time_ar: string; days_en: string; time_en: string };

export type SiteSettingsRow = {
  id: number;
  site_title_ar: string | null;
  site_title_en: string | null;
  logo_url: string | null;
  doctor_portrait_url: string | null;
  hero_image_url: string | null;
  phone: string | null;
  phone_display: string | null;
  secondary_phone: string | null;
  whatsapp_number: string | null;
  email: string | null;
  emergency_phone: string | null;
  emergency_note_ar: string | null;
  emergency_note_en: string | null;
  address_ar: string | null;
  address_en: string | null;
  map_query: string | null;
  map_directions_url: string | null;
  opening_hours: OpeningHoursSlot[];
  social_links: Partial<Record<SocialNetwork, string>>;
  nav_cta_enabled: boolean;
  /** One intro video, shown on both the home page and the about page. */
  intro_video_youtube_id: string | null;
  intro_video_url: string | null;
  intro_video_thumbnail_url: string | null;
  updated_at: string;
};

export type QuickLink = { label_ar: string; label_en: string; path: string };

export type FooterSettingsRow = {
  id: number;
  about_ar: string | null;
  about_en: string | null;
  copyright_ar: string | null;
  copyright_en: string | null;
  quick_links: QuickLink[];
  social_visibility: Partial<Record<SocialNetwork, boolean>>;
  show_specialties: boolean;
  updated_at: string;
};

export type NavigationRow = {
  id: string;
  parent_id: string | null;
  label_ar: string;
  label_en: string;
  path: string;
  sort_order: number;
  is_active: boolean;
};

export type PageSectionRow = {
  section_key: string;
  page: string;
  content_ar: unknown;
  content_en: unknown;
  updated_at: string;
};

type Ordered = { id: string; sort_order: number; is_published: boolean; created_at: string; updated_at: string };

/** Home-page section a specialty / technique card appears in (`HomeSection`); NULL = not on the home page. */
type HomeColumns = { home_section?: string | null; tag?: string | null };

/** One technique card inside a specialty (`specialties.techniques` jsonb array). */
export type TechniqueEntry = HomeColumns & {
  /** Stable English id, unique inside the specialty. */
  key: string;
  name_ar: string;
  name_en: string;
  detail_ar: string;
  detail_en: string;
  /** Animated illustration (`SceneKey`), used while no photo is set. */
  scene: string | null;
  image_url: string | null;
};

/**
 * Deep-dive specialty on the services page (quick-jump card + detail section + footer link), and the source
 * of the home-page service cards. The home columns are optional: they are added by a later migration.
 */
export type SpecialtyRow = Ordered & HomeColumns & {
  /** Short text of its home-page card (empty → the description). */
  summary_ar?: string;
  summary_en?: string;
  /** Anchor on the services page: /services/#key */
  key: string;
  title_ar: string;
  title_en: string;
  short_ar: string;
  short_en: string;
  description_ar: string;
  description_en: string;
  conditions_ar: string[];
  conditions_en: string[];
  techniques: TechniqueEntry[];
  duration_ar: string;
  duration_en: string;
  recovery_ar: string;
  recovery_en: string;
  /** `IconKey` / `Tone`; NULL = the default for `key` (src/content/media.ts). */
  icon: string | null;
  tone: string | null;
  image_url: string | null;
};

export type ReviewRow = Ordered & {
  patient_name_ar: string;
  patient_name_en: string;
  rating: number;
  review_text_ar: string;
  review_text_en: string;
  procedure_type_ar: string;
  procedure_type_en: string;
  is_featured_on_home: boolean;
};

export type VideoRow = Ordered & {
  title_ar: string;
  title_en: string;
  category_ar: string;
  category_en: string;
  duration: string | null;
  video_file_url: string | null;
  thumbnail_file_url: string | null;
  youtube_id: string | null;
  is_featured_on_home: boolean;
};

export type ArticleRow = Ordered & {
  slug: string;
  category_ar: string;
  category_en: string;
  title_ar: string;
  title_en: string;
  summary_ar: string;
  summary_en: string;
  content_ar: string;
  content_en: string;
  takeaways_ar: string[];
  takeaways_en: string[];
  read_time_minutes: number;
  published_on: string;
  featured_image_url: string | null;
  is_featured_on_home: boolean;
  is_hero_article: boolean;
};

export type FaqLocation = 'home' | 'services_before' | 'services_after';

export type FaqRow = Ordered & {
  page_location: FaqLocation;
  question_ar: string;
  question_en: string;
  answer_ar: string;
  answer_en: string;
};

export const consultationStatuses = ['new', 'contacted', 'booked', 'completed', 'cancelled'] as const;
export type ConsultationStatus = (typeof consultationStatuses)[number];

export type ConsultationRow = {
  id: string;
  patient_name: string;
  phone: string;
  preferred_date: string | null;
  consultation_type: string | null;
  notes: string | null;
  locale: 'ar' | 'en';
  status: ConsultationStatus;
  created_at: string;
};

/** Published content pulled from Supabase at build time by scripts/cms-pull.mjs. */
export type CmsData = {
  source: 'supabase';
  fetchedAt: string;
  settings: SiteSettingsRow | null;
  footer: FooterSettingsRow | null;
  navigation: NavigationRow[];
  sections: PageSectionRow[];
  /** `null` / missing = the `specialties` table does not exist yet (migration not run): repository defaults are used. */
  specialties?: SpecialtyRow[] | null;
  reviews: ReviewRow[];
  videos: VideoRow[];
  articles: ArticleRow[];
  faqs: FaqRow[];
};

/** `local` = Supabase not configured: the site is built from the defaults in the repository. */
export type CmsSnapshot = { source: 'local' } | CmsData;
