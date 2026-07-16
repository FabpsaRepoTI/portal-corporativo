import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { INCIDENTES_CHIPS } from "../../data/staticData.js";
import "./hardware/MesaDeServicioPage.css";

const CATEGORIAS = [
  {
    id: "hardware",
    icon: "ti-device-laptop",
    label: "Hardware y periféricos",
    descripcion: "Solicita equipos, accesorios o componentes físicos.",
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
      "Instalación, actualización, configuración o desinstalación de software autorizado por la empresa.",
    color: "blue",
    action: "incident",
  },
  {
    id: "accesos",
    icon: "ti-lock",
    label: "Accesos y cuentas de usuario",
    descripcion:
      "Altas, bajas y modificaciones de usuario en correo electrónico.",
    color: "orange",
    action: "incident",
  },
  {
    id: "incidentes",
    icon: "ti-alert-triangle",
    label: "Incidentes y fallas",
    descripcion: "Reporta problemas técnicos o fallas en servicios.",
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
];

const INCIDENTES_ICONS = {
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

export default function MesaDeServicioPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [incidentesOpen, setIncidentesOpen] = useState(false);

  const firstName = user?.name?.split(" ")[0] ?? "Usuario";

  const handleCategoryClick = (cat) => {
    if (cat.action === "navigate") {
      navigate(cat.route);
    } else if (cat.action === "incident") {
      navigate("/mesa-de-servicio/reporte-incidente");
    } else if (cat.action === "accordion") {
      setIncidentesOpen((v) => !v);
    }
  };

  return (
    <div className="mds2-root">
      {/* ══ FILA SUPERIOR: SALUDO + HERO + ACCESOS RÁPIDOS ═══════════════════ */}
      <div className="mds2-greeting-row">
        {/* Columna izquierda fila 1: saludo */}
        <div className="mds2-greeting">
          <button className="apps-back btn-back" onClick={() => navigate("/")}>
            <i className="ti ti-arrow-left" /> Volver al inicio
          </button>
          <h1 className="mds2-greeting-title">
            Hola, {firstName} <span className="mds2-wave">👋</span>
          </h1>
          <p className="mds2-greeting-sub">¿En qué podemos ayudarte hoy?</p>
        </div>

        {/* Columna izquierda fila 2: hero card */}
        <div className="mds2-hero-card">
          <div className="mds2-hero-deco" aria-hidden="true">
            <svg
              viewBox="0 0 320 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mds2-hero-svg"
            >
              <circle
                cx="260"
                cy="80"
                r="110"
                fill="url(#hg1)"
                opacity="0.22"
              />
              <circle
                cx="260"
                cy="80"
                r="130"
                stroke="url(#hg2)"
                strokeWidth="1"
                fill="none"
                opacity="0.18"
              />
              <rect
                x="180"
                y="20"
                width="48"
                height="48"
                rx="12"
                fill="url(#hg3)"
                opacity="0.28"
                transform="rotate(18 204 44)"
              />
              <rect
                x="230"
                y="95"
                width="32"
                height="32"
                rx="8"
                fill="url(#hg4)"
                opacity="0.22"
                transform="rotate(-12 246 111)"
              />
              <circle cx="180" cy="128" r="20" fill="#10b981" opacity="0.14" />
              <circle cx="290" cy="28" r="12" fill="#7c8cf8" opacity="0.20" />
              <line
                x1="140"
                y1="0"
                x2="140"
                y2="160"
                stroke="#10b981"
                strokeWidth="0.5"
                opacity="0.10"
              />
              <line
                x1="0"
                y1="80"
                x2="320"
                y2="80"
                stroke="#10b981"
                strokeWidth="0.5"
                opacity="0.08"
              />
              <g transform="translate(232, 48)" opacity="0.55">
                <path
                  d="M28 14C28 6.268 21.732 0 14 0C6.268 0 0 6.268 0 14v4h4v-4C4 8.477 8.477 4 14 4s10 4.477 10 10v16c0 2.2-1.8 4-4 4h-4v4h4c4.418 0 8-3.582 8-8V14z"
                  fill="#10b981"
                />
                <rect
                  x="-2"
                  y="14"
                  width="8"
                  height="12"
                  rx="4"
                  fill="#10b981"
                />
                <rect
                  x="22"
                  y="14"
                  width="8"
                  height="12"
                  rx="4"
                  fill="#10b981"
                />
              </g>
              <defs>
                <radialGradient id="hg1" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#7c8cf8" />
                </radialGradient>
                <linearGradient id="hg2" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#7c8cf8" />
                </linearGradient>
                <linearGradient id="hg3" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
                <linearGradient id="hg4" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7c8cf8" />
                  <stop offset="100%" stopColor="#a8b3ff" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="mds2-hero-card-content">
            <span className="mds2-hero-card-eyebrow">Mesa de Servicio</span>
            <h2 className="mds2-hero-card-title">
              Solicita soporte, equipo o acceso
            </h2>
            <p className="mds2-hero-card-sub">
              Selecciona la categoría que mejor describa tu solicitud.
            </p>
            <div className="mds2-hero-card-bar" />
          </div>
        </div>

        {/* Columna derecha filas 1–2: accesos rápidos */}
        <div className="mds2-quick">
          <div className="mds2-quick-header">Accesos rápidos</div>
          <button
            className="mds2-quick-item"
            onClick={() => navigate("/mesa-de-servicio/reporte-incidente")}
          >
            <span className="mds2-quick-ico mds2-quick-ico--emerald">
              <i className="ti ti-circle-plus" />
            </span>
            <span className="mds2-quick-text">
              <span className="mds2-quick-label">Nueva solicitud</span>
              <span className="mds2-quick-desc">Crear una nueva solicitud</span>
            </span>
            <i className="ti ti-chevron-right mds2-quick-arrow" />
          </button>
          <button className="mds2-quick-item" onClick={() => {}}>
            <span className="mds2-quick-ico mds2-quick-ico--violet">
              <i className="ti ti-clipboard-list" />
            </span>
            <span className="mds2-quick-text">
              <span className="mds2-quick-label">Mis solicitudes</span>
              <span className="mds2-quick-desc">
                Ver el estado de mis solicitudes
              </span>
            </span>
            <i className="ti ti-chevron-right mds2-quick-arrow" />
          </button>
          <button className="mds2-quick-item" onClick={() => {}}>
            <span className="mds2-quick-ico mds2-quick-ico--amber">
              <i className="ti ti-book" />
            </span>
            <span className="mds2-quick-text">
              <span className="mds2-quick-label">Base de conocimiento</span>
              <span className="mds2-quick-desc">Explora artículos y guías</span>
            </span>
            <i className="ti ti-chevron-right mds2-quick-arrow" />
          </button>
        </div>
      </div>

      {/* ══ CATEGORÍAS ══════════════════════════════════════════════════════ */}
      <div className="mds2-section-label">Categorías de servicio</div>

      <div className="mds2-categories">
        {CATEGORIAS.map((cat) => (
          <div
            key={cat.id}
            className={`mds2-cat-wrapper${cat.id === "incidentes" && incidentesOpen ? " mds2-cat-wrapper--open" : ""}`}
          >
            <button
              className={`mds2-cat mds2-cat--${cat.color}`}
              onClick={() => handleCategoryClick(cat)}
            >
              <span className={`mds2-cat-ico mds2-cat-ico--${cat.color}`}>
                <i className={`ti ${cat.icon}`} />
              </span>
              <span className="mds2-cat-body">
                <span className="mds2-cat-label">
                  {cat.label}
                  {cat.badge && (
                    <span
                      className={`mds2-cat-badge mds2-cat-badge--${cat.color}`}
                    >
                      {cat.badge}
                    </span>
                  )}
                </span>
                <span className="mds2-cat-desc">{cat.descripcion}</span>
              </span>
              <i
                className={`ti ${
                  cat.action === "accordion"
                    ? incidentesOpen
                      ? "ti-chevron-up"
                      : "ti-chevron-down"
                    : "ti-chevron-right"
                } mds2-cat-arrow`}
              />
            </button>

            {/* ── ACCORDION: grid 2 columnas de chips ── */}
            {cat.action === "accordion" && incidentesOpen && (
              <div className="mds2-accordion">
                <div className="mds2-acc-grid">
                  {INCIDENTES_CHIPS.map((chip) => (
                    <button
                      key={chip.label}
                      className="mds2-acc-chip"
                      onClick={() =>
                        navigate("/mesa-de-servicio/reporte-incidente")
                      }
                    >
                      <i
                        className={`ti ${INCIDENTES_ICONS[chip.label] ?? chip.icon} mds2-acc-chip-ico`}
                      />
                      <span className="mds2-acc-chip-label">{chip.label}</span>
                      <i className="ti ti-arrow-right mds2-acc-chip-arrow" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ══ BARRA INFERIOR ══════════════════════════════════════════════════ */}
      <div className="mds2-footer-strip">
        <div className="mds2-footer-item">
          <span
            className="mds2-footer-ico"
            style={{ background: "#10b981", color: "#fff" }}
          >
            <i className="ti ti-bolt" />
          </span>
          <div>
            <div className="mds2-footer-label">Respuesta rápida</div>
            <div className="mds2-footer-sub">
              Nos comprometemos a responder lo antes posible
            </div>
          </div>
        </div>
        <div className="mds2-footer-divider" />
        <div className="mds2-footer-item">
          <span
            className="mds2-footer-ico"
            style={{ background: "#7c8cf8", color: "#fff" }}
          >
            <i className="ti ti-shield-check" />
          </span>
          <div>
            <div className="mds2-footer-label">Soporte confiable</div>
            <div className="mds2-footer-sub">
              Nuestro equipo está aquí para ayudarte
            </div>
          </div>
        </div>
        <div className="mds2-footer-divider" />
        <div className="mds2-footer-item">
          <span
            className="mds2-footer-ico"
            style={{ background: "#f6a623", color: "#fff" }}
          >
            <i className="ti ti-clock" />
          </span>
          <div>
            <div className="mds2-footer-label">Horarios de atención</div>
            <div className="mds2-footer-sub">
              Lun – Vie &nbsp;8:00 AM – 6:00 PM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
