### Propósito de este documento

- **Objetivos:** Contrato operativo para agentes de código y el rol Mantenedor: preferencias aprendidas, fuentes de verdad y Definition of Done.
- **Estructura:** Propósito → preferencias → hechos del workspace → CI canónico.
- **Contenido a integrar según contexto:** Conserva las preferencias de este portfolio. No copies un `AGENTS.md` de landing/SaaS ni tokens/DS de otro paquete. No reutilices `release.yml` ni cambies pricing/servicios sin confirmación.

**Destinatarios:** agentes de código y el rol Mantenedor. Homogeneizamos **nombres y contratos** (jobs `quality` / `test` / `build` / `smoke`), no el copy del sitio.

## Learned User Preferences

- Responder siempre en español.
- Commits en español.
- Sin GA ni cookies de tracking; sí Vercel Analytics y Speed Insights (agregados, sin cookies).
- No tocar pricing sin confirmar; no añadir CMS ni Google Fonts; no cambiar el alcance de los servicios.
- Preferir repo público + Vercel Hobby para preview por PR (decisión 1B); relajar Deployment Protection/SSO de previews para URLs compartibles (decisión 2A).
- Versionado (semantic-release / release.yml) distinto de promote a producción; content=patch, feat=minor, breaking=major.
- Al trabajar desde `main`, abrir rama `cursor/…`, commit/push y PR en borrador (no push directo a default).

## Learned Workspace Facts

- Repo canónico público: `Iniciativas-Alexendros/miwebsite-alexendrosdev`; producción apex `https://alexendros.dev` en proyecto Vercel **`alexendros-dev`** (Hobby), Git link a este repo.
- Predecesor Next.js `nuevowebsite-alexendrosdev` archivado; no reutilizar como fuente de verdad.
- Stack MVP: Astro 4.16 + isla React `ContactForm` (`client:load`) + Tailwind OKLCH + TS estricto + Zod; contacto vía Proton SMTP (`operaciones@alexendros.dev`), honeypot y rate-limit Upstash.
- `engines.node` fijado a `22.x` (`.nvmrc`); validar Preview tras merge (issue #11).
- CI canónico: jobs `quality`, `test`, `build`, `smoke`. e2e/axe (6 rutas) y LHCI móvil ≥90 son **opt-in** (label `e2e`). LCP objetivo &lt;1.65s.
- Renovate (`.github/renovate.json`) sustituye Dependabot version-updates. Majors (zod 4, nodemailer 10, React/Astro) diferidos (issue #12); no mergear majors sin triage.
- SMTP/Upstash en Vercel pendientes para que `POST /api/contact` deje de fallar en preview/prod (issue #13).
