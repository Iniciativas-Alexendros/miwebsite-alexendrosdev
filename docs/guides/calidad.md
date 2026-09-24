# Guía de calidad

### Propósito de este documento

- **Objetivos:** Declarar gates de calidad de este sitio y el mínimo de flota.
- **Estructura:** Jobs CI → cobertura → a11y/perf opt-in → lo que no se mide aquí.
- **Contenido a integrar según contexto:** Adapta umbrales de este portfolio Astro. No copies gates de CLI (tokens/DS) ni de un SaaS.

## Jobs (canon)

1. **quality** — `typecheck`, `lint`, `format:check`
2. **test** — Vitest (`src/**/*.test.ts`, `scripts/**/*.test.ts`)
3. **build** — artefacto estático `.vercel/output/static`
4. **smoke** — `scripts/smoke.sh` (archivos + HTTP 200)
5. **e2e** — opt-in: Playwright (axe en 6 rutas + contacto) y LHCI móvil ≥90

## Cobertura

Mínimo de flota: **≥ 70 %** (statements/functions/lines; branches ≥ 70 %). Este repo **no** publica aún un gate de coverage en Vitest: los tests de contrato cubren schema, SMTP, handler, Cal HMAC y Notion mapper. No bajes tests existentes. Si se añade reporter, el umbral no debe quedar por debajo del mínimo de flota.

## Accesibilidad y rendimiento

Objetivos de producto (cuando corre e2e/LHCI o Speed Insights en prod):

- axe-core: 0 violaciones en las rutas CI
- Lighthouse móvil ≥90 en 4 categorías
- LCP objetivo &lt;1.65s

El job `e2e` no bloquea PRs por defecto. Actívalo con label `e2e` o `workflow_dispatch` si el cambio toca UI, a11y o CWV.
