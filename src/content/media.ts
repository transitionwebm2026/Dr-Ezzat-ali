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

export type Tone = 'cyan' | 'navy' | 'sky' | 'deep' | 'teal' | 'frost';

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

/**
 * Photos for the three "expertise" cards on the About page (e.g. '/images/about/refractive.jpg').
 * Kept separate from `serviceVisuals` so they don't change the cards on other pages. Empty = illustration.
 */
export const expertiseImages: Record<string, string> = {
  refractive: '',
  cataract: '',
  retina: '',
};

export function getServiceVisual(id: string): Visual {
  return serviceVisuals[id] ?? fallbackVisual;
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

export function getTechniqueVisual(id: string): TechniqueVisual {
  return techniqueVisuals[id] ?? { scene: 'femto' };
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
