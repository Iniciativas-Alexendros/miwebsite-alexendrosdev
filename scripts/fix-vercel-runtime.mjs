#!/usr/bin/env node
/**
 * @astrojs/vercel@7.8.x solo conoce Node 18/20. Con Node 22 en el build
 * cae a runtime nodejs18.x, que Vercel ya rechaza. Reescribe a nodejs22.x
 * (engines/.nvmrc del repo) antes del deploy.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('.vercel/output/functions');
const TARGET = 'nodejs22.x';

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (entry.name !== '.vc-config.json') continue;
    const config = JSON.parse(fs.readFileSync(full, 'utf8'));
    if (
      typeof config.runtime === 'string' &&
      config.runtime !== TARGET &&
      config.runtime !== 'edge'
    ) {
      const prev = config.runtime;
      config.runtime = TARGET;
      fs.writeFileSync(full, JSON.stringify(config));
      console.log(
        `[fix-vercel-runtime] ${path.relative(process.cwd(), full)}: ${prev} → ${TARGET}`
      );
    }
  }
}

walk(ROOT);
