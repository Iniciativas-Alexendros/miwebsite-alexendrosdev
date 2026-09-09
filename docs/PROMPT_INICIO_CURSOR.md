# PROMPT INICIO CURSOR — COPIAR EN AGENT MODE

Actúa como Senior Full Stack + CRO + a11y. Estás en el repo canónico **miwebsite-alexendrosdev** (Astro MVP en producción en https://alexendros.dev, proyecto Vercel `alexendros-dev`).

Contexto: Alexendros, full stack Valencia. 3 servicios de alcance cerrado, 4 proyectos con métricas reales. Stack Astro 4.16 + TS estricto + Tailwind OKLCH + Zod + Vercel. Sin GA; contacto vía Proton SMTP + Upstash (env en Vercel: issue #13).

Lee `.cursorrules`, `PLAN.md`, `docs/IDENTITY.md`, `docs/INSTRUCCIONES_CURSOR.md`, `README.md`.

Modo por defecto: **mantenimiento** (no greenfield). Antes de cambiar código:

1. Confirma el objetivo y el alcance (no pricing, no CMS, no Google Fonts, no ampliar servicios).
2. Trabaja en rama `cursor/…` desde `main`; PR borrador al terminar.
3. Verifica con `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` y e2e/axe cuando toque UI o a11y.
4. Documenta en README/PLAN solo si el cambio altera operación, deploy o contratos públicos.

Prioridades de producto: LCP &lt;1.65s, Lighthouse ≥90 móvil, 0 violaciones axe en las 6 rutas CI, formulario de 3 campos (+ asunto) con honeypot, privacidad real.

Entrega: resumen de cambios, cómo probar y riesgos (p. ej. formulario sin SMTP hasta #13).
