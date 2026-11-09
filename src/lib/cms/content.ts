/**
 * Turns the build-time CMS snapshot into the shapes the site already renders:
 * the per-locale dictionary, the home-page highlights, the navbar and the footer links.
 * Without a snapshot (`cms === null`) every function returns the repository defaults.
 */
import { isIconKey, type IconKey } from '@/components/icons/registry';
import { isSceneKey, type SceneKey } from '@/components/services/TechniqueScene';
import { getServiceVisual, getTechniqueVisual, homeDefaults, isHomeSection, isTone, type HomeSection, type Tone } from '@/content/media';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/ar';
import { normalizePath } from './paths';
import { cms } from './snapshot';
import { getAtPath, getSectionDef, resolveSection, setAtPath } from './sections';
import type { CmsData, FaqLocation, NavigationRow, SocialNetwork, SpecialtyRow } from './types';

type Row = Record<string, unknown>;

/** Localised column value (`title` → `title_ar` / `title_en`), falling back to the other language. */
export function localized(row: Row, field: string, locale: Locale): string {
  const other: Locale = locale === 'ar' ? 'en' : 'ar';
  const value = row[`${field}_${locale}`];
  if (typeof value === 'string' && value.trim()) return value;
  const fallback = row[`${field}_${other}`];
  return typeof fallback === 'string' ? fallback : '';
}

function localizedList(row: Row, field: string, locale: Locale): string[] {
  const other: Locale = locale === 'ar' ? 'en' : 'ar';
  const own = row[`${field}_${locale}`];
  const list = Array.isArray(own) && own.length ? own : row[`${field}_${other}`];
  return Array.isArray(list) ? list.filter((item): item is string => typeof item === 'string' && item.trim() !== '') : [];
}

/** Article body: paragraphs separated by one or more blank lines. */
function paragraphs(text: string): string[] {
  return text
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.replace(/\s*\r?\n\s*/g, ' ').trim())
    .filter(Boolean);
}

type DictSpecialty = Dictionary['services']['specialties']['items'][number];

/** Where a specialty / technique also appears on the home page (`home`) and the short tag on that card. */
type HomePlacement = { home?: HomeSection; tag?: string };

/** A technique card; `scene` / `image` are dashboard choices (missing → defaults keyed by `id`). */
export type SpecialtyTechnique = DictSpecialty['techniques'][number] & HomePlacement & { scene?: SceneKey; image?: string };

/** A services-page specialty; `icon` / `tone` / `image` are dashboard choices (missing → defaults keyed by `id`). */
export type Specialty = Omit<DictSpecialty, 'techniques'> &
  HomePlacement & { techniques: SpecialtyTechnique[]; icon?: IconKey; tone?: Tone; image?: string };

function placement(row: { home_section?: string | null; tag?: string | null }): HomePlacement {
  return { home: isHomeSection(row.home_section) ? row.home_section : undefined, tag: row.tag?.trim() || undefined };
}

function toSpecialty(row: SpecialtyRow, locale: Locale): Specialty {
  const techniques = (Array.isArray(row.techniques) ? row.techniques : [])
    .map((entry) => ({
      id: entry.key,
      name: localized(entry, 'name', locale),
      detail: localized(entry, 'detail', locale),
      scene: isSceneKey(entry.scene) ? entry.scene : undefined,
      image: entry.image_url || undefined,
      ...placement(entry),
    }))
    .filter((technique) => technique.id && technique.name);
  return {
    id: row.key,
    title: localized(row, 'title', locale),
    short: localized(row, 'short', locale),
    summary: localized(row, 'summary', locale),
    description: localized(row, 'description', locale),
    conditions: localizedList(row, 'conditions', locale),
    techniques,
    duration: localized(row, 'duration', locale),
    recovery: localized(row, 'recovery', locale),
    icon: isIconKey(row.icon) ? row.icon : undefined,
    tone: isTone(row.tone) ? row.tone : undefined,
    image: row.image_url || undefined,
    ...placement(row),
  };
}

/**
 * Home placement + tags from the repository defaults (`homeDefaults`): used without the CMS, and for rows saved
 * before the home columns existed. `base` = the dictionary specialty with the same id (its default card text).
 */
function withHomeDefaults(item: Specialty, base?: DictSpecialty): Specialty {
  const defaults = (id: string): HomePlacement => ({ home: homeDefaults[id]?.section, tag: homeDefaults[id]?.tag });
  return {
    ...item,
    summary: item.summary || base?.summary || '',
    ...defaults(item.id),
    techniques: item.techniques.map((technique) => ({ ...technique, ...defaults(technique.id) })),
  };
}

/** A home-page service card: a specialty, or one technique of a specialty, chosen for that section. */
export type HomeCard = {
  key: string;
  title: string;
  description: string;
  tag?: string;
  image?: string;
  icon: IconKey;
  tone: Tone;
  /** Technique cards show the technique's animated illustration (when it has no photo). */
  scene?: SceneKey;
  /** Section on the services page the card opens: /services/#anchor */
  anchor: string;
};

