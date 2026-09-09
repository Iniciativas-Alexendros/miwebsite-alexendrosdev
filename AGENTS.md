## Learned User Preferences

- Responder siempre en español.
- Commits en español.
- Sin GA ni cookies de tracking; sí Vercel Analytics y Speed Insights (agregados, sin cookies).
- No tocar pricing sin confirmar; no añadir CMS ni Google Fonts; no cambiar el alcance de los servicios.
- Preferir repo público + Vercel Hobby para preview por PR (decisión 1B); relajar Deployment Protection/SSO de previews para URLs compartibles (decisión 2A).
- Versionado (tags/release.yml) distinto de promote a producción.
- Al trabajar desde `main`, abrir rama `cursor/…`, commit/push y PR en borrador (no push directo a default).

## Learned Workspace Facts

- Repo canónico público: `Iniciativas-Alexendros/miwebsite-alexendrosdev`; producción apex `https://alexendros.dev` en proyecto Vercel **`alexendros-dev`** (Hobby), Git link a este repo.
- Predecesor Next.js `nuevowebsite-alexendrosdev` archivado; no reutilizar como fuente de verdad.
- Stack MVP: Astro 4.16 + isla React `ContactForm` (`client:load`) + Tailwind OKLCH + TS estricto + Zod; contacto vía Proton SMTP (`operaciones@alexendros.dev`), honeypot y rate-limit Upstash.
- `engines.node` fijado a `22.x` (`.nvmrc`); validar Preview tras merge (issue #11).
- CI esperado: typecheck, lint, format, vitest, build, e2e/axe (6 rutas), LHCI móvil ≥90; LCP objetivo &lt;1.65s.
- Dependabot: majors (zod 4, nodemailer 10, React/Astro) diferidos (issue #12); no mergear majors sin triage.
- SMTP/Upstash en Vercel pendientes para que `POST /api/contact` deje de fallar en preview/prod (issue #13).
