#!/usr/bin/env node
import { execSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = 'dist';
if (!existsSync(outDir)) {
  console.error(`[pack] ${outDir}/ not found. Run your build first (e.g., npm run build).`);
  process.exit(1);
}
const stamp = new Date().toISOString().replace(/[:]/g,'-').slice(0,19);
const outBase = `mpl-playground-${stamp}`;
const outRoot = 'dist-bundles';
mkdirSync(outRoot, { recursive: true });

function has(cmd) {
  try { execSync(`${cmd} --version`, { stdio: 'ignore' }); return true; } catch { return false; }
}

// Windows-compatible path handling
const isWindows = process.platform === 'win32';
const pathSep = isWindows ? '\\' : '/';

if (has('zip')) {
  const zip = join(outRoot, `${outBase}.zip`);
  console.log(`[pack] creating ${zip}`);
  const res = spawnSync('zip', ['-r', zip, '.'], { cwd: outDir, stdio: 'inherit' });
  process.exit(res.status ?? 0);
} else if (has('tar')) {
  const tgz = join(outRoot, `${outBase}.tar.gz`);
  console.log(`[pack] creating ${tgz}`);
  const res = spawnSync('tar', ['-czf', tgz, '.'], { cwd: outDir, stdio: 'inherit' });
  process.exit(res.status ?? 0);
} else {
  console.error('[pack] neither `zip` nor `tar` found. Please install one and retry.');
  process.exit(2);
}
