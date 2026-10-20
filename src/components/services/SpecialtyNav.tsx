'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

type SpecialtyNavProps = { items: { id: string; title: string }[]; label: string };

/** Sticky pill navigation with scroll-spy across the specialty deep-dive sections. */
export function SpecialtyNav({ items, label }: SpecialtyNavProps) {
  const [active, setActive] = useState(items[0]?.id ?? '');

  useEffect(() => {
    const sections = items.map((item) => document.getElementById(item.id)).filter((node): node is HTMLElement => Boolean(node));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <div className="pointer-events-none sticky top-[calc(var(--header-h)+0.75rem)] z-30 flex justify-center">
      <nav aria-label={label} className="glass no-scrollbar pointer-events-auto max-w-full overflow-x-auto rounded-full p-1.5 shadow-elevated">
        <ul className="flex gap-1">
          {items.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'relative block whitespace-nowrap rounded-full px-4 py-2 font-heading text-sm font-bold transition-colors duration-300',
                    isActive ? 'text-white' : 'text-secondary-700 hover:text-primary-600',
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="specialty-active-pill"
                      className="absolute inset-0 rounded-full bg-brand-gradient shadow-glow"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{item.title}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
