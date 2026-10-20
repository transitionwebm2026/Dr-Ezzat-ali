import type { ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/cn';

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  align?: 'center' | 'start';
  theme?: 'light' | 'dark';
  className?: string;
  /** Rendered next to the heading on large screens (e.g. a "view all" button). */
  action?: ReactNode;
  as?: 'h1' | 'h2';
};

export function SectionHeading({
  title,
  subtitle,
  align = 'center',
  theme = 'light',
  className,
  action,
  as: Heading = 'h2',
}: SectionHeadingProps) {
  const dark = theme === 'dark';
  const content = (
    <div className={cn('max-w-2xl', align === 'center' ? 'mx-auto text-center' : 'text-start')}>
      <Reveal>
        <Heading className={cn('text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.2]', dark && 'text-white')}>{title}</Heading>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.1}>
          <p className={cn('mt-4 text-base sm:text-lg', dark ? 'text-secondary-100/80' : 'text-slate-500')}>{subtitle}</p>
        </Reveal>
      )}
    </div>
  );

  if (!action) return <div className={cn('mb-12 sm:mb-14', className)}>{content}</div>;

  return (
    <div className={cn('mb-12 flex flex-col gap-6 sm:mb-14 lg:flex-row lg:items-end lg:justify-between', className)}>
      {content}
      <Reveal delay={0.15} className="shrink-0">
        {action}
      </Reveal>
    </div>
  );
}
