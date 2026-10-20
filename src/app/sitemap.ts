import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { getDictionary, localePath, locales, navOrder, pagePaths } from '@/i18n';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...navOrder.map((key) => pagePaths[key]),
    ...getDictionary('ar').articles.items.map((article) => `${pagePaths.articles}${article.slug}/`),
  ];
  const lastModified = new Date();

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${siteConfig.url}${localePath(locale, path)}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: path === '/' ? 1 : path.split('/').filter(Boolean).length > 1 ? 0.6 : 0.8,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${siteConfig.url}${localePath(l, path)}`])),
      },
    })),
  );
}
