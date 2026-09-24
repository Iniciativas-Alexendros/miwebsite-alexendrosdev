# Guía de desarrollo

### Propósito de este documento

- **Objetivos:** Setup local y comandos habituales sin reescribir el README.
- **Estructura:** Requisitos → arranque → scripts → reglas de contenido.
- **Contenido a integrar según contexto:** Adapta pnpm y Node 22 de este repo. No copies un flujo npm/monorepo.

## Requisitos

- Node **22** (`.nvmrc` / `engines.node`)
- pnpm 9

```bash
pnpm i
cp .env.example .env   # SMTP_* + UPSTASH_* + CAL_WEBHOOK_SECRET + NOTION_*
pnpm gen:og            # public/og/default.png si falta
pnpm dev               # http://localhost:4321
```

## Scripts

| Comando                                    | Job CI         | Qué hace                                |
| ------------------------------------------ | -------------- | --------------------------------------- |
| `pnpm typecheck` / `lint` / `format:check` | `quality`      | Tipos, ESLint, Prettier                 |
| `pnpm test`                                | `test`         | Vitest (contratos API + helpers)        |
| `pnpm build`                               | `build`        | `astro check` + build + runtime Vercel  |
| `pnpm smoke`                               | `smoke`        | HTML estático + HTTP 200 en rutas clave |
| `pnpm test:e2e` / `pnpm lhci`              | `e2e` (opt-in) | Playwright/axe y Lighthouse móvil ≥90   |

`preview` sirve `.vercel/output/static` (el adapter Vercel no soporta `astro preview`).

## Contenido

Textos y ofertas viven en `src/content/*.ts`. No toques pricing, no añadas CMS ni Google Fonts, no amplíes el alcance de servicios sin confirmación.
