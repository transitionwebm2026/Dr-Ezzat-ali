import { Phone } from 'lucide-react';
import type { ReactNode } from 'react';
import { BrandIcon } from '@/components/icons/BrandIcon';
import { cn } from '@/lib/cn';

type FloatingActionsProps = {
  whatsappHref: string;
  telHref: string;
  labels: { whatsapp: string; call: string };
};

function Tooltip({ children }: { children: ReactNode }) {
  return (
    <span
      dir="auto"
      className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-x-1 -translate-y-1/2 whitespace-nowrap rounded-full bg-secondary-800 px-3 py-1.5 font-heading text-xs font-bold text-white opacity-0 shadow-elevated transition-all duration-300 ease-optical group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
    >
      {children}
    </span>
  );
}

const fab =
  'group relative grid size-14 place-items-center rounded-full text-white transition-transform duration-300 ease-optical hover:-translate-y-1 hover:scale-105 active:scale-95';

/** Fixed bottom-left action stack (WhatsApp on top, phone call below) shown on every page. */
export function FloatingActions({ whatsappHref, telHref, labels }: FloatingActionsProps) {
  return (
    // Physically anchored to the bottom-left in both languages.
    <div dir="ltr" className="fixed bottom-5 left-4 z-40 flex flex-col gap-3 sm:bottom-6 sm:left-6">
      <div className="animate-fade-in-up [animation-delay:700ms]">
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label={labels.whatsapp} className={cn(fab, 'bg-whatsapp shadow-whatsapp')}>
          <span aria-hidden className="absolute inset-0 animate-pulse-ring rounded-full bg-whatsapp" />
          <span aria-hidden className="absolute inset-0 animate-pulse-ring rounded-full bg-whatsapp [animation-delay:1.1s]" />
          <BrandIcon name="whatsapp" className="relative size-7" />
          <Tooltip>{labels.whatsapp}</Tooltip>
        </a>
      </div>
      <div className="animate-fade-in-up [animation-delay:850ms]">
        <a href={telHref} aria-label={labels.call} className={cn(fab, 'bg-brand-gradient shadow-glow ring-4 ring-white/70')}>
          <Phone aria-hidden className="relative size-6" />
          <Tooltip>{labels.call}</Tooltip>
        </a>
      </div>
    </div>
  );
}
