import { useId, type CSSProperties, type ReactNode } from 'react';

/**
 * Animated line-art illustrations of each surgical / therapeutic technique.
 *
 * Everything is drawn in a 200×200 viewBox centred on the origin and animated with CSS only
 * (opacity, transform, stroke-dashoffset), so there is no JavaScript running per frame.
 * Rotations rely on the SVG default transform-origin (the viewBox origin): elements that pivot
 * elsewhere sit inside a `translate(…)` group, and `.box-fill` makes an element scale around itself.
 */

/** Deep navy for pupils and openings, so they read as depth on the blue surfaces. */
const INK = '#021a30';

type Tools = {
  /** Element id scoped to this SVG — several scenes can be on the page at once. */
  id: (name: string) => string;
  /** `url(#…)` reference to a scoped id. */
  url: (name: string) => string;
};

type Point = { x: number; y: number };

/** Inline animation tuning: the custom properties read by `scene-move` / `scene-fall`, plus timing overrides. */
function tune(style: Record<string, string>): CSSProperties {
  return style as CSSProperties;
}

/** Negative delays start a loop mid-cycle, so staggered elements never flash their resting state. */
const offset = (seconds: number): CSSProperties => ({ animationDelay: `${-seconds}s` });

function ring(radius: number, count: number, startDeg = 0): Point[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = ((startDeg + (i * 360) / count) * Math.PI) / 180;
    return { x: Math.round(radius * Math.cos(angle) * 100) / 100, y: Math.round(radius * Math.sin(angle) * 100) / 100 };
  });
}

// ── Shared anatomy ─────────────────────────────────────────────────────────

/** Front view: limbus, striated iris, pupil and catch-light. */
function IrisFront({ iris = 62, pupil = 22, guide = true }: { iris?: number; pupil?: number; guide?: boolean }) {
  return (
    <g>
      {guide && <circle r={iris + 22} strokeWidth="0.5" opacity="0.35" />}
      <circle r={iris} fill="currentColor" fillOpacity="0.07" strokeWidth="1.3" />
      <circle
        r={(iris + pupil + 4) / 2}
        strokeWidth={iris - pupil - 12}
        pathLength={360}
        strokeDasharray="0.6 5.4"
        strokeLinecap="butt"
        opacity="0.4"
      />
      <circle r={pupil + 8} strokeWidth="0.9" opacity="0.6" />
      <circle r={pupil} fill={INK} fillOpacity="0.55" strokeWidth="1.2" />
      <circle cx={-pupil * 0.36} cy={-pupil * 0.4} r={pupil * 0.18} fill="currentColor" stroke="none" opacity="0.85" />
    </g>
  );
}

/** Sagittal section: cornea on the left, iris, lens, retina, fovea and optic nerve on the right. */
function EyeSection() {
  return (
    <g>
      <path d="M-46 -42.66A72 72 0 1 1 -46 42.66Q-84 0 -46 -42.66Z" fill="currentColor" fillOpacity="0.06" strokeWidth="1.4" />
      <path d="M-26.43 -54.88A67 67 0 1 1 -26.43 54.88" strokeWidth="2.4" opacity="0.4" />
      <path d="M83.3 10L102 14.6M79.7 24.6L99 29.4" strokeWidth="1.4" />
      <path d="M-47 -38V-13M-47 13V38" strokeWidth="3.4" opacity="0.8" />
      <path d="M-31 -21L-40 -37M-31 21L-40 37" strokeWidth="0.6" opacity="0.5" />
      <ellipse cx="-31" rx="8.5" ry="21" fill="currentColor" fillOpacity="0.14" strokeWidth="1.2" />
      <circle cx="79" r="2" fill="currentColor" stroke="none" />
    </g>
  );
}

/** Light entering through the cornea and converging on the fovea. */
function LightRays() {
  return (
    <g strokeWidth="0.9" opacity="0.7">
      {['M-100 -12H-63L79 0', 'M-100 0H79', 'M-100 12H-63L79 0'].map((d) => (
        <path key={d} d={d} pathLength={100} strokeDasharray="3 7" className="animate-scene-flow" />
      ))}
    </g>
  );
}

