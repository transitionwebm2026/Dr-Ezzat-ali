import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/cn';

const { full, mark, alt } = siteConfig.logo;

/** Square brand mark: the "CVO" monogram on a white tile. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn('grid shrink-0 place-items-center rounded-[30%] bg-white shadow-soft ring-1 ring-primary-100', className)}>
      <Image src={mark.src} width={mark.width} height={mark.height} alt="" aria-hidden className="h-auto w-[78%]" />
    </span>
  );
}

type LogoProps = {
  name: string;
  title: string;
  theme?: 'light' | 'dark';
  /**
   * Navbar mode: on the narrowest phones only the clinic logo shows, the title and divider
   * join from `sm`, so the language toggle and menu button never get squeezed.
   */
  compact?: boolean;
  className?: string;
};

/** Clinic logo lock-up + doctor name & title. On dark surfaces the logo sits on a white tile. */
export function Logo({ name, title, theme = 'light', compact, className }: LogoProps) {
  const dark = theme === 'dark';
  const image = (
    <Image
      src={full.src}
      width={full.width}
      height={full.height}
      alt={alt}
      loading="eager"
      className={cn('w-auto shrink-0', dark ? 'h-14 sm:h-16' : 'h-10 sm:h-11')}
    />
  );

  return (
    <span className={cn('inline-flex min-w-0 items-center', dark ? 'gap-4' : 'gap-2.5 sm:gap-3', className)}>
      {dark ? <span className="shrink-0 rounded-2xl bg-white p-2 shadow-elevated ring-1 ring-white/20">{image}</span> : image}
      {!dark && <span aria-hidden className={cn('h-9 w-px shrink-0 bg-secondary/15', compact && 'hidden sm:block')} />}
      <span className={cn('min-w-0 flex-col leading-tight', compact ? 'hidden min-[360px]:flex' : 'flex')}>
        <span className={cn('whitespace-nowrap font-heading text-base font-bold sm:text-xl', dark ? 'text-white' : 'text-secondary-700')}>
          {name}
        </span>
        <span
          className={cn(
            'mt-0.5 text-[0.7rem] sm:text-xs',
            compact && 'hidden whitespace-nowrap sm:block',
            dark ? 'text-secondary-100/70' : 'text-slate-500',
          )}
        >
          {title}
        </span>
      </span>
    </span>
  );
}
