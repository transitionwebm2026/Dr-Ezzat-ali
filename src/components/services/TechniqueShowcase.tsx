'use client';

import { AnimatePresence, motion, useAnimate, useReducedMotion, type AnimationOptions } from 'framer-motion';
import { Eye, MousePointerClick, Timer, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { createContext, useContext, useEffect, useId, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { Icon, type IconKey } from '@/components/icons/registry';
import { EASE_OPTICAL } from '@/components/motion/Reveal';
import { TechniqueScene, type SceneKey } from '@/components/services/TechniqueScene';
import { OpticArt } from '@/components/ui/OpticArt';
import { getTechniqueVisual, type Tone } from '@/content/media';
import { cn } from '@/lib/cn';

/** `scene` / `image` come from the dashboard; when missing, the defaults keyed by `id` are used. */
type Technique = { id: string; name: string; detail: string; scene?: SceneKey; image?: string };

type ShowcaseState = {
  active: number;
  select: (index: number) => void;
  previewId: string;
  previewRef: RefObject<HTMLDivElement | null>;
};

const ShowcaseContext = createContext<ShowcaseState | null>(null);

function useShowcase() {
  const state = useContext(ShowcaseContext);
  if (!state) throw new Error('TechniquePreview / TechniqueList must be rendered inside <TechniqueShowcase>.');
  return state;
}

/** Shares the selected technique between a specialty's media panel and its technique cards. */
export function TechniqueShowcase({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewId = useId();

  const select = (index: number) => {
    setActive(index);
    // Below lg the preview is stacked above the cards — bring it back into view so the change is seen.
    const preview = previewRef.current;
    if (!preview || window.matchMedia('(min-width: 1024px)').matches) return;
    const { top, bottom, height } = preview.getBoundingClientRect();
    const visible = Math.min(bottom, window.innerHeight) - Math.max(top, 0);
    if (visible < height * 0.6) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      preview.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    }
  };

  return <ShowcaseContext.Provider value={{ active, select, previewId, previewRef }}>{children}</ShowcaseContext.Provider>;
}

const viewfinderCorners = [
  'start-0 top-0 rounded-ss-2xl border-s border-t',
  'end-0 top-0 rounded-se-2xl border-e border-t',
  'bottom-0 start-0 rounded-es-2xl border-b border-s',
  'bottom-0 end-0 rounded-ee-2xl border-b border-e',
];

// Eyelid timing: a quick squeeze shut, then a slower, eased opening.
const LIDS_SHUT: AnimationOptions = { duration: 0.22, ease: [0.55, 0, 0.8, 0.3] };
const LIDS_OPEN: AnimationOptions = { duration: 0.55, ease: EASE_OPTICAL };
const LIDS_INSTANT: AnimationOptions = { duration: 0 };

/**
 * An eyelid is a navy panel whose inner edge is cut by an ellipse (a CSS mask), so two of them
 * leave an almond-shaped opening like a real eye. A thin light line traces the lid margin.
 */
function lidStyle(lid: 'top' | 'bottom'): CSSProperties {
  const ellipse = `ellipse 62% 28.5% at 50% ${lid === 'top' ? '100%' : '0%'}`;
  const cut = `radial-gradient(${ellipse}, transparent 99%, #000 100%)`;
  return {
    maskImage: cut,
    WebkitMaskImage: cut,
    backgroundImage: [
      `radial-gradient(${ellipse}, transparent 98.5%, rgba(182, 226, 243, 0.65) 99.6%, rgba(3, 36, 63, 0) 104%)`,
      `linear-gradient(${lid === 'top' ? 'to bottom' : 'to top'}, #03243F, #05355C 55%, #0A5C9E)`,
    ].join(', '),
  };
}

type TechniquePreviewProps = {
  techniques: Technique[];
  tone: Tone;
  icon: IconKey;
  /** Shown when the specialty has no techniques (its card photo, if any). */
  fallbackImage?: string;
  fallbackAlt?: string;
  /** Specialty position, shown as the large faded number. */
  index: number;
  duration: string;
  recovery: string;
  durationLabel: string;
  recoveryLabel: string;
  nowShowingLabel: string;
};

/**
 * Media panel that shows the selected technique (photo, or an animated illustration until one is set).
 * Changes play as an eyelid blink over the media: the lids close, the picture swaps while they are
 * shut, then the eye opens again. Only transforms are animated, and loops pause while off-screen.
 */
export function TechniquePreview({
  techniques,
  tone,
  icon,
  fallbackImage,
  fallbackAlt = '',
  index,
  duration,
  recovery,
  durationLabel,
  recoveryLabel,
  nowShowingLabel,
}: TechniquePreviewProps) {
  const { active, select, previewId, previewRef } = useShowcase();
  const reduceMotion = useReducedMotion();
  const [lidsScope, animate] = useAnimate<HTMLDivElement>();
  const [shown, setShown] = useState(active);
  const [switched, setSwitched] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const technique: Technique | undefined = techniques[shown];
  const visual = technique
    ? getTechniqueVisual(technique.id, { scene: technique.scene, image: technique.image })
    : { scene: undefined, image: fallbackImage };
  const mediaKey = technique?.id ?? 'specialty';
  const facts = [
    { label: durationLabel, value: duration, Icon: Timer },
    { label: recoveryLabel, value: recovery, Icon: TrendingUp },
  ].filter((fact) => fact.value.trim());

  // Shut = lids pushed past each other, so the almond-shaped gap fully closes.
  const moveLids = (shut: boolean, options: AnimationOptions) =>
    Promise.all([
      animate('[data-lid="top"]', { y: shut ? '19%' : '-66%' }, options),
      animate('[data-lid="bottom"]', { y: shut ? '-19%' : '66%' }, options),
    ]);

  // The eye stays shut until the panel first comes into view, then opens.
  useEffect(() => {
    const node = previewRef.current;
    if (!node) return;
    let opened = Boolean(reduceMotion);
    if (!opened) void moveLids(true, LIDS_INSTANT);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setOffscreen(!entry.isIntersecting);
        if (!opened && entry.intersectionRatio >= 0.35) {
          opened = true;
          void moveLids(false, { ...LIDS_OPEN, duration: 0.9, delay: 0.3 });
        }
      },
      { threshold: [0, 0.35] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [previewRef, reduceMotion]);

  // Blink to the newly selected technique (keyed on `active` only — `shown` follows it).
  useEffect(() => {
    if (active === shown) return;
    if (reduceMotion) {
      setShown(active);
      return;
    }
    let cancelled = false;
    void moveLids(true, LIDS_SHUT).then(() => {
      if (cancelled) return;
      setSwitched(true);
      setShown(active);
      void moveLids(false, LIDS_OPEN);
    });
    return () => {
      cancelled = true;
    };
  }, [active]);

  // Fresh media settles in from slightly magnified as the lids open ("pulling focus").
  const settle = { initial: switched ? { scale: 1.08 } : false, animate: { scale: 1 }, transition: { duration: 1, ease: EASE_OPTICAL } } as const;

  return (
    <div ref={previewRef} id={previewId} data-paused={offscreen || undefined}>
      <OpticArt tone={tone} rings={!technique && !visual.image} className="aspect-[3/4] rounded-[2rem] shadow-elevated sm:aspect-square lg:aspect-[4/5]">
        {visual.image && (
          <motion.div key={mediaKey} className="absolute inset-0" {...settle}>
            <Image src={visual.image} alt={technique?.name ?? fallbackAlt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-secondary-950/75 via-secondary-950/10 to-secondary-950/30" />
          </motion.div>
        )}

        {/* Eyelids */}
        <div ref={lidsScope} aria-hidden className="pointer-events-none absolute inset-0 z-10">
          {/* Each lid is a full panel tall, so shut lids also cover the far edges. */}
          <span data-lid="bottom" className="absolute inset-x-0 top-[38%] h-full translate-y-[66%]" style={lidStyle('bottom')} />
          <span data-lid="top" className="absolute inset-x-0 bottom-[38%] h-full -translate-y-[66%]" style={lidStyle('top')} />
        </div>

        <div className="absolute start-5 top-5 z-20 grid size-16 place-items-center rounded-2xl border border-white/25 bg-white/15 text-white shadow-inner-light backdrop-blur-md">
          <Icon name={icon} className="size-8" strokeWidth={1.6} />
        </div>
        <span aria-hidden className="absolute end-6 top-5 z-20 font-heading text-6xl font-bold text-white/15">
          {String(index + 1).padStart(2, '0')}
        </span>

        <div className="absolute inset-0 flex flex-col p-4 pt-16 sm:pt-20 lg:pt-[5.5rem]">
          {/* Viewfinder stage */}
          <div className="relative flex min-h-0 flex-1 justify-center">
            <div aria-hidden className="relative aspect-square h-full max-w-full">
              {!visual.image && visual.scene && (
                <motion.div key={mediaKey} className="absolute -inset-[2%]" {...settle}>
                  <TechniqueScene scene={visual.scene} className="size-full text-white" />
                </motion.div>
              )}

              {viewfinderCorners.map((corner) => (
                <span key={corner} className={cn('absolute z-20 size-7 border-white/50', corner)} />
              ))}
              <span className="absolute inset-0 z-20 overflow-hidden rounded-2xl">
                <span className="absolute inset-0 animate-scan-sweep bg-[linear-gradient(to_bottom,transparent_40%,rgba(255,255,255,0.06)_49.6%,rgba(255,255,255,0.3)_50%,transparent_50.3%)]" />
              </span>

              {/* Iris ring that dilates outward as the eye reopens */}
              <AnimatePresence initial={false}>
                <motion.span
                  key={mediaKey}
                  className="absolute inset-[20%] z-20 rounded-full border-2 border-white/70"
                  initial={{ opacity: 1, scale: 0.15 }}
                  animate={{ opacity: 0, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, delay: 0.1, ease: EASE_OPTICAL }}
                />
              </AnimatePresence>
            </div>
          </div>

          <div className="relative z-20 mt-3 space-y-3">
            {technique && (
              <div className="glass-dark flex items-center gap-3 rounded-2xl px-4 py-2.5 text-white">
                <span aria-hidden className="relative flex size-2.5 shrink-0">
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary-300 opacity-75" />
                  <span className="relative size-2.5 rounded-full bg-primary-200" />
                </span>
                <div aria-live="polite" className="min-w-0 flex-1">
                  <span className="block text-[0.7rem] leading-tight text-white/60">{nowShowingLabel}</span>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={technique.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25, ease: EASE_OPTICAL }}
                      className="truncate font-heading text-sm font-bold leading-snug"
                    >
                      {technique.name}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <div className="flex shrink-0 items-center">
                  {techniques.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-label={item.name}
                      aria-pressed={i === active}
                      onClick={() => select(i)}
                      className="group/dot grid h-7 place-items-center px-1 focus-visible:ring-offset-0"
                    >
                      <span
                        className={cn(
                          'block h-1.5 rounded-full transition-all duration-500 ease-optical',
                          i === active ? 'w-5 bg-white' : 'w-1.5 bg-white/35 group-hover/dot:bg-white/70',
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {facts.length > 0 && (
              <div className={cn('grid gap-3', facts.length > 1 && 'grid-cols-2')}>
                {facts.map(({ label, value, Icon: FactIcon }) => (
                  <div key={label} className="glass rounded-2xl p-3.5 sm:p-4">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <FactIcon aria-hidden className="size-3.5 text-primary" />
                      {label}
                    </span>
                    <p className="mt-1 font-heading text-sm font-bold leading-snug text-secondary-700">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </OpticArt>
    </div>
  );
}

type TechniqueListProps = {
  techniques: Technique[];
  hint: string;
  previewLabel: string;
  nowShowingLabel: string;
};

/** Technique cards; the whole card is a toggle that drives the media panel. */
export function TechniqueList({ techniques, hint, previewLabel, nowShowingLabel }: TechniqueListProps) {
  const { active, select, previewId } = useShowcase();

  return (
    <>
      <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
        <MousePointerClick aria-hidden className="size-4 shrink-0 text-primary" />
        {hint}
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {techniques.map((technique, i) => {
          const isActive = i === active;
          return (
            <div
              key={technique.id}
              className={cn(
                'card group isolate flex cursor-pointer flex-col p-5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary has-[:focus-visible]:ring-offset-2',
                isActive ? 'border-primary-200 shadow-elevated' : 'card-hover',
              )}
            >
              {isActive && (
                <motion.span
                  layoutId={`${previewId}-active-technique`}
                  aria-hidden
                  className="absolute -inset-px -z-10 border-2 border-primary-400 bg-gradient-to-br from-primary-50 via-white to-white"
                  style={{ borderRadius: 24 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                />
              )}

              <span
                aria-hidden
                className={cn(
                  'pointer-events-none absolute end-4 top-[1.375rem] grid size-8 place-items-center rounded-full transition-colors duration-300',
                  isActive ? 'bg-brand-gradient text-white shadow-glow' : 'bg-primary-50 text-primary-500 group-hover:bg-primary group-hover:text-white',
                )}
              >
                <Eye className={cn('size-4', isActive && 'animate-blink')} />
              </span>

              <div className="flex items-center gap-3 pe-10">
                <span
                  dir="ltr"
                  className={cn(
                    'grid size-9 shrink-0 place-items-center rounded-xl bg-brand-gradient font-heading text-xs font-bold text-white shadow-glow transition-transform duration-300',
                    isActive ? 'scale-110' : 'group-hover:scale-110',
                  )}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h4 className="text-base leading-snug">
                  {/* The ::after overlay stretches the button over the whole card. */}
                  <button
                    type="button"
                    aria-pressed={isActive}
                    aria-controls={previewId}
                    onClick={() => select(i)}
                    className="text-start after:absolute after:inset-0 after:rounded-3xl after:content-[''] focus-visible:ring-0 focus-visible:ring-offset-0"
                  >
                    {technique.name}
                  </button>
                </h4>
              </div>
              <p className="mt-3 flex-1 text-sm text-slate-500">{technique.detail}</p>

              <span
                aria-hidden
                className={cn(
                  'pointer-events-none mt-4 inline-flex items-center gap-2 font-heading text-xs font-bold transition-colors duration-300',
                  isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-primary-600',
                )}
              >
                {isActive ? (
                  <span className="relative flex size-2">
                    <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-60" />
                    <span className="relative size-2 rounded-full bg-primary" />
                  </span>
                ) : (
                  <MousePointerClick className="size-3.5" />
                )}
                {isActive ? nowShowingLabel : previewLabel}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}
