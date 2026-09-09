import { z } from 'zod';

export const testimonialSchema = z.object({
  name: z.string().min(2),
  company: z.string().min(2),
  quote: z.string().min(20).max(400),
  photo: z.string().min(1),
  role: z.string().optional()
});

export type Testimonial = z.infer<typeof testimonialSchema>;

export const testimonials: Testimonial[] = [
  {
    name: 'María López',
    company: 'Front Valencia',
    role: 'Fundadora',
    quote:
      'Pasamos de un WordPress lento a una web que convierte. Las reservas subieron y el LCP dejó de ser un problema.',
    photo: '/testimonials/placeholder-1.svg'
  },
  {
    name: 'Carlos Ruiz',
    company: 'Gráficas Nasve',
    role: 'Director operaciones',
    quote:
      'El presupuesto en minutos cambió el negocio. Pedidos claros, Stripe fiable y cero fricción con el equipo.',
    photo: '/testimonials/placeholder-2.svg'
  },
  {
    name: 'Ana Vega',
    company: 'Studio Norte',
    role: 'CTO',
    quote:
      'La auditoría priorizó lo que importaba. Informe accionable, axe en verde y un plan que el equipo pudo ejecutar.',
    photo: '/testimonials/placeholder-3.svg'
  }
];

testimonials.forEach((t, i) => {
  const r = testimonialSchema.safeParse(t);
  if (!r.success) throw new Error(`Testimonial ${i} inválido: ${r.error.message}`);
});
