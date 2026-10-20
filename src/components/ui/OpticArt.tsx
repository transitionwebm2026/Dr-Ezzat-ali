import Image from 'next/image';
import type { ReactNode } from 'react';
import { Icon, type IconKey } from '@/components/icons/registry';
import type { Tone } from '@/content/media';
import { cn } from '@/lib/cn';

const toneClasses: Record<Tone, string> = {
  cyan: 'from-primary-400 via-primary-600 to-secondary-700',
  navy: 'from-secondary-500 via-secondary-700 to-secondary-950',
  sky: 'from-primary-300 via-primary-500 to-secondary-600',
  deep: 'from-secondary-600 via-secondary-800 to-[#021a30]',
  teal: 'from-[#41C3CC] via-primary-600 to-secondary-700',
  frost: 'from-primary-50 via-white to-primary-100',
};

/**
 * Concentric iris/lens rings with radial striations — the site's signature optical motif.
 * Striations are drawn as wide dashed rings (`pathLength` keeps the ticks evenly spaced),
 * so the whole motif is ~10 nodes instead of dozens of individual lines.
 */
export function IrisRings({ className }: { className?: string }) {
  return (
    <svg viewBox="-100 -100 200 200" fill="none" stroke="currentColor" aria-hidden focusable="false" className={className}>
      <circle r="97" strokeWidth="0.5" />
      <circle r="84" strokeWidth="0.7" strokeDasharray="1.5 4.5" />
      <circle r="70" strokeWidth="0.6" />
      <circle r="64" strokeWidth="1.4" />
      {/* 36 long + 72 short radial striations */}
      <circle r="45.5" strokeWidth="31" pathLength={360} strokeDasharray="0.6 9.4" />
      <circle r="41" strokeWidth="22" pathLength={360} strokeDasharray="0.55 4.45" strokeDashoffset={2.5} opacity="0.75" />
      <circle r="28" strokeWidth="1.6" />
      <circle r="17" fill="currentColor" stroke="none" opacity="0.45" />
      <circle cx="-7" cy="-8" r="4.5" fill="currentColor" stroke="none" opacity="0.9" />
      {/* Focus reticle */}
      <path d="M0 -100 V-90 M0 90 V100 M-100 0 H-90 M90 0 H100" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

type OpticArtProps = {
  tone?: Tone;
  icon?: IconKey;
  /** Real photo — overrides the illustration when provided. */
  image?: string;
  imageAlt?: string;
  sizes?: string;
  className?: string;
  /** Where the iris sits: towards the inline-end edge (default) or centred. */
  focal?: 'end' | 'center';
  iconSize?: 'md' | 'lg';
  /** Draw the iris-ring motif — turn off when the surface hosts its own illustration. */
  rings?: boolean;
  /** Absolutely fill the nearest positioned parent (posters, overlays) instead of flowing in layout. */
  fill?: boolean;
  children?: ReactNode;
};

/**
 * Branded optical illustration used as a media surface for cards, posters and covers.
 * Swap in real photography at any time through the `image` prop.
 */
export function OpticArt({
  tone = 'cyan',
  icon,
  image,
  imageAlt = '',
  sizes = '(min-width: 1024px) 33vw, 100vw',
  className,
  focal = 'end',
  iconSize = 'md',
  rings = true,
  fill = false,
  children,
}: OpticArtProps) {
  const light = tone === 'frost';

  return (
    <div className={cn(fill ? 'absolute inset-0' : 'relative', 'isolate overflow-hidden bg-gradient-to-br', toneClasses[tone], className)}>
      {image ? (
        <>
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-700 ease-optical group-hover:scale-105"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-secondary-950/50 via-transparent to-transparent" />
        </>
      ) : (
        <>
          <div aria-hidden className={cn('mask-radial absolute inset-0 opacity-70', light ? 'bg-grid' : 'bg-grid-light')} />
          <div aria-hidden className="absolute -top-1/3 start-[-15%] size-[70%] rounded-full bg-white/25 blur-3xl" />
          <div aria-hidden className="absolute -bottom-1/3 end-[10%] size-[55%] rounded-full bg-primary-300/30 blur-3xl" />
          {rings && (
            <IrisRings
              className={cn(
                'absolute aspect-square transition-transform duration-[1400ms] ease-optical group-hover:rotate-[18deg] group-hover:scale-[1.06]',
                focal === 'center'
                  ? 'left-1/2 top-1/2 w-[78%] -translate-x-1/2 -translate-y-1/2'
                  : 'top-1/2 w-[92%] -translate-y-1/2 ltr:-right-[24%] rtl:-left-[24%]',
                light ? 'text-secondary/25' : 'text-white/30',
              )}
            />
          )}
          {/* Lens glare */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.14)_48%,transparent_60%)]"
          />
        </>
      )}

      {icon && (
        <div
          className={cn(
            'absolute start-5 top-5 grid place-items-center rounded-2xl shadow-inner-light backdrop-blur-md transition-transform duration-500 ease-optical group-hover:-translate-y-0.5 group-hover:scale-105',
            iconSize === 'lg' ? 'size-16' : 'size-12',
            light ? 'border border-primary-100 bg-white/80 text-primary-600' : 'border border-white/25 bg-white/15 text-white',
          )}
        >
          <Icon name={icon} className={iconSize === 'lg' ? 'size-8' : 'size-6'} strokeWidth={1.6} />
        </div>
      )}

      {children}
    </div>
  );
}
