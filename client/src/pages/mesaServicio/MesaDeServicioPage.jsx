import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  SERVICIO_CHIPS,
  HARDWARE_CHIPS,
  SOFTWARE_CHIPS,
  HERO_TAGS,
} from "../../data/staticData.js";
import "./hardware/MesaDeServicioPage.css";

export default function MesaDeServicioPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <div className="mds-root">
      {/* ══ HERO ══════════════════════════════════════ */}
      <div className="mds-hero">
        <div className="mds-hero-bg" aria-hidden="true">
          <div className="mds-hero-orb mds-hero-orb--1" />
          <div className="mds-hero-orb mds-hero-orb--2" />
          <div className="mds-hero-orb mds-hero-orb--3" />
          <div className="mds-hero-stars" aria-hidden="true">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`mds-star mds-star--${i + 1}`} />
            ))}
          </div>
        </div>

        <div className="mds-hero-content">
          <div className="mds-hero-left">
            <div className="mds-hero-ico">
              <i className="ti ti-headset" aria-hidden="true" />
            </div>
            <div className="mds-hero-text">
              <div className="mds-hero-eyebrow">Centro de atención de TI</div>
              <h1 className="mds-hero-title">Mesa de Servicio</h1>
              <p className="mds-hero-sub">
                Tu centro de soporte para solicitudes de servicio, hardware y
                desarrollo. Estamos aquí para ayudarte a mantener tu operación
                siempre en marcha.
              </p>
              <div className="mds-hero-tags">
                {HERO_TAGS.map((t) => (
                  <span key={t.label} className="mds-hero-tag">
                    <i className={`ti ${t.icon}`} aria-hidden="true" />
                    {t.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mds-hero-right">
            <div className="mds-info-card">
              <i
                className="ti ti-clock mds-info-ico mds-info-ico--violet"
                aria-hidden="true"
              />
              <div className="mds-info-title">Horario de atención</div>
              <div className="mds-info-row">
                <span className="mds-info-label">Lun – Vie</span>
                <span className="mds-info-val">6:00 – 18:00</span>
              </div>
              <div className="mds-info-row">
                <span className="mds-info-label">Sáb</span>
                <span className="mds-info-val">7:00 – 13:00</span>
              </div>
            </div>

            <div className="mds-info-card">
              <i
                className="ti ti-headset mds-info-ico mds-info-ico--emerald"
                aria-hidden="true"
              />
              <div className="mds-info-title">Soporte</div>
              <div className="mds-online">
                <span className="mds-dot" aria-hidden="true" /> En línea
              </div>
              {/*<div className="mds-info-row" style={{ marginTop: 6 }}>
                <span className="mds-info-label">Tiempo de respuesta</span>
              </div>
              <div className="mds-info-val">&lt; 10 min</div>*/}
            </div>

            <div className="mds-info-card">
              <i
                className="ti ti-phone mds-info-ico mds-info-ico--blue"
                aria-hidden="true"
              />
              <div className="mds-info-title">Extensiones</div>
              <div className="mds-ext-row">
                <span className="mds-ext-label">Planta</span>
                <span className="mds-ext-pill mds-ext-pill--violet">
                  Ext. 62120
                </span>
              </div>
              <div className="mds-ext-row" style={{ marginTop: 5 }}>
                <span className="mds-ext-label">Sur 121</span>
                <span className="mds-ext-pill mds-ext-pill--blue">
                  Ext. 61125
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ GRID ══════════════════════════════════════ */}
      <div className="mds-grid">
        {/* ── SERVICIO ── */}
        <div className="mds-card">
          <div className="mds-card-head">
            <div className="mds-card-ico mds-card-ico--violet">
              <i className="ti ti-headset" aria-hidden="true" />
            </div>
            <div>
              <h2 className="mds-card-title">Solicitud de Servicio</h2>
              <p className="mds-card-kicker mds-card-kicker--violet">
                Soporte · Incidentes · Accesos
              </p>
            </div>
          </div>
          <p className="mds-card-desc">
            Solicita apoyo del área de Sistemas/TI para servicios,
            configuraciones, accesos, soporte técnico o reportar fallas e
            incidentes.
          </p>
          <div className="mds-lbl mds-lbl--violet">Ejemplos de uso</div>
          <div className="mds-chips">
            {SERVICIO_CHIPS.map((c) => (
              <div key={c.label} className="mds-chip">
                <i
                  className={`ti ${c.icon} mds-chip-ico--violet`}
                  aria-hidden="true"
                />
                <span>{c.label}</span>
              </div>
            ))}
          </div>
          <div className="mds-card-foot">
            <button className="mds-btn mds-btn--violet">
              <i className="ti ti-send" aria-hidden="true" />
              Abrir ticket de servicio
            </button>
          </div>
        </div>

        {/* ── HARDWARE ── */}
        <div className="mds-card">
          <div className="mds-card-head">
            <div className="mds-card-ico mds-card-ico--emerald">
              <i className="ti ti-device-laptop" aria-hidden="true" />
            </div>
            <div>
              <h2 className="mds-card-title">Solicitud de Hardware</h2>
              <p className="mds-card-kicker mds-card-kicker--emerald">
                Equipamiento · Periféricos · Accesorios
              </p>
            </div>
          </div>
          <p className="mds-card-desc">
            Solicita equipo de cómputo, accesorios o componentes físicos
            administrados por el área de Sistemas/TI.
          </p>
          <div className="mds-lbl mds-lbl--emerald">Artículos disponibles</div>
          <div className="mds-chips">
            {HARDWARE_CHIPS.map((c) => (
              <div key={c.label} className="mds-chip">
                <i
                  className={`ti ${c.icon} mds-chip-ico--emerald`}
                  aria-hidden="true"
                />
                <span>{c.label}</span>
              </div>
            ))}
          </div>
          <div className="mds-card-foot">
            <div className="mds-btn-row">
              <button
                className="mds-btn mds-btn--emerald"
                onClick={() => navigate("/mesa-de-servicio/hardware")}
              >
                <i className="ti ti-send" aria-hidden="true" />
                Solicitar equipo
              </button>
              {user?.area === "SISTEMAS" && (
                <button
                  className="mds-btn mds-btn--ghost"
                  onClick={() =>
                    navigate("/mesa-de-servicio/hardware/solicitudes")
                  }
                >
                  <i className="ti ti-list-details" aria-hidden="true" />
                  Ver solicitudes
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── ¿NO SABES? ── */}
        <div className="mds-card mds-card--help">
          <div className="mds-help-left">
            <h2 className="mds-help-title">¿No sabes cuál opción elegir?</h2>
            <p className="mds-help-sub">
              Contáctanos directamente, te ayudamos a canalizar tu solicitud al
              instante.
            </p>
            <div className="mds-help-actions">
              <a className="mds-btn mds-btn--helpsolid" href="tel:61125">
                <i className="ti ti-headset" aria-hidden="true" />
                Contactar soporte
              </a>
            </div>
          </div>
          <div className="mds-help-illo" aria-hidden="true">
            <svg
              viewBox="0 0 160 130"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="60"
                y="4"
                width="88"
                height="56"
                rx="14"
                fill="#6366F1"
                opacity=".90"
              />
              <path d="M68 60 L76 72 L88 60" fill="#6366F1" opacity=".90" />
              <circle cx="84" cy="32" r="5" fill="white" opacity=".9" />
              <circle cx="100" cy="32" r="5" fill="white" opacity=".9" />
              <circle cx="116" cy="32" r="5" fill="white" opacity=".9" />
              <rect
                x="0"
                y="44"
                width="56"
                height="36"
                rx="10"
                fill="#818CF8"
                opacity=".75"
              />
              <path d="M8 80 L18 90 L28 80" fill="#818CF8" opacity=".75" />
              <circle cx="16" cy="62" r="4" fill="white" opacity=".85" />
              <circle cx="28" cy="62" r="4" fill="white" opacity=".85" />
              <circle cx="40" cy="62" r="4" fill="white" opacity=".85" />
              <ellipse
                cx="82"
                cy="110"
                rx="32"
                ry="14"
                fill="#3B82F6"
                opacity=".20"
              />
              <path
                d="M56 100 Q56 76 82 76 Q108 76 108 100"
                stroke="#60A5FA"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <rect
                x="46"
                y="96"
                width="16"
                height="22"
                rx="8"
                fill="#3B82F6"
                opacity=".85"
              />
              <rect
                x="102"
                y="96"
                width="16"
                height="22"
                rx="8"
                fill="#3B82F6"
                opacity=".85"
              />
            </svg>
          </div>
        </div>

        {/* ── SOFTWARE ── */}
        <div className="mds-card">
          <div className="mds-card-head">
            <div className="mds-card-ico mds-card-ico--amber">
              <i className="ti ti-code" aria-hidden="true" />
            </div>
            <div>
              <h2 className="mds-card-title">Desarrollo de Software</h2>
              <p className="mds-card-kicker mds-card-kicker--amber">
                Sistemas · Automatización · Reportes
              </p>
            </div>
          </div>
          <p className="mds-card-desc">
            ¿Tienes un proceso que podría ser más eficiente? Solicita el
            desarrollo de nuevas funcionalidades, automatizaciones, reportes o
            integraciones.
          </p>
          <div className="mds-lbl mds-lbl--amber">Tipos de requerimiento</div>
          <div className="mds-chips">
            {SOFTWARE_CHIPS.map((c) => (
              <div key={c.label} className="mds-chip">
                <i
                  className={`ti ${c.icon} mds-chip-ico--amber`}
                  aria-hidden="true"
                />
                <span>{c.label}</span>
              </div>
            ))}
          </div>
          <div className="mds-card-foot">
            <button className="mds-btn mds-btn--amber">
              <i className="ti ti-rocket" aria-hidden="true" />
              Enviar requerimiento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
