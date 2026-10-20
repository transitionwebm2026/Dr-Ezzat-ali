import Link from 'next/link';
import { ArrowForward } from '@/components/icons/registry';
import { OpticArt } from '@/components/ui/OpticArt';
import { getServiceVisual } from '@/content/media';

type ServiceCardProps = {
  id: string;
  href: string;
  title: string;
  description: string;
  tag?: string;
  cta: string;
  index: number;
};

export function ServiceCard({ id, href, title, description, tag, cta, index }: ServiceCardProps) {
  const visual = getServiceVisual(id);

  return (
    <article className="card card-hover group flex h-full flex-col overflow-hidden p-2">
      <OpticArt tone={visual.tone} icon={visual.icon} image={visual.image} imageAlt={title} className="aspect-[16/10] rounded-[1.25rem]">
        <span aria-hidden className="absolute bottom-3 end-5 font-heading text-5xl font-bold text-white/20">
          {String(index + 1).padStart(2, '0')}
        </span>
        {tag && (
          <span className="glass-dark absolute bottom-4 start-4 rounded-full px-3 py-1 text-xs font-bold tracking-wide text-white">
            <bdi>{tag}</bdi>
          </span>
        )}
      </OpticArt>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-xl sm:text-[1.35rem]">{title}</h3>
        <p className="mt-3 flex-1 text-[0.95rem] text-slate-500">{description}</p>
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
