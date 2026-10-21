/** `null`/`undefined` → '' for controlled inputs. */
export function str(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/** Trimmed string, or `null` when empty (nullable text columns). */
export function nullable(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

/** Latin, lower-case, dash-separated slug ("Cataract Early Signs" → "cataract-early-signs"). */
export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Accepts a YouTube id or any YouTube URL (watch, youtu.be, shorts, embed) and returns the 11-char id. */
export function extractYoutubeId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;
  if (/^[A-Za-z0-9_-]{11}$/.test(value)) return value;
  const match = value.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

/** Converts Arabic-Indic / Persian digits to Latin. */
export function latinDigits(value: string): string {
  return value.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660)).replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}
