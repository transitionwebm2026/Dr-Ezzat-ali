import { buildSiteContent, type HomeHighlights } from '@/lib/cms/content';
import ar, { type Dictionary } from './dictionaries/ar';
import en from './dictionaries/en';
import type { Locale } from './config';

/** Repository defaults with the published CMS content (Supabase) applied at build time. */
const content = { ar: buildSiteContent('ar', ar), en: buildSiteContent('en', en) };

export function getDictionary(locale: Locale): Dictionary {
  return content[locale].dictionary;
}

/** Reviews, videos and articles flagged "featured on home" in the CMS. */
export function getHomeHighlights(locale: Locale): HomeHighlights {
  return content[locale].home;
}

export type { Dictionary };
export * from './config';
