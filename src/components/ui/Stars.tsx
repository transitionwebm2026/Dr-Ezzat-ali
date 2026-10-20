import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';

export function Stars({ rating, className, size = 'size-4' }: { rating: number; className?: string; size?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} role="img" aria-label={`${rating} / 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden
          className={cn(size, i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200')}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}
