'use client';

import { useRef, type PointerEvent, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  /** Glow colour of the cursor-following light. */
  glow?: string;
};

/**
 * Card with a soft optical light that follows the pointer — a subtle "lens flare" hover state.
 * Pure CSS variables, no re-renders.
 */
export function SpotlightCard({ children, className, glow = 'rgba(38, 154, 200, 0.16)' }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    node.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
  };

  return (
    <div ref={ref} onPointerMove={onPointerMove} className={cn('group/spot relative isolate overflow-hidden', className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          background: `radial-gradient(420px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${glow}, transparent 65%)`,
        }}
      />
      {children}
    </div>
  );
}
