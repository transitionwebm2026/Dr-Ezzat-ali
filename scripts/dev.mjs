/**
 * `npm run dev`: the Next.js dev server + `cms-pull.mjs --watch`, so content saved in the dashboard
 * shows up on localhost within a few seconds (the live site updates through the publish pipeline instead).
 * Extra arguments go to `next dev`, e.g. `npm run dev -- -p 3001`.
 */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const nextBin = fileURLToPath(new URL('../node_modules/next/dist/bin/next', import.meta.url));
const pullScript = fileURLToPath(new URL('./cms-pull.mjs', import.meta.url));

// The IPC channel lets the watcher notice when this process dies, so it never keeps polling on its own.
const watcher = spawn(process.execPath, [pullScript, '--watch'], { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] });
const next = spawn(process.execPath, [nextBin, 'dev', ...process.argv.slice(2)], { stdio: 'inherit' });

next.on('exit', (code) => {
  watcher.kill();
  process.exit(code ?? 0);
});
