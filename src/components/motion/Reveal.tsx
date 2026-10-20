'use client';

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

export const EASE_OPTICAL = [0.22, 1, 0.36, 1] as const;

const tags = {
  div: motion.div,
  li: motion.li,
  section: motion.section,
  article: motion.article,
  span: motion.span,
  ul: motion.ul,
  ol: motion.ol,
} as const;

type Tag = keyof typeof tags;

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: Tag;
  delay?: number;
  duration?: number;
  /** Vertical travel in px (fade-in-up). */
  y?: number;
  /** Start scale — values below 1 give a subtle "focus / zoom-in" effect. */
  scale?: number;
  /** Blur-to-sharp transition that evokes optical focusing. */
  blur?: boolean;
  /** Portion of the element that must be visible before animating (0–1). */
  amount?: number;
  id?: string;
};

/** Scroll-triggered fade-in-up with optional optical focus (blur → sharp) and scale. */
export function Reveal({
  children,
  className,
  as = 'div',
  delay = 0,
  duration = 0.8,
  y = 28,
  scale = 1,
  blur = true,
  amount = 0.25,
  id,
}: RevealProps) {
  const Component = tags[as] as typeof motion.div;
  return (
    <Component
      id={id}
      className={className}
      initial={{ opacity: 0, y, scale, filter: blur ? 'blur(8px)' : 'blur(0px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EASE_OPTICAL }}
    >
      {children}
    </Component>
  );
}

const containerVariants: Variants = {
  hidden: {},
  show: (custom: { stagger: number; delay: number }) => ({
    transition: { staggerChildren: custom.stagger, delayChildren: custom.delay },
  }),
};

const itemVariants: Variants = {
  hidden: (custom: { y: number; scale: number }) => ({ opacity: 0, y: custom.y, scale: custom.scale, filter: 'blur(8px)' }),
  show: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.75, ease: EASE_OPTICAL } },
};

type StaggerProps = {
  children: ReactNode;
  className?: string;
  as?: Tag;
  stagger?: number;
  delay?: number;
  amount?: number;
};

/** Parent that reveals its <StaggerItem> children one after another when scrolled into view. */
export function Stagger({ children, className, as = 'div', stagger = 0.1, delay = 0, amount = 0.15 }: StaggerProps) {
  const Component = tags[as] as typeof motion.div;
  return (
    <Component
      className={className}
      variants={containerVariants}
      custom={{ stagger, delay }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </Component>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  as?: Tag;
  y?: number;
  scale?: number;
};

export function StaggerItem({ children, className, as = 'div', y = 28, scale = 0.98 }: StaggerItemProps) {
  const Component = tags[as] as typeof motion.div;
  return (
    <Component className={className} variants={itemVariants} custom={{ y, scale }}>
      {children}
    </Component>
  );
}
