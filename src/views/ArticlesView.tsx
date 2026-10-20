import { ArticleCard, FeaturedArticleCard } from '@/components/cards/ArticleCard';
import { PageCTA } from '@/components/cta/PageCTA';
import { PageHeroActions, pageCrumbs } from '@/components/hero/HeroActions';
import { UnifiedHero } from '@/components/hero/UnifiedHero';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { Container, Section } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getDictionary, localePath, pagePaths, type Locale } from '@/i18n';

export function ArticlesView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const articles = t.articles;
  const [featured, ...rest] = articles.items;
  const labels = { minRead: t.common.minRead, readArticle: t.common.readArticle };
  const hrefFor = (slug: string) => localePath(locale, `${pagePaths.articles}${slug}/`);

  return (
    <>
      {/* 1 · Hero */}
      <UnifiedHero
        locale={locale}
        title={articles.hero.title}
        highlight={articles.hero.highlight}
        lead={articles.hero.lead}
        actions={<PageHeroActions locale={locale} />}
        breadcrumb={pageCrumbs(locale, 'articles')}
        portraitAlt={t.doctor.portraitAlt}
      />

      {/* 2 · Featured article */}
      <section className="relative pt-16 sm:pt-20">
        <Container>
          <Reveal scale={0.97}>
            <FeaturedArticleCard article={featured} href={hrefFor(featured.slug)} locale={locale} labels={{ ...labels, featured: articles.featuredLabel }} />
          </Reveal>
        </Container>
      </section>

      {/* 3 · Articles grid (3 × 2) */}
      <Section>
        <Container>
          <SectionHeading title={articles.grid.title} subtitle={articles.grid.subtitle} />
          <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {rest.slice(0, 6).map((article) => (
              <StaggerItem key={article.slug} className="h-full">
                <ArticleCard article={article} href={hrefFor(article.slug)} locale={locale} labels={labels} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* 4 · Page CTA */}
      <PageCTA locale={locale} title={t.cta.articles.title} subtitle={t.cta.articles.subtitle} />
    </>
  );
}
