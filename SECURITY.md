# Política de seguridad

## Canal de reporte

Reporta vulnerabilidades de forma **privada** a `operaciones@alexendros.dev`.

No abras issues públicos con exploits, PoCs ofensivos, tokens, secretos ni PII.

## Versiones soportadas

| Versión | Soporte |
| --- | --- |
| `main` / última Release etiquetada (`vX.Y.Z`) | Activo |
| Tags anteriores | Solo rollback operativo; sin parches proactivos |

## Plazo orientativo de respuesta

- Acuse de recibo: ≤ 5 días laborables.
- Evaluación inicial y plan: ≤ 15 días laborables (según severidad).

## Secretos

- Prohibido pegar secretos en issues, PRs, commits, logs de CI o artefactos.
- Valores solo en GitHub Secrets / Vercel Env; nunca en el repo:
  - Proton SMTP (`SMTP_*`)
  - Upstash Redis (`UPSTASH_*`)
- Rotar tokens ante sospecha de fuga o cadencia trimestral mínima del SMTP.

## Alcance

Sitio de marketing/portfolio (alexendros.dev). Fuera de alcance: seguridad de terceros enlazados (Cal.com, Proton, Vercel, Upstash) más allá de su uso documentado.
