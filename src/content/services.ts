import { z } from 'zod';

export const serviceSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  short: z.string().min(1),
  description: z.string().min(1),
  audience: z.string().min(1),
  problems: z.array(z.string()).min(1),
  scope: z.array(z.string()).min(1),
  deliverables: z.array(z.string()).min(1),
  process: z.array(z.string()).min(1),
  technologies: z.array(z.string()).min(1),
  exclusions: z.array(z.string()).min(1),
  pricingFrom: z.string().min(1),
  timeline: z.string().min(1),
  cta: z.string().min(1),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).min(1)
});

export type Service = z.infer<typeof serviceSchema>;

export const services: Service[] = [
  {
    slug: 'produccion-sitios-web',
    title: 'Producción de sitios web',
    short:
      'Diseño, desarrollo y publicación de webs y productos digitales que convierten: accesibles, rápidas (<1.65s) y mantenibles.',
    description:
      'Ciclo completo análisis → deploy. Next.js/Astro, TS estricto, Tailwind OKLCH, CI gates. Con pasarelas de pago y formularios que no se rompen.',
    audience:
      'Empresas, fundadores, equipos marketing/producto que necesitan pasar de WP lento a web que vende.',
    problems: [
      'WP lento/inaccesible LCP >4s',
      'Landings genéricas que no convierten',
      'Formularios rotos 78% abandono',
      'SEO pobre',
      'Alto coste mantenimiento'
    ],
    scope: [
      'Análisis negocio y conversión',
      'IA arquitectura',
      'UX que convierte',
      'Dev Next.js/Astro + Stripe/PayPal',
      'Responsive, a11y WCAG AA, SEO técnico',
      'Formularios Zod 3 campos',
      'Tests Vitest + Playwright',
      'Deploy Vercel',
      'Docs y formación',
      '30 días soporte'
    ],
    deliverables: [
      'App funcional + CI verde',
      'Repo Git privado',
      'Informe Lighthouse + axe-core 0 violaciones',
      'Guía contenidos y pagos'
    ],
    process: [
      'Kickoff 45min',
      'Arquitectura y precios',
      'Implementación con PR reviews',
      'Lanzamiento',
      'Entrega + soporte'
    ],
    technologies: [
      'next-js',
      'astro',
      'typescript',
      'tailwind',
      'stripe',
      'zod',
      'vitest',
      'playwright'
    ],
    exclusions: ['Sin CMS gestionado', 'Sin migración WP compleja', 'Sin diseño de marca'],
    pricingFrom: 'Desde 1.500€',
    timeline: '1-4 semanas',
    cta: '/contacto',
    metrics: [
      { label: 'Mejora LCP', value: '-65%' },
      { label: 'Conversión form', value: '3.2%' }
    ]
  },
  {
    slug: 'auditorias',
    title: 'Auditorías técnicas',
    short:
      'Diagnóstico rendimiento, accesibilidad, SEO y seguridad con plan priorizado. Lighthouse CI + axe-core + manual.',
    description:
      'Herramientas automatizadas + revisión experta. Informe navegable con priorización ICE y plan remediación.',
    audience: 'CTOs, tech leads, agencias que necesitan saber estado real antes de invertir.',
    problems: [
      'Estado real desconocido',
      'Backlog inflado',
      'Auditorías genéricas',
      'Riesgo legal WCAG'
    ],
    scope: [
      'Perf LCP/CLS/INP',
      'a11y axe-core + teclado/NVDA',
      'SEO técnico',
      'Calidad/mantenibilidad',
      'Seguridad proporcional',
      'Priorización',
      'Plan remediación',
      'Sesión lectura 1h'
    ],
    deliverables: [
      'Informe navegable',
      'Hoja priorización ICE',
      'Scripts reproducción',
      'Sesión 1h'
    ],
    process: [
      'Alcance',
      'Ejecución auto',
      'Revisión manual',
      'Análisis',
      'Entrega',
      'Seguimiento opcional'
    ],
    technologies: ['lighthouse-ci', 'axe-core', 'pa11y', 'typescript'],
    exclusions: ['Sin implementación', 'Sin pentest', 'Sin certificación oficial WCAG'],
    pricingFrom: 'Desde 650€',
    timeline: '3-5 días',
    cta: '/contacto',
    metrics: [
      { label: 'Lighthouse', value: '≥90 móvil' },
      { label: 'a11y', value: '0 violaciones' }
    ]
  },
  {
    slug: 'consultoria-tecnologica',
    title: 'Consultoría tecnológica',
    short:
      'Diagnóstico, arquitectura y plan antes de construir. Automatización, IA aplicada sin hype, integraciones.',
    description:
      'Evaluar alternativas, definir prioridades, entregar arquitectura objetivo con ADRs y plan faseado.',
    audience: 'PYMEs sin equipo técnico, equipos eng/product',
    problems: [
      'Stack por hype',
      'Procesos manuales',
      'IA sin control',
      'Deuda técnica no cuantificada'
    ],
    scope: [
      'Diagnóstico',
      'Arquitectura objetivo',
      'Evaluación alternativas',
      'Prioridades',
      'Plan faseado',
      'ADRs/diagramas/runbooks'
    ],
    deliverables: [
      'Doc diagnóstico',
      'Arquitectura + ADRs',
      'Plan implementación',
      'Sesión transferencia'
    ],
    process: ['Discovery', 'Diagnóstico', 'Evaluación', 'Diseño/plan', 'Entrega'],
    technologies: ['typescript', 'node-js', 'rust', 'mcp', 'ollama', 'zod'],
    exclusions: ['Sin implementación', 'Sin infra', 'Sin fine-tuning modelos'],
    pricingFrom: 'Desde 900€',
    timeline: '1-2 semanas',
    cta: '/contacto',
    metrics: [
      { label: 'Decisiones', value: 'Con ADRs' },
      { label: 'Stack', value: 'Sin hype' }
    ]
  }
];

const slugs = new Set<string>();
services.forEach((s, i) => {
  const r = serviceSchema.safeParse(s);
  if (!r.success) throw new Error(`Service ${i} inválido: ${r.error.message}`);
  if (slugs.has(s.slug)) throw new Error(`Service slug duplicado: ${s.slug}`);
  slugs.add(s.slug);
});
