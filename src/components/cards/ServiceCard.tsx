import Link from 'next/link';
import { ArrowForward } from '@/components/icons/registry';
import { TechniqueScene } from '@/components/services/TechniqueScene';
import { OpticArt } from '@/components/ui/OpticArt';
import type { HomeCard } from '@/lib/cms/content';

type ServiceCardProps = {
  card: HomeCard;
  href: string;
  cta: string;
  index: number;
};

/** Home-page card for a specialty or a technique of the services page. */
export function ServiceCard({ card, href, cta, index }: ServiceCardProps) {
  const illustration = card.scene && !card.image ? card.scene : undefined;

  return (
    <article className="card card-hover group flex h-full flex-col overflow-hidden p-2">
      <OpticArt tone={card.tone} icon={card.icon} image={card.image} imageAlt={card.title} rings={!illustration} className="aspect-[16/10] rounded-[1.25rem]">
        {illustration && (
          <div aria-hidden className="absolute inset-y-[7%] left-1/2 aspect-square -translate-x-1/2 text-white transition-transform duration-700 ease-optical group-hover:scale-105">
            <TechniqueScene scene={illustration} className="size-full" />
          </div>
        )}
        <span aria-hidden className="absolute bottom-3 end-5 font-heading text-5xl font-bold text-white/20">
          {String(index + 1).padStart(2, '0')}
        </span>
        {card.tag && (
          <span className="glass-dark absolute bottom-4 start-4 rounded-full px-3 py-1 text-xs font-bold tracking-wide text-white">
            <bdi>{card.tag}</bdi>
          </span>
        )}
      </OpticArt>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-xl sm:text-[1.35rem]">{card.title}</h3>
        <p className="mt-3 line-clamp-4 flex-1 text-[0.95rem] text-slate-500">{card.description}</p>
        <Link
          href={href}
          className="mt-6 inline-flex items-center gap-2 font-heading text-sm font-bold text-primary-600 transition-colors after:absolute after:inset-0 after:rounded-3xl hover:text-primary-700"
        >
          {cta}
          <ArrowForward className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
