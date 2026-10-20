import ar, { type Dictionary } from './dictionaries/ar';
import en from './dictionaries/en';
import type { Locale } from './config';

const dictionaries: Record<Locale, Dictionary> = { ar, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
export * from './config';
