import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>;
}

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: 'white' | 'surface' | 'tint';
};

const tones = {
  white: 'bg-white',
  surface: 'bg-surface',
  tint: 'bg-gradient-to-b from-surface-tint via-white to-surface-tint/60',
};

export function Section({ children, className, id, tone = 'white' }: SectionProps) {
  return (
    // `overflow-clip` (not hidden) clips decorations without creating a scroll container,
    // so `position: sticky` keeps working for elements inside sections.
    <section id={id} className={cn('relative overflow-clip py-20 sm:py-24 lg:py-28', tones[tone], className)}>
      {children}
    </section>
  );
}
