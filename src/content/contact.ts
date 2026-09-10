export const contact = {
  channels: [
    { id: 'form', label: 'Enviar mensaje', href: '/contacto', priority: 1 },
    {
      id: 'cal',
      label: 'Agendar llamada',
      href: 'https://cal.com/alexendros',
      priority: 2,
      external: true
    },
    {
      id: 'email',
      label: 'hola@alexendros.dev',
      href: 'mailto:hola@alexendros.dev',
      priority: 3,
      external: true
    }
  ],
  subjects: [
    'Web nueva o renovación',
    'Revisión y plan de mejora',
    'Plan digital y automatización',
    'Consulta general',
    'Otro'
  ],
  messages: {
    success:
      'Mensaje enviado. Te responderé en menos de 24 horas laborables. Si prefieres, también puedes agendar una llamada.',
    error: 'No se pudo enviar. Escríbeme directamente a hola@alexendros.dev'
  }
};
