import { Certificates } from '@/components/about/Certificates';
import { CareerTimeline } from '@/components/about/CareerTimeline';
import { DoctorMessage } from '@/components/about/DoctorMessage';
import { ExpertiseGrid } from '@/components/about/ExpertiseGrid';
import { FeatureVideo } from '@/components/cards/VideoCard';
import { PageCTA } from '@/components/cta/PageCTA';
import { PageHeroActions, pageCrumbs } from '@/components/hero/HeroActions';
import { UnifiedHero } from '@/components/hero/UnifiedHero';
import { ArrowForward } from '@/components/icons/registry';
import { Reveal } from '@/components/motion/Reveal';
import { StatsBar } from '@/components/stats/StatsBar';
import { ButtonLink } from '@/components/ui/Button';
import { Container, Section } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { siteConfig } from '@/config/site';
import { getDictionary, localePath, pagePaths, type Locale } from '@/i18n';

export function AboutView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const about = t.about;

  return (
    <>
      {/* 1 · Hero */}
      <UnifiedHero
        locale={locale}
        title={about.hero.title}
        highlight={about.hero.highlight}
        lead={about.hero.lead}
        actions={<PageHeroActions locale={locale} />}
        breadcrumb={pageCrumbs(locale, 'about')}
        portraitAlt={t.doctor.portraitAlt}
      />

      {/* 2 · Doctor's message */}
      <DoctorMessage content={about.message} portraitAlt={t.doctor.portraitAlt} title={t.doctor.title} />

      {/* 3 · Career & academic timeline */}
      <Section tone="tint">
        <Container>
          <SectionHeading title={about.timeline.title} subtitle={about.timeline.subtitle} />
          <CareerTimeline items={about.timeline.items} />
        </Container>
      </Section>

      {/* 4 · Full-width intro video */}
      <Section>
        <Container>
          <SectionHeading title={about.video.title} subtitle={about.video.subtitle} />
          <Reveal scale={0.96} className="mx-auto max-w-6xl">
            <FeatureVideo
              aspect="cinema"
              title={about.video.title}
              label={about.video.label}
              youtubeId={siteConfig.videos.aboutIntro.youtubeId}
              src={siteConfig.videos.aboutIntro.src}
              portraitAlt={t.doctor.portraitAlt}
              labels={{ playVideo: t.common.playVideo, videoSoon: t.common.videoSoon }}
            />
          </Reveal>
        </Container>
      </Section>

      {/* 5 · Areas of expertise */}
      <Section tone="surface">
        <Container>
          <SectionHeading title={about.expertise.title} subtitle={about.expertise.subtitle} />
          <ExpertiseGrid items={about.expertise.items} />
          <Reveal className="mt-12 flex justify-center">
            <ButtonLink href={localePath(locale, pagePaths.services)} variant="secondary" size="lg">
              {about.expertise.cta}
              <ArrowForward className="size-4" />
            </ButtonLink>
          </Reveal>
        </Container>
      </Section>

      {/* 6 · Certificates & accreditations */}
      <Section>
        <Container>
          <SectionHeading title={about.certificates.title} subtitle={about.certificates.subtitle} />
          <Certificates items={about.certificates.items} kinds={about.certificates.kinds} />
        </Container>
      </Section>

      {/* 7 · Animated achievements */}
      <StatsBar items={t.stats.items} heading={{ title: t.stats.title, subtitle: t.stats.subtitle }} />

      {/* 8 · Page CTA */}
      <PageCTA locale={locale} title={t.cta.about.title} subtitle={t.cta.about.subtitle} />
    </>
  );
}
