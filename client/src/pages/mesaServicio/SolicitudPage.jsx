// src/pages/mesa-de-servicio/SolicitudPage.jsx
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useServicioConfig } from "../../hooks/useServicioConfig";
import { AuthContext } from "../../context/AuthContext";

//import { AuthContext } from "../../context/AuthContext";
import "./SolicitudPage.css";

/* ─── Pantalla de éxito ──────────────────────────────────────────── */
function PantallaExito({ folio, config, onNueva }) {
  const navigate = useNavigate();
  const color = config?.colorPrimario ?? "#7c3aed";

  return (
    <div className="sp-exito">
      <div className="sp-exito__card">
        <div
          className="sp-exito__icono"
          style={{ background: `${color}1a`, color }}
        >
          <i className="ti ti-circle-check" />
        </div>
        <h2 className="sp-exito__titulo">Solicitud enviada</h2>
        <p className="sp-exito__folio">
          Folio: <span style={{ color }}>{folio}</span>
        </p>
        <p className="sp-exito__desc">
          Tu solicitud fue registrada correctamente. El equipo de Sistemas la
          atenderá dentro del tiempo de respuesta establecido.
        </p>
        <div className="sp-exito__acciones">
          <button className="sp-btn sp-btn--ghost" onClick={onNueva}>
            Nueva solicitud
          </button>
          <button
            className="sp-btn sp-btn--primary"
            style={{ background: color, borderColor: color }}
            onClick={() => navigate("/mesa-de-servicio/mis-solicitudes")}
          >
            Ver mis solicitudes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Skeleton de carga ──────────────────────────────────────────── */
function SkeletonForm() {
  return (
    <div className="sp-skeleton">
      <div className="sp-skeleton__header" />
      <div className="sp-skeleton__body">
        <div className="sp-skeleton__line sp-skeleton__line--md" />
        <div className="sp-skeleton__line sp-skeleton__line--sm" />
        <div className="sp-skeleton__line sp-skeleton__line--lg" />
        <div className="sp-skeleton__line sp-skeleton__line--xl" />
        <div className="sp-skeleton__line sp-skeleton__line--md" />
      </div>
    </div>
  );
}

function formatMinutos(min) {
  if (!min) return "—";
  if (min < 60) return `${min} min`;
  if (min < 1440) return `${Math.round(min / 60)} hrs`;
  return `${Math.round(min / 1440)} días`;
}

/* ─── Componente principal ───────────────────────────────────────── */
export default function SolicitudPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { config, loading, error } = useServicioConfig(slug);

  /* Estado del formulario */
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [prioridad, setPrioridad] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [folio, setFolio] = useState(null);

  /* Resetear form cuando cambia el slug */
  useEffect(() => {
    setTitulo("");
    setDescripcion("");
    setPrioridad(null);
    setSubmitError(null);
    setFolio(null);
  }, [slug]);

  /* Autofill de título cuando llega la config */
  useEffect(() => {
    if (config?.comportamiento?.tituloAutofill) {
      setTitulo(config.comportamiento.tituloAutofill);
    }
  }, [config]);

  /* Prioridad default */
  useEffect(() => {
    if (config?.prioridadDefault) {
      setPrioridad(config.prioridadDefault.idPrioridad);
    }
  }, [config]);

  /* ── submit ── */
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const token = localStorage.getItem("fabpsa_token");

    try {
      const res = await fetch("/api/solicitudes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          slug,
          titulo: titulo.trim(),
          descripcion: descripcion.trim(),
          idPrioridad: prioridad,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? `HTTP ${res.status}`);
      }

      const data = await res.json();
      setFolio(data.folio);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleNuevaSolicitud() {
    setFolio(null);
    setTitulo("");
    setDescripcion("");
    setPrioridad(config?.prioridadDefault?.idPrioridad ?? null);
    setSubmitError(null);
  }

  /* ── renders de estado ── */
  if (loading)
    return (
      <div className="sp-wrapper">
        <SkeletonForm />
      </div>
    );

  if (error) {
    return (
      <div className="sp-wrapper">
        <div className="sp-error">
          <i className="ti ti-alert-triangle" />
          <p>No se pudo cargar el formulario.</p>
          <button className="sp-btn sp-btn--ghost" onClick={() => navigate(-1)}>
            Regresar
          </button>
        </div>
      </div>
    );
  }

  if (!config) return null;

  if (folio) {
    return (
      <div className="sp-wrapper">
        <PantallaExito
          folio={folio}
          config={config}
          onNueva={handleNuevaSolicitud}
        />
      </div>
    );
  }

  /* ── alias útiles ── */
  const color = config.colorPrimario;
  const colorBg = `${color}18`;
  const mostrarPrio = config.comportamiento?.mostrarPrioridad;
  const autofill = !!config.comportamiento?.tituloAutofill;
  const sla = config.prioridadDefault;
  const form = config.form ?? {};

  return (
    <div className="sp-wrapper">
      {/* ── Breadcrumb ── */}
      <nav className="sp-breadcrumb">
        <button
          onClick={() => navigate("/mesa-de-servicio")}
          className="sp-breadcrumb__link"
        >
          <i className="ti ti-layout-dashboard" /> Mesa de Servicio
        </button>
        <i className="ti ti-chevron-right sp-breadcrumb__sep" />
        <span className="sp-breadcrumb__current">
          {form.titulo ?? "Nueva solicitud"}
        </span>
      </nav>

      <div className="sp-layout">
        {/* ══════════ FORMULARIO ══════════ */}
        <div className="sp-card">
          {/* Header con acento de color */}
          <div className="sp-card__header" style={{ borderTopColor: color }}>
            <div
              className="sp-card__icon"
              style={{ background: colorBg, color }}
            >
              <i className={`ti ${config.icono ?? "ti-ticket"}`} />
            </div>
            <div>
              <h1 className="sp-card__titulo">
                {form.titulo ?? "Nueva solicitud"}
              </h1>
              {form.subtitulo && (
                <p className="sp-card__subtitulo">{form.subtitulo}</p>
              )}
            </div>
          </div>

          {/* Formulario */}
          <form className="sp-form" onSubmit={handleSubmit}>
            {/* Título */}
            <div className="sp-field">
              <label className="sp-label" htmlFor="sp-titulo">
                Título de la solicitud
                {autofill && (
                  <span
                    className="sp-badge"
                    style={{ background: colorBg, color }}
                  >
                    autocompletado
                  </span>
                )}
              </label>
              <input
                id="sp-titulo"
                className="sp-input"
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder={
                  form.placeholderTitulo ??
                  "Describe brevemente el problema o solicitud"
                }
                maxLength={120}
                required
                readOnly={autofill}
                style={
                  autofill
                    ? { color: "var(--text-muted)", cursor: "default" }
                    : {}
                }
              />
            </div>

            {/* Descripción */}
            <div className="sp-field">
              <label className="sp-label" htmlFor="sp-desc">
                Descripción detallada
              </label>
              <textarea
                id="sp-desc"
                className="sp-textarea"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder={
                  form.placeholderDesc ??
                  "¿Qué ocurrió? ¿Desde cuándo? ¿Qué equipo o sistema está afectado?"
                }
                rows={5}
                maxLength={2000}
                required
              />
              <span className="sp-char-count">{descripcion.length} / 2000</span>
            </div>

            {/* Selector de prioridad (condicional) */}
            {mostrarPrio && config.prioridades?.length > 0 && (
              <div className="sp-field">
                <label className="sp-label">Prioridad</label>
                <div className="sp-prio-grid">
                  {config.prioridades.map((p) => {
                    const active = prioridad === p.idPrioridad;
                    return (
                      <button
                        key={p.idPrioridad}
                        type="button"
                        className={`sp-prio-btn ${active ? "sp-prio-btn--active" : ""}`}
                        style={
                          active
                            ? {
                                borderColor: p.colorHex,
                                background: `${p.colorHex}18`,
                                color: p.colorHex,
                              }
                            : {}
                        }
                        onClick={() => setPrioridad(p.idPrioridad)}
                      >
                        <span
                          className="sp-prio-dot"
                          style={{ background: p.colorHex }}
                        />
                        <span className="sp-prio-nombre">{p.nombre}</span>
                        <span className="sp-prio-sla">
                          Resp. {p.slaRespuestaHrs}h
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Ayuda contextual */}
            {form.ayudaContextual && (
              <div className="sp-ayuda" style={{ borderLeftColor: color }}>
                <i className="ti ti-info-circle" style={{ color }} />
                <p>{form.ayudaContextual}</p>
              </div>
            )}

            {/* Error de envío */}
            {submitError && (
              <div className="sp-submit-error">
                <i className="ti ti-alert-circle" />
                {submitError}
              </div>
            )}

            {/* Botón enviar */}
            <button
              type="submit"
              className="sp-btn sp-btn--primary sp-btn--full"
              disabled={submitting}
              style={{ background: color, borderColor: color }}
            >
              {submitting ? (
                <>
                  <i className="ti ti-loader-2 sp-spin" /> Enviando…
                </>
              ) : (
                <>
                  <i className="ti ti-send" /> Enviar solicitud
                </>
              )}
            </button>
          </form>
        </div>

        {/* ══════════ SIDEBAR INFO ══════════ */}
        <aside className="sp-sidebar">
          {/* Banner SLA */}
          {sla && (
            <div className="sp-sla-card" style={{ borderTopColor: color }}>
              <div
                className="sp-sla-card__head"
                style={{ background: colorBg }}
              >
                <i className="ti ti-clock" style={{ color }} />
                <span style={{ color }}>Tiempos de atención</span>
              </div>
              <div className="sp-sla-card__body">
                <div className="sp-sla-row">
                  <span className="sp-sla-label">Primera respuesta</span>
                  <span className="sp-sla-value" style={{ color }}>
                    {formatMinutos(sla.slaRespuestaMin)}
                  </span>
                </div>
                <div className="sp-sla-row">
                  <span className="sp-sla-label">Resolución estimada</span>
                  <span className="sp-sla-value" style={{ color }}>
                    {formatMinutos(sla.slaResolucionMin)}
                  </span>
                </div>
                <div className="sp-sla-row">
                  <span className="sp-sla-label">Prioridad asignada</span>
                  <span
                    className="sp-sla-badge"
                    style={{
                      background: `${sla.color}18`,
                      color: sla.color,
                      border: `1px solid ${sla.color}40`,
                    }}
                  >
                    {sla.nombre}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="sp-tips-card">
            <div className="sp-tips-card__head">
              <i className="ti ti-bulb" />
              <span>Consejos para tu solicitud</span>
            </div>
            <ul className="sp-tips-list">
              <li>Describe el problema con el mayor detalle posible.</li>
              <li>Indica desde cuándo ocurre el fallo.</li>
              <li>Menciona si otros usuarios están afectados.</li>
              <li>
                Si tienes capturas de pantalla, las podrás adjuntar después.
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
