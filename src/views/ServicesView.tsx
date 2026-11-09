import { CalendarClock, HeartHandshake } from 'lucide-react';
import { PageCTA } from '@/components/cta/PageCTA';
import { FaqAccordion } from '@/components/faq/FaqAccordion';
import { PageHeroActions, pageCrumbs } from '@/components/hero/HeroActions';
import { UnifiedHero } from '@/components/hero/UnifiedHero';
import { FaqJsonLd } from '@/components/layout/JsonLd';
import { Reveal } from '@/components/motion/Reveal';
import { ProcessSteps } from '@/components/services/ProcessSteps';
import { SpecialtyDetail } from '@/components/services/SpecialtyDetail';
import { SpecialtyNav } from '@/components/services/SpecialtyNav';
import { SpecialtyQuickJump } from '@/components/services/SpecialtyQuickJump';
import { Container, Section } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getDictionary, localePath, pagePaths, type Locale } from '@/i18n';
import type { Specialty } from '@/lib/cms/content';

const groupIcons = { before: CalendarClock, after: HeartHandshake } as const;

export function ServicesView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const services = t.services;
  const specialties = services.specialties;
  // Managed in the dashboard (الخدمات → تخصصات صفحة الخدمات), with the dashboard's icon / colour / photo choices.
  const items = specialties.items as Specialty[];

  return (
    <>
      {/* 1 · Hero */}
      <UnifiedHero
        locale={locale}
        title={services.hero.title}
        highlight={services.hero.highlight}
        lead={services.hero.lead}
        actions={<PageHeroActions locale={locale} />}
        breadcrumb={pageCrumbs(locale, 'services')}
        portraitAlt={t.doctor.portraitAlt}
      />

      {items.length > 0 && (
        <>
          {/* 2a · Quick-jump specialty cards */}
          <Section className="!pb-12 sm:!pb-16">
            <Container>
              <SectionHeading title={specialties.title} subtitle={specialties.subtitle} />
              <SpecialtyQuickJump items={items} hint={specialties.jumpHint} />
            </Container>
          </Section>

          {/* 2b · Deep-dive cards with sticky scroll-spy navigation */}
          <section className="relative pb-24 lg:pb-32">
            <Container>
              <SpecialtyNav items={items.map(({ id, title }) => ({ id, title }))} label={specialties.navLabel} />
              <div className="mt-14 space-y-24 lg:mt-20 lg:space-y-32">
                {items.map((item, index) => (
                  <SpecialtyDetail
                    key={item.id}
                    item={item}
                    index={index}
                    labels={specialties}
                    bookLabel={t.common.bookAppointment}
                    contactHref={localePath(locale, pagePaths.contact)}
                    serviceMessage={t.whatsapp.serviceMessage}
                  />
                ))}
              </div>
            </Container>
          </section>
        </>
      )}

      {/* 3 · Treatment determination process */}
      <Section tone="tint">
        <Container>
          <SectionHeading title={services.process.title} subtitle={services.process.subtitle} />
          <ProcessSteps steps={services.process.steps} stepLabel={t.common.step} />
        </Container>
      </Section>

      {/* 4 · Extended FAQ (pre / post surgery) */}
      <Section>
        <FaqJsonLd items={services.faq.groups.flatMap((group) => group.items)} />
        <Container>
          <SectionHeading title={services.faq.title} subtitle={services.faq.subtitle} />
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-8">
            {services.faq.groups.map((group, index) => {
              const GroupIcon = groupIcons[group.id as keyof typeof groupIcons] ?? CalendarClock;
              return (
                <Reveal key={group.id} delay={index * 0.1}>
                  <h3 className="mb-5 flex items-center gap-3 text-xl">
                    <span className="grid size-11 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow">
                      <GroupIcon aria-hidden className="size-5" />
                    </span>
                    {group.label}
                  </h3>
                  <FaqAccordion items={group.items} defaultOpen={index === 0 ? 0 : -1} />
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 5 · Page CTA */}
      <PageCTA locale={locale} title={t.cta.services.title} subtitle={t.cta.services.subtitle} />
    </>
  );
}
