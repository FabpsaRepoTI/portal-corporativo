// ─── APLICATIVOS ─────────────────────────────────────────────

export const CATEGORIAS = [
  {
    id: "hardware",
    icon: "ti-device-laptop",
    label: "Hardware y periféricos",
    descripcion:
      "Solicite la asignación, reemplazo o préstamo de equipos y accesorios tecnológicos.",
    color: "emerald",
    badge: "Popular",
    action: "navigate",
    route: "/mesa-de-servicio/hardware",
  },
  {
    id: "desarrollo",
    icon: "ti-code",
    label: "Desarrollo de sistemas",
    descripcion: "Solicita desarrollo, mejoras o mantenimiento de sistemas.",
    color: "amber",
    badge: "Nuevo",
    action: "navigate",
    route: "/mesa-de-servicio/desarrollo",
  },
  {
    id: "software",
    icon: "ti-apps",
    label: "Software",
    descripcion:
      "Instalación, actualización Y configuración de software autorizado por la empresa.",
    color: "blue",
    action: "incident",
  },
  {
    id: "accesos",
    icon: "ti-lock",
    label: "Accesos y cuentas de usuario",
    descripcion:
      "Altas, bajas y modificaciones de usuario en correo electronico.",
    color: "orange",
    action: "incident",
  },
  {
    id: "incidentes",
    icon: "ti-alert-triangle",
    label: "Incidentes y fallas",
    descripcion:
      "Reporta fallas en equipos, aplicaciones, sistemas o cualquier incidente tecnológico",
    color: "violet",
    action: "accordion",
  },
  {
    id: "consultas",
    icon: "ti-message-circle",
    label: "Servicios generales TI",
    descripcion:
      "Asesoría o servicios relacionados con el uso de las herramientas tecnológicas de la empresa.",
    color: "teal",
    action: "incident",
  },
  {
    id: "seguridad",
    icon: "ti-message-circle",
    label: "Servicios generales TI",
    descripcion:
      "Asesoría o servicios relacionados con el uso de las herramientas tecnológicas de la empresa.",
    color: "teal",
    action: "security",
  },
];

export const INCIDENTES_ICONS = {
  "Equipo de cómputo": "ti-device-desktop",
  "Correo electrónico y Microsoft 365": "ti-mail",
  "Sistemas y Aplicaciones": "ti-apps",
  "Internet y red": "ti-wifi-off",
  "Impresoras y Escáneres": "ti-printer",
  "Telefonia y comunicaciones": "ti-phone",
  "Infrasestructura y servidores": "ti-server",
  "Seguridad Informática": "ti-shield-lock",
  "Oficce 365": "ti-brand-office",
  "CCTV y control de acceso": "ti-camera",
  "ERP Multivisión": "ti-chart-bar",
};

export const INCIDENTES_CHIPS = [
  {
    id: "inc-computo",
    icon: "ti-desktop",
    label: "Equipo de cómputo",
    descripcion: "Computadora, teclado, monitor y mouse.",
  },
  {
    id: "inc-correo",
    icon: "ti-mail",
    label: "Correo electrónico y Microsoft 365",
    descripcion: "Outlook, Teams, OneDrive y SharePoint.",
  },
  {
    id: "inc-sistemas",
    icon: "ti-apps",
    label: "Sistemas y Aplicaciones",
    descripcion: "Sistemas contables y de negocio.",
  },
  {
    id: "inc-red",
    icon: "ti-wifi-off",
    label: "Internet y red",
    descripcion: "Internet, WiFi, VPN, red corporativa.",
  },
  {
    id: "inc-impresoras",
    icon: "ti-printer",
    label: "Impresoras y Escáneres",
    descripcion: "Impresoras multifuncionales y etiquetadoras.",
  },
  {
    id: "inc-telefonia",
    icon: "ti-phone",
    label: "Telefonía y comunicaciones",
    descripcion: "Extensiones, teléfonos y VPN.",
  },
  {
    id: "inc-servidores",
    icon: "ti-server",
    label: "Infraestructura y servidores",
    descripcion: "Servidores, almacenamiento, respaldos y AD.",
  },
  {
    id: "inc-seguridad",
    icon: "ti-shield",
    label: "Seguridad Informática",
    descripcion: "Antivirus, firewall, phishing y correos sospechosos.",
  },
  {
    id: "inc-office365",
    icon: "ti-brand-office",
    label: "Office 365",
    descripcion: "Excel, Word y PowerPoint.",
  },
  {
    id: "inc-cctv",
    icon: "ti-camera",
    label: "CCTV y control de acceso",
    descripcion: "Grabaciones, cámaras y reconocimiento facial.",
  },
  {
    id: "inc-erp",
    icon: "ti-chart-bar",
    label: "ERP Multivisión",
    descripcion: "Reportes erróneos, módulos con error, sistema lento.",
  },
];

