import { VideoCard } from '@/components/cards/VideoCard';
import { PageCTA } from '@/components/cta/PageCTA';
import { PageHeroActions, pageCrumbs } from '@/components/hero/HeroActions';
import { UnifiedHero } from '@/components/hero/UnifiedHero';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { Container, Section } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getDictionary, type Locale } from '@/i18n';

export function VideosView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const videos = t.videos;

  return (
    <>
      {/* 1 · Hero */}
      <UnifiedHero
        locale={locale}
        title={videos.hero.title}
        highlight={videos.hero.highlight}
        lead={videos.hero.lead}
        actions={<PageHeroActions locale={locale} />}
        breadcrumb={pageCrumbs(locale, 'videos')}
        portraitAlt={t.doctor.portraitAlt}
      />

      {/* 2 · Videos grid (3 × 3, vertical) */}
      <Section tone="tint">
        <Container>
          <SectionHeading title={videos.grid.title} subtitle={videos.grid.subtitle} />
          <Stagger className="mx-auto grid max-w-sm gap-6 min-[560px]:max-w-none min-[560px]:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {videos.items.map((video) => (
              <StaggerItem key={video.id}>
                <VideoCard video={video} labels={{ playVideo: t.common.playVideo, videoSoon: t.common.videoSoon }} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* 3 · Page CTA */}
      <PageCTA locale={locale} title={t.cta.videos.title} subtitle={t.cta.videos.subtitle} />
    </>
  );
}
