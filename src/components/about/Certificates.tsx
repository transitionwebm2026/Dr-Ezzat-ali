'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Award, BadgeCheck, Eye, GraduationCap, ShieldCheck, type LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { EASE_OPTICAL, Reveal } from '@/components/motion/Reveal';
import { IrisRings } from '@/components/ui/OpticArt';
import { cn } from '@/lib/cn';

type Certificate = { kind: string; title: string; issuer: string; year: string };

const kindIcons: Record<string, LucideIcon> = {
  degree: GraduationCap,
  fellowship: Award,
  membership: ShieldCheck,
  certification: BadgeCheck,
};

/** Scalloped rim of the seal: 24 bumps around a disc. */
const SEAL_BUMPS = Array.from({ length: 24 }, (_, i) => {
  const angle = (i * Math.PI) / 12;
  return { x: Math.round(Math.cos(angle) * 4200) / 100, y: Math.round(Math.sin(angle) * 4200) / 100 };
});

const ribbonTail = 'absolute top-[60%] h-[52%] w-[22%] origin-top [clip-path:polygon(0_0,100%_0,100%_100%,50%_80%,0_100%)]';

function Seal({ icon: SealIcon }: { icon: LucideIcon }) {
  return (
    <div className="relative size-20 sm:size-24">
      <span className={cn(ribbonTail, 'left-[24%] rotate-[18deg] bg-gradient-to-b from-secondary-500 to-secondary-800')} />
      <span className={cn(ribbonTail, 'right-[24%] -rotate-[18deg] bg-gradient-to-b from-primary-400 to-primary-700')} />
      <svg viewBox="-50 -50 100 100" aria-hidden className="absolute inset-0 size-full animate-spin-slow text-primary-300">
        <circle r="42" fill="currentColor" />
        {SEAL_BUMPS.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="6.5" fill="currentColor" />
        ))}
      </svg>
      <span className="absolute inset-[13%] grid place-items-center rounded-full bg-brand-gradient text-white shadow-glow ring-2 ring-white/80">
        <span aria-hidden className="absolute inset-[9%] rounded-full border border-dashed border-white/50" />
        <SealIcon aria-hidden className="size-7 sm:size-8" strokeWidth={1.5} />
      </span>
    </div>
  );
}

const frameCorners = [
  'start-3 top-3 rounded-ss-lg border-s-2 border-t-2',
  'end-3 top-3 rounded-se-lg border-e-2 border-t-2',
  'bottom-3 start-3 rounded-es-lg border-b-2 border-s-2',
  'bottom-3 end-3 rounded-ee-lg border-b-2 border-e-2',
];

type DiplomaProps = { item: Certificate; kindLabel: string; position: string };

/** One framed diploma. Its seal stamps down and a light sweep crosses the paper each time it appears. */
function Diploma({ item, kindLabel, position }: DiplomaProps) {
  const KindIcon = kindIcons[item.kind] ?? Award;

  return (
    <div className="group/diploma relative h-full overflow-hidden rounded-[1.75rem] bg-white p-2.5 shadow-elevated ring-1 ring-primary-100 sm:p-3">
      <div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-[1.25rem] border-[3px] border-double border-primary-200 bg-gradient-to-br from-surface-tint via-white to-primary-50/70 px-6 pb-16 pt-10 text-center sm:px-14 sm:pb-12">
        {/* Iris guilloche watermark */}
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2">
          <IrisRings className="w-full animate-spin-slower text-primary/[0.12]" />
        </div>
        {frameCorners.map((corner) => (
          <span key={corner} aria-hidden className={cn('absolute size-5 border-primary-300', corner)} />
        ))}
        {/* Holographic glare that follows the pointer (vars set by the tilt wrapper) */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/diploma:opacity-100"
          style={{ background: 'radial-gradient(420px circle at var(--gx, 50%) var(--gy, 50%), rgba(130, 205, 234, 0.28), transparent 60%)' }}
        />
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/90 to-transparent"
          style={{ skewX: -14 }}
          initial={{ x: '0%' }}
          whileInView={{ x: '480%' }}
          viewport={{ once: true }}
          transition={{ duration: 1.3, delay: 0.2, ease: EASE_OPTICAL }}
        />

        <span dir="ltr" className="absolute end-6 top-5 font-heading text-xs font-bold tracking-[0.2em] text-primary-400">
          {position}
        </span>

        <span className="relative flex items-center gap-3 font-heading text-xs font-bold tracking-[0.15em] text-primary-600 sm:text-sm">
          <span aria-hidden className="h-px w-8 bg-primary-300 sm:w-12" />
          {kindLabel}
          <span aria-hidden className="h-px w-8 bg-primary-300 sm:w-12" />
        </span>
        <h3 className="relative mt-4 text-xl leading-snug sm:text-[1.7rem] xl:text-[2rem]">{item.title}</h3>
        <span aria-hidden className="relative my-4 flex items-center gap-2 text-primary-400">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-primary-300" />
          <Eye className="size-4" />
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-primary-300" />
        </span>
        <p className="relative text-sm text-slate-500 sm:text-base">{item.issuer}</p>
        <span className="relative mt-4 rounded-full bg-secondary px-4 py-1 font-heading text-xs font-bold text-white sm:text-sm">{item.year}</span>

        <motion.div
          aria-hidden
          className="absolute bottom-3 end-4 sm:bottom-5 sm:end-8"
          initial={{ scale: 1.8, rotate: -35, opacity: 0 }}
          whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.35 }}
        >
          <Seal icon={KindIcon} />
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-primary-300"
            initial={{ scale: 0.6, opacity: 0 }}
            whileInView={{ scale: [0.6, 1.9], opacity: [0.9, 0] }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.55, ease: EASE_OPTICAL }}
          />
        </motion.div>
      </div>
    </div>
  );
}

