import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  SERVICIOS_GRID,
  QUICK_SISTEMAS,
  QUICK_USUARIO,
  INCIDENTES_CHIPS,
  INCIDENTES_ICONS,
} from "../../data/mesaDeServicioData.js";
import "./hardware/MesaDeServicioPage.css";

export default function MesaDeServicioPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [incidentesOpen, setIncidentesOpen] = useState(false);

  const firstName = user?.name?.split(" ")[0] ?? "Usuario";
  const esSistemas = ["SISTEMAS", "SYSTEMS"].includes(
    user?.area?.toUpperCase(),
  );
  const quickItems = esSistemas ? QUICK_SISTEMAS : QUICK_USUARIO;

  const handleServicioClick = (s) =>
    s.action === "navigate"
      ? navigate(s.route)
      : navigate(`/mesa-de-servicio/solicitud/${s.id}`);
  const handleQuickClick = (item) => {
    if (item.type === "route") navigate(item.route);
    if (item.type === "incidente") setIncidentesOpen(true);
  };
  const handleChipClick = (chip) =>
    navigate(`/mesa-de-servicio/solicitud/${chip.id}`);

  return (
    <div className="mds3-root">
      {/* ── SALUDO ──────────────────────────────────────────────── */}
      <div className="mds3-greeting">
        <button className="mds3-back" onClick={() => navigate("/")}>
          <i className="ti ti-arrow-left" /> Volver al inicio
        </button>
        <h1 className="mds3-greeting-title">
          Hola, {firstName} <span>👋</span>
        </h1>
        <p className="mds3-greeting-sub">¿En qué podemos ayudarte hoy?</p>
      </div>

      {/* ── FILA 1: HERO + ACCESOS RÁPIDOS ─────────────────────── */}
      <div className="mds3-top-row">
        {/* HERO */}
        <div className="mds3-hero">
          <div className="mds3-hero-ilu" aria-hidden="true">
            <svg
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="80" cy="80" r="72" fill="#ede9fe" opacity="0.7" />
              <circle cx="80" cy="80" r="52" fill="#ddd6fe" opacity="0.8" />
              <circle cx="80" cy="80" r="36" fill="url(#hilu1)" />
              <rect x="76" y="54" width="8" height="34" rx="4" fill="#fff" />
              <circle cx="80" cy="102" r="5" fill="#fff" />
              <circle cx="24" cy="36" r="8" fill="#7c3aed" opacity="0.18" />
              <circle cx="136" cy="124" r="6" fill="#a78bfa" opacity="0.22" />
              <rect
                x="120"
                y="24"
                width="18"
                height="18"
                rx="5"
                fill="#7c3aed"
                opacity="0.14"
                transform="rotate(12 129 33)"
              />
              <defs>
                <radialGradient id="hilu1" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </radialGradient>
              </defs>
            </svg>
          </div>

          <div className="mds3-hero-content">
            <span className="mds3-hero-eyebrow">
              <i className="ti ti-star-filled" /> Acción principal
            </span>
            <h2 className="mds3-hero-title">Reportar un incidente o falla</h2>
            <p className="mds3-hero-sub">
              ¿Tienes un problema con algún servicio o herramienta?
              <br />
              Repórtalo y nuestro equipo de TI te ayudará lo antes posible.
            </p>
            <button
              className="mds3-hero-btn"
              onClick={() => setIncidentesOpen((v) => !v)}
            >
              <i className="ti ti-circle-plus" />
              Reportar incidente
              <i
                className={`ti ${incidentesOpen ? "ti-chevron-up" : "ti-chevron-down"} mds3-hero-btn-chev`}
              />
            </button>
          </div>

          <div className="mds3-hero-feats">
            <div className="mds3-hero-feat">
              <i className="ti ti-clock-bolt mds3-hf-ico" />
              <div>
                <div className="mds3-hf-label">Respuesta rápida</div>
                <div className="mds3-hf-sub">Atención prioritaria</div>
              </div>
            </div>
            <div className="mds3-hero-feat">
              <i className="ti ti-eye mds3-hf-ico" />
              <div>
                <div className="mds3-hf-label">Seguimiento en tiempo real</div>
                <div className="mds3-hf-sub">
                  Monitorea el estado de tu caso
                </div>
              </div>
            </div>
            <div className="mds3-hero-feat">
              <i className="ti ti-shield-check mds3-hf-ico" />
              <div>
                <div className="mds3-hf-label">Soporte confiable</div>
                <div className="mds3-hf-sub">
                  Nuestro equipo está para ayudarte
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACCESOS RÁPIDOS */}
        <div className="mds3-quick">
          <div className="mds3-quick-hdr">Accesos rápidos</div>
          {quickItems.map((item, i) => (
            <button
              key={i}
              className="mds3-quick-item"
              onClick={() => handleQuickClick(item)}
            >
              <span
                className="mds3-quick-ico"
                style={{ background: item.colorBg, color: item.color }}
              >
                <i className={`ti ${item.icon}`} />
              </span>
              <span className="mds3-quick-text">
                <span className="mds3-quick-label">{item.label}</span>
                <span className="mds3-quick-desc">{item.desc}</span>
              </span>
              <i className="ti ti-chevron-right mds3-quick-arrow" />
            </button>
          ))}
        </div>
      </div>
      {/* fin mds3-top-row */}

      {/* ── ACCORDION (debajo del hero, ancho completo) ─────────── */}
      {incidentesOpen && (
        <div className="mds3-accordion">
          <div className="mds3-accordion-hdr">
            <i className="ti ti-alert-triangle mds3-accordion-ico" />
            <div>
              <div className="mds3-accordion-title">Incidentes y fallas</div>
              <div className="mds3-accordion-sub">
                Reporta fallas en equipos, aplicaciones, sistemas o cualquier
                incidente tecnológico
              </div>
            </div>
          </div>
          <div className="mds3-acc-grid">
            {INCIDENTES_CHIPS.map((chip) => (
              <button
                key={chip.id}
                className="mds3-acc-chip"
                onClick={() => handleChipClick(chip)}
              >
                <i
                  className={`ti ${INCIDENTES_ICONS[chip.label] ?? chip.icon} mds3-acc-ico`}
                />
                <span className="mds3-acc-label">{chip.label}</span>
                <i className="ti ti-arrow-right mds3-acc-arrow" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── SERVICIOS: 6 tarjetas en una fila ───────────────────── */}
      <div className="mds3-section-label">Servicios disponibles</div>
      <div className="mds3-grid">
        {SERVICIOS_GRID.map((s) => (
          <button
            key={s.id}
            className="mds3-svc"
            onClick={() => handleServicioClick(s)}
          >
            <div className="mds3-svc-top">
              <div
                className="mds3-svc-ico"
                style={{ background: s.colorBg, color: s.color }}
              >
                <i className={`ti ${s.icon}`} />
              </div>
              <i className="ti ti-chevron-right mds3-svc-arrow" />
            </div>
            <div className="mds3-svc-label">
              {s.label}
              {s.badge && (
                <span
                  className="mds3-svc-badge"
                  style={{ color: s.color, background: s.colorBg }}
                >
                  {s.badge}
                </span>
              )}
            </div>
            <div className="mds3-svc-desc">{s.descripcion}</div>
            <div className="mds3-svc-line" style={{ background: s.color }} />
          </button>
        ))}
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <div className="mds3-footer">
        <div className="mds3-footer-item">
          <span className="mds3-footer-ico" style={{ background: "#10b981" }}>
            <i className="ti ti-bolt" />
          </span>
          <div>
            <div className="mds3-footer-label">Respuesta rápida</div>
            <div className="mds3-footer-sub">
              Nos comprometemos a responder lo antes posible
            </div>
          </div>
        </div>
        <div className="mds3-footer-div" />
        <div className="mds3-footer-item">
          <span className="mds3-footer-ico" style={{ background: "#3b82f6" }}>
            <i className="ti ti-eye" />
          </span>
          <div>
            <div className="mds3-footer-label">Seguimiento en tiempo real</div>
            <div className="mds3-footer-sub">
              Monitorea el estado de tu caso
            </div>
          </div>
        </div>
        <div className="mds3-footer-div" />
        <div className="mds3-footer-item">
          <span className="mds3-footer-ico" style={{ background: "#7c3aed" }}>
            <i className="ti ti-shield-check" />
          </span>
          <div>
            <div className="mds3-footer-label">Soporte confiable</div>
            <div className="mds3-footer-sub">
              Nuestro equipo está aquí para ayudarte
            </div>
          </div>
        </div>
        <div className="mds3-footer-div" />
        <div className="mds3-footer-item">
          <span className="mds3-footer-ico" style={{ background: "#f59e0b" }}>
            <i className="ti ti-clock" />
          </span>
          <div>
            <div className="mds3-footer-label">Horarios de atención</div>
            <div className="mds3-footer-sub">
              Lun – Vie &nbsp;8:00 AM – 6:00 PM
            </div>
            <div className="mds3-footer-sub">Sáb &nbsp;7:00 AM – 1:00 PM</div>
          </div>
        </div>
      </div>
    </div>
  );
}
