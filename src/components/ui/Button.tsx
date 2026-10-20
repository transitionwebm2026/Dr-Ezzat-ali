import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'outline' | 'light' | 'glass' | 'whatsapp';
type Size = 'sm' | 'md' | 'lg';

// `max-w-full` + `min-h-*` (not a fixed height): a label too long for a narrow phone wraps onto
// a second line inside the pill instead of pushing the page sideways.
const base =
  'group/btn relative inline-flex max-w-full shrink-0 select-none items-center justify-center gap-2.5 overflow-hidden rounded-full text-center font-heading font-bold leading-snug transition-all duration-300 ease-optical active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60';

/** Light sweep across the button on hover — a subtle optical reflection. */
const shine =
  'before:pointer-events-none before:absolute before:inset-y-0 before:-left-1/2 before:w-1/3 before:-skew-x-12 before:bg-gradient-to-r before:from-transparent before:via-white/35 before:to-transparent before:opacity-0 before:transition-all before:duration-700 hover:before:left-[120%] hover:before:opacity-100';

const variants: Record<Variant, string> = {
  primary: cn('bg-primary text-white shadow-glow hover:-translate-y-0.5 hover:bg-primary-600 hover:shadow-glow-lg', shine),
  secondary: cn('bg-secondary text-white shadow-soft hover:-translate-y-0.5 hover:bg-secondary-800 hover:shadow-elevated', shine),
  outline:
    'border border-secondary/15 bg-white/70 text-secondary-700 backdrop-blur hover:-translate-y-0.5 hover:border-primary hover:text-primary-700 hover:shadow-soft',
  light: cn('bg-white text-secondary-700 shadow-soft hover:-translate-y-0.5 hover:bg-primary-50 hover:shadow-elevated', shine),
  glass: 'border border-white/25 bg-white/10 text-white backdrop-blur-md hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/20',
  whatsapp: cn('bg-whatsapp text-white shadow-whatsapp hover:-translate-y-0.5 hover:bg-whatsapp-dark', shine),
};

const sizes: Record<Size, string> = {
  sm: 'min-h-10 px-4 py-2 text-sm',
  md: 'min-h-12 px-6 py-2.5 text-[0.95rem]',
  lg: 'min-h-14 px-7 py-3 text-base sm:px-8',
};

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Opens in a new tab (automatic for http(s) links). */
  newTab?: boolean;
  'aria-label'?: string;
};

export function ButtonLink({ href, children, variant = 'primary', size = 'md', className, newTab, ...rest }: ButtonLinkProps) {
  const classes = buttonClasses(variant, size, className);
  const isExternal = /^(https?:|tel:|mailto:)/.test(href);

  if (isExternal) {
    const openNew = newTab ?? href.startsWith('http');
    return (
      <a href={href} className={classes} target={openNew ? '_blank' : undefined} rel={openNew ? 'noopener noreferrer' : undefined} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
