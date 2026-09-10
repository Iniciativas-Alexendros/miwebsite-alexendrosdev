import { z } from 'zod';

export const testimonialSchema = z.object({
  name: z.string().min(2),
  company: z.string().min(2),
  quote: z.string().min(20).max(400),
  photo: z.string().min(1),
  role: z.string().optional()
});

export type Testimonial = z.infer<typeof testimonialSchema>;

/** Solo testimonios reales, firmados y con permiso expreso del cliente. */
export const testimonials: Testimonial[] = [];

testimonials.forEach((t, i) => {
  const r = testimonialSchema.safeParse(t);
  if (!r.success) throw new Error(`Testimonial ${i} inválido: ${r.error.message}`);
});
