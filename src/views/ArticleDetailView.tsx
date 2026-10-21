import { CalendarDays, Clock, Lightbulb, ShieldAlert } from 'lucide-react';
import { ArticleCard, type ArticleSummary } from '@/components/cards/ArticleCard';
import { PageCTA } from '@/components/cta/PageCTA';
import { pageCrumbs } from '@/components/hero/HeroActions';
import { BrandIcon } from '@/components/icons/BrandIcon';
import { ArrowForward } from '@/components/icons/registry';
import { JsonLd } from '@/components/layout/JsonLd';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ButtonLink } from '@/components/ui/Button';
import { Container, Section } from '@/components/ui/Container';
import { LogoMark } from '@/components/ui/Logo';
import { OpticArt } from '@/components/ui/OpticArt';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { siteConfig } from '@/config/site';
import { getArticleVisual } from '@/content/media';
import { getDictionary, localePath, pagePaths, type Dictionary, type Locale } from '@/i18n';
import { whatsappUrl } from '@/lib/contact';
import { formatDate } from '@/lib/format';

/** Dictionary article + the optional cover photo uploaded in the CMS. */
type Article = Dictionary['articles']['items'][number] & Pick<ArticleSummary, 'image'>;

export function getArticle(locale: Locale, slug: string): Article | undefined {
  return getDictionary(locale).articles.items.find((article) => article.slug === slug);
}

export function ArticleDetailView({ locale, slug }: { locale: Locale; slug: string }) {
  const t = getDictionary(locale);
  const article = getArticle(locale, slug);
  if (!article) return null;

  const visual = getArticleVisual(slug);
  const related = t.articles.items.filter((item) => item.slug !== slug).slice(0, 3);
  const hrefFor = (s: string) => localePath(locale, `${pagePaths.articles}${s}/`);
  const articlesHref = localePath(locale, pagePaths.articles);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'MedicalWebPage',
          headline: article.title,
          description: article.excerpt,
          datePublished: article.date,
          inLanguage: locale,
          url: `${siteConfig.url}${hrefFor(slug)}`,
          author: { '@id': `${siteConfig.url}/#physician` },
        }}
      />

      {/* Article header */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-surface-tint via-white to-white pb-12 pt-[calc(var(--header-h)+3rem)]">
        <div aria-hidden className="mask-radial absolute inset-0 -z-10 bg-grid opacity-70" />
        <Container className="flex max-w-4xl flex-col items-center text-center">
          <div className="animate-fade-in-up">
            <Breadcrumb items={pageCrumbs(locale, 'articles', [{ label: article.category }])} />
          </div>
          <h1 className="mt-7 animate-fade-in-up text-3xl [animation-delay:80ms] sm:text-4xl lg:text-5xl lg:leading-[1.2]">{article.title}</h1>
          <div className="mt-7 flex animate-fade-in-up flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-500 [animation-delay:240ms]">
            <span className="flex items-center gap-2.5">
              <LogoMark className="size-9" />
              <span className="text-start leading-tight">
                <span className="block font-heading font-bold text-secondary-700">{t.doctor.name}</span>
                <span className="block text-xs">{t.doctor.title}</span>
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays aria-hidden className="size-4 text-primary" />
              {t.common.publishedOn} <time dateTime={article.date}>{formatDate(article.date, locale)}</time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock aria-hidden className="size-4 text-primary" />
              {article.readTime} {t.common.minRead}
            </span>
          </div>
        </Container>
      </section>

      <Container className="max-w-5xl">
        <div className="animate-focus-in [animation-delay:200ms]">
          <OpticArt
            tone={visual.tone}
            icon={visual.icon}
            image={article.image ?? visual.image}
            imageAlt={article.title}
            iconSize="lg"
            focal="center"
            sizes="(min-width: 1024px) 1000px, 100vw"
            className="aspect-[16/9] rounded-[2rem] shadow-elevated sm:aspect-[21/9]"
          />
        </div>
      </Container>

      {/* Body */}
      <article className="py-14 sm:py-20">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="border-primary ps-5 font-heading text-xl font-bold leading-relaxed text-secondary-700 ltr:border-l-4 rtl:border-r-4 sm:text-2xl">
              {article.excerpt}
            </p>
          </Reveal>
          <div className="mt-10 space-y-6 text-base leading-loose text-slate-600 sm:text-lg">
            {article.body.map((paragraph, index) => (
              <Reveal key={index} y={16}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>

          {article.takeaways.length > 0 && (
            <Reveal className="mt-12">
              <aside className="relative overflow-hidden rounded-3xl border border-primary-100 bg-gradient-to-br from-primary-50 via-white to-surface-tint p-7 sm:p-8">
                <h2 className="flex items-center gap-3 text-xl">
                  <span className="grid size-10 place-items-center rounded-xl bg-brand-gradient text-white shadow-glow">
                    <Lightbulb aria-hidden className="size-5" />
                  </span>
                  {t.common.keyTakeaways}
                </h2>
                <ul className="mt-6 space-y-3">
                  {article.takeaways.map((takeaway, i) => (
                    <li key={i} className="flex items-start gap-3 font-medium text-secondary-700">
                      <span dir="ltr" className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white font-heading text-xs font-bold text-primary-600 shadow-sm ring-1 ring-primary-100">
                        {i + 1}
                      </span>
                      {takeaway}
                    </li>
                  ))}
                </ul>
              </aside>
            </Reveal>
          )}

          <p className="mt-8 flex items-start gap-2 text-sm text-slate-400">
            <ShieldAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
            {t.common.medicalDisclaimer}
          </p>

          <div className="mt-10 flex flex-wrap gap-3 border-t border-slate-100 pt-8">
            <ButtonLink href={articlesHref} variant="outline">
              <ArrowForward className="size-4 rotate-180" />
              {t.common.backToArticles}
            </ButtonLink>
            <ButtonLink href={whatsappUrl(t.whatsapp.defaultMessage)} variant="whatsapp">
              <BrandIcon name="whatsapp" className="size-5" />
              {t.common.chatOnWhatsapp}
            </ButtonLink>
          </div>
        </Container>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <Section tone="surface">
          <Container>
            <SectionHeading title={t.common.relatedArticles} />
            <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <StaggerItem key={item.slug} className="h-full">
                  <ArticleCard
                    article={item}
                    href={hrefFor(item.slug)}
                    locale={locale}
                    labels={{ minRead: t.common.minRead, readArticle: t.common.readArticle }}
                  />
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </Section>
      )}

      <PageCTA locale={locale} title={t.cta.articles.title} subtitle={t.cta.articles.subtitle} />
    </>
  );
}
