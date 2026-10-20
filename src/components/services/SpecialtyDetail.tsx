import { CalendarCheck, Check, ClipboardList, Microscope } from 'lucide-react';
import { BrandIcon } from '@/components/icons/BrandIcon';
import { Reveal } from '@/components/motion/Reveal';
import { TechniqueList, TechniquePreview, TechniqueShowcase } from '@/components/services/TechniqueShowcase';
import { ButtonLink } from '@/components/ui/Button';
import { getServiceVisual } from '@/content/media';
import type { Dictionary } from '@/i18n';
import { cn } from '@/lib/cn';
import { fillTemplate, whatsappUrl } from '@/lib/contact';

type Specialties = Dictionary['services']['specialties'];
type Specialty = Specialties['items'][number];

type SpecialtyDetailProps = {
  item: Specialty;
  index: number;
  labels: Pick<
    Specialties,
    | 'conditionsLabel'
    | 'techniquesLabel'
    | 'techniquesHint'
    | 'previewTechnique'
    | 'nowShowing'
    | 'durationLabel'
    | 'recoveryLabel'
    | 'bookService'
  >;
  bookLabel: string;
  contactHref: string;
  serviceMessage: string;
};

/** Deep-dive card for one specialty: interactive technique preview + conditions treated + modern techniques. */
export function SpecialtyDetail({ item, index, labels, bookLabel, contactHref, serviceMessage }: SpecialtyDetailProps) {
  const visual = getServiceVisual(item.id);
  const reversed = index % 2 === 1;

  return (
    <article id={item.id} className="grid scroll-mt-44 items-start gap-10 lg:grid-cols-12 lg:gap-14">
      <TechniqueShowcase>
        <Reveal scale={0.97} className={cn('lg:sticky lg:top-44 lg:col-span-5', reversed && 'lg:order-last')}>
          <TechniquePreview
            techniques={item.techniques}
            tone={visual.tone}
            icon={visual.icon}
            index={index}
            duration={item.duration}
            recovery={item.recovery}
            durationLabel={labels.durationLabel}
            recoveryLabel={labels.recoveryLabel}
            nowShowingLabel={labels.nowShowing}
          />
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl">{item.title}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-base text-slate-500 sm:text-lg">{item.description}</p>
          </Reveal>

          <Reveal delay={0.12} className="mt-9">
            <h3 className="flex items-center gap-2.5 text-lg">
              <span className="grid size-8 place-items-center rounded-lg bg-primary-50 text-primary-600">
                <ClipboardList aria-hidden className="size-4" />
              </span>
              {labels.conditionsLabel}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {item.conditions.map((condition) => (
                <li
                  key={condition}
                  className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50/70 px-4 py-2 text-sm font-medium text-secondary-700 transition-colors duration-300 hover:border-primary-300 hover:bg-white"
                >
                  <Check aria-hidden className="size-4 text-primary" />
                  {condition}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.14} className="mt-9">
            <h3 className="flex items-center gap-2.5 text-lg">
              <span className="grid size-8 place-items-center rounded-lg bg-primary-50 text-primary-600">
                <Microscope aria-hidden className="size-4" />
              </span>
              {labels.techniquesLabel}
            </h3>
            <TechniqueList
              techniques={item.techniques}
              hint={labels.techniquesHint}
              previewLabel={labels.previewTechnique}
              nowShowingLabel={labels.nowShowing}
            />
          </Reveal>

          <Reveal delay={0.16} className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={whatsappUrl(fillTemplate(serviceMessage, { service: item.title }))} variant="whatsapp">
              <BrandIcon name="whatsapp" className="size-5" />
              {labels.bookService}
            </ButtonLink>
            <ButtonLink href={contactHref} variant="outline">
              <CalendarCheck aria-hidden className="size-4" />
              {bookLabel}
            </ButtonLink>
          </Reveal>
        </div>
      </TechniqueShowcase>
    </article>
  );
}
