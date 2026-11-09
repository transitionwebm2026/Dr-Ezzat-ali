/**
 * Non-translatable media & visual settings, keyed by the ids/slugs used in the dictionaries.
 *
 * - `image`: optional real photo (place files in /public/images/...). When omitted, a branded
 *   optical illustration is rendered instead, so the site never shows a broken image.
 * - `youtubeId` / `src`: vertical (9:16) video sources. Use a YouTube Shorts id, or a self-hosted
 *   MP4 in /public/videos. Leave both empty to show the poster with a "coming soon" state.
 */
import type { IconKey } from '@/components/icons/registry';
import type { SceneKey } from '@/components/services/TechniqueScene';

export const tones = ['cyan', 'navy', 'sky', 'deep', 'teal', 'frost'] as const;
export type Tone = (typeof tones)[number];

export function isTone(value: unknown): value is Tone {
  return typeof value === 'string' && (tones as readonly string[]).includes(value);
}

export type Visual = { icon: IconKey; tone: Tone; image?: string };

export const serviceVisuals: Record<string, Visual> = {
  // Surgeries & specialties
  lasik: { icon: 'crosshair', tone: 'cyan' },
  refractive: { icon: 'crosshair', tone: 'cyan' },
  cataract: { icon: 'aperture', tone: 'navy' },
  retina: { icon: 'scanEye', tone: 'deep' },
  glaucoma: { icon: 'gauge', tone: 'sky' },
  // Treatments
  crosslinking: { icon: 'layers', tone: 'sky' },
  cornea: { icon: 'layers', tone: 'sky' },
  'dry-eye': { icon: 'droplets', tone: 'teal' },
  'anti-vegf': { icon: 'syringe', tone: 'navy' },
};

export const fallbackVisual: Visual = { icon: 'eye', tone: 'cyan' };

/** Home-page sections whose cards are picked from the services page. */
export const homeSections = ['surgeries', 'treatments'] as const;
export type HomeSection = (typeof homeSections)[number];

export function isHomeSection(value: unknown): value is HomeSection {
  return typeof value === 'string' && (homeSections as readonly string[]).includes(value);
}

/**
 * Default home-page cards (repository content; the dashboard sets its own per specialty / technique):
 * specialty or technique id → home section + short tag shown on the card.
 */
export const homeDefaults: Record<string, { section: HomeSection; tag: string }> = {
  // Specialties → "Key surgeries"
  lasik: { section: 'surgeries', tag: 'Femto-LASIK · SMILE' },
  cataract: { section: 'surgeries', tag: 'Phaco · Premium IOL' },
  retina: { section: 'surgeries', tag: 'Vitrectomy' },
  // Techniques → "Advanced non-surgical treatments"
  'anti-vegf': { section: 'treatments', tag: 'Anti-VEGF' },
  'retinal-laser': { section: 'treatments', tag: 'Laser' },
  slt: { section: 'treatments', tag: 'SLT' },
};

/**
 * Photos for the three "expertise" cards on the About page (e.g. '/images/about/refractive.jpg').
 * Kept separate from `serviceVisuals` so they don't change the cards on other pages. Empty = illustration.
 */
export const expertiseImages: Record<string, string> = {
  refractive: '',
  cataract: '',
  retina: '',
};

/** Visual of a service card. `custom` = choices saved in the dashboard; anything left out falls back to the default for `id`. */
export function getServiceVisual(id: string, custom?: Partial<Visual>): Visual {
  const base = serviceVisuals[id] ?? fallbackVisual;
  if (!custom) return base;
  return { icon: custom.icon ?? base.icon, tone: custom.tone ?? base.tone, image: custom.image ?? base.image };
}

/**
 * Preview shown in a specialty's media panel when one of its technique cards is selected.
 * `scene` picks the animated medical illustration; an optional `image` replaces it with a photo.
 */
export type TechniqueVisual = { scene: SceneKey; image?: string };

export const techniqueVisuals: Record<string, TechniqueVisual> = {
  // LASIK & refractive
  'femto-lasik': { scene: 'femto' },
  smile: { scene: 'smile' },
  prk: { scene: 'prk' },
  icl: { scene: 'icl' },
  // Cataract
  phaco: { scene: 'phaco' },
  multifocal: { scene: 'multifocal' },
  toric: { scene: 'toric' },
  edof: { scene: 'edof' },
  // Retina
  vitrectomy: { scene: 'vitrectomy' },
  'anti-vegf': { scene: 'injection' },
  'retinal-laser': { scene: 'photocoagulation' },
  oct: { scene: 'oct' },
  // Glaucoma
  'medical-therapy': { scene: 'drops' },
  slt: { scene: 'slt' },
  'yag-iridotomy': { scene: 'iridotomy' },
  'glaucoma-surgery': { scene: 'shunt' },
};

export function getTechniqueVisual(id: string, custom?: Partial<TechniqueVisual>): TechniqueVisual {
  const base = techniqueVisuals[id] ?? { scene: 'femto' };
  if (!custom) return base;
  return { scene: custom.scene ?? base.scene, image: custom.image ?? base.image };
}

export const videoSources: Record<string, { youtubeId: string; src: string; tone: Tone }> = {
  'what-is-lasik': { youtubeId: '', src: '', tone: 'cyan' },
  'femto-vs-smile': { youtubeId: '', src: '', tone: 'navy' },
  'cataract-timing': { youtubeId: '', src: '', tone: 'deep' },
  'choosing-iol': { youtubeId: '', src: '', tone: 'sky' },
  'diabetic-retina': { youtubeId: '', src: '', tone: 'navy' },
  'glaucoma-thief': { youtubeId: '', src: '', tone: 'cyan' },
  'keratoconus-cxl': { youtubeId: '', src: '', tone: 'teal' },
  'dry-eye-screens': { youtubeId: '', src: '', tone: 'deep' },
  'after-lasik-tips': { youtubeId: '', src: '', tone: 'sky' },
};

export const articleVisuals: Record<string, Visual> = {
  'vision-correction-guide': { icon: 'crosshair', tone: 'navy' },
  'cataract-early-signs': { icon: 'aperture', tone: 'cyan' },
  'diabetic-retinopathy-screening': { icon: 'scanEye', tone: 'deep' },
  'glaucoma-silent-thief': { icon: 'gauge', tone: 'sky' },
  'keratoconus-early-diagnosis': { icon: 'layers', tone: 'teal' },
  'dry-eye-screens': { icon: 'droplets', tone: 'cyan' },
  'glasses-lenses-or-lasik': { icon: 'glasses', tone: 'navy' },
};

export function getArticleVisual(slug: string): Visual {
  return articleVisuals[slug] ?? fallbackVisual;
}
