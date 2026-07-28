import { useState, useEffect, useContext, useCallback, useRef } from "react";
import * as XLSX from "xlsx";
import { AuthContext } from "../../../context/AuthContext";
import "./SolicitudPage.css";

const API_BASE =
  window.location.hostname === "192.168.16.198"
    ? "http://192.168.16.198:3002"
    : "http://localhost:3001";

const getToken = () => localStorage.getItem("fabpsa_token");
const apiFetch = async (path, opts = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...opts.headers,
    },
  });
  return res.json();
};

const ESTATUS_MAP = {
  1: { label: "Abierto", bg: "rgba(76,201,166,0.12)", color: "#4cc9a6" },
  2: { label: "En proceso", bg: "rgba(124,140,248,0.12)", color: "#7c8cf8" },
  3: { label: "Resuelto", bg: "rgba(76,201,166,0.12)", color: "#4cc9a6" },
  4: { label: "Cerrado", bg: "rgba(148,163,184,0.12)", color: "#94a3b8" },
  5: { label: "Cancelado", bg: "rgba(243,139,168,0.12)", color: "#f38ba8" },
  6: { label: "Pend. usuario", bg: "rgba(246,193,119,0.12)", color: "#f6c177" },
  7: {
    label: "En diagnóstico",
    bg: "rgba(243,139,168,0.12)",
    color: "#f38ba8",
  },
  8: { label: "Escalado", bg: "rgba(243,139,168,0.15)", color: "#f38ba8" },
};

const SERVICIO_ICONOS = {
  incidente: "ti-alert-triangle",
  falla: "ti-alert-triangle",
  hardware: "ti-device-laptop",
  software: "ti-device-desktop",
  red: "ti-network",
  redes: "ti-network",
  internet: "ti-globe",
  correo: "ti-mail",
  office: "ti-mail",
  acceso: "ti-lock",
  cuenta: "ti-user-circle",
  telefon: "ti-phone",
  impres: "ti-printer",
  seguridad: "ti-shield",
  desarrollo: "ti-code",
  servidor: "ti-server",
  default: "ti-ticket",
};

function getServicioIcono(nombre, iconoBD) {
  if (iconoBD) return iconoBD;
  const n = (nombre ?? "").toLowerCase();
  for (const [key, icon] of Object.entries(SERVICIO_ICONOS)) {
    if (n.includes(key)) return icon;
  }
  return SERVICIO_ICONOS.default;
}

function getSlaInfo(fechaLimite) {
  if (!fechaLimite) return { texto: "—", color: "var(--text-muted)", pct: 0 };
  const diff = new Date(fechaLimite) - new Date();
  const min = Math.floor(diff / 60000);
  const texto =
    min < 0
      ? "Vencida"
      : min < 60
        ? `${min}m`
        : min < 1440
          ? `${Math.floor(min / 60)}h ${min % 60}m`
          : `${Math.floor(min / 1440)}d`;
  const color =
    min < 0
      ? "var(--danger)"
      : min < 60
        ? "var(--danger)"
        : min < 180
          ? "var(--warning)"
          : "var(--success)";
  const pct = Math.min(100, Math.max(0, ((1440 - min) / 1440) * 100));
  return { texto, color, pct, min };
}

function fmtTiempoAtencion(min) {
  if (!min && min !== 0) return "—";
  if (min < 60) return `${min} min`;
  if (min < 1440) return `${Math.floor(min / 60)}h ${min % 60}m`;
  return `${Math.floor(min / 1440)}d ${Math.floor((min % 1440) / 60)}h`;
}

