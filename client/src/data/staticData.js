import { Route } from "react-router-dom";

// ─── APLICATIVOS ─────────────────────────────────────────────
export const APPS = [
  {
    id: 1,
    name: "Prerrequisitos",
    icon: "fa-solid fa-list-check",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
    url: "http://10.0.0.3:8080/cide/Auth",
    support: "Abraham Moreno",
    sLink: "sip:abraham.moreno@fabpsa.com.mx",
    alt: null,
  },
  {
    id: 2,
    name: "Plataforma de Gestión",
    icon: "fa-solid fa-clipboard-list",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
    url: "http://192.168.16.198:3550/PGI_Corporativo/app_Login/",
    support: "Juan Ramírez",
    sLink: "sip:manuel.ramirez@fabpsa.com.mx",
    alt: "http://201.151.218.138:3550/PGI_Corporativo/app_Login/",
  },
  {
    id: 3,
    name: "CIDE",
    icon: "fa-solid fa-chart-simple",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
    url: "http://10.0.0.3:8080/cidetech/Login",
    support: "Abraham Moreno",
    sLink: "sip:abraham.moreno@fabpsa.com.mx",
    alt: null,
  },
  {
    id: 4,
    name: "Pedidos",
    icon: "fa-solid fa-cart-shopping",
    color: "#34d399",
    bg: "rgba(52,211,153,0.12)",
    url: "http://192.168.16.198:3550/sucursales.php",
    support: "Alberto Manzo",
    sLink: "sip:alberto.manzo@fabpsa.com.mx",
    alt: "http://201.151.218.138:3550/sucursales.php",
  },
  {
    id: 5,
    name: "BSC",
    icon: "fa-solid fa-chart-pie",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.12)",
    url: "http://10.0.0.3:8080/Bsc/",
    support: "Abraham Moreno",
    sLink: "sip:abraham.moreno@fabpsa.com.mx",
    alt: null,
  },
  {
    id: 6,
    name: "Food Fraud",
    icon: "fa-solid fa-wheat-awn-circle-exclamation",
    color: "#f87171",
    bg: "rgba(248,113,113,0.12)",
    url: "http://10.0.0.3:81/",
    support: "Alberto Manzo",
    sLink: "sip:alberto.manzo@fabpsa.com.mx",
    alt: null,
  },
  {
    id: 7,
    name: "Food Defense",
    icon: "fa-solid fa-shield-halved",
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.12)",
    url: "http://201.151.218.138/fooddefense",
    support: "Alberto Manzo",
    sLink: "sip:alberto.manzo@fabpsa.com.mx",
    alt: null,
  },
  {
    id: 8,
    name: "SGRHEP",
    icon: "fa-solid fa-users-gear",
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.12)",
    url: "http://192.168.16.198:3550/fabp/Auth",
    support: "Abraham Moreno",
    sLink: "sip:abraham.moreno@fabpsa.com.mx",
    alt: "http://201.151.218.138:3550/fabp/Auth",
  },
  {
    id: 9,
    name: "Control de Calidad",
    icon: "fa-solid fa-clipboard-check",
    color: "#2dd4bf",
    bg: "rgba(45,212,191,0.12)",
    url: "http://10.0.0.3:8080/calidad/Auth",
    support: "Abraham Moreno",
    sLink: "sip:abraham.moreno@fabpsa.com.mx",
    alt: null,
  },
  {
    id: 10,
    name: "FABPSYS",
    icon: "fa-solid fa-users",
    color: "#cbd5e1",
    bg: "rgba(203,213,225,0.12)",
    url: "http://192.168.16.198:3550/fabpsys/app_Login/",
    support: "Alberto Manzo",
    sLink: "sip:alberto.manzo@fabpsa.com.mx",
    alt: "http://201.151.218.138:3550/fabpsys/app_Login/",
  },
  {
    id: 11,
    name: "IISI",
    icon: "fa-solid fa-code-branch",
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.12)",
    url: "https://faaplicaciones.azurewebsites.net/Default.aspx",
    support: "Abraham Moreno",
    sLink: "sip:abraham.moreno@fabpsa.com.mx",
    alt: null,
  },
  {
    id: 12,
    name: "Solicitudes de Crédito",
    icon: "fa-solid fa-file-invoice-dollar",
    color: "#34d399",
    bg: "rgba(52,211,153,0.12)",
    url: "http://10.0.0.3:8080/creditodev",
    support: "Abraham Moreno",
    sLink: "sip:abraham.moreno@fabpsa.com.mx",
    alt: null,
  },
  {
    id: 13,
    name: "SISAP",
    icon: "fa-solid fa-flask-vial",
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.12)",
    url: "http://192.168.16.198:3550/sisap",
    support: "Damian Rodríguez",
    sLink: "sip:damian.rodriguez@fabpsa.com.mx",
    alt: "http://201.151.218.138:3550/sisap/app_Login/",
  },
];

