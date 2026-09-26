#!/usr/bin/env node
// Guardrail: asegura que public/scripts/landing-banner.js es un script clásico válido
// - Sin export/import
// - Parseable por new Function() (equivale a carga <script> clásico)

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const scriptPath = join(__dirname, '..', 'public', 'scripts', 'landing-banner.js');

function main() {
  let src;
  try {
    src = readFileSync(scriptPath, 'utf8');
  } catch (err) {
    console.error(`❌ No se pudo leer ${scriptPath}: ${err.message}`);
    process.exit(1);
  }

  // 1) No export/import
  if (/\b(export|import)\b/.test(src)) {
    console.error('❌ El script contiene export/import (no permitido en script clásico)');
    console.error('---');
    console.error(src);
    process.exit(1);
  }

  // 2) Parseable por new Function (simula carga <script> clásico)
  try {
    new Function(src);
  } catch (err) {
    console.error(`❌ new Function() lanzó SyntaxError: ${err.message}`);
    console.error('---');
    console.error(src);
    process.exit(1);
  }

  console.log('✅ Guardrail OK: script clásico válido (sin export/import, parseable)');
  process.exit(0);
}

main();
