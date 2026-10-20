import { Check } from 'lucide-react';
import { FeatureVideo } from '@/components/cards/VideoCard';
import { ArrowForward } from '@/components/icons/registry';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { Container, Section } from '@/components/ui/Container';
import { LogoMark } from '@/components/ui/Logo';
import { siteConfig } from '@/config/site';
import { getDictionary, localePath, pagePaths, type Locale } from '@/i18n';

/** Split intro: landscape promo video on the physical right, doctor profile on the left. */
export function IntroSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const intro = t.home.intro;
  const years = t.stats.items.find((stat) => stat.id === 'years');

  return (
    <Section>
      <div aria-hidden className="bg-dots mask-radial absolute inset-y-0 w-1/2 opacity-60 ltr:right-0 rtl:left-0" />
      <Container className="relative grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        {/* Video — first in DOM (right in RTL); moved last (right) in LTR */}
        <Reveal scale={0.96} className="relative ltr:lg:order-last">
          <FeatureVideo
            title={intro.videoTitle}
            label={intro.videoLabel}
            youtubeId={siteConfig.videos.homePromo.youtubeId}
            src={siteConfig.videos.homePromo.src}
            portraitAlt={t.doctor.portraitAlt}
            labels={{ playVideo: t.common.playVideo, videoSoon: t.common.videoSoon }}
          />
          {/* Phones: centred under the video (the corner position would cover the video title). */}
          {years && (
            <div className="glass relative z-10 mx-auto -mt-2 flex w-fit animate-float items-center gap-3 rounded-2xl px-5 py-3.5 shadow-elevated sm:absolute sm:-bottom-7 sm:end-6 sm:mt-0">
              <span dir="ltr" className="text-gradient font-heading text-3xl font-bold">
                {years.value}
                {years.suffix}
              </span>
              <span className="max-w-[7rem] font-heading text-sm font-bold leading-tight text-secondary-700">{intro.experienceBadge}</span>
            </div>
          )}
        </Reveal>

        {/* Profile */}
        <div>
          <Reveal>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.2]">{intro.title}</h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-6 space-y-4 text-base text-slate-600 sm:text-lg">
            {intro.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
          <Reveal delay={0.15}>
            <ul className="mt-8 space-y-3">
              {intro.points.map((point) => (
                <li key={point} className="flex items-center gap-3 font-medium text-secondary-700">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary-50 text-primary-600 ring-1 ring-primary-100">
                    <Check aria-hidden className="size-4" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.2} className="mt-10 flex flex-wrap items-center gap-5">
            <ButtonLink href={localePath(locale, pagePaths.about)}>
              {intro.cta}
              <ArrowForward className="size-4" />
            </ButtonLink>
            <span className="flex items-center gap-3">
              <LogoMark className="size-10" />
              <span className="leading-tight">
                <span className="block font-heading font-bold text-secondary-700">{t.doctor.name}</span>
                <span className="block text-xs text-slate-500">{t.doctor.title}</span>
              </span>
            </span>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
