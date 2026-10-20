'use client';

import { animate, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { formatNumber } from '@/lib/format';

type AnimatedCounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
};

/** Counts up from 0 once it scrolls into view. Writes to the DOM directly to avoid re-renders per frame. */
export function AnimatedCounter({ value, prefix = '', suffix = '', duration = 2.2, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!inView || !node) return;
    const render = (n: number) => {
      node.textContent = `${prefix}${formatNumber(n)}${suffix}`;
    };
    if (reduceMotion) {
      render(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => render(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, value, prefix, suffix, duration, reduceMotion]);

  return (
    <span ref={ref} dir="ltr" className={className}>
      {`${prefix}0${suffix}`}
    </span>
  );
}
