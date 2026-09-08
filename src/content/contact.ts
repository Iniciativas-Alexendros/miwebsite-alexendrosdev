export const contact = {
  channels: [
    { id: "form", label: "Formulario", href: "/contacto", priority: 1 },
    { id: "cal", label: "Agendar llamada", href: "https://cal.com/alexendros", priority: 2, external: true },
    { id: "email", label: "hola@alexendros.dev", href: "mailto:hola@alexendros.dev", priority: 3, external: true },
  ],
  subjects: [
    "Proyecto de software · Programación de aplicaciones",
    "Portal · Blog · Portafolio",
    "Formación en Nuevas Tecnologías · Herramientas IA para la empresa",
    "Auditoría de seguridad y posicionamiento",
    "Sistemas profesionales · Flujos automatizables",
    "Asesoramiento tecnológico · Consultor especializado"
  ],
  messages: {
    success: "Mensaje enviado. Respuesta en <24h laborables. Si prefieres, agenda directa en Cal.com",
    error: "No se pudo enviar. Escríbeme directo a hola@alexendros.dev"
  }
};