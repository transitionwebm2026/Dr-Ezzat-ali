'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useId, useState } from 'react';
import { EASE_OPTICAL } from '@/components/motion/Reveal';
import { cn } from '@/lib/cn';

export type FaqItem = { q: string; a: string };

type FaqAccordionProps = {
  items: FaqItem[];
  /** Index opened initially; -1 for all closed. */
  defaultOpen?: number;
  className?: string;
};

/**
 * Single-open accordion. Answers stay in the DOM (collapsed via height) so they remain
 * indexable by search engines and are announced correctly by screen readers when expanded.
 */
export function FaqAccordion({ items, defaultOpen = 0, className }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState(defaultOpen);
  const baseId = useId();

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item, index) => {
        const open = openIndex === index;
        const buttonId = `${baseId}-q-${index}`;
        const panelId = `${baseId}-a-${index}`;

        return (
          <div
            key={item.q}
            className={cn(
              'rounded-2xl border transition-all duration-300 ease-optical',
              open ? 'border-primary-200 bg-white shadow-elevated' : 'border-slate-200/80 bg-white/70 hover:border-primary-200 hover:bg-white',
            )}
          >
            <h3 className="text-base">
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start sm:px-6 sm:py-5"
              >
                <span className="flex items-center gap-3.5">
                  <span
                    dir="ltr"
                    className={cn(
                      'grid size-8 shrink-0 place-items-center rounded-xl font-heading text-xs font-bold tabular-nums transition-colors duration-300',
                      open ? 'bg-primary text-white' : 'bg-primary-50 text-primary-600',
                    )}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-heading text-[0.98rem] font-bold leading-snug text-secondary-700 sm:text-lg">{item.q}</span>
                </span>
                <span
                  aria-hidden
                  className={cn(
                    'grid size-9 shrink-0 place-items-center rounded-full transition-all duration-300 ease-optical',
                    open ? 'rotate-180 bg-brand-gradient text-white shadow-glow' : 'bg-surface text-secondary-500',
                  )}
                >
                  <ChevronDown className="size-4" />
                </span>
              </button>
            </h3>
            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!open}
              initial={false}
              animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
              transition={{ duration: 0.4, ease: EASE_OPTICAL }}
              className="overflow-hidden"
            >
              <p className="px-5 pb-5 text-[0.95rem] leading-relaxed text-slate-500 sm:px-6 sm:pb-6 sm:ps-[4.25rem]">{item.a}</p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