/** Intra-ocular lens C-loop haptics. */
function IolHaptics() {
  return <path d="M22 -33C46 -50 76 -38 80 -8M-22 33C-46 50 -76 38 -80 8" strokeWidth="2.6" opacity="0.85" />;
}

function Glint() {
  return <ellipse cx="-14" cy="-17" rx="10" ry="4.5" transform="rotate(-38 -14 -17)" fill="currentColor" stroke="none" opacity="0.16" />;
}

/** Retinal fundus: vascular arcades, optic disc and macula. */
function Fundus() {
  return (
    <g>
      <path
        d="M-26 -12C-8 -42 34 -46 72 -32M-26 4C-8 32 34 40 72 26M-38 -12C-48 -32 -56 -40 -62 -46M-38 4C-50 22 -58 32 -64 40"
        strokeWidth="1.6"
        opacity="0.5"
      />
      <path
        d="M14 -40C26 -26 34 -22 46 -20M14 32C26 20 36 18 48 16M-56 -36C-64 -28 -70 -23 -74 -20M44 -40C48 -48 50 -54 52 -60"
        strokeWidth="1"
        opacity="0.4"
      />
      <circle cx="-32" cy="-4" r="11" fill="currentColor" fillOpacity="0.4" stroke="none" />
      <circle cx="-32" cy="-4" r="5" fill="currentColor" fillOpacity="0.7" stroke="none" />
      <circle cx="24" cy="4" r="11" fill={INK} fillOpacity="0.25" stroke="none" />
      <circle cx="24" cy="4" r="2" fill="currentColor" stroke="none" opacity="0.7" />
    </g>
  );
}

/** Treatment spots: faint scars plus three interleaved groups that fire in sequence. */
function LaserSpots({ spots, r = 2.4 }: { spots: Point[]; r?: number }) {
  return (
    <g fill="currentColor" stroke="none">
      {spots.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={r} opacity="0.22" />
      ))}
      {[0, 1, 2].map((group) => (
        <g key={group} className="animate-scene-flash" style={offset(group * 0.6)}>
          {spots
            .filter((_, i) => i % 3 === group)
            .map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={r + 0.5} />
            ))}
        </g>
      ))}
    </g>
  );
}

/** Intra-ocular pressure dial whose needle eases from high to normal. */
function PressureGauge({ cy }: { cy: number }) {
  return (
    <g transform={`translate(0 ${cy})`}>
      <path d="M-15 0A15 15 0 0 1 15 0" strokeWidth="1.4" opacity="0.7" />
      <path d="M-15 0A15 15 0 0 1 15 0" strokeWidth="4" pathLength={180} strokeDasharray="0.6 29.4" strokeLinecap="butt" opacity="0.5" />
      <g transform="rotate(55)">
        <g className="animate-scene-move" style={tune({ '--rot': '-100deg', animationDuration: '2.8s' })}>
          <path d="M0 0V-12" strokeWidth="1.6" />
        </g>
      </g>
      <circle r="2.2" fill="currentColor" stroke="none" />
    </g>
  );
}

// ── Static geometry ────────────────────────────────────────────────────────

const RASTER = Array.from({ length: 16 }, (_, i) => `M-48 ${-45 + i * 6}H48`).join('');

const NUCLEUS: [d: string, dx: string, dy: string][] = [
  ['M0 0V-26A26 26 0 0 1 26 0Z', '2.5px', '-2.5px'],
  ['M0 0H26A26 26 0 0 1 0 26Z', '2.5px', '2.5px'],
  ['M0 0V26A26 26 0 0 1 -26 0Z', '-2.5px', '2.5px'],
  ['M0 0H-26A26 26 0 0 1 0 -26Z', '-2.5px', '-2.5px'],
];

type Particle = Point & { r: number; dx: string; dy: string };

const ASPIRATE: Particle[] = [
  { x: 2, y: -2, r: 1.6, dx: '13px', dy: '-9px' },
  { x: 8, y: 6, r: 1.4, dx: '7px', dy: '-17px' },
  { x: -4, y: -14, r: 1.5, dx: '19px', dy: '3px' },
];

