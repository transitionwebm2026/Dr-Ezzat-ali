import {
  Activity,
  Aperture,
  ArrowRight,
  Award,
  BadgeCheck,
  CalendarCheck,
  ClipboardList,
  Crosshair,
  Droplets,
  Eye,
  Gauge,
  Glasses,
  GraduationCap,
  HeartPulse,
  Layers,
  Microscope,
  ScanEye,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Syringe,
  UserRound,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * String-keyed icon registry. Content files reference icons by key, which keeps data
 * serialisable across the Server → Client Component boundary.
 */
export const icons = {
  activity: Activity,
  aperture: Aperture,
  award: Award,
  badgeCheck: BadgeCheck,
  calendarCheck: CalendarCheck,
  clipboardList: ClipboardList,
  crosshair: Crosshair,
  droplets: Droplets,
  eye: Eye,
  gauge: Gauge,
  glasses: Glasses,
  graduationCap: GraduationCap,
  heartPulse: HeartPulse,
  layers: Layers,
  microscope: Microscope,
  scanEye: ScanEye,
  shieldCheck: ShieldCheck,
  sparkles: Sparkles,
  stethoscope: Stethoscope,
  syringe: Syringe,
  userRound: UserRound,
} satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof icons;

export function isIconKey(value: unknown): value is IconKey {
  return typeof value === 'string' && Object.hasOwn(icons, value);
}

export function Icon({ name, ...props }: { name: IconKey } & LucideProps) {
  const Component = icons[name];
  return <Component aria-hidden {...props} />;
}

/** Forward-pointing arrow that mirrors automatically in RTL. */
export function ArrowForward({ className, ...props }: LucideProps) {
  return <ArrowRight aria-hidden className={cn('rtl:-scale-x-100', className)} {...props} />;
}
