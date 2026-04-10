import { build } from 'esbuild';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf-8'));
const tsc = join(__dirname, 'node_modules', '.bin', 'tsc');

const shared = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'neutral',
  target: 'node18',
  external: Object.keys(pkg.dependencies ?? {}),
};

await build({
  ...shared,
  format: 'esm',
  outfile: 'dist/index.js',
});

await build({
  ...shared,
  format: 'cjs',
  outfile: 'dist/index.cjs',
});

execSync(`"${tsc}" --emitDeclarationOnly --declaration --outDir dist`, { stdio: 'inherit' });

console.log('Build complete');