/** Cards of one home section, in services-page order (each specialty, then its chosen techniques). */
function homeCards(specialties: Specialty[], section: HomeSection): HomeCard[] {
  return specialties.flatMap((specialty) => {
    const visual = getServiceVisual(specialty.id, { icon: specialty.icon, tone: specialty.tone, image: specialty.image });
    const cards: HomeCard[] = [];
    if (specialty.home === section) {
      cards.push({
        key: specialty.id,
        title: specialty.title,
        description: specialty.summary || specialty.description,
        tag: specialty.tag,
        image: visual.image,
        icon: visual.icon,
        tone: visual.tone,
        anchor: specialty.id,
      });
    }
    for (const technique of specialty.techniques) {
      if (technique.home !== section) continue;
      const media = getTechniqueVisual(technique.id, { scene: technique.scene, image: technique.image });
      cards.push({
        key: `${specialty.id}-${technique.id}`,
        title: technique.name,
        description: technique.detail,
        tag: technique.tag,
        image: media.image,
        icon: visual.icon,
        tone: visual.tone,
        scene: media.scene,
        anchor: specialty.id,
      });
    }
    return cards;
  });
}

type Review = Dictionary['reviews']['items'][number];
type Video = Dictionary['videos']['items'][number] & { youtubeId?: string; src?: string; poster?: string };
type Article = Dictionary['articles']['items'][number] & { image?: string };

export type HomeHighlights = {
  /** Picked on the services page ("الظهور في الصفحة الرئيسية" of each specialty / technique). */
  surgeries: HomeCard[];
  treatments: HomeCard[];
  reviews: Review[];
  videos: Video[];
  articles: Article[];
};

export type SiteContent = { dictionary: Dictionary; home: HomeHighlights };

const HOME_GRID_SIZE = 3;

function defaultHome(t: Dictionary): HomeHighlights {
  const specialties = t.services.specialties.items.map((item) => withHomeDefaults(item, item));
  return {
    surgeries: homeCards(specialties, 'surgeries'),
    treatments: homeCards(specialties, 'treatments'),
    reviews: t.reviews.items,
    videos: t.videos.items.slice(0, HOME_GRID_SIZE),
    articles: t.articles.items.slice(0, HOME_GRID_SIZE),
  };
}

/** Featured items, or the first ones when nothing is flagged (so the home page never goes empty by accident). */
function featured<T>(items: T[], flags: boolean[], limit?: number): T[] {
  const picked = items.filter((_, index) => flags[index]);
  const list = picked.length ? picked : items;
  return limit ? list.slice(0, limit) : list;
}

export function buildSiteContent(locale: Locale, base: Dictionary): SiteContent {
  const data = cms;
  if (!data) return { dictionary: base, home: defaultHome(base) };

  const t = structuredClone(base);
  applySections(t, data, locale);
  applySettings(t, data, locale);

  // Services page specialties — also the footer "Specialties" column and the home surgeries / treatments cards.
  // Until the table exists, the repository defaults stay; until the home columns exist, the default home picks.
  const baseItems = base.services.specialties.items;
  const rows = Array.isArray(data.specialties) ? data.specialties : null;
  const hasHomeColumns = rows?.some((row) => 'home_section' in row) ?? false;
  const specialties: Specialty[] = rows
    ? rows.map((row) => {
        const item = toSpecialty(row, locale);
        return hasHomeColumns ? item : withHomeDefaults(item, baseItems.find((entry) => entry.id === item.id));
      })
    : baseItems.map((item) => withHomeDefaults(item, item));
  t.services.specialties.items = specialties;

  const reviews: Review[] = data.reviews.map((row) => ({
    name: localized(row, 'patient_name', locale),
    procedure: localized(row, 'procedure_type', locale),
    rating: row.rating,
    quote: localized(row, 'review_text', locale),
  }));
  t.reviews.items = reviews;

  const videos: Video[] = data.videos.map((row) => ({
    id: row.id,
    title: localized(row, 'title', locale),
    category: localized(row, 'category', locale),
    duration: row.duration ?? '',
    youtubeId: row.youtube_id ?? '',
    src: row.video_file_url ?? '',
    poster: row.thumbnail_file_url ?? undefined,
  }));
  t.videos.items = videos;

  // The hero article leads the list: the articles page shows the first item as its featured card.
  const articleRows = [...data.articles].sort((a, b) => Number(b.is_hero_article) - Number(a.is_hero_article));
  const articles: Article[] = articleRows.map((row) => ({
    slug: row.slug,
    category: localized(row, 'category', locale),
    title: localized(row, 'title', locale),
    excerpt: localized(row, 'summary', locale),
    readTime: row.read_time_minutes,
    date: row.published_on,
    body: paragraphs(localized(row, 'content', locale)),
    takeaways: localizedList(row, 'takeaways', locale),
    image: row.featured_image_url ?? undefined,
  }));
  t.articles.items = articles;

  const faqsAt = (location: FaqLocation) =>
    data.faqs.filter((row) => row.page_location === location).map((row) => ({ q: localized(row, 'question', locale), a: localized(row, 'answer', locale) }));
  t.home.faq.items = faqsAt('home');
  for (const group of t.services.faq.groups) group.items = faqsAt(`services_${group.id}` as FaqLocation);

  return {
    dictionary: t,
    home: {
      surgeries: homeCards(specialties, 'surgeries'),
      treatments: homeCards(specialties, 'treatments'),
      reviews: featured(reviews, data.reviews.map((row) => row.is_featured_on_home)),
      videos: featured(videos, data.videos.map((row) => row.is_featured_on_home), HOME_GRID_SIZE),
      articles: featured(articles, articleRows.map((row) => row.is_featured_on_home), HOME_GRID_SIZE),
    },
  };
}

