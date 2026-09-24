# Runbook — CI y release

### Propósito de este documento

- **Objetivos:** Operar el pipeline y el versionado sin confundirlo con el promote a Vercel.
- **Estructura:** CI principal → e2e opt-in → release → Renovate → incidentes.
- **Contenido a integrar según contexto:** Adapta nombres de jobs y el proyecto Vercel `alexendros-dev`. No copies husky/npm de webconfig. No cambies org settings ni branch protection desde un PR.

## CI principal

Workflow: `.github/workflows/ci.yml`.

| Job       | Bloquea PR      | Notas                                            |
| --------- | --------------- | ------------------------------------------------ |
| `quality` | Sí              | typecheck + lint + format                        |
| `test`    | Sí              | Vitest                                           |
| `build`   | Sí              | Artefacto `site-static`                          |
| `smoke`   | Sí              | Depende de `build`                               |
| `e2e`     | Solo si se pide | Label `e2e` o input `e2e` en `workflow_dispatch` |

`release.yml` queda aparte (semantic-release en `main`).

## Release

- Conventional Commits. Tipo extra `content` → patch (`.releaserc.json`).
- Push a `main` con CI verde → tag `vX.Y.Z` + `CHANGELOG.md`.
- **Versionado ≠ promote.** Vercel Production = merge a `main`.

## Renovate

`.github/renovate.json` cubre `npm` y `github-actions`. No hay Dependabot de version-updates. Majors de Zod / nodemailer / React / Astro siguen diferidos (issue #12).

## Si CI falla

1. Reproduce el job en local (`pnpm typecheck`, `test`, `build`, `smoke`).
2. `smoke` exige `.vercel/output/static` (tras `pnpm build`).
3. No force-push a `main`. No toques org settings.
