type ClassValue = string | false | null | undefined | 0;

/** Joins conditional class names. Keep overrides non-conflicting (no tailwind-merge needed). */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
