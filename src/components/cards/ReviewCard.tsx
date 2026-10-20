import { Quote } from 'lucide-react';
import { Stars } from '@/components/ui/Stars';
import { cn } from '@/lib/cn';

export type Review = { name: string; procedure: string; rating: number; quote: string };

export function ReviewCard({ review, className }: { review: Review; className?: string }) {
  return (
    <figure
      className={cn(
        'card group flex h-full flex-col p-6 hover:-translate-y-1 hover:border-primary-200 hover:shadow-elevated sm:p-7',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <Stars rating={review.rating} />
        <Quote
          aria-hidden
          className="size-10 fill-primary-100 text-primary-100 transition-colors duration-300 group-hover:fill-primary-200 group-hover:text-primary-200 rtl:-scale-x-100"
        />
      </div>
      <blockquote className="mt-4 flex-1 text-[0.98rem] leading-relaxed text-slate-600">
        <p>{review.quote}</p>
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
        <span
          aria-hidden
          className="grid size-12 shrink-0 place-items-center rounded-full bg-brand-gradient font-heading text-lg font-bold text-white shadow-glow"
        >
          {review.name.charAt(0)}
        </span>
        <span className="min-w-0">
          <span className="block font-heading font-bold text-secondary-700">{review.name}</span>
          <span className="block truncate text-sm text-primary-600">{review.procedure}</span>
        </span>
      </figcaption>
    </figure>
  );
}
