import type { Metadata, Viewport } from 'next';
import { siteConfig } from '@/config/site';
import { getDictionary, localeMeta, localePath, pagePaths, type Locale, type PageKey } from '@/i18n';

/** Site-wide defaults, set once per root layout. */
export function rootMetadata(locale: Locale): Metadata {
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t.meta.defaultTitle, template: t.meta.titleTemplate },
    description: t.meta.description,
    applicationName: t.meta.siteName,
    authors: [{ name: t.doctor.name }],
    creator: t.doctor.name,
    formatDetection: { telephone: false, email: false, address: false },
    robots: { index: true, follow: true },
  };
}

export const rootViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#07508C',
  colorScheme: 'light',
};

type BuildMetadataInput = {
  locale: Locale;
  /** Path without locale prefix, e.g. '/about/'. */
  path: string;
  title: string;
  description: string;
  /** Use the full title as-is (skips the "%s | site" template). */
  absoluteTitle?: boolean;
  type?: 'website' | 'article';
};

export function buildMetadata({ locale, path, title, description, absoluteTitle, type = 'website' }: BuildMetadataInput): Metadata {
  const dict = getDictionary(locale);
  const canonical = localePath(locale, path);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: dict.meta.keywords,
    alternates: {
      canonical,
      languages: {
        ar: localePath('ar', path),
        en: localePath('en', path),
        'x-default': localePath('ar', path),
      },
    },
    openGraph: {
      type,
      url: canonical,
      title: absoluteTitle ? title : `${title} | ${dict.meta.siteName}`,
      description,
      siteName: dict.meta.siteName,
      locale: localeMeta[locale].ogLocale,
      alternateLocale: locale === 'ar' ? localeMeta.en.ogLocale : localeMeta.ar.ogLocale,
      images: [{ url: siteConfig.doctorPortrait, alt: dict.doctor.portraitAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: absoluteTitle ? title : `${title} | ${dict.meta.siteName}`,
      description,
    },
  };
}

/** Metadata for one of the 7 primary pages. */
export function pageMetadata(locale: Locale, page: PageKey): Metadata {
  const dict = getDictionary(locale);
  const { title, description } = dict.meta.pages[page];
  return buildMetadata({
    locale,
    path: pagePaths[page],
    title: page === 'home' ? dict.meta.defaultTitle : title,
    description,
    absoluteTitle: page === 'home',
  });
}

export function articleMetadata(locale: Locale, slug: string): Metadata {
  const article = getDictionary(locale).articles.items.find((item) => item.slug === slug);
  if (!article) return {};
  return buildMetadata({
    locale,
    path: `${pagePaths.articles}${slug}/`,
    title: article.title,
    description: article.excerpt,
    type: 'article',
  });
}

/** Static params for article detail pages (identical slugs in both languages). */
export function articleParams(): { slug: string }[] {
  const params = getDictionary('ar').articles.items.map((article) => ({ slug: article.slug }));
  // `output: 'export'` rejects an empty list; the placeholder slug simply renders the 404 page.
  return params.length ? params : [{ slug: 'none' }];
}
