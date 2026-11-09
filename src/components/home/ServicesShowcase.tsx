import { ServiceCard } from '@/components/cards/ServiceCard';
import { ArrowForward } from '@/components/icons/registry';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { Container, Section } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { localePath, pagePaths, type Locale } from '@/i18n';
import type { HomeCard } from '@/lib/cms/content';

type ServicesShowcaseProps = {
  locale: Locale;
  content: { title: string; subtitle: string; cta: string };
  /** Specialties / techniques of the services page chosen for this home section. */
  cards: HomeCard[];
  cardCta: string;
  tone?: 'white' | 'surface' | 'tint';
  id?: string;
};

/** Service cards taken from the services page + a CTA to it (used for surgeries and treatments). */
export function ServicesShowcase({ locale, content, cards, cardCta, tone = 'white', id }: ServicesShowcaseProps) {
  const servicesHref = localePath(locale, pagePaths.services);

  return (
    <Section tone={tone} id={id}>
      <Container>
        <SectionHeading title={content.title} subtitle={content.subtitle} />
        <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <StaggerItem key={card.key} className="h-full">
              <ServiceCard card={card} index={index} cta={cardCta} href={localePath(locale, `${pagePaths.services}#${card.anchor}`)} />
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-12 flex justify-center">
          <ButtonLink href={servicesHref} variant="secondary" size="lg">
            {content.cta}
            <ArrowForward className="size-4" />
          </ButtonLink>
        </Reveal>
      </Container>
    </Section>
  );
}