function fmtFecha(f, short = false) {
  if (!f) return "—";
  return new Date(f).toLocaleString(
    "es-MX",
    short
      ? { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }
      : {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
  );
}

function Chip({ idEstatus, label }) {
  const cfg = ESTATUS_MAP[idEstatus] ?? {
    label: label ?? "—",
    bg: "rgba(148,163,184,0.1)",
    color: "var(--text-muted)",
  };
  return (
    <span className="mha-chip" style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  );
}

function KpiCard({ icon, iconBg, iconColor, label, num, delta, deltaColor }) {
  return (
    <div className="mha-kpi">
      <div
        className="mha-kpi-icon"
        style={{ background: iconBg, color: iconColor }}
      >
        <i className={`ti ${icon}`} />
      </div>
      <div className="mha-kpi-text">
        <div className="mha-kpi-label">{label}</div>
        <div className="mha-kpi-num">{num ?? "—"}</div>
        {delta && (
          <div className="mha-kpi-delta" style={{ color: deltaColor }}>
            {delta}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Tab: Info General ─────────────────────────────────────────── */
function TabInfoGeneral({ sol, onRecargar }) {
  const [nota, setNota] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function guardarNota() {
    if (!nota.trim()) return;
    setGuardando(true);
    await apiFetch(`/api/mesa-admin/solicitudes/${sol.idSolicitud}/bitacora`, {
      method: "POST",
      body: JSON.stringify({ nota: nota.trim() }),
    });
    setNota("");
    setGuardando(false);
    onRecargar();
  }

  /* cada vez que sonsultamos la API
  const res = fetch(`${API_BASE}/solicitudes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
*/
  return (
    <div className="mha-det-grid">
      <div className="mha-det-col">
        <div className="mha-det-card">
          <div className="mha-det-card-title">Detalles de la solicitud</div>
          <div className="mha-det-rows">
            {[
              { label: "Folio", val: sol.folio },
              {
                label: "Usuario",
                val: sol.nombreUsuario,
                sub: `${sol.idUsuario?.toLowerCase()}@fabpsa.com.mx`,
              },
              { label: "Departamento", val: sol.areaUsuario },
              { label: "Sitio", val: sol.sitioUsuario },
              { label: "Categoría", val: sol.categoria },
              { label: "Servicio", val: sol.servicio },
              { label: "Prioridad", val: sol.prioridad, color: sol.prioColor },
            ].map((r, i) => (
              <div key={i} className="mha-det-row">
                <span>{r.label}</span>
                <strong style={r.color ? { color: r.color } : {}}>
                  {r.color && "● "}
                  {r.val}
                  {r.sub && <small>{r.sub}</small>}
                </strong>
              </div>
            ))}
            <div className="mha-det-row">
              <span>Estado</span>
              <Chip idEstatus={sol.idEstatus} label={sol.estatus} />
            </div>
          </div>
        </div>
      </div>

      <div className="mha-det-col mha-det-col--wide">
        <div className="mha-det-card">
          <div className="mha-det-card-title">Descripción del incidente</div>
          <p className="mha-det-desc">{sol.descripcion}</p>
          <div className="mha-det-meta">
            <div>
              <i className="ti ti-calendar" />
              <span>Creación</span>
              <strong>{fmtFecha(sol.fechaCreacion, true)}</strong>
            </div>
            <div>
              <i className="ti ti-calendar-check" />
              <span>Actualización</span>
              <strong>{fmtFecha(sol.fechaActualizacion, true)}</strong>
            </div>
            <div>
              <i className="ti ti-user-check" />
              <span>Ingeniero asignado</span>
              <strong>{sol.nombreTecnico ?? "Sin asignar"}</strong>
            </div>
          </div>
        </div>

        <div className="mha-det-card" style={{ marginTop: 10 }}>
          <div className="mha-det-card-title">Bitácora técnica</div>
          {sol.bitacora?.length > 0 && (
            <div className="mha-bitacora-list">
              {sol.bitacora.map((b) => (
                <div key={b.idBitacora} className="mha-bitacora-item">
                  <div className="mha-bitacora-meta">
                    <strong>{b.nombreUsuario}</strong>
                    <span>{fmtFecha(b.fecha, true)}</span>
                  </div>
                  <div className="mha-bitacora-nota">{b.nota}</div>
                </div>
              ))}
            </div>
          )}
          <div className="mha-bitacora-input">
            <textarea
              placeholder="Agregar nota técnica, diagnóstico o avance…"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              rows={2}
            />
            <button
              className="mha-btn-nota"
              disabled={guardando || !nota.trim()}
              onClick={guardarNota}
            >
              <i className="ti ti-plus" /> Agregar nota
            </button>
          </div>
        </div>
      </div>

      <div className="mha-det-col">
        <div className="mha-det-card">
          <div className="mha-det-card-title">Tiempos</div>
          <div className="mha-sla-rows">
            {[
              {
                label: "1ª respuesta comprometida",
                val: fmtFecha(sol.fechaLimiteResp, true),
                color: null,
              },
              {
                label: "Tiempo restante respuesta",
                val: getSlaInfo(sol.fechaLimiteResp).texto,
                color: getSlaInfo(sol.fechaLimiteResp).color,
              },
              {
                label: "Resolución comprometida",
                val: fmtFecha(sol.fechaLimiteResol, true),
                color: null,
              },
              {
                label: "Tiempo restante resolución",
                val: getSlaInfo(sol.fechaLimiteResol).texto,
                color: getSlaInfo(sol.fechaLimiteResol).color,
              },
              {
                label: "Tiempo de atención",
                val: fmtTiempoAtencion(sol.tiempoAtencionMin),
                color: null,
              },
            ].map((r, i) => (
              <div key={i} className="mha-sla-row-item">
                <span>{r.label}</span>
                <strong
                  style={r.color ? { color: r.color, fontWeight: 600 } : {}}
                >
                  {r.val}
                </strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Tab: Evidencias ───────────────────────────────────────────── */
function TabEvidencias({ archivos }) {
  const [preview, setPreview] = useState(null);
  if (!archivos?.length)
    return <div className="mha-empty">Sin evidencias adjuntas.</div>;

  return (
    <div className="mha-evid-wrap">
      <div className="mha-evid-grid">
        {archivos.map((a) => {
          const url = `${API_BASE}/${a.rutaServidor}`;
          const esImg = a.mimeType?.startsWith("image/");
          const esPdf = a.mimeType === "application/pdf";
          return (
            <div
              key={a.idArchivo}
              className="mha-evid-item"
              onClick={() => esImg && setPreview(url)}
              title={a.nombreArchivo}
            >
              <div className="mha-evid-thumb">
                {esImg && (
                  <img
                    src={url}
                    alt={a.nombreArchivo}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
                {esPdf && (
                  <i
                    className="ti ti-file-type-pdf"
                    style={{ fontSize: 32, color: "var(--danger)" }}
                  />
                )}
                {!esImg && !esPdf && (
                  <i
                    className="ti ti-file"
                    style={{ fontSize: 32, color: "var(--text-muted)" }}
                  />
                )}
              </div>
              <div className="mha-evid-name">{a.nombreArchivo}</div>
              <div className="mha-evid-size">
                {(a.tamanoBytes / 1024).toFixed(0)} KB
              </div>
              {!esImg && (
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="mha-evid-dl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <i className="ti ti-download" /> Descargar
                </a>
              )}
            </div>
          );
        })}
      </div>
      {preview && (
        <div className="mha-preview-overlay" onClick={() => setPreview(null)}>
          <div className="mha-preview-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="mha-preview-close"
              onClick={() => setPreview(null)}
            >
              <i className="ti ti-x" />
            </button>
            <img src={preview} alt="preview" />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Tab: SLA ──────────────────────────────────────────────────── */
function TabSLA({ sol }) {
  const resp = getSlaInfo(sol.fechaLimiteResp);
  const resol = getSlaInfo(sol.fechaLimiteResol);
  const r = 36,
    circ = 2 * Math.PI * r;

  function Ring({ info }) {
    const offset = circ - (info.pct / 100) * circ;
    return (
      <div className="mha-sla-ring-wrap">
        <svg width="90" height="90" viewBox="0 0 90 90">
          <circle
            cx="45"
            cy="45"
            r={r}
            fill="none"
            stroke="var(--border)"
            strokeWidth="7"
          />
          <circle
            cx="45"
            cy="45"
            r={r}
            fill="none"
            stroke={info.color}
            strokeWidth="7"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 45 45)"
          />
        </svg>
        <div className="mha-sla-ring-center">
          <span style={{ color: info.color, fontWeight: 600, fontSize: 15 }}>
            {info.texto}
          </span>
          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
            restante
          </span>
        </div>
      </div>
    );
  }

  const estadoLabel = (info) =>
    info.min < 0
      ? "Vencida"
      : info.min < 60
        ? "Crítico"
        : info.min < 180
          ? "En riesgo"
          : "En tiempo";
  const estadoBg = (info) =>
    info.min < 0 || info.min < 60
      ? "rgba(243,139,168,0.12)"
      : info.min < 180
        ? "rgba(246,193,119,0.12)"
        : "rgba(76,201,166,0.12)";

  return (
    <div className="mha-sla-tab">
      {[
        {
          title: "Primera respuesta",
          info: resp,
          fecha: sol.fechaLimiteResp,
          hrs: sol.slaRespuestaHrs,
        },
        {
          title: "Resolución",
          info: resol,
          fecha: sol.fechaLimiteResol,
          hrs: sol.slaResolucionHrs,
        },
      ].map((blk, i) => (
        <div key={i} className="mha-sla-block">
          <div className="mha-sla-block-title">{blk.title}</div>
          <div className="mha-sla-block-inner">
            <Ring info={blk.info} />
            <div className="mha-sla-block-rows">
              <div className="mha-sla-row-item">
                <span>Comprometida</span>
                <strong>{fmtFecha(blk.fecha, true)}</strong>
              </div>
              <div className="mha-sla-row-item">
                <span>Tiempo restante</span>
                <strong style={{ color: blk.info.color, fontWeight: 600 }}>
                  {blk.info.texto}
                </strong>
              </div>
              <div className="mha-sla-row-item">
                <span>SLA</span>
                <strong>{blk.hrs}h</strong>
              </div>
              <div className="mha-sla-row-item">
                <span>Estado</span>
                <span
                  className="mha-chip"
                  style={{
                    background: estadoBg(blk.info),
                    color: blk.info.color,
                  }}
                >
                  {estadoLabel(blk.info)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="mha-sla-block">
        <div className="mha-sla-block-title">Tiempo de atención</div>
        {sol.tiempoAtencionMin != null ? (
          <div className="mha-tac-val">
            {fmtTiempoAtencion(sol.tiempoAtencionMin)}
          </div>
        ) : (
          <div className="mha-tac-nd">
            <span>—</span>
            <small>
              Se calculará automáticamente al marcar como resuelto o cerrado.
            </small>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Tab: Comentarios ──────────────────────────────────────────── */
function TabComentarios({ sol, onNuevoComentario }) {
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sol.comentarios]);

  async function enviar() {
    if (!texto.trim()) return;
    setEnviando(true);
    await apiFetch(
      `/api/mesa-admin/solicitudes/${sol.idSolicitud}/comentarios`,
      {
        method: "POST",
        body: JSON.stringify({ comentario: texto.trim() }),
      },
    );
    setTexto("");
    setEnviando(false);
    onNuevoComentario();
  }

  return (
    <div className="mha-com-wrap">
      <div className="mha-com-list">
        {!sol.comentarios?.length && (
          <div className="mha-empty">Sin comentarios aún.</div>
        )}
        {sol.comentarios?.map((c) => (
          <div
            key={c.idComentario}
            className={`mha-com-item ${c.esInterno ? "mha-com-tec" : "mha-com-usr"}`}
          >
            <div className="mha-com-av">
              {c.nombreUsuario?.substring(0, 2).toUpperCase()}
            </div>
            <div className="mha-com-bubble">
              <div className="mha-com-meta">
                <strong>{c.nombreUsuario}</strong>
                <span className="mha-com-rol">
                  {c.esInterno ? "Ingeniero TI" : "Usuario"}
                </span>
                <span className="mha-com-fecha">{fmtFecha(c.fecha, true)}</span>
              </div>
              <div className="mha-com-text">{c.comentario}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="mha-com-input">
        <textarea
          placeholder="Escribe un comentario…"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              enviar();
            }
          }}
          rows={2}
        />
        <button
          onClick={enviar}
          disabled={enviando || !texto.trim()}
          className="mha-btn-send"
        >
          <i className="ti ti-send" />
        </button>
      </div>
    </div>
  );
}

/* ── Barra de acciones ─────────────────────────────────────────── */
function BarraAcciones({ sol, onAccion }) {
  return (
    <div className="mha-action-bar">
      <span className="mha-action-label">Acciones rápidas</span>
      <button
        className="mha-action-btn mha-action-btn--primary"
        onClick={() => onAccion("asignar", sol)}
      >
        <i className="ti ti-user-plus" /> Asignarme el incidente
      </button>
      <button
        className="mha-action-btn mha-action-btn--outline"
        onClick={() => onAccion("estatus", sol)}
      >
        <i className="ti ti-refresh" /> Cambiar estado{" "}
        <i className="ti ti-chevron-down" />
      </button>
      <button
        className="mha-action-btn mha-action-btn--outline"
        onClick={() => onAccion("prioridad", sol)}
      >
        <i className="ti ti-flag" /> Cambiar prioridad{" "}
        <i className="ti ti-chevron-down" />
      </button>
      <button
        className="mha-action-btn mha-action-btn--outline"
        onClick={() => onAccion("transferir", sol)}
      >
        <i className="ti ti-transfer" /> Transferir incidente{" "}
        <i className="ti ti-chevron-down" />
      </button>
      <button
        className="mha-action-btn mha-action-btn--green"
        onClick={() => onAccion("resolver", sol)}
      >
        <i className="ti ti-circle-check" /> Marcar como resuelto
      </button>
    </div>
  );
}

/* ── Panel expandido ───────────────────────────────────────────── */
function PanelExpandido({ sol, onAccion, onNuevoComentario, onRecargar }) {
  const [tab, setTab] = useState(0);
  const tabs = [
    { label: "Información general" },
    { label: "Evidencias", badge: sol.archivos?.length },
    { label: "Información SLA" },
    { label: "Comentarios", badge: sol.comentarios?.length },
  ];

  return (
    <tr className="mha-expand-row">
      <td colSpan={14}>
        <div className="mha-expand-panel">
          <div className="mha-expand-tabs">
            {tabs.map((t, i) => (
              <button
                key={i}
                className={`mha-expand-tab ${tab === i ? "mha-expand-tab--active" : ""}`}
                onClick={() => setTab(i)}
              >
                {t.label}
                {t.badge > 0 && (
                  <span className="mha-tab-badge">{t.badge}</span>
                )}
              </button>
            ))}
          </div>
          <div className="mha-expand-content">
            {tab === 0 && <TabInfoGeneral sol={sol} onRecargar={onRecargar} />}
            {tab === 1 && <TabEvidencias archivos={sol.archivos} />}
            {tab === 2 && <TabSLA sol={sol} />}
            {tab === 3 && (
              <TabComentarios sol={sol} onNuevoComentario={onNuevoComentario} />
            )}
          </div>
          <BarraAcciones sol={sol} onAccion={onAccion} />
        </div>
      </td>
    </tr>
  );
}

/* ── Modales ───────────────────────────────────────────────────── */
function ModalEstatus({ onConfirm, onClose }) {
  const [sel, setSel] = useState("");
  return (
    <div className="mha-modal-overlay" onClick={onClose}>
      <div className="mha-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mha-modal-head">
          Cambiar estado{" "}
          <button onClick={onClose}>
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="mha-modal-body">
          {Object.entries(ESTATUS_MAP).map(([id, cfg]) => (
            <div
              key={id}
              className={`mha-modal-opt ${sel === id ? "mha-modal-opt--sel" : ""}`}
              onClick={() => setSel(id)}
            >
              <span
                className="mha-chip"
                style={{ background: cfg.bg, color: cfg.color }}
              >
                {cfg.label}
              </span>
            </div>
          ))}
        </div>
        <div className="mha-modal-foot">
          <button className="mha-btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="mha-btn-primary"
            disabled={!sel}
            onClick={() => onConfirm(parseInt(sel))}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalPrioridad({ prioridades, onConfirm, onClose }) {
  const [sel, setSel] = useState(null);
  return (
    <div className="mha-modal-overlay" onClick={onClose}>
      <div className="mha-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mha-modal-head">
          Cambiar prioridad{" "}
          <button onClick={onClose}>
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="mha-modal-body">
          {prioridades.map((p) => (
            <div
              key={p.idPrioridad}
              className={`mha-modal-opt ${sel === p.idPrioridad ? "mha-modal-opt--sel" : ""}`}
              onClick={() => setSel(p.idPrioridad)}
            >
              <span style={{ color: p.colorHex, fontWeight: 500 }}>
                ● {p.prioridad}
              </span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                Resp: {p.slaRespuestaHrs}h · Resol: {p.slaResolucionHrs}h
              </span>
            </div>
          ))}
        </div>
        <div className="mha-modal-foot">
          <button className="mha-btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="mha-btn-primary"
            disabled={!sel}
            onClick={() => onConfirm(sel)}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalTransferir({ tecnicos, onConfirm, onClose }) {
  const [sel, setSel] = useState(null);
  return (
    <div className="mha-modal-overlay" onClick={onClose}>
      <div className="mha-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mha-modal-head">
          Transferir incidente{" "}
          <button onClick={onClose}>
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="mha-modal-body">
          {tecnicos.map((t) => (
            <div
              key={t.login}
              className={`mha-modal-opt ${sel?.login === t.login ? "mha-modal-opt--sel" : ""}`}
              onClick={() => setSel(t)}
            >
              <div className="mha-tec">
                <div className="mha-tec-av">
                  {t.name?.substring(0, 2).toUpperCase()}
                </div>
                {t.name}
              </div>
            </div>
          ))}
        </div>
        <div className="mha-modal-foot">
          <button className="mha-btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="mha-btn-primary"
            disabled={!sel}
            onClick={() => onConfirm(sel)}
          >
            Transferir
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Componente principal ──────────────────────────────────────── */
export default function MesaAyudaAdminPage() {
  const { user } = useContext(AuthContext);
  const [kpis, setKpis] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expandido, setExpandido] = useState(null);
  const [detalles, setDetalles] = useState({});
  const [modal, setModal] = useState(null);
  const [prioridades, setPrioridades] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({
    estatus: "",
    prioridad: "",
    categoria: "",
    tecnico: "",
  });
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const cargarKPIs = useCallback(async () => {
    const res = await apiFetch("/api/mesa-admin/kpis");
    if (res.ok) setKpis(res.data);
  }, []);

  const cargarSolicitudes = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ pagina, porPagina: 10 });
    if (busqueda) params.set("busqueda", busqueda);
    if (fechaDesde) params.set("fechaDesde", fechaDesde);
    if (fechaHasta) params.set("fechaHasta", fechaHasta);
    Object.entries(filtros).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const res = await apiFetch(`/api/mesa-admin/solicitudes?${params}`);
    if (res.ok) {
      setSolicitudes(res.data);
      setTotal(res.total);
    }
    setLoading(false);
  }, [pagina, busqueda, filtros, fechaDesde, fechaHasta]);

  useEffect(() => {
    cargarKPIs();
    apiFetch("/api/mesa-admin/prioridades").then(
      (r) => r.ok && setPrioridades(r.data),
    );
    apiFetch("/api/mesa-admin/tecnicos-sistemas").then(
      (r) => r.ok && setTecnicos(r.data),
    );
  }, []);

  useEffect(() => {
    cargarSolicitudes();
  }, [cargarSolicitudes]);

  async function toggleExpandir(sol) {
    if (expandido === sol.idSolicitud) {
      setExpandido(null);
      return;
    }
    setExpandido(sol.idSolicitud);
    if (!detalles[sol.idSolicitud]) {
      const res = await apiFetch(
        `/api/mesa-admin/solicitudes/${sol.idSolicitud}`,
      );
      if (res.ok) setDetalles((p) => ({ ...p, [sol.idSolicitud]: res.data }));
    }
  }

  async function recargarDetalle(idSolicitud) {
    const res = await apiFetch(`/api/mesa-admin/solicitudes/${idSolicitud}`);
    if (res.ok) setDetalles((p) => ({ ...p, [idSolicitud]: res.data }));
  }

  async function handleAccion(tipo, sol) {
    const id = sol.idSolicitud;
    if (tipo === "asignar") {
      await apiFetch(`/api/mesa-admin/solicitudes/${id}/asignar`, {
        method: "PUT",
      });
      cargarKPIs();
      cargarSolicitudes();
      recargarDetalle(id);
    } else if (tipo === "resolver") {
      await apiFetch(`/api/mesa-admin/solicitudes/${id}/estatus`, {
        method: "PUT",
        body: JSON.stringify({ idEstatus: 3 }),
      });
      cargarKPIs();
      cargarSolicitudes();
      recargarDetalle(id);
    } else {
      setModal({ tipo, sol });
    }
  }
  async function confirmarEstatus(idEstatus) {
    await apiFetch(
      `/api/mesa-admin/solicitudes/${modal.sol.idSolicitud}/estatus`,
      { method: "PUT", body: JSON.stringify({ idEstatus }) },
    );
    setModal(null);
    cargarKPIs();
    cargarSolicitudes();
    recargarDetalle(modal.sol.idSolicitud);
  }

  async function confirmarPrioridad(idPrioridad) {
    await apiFetch(
      `/api/mesa-admin/solicitudes/${modal.sol.idSolicitud}/prioridad`,
      { method: "PUT", body: JSON.stringify({ idPrioridad }) },
    );
    setModal(null);
    cargarSolicitudes();
    recargarDetalle(modal.sol.idSolicitud);
  }

  async function confirmarTransferir(tecnico) {
    await apiFetch(
      `/api/mesa-admin/solicitudes/${modal.sol.idSolicitud}/transferir`,
      {
        method: "PUT",
        body: JSON.stringify({
          tecnicoLogin: tecnico.login,
          nombreTecnico: tecnico.name,
        }),
      },
    );
    setModal(null);
    cargarSolicitudes();
    recargarDetalle(modal.sol.idSolicitud);
  }

  function exportarExcel() {
    const rows = solicitudes.map((s) => ({
      Folio: s.folio,
      Usuario: s.nombreUsuario,
      Email: `${s.idUsuario?.toLowerCase()}@fabpsa.com.mx`,
      Departamento: s.areaUsuario,
      Sitio: s.sitioUsuario,
      Categoría: s.categoria,
      Servicio: s.servicio,
      Prioridad: s.prioridad,
      Estado: s.estatus,
      "Ingeniero asignado": s.nombreTecnico ?? "Sin asignar",
      "SLA restante": getSlaInfo(s.fechaLimiteResp).texto,
      "Tiempo atención": fmtTiempoAtencion(s.tiempoAtencionMin),
      Creación: fmtFecha(s.fechaCreacion),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Solicitudes");
    XLSX.writeFile(
      wb,
      `solicitudes_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  }

  const totalPags = Math.ceil(total / 10);

  return (
    <div className="mha-root">
      {/* KPIs */}
      <div className="mha-kpis">
        <KpiCard
          icon="ti-user-circle"
          iconBg="rgba(76,201,166,0.12)"
          iconColor="var(--primary)"
          label="Solicitudes abiertas"
          num={kpis?.abiertas}
          delta="+12 hoy"
          deltaColor="var(--primary)"
        />
        <KpiCard
          icon="ti-layout-grid"
          iconBg="rgba(124,140,248,0.12)"
          iconColor="var(--secondary)"
          label="En progreso"
          num={kpis?.enProgreso}
          delta="+8 hoy"
          deltaColor="var(--secondary)"
        />
        <KpiCard
          icon="ti-lock-open"
          iconBg="rgba(246,193,119,0.12)"
          iconColor="var(--warning)"
          label="Pendientes por asignar"
          num={kpis?.sinAsignar}
          delta="-5 hoy"
          deltaColor="var(--warning)"
        />
        <KpiCard
          icon="ti-book"
          iconBg="rgba(246,193,119,0.15)"
          iconColor="var(--warning)"
          label="Próximas a vencer (SLA)"
          num={kpis?.proximasVencer}
          delta="En riesgo"
          deltaColor="var(--warning)"
        />
        <KpiCard
          icon="ti-circle-x"
          iconBg="rgba(243,139,168,0.12)"
          iconColor="var(--danger)"
          label="Vencidas"
          num={kpis?.vencidas}
          delta="Atención inmediata"
          deltaColor="var(--danger)"
        />
        <KpiCard
          icon="ti-circle-check"
          iconBg="rgba(76,201,166,0.12)"
          iconColor="var(--success)"
          label="Resueltas hoy"
          num={kpis?.resueltasHoy}
          delta="Excelente trabajo"
          deltaColor="var(--success)"
        />
      </div>

      {/* Filtros */}
      <div className="mha-filters">
        <div className="mha-filter-row">
          {[
            {
              key: "estatus",
              label: "Estado",
              opts: Object.entries(ESTATUS_MAP).map(([id, c]) => ({
                v: id,
                l: c.label,
              })),
            },
            {
              key: "prioridad",
              label: "Prioridad",
              opts: prioridades.map((p) => ({
                v: p.idPrioridad,
                l: p.prioridad,
              })),
            },
            { key: "categoria", label: "Categoría", opts: [] },
            {
              key: "tecnico",
              label: "Ingeniero asignado",
              opts: tecnicos.map((t) => ({ v: t.login, l: t.name })),
            },
          ].map(({ key, label, opts }) => (
            <div key={key} className="mha-filter-item">
              <span className="mha-filter-label">{label}:</span>
              <select
                className="mha-filter-select"
                value={filtros[key]}
                onChange={(e) => {
                  setFiltros((p) => ({ ...p, [key]: e.target.value }));
                  setPagina(1);
                }}
              >
                <option value="">Todos</option>
                {opts.map((o) => (
                  <option key={o.v} value={o.v}>
                    {o.l}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div className="mha-filter-row2">
          <div className="mha-filter-item">
            <i
              className="ti ti-calendar"
              style={{ color: "var(--text-muted)" }}
            />
            <span className="mha-filter-label">Desde:</span>
            <input
              type="date"
              className="mha-filter-select"
              value={fechaDesde}
              onChange={(e) => {
                setFechaDesde(e.target.value);
                setPagina(1);
              }}
            />
          </div>
          <div className="mha-filter-item">
            <span className="mha-filter-label">Hasta:</span>
            <input
              type="date"
              className="mha-filter-select"
              value={fechaHasta}
              onChange={(e) => {
                setFechaHasta(e.target.value);
                setPagina(1);
              }}
            />
          </div>
          {(fechaDesde || fechaHasta) && (
            <button
              className="mha-filter-clear"
              onClick={() => {
                setFechaDesde("");
                setFechaHasta("");
              }}
            >
              <i className="ti ti-x" /> Limpiar fechas
            </button>
          )}
          <div style={{ flex: 1 }} />
          <button className="mha-btn-refresh" onClick={cargarSolicitudes}>
            <i className="ti ti-refresh" /> Actualizar
          </button>
          <button className="mha-btn-export" onClick={exportarExcel}>
            <i className="ti ti-table-export" /> Exportar{" "}
            <i className="ti ti-chevron-down" />
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="mha-table-wrap">
        <table className="mha-table">
          <colgroup>
            <col style={{ width: 28 }} />
            <col style={{ width: 28 }} />
            <col style={{ width: 26 }} />
            <col style={{ width: 26 }} />
            <col style={{ width: 26 }} />
            <col style={{ width: 82 }} />
            <col style={{ width: 130 }} />
            <col style={{ width: 95 }} />
            <col style={{ width: 44 }} />
            <col style={{ width: 100 }} />
            <col style={{ width: 115 }} />
            <col style={{ width: 70 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 120 }} />
            <col style={{ width: 58 }} />
            <col style={{ width: 82 }} />
            <col style={{ width: 80 }} />
          </colgroup>
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th></th>
              <th colSpan={3}></th>
              <th>Folio</th>
              <th>Usuario</th>
              <th>Departamento</th>
              <th>Sitio</th>
              <th>Categoría</th>
              <th>Servicio</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Ingeniero asignado</th>
              <th>SLA restante</th>
              <th>Creación</th>
              <th>Tiempo atención</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={17} className="mha-loading-cell">
                  <i className="ti ti-loader-2" /> Cargando…
                </td>
              </tr>
            )}
            {!loading &&
              solicitudes.map((s) => {
                const { texto: slaTxt, color: slaColor } = getSlaInfo(
                  s.fechaLimiteResp,
                );
                const isExp = expandido === s.idSolicitud;
                const det = detalles[s.idSolicitud];
                const icono = getServicioIcono(s.servicio, s.servicioIcono);

                return [
                  <tr
                    key={s.idSolicitud}
                    className={`mha-tr ${isExp ? "mha-tr--exp" : ""}`}
                    onClick={() => toggleExpandir(s)}
                  >
                    <td onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" />
                    </td>
                    <td>
                      <button
                        className="mha-expand-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpandir(s);
                        }}
                      >
                        <i
                          className={`ti ${isExp ? "ti-chevron-down" : "ti-chevron-right"}`}
                        />
                      </button>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        className="mha-quick-btn"
                        title="Asignarme"
                        onClick={() => handleAccion("asignar", s)}
                      >
                        <i className="ti ti-user-plus" />
                      </button>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        className="mha-quick-btn"
                        title="Cambiar estado"
                        onClick={() => setModal({ tipo: "estatus", sol: s })}
                      >
                        <i className="ti ti-refresh" />
                      </button>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        className="mha-quick-btn mha-quick-btn--green"
                        title="Marcar resuelto"
                        onClick={() => handleAccion("resolver", s)}
                      >
                        <i className="ti ti-circle-check" />
                      </button>
                    </td>
                    <td className="mha-folio">{s.folio}</td>
                    <td>
                      <span className="mha-uname">{s.nombreUsuario}</span>
                      <span className="mha-uemail">
                        {s.idUsuario?.toLowerCase()}@fabpsa.com
                      </span>
                    </td>
                    <td className="mha-dep">{s.areaUsuario ?? "—"}</td>
                    <td className="mha-sitio">{s.sitioUsuario ?? "—"}</td>
                    <td className="mha-cat">{s.categoria ?? "General TI"}</td>
                    <td>
                      <div className="mha-servicio">
                        <i className={`ti ${icono}`} />
                        <span>{s.servicio ?? "—"}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          color: s.prioColor,
                          fontWeight: 500,
                          fontSize: 12,
                        }}
                      >
                        ● {s.prioridad}
                      </span>
                    </td>
                    <td>
                      <Chip idEstatus={s.idEstatus} label={s.estatus} />
                    </td>
                    <td>
                      {s.nombreTecnico ? (
                        <div className="mha-tec">
                          <div className="mha-tec-av">
                            {s.nombreTecnico.substring(0, 2).toUpperCase()}
                          </div>
                          {s.nombreTecnico}
                        </div>
                      ) : (
                        <span className="mha-no-asign">Sin asignar</span>
                      )}
                    </td>
                    <td
                      style={{ color: slaColor, fontWeight: 600, fontSize: 12 }}
                    >
                      {slaTxt}
                    </td>
                    <td className="mha-fecha">
                      {fmtFecha(s.fechaCreacion, true)}
                    </td>
                    <td className="mha-fecha">
                      {fmtTiempoAtencion(s.tiempoAtencionMin)}
                    </td>
                  </tr>,
                  isExp && det && (
                    <PanelExpandido
                      key={`exp-${s.idSolicitud}`}
                      sol={det}
                      onAccion={(tipo) => handleAccion(tipo, s)}
                      onNuevoComentario={() => recargarDetalle(s.idSolicitud)}
                      onRecargar={() => recargarDetalle(s.idSolicitud)}
                    />
                  ),
                ];
              })}
            {!loading && !solicitudes.length && (
              <tr>
                <td colSpan={17} className="mha-loading-cell">
                  No hay solicitudes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mha-pager">
        <span className="mha-pager-info">
          Mostrando 1 a {Math.min(pagina * 10, total)} de {total} resultados
        </span>
        <div className="mha-pager-btns">
          <button
            className="mha-pn"
            disabled={pagina === 1}
            onClick={() => setPagina((p) => p - 1)}
          >
            <i className="ti ti-chevron-left" />
          </button>
          {Array.from({ length: Math.min(5, totalPags) }, (_, i) => i + 1).map(
            (n) => (
              <button
                key={n}
                className={`mha-pn ${pagina === n ? "mha-pn--act" : ""}`}
                onClick={() => setPagina(n)}
              >
                {n}
              </button>
            ),
          )}
          {totalPags > 5 && (
            <>
              <span className="mha-pn">…</span>
              <button className="mha-pn" onClick={() => setPagina(totalPags)}>
                {totalPags}
              </button>
            </>
          )}
          <button
            className="mha-pn"
            disabled={pagina >= totalPags}
            onClick={() => setPagina((p) => p + 1)}
          >
            <i className="ti ti-chevron-right" />
          </button>
        </div>
        <div className="mha-filter-item">
          <select className="mha-filter-select">
            <option>10 / página</option>
          </select>
        </div>
      </div>

      {/* Modales */}
      {modal?.tipo === "estatus" && (
        <ModalEstatus
          onConfirm={confirmarEstatus}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.tipo === "prioridad" && (
        <ModalPrioridad
          prioridades={prioridades}
          onConfirm={confirmarPrioridad}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.tipo === "transferir" && (
        <ModalTransferir
          tecnicos={tecnicos}
          onConfirm={confirmarTransferir}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
