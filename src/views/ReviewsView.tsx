import { ReviewCard } from '@/components/cards/ReviewCard';
import { PageCTA } from '@/components/cta/PageCTA';
import { PageHeroActions, pageCrumbs } from '@/components/hero/HeroActions';
import { UnifiedHero } from '@/components/hero/UnifiedHero';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { Container, Section } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getDictionary, type Locale } from '@/i18n';

export function ReviewsView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const reviews = t.reviews;

  return (
    <>
      {/* 1 · Hero */}
      <UnifiedHero
        locale={locale}
        title={reviews.hero.title}
        highlight={reviews.hero.highlight}
        lead={reviews.hero.lead}
        actions={<PageHeroActions locale={locale} />}
        breadcrumb={pageCrumbs(locale, 'reviews')}
        portraitAlt={t.doctor.portraitAlt}
      />

      {/* 2 · Reviews grid (3 × 3) */}
      <Section tone="tint">
        <Container>
          <SectionHeading title={reviews.grid.title} subtitle={reviews.grid.subtitle} />
          <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {reviews.items.map((review, index) => (
              <StaggerItem key={`${review.name}-${index}`} className="h-full">
                <ReviewCard review={review} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* 3 · Page CTA */}
      <PageCTA locale={locale} title={t.cta.reviews.title} subtitle={t.cta.reviews.subtitle} />
    </>
  );
}
