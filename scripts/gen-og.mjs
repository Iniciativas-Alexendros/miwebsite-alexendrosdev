import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'public', 'og', 'default.png');
mkdirSync(dirname(out), { recursive: true });

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#141a21"/>
  <rect x="48" y="48" width="1104" height="534" rx="24" fill="none" stroke="#FFC53D" stroke-opacity="0.35" stroke-width="2"/>
  <text x="80" y="220" fill="#FFC53D" font-family="DejaVu Sans Mono, monospace" font-size="72" font-weight="700">Alexendros.dev</text>
  <text x="80" y="300" fill="#e8eaed" font-family="DejaVu Sans Mono, monospace" font-size="36">webs claras y útiles</text>
  <text x="80" y="520" fill="#8b949e" font-family="DejaVu Sans Mono, monospace" font-size="24">Para profesionales y pequeños negocios</text>
</svg>
`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log('Wrote', out);
