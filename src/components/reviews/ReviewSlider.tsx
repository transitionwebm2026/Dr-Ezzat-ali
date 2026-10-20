'use client';

import { motion, useInView, useReducedMotion, type PanInfo } from 'framer-motion';
import { ChevronLeft, Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ReviewCard, type Review } from '@/components/cards/ReviewCard';
import { cn } from '@/lib/cn';

type ReviewSliderProps = {
  reviews: Review[];
  dir: 'rtl' | 'ltr';
  labels: { previous: string; next: string; goToSlide: string; of: string };
  /** Auto-advance interval in ms. */
  interval?: number;
};

const SWIPE_THRESHOLD = 50;

/**
 * Responsive review carousel (1 / 2 / 3 cards per view).
 * Auto-advances, pauses on hover, focus or when off-screen, supports swipe, and is fully RTL-aware.
 */
export function ReviewSlider({ reviews, dir, labels, interval = 5000 }: ReviewSliderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.3 });
  const reduceMotion = useReducedMotion();

  const [perView, setPerView] = useState(1);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const maxIndex = Math.max(0, reviews.length - perView);
  const current = Math.min(index, maxIndex);
  const paused = hovered || focused || !inView || Boolean(reduceMotion);

  useEffect(() => {
    const md = window.matchMedia('(min-width: 768px)');
    const lg = window.matchMedia('(min-width: 1024px)');
    const update = () => setPerView(lg.matches ? 3 : md.matches ? 2 : 1);
    update();
    md.addEventListener('change', update);
    lg.addEventListener('change', update);
    return () => {
      md.removeEventListener('change', update);
      lg.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    if (paused || maxIndex === 0) return;
    const id = window.setInterval(() => setIndex((i) => (Math.min(i, maxIndex) >= maxIndex ? 0 : i + 1)), interval);
    return () => window.clearInterval(id);
  }, [paused, maxIndex, interval]);

  const goTo = (target: number) => setIndex(Math.max(0, Math.min(target, maxIndex)));
  const prev = () => (current <= 0 ? setIndex(maxIndex) : goTo(current - 1));
  const next = () => (current >= maxIndex ? setIndex(0) : goTo(current + 1));

  const onPanEnd = (_: PointerEvent, info: PanInfo) => {
    const dx = info.offset.x;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(info.offset.y)) return;
    // In RTL, content flows right→left, so swiping right reveals the next card.
    const forward = dir === 'rtl' ? dx > 0 : dx < 0;
    if (forward) next();
    else prev();
  };

  const offset = (dir === 'rtl' ? 1 : -1) * current * (100 / perView);

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <div className="-mx-3 overflow-hidden px-0 py-4">
        <motion.ul
          className="flex cursor-grab touch-pan-y active:cursor-grabbing"
          animate={{ x: `${offset}%` }}
          transition={{ type: 'spring', stiffness: 110, damping: 22, mass: 0.9 }}
          onPanEnd={onPanEnd}
        >
          {reviews.map((review, i) => {
            const visible = i >= current && i < current + perView;
            return (
              <li
                key={`${review.name}-${i}`}
                aria-roledescription="slide"
                aria-label={`${i + 1} ${labels.of} ${reviews.length}`}
                aria-hidden={!visible}
                className={cn(
                  'shrink-0 basis-full px-3 transition-opacity duration-500 md:basis-1/2 lg:basis-1/3',
                  !visible && 'opacity-40',
                )}
              >
                <ReviewCard review={review} />
              </li>
            );
          })}
        </motion.ul>
      </div>

      <div className="mt-6 flex items-center justify-between gap-6">
        <div className="flex items-center gap-2" role="group">
          {Array.from({ length: maxIndex + 1 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`${labels.goToSlide} ${i + 1}`}
              aria-current={i === current}
              className={cn(
                'h-2.5 rounded-full transition-all duration-500 ease-optical',
                i === current ? 'w-9 bg-brand-gradient shadow-glow' : 'w-2.5 bg-secondary/15 hover:bg-primary/50',
              )}
            />
          ))}
          <span aria-hidden className="ms-2 hidden text-slate-300 sm:inline">
            {paused ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            aria-label={labels.previous}
            className="grid size-12 place-items-center rounded-full border border-secondary/10 bg-white text-secondary-700 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary-600 hover:shadow-glow"
          >
            <ChevronLeft aria-hidden className="size-5 rtl:-scale-x-100" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label={labels.next}
            className="grid size-12 place-items-center rounded-full bg-brand-gradient text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-lg"
          >
            <ChevronLeft aria-hidden className="size-5 -scale-x-100 rtl:scale-x-100" />
          </button>
        </div>
      </div>
    </div>
  );
}
