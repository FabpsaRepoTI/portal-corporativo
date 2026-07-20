// src/pages/mesa-de-servicio/SolicitudPage.jsx
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useServicioConfig } from "../../hooks/useServicioConfig";
import { AuthContext } from "../../context/AuthContext";
//import "./SolicitudPage.css";
import "./hardware/MesaDeServicioPage.css";
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

/* ─── Skeleton ───────────────────────────────────────────────────── */
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

function formatFechaCorta() {
  const now = new Date();
  return now.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ─── Stepper ────────────────────────────────────────────────────── */
function Stepper({ paso, color }) {
  const pasos = ["Categoría", "Detalle", "Confirmación"];
  return (
    <div className="sp-stepper">
      {pasos.map((label, i) => {
        const num = i + 1;
        const done = num < paso;
        const active = num === paso;
        return (
          <div key={label} className="sp-stepper__item">
            <div
              className={`sp-stepper__circle ${done ? "sp-stepper__circle--done" : ""} ${active ? "sp-stepper__circle--active" : ""}`}
              style={
                active
                  ? { background: color, borderColor: color, color: "#fff" }
                  : done
                    ? { background: color, borderColor: color, color: "#fff" }
                    : {}
              }
            >
              {done ? <i className="ti ti-check" /> : num}
            </div>
            <span
              className={`sp-stepper__label ${active ? "sp-stepper__label--active" : ""}`}
              style={active ? { color } : {}}
            >
              {label}
            </span>
            {i < pasos.length - 1 && (
              <div
                className={`sp-stepper__line ${done ? "sp-stepper__line--done" : ""}`}
                style={done ? { background: color } : {}}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Upload de evidencia ────────────────────────────────────────── */
function EvidenciaUpload({ color }) {
  const [archivo, setArchivo] = useState(null);
  const [drag, setDrag] = useState(false);

  function handleFile(file) {
    if (!file) return;
    setArchivo(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }

  return (
    <div
      className={`sp-evidencia ${drag ? "sp-evidencia--drag" : ""}`}
      style={drag ? { borderColor: color } : {}}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
    >
      {archivo ? (
        <div className="sp-evidencia__preview">
          <i className="ti ti-file-check" style={{ color }} />
          <span className="sp-evidencia__nombre">{archivo.name}</span>
          <button
            type="button"
            className="sp-evidencia__quitar"
            onClick={() => setArchivo(null)}
          >
            <i className="ti ti-x" />
          </button>
        </div>
      ) : (
        <>
          <i className="ti ti-cloud-upload sp-evidencia__icon" />
          <p className="sp-evidencia__texto">
            Arrastra una imagen o captura de pantalla
          </p>
          <p className="sp-evidencia__hint">PNG, JPG · Máx. 5 MB</p>
          <label
            className="sp-evidencia__btn"
            style={{ borderColor: color, color }}
          >
            <i className="ti ti-upload" />
            <input
              type="file"
              accept="image/*,.pdf"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </label>
        </>
      )}
    </div>
  );
}

/* ─── Componente principal ───────────────────────────────────────── */
export default function SolicitudPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { config, loading, error } = useServicioConfig(slug);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [prioridad, setPrioridad] = useState(null);
  const [prioridadObj, setPrioridadObj] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [folio, setFolio] = useState(null);
  const [fechaActual] = useState(formatFechaCorta());

  useEffect(() => {
    setTitulo("");
    setDescripcion("");
    setPrioridad(null);
    setPrioridadObj(null);
    setSubmitError(null);
    setFolio(null);
  }, [slug]);

  useEffect(() => {
    if (config?.comportamiento?.tituloAutofill) {
      setTitulo(config.comportamiento.tituloAutofill);
    }
  }, [config]);

  useEffect(() => {
    if (config?.prioridadDefault) {
      setPrioridad(config.prioridadDefault.idPrioridad);
      setPrioridadObj(config.prioridadDefault);
    }
  }, [config]);

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
    setPrioridadObj(config?.prioridadDefault ?? null);
    setSubmitError(null);
  }

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

  const color = config.colorPrimario;
  const colorBg = `${color}15`;
  const mostrarPrio = config.comportamiento?.mostrarPrioridad;
  const autofill = !!config.comportamiento?.tituloAutofill;
  const sla = config.prioridadDefault;
  const form = config.form ?? {};

  /* Determina el paso del stepper: si hay autofill = ya pasó categoría */
  const paso = autofill ? 2 : 2;

  /* Prioridad activa para el resumen */
  const prioActiva = prioridadObj ?? sla;

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

      {/* ── Header: icono + título + folio + stepper ── */}
      <div className="sp-header-bar">
        <div className="sp-header-bar__left">
          <div
            className="sp-header-bar__icon"
            style={{ background: colorBg, color }}
          >
            <i className={`ti ${config.icono ?? "ti-ticket"}`} />
          </div>
          <div>
            <p className="sp-header-bar__eyebrow">
              MESA DE SERVICIO ·{" "}
              <span style={{ color }}>{config.nombre?.toUpperCase()}</span>
            </p>
            <h1 className="sp-header-bar__titulo">
              {form.titulo ?? "Nueva solicitud"}
            </h1>
            {form.subtitulo && (
              <p className="sp-header-bar__sub">{form.subtitulo}</p>
            )}
          </div>
        </div>
        <div className="sp-header-bar__folio">
          <span className="sp-header-bar__folio-label">
            <i className="ti ti-hash" /> Folio asignado
          </span>
          <span className="sp-header-bar__folio-num" style={{ color }}>
            {folio ?? "—"}
          </span>
          <span className="sp-header-bar__folio-hint">
            Generado automáticamente al enviar
          </span>
        </div>
      </div>

      {/* ── Stepper ── */}
      <Stepper paso={paso} color={color} />

      {/* ── Layout principal ── */}
      <div className="sp-layout">
        {/* ══ COLUMNA IZQUIERDA: formulario + evidencia ══ */}
        <div className="sp-col-main">
          {/* Formulario */}
          <div className="sp-card">
            <form className="sp-form" onSubmit={handleSubmit}>
              {/* Categoría chip (si tiene autofill, mostrar la cat seleccionada) */}
              {autofill && (
                <div
                  className="sp-cat-chip"
                  style={{
                    background: colorBg,
                    color,
                    borderColor: `${color}40`,
                  }}
                >
                  <i className={`ti ${config.icono ?? "ti-tag"}`} />
                  {config.nombre}
                </div>
              )}

              {/* Título del problema */}
              <div className="sp-section-title">Cuéntanos qué está pasando</div>
              {form.descripcion && (
                <p className="sp-section-hint">{form.descripcion}</p>
              )}

              <div className="sp-field">
                <label className="sp-label" htmlFor="sp-titulo">
                  Título del problema <span className="sp-required">*</span>
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

              <div className="sp-field">
                <label className="sp-label" htmlFor="sp-desc">
                  Descripción detallada <span className="sp-required">*</span>
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
                  rows={6}
                  maxLength={1000}
                  required
                />
                <span className="sp-char-count">
                  {descripcion.length} / 1000 caracteres
                </span>
              </div>

              {/* Selector de prioridad */}
              {mostrarPrio && config.prioridades?.length > 0 && (
                <div className="sp-field">
                  <label className="sp-label">
                    Prioridad <span className="sp-required">*</span>
                  </label>
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
                                  background: `${p.colorHex}15`,
                                  color: p.colorHex,
                                }
                              : {}
                          }
                          onClick={() => {
                            setPrioridad(p.idPrioridad);
                            setPrioridadObj(p);
                          }}
                        >
                          <i
                            className="sp-prio-dot"
                            style={{ background: p.colorHex }}
                          />
                          <span className="sp-prio-nombre">{p.nombre}</span>
                          <span className="sp-prio-desc">
                            {p.descripcion ?? ""}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {/* SLA de la prioridad seleccionada */}
                  {prioActiva && (
                    <div
                      className="sp-sla-inline"
                      style={{
                        borderColor: `${prioActiva.color ?? color}40`,
                        background: `${prioActiva.color ?? color}0d`,
                      }}
                    >
                      <i
                        className="ti ti-clock"
                        style={{ color: prioActiva.color ?? color }}
                      />
                      <span style={{ color: prioActiva.color ?? color }}>
                        Tiempo de respuesta estimado para prioridad{" "}
                        {prioActiva.nombre}&nbsp;&nbsp;
                        <strong>
                          {formatMinutos(prioActiva.slaRespuestaMin)}
                        </strong>
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Ayuda contextual */}
              {form.ayudaContextual && (
                <div className="sp-ayuda" style={{ borderLeftColor: color }}>
                  <i className="ti ti-info-circle" style={{ color }} />
                  <p>{form.ayudaContextual}</p>
                </div>
              )}

              {/* Error */}
              {submitError && (
                <div className="sp-submit-error">
                  <i className="ti ti-alert-circle" />
                  {submitError}
                </div>
              )}
            </form>
          </div>

          {/* Evidencia */}
          <div className="sp-card sp-card--evidencia">
            <div className="sp-card__section-label">Evidencia (opcional)</div>
            <EvidenciaUpload color={color} />
          </div>

          {/* Botones */}
          <div className="sp-footer-btns">
            <button
              type="button"
              className="sp-btn sp-btn--ghost"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="sp-main-form"
              className="sp-btn sp-btn--primary"
              disabled={submitting}
              style={{ background: color, borderColor: color }}
              onClick={handleSubmit}
            >
              {submitting ? (
                <>
                  <i className="ti ti-loader-2 sp-spin" /> Enviando…
                </>
              ) : (
                <>
                  <i className="ti ti-send" /> Enviar reporte
                </>
              )}
            </button>
          </div>
        </div>

        {/* ══ SIDEBAR ══ */}
        <aside className="sp-sidebar">
          {/* Resumen */}
          <div className="sp-sidebar-card">
            <div className="sp-sidebar-card__head">
              <i className="ti ti-info-circle" />
              <span>Resumen de solicitud</span>
            </div>
            <div className="sp-sidebar-card__body">
              <div className="sp-resumen-row">
                <span className="sp-resumen-label">Estatus</span>
                <span className="sp-resumen-badge sp-resumen-badge--abierto">
                  ● Abierto
                </span>
              </div>

              <div className="sp-resumen-row">
                <span className="sp-resumen-label">Categoría</span>
                <span className="sp-resumen-val">{config.nombre}</span>
              </div>

              {prioActiva && (
                <div className="sp-resumen-row">
                  <span className="sp-resumen-label">Prioridad</span>
                  <span
                    className="sp-resumen-val"
                    style={{
                      color: prioActiva.color ?? color,
                      fontWeight: 600,
                    }}
                  >
                    {prioActiva.nombre}
                  </span>
                </div>
              )}

              <div className="sp-resumen-row">
                <span className="sp-resumen-label">Sitio</span>
                <span className="sp-resumen-val">{user?.sitio ?? "—"}</span>
              </div>

              <div className="sp-resumen-row">
                <span className="sp-resumen-label">Fecha</span>
                <span className="sp-resumen-val">{fechaActual}</span>
              </div>
            </div>

            {/* Resolución estimada */}
            {sla && (
              <div
                className="sp-resolucion"
                style={{ borderTopColor: "var(--border)" }}
              >
                <div className="sp-resolucion__head" style={{ color }}>
                  <i className="ti ti-clock" style={{ color }} />
                  Resolución estimada
                </div>
                <div className="sp-resolucion__val">
                  Antes de las {formatMinutos(sla.slaResolucionMin)}
                </div>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="sp-sidebar-card">
            <div className="sp-sidebar-card__head">
              <i className="ti ti-bulb" />
              <span>Tips para una respuesta más rápida</span>
            </div>
            <div className="sp-tips-list">
              {[
                {
                  icon: "ti-align-left",
                  text: "Describe desde cuándo ocurre el problema y si afecta a más personas.",
                },
                {
                  icon: "ti-camera",
                  text: "Adjunta una captura de pantalla o foto del error visible.",
                },
                {
                  icon: "ti-device-laptop",
                  text: "Incluye el nombre de tu equipo o número de serie si lo sabes.",
                },
              ].map((tip, i) => (
                <div key={i} className="sp-tip-item">
                  <div
                    className="sp-tip-item__icon"
                    style={{ background: colorBg, color }}
                  >
                    <i className={`ti ${tip.icon}`} />
                  </div>
                  <p className="sp-tip-item__text">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
