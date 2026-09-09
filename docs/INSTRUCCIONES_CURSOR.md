# INSTRUCCIONES CURSOR — Como arrancar en Cursor

1. Cursor -> Open Folder -> selecciona cursor-bundle-final
2. Terminal: pnpm install (Node 20)
3. cp .env.example .env -> rellena SMTP_HOST SMTP_USER SMTP_PASS UPSTASH_REDIS_REST_URL UPSTASH_REDIS_REST_TOKEN
4. pnpm dev -> http://localhost:4321
5. pnpm build && pnpm preview -> prod local
6. Cursor Chat -> Agent mode -> pega prompt de docs/PROMPT_INICIO_CURSOR.md
7. Push a main -> GitHub Actions: typecheck build playwright axe-core 6 rutas lighthouse-ci >=90 movil
8. Vercel: preview por PR, PROMOTE a prod al merge main, dominio apex https://alexendros.dev
9. DONE: build verde, 0 TS errors, Lighthouse >=90 movil 4 cats, axe-core 0 violaciones 6 rutas, LCP <1.65s, form envia a Proton SMTP, OG 1200x630 existe

Reglas no negociables:

- No Google Fonts, no CMS externo, no cambiar pricing sin confirmar
- Solo ContactForm.tsx es cliente, resto Server Components Astro
- Colores OKLCH, focus-visible rings, teclado+screen reader
- Form 3 campos 3.2% vs 9+ 0.8%, 1s vs5s 3x conversion, 0.1s +8.4%
- Contenido tipado src/content/*.ts Zod validacion build
