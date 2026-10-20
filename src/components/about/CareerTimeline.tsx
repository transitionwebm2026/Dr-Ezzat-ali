'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { useRef } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/cn';

type TimelineItem = { year: string; title: string; place: string; description: string };

/**
 * Vertical career timeline. The centre line "draws" itself as the visitor scrolls.
 * Desktop: alternating sides. Mobile: single column with the line on the inline-start edge.
 */
export function CareerTimeline({ items }: { items: TimelineItem[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <ol ref={ref} className="relative mx-auto max-w-5xl">
      {/* Track + animated fill */}
      <span aria-hidden className="absolute bottom-2 top-2 w-0.5 rounded-full bg-secondary/10 ltr:left-6 rtl:right-6 md:ltr:left-1/2 md:rtl:right-1/2" />
      <motion.span
        aria-hidden
        style={{ scaleY: progress }}
        className="absolute bottom-2 top-2 w-0.5 origin-top rounded-full bg-brand-gradient shadow-glow ltr:left-6 rtl:right-6 md:ltr:left-1/2 md:rtl:right-1/2"
      />

      {items.map((item, index) => {
        const even = index % 2 === 0;
        return (
          <li key={`${item.year}-${item.title}`} className="relative grid grid-cols-[3rem_1fr] gap-x-5 pb-10 last:pb-0 md:grid-cols-2 md:gap-x-16">
            {/* Node */}
            <span
              aria-hidden
              className="absolute top-5 z-10 grid size-12 place-items-center rounded-full border-4 border-white bg-brand-gradient text-white shadow-glow ltr:left-0 rtl:right-0 md:ltr:left-1/2 md:ltr:-translate-x-1/2 md:rtl:right-1/2 md:rtl:translate-x-1/2"
            >
              <GraduationCap className="size-5" />
            </span>

            <Reveal
              className={cn(
                'col-start-2 md:col-span-1',
                even ? 'md:col-start-1 md:text-end' : 'md:col-start-2',
              )}
            >
              <div className="card card-hover group p-6 sm:p-7">
                <span
                  dir="ltr"
                  className="inline-flex rounded-full bg-primary-50 px-3 py-1 font-heading text-sm font-bold tabular-nums text-primary-700 ring-1 ring-primary-100"
                >
                  {item.year}
                </span>
                <h3 className="mt-3 text-xl">{item.title}</h3>
                <p className="mt-1 text-sm font-bold text-primary-600">{item.place}</p>
                <p className="mt-3 text-[0.95rem] text-slate-500">{item.description}</p>
              </div>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
