export const profile = {
  name: 'Alexendros',
  role: 'Desarrollador Full Stack · Auditor técnico · Consultor',
  title:
    'Desarrollador web y consultor tecnológico. Next.js, Astro, Rust, TS. Accesibilidad y rendimiento por defecto.',
  summary:
    'Produzco webs que convierten, no que solo se ven bonitas. 3 servicios claros con alcance y exclusiones explícitas. Código mantenible, CI verificado, Lighthouse ≥90 móvil, 0 violaciones axe-core.',
  proofs: [
    { label: 'LCP mejora', value: '-65%' },
    { label: 'Conversión form', value: '3.2%' },
    { label: 'axe-core', value: '0 viol.' }
  ],
  trustBar: [
    '85% hiring managers revisan portfolio',
    '88% clientes investigan online',
    '1s → 3× conversión vs 5s',
    '3 campos 3.2% vs 9 campos 0.8%'
  ],
  stackPills: [
    'Next.js',
    'Astro',
    'TypeScript',
    'Tailwind',
    'Stripe',
    'Payload',
    'Prisma',
    'Zod',
    'Vitest',
    'Playwright'
  ],
  method: [
    { step: 1, title: 'Definición alcance', desc: 'Contexto, objetivos de negocio y métricas de conversión.' },
    { step: 2, title: 'Arquitectura primero', desc: 'ADRs, stack, integraciones Stripe/PayPal, modelo de datos.' },
    { step: 3, title: 'TS estricto + a11y', desc: 'Zod, componentes accesibles, tests.' },
    { step: 4, title: 'Validación CI', desc: 'typecheck, lint, tests, axe-core 6 rutas, Lighthouse CI.' },
    { step: 5, title: 'Deploy Vercel', desc: 'Preview → producción con PROMOTE. <1.65s LCP.' },
    { step: 6, title: 'Transferencia', desc: 'Docs, formación 30min, 30 días soporte.' }
  ],
  location: 'Valencia, España — trabajo remoto',
  languages: ['Español nativo', 'Inglés técnico fluido']
} as const;
