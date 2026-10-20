'use client';

import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { Check, Clock, Crosshair, HeartPulse, ScanEye, Stethoscope } from 'lucide-react';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { EASE_OPTICAL } from '@/components/motion/Reveal';
import { cn } from '@/lib/cn';

type Step = { title: string; duration: string; description: string; details: string[] };

type PatientJourneyProps = {
  steps: Step[];
  stepLabel: string;
  dir: 'rtl' | 'ltr';
  /** Auto-advance interval in ms (stops permanently once the visitor interacts). */
  interval?: number;
};

const stepIcons = [Stethoscope, ScanEye, Crosshair, HeartPulse];

/** Interactive Consultation → Diagnostics → Procedure → Recovery timeline. */
export function PatientJourney({ steps, stepLabel, dir, interval = 4500 }: PatientJourneyProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const inView = useInView(rootRef, { amount: 0.35 });
  const reduceMotion = useReducedMotion();
  const baseId = useId();

  const [active, setActive] = useState(0);
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    if (interacted || !inView || reduceMotion) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % steps.length), interval);
    return () => window.clearInterval(id);
  }, [interacted, inView, reduceMotion, steps.length, interval]);

  const select = (index: number) => {
    setActive(index);
    setInteracted(true);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const forwardKey = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    const backKey = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    let target: number | null = null;
    if (event.key === forwardKey) target = (active + 1) % steps.length;
    if (event.key === backKey) target = (active - 1 + steps.length) % steps.length;
    if (event.key === 'Home') target = 0;
    if (event.key === 'End') target = steps.length - 1;
    if (target === null) return;
    event.preventDefault();
    select(target);
    tabRefs.current[target]?.focus();
  };

  const progress = steps.length > 1 ? active / (steps.length - 1) : 1;
  const step = steps[active];

  return (
    <div ref={rootRef}>
      <div className="relative">
        {/* Desktop progress track, spanning first → last step centre */}
        <div aria-hidden className="absolute inset-x-[12.5%] top-9 hidden h-1 rounded-full bg-secondary/10 lg:block" />
        <motion.div
          aria-hidden
          className="absolute inset-x-[12.5%] top-9 hidden h-1 rounded-full bg-brand-gradient shadow-glow lg:block ltr:origin-left rtl:origin-right"
          initial={false}
          animate={{ scaleX: progress }}
          transition={{ duration: 0.7, ease: EASE_OPTICAL }}
        />

        <div role="tablist" aria-orientation="horizontal" className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((item, index) => {
            const StepIcon = stepIcons[index % stepIcons.length];
            const isActive = index === active;
            const done = index < active;
            return (
              <button
                key={item.title}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                id={`${baseId}-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`${baseId}-panel`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => select(index)}
                onKeyDown={onKeyDown}
                className={cn(
                  'group flex items-center gap-4 rounded-2xl border p-3 text-start transition-all duration-300 lg:flex-col lg:border-0 lg:p-0 lg:text-center',
                  isActive ? 'border-primary-200 bg-white shadow-soft lg:bg-transparent lg:shadow-none' : 'border-transparent hover:bg-white/70 lg:hover:bg-transparent',
                )}
              >
                <span
                  className={cn(
                    'relative grid size-[4.5rem] shrink-0 place-items-center rounded-full border-4 border-white transition-all duration-500 ease-optical',
                    isActive
                      ? 'scale-105 bg-brand-gradient text-white shadow-glow-lg lg:scale-110'
                      : done
                        ? 'bg-primary-100 text-primary-600 shadow-soft'
                        : 'bg-white text-secondary-400 shadow-soft group-hover:text-primary-500',
                  )}
                >
                  <StepIcon aria-hidden className="size-7" strokeWidth={1.6} />
                  <span
                    className={cn(
                      'absolute -end-1 -top-1 grid size-6 place-items-center rounded-full text-[0.7rem] font-bold ring-2 ring-white',
                      isActive || done ? 'bg-secondary text-white' : 'bg-slate-200 text-slate-500',
                    )}
                  >
                    {index + 1}
                  </span>
                </span>
                <span className="lg:mt-2">
                  <span className="block text-xs font-bold text-primary-600">
                    {stepLabel} {index + 1}
                  </span>
                  <span className="mt-0.5 block font-heading text-lg font-bold text-secondary-700">{item.title}</span>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs text-slate-400">
                    <Clock aria-hidden className="size-3.5" />
                    {item.duration}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${active}`} className="mt-10 lg:mt-14">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
            transition={{ duration: 0.45, ease: EASE_OPTICAL }}
            className="card relative grid gap-8 overflow-hidden p-6 sm:p-8 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:p-10"
          >
            <div aria-hidden className="absolute -top-20 size-56 rounded-full bg-primary-100/60 blur-3xl ltr:-right-10 rtl:-left-10" />
            <div className="relative">
              <h3 className="text-2xl sm:text-3xl">{step.title}</h3>
              <p className="mt-3 text-base text-slate-500 sm:text-lg">{step.description}</p>
            </div>
            <ul className="relative grid gap-3">
              {step.details.map((detail) => (
                <li key={detail} className="flex items-center gap-3 rounded-2xl border border-primary-100 bg-primary-50/60 px-4 py-3 font-medium text-secondary-700">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-white shadow-glow">
                    <Check aria-hidden className="size-4" />
                  </span>
                  {detail}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
