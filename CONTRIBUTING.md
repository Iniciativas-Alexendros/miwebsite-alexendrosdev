# Contribuir — alexendros.dev

### Propósito de este documento

- **Objetivos:** Explicar setup, flujo de rama/PR y comprobaciones locales sin romper contenido ni contratos de API.
- **Estructura:** Idioma → requisitos → flujo → commits → deploy.
- **Contenido a integrar según contexto:** Adapta pnpm, Node 22 y jobs `quality`/`test`/`build`/`smoke`. No copies husky/npm de otro paquete. e2e es opt-in.

Idioma: este fichero, README y `docs/guides|runbooks` en español. Commits y PRs en español (Conventional Commits).

Lee también [AGENTS.md](AGENTS.md), [ARCHITECTURE.md](ARCHITECTURE.md) y [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Requisitos

- Node **22** (`.nvmrc` / `engines`)
- pnpm (ver `packageManager` en `package.json`)

## Flujo

1. Rama desde `main` (`feat/…`, `fix/…`, `docs/…`, `content/…`).
2. `pnpm i && pnpm typecheck && pnpm lint && pnpm format:check && pnpm test && pnpm build && pnpm smoke`
3. PR con CI verde (`quality`, `test`, `build`, `smoke`). Playwright/axe y LHCI: label `e2e` si tocas UI o a11y.
4. Vulnerabilidades: [SECURITY.md](SECURITY.md), no un issue público.

## Commits

Conventional Commits. Tipos extra del release: `content` (patch). Ver `.releaserc.json`.

## Deploy

Promote = merge a `main`. Versionado (semantic-release) ≠ deploy Vercel.