type CertificatesProps = { items: Certificate[]; kinds: Record<string, string> };

/**
 * Interactive diploma showcase: a 3D-tilting featured diploma on a fanned stack, plus a selector list.
 * Auto-advances (paused on hover, off-screen, after the visitor picks one, or with reduced motion).
 */
export function Certificates({ items, kinds }: CertificatesProps) {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [offscreen, setOffscreen] = useState(true);
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const playing = autoplay && !reduceMotion;
  const item = items[active];

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const choose = (index: number) => {
    setAutoplay(false);
    setActive(index);
  };

  const advance = () => setActive((current) => (current + 1) % items.length);

  // Tilt + glare position through CSS variables — no re-renders while the pointer moves.
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const node = tiltRef.current;
    if (!node || event.pointerType !== 'mouse' || reduceMotion) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.setProperty('--ry', `${x * 10}deg`);
    node.style.setProperty('--rx', `${-y * 8}deg`);
    node.style.setProperty('--gx', `${(x + 0.5) * 100}%`);
    node.style.setProperty('--gy', `${(y + 0.5) * 100}%`);
  };

  const onPointerLeave = () => {
    tiltRef.current?.style.setProperty('--rx', '0deg');
    tiltRef.current?.style.setProperty('--ry', '0deg');
  };

  return (
    <div ref={rootRef} data-paused={offscreen || undefined} className="group/certs grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
      <Reveal scale={0.95} className="lg:col-span-7">
        <div className="relative mx-auto max-w-2xl px-3 pb-8 pt-3 [perspective:1400px]" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
          <div aria-hidden className="absolute inset-x-8 top-8 -z-10 h-3/4 rounded-full bg-primary-200/60 blur-3xl" />

          {/* The stack of diplomas behind fans out on first view */}
          <motion.div
            aria-hidden
            className="absolute inset-x-3 bottom-8 top-3 rounded-[1.75rem] border border-primary-100 bg-gradient-to-br from-white to-primary-50 shadow-soft"
            initial={{ rotate: 0, x: 0, y: 0 }}
            whileInView={{ rotate: -6, x: -14, y: 16 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.3, ease: EASE_OPTICAL }}
          />
          <motion.div
            aria-hidden
            className="absolute inset-x-3 bottom-8 top-3 rounded-[1.75rem] border border-primary-100 bg-white shadow-soft"
            initial={{ rotate: 0, x: 0, y: 0 }}
            whileInView={{ rotate: 3.5, x: 10, y: 8 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.4, ease: EASE_OPTICAL }}
          />

          <div
            ref={tiltRef}
            className="relative aspect-[4/5] transition-transform duration-300 ease-out sm:aspect-[7/5]"
            style={{ transform: 'rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))' }}
          >
            <AnimatePresence initial={false}>
              <motion.article
                key={active}
                aria-label={item.title}
                className="absolute inset-0"
                initial={{ opacity: 0, y: 30, scale: 0.93, rotate: 2.5 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, y: -26, scale: 1.03, rotate: -5, transition: { duration: 0.45, ease: EASE_OPTICAL } }}
                transition={{ duration: 0.7, ease: EASE_OPTICAL }}
              >
                <Diploma
                  item={item}
                  kindLabel={kinds[item.kind] ?? ''}
                  position={`${String(active + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`}
                />
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="lg:col-span-5">
        <ol className="space-y-1.5">
          {items.map((certificate, index) => {
            const isActive = index === active;
            const RowIcon = kindIcons[certificate.kind] ?? Award;
            return (
              <li key={certificate.title}>
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => choose(index)}
                  className={cn(
                    'group relative flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-start transition-colors duration-300',
                    !isActive && 'hover:bg-primary-50/70',
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="certificate-active-row"
                      aria-hidden
                      className="absolute inset-0 border border-primary-100 bg-white shadow-elevated"
                      style={{ borderRadius: 16 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                    />
                  )}
                  <span
                    className={cn(
                      'relative grid size-11 shrink-0 place-items-center rounded-xl transition-all duration-300',
                      isActive ? 'scale-105 bg-brand-gradient text-white shadow-glow' : 'bg-primary-50 text-primary-600 group-hover:bg-primary-100',
                    )}
                  >
                    <RowIcon aria-hidden className="size-5" strokeWidth={1.7} />
                  </span>
                  <span className="relative min-w-0 flex-1">
                    <span className={cn('block font-heading text-[0.95rem] font-bold leading-snug', isActive ? 'text-secondary-700' : 'text-secondary-700/75')}>
                      {certificate.title}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-slate-500">{certificate.issuer}</span>
                  </span>
                  <span
                    className={cn(
                      'relative shrink-0 rounded-full px-2.5 py-1 font-heading text-[0.7rem] font-bold transition-colors duration-300',
                      isActive ? 'bg-secondary text-white' : 'bg-slate-100 text-slate-500',
                    )}
                  >
                    {certificate.year}
                  </span>
                  {isActive && playing && (
                    <span aria-hidden className="absolute inset-x-5 bottom-1 h-0.5 overflow-hidden rounded-full bg-primary-100">
                      <span
                        key={active}
                        onAnimationEnd={advance}
                        className="block h-full origin-left animate-certificate-progress rounded-full bg-brand-gradient group-hover/certs:[animation-play-state:paused] rtl:origin-right"
                      />
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </Reveal>
    </div>
  );
}
