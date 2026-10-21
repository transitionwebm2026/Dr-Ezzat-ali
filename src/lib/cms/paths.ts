/** "/about" → "/about/" (hashes kept); absolute URLs are returned untouched. Shared by the site and the dashboard. */
export function normalizePath(path: string): string {
  const value = path.trim();
  if (/^https?:\/\//.test(value)) return value;
  const [pathname, hash] = value.split('#');
  let clean = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (!clean.endsWith('/')) clean = `${clean}/`;
  return hash ? `${clean}#${hash}` : clean;
}
