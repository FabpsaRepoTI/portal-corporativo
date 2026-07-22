import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import "./MisSolicitudes.css";

/* ─── Config ──────────────────────────────────────────────────── */
const API =
  window.location.hostname === "localhost"
    ? "http://localhost:3001"
    : "http://192.168.16.198:3002";

function authH() {
  const t = localStorage.getItem("fabpsa_token");
  return { Authorization: `Bearer ${t}`, "Content-Type": "application/json" };
}

/* ─── Helpers ─────────────────────────────────────────────────── */
function fmtFecha(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) +
    ", " +
    d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })
  );
}

function fmtFechaCorta(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function fmtTiempo(min) {
  if (min == null || min === undefined) return "—";
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function fmtBytes(b) {
  if (!b) return "";
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

function initials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function slaInfo(fechaLimite, resuelto) {
  if (resuelto || !fechaLimite) return null;
  const diff = new Date(fechaLimite) - new Date();
  const hrs = diff / 3_600_000;
  const min = diff / 60_000;
  if (hrs < 0)
    return {
      label: `${Math.abs(Math.round(hrs))}h vencido`,
      cls: "danger",
      pct: 100,
      icon: "ti-trending-up",
    };
  if (hrs < 1)
    return {
      label: `${Math.round(min)}m restantes`,
      cls: "warn",
      pct: 85,
      icon: "ti-trending-down",
    };
  if (hrs < 4)
    return {
      label: `${Math.round(hrs)}h restantes`,
      cls: "warn",
      pct: 65,
      icon: "ti-trending-down",
    };
  return {
    label: `${Math.round(hrs)}h restantes`,
    cls: "ok",
    pct: 30,
    icon: "ti-trending-up",
  };
}

function isImage(mime) {
  return mime?.startsWith("image/");
}

/* ─── Chip componente ─────────────────────────────────────────── */
function Chip({ label, color }) {
  const hex = color || "#64748b";
  return (
    <span
      className="msp-chip"
      style={{
        background: `${hex}1a`,
        color: hex,
        border: `1px solid ${hex}33`,
      }}
    >
      <span className="msp-chip-dot" style={{ background: hex }} />
      {label}
    </span>
  );
}

/* ─── SLA cell ────────────────────────────────────────────────── */
function SlaCell({ fechaLimite, resuelto, tiempoAtencionMin }) {
  if (resuelto) {
    return tiempoAtencionMin ? (
      <span className="msp-sla ok">
        <i className="ti ti-clock-check" style={{ fontSize: 13 }} />
        {fmtTiempo(tiempoAtencionMin)}
      </span>
    ) : (
      <span className="msp-sla none">—</span>
    );
  }
  const s = slaInfo(fechaLimite, false);
  if (!s) return <span className="msp-sla none">—</span>;
  return (
    <span className={`msp-sla ${s.cls}`}>
      <i className={`ti ${s.icon}`} style={{ fontSize: 13 }} />
      {s.label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB: Información general
   ═══════════════════════════════════════════════════════════════ */
function TabInfoGeneral({ d }) {
  return (
    <div className="msp-tab-content">
      {/* Col 1 — Detalles */}
      <div className="msp-detail-section">
        <div className="msp-detail-section-title">Detalles de la solicitud</div>
        <div className="msp-detail-row">
          <span className="msp-detail-label">Folio</span>
          <span
            className="msp-detail-value"
            style={{
              color: "#7c8cf8",
              fontFamily: "monospace",
              fontWeight: 700,
            }}
          >
            {d.folio}
          </span>
        </div>
        <div className="msp-detail-row">
          <span className="msp-detail-label">Servicio</span>
          <span className="msp-detail-value">{d.servicio}</span>
        </div>
        <div className="msp-detail-row">
          <span className="msp-detail-label">Categoría</span>
          <span className="msp-detail-value">{d.categoria || "—"}</span>
        </div>
        <div className="msp-detail-row">
          <span className="msp-detail-label">Descripción</span>
        </div>
        <div className="msp-descripcion-box">
          {d.descripcion || "Sin descripción."}
        </div>
      </div>

      {/* Col 2 — Estado */}
      <div className="msp-detail-section">
        <div className="msp-detail-section-title">Estado del ticket</div>
        <div className="msp-detail-row">
          <span className="msp-detail-label">Prioridad</span>
          <Chip label={d.prioridadNombre} color={d.prioridadColor} />
        </div>
        <div className="msp-detail-row">
          <span className="msp-detail-label">Estado</span>
          <Chip label={d.estatusNombre} color={d.estatusColor} />
        </div>
        <div className="msp-detail-row">
          <span className="msp-detail-label">Fecha de creación</span>
          <span className="msp-detail-value">{fmtFecha(d.fechaCreacion)}</span>
        </div>
        <div className="msp-detail-row">
          <span className="msp-detail-label">Última actualización</span>
          <span className="msp-detail-value">
            {fmtFecha(d.fechaActualizacion || d.fechaCreacion)}
          </span>
        </div>
        {d.fechaResolucion && (
          <div className="msp-detail-row">
            <span className="msp-detail-label">Fecha de resolución</span>
            <span className="msp-detail-value">
              {fmtFecha(d.fechaResolucion)}
            </span>
          </div>
        )}
      </div>

      {/* Col 3 — Asignación */}
      <div className="msp-detail-section">
        <div className="msp-detail-section-title">Asignación</div>
        <div className="msp-asignacion-card">
          <div className="msp-asignacion-title">Técnico asignado</div>
          {d.nombreTecnico ? (
            <>
              <div className="msp-tech-row">
                <div className="msp-tech-avatar">
                  {initials(d.nombreTecnico)}
                </div>
                <div>
                  <div className="msp-tech-name">{d.nombreTecnico}</div>
                  <div className="msp-tech-role">Soporte TI</div>
                </div>
              </div>
              <div className="msp-detail-row" style={{ marginTop: "0.5rem" }}>
                <span className="msp-detail-label">Departamento</span>
                <span className="msp-detail-value">Sistemas</span>
              </div>
            </>
          ) : (
            <div style={{ color: "var(--text-faint)", fontSize: 13 }}>
              Sin asignar aún
            </div>
          )}
        </div>
      </div>

      {/* Col 4 — Tiempos */}
      <div className="msp-detail-section">
        <div className="msp-detail-section-title">Tiempos</div>
        <div className="msp-tiempos-card">
          <div className="msp-tiempos-title">Información de tiempos</div>
          <div className="msp-tiempo-row">
            <span className="msp-tiempo-label">
              Primera respuesta comprometida
            </span>
            <span className="msp-tiempo-val">
              {fmtFecha(d.fechaLimiteResp)}
            </span>
          </div>
          {d.tiempoAtencionMin && (
            <div className="msp-tiempo-row">
              <span className="msp-tiempo-label">Tiempo transcurrido</span>
              <span className="msp-tiempo-val">
                {fmtTiempo(d.tiempoAtencionMin)}
              </span>
            </div>
          )}
          <div className="msp-tiempo-row">
            <span className="msp-tiempo-label">SLA restante</span>
            <SlaCell
              fechaLimite={d.fechaLimiteResp}
              resuelto={[3, 4, 5].includes(d.idEstatus)}
              tiempoAtencionMin={d.tiempoAtencionMin}
            />
          </div>
          <div className="msp-tiempo-row">
            <span className="msp-tiempo-label">
              Tiempo estimado de resolución
            </span>
            <span className="msp-tiempo-val">
              {fmtFecha(d.fechaLimiteResol)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB: Evidencias
   ═══════════════════════════════════════════════════════════════ */
function TabEvidencias({ archivos }) {
  const [lightbox, setLightbox] = useState(null);

  return (
    <div className="msp-tab-content">
      <div className="msp-evidencias-grid">
        {!archivos?.length ? (
          <span className="msp-evidencias-empty">
            No se adjuntaron evidencias en esta solicitud.
          </span>
        ) : (
          archivos.map((a) => {
            if (isImage(a.mimeType)) {
              return (
                <div
                  key={a.idArchivo}
                  className="msp-evidencia-thumb"
                  onClick={() => setLightbox(`${API}/${a.rutaServidor}`)}
                >
                  <img src={`${API}/${a.rutaServidor}`} alt={a.nombreArchivo} />
                </div>
              );
            }
            return (
              <a
                key={a.idArchivo}
                href={`${API}/${a.rutaServidor}`}
                target="_blank"
                rel="noreferrer"
                className="msp-evidencia-file"
              >
                <i
                  className="ti ti-file-description"
                  style={{ fontSize: "1.6rem", color: "var(--text-muted)" }}
                />
                <span>{a.nombreArchivo}</span>
                <span style={{ fontSize: 10, color: "var(--text-faint)" }}>
                  {fmtBytes(a.tamanoBytes)}
                </span>
              </a>
            );
          })
        )}
      </div>
      {lightbox && (
        <div className="msp-lightbox" onClick={() => setLightbox(null)}>
          <img
            src={lightbox}
            alt="evidencia"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="msp-lightbox-close"
            onClick={() => setLightbox(null)}
          >
            <i className="ti ti-x" style={{ fontSize: "1.1rem" }} />
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB: Información SLA
   ═══════════════════════════════════════════════════════════════ */
function TabSLA({ d }) {
  const resuelto = [3, 4, 5].includes(d.idEstatus);
  const sla = slaInfo(d.fechaLimiteResp, resuelto);

  const totalHrs = d.slaRespuestaHrs || 8;
  const transcurrido = d.tiempoAtencionMin
    ? Math.round((d.tiempoAtencionMin / 60) * 10) / 10
    : null;
  const pct = sla?.pct ?? (resuelto ? 100 : 0);
  const barColor =
    sla?.cls === "danger"
      ? "#f38ba8"
      : sla?.cls === "warn"
        ? "#F59E0B"
        : "#4cc9a6";

  const semaforoMap = {
    ok: {
      bg: "rgba(76,201,166,0.1)",
      border: "rgba(76,201,166,0.3)",
      color: "#4cc9a6",
      icon: "ti-circle-check",
      label: "Dentro del SLA — tiempo suficiente",
    },
    warn: {
      bg: "rgba(245,158,11,0.1)",
      border: "rgba(245,158,11,0.3)",
      color: "#F59E0B",
      icon: "ti-alert-triangle",
      label: "Próximo a vencer — atención en curso",
    },
    danger: {
      bg: "rgba(243,139,168,0.1)",
      border: "rgba(243,139,168,0.3)",
      color: "#f38ba8",
      icon: "ti-alert-circle",
      label: "SLA vencido — escalado a supervisión",
    },
  };
  const sem = resuelto
    ? {
        bg: "rgba(76,201,166,0.1)",
        border: "rgba(76,201,166,0.3)",
        color: "#4cc9a6",
        icon: "ti-circle-check",
        label: "Solicitud resuelta dentro del tiempo comprometido",
      }
    : semaforoMap[sla?.cls] || semaforoMap.ok;

  return (
    <div className="msp-tab-content">
      <div className="msp-sla-content">
        <div className="msp-sla-grid">
          <div className="msp-sla-metric">
            <div className="msp-sla-metric-label">SLA comprometido</div>
            <div className="msp-sla-metric-val">{totalHrs}h</div>
            <div className="msp-sla-metric-sub">
              Tiempo de respuesta acordado
            </div>
          </div>
          <div className="msp-sla-metric">
            <div className="msp-sla-metric-label">Tiempo transcurrido</div>
            <div className="msp-sla-metric-val" style={{ color: barColor }}>
              {transcurrido != null ? `${transcurrido}h` : "—"}
            </div>
            <div className="msp-sla-metric-sub">
              Desde la apertura del ticket
            </div>
          </div>
          <div className="msp-sla-metric">
            <div className="msp-sla-metric-label">Tiempo restante</div>
            <div className="msp-sla-metric-val" style={{ color: barColor }}>
              {resuelto ? "—" : sla?.label || "—"}
            </div>
            <div className="msp-sla-metric-sub">
              {resuelto ? "Ticket resuelto" : "Para primera respuesta"}
            </div>
          </div>
          <div className="msp-sla-metric">
            <div className="msp-sla-metric-label">
              Fecha estimada de resolución
            </div>
            <div
              className="msp-sla-metric-val"
              style={{ fontSize: "1rem", paddingTop: "0.2rem" }}
            >
              {fmtFechaCorta(d.fechaLimiteResol)}
            </div>
            <div className="msp-sla-metric-sub">
              {fmtFecha(d.fechaLimiteResol)}
            </div>
          </div>
        </div>

        <div className="msp-sla-bar-wrap">
          <div className="msp-sla-bar-label">
            <span>Progreso del SLA</span>
            <span style={{ color: barColor, fontWeight: 600 }}>{pct}%</span>
          </div>
          <div className="msp-sla-bar-track">
            <div
              className="msp-sla-bar-fill"
              style={{ width: `${pct}%`, background: barColor }}
            />
          </div>
        </div>

        <div
          className="msp-sla-semaforo"
          style={{
            background: sem.bg,
            border: `1px solid ${sem.border}`,
            color: sem.color,
          }}
        >
          <i className={`ti ${sem.icon}`} style={{ fontSize: "1.1rem" }} />
          {sem.label}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB: Comentarios
   ═══════════════════════════════════════════════════════════════ */
function TabComentarios({ d, ticketId, user, onNuevoComentario }) {
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const ref = useRef(null);
  const cerrado = [4, 5].includes(d.idEstatus);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [d.comentarios]);

  async function enviar() {
    if (!texto.trim() || enviando) return;
    setEnviando(true);
    try {
      const r = await fetch(
        `${API}/api/solicitudes-usuario/${ticketId}/comentario`,
        {
          method: "POST",
          headers: authH(),
          body: JSON.stringify({ comentario: texto.trim() }),
        },
      );
      if (!r.ok) throw new Error();
      const nuevo = await r.json();
      onNuevoComentario(nuevo);
      setTexto("");
    } finally {
      setEnviando(false);
    }
  }

  function onKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  }

  return (
    <div className="msp-tab-content">
      <div className="msp-conv-content">
        {!d.comentarios?.length ? (
          <div className="msp-conv-empty">
            <i
              className="ti ti-message-circle-off"
              style={{ fontSize: "1.5rem", marginBottom: 6 }}
            />
            <br />
            Aún no hay mensajes en esta solicitud
          </div>
        ) : (
          <div className="msp-mensajes" ref={ref}>
            {d.comentarios.map((c) => {
              const esMio = c.idUsuario === user.login;
              const cls = esMio ? "usuario" : "tecnico";
              return (
                <div key={c.idComentario} className={`msp-mensaje ${cls}`}>
                  <div className="msp-mensaje-header">
                    <div className={`msp-msg-avatar ${esMio ? "usr" : "ti"}`}>
                      {initials(c.nombreUsuario)}
                    </div>
                    <span className={`msp-msg-rol-tag ${esMio ? "usr" : "ti"}`}>
                      {esMio ? "Usuario" : "Técnico"}
                    </span>
                    <span>{c.nombreUsuario}</span>
                    <span style={{ color: "var(--text-faint)" }}>·</span>
                    <span>{fmtFecha(c.fecha)}</span>
                  </div>
                  <div className="msp-burbuja">{c.comentario}</div>
                </div>
              );
            })}
          </div>
        )}

        {!cerrado ? (
          <div className="msp-conv-actions">
            <div className="msp-conv-actions-label">
              ¿Tienes alguna actualización sobre tu solicitud?
            </div>
            <div className="msp-conv-input-row">
              <textarea
                className="msp-conv-textarea"
                rows={3}
                placeholder="Escribe tu mensaje… (Enter para enviar)"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                onKeyDown={onKey}
              />
              <div className="msp-conv-btns">
                <button
                  className="msp-btn-action primary"
                  onClick={enviar}
                  disabled={!texto.trim() || enviando}
                >
                  <i className="ti ti-send" style={{ fontSize: "0.9rem" }} />
                  {enviando ? "Enviando…" : "Enviar"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: "0.75rem 1rem",
              background: "var(--bg-elevated)",
              borderRadius: 8,
              fontSize: 13,
              color: "var(--text-faint)",
              textAlign: "center",
            }}
          >
            Esta solicitud está {d.estatusNombre?.toLowerCase()} — no se pueden
            agregar comentarios
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Panel expandido (Master / Detail)
   ═══════════════════════════════════════════════════════════════ */
function DetalleExpandido({ id, user, onAccionCancelar }) {
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("info");

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/api/solicitudes-usuario/${id}/detalle`, {
        headers: authH(),
      });
      if (!r.ok) throw new Error();
      setDetalle(await r.json());
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  function onNuevoComentario(c) {
    setDetalle((prev) => ({
      ...prev,
      comentarios: [...(prev.comentarios || []), c],
    }));
  }

  const nComentarios = detalle?.comentarios?.length || 0;
  const nEvidencias = detalle?.archivos?.length || 0;
  const puedeCancel = detalle && detalle.idEstatus === 1;
  const cerrado = detalle && [4, 5].includes(detalle.idEstatus);

  return (
    <div className="msp-detail">
      {loading ? (
        <div style={{ padding: "2rem", display: "flex", gap: 12 }}>
          {[100, 160, 200, 140].map((w, i) => (
            <div
              key={i}
              className="msp-skeleton"
              style={{ height: 14, width: w }}
            />
          ))}
        </div>
      ) : !detalle ? (
        <div
          style={{
            padding: "2rem",
            color: "var(--text-faint)",
            textAlign: "center",
          }}
        >
          No se pudo cargar el detalle.
        </div>
      ) : (
        <>
          {/* Pestañas */}
          <div className="msp-tabs">
            {[
              {
                key: "info",
                label: "Información general",
                icon: "ti-info-circle",
              },
              {
                key: "evidencias",
                label: "Evidencias",
                icon: "ti-paperclip",
                count: nEvidencias,
              },
              { key: "sla", label: "Información SLA", icon: "ti-clock" },
              {
                key: "comentarios",
                label: "Comentarios",
                icon: "ti-message",
                count: nComentarios,
              },
            ].map((t) => (
              <button
                key={t.key}
                className={`msp-tab ${tab === t.key ? "active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                <i className={`ti ${t.icon}`} style={{ fontSize: "0.9rem" }} />
                {t.label}
                {t.count > 0 && (
                  <span className="msp-tab-badge">{t.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* Contenido de pestaña */}
          {tab === "info" && <TabInfoGeneral d={detalle} />}
          {tab === "evidencias" && (
            <TabEvidencias archivos={detalle.archivos} />
          )}
          {tab === "sla" && <TabSLA d={detalle} />}
          {tab === "comentarios" && (
            <TabComentarios
              d={detalle}
              ticketId={id}
              user={user}
              onNuevoComentario={onNuevoComentario}
            />
          )}

          {/* Barra de acciones inferior */}
          <div className="msp-detail-actions">
            <span className="msp-detail-actions-label">
              ¿Qué deseas hacer con esta solicitud?
            </span>
            <button
              className="msp-btn-action"
              onClick={() => setTab("comentarios")}
            >
              <i className="ti ti-message" style={{ fontSize: "0.88rem" }} />
              Agregar comentario
            </button>
            <button
              className="msp-btn-action"
              onClick={() => setTab("evidencias")}
            >
              <i className="ti ti-paperclip" style={{ fontSize: "0.88rem" }} />
              Adjuntar evidencia
            </button>
            {puedeCancel && (
              <button
                className="msp-btn-action danger"
                onClick={() => onAccionCancelar(id)}
              >
                <i className="ti ti-x" style={{ fontSize: "0.88rem" }} />
                Cancelar solicitud
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PÁGINA PRINCIPAL
   ═══════════════════════════════════════════════════════════════ */

const ESTATUS_OPTS = [
  { value: "", label: "Estado: Todos" },
  { value: 1, label: "Abierto" },
  { value: 2, label: "En proceso" },
  { value: 3, label: "Resuelto" },
  { value: 4, label: "Cerrado" },
  { value: 5, label: "Cancelado" },
];

const PRIORIDAD_OPTS = [
  { value: "", label: "Prioridad: Todas" },
  { value: 1, label: "Crítica" },
  { value: 2, label: "Alta" },
  { value: 3, label: "Media" },
  { value: 4, label: "Baja" },
];

const CATEGORIA_OPTS = [{ value: "", label: "Categoría: Todas" }];

export default function MisSolicitudesPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [kpis, setKpis] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const [buscar, setBuscar] = useState("");
  const [filtroEstatus, setFiltroEstatus] = useState("");
  const [filtroPrioridad, setFiltroPrioridad] = useState("");

  /* KPIs */
  useEffect(() => {
    fetch(`${API}/api/solicitudes-usuario/kpis`, { headers: authH() })
      .then((r) => r.json())
      .then(setKpis)
      .catch(() => {});
  }, []);

  /* Lista */
  const fetchLista = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (filtroEstatus) p.set("estatus", filtroEstatus);
    if (filtroPrioridad) p.set("prioridad", filtroPrioridad);
    if (buscar.trim()) p.set("buscar", buscar.trim());
    try {
      const r = await fetch(`${API}/api/solicitudes-usuario?${p}`, {
        headers: authH(),
      });
      const data = await r.json();
      setSolicitudes(Array.isArray(data) ? data : []);
    } catch {
      setSolicitudes([]);
    } finally {
      setLoading(false);
    }
  }, [filtroEstatus, filtroPrioridad, buscar]);

  useEffect(() => {
    fetchLista();
  }, [fetchLista]);

  function toggleRow(id) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  async function cancelarSolicitud(id) {
    if (!window.confirm("¿Estás seguro de que deseas cancelar esta solicitud?"))
      return;
    try {
      await fetch(`${API}/api/solicitudes-usuario/${id}/cancelar`, {
        method: "PUT",
        headers: authH(),
      });
      fetchLista();
      setExpandedId(null);
    } catch {
      alert("No se pudo cancelar la solicitud.");
    }
  }

  const kpiCards = [
    {
      id: 0,
      label: "Todas mis solicitudes",
      val: kpis?.total ?? "—",
      icon: "ti-layout-list",
      color: "#7c8cf8",
      bg: "rgba(124,140,248,0.12)",
    },
    {
      id: 2,
      label: "En proceso",
      val: kpis?.enProceso ?? "—",
      icon: "ti-loader",
      color: "#7c8cf8",
      bg: "rgba(124,140,248,0.12)",
    },
    {
      id: 1,
      label: "Pendientes",
      val: kpis?.abiertas ?? "—",
      icon: "ti-hourglass",
      color: "#F59E0B",
      bg: "rgba(245,158,11,0.12)",
    },
    {
      id: 3,
      label: "Resueltas",
      val: kpis?.resueltas ?? "—",
      icon: "ti-circle-check",
      color: "#4cc9a6",
      bg: "rgba(76,201,166,0.12)",
    },
    {
      id: 5,
      label: "Canceladas",
      val: kpis?.canceladas ?? "—",
      icon: "ti-circle-x",
      color: "#f38ba8",
      bg: "rgba(243,139,168,0.12)",
    },
  ];

  return (
    <div className="msp-page">
      <div className="msp-inner">
        {/* Breadcrumb */}
        <div className="msp-breadcrumb" onClick={() => navigate("/")}>
          <i className="ti ti-arrow-left" style={{ fontSize: "0.85rem" }} />
          Volver al inicio
        </div>

        {/* Header */}
        <div className="msp-header">
          <h1>Mis solicitudes</h1>
          <p>Consulta el estado y seguimiento de todas tus solicitudes.</p>
        </div>

        {/* KPI strip */}
        <div className="msp-kpi-strip">
          {kpiCards.map((k) => (
            <div
              key={k.id}
              className={`msp-kpi-card ${filtroEstatus == k.id ? "active" : ""}`}
              onClick={() =>
                setFiltroEstatus((prev) => (prev == k.id ? "" : k.id))
              }
            >
              <div className="msp-kpi-icon" style={{ background: k.bg }}>
                <i
                  className={`ti ${k.icon}`}
                  style={{ fontSize: "1.15rem", color: k.color }}
                />
              </div>
              <div className="msp-kpi-info">
                <span className="msp-kpi-num">{k.val}</span>
                <span className="msp-kpi-label">{k.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabla card */}
        <div className="msp-table-card">
          {/* Toolbar */}
          <div className="msp-toolbar">
            <div className="msp-search-wrap">
              <i
                className="ti ti-search msp-search-icon"
                style={{ fontSize: "0.88rem" }}
              />
              <input
                className="msp-search-input"
                placeholder="Buscar por folio, servicio o descripción..."
                value={buscar}
                onChange={(e) => setBuscar(e.target.value)}
              />
            </div>

            <select
              className="msp-filter-select"
              value={filtroEstatus}
              onChange={(e) => setFiltroEstatus(e.target.value)}
            >
              {ESTATUS_OPTS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            <select
              className="msp-filter-select"
              value={filtroPrioridad}
              onChange={(e) => setFiltroPrioridad(e.target.value)}
            >
              {PRIORIDAD_OPTS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            <select className="msp-filter-select">
              {CATEGORIA_OPTS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            <div className="msp-toolbar-spacer" />

            <button className="msp-btn-export">
              <i className="ti ti-download" style={{ fontSize: "0.88rem" }} />
              Exportar
            </button>
          </div>

          {/* Thead */}
          <div className="msp-thead">
            <div className="msp-th" />
            <div className="msp-th" />
            <div className="msp-th">Folio / Servicio</div>
            <div className="msp-th">Categoría</div>
            <div className="msp-th">Prioridad</div>
            <div className="msp-th">Estado</div>
            <div className="msp-th">Fecha de creación</div>
            <div className="msp-th">Última actualización</div>
            <div className="msp-th">SLA restante</div>
            <div className="msp-th" />
          </div>

          {/* Body */}
          <div className="msp-tbody">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="msp-skeleton msp-skeleton-row" />
              ))
            ) : !solicitudes.length ? (
              <div className="msp-empty">
                <div className="msp-empty-icon">
                  <i className="ti ti-inbox" />
                </div>
                <div className="msp-empty-title">
                  {buscar || filtroEstatus || filtroPrioridad
                    ? "No hay resultados para estos filtros"
                    : "No tienes solicitudes aún"}
                </div>
                <div className="msp-empty-sub">
                  {buscar || filtroEstatus || filtroPrioridad
                    ? "Intenta con otros criterios de búsqueda."
                    : "Ve a la Mesa de Servicio para crear tu primera solicitud."}
                </div>
              </div>
            ) : (
              solicitudes.map((s) => {
                const isExpanded = expandedId === s.idSolicitud;
                const resuelto = [3, 4, 5].includes(s.idEstatus);

                return (
                  <div key={s.idSolicitud} className="msp-row-wrap">
                    <div
                      className={`msp-row ${isExpanded ? "expanded" : ""}`}
                      onClick={() => toggleRow(s.idSolicitud)}
                    >
                      {/* Toggle */}
                      <div className="msp-td">
                        <span
                          className={`msp-toggle ${isExpanded ? "open" : ""}`}
                        >
                          <i
                            className="ti ti-chevron-right"
                            style={{ fontSize: "0.85rem" }}
                          />
                        </span>
                      </div>

                      {/* Icono */}
                      <div className="msp-td">
                        <div
                          className="msp-svc-icon"
                          style={{
                            background: `${s.servicioColor || "#7c8cf8"}1a`,
                          }}
                        >
                          <i
                            className={`ti ti-${s.servicioIcono || "ticket"}`}
                            style={{
                              fontSize: "1rem",
                              color: s.servicioColor || "#7c8cf8",
                            }}
                          />
                        </div>
                      </div>

                      {/* Folio / Servicio */}
                      <div className="msp-td">
                        <div className="msp-folio">{s.folio}</div>
                        <div className="msp-svc-name">{s.titulo}</div>
                        <div className="msp-svc-sub">{s.servicio}</div>
                      </div>

                      {/* Categoría */}
                      <div className="msp-td">
                        <span className="msp-fecha">{s.categoria || "—"}</span>
                      </div>

                      {/* Prioridad */}
                      <div className="msp-td">
                        <Chip
                          label={s.prioridadNombre}
                          color={s.prioridadColor}
                        />
                      </div>

                      {/* Estado */}
                      <div className="msp-td">
                        <Chip label={s.estatusNombre} color={s.estatusColor} />
                      </div>

                      {/* Fecha creación */}
                      <div className="msp-td msp-fecha">
                        {fmtFecha(s.fechaCreacion)}
                      </div>

                      {/* Última actualización */}
                      <div className="msp-td msp-fecha">
                        {fmtFecha(s.fechaActualizacion || s.fechaCreacion)}
                      </div>

                      {/* SLA */}
                      <div className="msp-td">
                        <SlaCell
                          fechaLimite={s.fechaLimiteResp}
                          resuelto={resuelto}
                          tiempoAtencionMin={s.tiempoAtencionMin}
                        />
                      </div>

                      {/* Arrow */}
                      <div className="msp-td msp-arrow">
                        <i
                          className="ti ti-chevron-right"
                          style={{ fontSize: "0.88rem" }}
                        />
                      </div>
                    </div>

                    {/* Master / Detail */}
                    {isExpanded && (
                      <DetalleExpandido
                        id={s.idSolicitud}
                        user={user}
                        onAccionCancelar={cancelarSolicitud}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
