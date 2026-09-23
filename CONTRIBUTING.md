# Contribuir — alexendros.dev

## Requisitos

- Node **22** (`.nvmrc` / `engines`)
- pnpm (ver `packageManager` en `package.json`)

## Flujo

1. Rama desde `main` (`feat/…`, `fix/…`, `docs/…`, `content/…`).
2. `pnpm i && pnpm typecheck && pnpm lint && pnpm format:check && pnpm test && pnpm build`
3. PR con CI verde (incluye Playwright/axe y LHCI móvil ≥90).

## Commits

Conventional Commits. Tipos extra del release: `content` (patch). Ver `.releaserc.json`.

## Deploy

Promote = merge a `main`. Versionado (semantic-release) ≠ deploy Vercel.