function applySections(t: Dictionary, data: CmsData, locale: Locale) {
  const root = t as unknown as Record<string, unknown>;
  for (const row of data.sections) {
    const def = getSectionDef(row.section_key);
    if (!def) continue;
    const override = locale === 'ar' ? row.content_ar : row.content_en;
    setAtPath(root, def.key, resolveSection(def, getAtPath(root, def.key), override));
  }
}

function applySettings(t: Dictionary, data: CmsData, locale: Locale) {
  const settings = data.settings;
  if (settings) {
    const title = localized(settings, 'site_title', locale);
    if (title) {
      t.meta.defaultTitle = title;
      t.meta.titleTemplate = `%s | ${title}`;
    }
    t.clinic.address = localized(settings, 'address', locale) || t.clinic.address;
    const hours = settings.opening_hours
      .map((slot) => ({ days: localized(slot, 'days', locale), time: localized(slot, 'time', locale) }))
      .filter((slot) => slot.days || slot.time);
    if (hours.length) t.clinic.hours = hours;
  }

  const footer = data.footer;
  if (footer) {
    t.footer.about = localized(footer, 'about', locale) || t.footer.about;
    t.footer.rights = localized(footer, 'copyright', locale) || t.footer.rights;
  }

  // Navbar labels also name the pages in breadcrumbs.
  const labels = t.nav as Record<string, string>;
  for (const row of data.navigation) {
    const page = Object.keys(labels).find((key) => pagePathOf(key) === normalizePath(row.path));
    if (page) labels[page] = localized(row, 'label', locale);
  }
}

// ─── Navigation & footer ───────────────────────────────────────────────────────

export type NavLink = {
  key: string;
  label: string;
  /** Internal path without locale prefix (for the active state), or the absolute URL. */
  path: string;
  external: boolean;
  children: NavLink[];
};

const defaultPagePaths: Record<string, string> = {
  home: '/',
  about: '/about/',
  services: '/services/',
  reviews: '/reviews/',
  videos: '/videos/',
  articles: '/articles/',
  contact: '/contact/',
};

function pagePathOf(page: string): string | undefined {
  return defaultPagePaths[page];
}

function toLink(row: NavigationRow, locale: Locale, children: NavLink[] = []): NavLink {
  const path = normalizePath(row.path);
  return { key: row.id, label: localized(row, 'label', locale), path, external: /^https?:/.test(path), children };
}

/** Navbar links (with optional dropdown children) from `navigation_menu`, or `null` to use the default pages. */
export function cmsNavigation(locale: Locale): NavLink[] | null {
  if (!cms?.navigation.length) return null;
  const rows = cms.navigation;
  const ids = new Set(rows.map((row) => row.id));
  return rows
    .filter((row) => !row.parent_id || !ids.has(row.parent_id))
    .map((row) => toLink(row, locale, rows.filter((child) => child.parent_id === row.id).map((child) => toLink(child, locale))));
}

/** Footer quick links from `footer_settings`, or `null` to mirror the default pages. */
export function cmsFooterLinks(locale: Locale): NavLink[] | null {
  const links = cms?.footer?.quick_links;
  if (!links?.length) return null;
  return links
    .filter((link) => link.path?.trim())
    .map((link, index) => {
      const path = normalizePath(link.path);
      return { key: `${index}-${path}`, label: localized(link, 'label', locale), path, external: /^https?:/.test(path), children: [] };
    });
}

export const cmsSiteFlags = {
  showBookCta: cms?.settings?.nav_cta_enabled ?? true,
  showFooterSpecialties: cms?.footer?.show_specialties ?? true,
  /** `false` hides a network from the footer (it stays in the hero contact bar). */
  footerSocial: (cms?.footer?.social_visibility ?? {}) as Partial<Record<SocialNetwork, boolean>>,
};
