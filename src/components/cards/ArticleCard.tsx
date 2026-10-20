import { CalendarDays, Clock } from 'lucide-react';
import Link from 'next/link';
import { ArrowForward } from '@/components/icons/registry';
import { ButtonLink } from '@/components/ui/Button';
import { OpticArt } from '@/components/ui/OpticArt';
import { getArticleVisual } from '@/content/media';
import type { Locale } from '@/i18n/config';
import { formatDate } from '@/lib/format';

export type ArticleSummary = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: number;
  date: string;
};

type ArticleLabels = { minRead: string; readArticle: string };

function ArticleMeta({ article, locale, minRead }: { article: ArticleSummary; locale: Locale; minRead: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 sm:text-[0.8rem]">
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays aria-hidden className="size-3.5" />
        <time dateTime={article.date}>{formatDate(article.date, locale)}</time>
      </span>
      <span aria-hidden className="size-1 rounded-full bg-slate-300" />
      <span className="inline-flex items-center gap-1.5">
        <Clock aria-hidden className="size-3.5" />
        {article.readTime} {minRead}
      </span>
    </div>
  );
}

export function ArticleCard({ article, href, locale, labels }: { article: ArticleSummary; href: string; locale: Locale; labels: ArticleLabels }) {
  const visual = getArticleVisual(article.slug);

  return (
    <article className="card card-hover group flex h-full flex-col overflow-hidden p-2">
      <OpticArt tone={visual.tone} icon={visual.icon} image={visual.image} imageAlt={article.title} className="aspect-[16/10] rounded-[1.25rem]">
        <span className="absolute bottom-4 start-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-secondary-700 shadow-sm backdrop-blur">
          {article.category}
        </span>
      </OpticArt>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <ArticleMeta article={article} locale={locale} minRead={labels.minRead} />
        <h3 className="mt-3 text-lg leading-snug sm:text-xl">
          <Link href={href} className="transition-colors after:absolute after:inset-0 after:rounded-3xl group-hover:text-primary-700">
            {article.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 flex-1 text-[0.95rem] text-slate-500">{article.excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-2 font-heading text-sm font-bold text-primary-600">
          {labels.readArticle}
          <ArrowForward className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </span>
      </div>
    </article>
  );
}

export function FeaturedArticleCard({
  article,
  href,
  locale,
  labels,
}: {
  article: ArticleSummary;
  href: string;
  locale: Locale;
  labels: ArticleLabels & { featured: string };
}) {
  const visual = getArticleVisual(article.slug);

  return (
    <article className="card group grid overflow-hidden p-2 hover:shadow-elevated lg:grid-cols-2">
      <OpticArt
        tone={visual.tone}
        icon={visual.icon}
        image={visual.image}
        imageAlt={article.title}
        iconSize="lg"
        focal="center"
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="min-h-[260px] rounded-[1.5rem] sm:min-h-[340px]"
      >
        <span className="glass absolute bottom-5 start-5 rounded-full px-4 py-1.5 font-heading text-sm font-bold text-secondary-700">
          {labels.featured}
        </span>
      </OpticArt>
      <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
        <h2 className="text-2xl leading-snug sm:text-3xl lg:text-[2.1rem]">{article.title}</h2>
        <div className="mt-4">
          <ArticleMeta article={article} locale={locale} minRead={labels.minRead} />
        </div>
        <p className="mt-5 text-base text-slate-500 sm:text-lg">{article.excerpt}</p>
        <div className="mt-8">
          <ButtonLink href={href}>
            {labels.readArticle}
            <ArrowForward className="size-4" />
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
