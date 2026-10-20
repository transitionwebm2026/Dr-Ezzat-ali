'use client';

import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

/** Honors the user's OS-level "reduce motion" preference for every Framer Motion animation. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
