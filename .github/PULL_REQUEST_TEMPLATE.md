<!-- canon-managed: true -->

### Propósito de este documento

- **Objetivos:** Plantilla de PR para describir el cambio y exigir las comprobaciones `quality` / `test` / `build` / `smoke`.
- **Estructura:** Qué → por qué → cómo probar → checklist CI y contratos → notas.
- **Contenido a integrar según contexto:** Adapta el checklist a scripts pnpm de este sitio Astro. No copies plantillas de un SaaS ni de la CLI webconfig. e2e/LHCI es opt-in (label `e2e` o `workflow_dispatch`). No pegues secretos.

## Qué

Resume en una o dos frases qué cambia este pull request.

## Por qué

Explica el motivo. Si cierra un issue, indica `Cierra #N`.

## Cómo probar

Pasos verificables para revisar manualmente:

1.
2.
3.

## Lista de comprobación

- [ ] `pnpm typecheck && pnpm lint && pnpm format:check`
- [ ] `pnpm test && pnpm build && pnpm smoke`
- [ ] Docs actualizadas (README / CONTRIBUTING / SECURITY si cambia operación)
- [ ] Sin secretos ni credenciales
- [ ] CI `quality` / `test` / `build` / `smoke` en verde
- [ ] e2e/LHCI solo si el PR toca UI/a11y y lleva label `e2e` (opt-in)

## Notas para revisión

<!-- consideraciones especiales para quien revise -->
