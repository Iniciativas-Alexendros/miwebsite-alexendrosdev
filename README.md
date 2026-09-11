# alexendros.dev

Sitio profesional de Alexendros (conversión + contratación). **Producción:** [https://alexendros.dev](https://alexendros.dev).

|                   |                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Repo canónico     | [`Iniciativas-Alexendros/miwebsite-alexendrosdev`](https://github.com/Iniciativas-Alexendros/miwebsite-alexendrosdev)     |
| Proyecto Vercel   | **`alexendros-dev`** (Hobby, team `alexendros-team`)                                                                      |
| Production branch | `main` → deploy automático                                                                                                |
| Predecesor        | [`nuevowebsite-alexendrosdev`](https://github.com/Iniciativas-Alexendros/nuevowebsite-alexendrosdev) (archivado, Next.js) |

## Stack

Astro 4 hybrid + isla React (`ContactForm`, `client:load`) + Tailwind OKLCH + TypeScript estricto + Zod + API serverless en Vercel. Fuentes Inter + JetBrains Mono self-hosted. Sin GA ni cookies de tracking; sí Vercel Analytics y Speed Insights (agregados).

## Dev

```bash
pnpm i
cp .env.example .env   # SMTP_* + UPSTASH_* + CAL_WEBHOOK_SECRET + NOTION_*
pnpm gen:og            # public/og/default.png
pnpm dev               # http://localhost:4321
pnpm build && pnpm preview
pnpm test:e2e
```

`preview` sirve `.vercel/output/static` (el adapter Vercel no soporta `astro preview`). Node **22** (`engines.node` / `.nvmrc`).

## CI

GitHub Actions: typecheck → lint → format:check → vitest → build → Playwright (axe 6 rutas + contact) → Lighthouse CI móvil ≥90.

## Deploy

- **Hobby + repo público** → preview automático por PR (`*.vercel.app`). Previews sin SSO (decisión 2A; URLs compartibles).
- **Promote = merge a `main`** con CI verde. No desplegar a Production desde ramas de feature ni “Promote” ad-hoc sin revisión.
- **Releases automáticas** con [semantic-release](https://semantic-release.gitbook.io/) en cada push a `main` (`release.yml`): SemVer; `content`/`docs`/`chore`/`style`/`refactor` → patch, `feat` → minor, breaking → major; changelog en español por secciones. **Versionado ≠ deploy** a Vercel.
- Dominio apex `alexendros.dev` (+ redirect `www` → apex) en el proyecto `alexendros-dev`.
- Checklist merge: typecheck, lint, format, vitest, build, e2e/axe, LHCI ≥90 móvil en el PR antes de fusionar.

### Variables de entorno (Production + Preview)

Obligatorias para que el formulario funcione ([issue #13](https://github.com/Iniciativas-Alexendros/miwebsite-alexendrosdev/issues/13)). Cargarlas en el proyecto Vercel **`alexendros-dev`** (panel o `vercel env add`); **nunca** en git:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (Proton app password)
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- `PUBLIC_SITE_URL=https://alexendros.dev`
- `CAL_WEBHOOK_SECRET` (secreto del webhook en Cal.com; obligatorio para verificar `X-Cal-Signature-256`)
- `NOTION_TOKEN` (integración interna con acceso a Leads / Bookings)
- `NOTION_LEADS_DATABASE_ID=84b33eb7-f117-46ad-aedd-120852b5cbb7` — **data source id** para `@notionhq/client` v5 (`Notion-Version: 2025-09-03`). No uses el id de la página contenedora (`7c26e759d97d4f398b7955944a084b69`). Opcional: `NOTION_LEADS_DATA_SOURCE_ID` (gana si ambos existen).

Procedimiento (sin imprimir valores):

1. `vercel link` al proyecto `alexendros-dev`.
2. `vercel env ls production` / `preview` para comprobar nombres presentes.
3. Añadir o rotar secretos con `vercel env add <NAME> production` (y Preview solo con sandbox SMTP/Upstash; no reutilizar prod si las previews pueden enviar correo a terceros).
4. Redeploy Production tras cargar SMTP.

Sin SMTP (o con `SMTP_PORT` inválido), o sin Upstash / Redis caído, `POST /api/contact` responde **HTTP 503** con JSON genérico `{ "error": "Service unavailable" }` (fail-closed antispam; logs `contact_smtp_misconfigured` / `contact_redis_*` sin PII). El resto del sitio sirve con normalidad.

Contrato resumido: solo POST + `Content-Type: application/json`; body ≤ 16 KiB; validación Zod genérica (400); rate limit 10/min → 429 + `Retry-After`; honeypot → 200 sin correo.

```bash
curl -sS -X POST 'https://alexendros.dev/api/contact' \
  -H 'Content-Type: application/json' \
  -d '{"name":"Smoke","email":"test@example.com","subject":"otro","message":"smoke prod alexendros","consent":true}'
# Con SMTP: {"ok":true} + email en operaciones@alexendros.dev
# Sin SMTP: {"error":"Service unavailable"} (HTTP 503)
```

### Cal.com → Notion Leads (`POST /api/cal/webhook`)

Webhook firmado (HMAC-SHA256 del body en crudo, cabecera `X-Cal-Signature-256`). Eventos: `BOOKING_CREATED`, `BOOKING_PAID`, `BOOKING_PAYMENT_INITIATED`, `BOOKING_RESCHEDULED`, `BOOKING_CANCELLED`, `BOOKING_REJECTED`. Upsert en la data source [Leads / Bookings](https://app.notion.com/p/7c26e759d97d4f398b7955944a084b69) keyed by `payload.uid` → `cal_booking_id`. Upstash Redis **solo** para idempotencia (`alexendros:cal:uid:{uid}:{trigger}`, TTL 7 días); Notion es la fuente de verdad.

En Cal.com: subscriber URL `https://alexendros.dev/api/cal/webhook` (o la preview `*.vercel.app`) y el mismo secreto que `CAL_WEBHOOK_SECRET`.

Cargar en Vercel (**Production** y **Preview** del proyecto `alexendros-dev`), sin imprimir valores:

```bash
vercel env add CAL_WEBHOOK_SECRET production
vercel env add NOTION_TOKEN production
vercel env add NOTION_LEADS_DATABASE_ID production
# repetir para preview; el id de data source no es secreto:
# 84b33eb7-f117-46ad-aedd-120852b5cbb7
```

Prueba local con firma falsa (el HMAC debe calcularse sobre **exactamente** los mismos bytes que `--data-binary`):

```bash
# .env con CAL_WEBHOOK_SECRET, NOTION_*, UPSTASH_* (o espera 503 si faltan Notion/Redis)
export CAL_WEBHOOK_SECRET='test-secret'
cat > /tmp/cal-body.json <<'EOF'
{"triggerEvent":"BOOKING_CREATED","createdAt":"2026-09-11T09:00:00.000Z","payload":{"uid":"test-uid-local","type":"diagnostico-web","title":"Diagnóstico","startTime":"2026-09-12T10:00:00.000Z","attendees":[{"name":"Test","email":"test@example.com"}],"metadata":{}}}
EOF
SIG=$(node -e "const fs=require('node:fs'); const c=require('node:crypto'); const b=fs.readFileSync('/tmp/cal-body.json'); process.stdout.write(c.createHmac('sha256', process.env.CAL_WEBHOOK_SECRET).update(b).digest('hex'))")
curl -sS -X POST 'http://localhost:4321/api/cal/webhook' \
  -H 'Content-Type: application/json' \
  -H "X-Cal-Signature-256: $SIG" \
  --data-binary @/tmp/cal-body.json
```

Sin secreto: HTTP 503 `{ "error": "Service unavailable" }`. Firma inválida: HTTP 401. CI no llama a Notion ni Redis (mocks en vitest).

## DONE

- Build verde, 0 errores TS; axe-core 0 violaciones en 6 rutas; Lighthouse CI ≥90 móvil
- Formulario (código) → Upstash rate-limit + Proton SMTP (env pendientes #13)
- OG 1200×630, favicon, fonts self-hosted, métricas agregadas Vercel
- Apex en producción sobre este repo / proyecto `alexendros-dev`
