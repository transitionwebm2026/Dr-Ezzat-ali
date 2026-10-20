import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { OpticArt } from '@/components/ui/OpticArt';
import { expertiseImages, getServiceVisual } from '@/content/media';

type Expertise = { id: string; title: string; description: string };

/** Photo-led specialty cards: picture, title and a one-line description. */
export function ExpertiseGrid({ items }: { items: Expertise[] }) {
  return (
    <Stagger className="grid gap-6 md:grid-cols-3">
      {items.map((item) => {
        const visual = getServiceVisual(item.id);
        const image = expertiseImages[item.id] || visual.image;
        return (
          <StaggerItem key={item.id} className="h-full">
            <article className="card card-hover group flex h-full flex-col overflow-hidden p-2">
              <OpticArt
                tone={visual.tone}
                icon={image ? undefined : visual.icon}
                image={image}
                imageAlt={item.title}
                sizes="(min-width: 768px) 33vw, 100vw"
                className="aspect-[4/3] rounded-[1.25rem]"
              />
              <div className="relative flex flex-1 flex-col px-5 pb-6 pt-5 sm:px-6">
                <h3 className="text-xl">{item.title}</h3>
                <p className="mt-2.5 text-[0.95rem] text-slate-500">{item.description}</p>
                <span
                  aria-hidden
                  className="absolute inset-x-6 bottom-0 h-0.5 origin-center scale-x-0 rounded-full bg-brand-gradient transition-transform duration-500 ease-optical group-hover:scale-x-100"
                />
              </div>
            </article>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
