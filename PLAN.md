# PLAN MVP Astro — alexendros.dev ideal para conversión + contratación

Objetivo: MVP listo en 1 sprint (3-4 días) con máxima eficacia según métricas reales.

## Métricas objetivo (no negociables)
- LCP <1.65s (avg primera página Google), CLS <0.1, INP <200ms
- Lighthouse CI ≥90 móvil en 4 categorías en 6 rutas: /, /servicios, /servicios/*, /proyectos, /proyectos/*, /contacto
- axe-core 0 violaciones en esas 6 rutas
- Formulario: 3 campos obligatorios (nombre,email,mensaje) + select asunto = 3.2% conversión vs 0.8% con 9+ campos. Honeypot anti-spam, sin captcha que baja conversión 3.2%→2.4%
- Bounce objetivo <20% (vs 9% a 2s, 38% a 5s). 0.1s mejora = +8.4% conversión.

## Arquitectura para OpenCode
1. **Fase 0 — Setup**
   - pnpm install, astro check
   - Configurar tailwind OKLCH tokens, fuentes self-hosted Inter Variable + JetBrains Mono Variable (evitar Google Fonts → privacidad + perf)
   - Content en src/content/*.ts con Zod validación en build. getPublished* filtra status published && visibility publico

2. **Fase 1 — Páginas críticas (orden conversión)**
   - / → Hero con terminal (prueba social técnica), 3 servicios, 3 proyectos featured con resultados, CTA doble (form + Cal.com)
   - /servicios/[slug] → scope, entregables, exclusiones, proceso, stack, pricing desde, métricas, CTA sticky
   - /proyectos/[slug] → contexto/reto/solución, resultados con %, stack, links prod/github, CTA "¿Similar?"
   - /contacto → ContactForm.tsx (React island) + canales alternativos. Validación Zod 20-2000 chars mensaje, consent RGPD no pre-marcado
   - /sobre-mi → método 6 pasos, por qué distinto (0 JS contenido, sin GA)

3. **Fase 2 — API y legal**
   - /api/contact: rate-limit Upstash Redis, nodemailer Proton SMTP (From/To operaciones@alexendros.dev, Reply-To usuario), log sin PII, 12 meses retención
   - /aviso-legal, /privacidad: contenido tipado legal/aviso-legal.ts y privacidad.ts, fecha última actualización

4. **Fase 3 — CI/CD y SEO**
   - GitHub Actions: typecheck, lint, format, vitest, build, playwright axe-core 6 rutas, lighthouse-ci
   - Deploy Vercel: preview en PR, PROMOTE a prod al merge a main. Dominio apex https://alexendros.dev (ADR-0029)
   - SEO: canonical, OG, JSON-LD Person + BlogPosting, sitemap.xml, robots.txt, <3min build

5. **Fase 4 — Optimización conversión**
   - Añadir testimonios reales con foto/nombre/empresa en Home y Servicios (testimonios cerca de pricing reduce ansiedad)
   - Pricing transparente: desde X€ + timeline + qué no incluye → +trust (estudios: pricing + testimonios = credibilidad)
   - Calendly embed en /contacto como alternativa a form (reduce abandono 78%)
   - content-visibility: auto para categorías stack below-fold, sharp para imágenes

## Estructura carpetas final
src/content/site.ts, profile.ts, services.ts, projects.ts, contact.ts
src/components/Hero, ServiceCard, ProjectCard, ContactForm, Header, Footer
src/layouts/Layout.astro con JSON-LD
src/pages/index, servicios/[slug], proyectos/[slug], sobre-mi, contacto, aviso-legal, privacidad, api/contact.ts

## Criterios DONE
- Build verde, 0 TS errors, 0 axe violations, Lighthouse ≥90 móvil, <1.65s LCP en Vercel analytics
- Formulario envía a Proton SMTP y muestra mensaje éxito + link Cal.com
- 4 proyectos y 3 servicios visibles con métricas reales del extraction file
- Sin cookies no esenciales, sin GA, sin fonts terceros

## Siguiente paso OpenCode
`opencode run` → implementar API contact real, añadir imágenes optimizadas Astro Assets para cada proyecto, y tests e2e contacto.