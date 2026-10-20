import { MessageCircleQuestion } from 'lucide-react';
import { BrandIcon } from '@/components/icons/BrandIcon';
import { FaqJsonLd } from '@/components/layout/JsonLd';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { Container, Section } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getDictionary, type Locale } from '@/i18n';
import { whatsappUrl } from '@/lib/contact';
import { FaqAccordion, type FaqItem } from './FaqAccordion';

type FaqSectionProps = {
  locale: Locale;
  title: string;
  subtitle: string;
  items: FaqItem[];
  tone?: 'white' | 'surface' | 'tint';
};

/** Heading + "still have questions?" card on one side, accordion on the other. */
export function FaqSection({ locale, title, subtitle, items, tone = 'white' }: FaqSectionProps) {
  const t = getDictionary(locale);

  return (
    <Section tone={tone}>
      <FaqJsonLd items={items} />
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="self-start lg:sticky lg:top-32 lg:col-span-5">
          <SectionHeading align="start" title={title} subtitle={subtitle} className="!mb-8" />
          <Reveal className="card relative overflow-hidden bg-navy-gradient p-7 text-white">
            <div aria-hidden className="mask-radial absolute inset-0 bg-grid-light" />
            <div className="relative">
              <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-primary-200 ring-1 ring-white/15">
                <MessageCircleQuestion aria-hidden className="size-6" />
              </span>
              <p className="mt-5 font-heading text-xl font-bold">{t.cta.videos.title}</p>
              <p className="mt-2 text-sm text-secondary-100/80">{t.cta.videos.subtitle}</p>
              <ButtonLink href={whatsappUrl(t.whatsapp.defaultMessage)} variant="whatsapp" className="mt-6">
                <BrandIcon name="whatsapp" className="size-5" />
                {t.common.chatOnWhatsapp}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
        <Reveal className="lg:col-span-7">
          <FaqAccordion items={items} />
        </Reveal>
      </Container>
    </Section>
  );
}
