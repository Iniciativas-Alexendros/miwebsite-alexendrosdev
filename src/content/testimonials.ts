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
      'Pasamos de una web lenta a una que explica bien lo que hacemos. Las reservas subieron y el equipo puede actualizar el menú sin complicaciones.',
    photo: '/testimonials/placeholder-1.svg'
  },
  {
    name: 'Carlos Ruiz',
    company: 'Gráficas Nasve',
    role: 'Director operaciones',
    quote:
      'El presupuesto en minutos cambió el negocio. Pedidos claros, pagos fiables y cero fricción con el equipo.',
    photo: '/testimonials/placeholder-2.svg'
  },
  {
    name: 'Ana Vega',
    company: 'Studio Norte',
    role: 'Responsable de producto',
    quote:
      'La revisión priorizó lo que importaba. Informe claro y un plan que el equipo pudo ejecutar sin rodeos.',
    photo: '/testimonials/placeholder-3.svg'
  }
];

testimonials.forEach((t, i) => {
  const r = testimonialSchema.safeParse(t);
  if (!r.success) throw new Error(`Testimonial ${i} inválido: ${r.error.message}`);
});
