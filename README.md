# alexendros.dev — Astro MVP (conversión + contratación)

Stack: Astro 4 hybrid + React island (`ContactForm`) + Tailwind OKLCH + TypeScript estricto + Zod + Vercel serverless API.

## Dev

```bash
pnpm i
cp .env.example .env   # SMTP_* + UPSTASH_*
pnpm gen:og            # public/og/default.png
pnpm dev               # http://localhost:4321
pnpm build && pnpm preview
pnpm test:e2e
```

`preview` sirve `.vercel/output/static` (el adapter Vercel no soporta `astro preview`).

## CI

GitHub Actions: typecheck → build → Playwright (axe 6 rutas + contact) → Lighthouse CI móvil ≥90.

## Deploy Vercel

1. Importar el repo; Framework Preset **Astro**; Node **20**.
2. Env (Production + Preview):
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
   - `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
   - `PUBLIC_SITE_URL=https://alexendros.dev`
3. Dominio apex `alexendros.dev`; preview por PR; promote a prod al merge en `main`.
4. Verificar `POST /api/contact` con un envío real a Proton (`operaciones@alexendros.dev`).

## DONE

- Build verde, 0 errores TS
- axe-core 0 violaciones en 6 rutas
- Formulario → Upstash rate-limit + Proton SMTP
- OG 1200×630, favicon, fonts self-hosted, sin GA/Google Fonts
