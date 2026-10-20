import { ArticleCard } from '@/components/cards/ArticleCard';
import { VideoCard } from '@/components/cards/VideoCard';
import { PageCTA } from '@/components/cta/PageCTA';
import { FaqSection } from '@/components/faq/FaqSection';
import { HomeHeroActions } from '@/components/hero/HeroActions';
import { UnifiedHero } from '@/components/hero/UnifiedHero';
import { IntroSection } from '@/components/home/IntroSection';
import { ServicesShowcase } from '@/components/home/ServicesShowcase';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { ArrowForward } from '@/components/icons/registry';
import { PatientJourney } from '@/components/journey/PatientJourney';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { ReviewSlider } from '@/components/reviews/ReviewSlider';
import { StatsBar } from '@/components/stats/StatsBar';
import { ButtonLink } from '@/components/ui/Button';
import { Container, Section } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getDictionary, localeMeta, localePath, pagePaths, type Locale } from '@/i18n';

function SectionCta({ href, label }: { href: string; label: string }) {
  return (
    <Reveal className="mt-12 flex justify-center">
      <ButtonLink href={href} variant="secondary" size="lg">
        {label}
        <ArrowForward className="size-4" />
      </ButtonLink>
    </Reveal>
  );
}

export function HomeView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const home = t.home;
  const dir = localeMeta[locale].dir;

  return (
    <>
      {/* 1 · Hero */}
      <UnifiedHero
        locale={locale}
        variant="home"
        title={home.hero.title}
        highlight={home.hero.highlight}
        lead={home.hero.lead}
        actions={<HomeHeroActions locale={locale} />}
        portraitAlt={t.doctor.portraitAlt}
      />

      {/* 2 · About video & intro */}
      <IntroSection locale={locale} />

      {/* 3 · Counter stats */}
      <StatsBar items={t.stats.items} />

      {/* 4 · Key surgeries */}
      <ServicesShowcase locale={locale} content={home.surgeries} cardCta={t.common.learnMore} id="surgeries" />

      {/* 5 · Key treatments & medical services */}
      <ServicesShowcase locale={locale} content={home.treatments} cardCta={t.common.learnMore} tone="tint" id="treatments" />

      {/* 6 · Why choose us */}
      <WhyChooseUs content={home.why} />

      {/* 7 · Patient journey */}
      <Section>
        <Container>
          <SectionHeading title={home.journey.title} subtitle={home.journey.subtitle} />
          <Reveal>
            <PatientJourney steps={home.journey.steps} stepLabel={t.common.step} dir={dir} />
          </Reveal>
        </Container>
      </Section>

      {/* 8 · Reviews slider */}
      <Section tone="tint">
        <Container>
          <SectionHeading title={home.reviews.title} subtitle={home.reviews.subtitle} />
          <Reveal>
            <ReviewSlider
              reviews={t.reviews.items}
              dir={dir}
              labels={{ previous: t.common.previous, next: t.common.next, goToSlide: t.common.goToSlide, of: t.common.of }}
            />
          </Reveal>
          <SectionCta href={localePath(locale, pagePaths.reviews)} label={home.reviews.cta} />
        </Container>
      </Section>

      {/* 9 · Featured videos */}
      <Section>
        <Container>
          <SectionHeading title={home.videos.title} subtitle={home.videos.subtitle} />
          <Stagger className="mx-auto grid max-w-sm gap-6 min-[560px]:max-w-none min-[560px]:grid-cols-3">
            {t.videos.items.slice(0, 3).map((video) => (
              <StaggerItem key={video.id}>
                <VideoCard video={video} labels={{ playVideo: t.common.playVideo, videoSoon: t.common.videoSoon }} />
              </StaggerItem>
            ))}
          </Stagger>
          <SectionCta href={localePath(locale, pagePaths.videos)} label={home.videos.cta} />
        </Container>
      </Section>

      {/* 10 · Articles */}
      <Section tone="surface">
        <Container>
          <SectionHeading title={home.articles.title} subtitle={home.articles.subtitle} />
          <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {t.articles.items.slice(0, 3).map((article) => (
              <StaggerItem key={article.slug} className="h-full">
                <ArticleCard
                  article={article}
                  locale={locale}
                  href={localePath(locale, `${pagePaths.articles}${article.slug}/`)}
                  labels={{ minRead: t.common.minRead, readArticle: t.common.readArticle }}
                />
              </StaggerItem>
            ))}
          </Stagger>
          <SectionCta href={localePath(locale, pagePaths.articles)} label={home.articles.cta} />
        </Container>
      </Section>

      {/* 11 · FAQ */}
      <FaqSection locale={locale} title={home.faq.title} subtitle={home.faq.subtitle} items={home.faq.items} />

      {/* 12 · Page CTA */}
      <PageCTA locale={locale} title={t.cta.home.title} subtitle={t.cta.home.subtitle} />
    </>
  );
}
