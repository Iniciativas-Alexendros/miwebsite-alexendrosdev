# Estado — alexendros.dev (Astro MVP)

MVP en **producción** en [https://alexendros.dev](https://alexendros.dev). Repo canónico: `Iniciativas-Alexendros/miwebsite-alexendrosdev`. Proyecto Vercel: **`alexendros-dev`**.

## Objetivos cumplidos

- LCP objetivo &lt;1.65s; CLS &lt;0.1; INP &lt;200ms (Speed Insights en prod)
- Lighthouse CI ≥90 móvil en 4 categorías (6 rutas)
- axe-core 0 violaciones en `/`, `/servicios`, `/servicios/*`, `/proyectos`, `/proyectos/*`, `/contacto`
- Formulario 3 campos + asunto + honeypot (sin captcha); código listo con Upstash + Proton SMTP
- Sin cookies no esenciales, sin GA; Analytics/Speed Insights agregados

## Arquitectura entregada

- Contenido tipado en `src/content/*.ts` (Zod en build)
- Páginas: home, servicios, proyectos, sobre-mí, contacto, aviso-legal, privacidad
- Única isla cliente: `ContactForm.tsx` (`client:load`)
- API: `src/pages/api/contact.ts` (Zod, honeypot, rate-limit, nodemailer)
- CI: typecheck, lint, format, vitest, build, Playwright axe, LHCI
- Deploy Hobby: preview por PR; producción = merge a `main`

## Pendiente operativo

| Item | Issue / nota |
| --- | --- |
| Env SMTP + Upstash en Vercel | [#13](https://github.com/Iniciativas-Alexendros/miwebsite-alexendrosdev/issues/13) |
| Migrar Node 22/24 antes de 2026-10-01 | [#11](https://github.com/Iniciativas-Alexendros/miwebsite-alexendrosdev/issues/11) |
| Majors Dependabot (zod 4, nodemailer 10, React/Astro) | [#12](https://github.com/Iniciativas-Alexendros/miwebsite-alexendrosdev/issues/12) — no mergear sin triage |

## Predecesor

El sitio Next.js en `nuevowebsite-alexendrosdev` está **archivado**. No hay redirecciones legacy de rutas; lanzamiento limpio sobre este stack Astro.

## Criterios de mantenimiento

No tocar pricing sin confirmar; no añadir CMS ni Google Fonts; no ampliar alcance de servicios sin decisión explícita. Commits y PRs en español; ramas `cursor/…` + PR borrador desde `main`.
