import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import "./MesaDeServicioPage.css";

// ── Opciones de categoría para el paso 1 ────────────────────────────────────
const CATEGORIAS_FORM = [
  { id: "computo", icon: "ti-device-desktop", label: "Equipo de cómputo" },
  { id: "correo", icon: "ti-mail", label: "Correo / Microsoft 365" },
  { id: "sistemas", icon: "ti-apps", label: "Sistemas y Aplicaciones" },
  { id: "red", icon: "ti-wifi-off", label: "Internet y red" },
  { id: "impresoras", icon: "ti-printer", label: "Impresoras y Escáneres" },
  { id: "telefonia", icon: "ti-phone", label: "Telefonía y comunicaciones" },
  {
    id: "servidores",
    icon: "ti-server",
    label: "Infraestructura y servidores",
  },
  { id: "seguridad", icon: "ti-shield-lock", label: "Seguridad Informática" },
  { id: "office", icon: "ti-brand-office", label: "Office 365" },
  { id: "cctv", icon: "ti-camera", label: "CCTV y control de acceso" },
  { id: "erp", icon: "ti-chart-bar", label: "ERP Multivisión" },
  { id: "software", icon: "ti-apps", label: "Software" },
  { id: "accesos", icon: "ti-lock", label: "Accesos y cuentas de usuario" },
  { id: "consulta", icon: "ti-message-circle", label: "Consulta general TI" },
];

const PRIORIDADES = [
  { id: "baja", label: "Baja", desc: "No afecta operación", color: "teal" },
  { id: "media", label: "Media", desc: "Afecta parcialmente", color: "amber" },
  { id: "alta", label: "Alta", desc: "Bloquea mi trabajo", color: "red" },
];

export default function ReporteIncidentePage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [step, setStep] = useState(1); // 1 = categoría, 2 = detalle
  const [categoria, setCategoria] = useState(null);
  const [prioridad, setPrioridad] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const canNext = !!categoria;
  const canSubmit = prioridad && titulo.trim().length > 3;

  return (
    <div className="rip-root">
      {/* ── HEADER ── */}
      <div className="rip-header">
        <button
          className="rip-back"
          onClick={() => navigate("/mesa-de-servicio")}
        >
          <i className="ti ti-arrow-left" />
          Mesa de Servicio
        </button>

        <div className="rip-header-main">
          <div className="rip-header-icon">
            <i className="ti ti-alert-triangle" />
          </div>
          <div>
            <h1 className="rip-title">Reporte de Incidente</h1>
            <p className="rip-subtitle">
              Describe el problema para que el equipo de TI pueda atenderte.
            </p>
          </div>
        </div>

        {/* Stepper */}
        <div className="rip-stepper">
          <div
            className={`rip-step ${step >= 1 ? "rip-step--active" : ""} ${step > 1 ? "rip-step--done" : ""}`}
          >
            <span className="rip-step-num">
              {step > 1 ? <i className="ti ti-check" /> : "1"}
            </span>
            <span className="rip-step-label">Categoría</span>
          </div>
          <div className="rip-step-line" />
          <div className={`rip-step ${step >= 2 ? "rip-step--active" : ""}`}>
            <span className="rip-step-num">2</span>
            <span className="rip-step-label">Detalle</span>
          </div>
        </div>
      </div>

      {/* ── PASO 1: CATEGORÍA ── */}
      {step === 1 && (
        <div className="rip-card rip-fade-in">
          <div className="rip-card-header">
            <h2 className="rip-card-title">¿Cuál es el área afectada?</h2>
            <p className="rip-card-sub">
              Selecciona la categoría que mejor describe tu problema.
            </p>
          </div>

          <div className="rip-cat-grid">
            {CATEGORIAS_FORM.map((cat) => (
              <button
                key={cat.id}
                className={`rip-cat-item ${categoria?.id === cat.id ? "rip-cat-item--selected" : ""}`}
                onClick={() => setCategoria(cat)}
              >
                <i className={`ti ${cat.icon} rip-cat-ico`} />
                <span className="rip-cat-label">{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="rip-actions">
            <button
              className="rip-btn rip-btn--cancel"
              onClick={() => navigate("/mesa-de-servicio")}
            >
              Cancelar
            </button>
            <button
              className="rip-btn rip-btn--primary"
              disabled={!canNext}
              onClick={() => setStep(2)}
            >
              Continuar
              <i className="ti ti-arrow-right" />
            </button>
          </div>
        </div>
      )}

      {/* ── PASO 2: DETALLE ── */}
      {step === 2 && (
        <div className="rip-card rip-fade-in">
          <div className="rip-card-header">
            <div className="rip-selected-badge">
              <i className={`ti ${categoria.icon}`} />
              {categoria.label}
            </div>
            <h2 className="rip-card-title">Cuéntanos qué está pasando</h2>
            <p className="rip-card-sub">
              Mientras más detalle des, más rápido podremos ayudarte.
            </p>
          </div>

          <div className="rip-fields">
            {/* Título */}
            <div className="rip-field">
              <label className="rip-label">
                Título del problema <span className="rip-required">*</span>
              </label>
              <input
                className="rip-input"
                type="text"
                placeholder="Ej. No puedo abrir Outlook desde esta mañana"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                maxLength={120}
              />
            </div>

            {/* Descripción */}
            <div className="rip-field">
              <label className="rip-label">Descripción detallada</label>
              <textarea
                className="rip-textarea"
                placeholder="Describe qué ocurre, desde cuándo, si afecta a más personas y cualquier mensaje de error que hayas visto..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={5}
              />
            </div>

            {/* Prioridad */}
            <div className="rip-field">
              <label className="rip-label">
                Prioridad <span className="rip-required">*</span>
              </label>
              <div className="rip-priority-group">
                {PRIORIDADES.map((p) => (
                  <button
                    key={p.id}
                    className={`rip-priority-btn rip-priority-btn--${p.color} ${prioridad?.id === p.id ? "rip-priority-btn--selected" : ""}`}
                    onClick={() => setPrioridad(p)}
                    type="button"
                  >
                    <span className="rip-priority-label">{p.label}</span>
                    <span className="rip-priority-desc">{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Info del solicitante (solo lectura) */}
            <div className="rip-info-strip">
              <i className="ti ti-user-circle rip-info-ico" />
              <div className="rip-info-body">
                <span className="rip-info-label">Solicitante</span>
                <span className="rip-info-val">
                  {user?.name ?? "Usuario"} — {user?.area ?? ""} ·{" "}
                  {user?.sitio ?? ""}
                </span>
              </div>
              <div className="rip-info-note">
                <i className="ti ti-lock" />
                Se envía automáticamente
              </div>
            </div>
          </div>

          <div className="rip-actions">
            <button
              className="rip-btn rip-btn--ghost"
              onClick={() => setStep(1)}
            >
              <i className="ti ti-arrow-left" />
              Atrás
            </button>
            <button
              className="rip-btn rip-btn--primary"
              disabled={!canSubmit}
              onClick={() => {
                // TODO: implementar lógica de envío
              }}
            >
              <i className="ti ti-send" />
              Enviar reporte
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
