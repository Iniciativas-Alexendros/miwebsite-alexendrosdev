# INSTRUCCIONES CURSOR — Arranque en este repo

1. Cursor → Open Folder → `miwebsite-alexendrosdev` (este repositorio).
2. Terminal: Node 20 (`engines.node` / `.nvmrc`) → `pnpm install`.
3. `cp .env.example .env` → rellena `SMTP_*` y `UPSTASH_*` para probar el formulario en local.
4. `pnpm dev` → http://localhost:4321
5. `pnpm build && pnpm preview` → estático local (`.vercel/output/static`).
6. Desde `main`: crea rama `cursor/…`, trabaja, commit, push y **PR en borrador** (no push directo a `main`).
7. CI en PR: typecheck, lint, format, vitest, build, Playwright axe (6 rutas), LHCI móvil ≥90.
8. Merge a `main` = producción en Vercel proyecto **`alexendros-dev`** (apex `https://alexendros.dev`).
9. Prompt de sesión: pega [`PROMPT_INICIO_CURSOR.md`](./PROMPT_INICIO_CURSOR.md) en Agent mode.

Reglas no negociables:

- No Google Fonts, no CMS externo, no cambiar pricing sin confirmar
- Solo `ContactForm.tsx` es cliente; resto Astro server
- Colores OKLCH, focus-visible, teclado + screen reader
- Contenido tipado `src/content/*.ts` con Zod en build
- Sin GA ni cookies de tracking; sí Analytics/Speed Insights de Vercel