// Acceso rápido — abre directo al aplicativo
export const QUICK_APPS = [
  {
    name: "PGI",
    desc: "Gestión Integral",
    icon: "ti-chart-bar",
    color: "#c4a058",
    bg: "rgba(196,160,88,0.12)",
    url: "http://192.168.16.198:3550/PGI_Corporativo/app_Login/",
  },
  {
    name: "SISAP",
    desc: "Control de Acceso",
    icon: "ti-clipboard-list",
    color: "#c4a058",
    bg: "rgba(196,160,88,0.12)",
    url: "http://192.168.16.198:3550/sisap",
  },
  {
    name: "FABPSYS",
    desc: "Sistema Principal",
    icon: "ti-server",
    color: "#c4a058",
    bg: "rgba(196,160,88,0.12)",
    url: "http://192.168.16.198:3550/fabpsys/app_Login/",
  },
  {
    name: "CIDE",
    desc: "Certificaciones",
    icon: "ti-certificate",
    color: "#c4a058",
    bg: "rgba(196,160,88,0.12)",
    url: "http://10.0.0.3:8080/cidetech/Login",
  },
  {
    name: "Control de Calidad",
    desc: "Laboratorio",
    icon: "ti-microscope",
    color: "#c4a058",
    bg: "rgba(196,160,88,0.12)",
    url: "http://10.0.0.3:8080/calidad/Auth",
  },
  {
    name: "Solicitudes de Crédito",
    desc: "Financiero",
    icon: "ti-credit-card",
    color: "#c4a058",
    bg: "rgba(196,160,88,0.12)",
    url: "http://10.0.0.3:8080/creditodev",
  },
];

// ─── BOLETÍN — Números impactantes ────────────────────────────
export const BOLETIN_STATS = [
  {
    value: "1 de cada 3",
    label:
      "alimentos producidos en el mundo se desperdician antes de llegar al consumidor. Reducir mermas es uno de los mayores retos de la industria alimentaria.",
    icon: "ti-chart-bar",
    color: "#c4a058",
  },
  {
    value: "95%",
    label:
      "de los ataques cibernéticos exitosos comienzan con un correo electrónico, enlace o archivo engañoso. La concientización sigue siendo la mejor defensa.",
    icon: "ti-shield-lock",
    color: "#f87171",
  },
  {
    value: "50%",
    label:
      "de las actividades administrativas podrían automatizarse parcial o totalmente mediante herramientas de inteligencia artificial durante esta década.",
    icon: "ti-robot",
    color: "#a78bfa",
  },
  {
    value: "99.7%",
    label:
      "de precisión puede alcanzar la visión artificial para detectar defectos en productos y procesos de manufactura.",
    icon: "ti-eye",
    color: "#34d399",
  },
  {
    value: "24/7",
    label:
      "operan muchas líneas de producción modernas. Un paro inesperado puede representar pérdidas significativas en productividad y servicio.",
    icon: "ti-factory",
    color: "#60a5fa",
  },
  {
    value: "7 segundos",
    label:
      "son suficientes para que una persona forme una primera impresión sobre una marca, producto o experiencia de servicio.",
    icon: "ti-bulb",
    color: "#f59e0b",
  },
  {
    value: "80%",
    label:
      "de los fabricantes planean incrementar inversiones en automatización, analítica de datos e Industria 4.0 durante los próximos años.",
    icon: "ti-settings-automation",
    color: "#22c55e",
  },
  {
    value: "2030",
    label:
      "es el horizonte estratégico de muchas organizaciones para alcanzar metas de sostenibilidad, eficiencia energética y reducción de emisiones.",
    icon: "ti-world",
    color: "#06b6d4",
  },
];

// ─── EFEMÉRIDES  ────────────────────────────────────────
export const EFEMERIDES = [
  {
    day: "01",
    title: "Inteligencia Artificial",
    tag: "Tecnología",
    desc: "Un empleado promedio pierde hasta 2 horas al día buscando información. La IA permite recuperar documentos, respuestas y datos en segundos.",
  },
  {
    day: "03",
    title: "Ciberseguridad",
    tag: "TI",
    desc: "Más del 90% de los ataques exitosos comienzan con un correo electrónico aparentemente legítimo.",
  },
  {
    day: "06",
    title: "Productividad",
    tag: "Negocios",
    desc: "Una reunión de 1 hora con 10 personas consume el equivalente a más de una jornada completa de trabajo.",
  },
  {
    day: "09",
    title: "Industria Alimentaria",
    tag: "Alimentos",
    desc: "Aproximadamente un tercio de los alimentos producidos en el mundo nunca llega al consumidor final.",
  },
  {
    day: "12",
    title: "Calidad",
    tag: "Manufactura",
    desc: "Detectar un defecto durante la producción puede costar hasta 100 veces menos que descubrirlo después de la entrega al cliente.",
  },
  {
    day: "15",
    title: "Automatización",
    tag: "Industria 4.0",
    desc: "Las plantas que integran automatización avanzada pueden incrementar su productividad entre un 20% y un 30%.",
  },
  {
    day: "18",
    title: "Innovación",
    tag: "Empresas",
    desc: "Las organizaciones que innovan constantemente tienen más probabilidades de mantener ventajas competitivas a largo plazo.",
  },
  {
    day: "21",
    title: "Datos",
    tag: "Analítica",
    desc: "Cada minuto se generan millones de registros digitales. La diferencia está en convertir esos datos en decisiones.",
  },
];

