import { Check } from 'lucide-react';
import { Icon, type IconKey } from '@/components/icons/registry';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { Container, Section } from '@/components/ui/Container';
import { OpticArt } from '@/components/ui/OpticArt';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { Dictionary } from '@/i18n';

const icons: IconKey[] = ['scanEye', 'shieldCheck', 'stethoscope', 'heartPulse'];

/** "Why choose Dr. Ezzat Ali?" — equipment panel + clean numbered 1–4 grid. */
export function WhyChooseUs({ content }: { content: Dictionary['home']['why'] }) {
  return (
    <Section tone="surface">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="self-start lg:sticky lg:top-32 lg:col-span-5">
          <SectionHeading align="start" title={content.title} subtitle={content.subtitle} className="!mb-8" />
          <Reveal scale={0.97} className="card overflow-hidden p-2">
            <OpticArt tone="navy" icon="microscope" focal="end" className="aspect-[16/11] rounded-[1.25rem]">
              <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5">
                <p className="mb-3 font-heading text-sm font-bold text-white">{content.equipmentTitle}</p>
                <ul className="grid grid-cols-2 gap-2">
                  {content.equipment.map((item) => (
                    <li key={item} className="glass-dark flex items-center gap-2 rounded-xl px-3 py-2 text-xs leading-snug text-white">
                      <Check aria-hidden className="size-3.5 shrink-0 text-primary-300" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </OpticArt>
          </Reveal>
        </div>

        <Stagger className="grid gap-5 sm:grid-cols-2 lg:col-span-7" stagger={0.12}>
          {content.items.map((item, index) => (
            <StaggerItem key={item.title} className="h-full">
              <div className="card card-hover group relative h-full overflow-hidden p-7 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <span
                    dir="ltr"
                    className="font-heading text-6xl font-bold leading-none text-transparent transition-colors duration-500 group-hover:text-primary/10"
                    style={{ WebkitTextStroke: '1.5px rgba(38, 154, 200, 0.45)' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="grid size-12 place-items-center rounded-2xl bg-primary-50 text-primary-600 ring-1 ring-primary-100 transition-all duration-500 ease-optical group-hover:scale-110 group-hover:bg-brand-gradient group-hover:text-white group-hover:shadow-glow">
                    <Icon name={icons[index % icons.length]} className="size-6" strokeWidth={1.6} />
                  </span>
                </div>
                <h3 className="mt-6 text-xl">{item.title}</h3>
                <p className="mt-3 text-[0.95rem] text-slate-500">{item.description}</p>
                <span aria-hidden className="absolute inset-x-8 bottom-0 h-0.5 scale-x-0 rounded-full bg-brand-gradient transition-transform duration-500 ease-optical group-hover:scale-x-100" />
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