const FLOATERS: Particle[] = [
  { x: 18, y: 12, r: 2.6, dx: '-18px', dy: '18px' },
  { x: 10, y: 2, r: 2, dx: '-10px', dy: '28px' },
  { x: 26, y: 32, r: 2.2, dx: '-26px', dy: '-1px' },
];

const DOSE: Particle[] = [
  { x: -8, y: -34, r: 1.8, dx: '60px', dy: '28px' },
  { x: -12, y: -30, r: 1.5, dx: '52px', dy: '34px' },
  { x: -4, y: -38, r: 1.6, dx: '64px', dy: '22px' },
];

const SEEP: Particle[] = [
  { x: -6, y: -62, r: 1.6, dx: '-20px', dy: '-6px' },
  { x: 6, y: -62, r: 1.6, dx: '20px', dy: '-6px' },
  { x: 0, y: -66, r: 1.4, dx: '0px', dy: '-12px' },
];

const EDOF_RAYS = ['M-100 -30H-48L30 0L62 12.3', 'M-100 -15H-48L50 0L78 4.3', 'M-100 0H90', 'M-100 15H-48L50 0L78 -4.3', 'M-100 30H-48L30 0L62 -12.3'];

const OCT_LAYERS = [
  { y: -30, d: 20, width: 1.4, opacity: 0.9 },
  { y: -20, d: 15, width: 0.8, opacity: 0.55 },
  { y: -10, d: 10, width: 0.8, opacity: 0.55 },
  { y: 0, d: 6, width: 0.8, opacity: 0.55 },
  { y: 10, d: 3, width: 1, opacity: 0.75, dash: '1.5 2' },
  { y: 20, d: 0, width: 2.6, opacity: 0.95 },
].map((layer) => {
  const pit = layer.y + layer.d;
  return { ...layer, d: `M-86 ${layer.y}H-30C-16 ${layer.y} -12 ${pit} 0 ${pit}C12 ${pit} 16 ${layer.y} 30 ${layer.y}H86` };
});

const NERVE_FIBER_BAND = `${OCT_LAYERS[0].d}V-20H30C16 -20 12 -5 0 -5C-12 -5 -16 -20 -30 -20H-86Z`;

const ALMOND = 'M-90 4C-50 -52 50 -52 90 4C50 48 -50 48 -90 4Z';
const LASHES =
  'M-59.8 -22.9L-67 -31.5M-41 -31.3L-45.5 -41M-20.9 -36.3L-23 -46.5M0 -38V-48.5M20.9 -36.3L23 -46.5M41 -31.3L45.5 -41M59.8 -22.9L67 -31.5';

const IRIDOTOMY = { x: -23.5, y: -40.7 };
const BURST = ring(1, 8, 22.5)
  .map(({ x, y }) => `M${IRIDOTOMY.x + x * 7} ${IRIDOTOMY.y + y * 7}L${IRIDOTOMY.x + x * 11} ${IRIDOTOMY.y + y * 11}`)
  .join('');

const PRP_SPOTS = [...ring(54, 16), ...ring(68, 20, 9)];
const SLT_SPOTS = ring(68, 24);

const SWAY = tune({ '--rot': '16deg', animationDuration: '3.4s' });

function Particles({ items, className = 'animate-scene-absorb' }: { items: Particle[]; className?: string }) {
  return (
    <g fill="currentColor" stroke="none">
      {items.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={p.r}
          className={`box-fill ${className}`}
          style={tune({ '--dx': p.dx, '--dy': p.dy, animationDelay: `${-i}s` })}
        />
      ))}
    </g>
  );
}

// ── Scenes ─────────────────────────────────────────────────────────────────

