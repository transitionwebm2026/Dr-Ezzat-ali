import { ClinicInfo } from '@/components/contact/ClinicInfo';
import { ConsultationForm } from '@/components/contact/ConsultationForm';
import { PageCTA } from '@/components/cta/PageCTA';
import { PageHeroActions, pageCrumbs } from '@/components/hero/HeroActions';
import { UnifiedHero } from '@/components/hero/UnifiedHero';
import { Reveal } from '@/components/motion/Reveal';
import { Container, Section } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getDictionary, type Locale } from '@/i18n';

export function ContactView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const contact = t.contact;

  return (
    <>
      {/* 1 · Hero */}
      <UnifiedHero
        locale={locale}
        title={contact.hero.title}
        highlight={contact.hero.highlight}
        lead={contact.hero.lead}
        actions={<PageHeroActions locale={locale} bookHref="#booking" />}
        breadcrumb={pageCrumbs(locale, 'contact')}
        portraitAlt={t.doctor.portraitAlt}
      />

      {/* 2 · Consultation form (physical right) & map / clinic info (physical left) */}
      <Section tone="tint" id="booking">
        <Container>
          <SectionHeading title={contact.info.title} />
          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
            {/* Form — first in DOM: right in RTL; moved last (right) in LTR */}
            <Reveal className="ltr:lg:order-last">
              <ConsultationForm locale={locale} labels={contact.form} />
            </Reveal>
            <Reveal delay={0.1} className="h-full">
              <ClinicInfo locale={locale} />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* 3 · Page CTA */}
      <PageCTA locale={locale} title={t.cta.contact.title} subtitle={t.cta.contact.subtitle} contactHref="#booking" />
    </>
  );
}
