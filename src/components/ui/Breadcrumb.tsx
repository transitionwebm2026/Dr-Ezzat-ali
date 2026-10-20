import Link from 'next/link';
import { ChevronRight, House } from 'lucide-react';
import { cn } from '@/lib/cn';

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="inline-flex flex-wrap items-center gap-1.5 rounded-full border border-white/70 bg-white/60 px-3.5 py-1.5 text-xs font-medium text-slate-500 shadow-sm backdrop-blur sm:text-sm">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
              {item.href && !last ? (
                <Link href={item.href} className="inline-flex items-center gap-1.5 transition-colors hover:text-primary-600">
                  {index === 0 && <House aria-hidden className="size-3.5" />}
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={cn(last && 'font-bold text-secondary-700')}>
                  {item.label}
                </span>
              )}
              {!last && <ChevronRight aria-hidden className="size-3.5 text-slate-300 rtl:-scale-x-100" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
