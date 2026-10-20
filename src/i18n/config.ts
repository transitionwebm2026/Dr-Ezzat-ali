export const locales = ['ar', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ar';

export const localeMeta: Record<Locale, { dir: 'rtl' | 'ltr'; label: string; short: string; htmlLang: string; ogLocale: string }> = {
  ar: { dir: 'rtl', label: 'العربية', short: 'ع', htmlLang: 'ar', ogLocale: 'ar_EG' },
  en: { dir: 'ltr', label: 'English', short: 'EN', htmlLang: 'en', ogLocale: 'en_US' },
};

export type PageKey = 'home' | 'about' | 'services' | 'reviews' | 'videos' | 'articles' | 'contact';

export const pagePaths: Record<PageKey, string> = {
  home: '/',
  about: '/about/',
  services: '/services/',
  reviews: '/reviews/',
  videos: '/videos/',
  articles: '/articles/',
  contact: '/contact/',
};

export const navOrder: PageKey[] = ['home', 'about', 'services', 'reviews', 'videos', 'articles', 'contact'];

/**
 * Builds a locale-aware internal URL.
 * Arabic is the default locale and lives at the site root; English is prefixed with `/en`.
 *   localePath('ar', '/about/') → '/about/'
 *   localePath('en', '/about/') → '/en/about/'
 */
export function localePath(locale: Locale, path: string = '/'): string {
  const [pathname, hash] = path.split('#');
  let clean = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (!clean.endsWith('/')) clean = `${clean}/`;
  const prefixed = locale === defaultLocale ? clean : clean === '/' ? `/${locale}/` : `/${locale}${clean}`;
  return hash ? `${prefixed}#${hash}` : prefixed;
}

/** Strips the locale prefix and returns a normalised pathname ending with "/". */
export function stripLocale(pathname: string): string {
  let path = pathname || '/';
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (path === `/${locale}` || path === `/${locale}/`) return '/';
    if (path.startsWith(`/${locale}/`)) path = path.slice(locale.length + 1);
  }
  return path.endsWith('/') ? path : `${path}/`;
}

/** Same page in the other language — used by the language switcher. */
export function switchLocalePath(pathname: string, target: Locale): string {
  return localePath(target, stripLocale(pathname));
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
