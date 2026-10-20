import type { Locale } from '@/i18n/config';

const intlLocale: Record<Locale, string> = { ar: 'ar-EG', en: 'en-GB' };

/**
 * Formats an ISO date (YYYY-MM-DD) for display. Parsed as a local calendar date and
 * rendered with Latin digits so server and client output always match.
 */
export function formatDate(iso: string, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat(intlLocale[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
    numberingSystem: 'latn',
    ...options,
  }).format(date);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
}
