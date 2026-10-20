/**
 * Post-build fix for Next.js static exports built on Windows.
 *
 * Next writes client-side prefetch "segment" files using `path.relative()`, which yields
 * backslash paths on Windows. Those end up as nested folders, e.g.
 *     out/contact/__next.!KGFyKQ/contact/__PAGE__.txt
 * while the browser requests the flat, dot-joined name:
 *     out/contact/__next.!KGFyKQ.contact.__PAGE__.txt
 * This script flattens every `__next.*` folder into the expected file names.
 * On macOS/Linux builds there are no such folders, so it is a no-op.
 */
import { readdir, rename, rm } from 'node:fs/promises';
import { basename, dirname, join, relative, sep } from 'node:path';

const outDir = join(process.cwd(), 'out');

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => (entry.isDirectory() ? listFiles(join(dir, entry.name)) : [join(dir, entry.name)])),
  );
  return nested.flat();
}

async function flatten(segmentDir) {
  const parent = dirname(segmentDir);
  const prefix = basename(segmentDir);
  const files = await listFiles(segmentDir);
  for (const file of files) {
    const flatName = `${prefix}.${relative(segmentDir, file).split(sep).join('.')}`;
    await rename(file, join(parent, flatName));
  }
  await rm(segmentDir, { recursive: true, force: true });
  return files.length;
}

async function walk(dir) {
  let count = 0;
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === '_next') continue;
    const full = join(dir, entry.name);
    count += entry.name.startsWith('__next.') ? await flatten(full) : await walk(full);
  }
  return count;
}

try {
  const fixed = await walk(outDir);
  console.log(fixed ? `✓ fix-static-export: flattened ${fixed} prefetch segment file(s)` : '✓ fix-static-export: nothing to fix');
} catch (error) {
  if (error.code === 'ENOENT') {
    console.warn('fix-static-export: no /out folder found — skipped');
  } else {
    throw error;
  }
}
