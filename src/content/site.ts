export const site = {
  name: 'Alexendros',
  url: 'https://alexendros.dev',
  titleDefault: 'Alexendros — Full Stack: webs que convierten, auditorías y consultoría',
  descriptionDefault:
    'Producción de sitios web (Next.js, Astro) que convierten, auditorías técnicas (Lighthouse ≥90, WCAG AA, SEO) y consultoría. Stripe/PayPal, CI verde, 0 violaciones axe-core.',
  locale: 'es',
  ogLocale: 'es_ES',
  nav: [
    { label: 'Servicios', href: '/servicios' },
    { label: 'Proyectos', href: '/proyectos' },
    { label: 'Sobre mí', href: '/sobre-mi' },
    { label: 'Contacto', href: '/contacto' }
  ],
  footerNav: [
    { label: 'Aviso legal', href: '/aviso-legal' },
    { label: 'Privacidad', href: '/privacidad' }
  ],
  social: {
    github: 'https://github.com/alexendros',
    linkedin: 'https://linkedin.com/in/alexendros',
    email: 'mailto:hola@alexendros.dev',
    cal: 'https://cal.com/alexendros'
  }
} as const;