/* SOLICITUD PAGE */
export const SERVICIOS_GRID = [
  {
    id: "hardware",
    icon: "ti-device-laptop",
    label: "Hardware y periféricos",
    descripcion: "Solicitud de nuevos equipos, accesorios y periféricos.",
    color: "#10b981",
    colorBg: "rgba(16,185,129,0.12)",
    badge: "Popular",
    action: "navigate",
    route: "/mesa-de-servicio/hardware",
  },
  {
    id: "software",
    icon: "ti-layout-grid-add",
    label: "Software",
    descripcion:
      "Instalación, actualización, configuración o desinstalación de software autorizado por la empresa.",
    color: "#7c3aed",
    colorBg: "rgba(124,58,237,0.12)",
    action: "slug",
  },
  {
    id: "accesos",
    icon: "ti-lock",
    label: "Accesos y cuentas de usuario",
    descripcion:
      "Altas, bajas y modificaciones de usuario en correo electrónico.",
    color: "#f97316",
    colorBg: "rgba(249,115,22,0.12)",
    action: "slug",
  },
  {
    id: "consultas",
    icon: "ti-message-circle",
    label: "Servicios generales TI",
    descripcion:
      "Asesoría o servicios relacionados con el uso de las herramientas tecnológicas de la empresa.",
    color: "#0d9488",
    colorBg: "rgba(13,148,136,0.12)",
    action: "slug",
  },
  {
    id: "desarrollo",
    icon: "ti-code",
    label: "Desarrollo de sistemas",
    descripcion: "Solicita desarrollo, mejoras o mantenimiento de sistemas.",
    color: "#f59e0b",
    colorBg: "rgba(245,158,11,0.12)",
    badge: "Nuevo",
    action: "slug",
  },
  {
    id: "seguridad",
    icon: "ti-shield-lock",
    label: "Seguridad informática",
    descripcion:
      "Desbloqueo o autorización de sitios web, revisión de archivos bloqueados por el antivirus o permisos de navegación.",
    color: "#ef4444",
    colorBg: "rgba(239,68,68,0.12)",
    action: "slug",
  },
];

export const QUICK_SISTEMAS = [
  {
    label: "Ver incidencias",
    desc: "Gestionar tickets abiertos",
    icon: "ti-alert-triangle",
    color: "#7c3aed",
    colorBg: "rgba(124,58,237,0.12)",
    type: "route",
    route: "/mesa-de-servicio/admin",
  },
  {
    label: "Solicitudes de hardware",
    desc: "Panel de solicitudes de equipo",
    icon: "ti-device-laptop",
    color: "#10b981",
    colorBg: "rgba(16,185,129,0.12)",
    type: "route",
    route: "/mesa-de-servicio/hardware/solicitudes",
  },
  {
    label: "Mis solicitudes",
    desc: "Ver el estado de mis solicitudes",
    icon: "ti-clipboard-list",
    color: "#7c8cf8",
    colorBg: "rgba(124,140,248,0.12)",
    type: "fn",
  },
];

export const QUICK_USUARIO = [
  {
    label: "Nueva solicitud",
    desc: "Crear una nueva solicitud",
    icon: "ti-circle-plus",
    color: "#10b981",
    colorBg: "rgba(16,185,129,0.12)",
    type: "incidente",
  },
  {
    label: "Mis solicitudes",
    desc: "Ver el estado de mis solicitudes",
    icon: "ti-clipboard-list",
    color: "#7c8cf8",
    colorBg: "rgba(124,140,248,0.12)",
    type: "link",
    to: "/mesa-de-servicio/mis-solicitudes",
  },
  {
    label: "Base de conocimiento",
    desc: "Explora artículos y guías",
    icon: "ti-book",
    color: "#f59e0b",
    colorBg: "rgba(245,158,11,0.12)",
    type: "fn",
  },
];
