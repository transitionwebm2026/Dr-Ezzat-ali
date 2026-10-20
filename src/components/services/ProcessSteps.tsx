import { Icon, type IconKey } from '@/components/icons/registry';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';

type Step = { title: string; description: string };

const stepIcons: IconKey[] = ['clipboardList', 'scanEye', 'activity', 'calendarCheck'];

/** How a personalised treatment plan is determined — four connected steps. */
export function ProcessSteps({ steps, stepLabel }: { steps: Step[]; stepLabel: string }) {
  return (
    <div className="relative">
      <div aria-hidden className="absolute inset-x-[12%] top-[3.25rem] hidden border-t-2 border-dashed border-primary-200 lg:block" />
      <Stagger className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <StaggerItem key={step.title} className="h-full">
            <div className="card card-hover group relative h-full p-7 text-center">
              <span aria-hidden className="absolute end-5 top-4 font-heading text-4xl font-bold text-primary/10">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="relative mx-auto grid size-14 place-items-center rounded-2xl bg-white text-primary-600 shadow-soft ring-1 ring-primary-100 transition-all duration-500 ease-optical group-hover:scale-110 group-hover:bg-brand-gradient group-hover:text-white group-hover:shadow-glow">
                <Icon name={stepIcons[index % stepIcons.length]} className="size-7" strokeWidth={1.6} />
              </span>
              <span className="mt-6 block text-xs font-bold text-primary-600">
                {stepLabel} {index + 1}
              </span>
              <h3 className="mt-1 text-lg">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{step.description}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
