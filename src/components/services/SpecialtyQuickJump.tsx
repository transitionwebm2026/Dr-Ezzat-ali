import { ArrowDown } from 'lucide-react';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { OpticArt } from '@/components/ui/OpticArt';
import { getServiceVisual } from '@/content/media';
import type { Specialty } from '@/lib/cms/content';

type QuickJumpItem = Pick<Specialty, 'id' | 'title' | 'short' | 'icon' | 'tone' | 'image'>;

/**
 * Entry cards that jump to each specialty's deep-dive section. Up to four per row; an incomplete
 * last row is centred (the number of specialties is set in the dashboard).
 */
export function SpecialtyQuickJump({ items, hint }: { items: QuickJumpItem[]; hint: string }) {
  return (
    <Stagger className="flex flex-wrap justify-center gap-5">
      {items.map((item, index) => {
        const visual = getServiceVisual(item.id, { icon: item.icon, tone: item.tone, image: item.image });
        return (
          <StaggerItem key={item.id} className="w-full sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)]">
            <a href={`#${item.id}`} className="card card-hover group flex h-full flex-col overflow-hidden p-2">
              <OpticArt tone={visual.tone} icon={visual.icon} image={visual.image} imageAlt={item.title} className="aspect-[4/3] rounded-[1.25rem]">
                <span aria-hidden className="absolute bottom-3 end-4 font-heading text-5xl font-bold text-white/20">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </OpticArt>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg leading-snug">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm text-slate-500">{item.short}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-heading text-sm font-bold text-primary-600">
                  {hint}
                  <span className="grid size-7 place-items-center rounded-full bg-primary-50 transition-all duration-300 group-hover:translate-y-0.5 group-hover:bg-primary group-hover:text-white">
                    <ArrowDown aria-hidden className="size-3.5" />
                  </span>
                </span>
              </div>
            </a>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