const scenes = {
  /** Femtosecond laser rastering the flap bed, flap edge cut leaving a superior hinge. */
  femto: ({ id, url }: Tools) => (
    <>
      <defs>
        <clipPath id={id('flap')}>
          <circle r="48" />
        </clipPath>
      </defs>
      <IrisFront />
      <g clipPath={url('flap')}>
        <path d={RASTER} strokeWidth="1.1" strokeDasharray="0.01 3.2" opacity="0.4" />
        <g className="animate-scene-move" style={tune({ '--dy': '92px', animationDuration: '2.6s' })}>
          <rect x="-48" y="-52" width="96" height="12" fill={url('band')} stroke="none" opacity="0.6" />
          <rect x="-48" y="-46.8" width="96" height="1.6" fill="currentColor" stroke="none" />
        </g>
      </g>
      <circle r="48" strokeWidth="0.7" strokeDasharray="2 3" opacity="0.5" />
      <path d="M24 -41.57A48 48 0 1 1 -24 -41.57" strokeWidth="1.6" pathLength={100} strokeDasharray="100" className="animate-scene-draw" />
      <path d="M-24 -41.57A48 48 0 0 1 24 -41.57" strokeWidth="3.2" opacity="0.85" />
      <path d="M0 -8V-3M0 3V8M-8 0H-3M3 0H8" strokeWidth="1" opacity="0.8" />
    </>
  ),

  /** Lenticule cut inside the cornea and removed through a small incision. */
  smile: () => (
    <>
      <IrisFront />
      <circle r="34" fill="currentColor" fillOpacity="0.16" strokeWidth="1.2" strokeDasharray="1.5 2.5" className="box-fill animate-scene-breathe" />
      <circle r="38" strokeWidth="1.6" pathLength={360} strokeDasharray="0.01 6" opacity="0.75" className="animate-[spin_14s_linear_infinite]" />
      <ellipse cx="-11" cy="-13" rx="10" ry="4.5" transform="rotate(-38 -11 -13)" fill="currentColor" stroke="none" opacity="0.14" />
      <path d="M32.14 -38.3A50 50 0 0 1 46.98 -17.1" strokeWidth="3.2" />
      <path d="M16 -14Q30 -24 52 -40" strokeWidth="1.2" pathLength={100} strokeDasharray="4 6" className="animate-scene-flow" />
      <path d="M45 -39.3L52 -40L49.1 -33.6" strokeWidth="1.2" />
    </>
  ),

  /** Excimer beam sweeping the corneal surface (profile view), reshaping its centre. */
  prk: ({ id, url }: Tools) => (
    <>
      <defs>
        <clipPath id={id('air')}>
          <path d="M-100 -100H100V60H85C60 0 30 -24 0 -24C-30 -24 -60 0 -85 60H-100Z" />
        </clipPath>
      </defs>
      <rect x="-14" y="-100" width="28" height="9" rx="3" fill="currentColor" fillOpacity="0.2" strokeWidth="0.8" />
      <g clipPath={url('air')}>
        <g transform="translate(0 -91) rotate(-14)">
          <g className="animate-scene-move" style={tune({ '--rot': '28deg', animationDuration: '1.9s' })}>
            <rect x="-7" width="14" height="72" fill={url('beam')} stroke="none" opacity="0.35" />
            <rect x="-1.4" width="2.8" height="72" fill={url('beam')} stroke="none" />
            <circle cy="67" r="9" fill={url('glow')} stroke="none" />
          </g>
        </g>
      </g>
      <path
        d="M-85 60C-60 0 -30 -24 0 -24C30 -24 60 0 85 60L78 66C56 12 28 -12 0 -12C-28 -12 -56 12 -78 66Z"
        fill="currentColor"
        fillOpacity="0.1"
        strokeWidth="1.4"
      />
      <path d="M-83 59C-58 1 -29 -21 0 -21C29 -21 58 1 83 59" strokeWidth="0.7" strokeDasharray="1 2.5" opacity="0.55" />
      <g opacity="0.55">
        <path d="M-22 -20C-12 -24.5 12 -24.5 22 -20Q0 -14 -22 -20Z" fill="currentColor" stroke="none" className="animate-scene-pulse" />
      </g>
      <path d="M-76 72Q-50 66 -24 68M76 72Q50 66 24 68" strokeWidth="3" opacity="0.6" />
      <path d="M-28 100Q0 76 28 100" strokeWidth="1.2" fill="currentColor" fillOpacity="0.08" opacity="0.6" />
    </>
  ),

  /** Phakic lens vaulting between the iris and the natural lens (section view). */
  icl: () => (
    <g transform="translate(-6 0)">
      <LightRays />
      <EyeSection />
      <circle cx="-43" r="31" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.6" className="box-fill animate-[spin_18s_linear_infinite]" />
      <g opacity="0.25">
        <path d="M-45 -30Q-39 0 -45 30" strokeWidth="9" className="animate-scene-pulse" />
      </g>
      <path d="M-45 -30Q-39 0 -45 30" strokeWidth="2.4" />
    </g>
  ),

  /** Ultrasound probe emulsifying a cataract split into quadrants. */
  phaco: () => (
    <>
      <IrisFront pupil={32} />
      <g fill="currentColor" fillOpacity="0.3" strokeWidth="0.8">
        {NUCLEUS.map(([d, dx, dy]) => (
          <path key={d} d={d} className="animate-scene-move" style={tune({ '--dx': dx, '--dy': dy, animationDuration: '2.4s' })} />
        ))}
      </g>
      <circle r="14" strokeWidth="0.6" strokeDasharray="1 2" opacity="0.45" />
      <path d="M55.05 -28.53A62 62 0 0 0 44.6 -43.07" strokeWidth="3" opacity="0.9" />
      <path d="M-92 -44L-22 -6L-18 -11" strokeWidth="2.2" opacity="0.75" />
      <path d="M90 -66L24 -17.5" strokeWidth="7" opacity="0.5" />
      <path d="M30 -22L15 -11" strokeWidth="3" />
      {[0, 0.8, 1.6].map((s) => (
        <circle key={s} cx="15" cy="-11" r="10" strokeWidth="1" className="box-fill animate-scene-ripple" style={offset(s)} />
      ))}
      <Particles items={ASPIRATE} />
    </>
  ),

  /** Diffractive rings splitting light into several focal points. */
  multifocal: () => (
    <>
      <circle r="54" strokeWidth="1.4" pathLength={360} strokeDasharray="0.01 5" opacity="0.4" className="animate-[spin_40s_linear_infinite]" />
      <IolHaptics />
      <circle r="40" fill="currentColor" fillOpacity="0.08" strokeWidth="1.6" />
      <g strokeWidth="0.9">
        {[10, 17, 23, 28, 32.5, 36.5].map((r, i) => (
          <circle key={r} r={r} className="animate-scene-pulse" style={{ animationDuration: '2.6s', animationDelay: `${-2.6 + i * 0.22}s` }} />
        ))}
      </g>
      <Glint />
      <circle r="2.4" fill="currentColor" stroke="none" />
    </>
  ),

  /** Toric lens rotating until its axis marks line up with the target axis. */
  toric: () => (
    <>
      <circle r="84" strokeWidth="5" pathLength={360} strokeDasharray="0.5 9.5" strokeLinecap="butt" opacity="0.4" />
      <circle r="84" strokeWidth="10" pathLength={360} strokeDasharray="0.8 89.2" strokeDashoffset="0.4" strokeLinecap="butt" opacity="0.7" />
      <g className="animate-scene-pulse" style={{ animationDuration: '6.4s' }}>
        <path d="M-94 0H94" strokeWidth="1" strokeDasharray="3 4" />
        <path d="M90 0L97 -4V4ZM-90 0L-97 -4V4Z" fill="currentColor" stroke="none" />
      </g>
      <g transform="rotate(-32)">
        <g className="animate-scene-move" style={tune({ '--rot': '32deg', animationDuration: '3.2s' })}>
          <IolHaptics />
          <circle r="40" fill="currentColor" fillOpacity="0.1" strokeWidth="1.6" />
          <g fill="currentColor" stroke="none">
            {[-36, -31, -26, 26, 31, 36].map((x) => (
              <circle key={x} cx={x} r="1.7" />
            ))}
          </g>
        </g>
      </g>
      <Glint />
    </>
  ),

  /** Light focused into an elongated zone — continuous range from near to far. */
  edof: ({ url }: Tools) => (
    <>
      <g strokeWidth="0.9" opacity="0.8">
        {EDOF_RAYS.map((d) => (
          <path key={d} d={d} pathLength={100} strokeDasharray="3 7" className="animate-scene-flow" />
        ))}
      </g>
      <path d="M-48 -40Q-33 0 -48 40Q-63 0 -48 -40Z" fill="currentColor" fillOpacity="0.14" strokeWidth="1.4" />
      <path d="M-48 -40L-51 -60M-48 40L-51 60" strokeWidth="2.2" opacity="0.7" />
      <ellipse cx="40" rx="24" ry="5" fill={url('glow')} stroke="none" />
      <g className="animate-scene-move" style={tune({ '--dx': '36px', animationDuration: '2.2s' })}>
        <circle cx="22" r="7" fill={url('glow')} stroke="none" />
        <circle cx="22" r="2.2" fill="currentColor" stroke="none" />
      </g>
      <g strokeWidth="0.9" opacity="0.6">
        <path d="M16 44H64M20 40V48M40 40V48M60 40V48" />
        <path d="M14 56Q17 53 20 55Q23 53 26 56V62Q23 59 20 61Q17 59 14 62Z" />
        <path d="M34 53H46V61H34ZM40 61V64M37 64H43" />
        <path d="M53 63L58 55L61 59L63 56L67 63Z" />
      </g>
    </>
  ),

  /** Light pipe sweeping the vitreous while the cutter clears opacities (section view). */
  vitrectomy: ({ id, url }: Tools) => (
    <>
      <defs>
        <clipPath id={id('globe')}>
          <circle cx="12" r="70" />
        </clipPath>
        <linearGradient id={id('cone')} gradientUnits="userSpaceOnUse" x1="34" y1="29.5" x2="84" y2="73">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.5" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g transform="translate(-6 0)">
        <EyeSection />
        <g clipPath={url('globe')}>
          <g transform="translate(-29.3 -59) rotate(-8)">
            <g className="animate-scene-move" style={SWAY}>
              <path d="M34 29.5L98.9 48.2L61.5 91.2Z" fill={url('cone')} stroke="none" />
            </g>
          </g>
        </g>
        <g transform="translate(-29.3 -59) rotate(-8)">
          <g className="animate-scene-move" style={SWAY}>
            <path d="M-14 -12.2L34 29.5" strokeWidth="2.6" />
          </g>
        </g>
        <path d="M-42.1 71.7L-0.9 30.8" strokeWidth="3.2" />
        <circle cx="-4" cy="34" r="1.3" fill={INK} stroke="none" />
        <g fill="currentColor" stroke="none" opacity="0.5">
          <circle cx="-29.3" cy="-59" r="3" />
          <circle cx="-29.3" cy="59" r="3" />
          <circle cx="40" cy="-20" r="2" opacity="0.6" />
          <circle cx="52" cy="8" r="1.5" opacity="0.6" />
        </g>
        <Particles items={FLOATERS} />
      </g>
    </>
  ),

  /** Intravitreal injection: medication spreading towards a swollen macula (section view). */
  injection: () => (
    <g transform="translate(-6 0)">
      <EyeSection />
      <g opacity="0.5">
        <path d="M78.2 -12Q66 0 78.2 12Z" fill="currentColor" stroke="none" className="animate-scene-pulse" />
      </g>
      <circle cx="79" r="13" strokeWidth="0.8" strokeDasharray="2 3" className="box-fill animate-[spin_12s_linear_infinite]" />
      {[0, 0.8, 1.6].map((s) => (
        <circle key={s} cx="-10" cy="-36" r="9" fill="currentColor" fillOpacity="0.25" stroke="none" className="box-fill animate-scene-ripple" style={offset(s)} />
      ))}
      <Particles items={DOSE} />
      <g className="animate-scene-move" style={tune({ '--dx': '3px', '--dy': '3.6px', animationDuration: '2.4s' })}>
        <path d="M-39.6 -71.3L-15.2 -42.1" strokeWidth="1.2" />
        <path d="M-39.6 -71.3L-44.1 -76.7" strokeWidth="4" />
        <path d="M-47 -80.2L-60.8 -96.6" strokeWidth="10" opacity="0.55" />
      </g>
      <circle cx="-29.3" cy="-59" r="2.6" fill="currentColor" stroke="none" opacity="0.5" />
    </g>
  ),

  /** Pattern laser spots fired across the peripheral retina, with the aiming beam orbiting. */
  photocoagulation: ({ id, url }: Tools) => (
    <>
      <defs>
        <radialGradient id={id('fundus')}>
          <stop offset="0.55" stopColor="currentColor" stopOpacity="0.1" />
          <stop offset="1" stopColor={INK} stopOpacity="0.35" />
        </radialGradient>
      </defs>
      <circle r="82" fill={url('fundus')} strokeWidth="1.2" />
      <Fundus />
      <LaserSpots spots={PRP_SPOTS} />
      <g className="animate-[spin_10s_linear_infinite]">
        <circle cx="61" r="8" fill={url('glow')} stroke="none" />
        <circle cx="61" r="1.8" fill="currentColor" stroke="none" />
        <path d="M61 -11V-6M61 6V11M50 0H55M67 0H72" strokeWidth="0.9" />
      </g>
    </>
  ),

  /** Retinal layers with the foveal pit, swept by the OCT scan line. */
  oct: ({ id, url }: Tools) => (
    <>
      <defs>
        <linearGradient id={id('bandX')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="0.5" stopColor="currentColor" stopOpacity="0.45" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M-90 -40V-50H-80M80 -50H90V-40M90 40V50H80M-80 50H-90V40" strokeWidth="1" opacity="0.6" />
      <path d={NERVE_FIBER_BAND} fill="currentColor" fillOpacity="0.12" stroke="none" />
      {OCT_LAYERS.map((layer) => (
        <path key={layer.y} d={layer.d} strokeWidth={layer.width} opacity={layer.opacity} strokeDasharray={layer.dash} />
      ))}
      <g strokeWidth="0.7" opacity="0.3">
        {[-70, -46, -22, 2, 26, 50, 74].map((x, i) => (
          <ellipse key={x} cx={x} cy={i % 2 ? 36 : 31} rx="9" ry="3.5" />
        ))}
      </g>
      <g className="animate-scene-move" style={tune({ '--dx': '160px', animationDuration: '3s' })}>
        <rect x="-86" y="-66" width="12" height="108" fill={url('bandX')} stroke="none" />
        <path d="M-80 -66V42" strokeWidth="1" />
        <circle cx="-80" cy="-68" r="2.6" fill="currentColor" stroke="none" />
      </g>
      <path d="M50 66H80M50 62V70M80 62V70" strokeWidth="0.9" opacity="0.7" />
    </>
  ),

  /** Eye drop falling onto the eye while the pressure dial settles. */
  drops: ({ id, url }: Tools) => (
    <>
      <defs>
        <clipPath id={id('eye')}>
          <path d={ALMOND} />
        </clipPath>
      </defs>
      <path d="M-70 -22C-40 -62 40 -62 70 -22" strokeWidth="0.8" opacity="0.4" />
      <path d={LASHES} strokeWidth="1.6" opacity="0.7" />
      <path d={ALMOND} fill="currentColor" fillOpacity="0.08" strokeWidth="1.6" />
      <g clipPath={url('eye')}>
        <g transform="translate(0 2)">
          <IrisFront iris={34} pupil={13} guide={false} />
        </g>
      </g>
      <path d="M-6 -100H6L3.5 -91H-3.5Z" fill="currentColor" fillOpacity="0.35" strokeWidth="0.8" />
      <path
        d="M0 -90C3.5 -85 5.5 -82 5.5 -79A5.5 5.5 0 0 1 -5.5 -79C-5.5 -82 -3.5 -85 0 -90Z"
        fill="currentColor"
        stroke="none"
        className="animate-scene-fall"
        style={tune({ '--dy': '78px' })}
      />
      <circle cy="2" r="12" strokeWidth="1.2" className="box-fill animate-scene-splash" />
      <circle cy="2" r="6" strokeWidth="1" className="box-fill animate-scene-splash" style={offset(2.65)} />
      <PressureGauge cy={80} />
    </>
  ),

  /** Selective laser applied 360° around the drainage angle; fluid flowing out. */
  slt: ({ url }: Tools) => (
    <>
      <IrisFront guide={false} />
      <circle r="68" strokeWidth="6" opacity="0.16" />
      <LaserSpots spots={SLT_SPOTS} r={1.9} />
      <g className="animate-[spin_7s_linear_infinite]">
        <circle cx="68" r="8" fill={url('glow')} stroke="none" />
        <circle cx="68" r="2" fill="currentColor" stroke="none" />
      </g>
      {[45, 135, 225, 315].map((angle) => (
        <g key={angle} transform={`rotate(${angle})`} strokeWidth="1.1" opacity="0.8">
          <path d="M74 0H90" pathLength={100} strokeDasharray="10 10" className="animate-scene-flow" />
          <path d="M86 -3.5L90 0L86 3.5" />
        </g>
      ))}
    </>
  ),

  /** YAG laser opening a peripheral iris hole so fluid can bypass the pupil. */
  iridotomy: ({ url }: Tools) => (
    <>
      <IrisFront />
      <path
        d="M-4 -16C-12 -26 -20 -34 -23.5 -40.7C-27 -47.4 -32 -55 -40 -62"
        strokeWidth="1.2"
        pathLength={100}
        strokeDasharray="4 6"
        className="animate-scene-flow"
      />
      <path d="M-38.1 -56.3L-40 -62L-34.1 -60.8" strokeWidth="1.2" />
      <circle cx={IRIDOTOMY.x} cy={IRIDOTOMY.y} r="10" fill={url('glow')} stroke="none" className="animate-scene-flash" />
      <circle cx={IRIDOTOMY.x} cy={IRIDOTOMY.y} r="4.2" fill={INK} fillOpacity="0.9" strokeWidth="1.1" />
      <path d={BURST} strokeWidth="1" className="box-fill animate-scene-ripple" style={{ animationDuration: '1.8s' }} />
      <circle cx={IRIDOTOMY.x} cy={IRIDOTOMY.y} r="14" strokeWidth="0.8" strokeDasharray="2.5 3" className="box-fill animate-[spin_9s_linear_infinite]" />
    </>
  ),

  /** Drainage device: tube carrying fluid from the eye to a plate under the conjunctiva. */
  shunt: () => (
    <>
      <circle cy="22" r="64" strokeWidth="0.5" opacity="0.35" />
      <g transform="translate(0 22)">
        <IrisFront iris={46} pupil={17} guide={false} />
      </g>
      <ellipse cy="-62" rx="40" ry="21" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.5" className="box-fill animate-scene-breathe" />
      <ellipse cy="-62" rx="30" ry="13" fill="currentColor" fillOpacity="0.16" strokeWidth="1.3" />
      <ellipse cy="-62" rx="19" ry="6.5" strokeWidth="0.7" opacity="0.5" />
      <g fill={INK} fillOpacity="0.5" strokeWidth="0.8">
        <circle cx="-22" cy="-65" r="2" />
        <circle cx="22" cy="-65" r="2" />
      </g>
      <path d="M-3 -12C-4 -26 -2 -40 0 -49" strokeWidth="4.5" opacity="0.55" />
      <path d="M-3 -12C-4 -26 -2 -40 0 -49" strokeWidth="1.4" pathLength={100} strokeDasharray="4 6" className="animate-scene-flow" />
      <Particles items={SEEP} />
    </>
  ),
} satisfies Record<string, (tools: Tools) => ReactNode>;

export type SceneKey = keyof typeof scenes;

export const sceneKeys = Object.keys(scenes) as SceneKey[];

export function isSceneKey(value: unknown): value is SceneKey {
  return typeof value === 'string' && Object.hasOwn(scenes, value);
}

export function TechniqueScene({ scene, className }: { scene: SceneKey; className?: string }) {
  const scope = `scene${useId().replace(/[^\w-]/g, '')}`;
  const tools: Tools = { id: (name) => `${scope}-${name}`, url: (name) => `url(#${scope}-${name})` };

  return (
    <svg
      viewBox="-100 -100 200 200"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      className={className}
    >
      <defs>
        <radialGradient id={tools.id('glow')}>
          <stop offset="0" stopColor="currentColor" stopOpacity="0.95" />
          <stop offset="0.4" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={tools.id('beam')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id={tools.id('band')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="0.5" stopColor="currentColor" stopOpacity="0.6" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {scenes[scene](tools)}
    </svg>
  );
}
