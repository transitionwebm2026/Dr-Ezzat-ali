import { ServiceCard } from '@/components/cards/ServiceCard';
import { ArrowForward } from '@/components/icons/registry';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { Container, Section } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { localePath, pagePaths, type Locale } from '@/i18n';

type ShowcaseContent = {
  title: string;
  subtitle: string;
  cta: string;
  items: { id: string; tag: string; title: string; description: string }[];
};

/** Maps a card id to the matching deep-dive section on the services page (if any). */
const servicesAnchor: Record<string, string> = {
  lasik: 'lasik',
  cataract: 'cataract',
  retina: 'retina',
  glaucoma: 'glaucoma',
  'anti-vegf': 'retina',
};

type ServicesShowcaseProps = {
  locale: Locale;
  content: ShowcaseContent;
  cardCta: string;
  tone?: 'white' | 'surface' | 'tint';
  id?: string;
};

/** Three precision cards + a CTA to the services page (used for surgeries and treatments). */
export function ServicesShowcase({ locale, content, cardCta, tone = 'white', id }: ServicesShowcaseProps) {
  const servicesHref = localePath(locale, pagePaths.services);

  return (
    <Section tone={tone} id={id}>
      <Container>
        <SectionHeading title={content.title} subtitle={content.subtitle} />
        <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item, index) => {
            const anchor = servicesAnchor[item.id];
            return (
              <StaggerItem key={item.id} className="h-full">
                <ServiceCard
                  id={item.id}
                  index={index}
                  tag={item.tag}
                  title={item.title}
                  description={item.description}
                  cta={cardCta}
                  href={anchor ? localePath(locale, `${pagePaths.services}#${anchor}`) : servicesHref}
                />
              </StaggerItem>
            );
          })}
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