/***************** pagina mesa de servcio ******************************/
export const INCIDENTES_CHIPS = [
  {
    icon: "ti-key",
    label: "Equipo de cómputo",
    descripcion: "Computadora, teclado, monitor y mouse. ",
  },
  {
    icon: "ti-mail",
    label: "Correo electrónico y Microsoft 365",
    descripcion: "Outlook, Teams, One drive y Sharepoint.",
  },
  {
    icon: "ti-apps",
    label: "Sistemas y Aplicaciones",
    descripcion: "Sistemas contables y Sistemas de negocio.",
  },
  {
    icon: "ti-wifi-off",
    label: "Internet y red",
    descripcion: "Internet. Wifi, VPN, Red corporativa y accesos remotos. ",
  },
  {
    icon: "ti-brand-teams",
    label: "Impresoras y Escáneres",
    descripcion: "Impresoras multifuncionales y etiquetadoras. ",
  },
  {
    icon: "ti-lock-open",
    label: "Telefonia y comunicaciones",
    descripcion: "Extensiones, telefonos y VPN.",
  },
  {
    icon: "ti-alert-circle",
    label: "Infrasestructura y servidores",
    descripcion: "Servidores, almacenamientos, respaldos y active directory. ",
  },
  {
    icon: "ti-mail-off",
    label: "Seguridad Informática",
    descripcion:
      "Antivirus, bloqueo de páginas, correos y mensajes sospechosos, firewall y phising.",
  },
  {
    icon: "ti-brand-teams",
    label: "Oficce 365",
    descripcion: "Excel, Word y Power Point",
  },
  {
    icon: "ti-lock-open",
    label: "CCTV y control de acceso",
    descripcion: "Grabaciones, cámaras y reconocimiento facial. ",
  },
  {
    icon: "ti-alert-circle",
    label: "ERP Multivisión",
    descripcion:
      "Reportes erroneos, modulos con mensajes de error y sistema lento.",
  },
];

export const SERVICIO_CHIPS = [
  {
    icon: "ti-device-laptop",
    label: "Accesos y cuentas de usuario",
    descripcion: "Alta, bajas y modificaciones de usuario.",
  },
  {
    icon: "ti-device-tv",
    label: "Instalación y aplicaciones",
    descripcion: "Instalacion y permisos. ",
  },
  {
    icon: "ti-headphones",
    label: "Harware y perifericos",
    descripcion: "Solicitud de nuevos equipos. ",
    route: "/mesa-de-servicio/hardware",
  },
  {
    icon: "ti-refresh",
    label: "Servicios generales TI",
    descripcion: "Atención y asesoria. ",
  },
  {
    icon: "ti-plug",
    label: "Seguridad informatica",
    descripcion: "Acceso a sitios",
  },
];

export const SOFTWARE_CHIPS = [
  { icon: "ti-sparkles", label: "Nuevos desarrollos a medida" },
  { icon: "ti-tools", label: "Mejoras a sistemas existentes" },
  { icon: "ti-robot", label: "Automatización de procesos" },
  { icon: "ti-report-analytics", label: "Nuevos reportes e indicadores" },
  { icon: "ti-layout-dashboard", label: "Nuevos módulos o pantallas" },
  { icon: "ti-git-merge", label: "Integraciones entre sistemas" },
];

export const HERO_TAGS = [
  { icon: "ti-send", label: "Solicitudes" },
  { icon: "ti-device-laptop", label: "Hardware" },
  { icon: "ti-code", label: "Desarrollo" },
  { icon: "ti-headset", label: "Soporte" },
];

/****************************   pagina de hardware *****************************************************************/

/*export const MOTIVOS = [
  "Necesito un equipo nuevo",
  "Mi equipo ya no funciona correctamente",
  "Mi equipo es insuficiente para mis actividades",
  "Solo necesito el equipo por un tiempo",
];

export const ICON_MAP = {
  mouse: "ti-mouse",
  teclado: "ti-keyboard",
  webcam: "ti-camera",
  laptop: "ti-device-laptop",
  monitor: "ti-device-tv",
  impresora: "ti-printer",
  audífonos: "ti-headphones",
  headset: "ti-headphones",
  disco: "ti-database",
  usb: "ti-usb",
  cable: "ti-plug",
  default: "ti-device-desktop",
};*/
