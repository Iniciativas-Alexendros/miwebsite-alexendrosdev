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

GitHub Actions: typecheck → lint → format:check → vitest → build → Playwright (axe 6 rutas + contact) → Lighthouse CI móvil ≥90.

## Deploy Vercel

**Hobby + repo público** → preview automático por PR (sin Pro). Proyecto Vercel: **`alexendros-dev`**. Production branch: `main`. Framework Preset **Astro**; Node **20** (`engines.node` / `.nvmrc`).

1. Repo enlazado en Vercel (Git → Deployments). Previews sin SSO (URLs `*.vercel.app` compartibles).
2. Env (Production + Preview) — **obligatorias para el formulario**:
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (Proton app password)
   - `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (sin ellas no hay rate-limit)
   - `PUBLIC_SITE_URL=https://alexendros.dev` (ya en Preview/Production/Development)
3. Smoke test del formulario en preview:

```bash
export PREVIEW_URL='https://TU-DEPLOYMENT.vercel.app'
curl -sS -X POST "$PREVIEW_URL/api/contact" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Smoke","email":"test@example.com","subject":"otro","message":"smoke preview alexendros","consent":true}'
# Con SMTP configurado: {"ok":true} + email en operaciones@alexendros.dev
# Sin SMTP: {"error":"Service unavailable"} (HTTP 500) — API alcanzable, falta env
```

### Go-live (apex) — cuando toque prod

1. Env **Production** completas (SMTP + Upstash + `PUBLIC_SITE_URL=https://alexendros.dev`).
2. Dominio apex `alexendros.dev` en Vercel Domains + DNS del panel.
3. Promote = merge a `main` / producción Vercel. El workflow `release.yml` solo crea tags/releases; **versionado ≠ deploy**.
4. Smoke `POST /api/contact` en prod + LCP en Speed Insights (objetivo &lt;1.65s).

## DONE

- Build verde, 0 errores TS
- axe-core 0 violaciones en 6 rutas
- Formulario → Upstash rate-limit + Proton SMTP
- OG 1200×630, favicon, fonts self-hosted, sin GA/cookies de tracking (métricas agregadas Vercel)
