import { Icon, type IconKey } from '@/components/icons/registry';
import { AnimatedCounter } from '@/components/motion/AnimatedCounter';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { Container } from '@/components/ui/Container';
import { IrisRings } from '@/components/ui/OpticArt';
import { SectionHeading } from '@/components/ui/SectionHeading';

type Stat = { id: string; value: number; suffix: string; label: string };

const statIcons: Record<string, IconKey> = {
  patients: 'eye',
  surgeries: 'stethoscope',
  years: 'award',
};

type StatsBarProps = {
  items: Stat[];
  heading?: { title: string; subtitle: string };
};

/** High-contrast, full-width statistics band with scroll-triggered counting. */
export function StatsBar({ items, heading }: StatsBarProps) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-gradient py-16 sm:py-20">
      <div aria-hidden className="mask-radial absolute inset-0 -z-10 bg-grid-light" />
      <IrisRings className="absolute top-1/2 -z-10 w-[560px] -translate-y-1/2 animate-spin-slower text-white/[0.05] ltr:-left-40 rtl:-right-40" />
      <div aria-hidden className="absolute -top-24 -z-10 size-[420px] rounded-full bg-primary/25 blur-[110px] ltr:right-0 rtl:left-0" />

      <Container>
        {heading && <SectionHeading theme="dark" title={heading.title} subtitle={heading.subtitle} />}
        <Stagger className="grid gap-5 sm:grid-cols-3 sm:gap-6">
          {items.map((stat) => (
            <StaggerItem key={stat.id}>
              <div className="glass-dark group relative h-full overflow-hidden rounded-3xl px-6 py-8 text-center sm:px-4 lg:px-6 transition-all duration-500 ease-optical hover:-translate-y-1 hover:bg-white/10">
                <div aria-hidden className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary-300/70 to-transparent" />
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/20 text-primary-200 ring-1 ring-white/10 transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:shadow-glow">
                  <Icon name={statIcons[stat.id] ?? 'sparkles'} className="size-7" strokeWidth={1.6} />
                </div>
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  // Three narrow columns from `sm`: the size follows the viewport so "15,000+" always fits its card.
                  className="mt-5 block font-heading text-5xl font-bold tabular-nums text-white sm:text-[clamp(2rem,5.2vw,3.25rem)] lg:text-[3.5rem] xl:text-6xl"
                />
                <p className="mt-2 text-base text-secondary-100/80">{stat.label}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
