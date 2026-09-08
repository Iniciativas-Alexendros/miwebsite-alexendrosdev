import type { ImageMetadata } from 'astro';
import { z } from 'zod';
import coverFront from '../assets/projects/front-valencia.svg';
import coverNasve from '../assets/projects/graficas-nasve.svg';
import coverVcf from '../assets/projects/vcf-cribador.svg';
import coverMe from '../assets/projects/alexendros-me.svg';

export const projectSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  short: z.string().min(1),
  summary: z.string().min(1),
  role: z.string().min(1),
  context: z.string().min(1),
  challenge: z.string().min(1),
  solution: z.string().min(1),
  responsibilities: z.array(z.string()).min(1),
  technologies: z.array(z.string()).min(1),
  highlights: z.array(z.string()).min(1),
  results: z.array(z.string()).min(1),
  links: z.object({
    prod: z.string().url().optional(),
    github: z.string().url().optional()
  }),
  published: z.string().min(1),
  featured: z.boolean()
});

export type Project = z.infer<typeof projectSchema> & { cover: ImageMetadata };

export const projects: Project[] = [
  {
    slug: 'front-valencia',
    title: 'Front Valencia — Restaurante',
    short: 'Astro + Payload CMS, i18n, WCAG AA. Menú dinámico y reservas.',
    summary: 'Migración WP lento (LCP >4s) → Astro 4 + Payload CMS. 65% mejora LCP, +40% reservas.',
    role: 'Arquitectura, full-stack, CMS, deploy, a11y/perf',
    context: 'WordPress con LCP >4s, problemas a11y, PHP 7.4, edición menú 30min',
    challenge: 'Zero-downtime, preservar SEO, editor visual cliente no técnico',
    solution: 'Astro View Transitions, Payload tipado, i18n routing, Zod forms, Assets optimization',
    responsibilities: ['Decisión stack', 'Dev completo', 'Payload config', 'Auditoría a11y', 'Lighthouse ≥90', 'Deploy Vercel+VPS', 'Docs'],
    technologies: ['astro', 'payload-cms', 'typescript', 'tailwind', 'react', 'zod'],
    highlights: ['Zero-downtime', 'Editor visual', 'a11y teclado/NVDA', 'Rendimiento medido'],
    results: ['-65% LCP', '0 axe-core violations', '+40% reservas', 'Edición 30min→3min'],
    links: { prod: 'https://example.com', github: 'https://github.com' },
    published: '2024-03-15',
    featured: true,
    cover: coverFront
  },
  {
    slug: 'graficas-nasve',
    title: 'Gráficas Nasve — Ecommerce B2B/B2C',
    short: 'Next.js + motor precios 200+ reglas + Stripe. Venta 48h→5min.',
    summary: 'Digitalización imprenta: pricing tiempo real, validación PDF, Stripe Checkout, panel pedidos. +300% pedidos.',
    role: 'Arquitectura, motor precios, integración pagos, paneles',
    context: 'Ventas solo email/teléfono, presupuestos lentos, pedidos perdidos',
    challenge: '100s combinaciones impresión, validar PDFs, Stripe idempotente',
    solution: 'Next.js 14 App Router, motor precios TS 0 deps, PDF.js + Ghostscript, Stripe Checkout',
    responsibilities: ['Arquitectura', 'Motor precios Vitest ≥90%', 'Catálogo a11y', 'Validación dual', 'Webhooks Stripe', 'Paneles', 'Deploy', 'Tests E2E'],
    technologies: ['next-js', 'typescript', 'postgresql', 'prisma', 'stripe', 'zod'],
    highlights: ['100% TS motor precios', 'Validación dual', 'PCI SAQ-A', 'Sin CMS externo'],
    results: ['48h→5min venta', '+300% pedidos', '0 errores spec', '-70% tiempo gestión'],
    links: { prod: 'https://example.com', github: 'https://github.com' },
    published: '2023-11-20',
    featured: true,
    cover: coverNasve
  },
  {
    slug: 'vcf-cribador',
    title: 'VCF Cribador — CLI Rust',
    short: 'CLI Rust 3MB para limpiar VCF. 500+ descargas/mes, <2s 10k contactos.',
    summary: 'Resuelve exports VCF desordenados Google/iCloud/Outlook. E.164, dedup, VCF/CSV limpios.',
    role: 'Autor único: diseño, dev, CI/CD, docs, publishing',
    context: 'Gestionar contactos multiplataforma frustrante',
    challenge: 'Parsing VCF 3.0/4.0 robusto, E.164 sin lib pesada, binario único',
    solution: 'Rust + vcardparse fork, phonenumber ~500KB, clap 4, proptest, cosign releases',
    responsibilities: ['CLI', 'Parsing tolerante', 'Normalización', 'Dedup', 'Export', 'Tests', 'Binarios estáticos', 'Docs'],
    technologies: ['rust', 'clap', 'phonenumber', 'serde'],
    highlights: ['Binario 3MB', 'Parsing tolerante', 'Dedup configurable', 'FOSS MIT'],
    results: ['500+ dl/mes', '50k+ migración', '0 CVEs', '<2s 10k contactos'],
    links: { github: 'https://github.com' },
    published: '2024-01-10',
    featured: false,
    cover: coverVcf
  },
  {
    slug: 'alexendros-me',
    title: 'Alexendros.me — Ensayos',
    short: 'Next.js lab con 0 JS en contenido, AAA prosa, privacidad real.',
    summary: 'Lab técnico: design system OKLCH, CI gates, sin GA, 98/100/100/100 Lighthouse móvil.',
    role: 'Autor único arquitectura + contenido',
    context: 'Espacio propio ensayos largos y ADRs sin restricciones plataforma',
    challenge: 'Lectura óptima AAA, teclado/screen reader perfecto, JS mínimo, privacidad',
    solution: 'Next.js SSG, tokens OKLCH, shadcn/ui a11y, Zod content, flexsearch aislada',
    responsibilities: ['Arquitectura', 'Design system', 'a11y AA/AAA', 'Perf ≥90', 'Privacidad', 'CI/CD', '15+ ensayos'],
    technologies: ['next-js', 'typescript', 'tailwind', 'mdx', 'zod', 'axe-core'],
    highlights: ['0 JS contenido', 'Contraste AAA', 'Flujo Git editorial', 'Sin trackers'],
    results: ['98/100/100/100', '0 axe-core', '<3min build', '15+ ensayos'],
    links: { prod: 'https://example.com', github: 'https://github.com' },
    published: '2024-01-15',
    featured: true,
    cover: coverMe
  }
];

const projectSlugs = new Set<string>();
projects.forEach((p, i) => {
  const { cover: _c, ...data } = p;
  const r = projectSchema.safeParse(data);
  if (!r.success) throw new Error(`Project ${i} inválido: ${r.error.message}`);
  if (projectSlugs.has(p.slug)) throw new Error(`Project slug duplicado: ${p.slug}`);
  projectSlugs.add(p.slug);
});

export function getFeaturedProjects() {
  return projects.filter((p) => p.featured);
}
