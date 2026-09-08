# PROMPT INICIO CURSOR — COPIAR EN CURSOR CHAT AGENT

Actua como Senior Full Stack + CRO + a11y. Estas en cursor-bundle-final. Objetivo: MVP Astro listo produccion Vercel con maxima conversion y contratacion.

Contexto: Alexendros, dev full stack Valencia, 3 servicios alcance cerrado (produccion webs, auditorias, consultoria), 4 proyectos metricas reales (-65% LCP, +40% reservas, 48h->5min venta, +300% pedidos, 0 axe-core, 98/100/100/100 Lighthouse). Stack Astro 4.16 + TS estricto + Tailwind OKLCH + Zod + Stripe/Payload + Vercel. Sin GA, sin cookies no esenciales, privacidad real Proton SMTP.

Lee .cursorrules, PLAN.md, docs/IDENTITY.md, docs/INSTRUCCIONES_CURSOR.md.

Ejecuta en orden:

1. pnpm install && pnpm build — corrige errores TS, asegura 29 archivos base compilan
2. Implementa src/pages/api/contact.ts REAL: Upstash Redis rate-limit 10 req/min por IP, nodemailer + Proton SMTP (SMTP_HOST, SMTP_USER, SMTP_PASS en .env), From: operaciones@alexendros.dev To: operaciones@alexendros.dev Reply-To: form.email, asunto [alexendros.dev] {subject} - {name}, HTML escapado con datos, log sin PII, honeypot check, Zod validacion 20-2000 chars mensaje, consent boolean
3. Crea public/favicon.svg (A ambar #FFC53D sobre bg oscuro #141a21 32x32) y public/og/default.png 1200x630 con marca Alexendros.dev tipografia mono, hecho con sharp o placeholder SVG
4. Crea tests/e2e/a11y.spec.ts (ya existe) asegurate pasa 0 violaciones axe-core en 6 rutas: /, /servicios, /servicios/produccion-sitios-web, /proyectos, /proyectos/front-valencia, /contacto. Crea tests/e2e/contact.spec.ts validacion Zod y envio ok
5. Crea lighthouserc.json para Lighthouse CI >=90 movil en 6 rutas y .github/workflows/ci.yml con jobs typecheck build a11y lhci
6. Optimiza: usa Astro <Image> para proyectos con sharp, content-visibility: auto below-fold en src/styles/global.css, Inter Variable + JetBrains Mono Variable self-hosted (ya en layout, verifica)
7. Anade testimonios placeholder con estructura foto/nombre/empresa en Home y Servicios (cerca de pricing reduce ansiedad compra)
8. Verifica DONE: pnpm build verde, pnpm preview OK http://localhost:4321, Lighthouse >=90, axe 0, LCP <1.65s, form envia a Proton, OG existe

No toques pricing sin confirmar, no anadas CMS ni Google Fonts, no cambies alcance servicios. Prioriza conversion: form 3 campos 3.2% vs 9+ 0.8% (78% abandono), 1s vs5s 3x conversion, 0.1s mejora +8.4% conversion, 85% hiring managers revisan portfolio, 88% clientes investigan online, 70% recruiters prefiere profundidad.

Entrega resumen con metricas y proximos pasos para Vercel deploy.
