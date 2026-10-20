import Image from 'next/image';
import { IrisRings } from '@/components/ui/OpticArt';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/cn';

type HeroPortraitProps = {
  alt: string;
  size?: 'lg' | 'md';
  className?: string;
};

/** The doctor's portrait, framed by concentric "lens" rings, pulling into focus on load. */
export function HeroPortrait({ alt, size = 'lg', className }: HeroPortraitProps) {
  return (
    <div
      className={cn(
        'relative mx-auto w-full',
        size === 'lg' ? 'max-w-[330px] sm:max-w-[400px] lg:max-w-[540px]' : 'max-w-[290px] sm:max-w-[340px] lg:max-w-[440px]',
        className,
      )}
    >
      {/* Optical backdrop */}
      <div aria-hidden className="absolute inset-x-[-12%] top-[3%] aspect-square animate-fade-in-up">
        <div className="absolute inset-0 rounded-full bg-radial-fade from-primary-200/70 via-primary-100/30 to-transparent" />
        <div className="absolute inset-[7%] rounded-full border border-primary-200/80" />
        <div className="absolute inset-[13%] animate-spin-slow rounded-full border-2 border-dashed border-primary-300/45" />
        <IrisRings className="absolute inset-[3%] animate-spin-slower text-primary-300/35" />
        <div className="absolute inset-[22%] rounded-full bg-gradient-to-b from-white via-primary-50 to-primary-100/70 shadow-[inset_0_2px_30px_rgba(38,154,200,0.18),0_30px_60px_-20px_rgba(7,80,140,0.25)]" />
        {/* Focus reticle ticks */}
        <span className="absolute left-1/2 top-[1%] h-5 w-px -translate-x-1/2 bg-primary/40" />
        <span className="absolute bottom-[1%] left-1/2 h-5 w-px -translate-x-1/2 bg-primary/40" />
        <span className="absolute left-[1%] top-1/2 h-px w-5 -translate-y-1/2 bg-primary/40" />
        <span className="absolute right-[1%] top-1/2 h-px w-5 -translate-y-1/2 bg-primary/40" />
      </div>

      <div className="relative aspect-[4/5] animate-focus-in">
        <Image
          src={siteConfig.doctorPortrait}
          alt={alt}
          fill
          preload
          sizes="(min-width: 1024px) 540px, (min-width: 640px) 400px, 330px"
          className="object-contain object-bottom drop-shadow-[0_30px_45px_rgba(7,80,140,0.28)]"
        />
      </div>
    </div>
  );
}
