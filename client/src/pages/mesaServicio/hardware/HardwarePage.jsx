import { useState, useEffect, useContext } from "react";
import {
  getCatalogo,
  enviarSolicitud,
} from "../../../services/hardwareService";
import { AuthContext } from "../../../context/AuthContext";
import "./MesaDeServicioPage.css";
//import { MOTIVOS, ICON_MAP } from "../../../data/staticData.js";

export const MOTIVOS = [
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
};

function getIcon(nombre) {
  const n = nombre.toLowerCase();
  for (const key of Object.keys(ICON_MAP)) {
    if (n.includes(key)) return ICON_MAP[key];
  }
  return ICON_MAP.default;
}

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const g = item[key] || "General";
    if (!acc[g]) acc[g] = [];
    acc[g].push(item);
    return acc;
  }, {});
}

export default function HardwarePage() {
  const { user } = useContext(AuthContext);

  const [step, setStep] = useState(1);
  const [catalogo, setCatalogo] = useState([]);
  const [loadingCatalogo, setLoadingCatalogo] = useState(true);
  const [errorCatalogo, setErrorCatalogo] = useState(null);

  const [seleccionados, setSeleccionados] = useState({});
  const [catFiltro, setCatFiltro] = useState("Todos");
  const [motivo, setMotivo] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [fase, setFase] = useState("wizard"); // wizard | processing | success
  const [procStep, setProcStep] = useState(0);
  const [folio, setFolio] = useState("");
  const [errorEnvio, setErrorEnvio] = useState(null);

  const PROC_STEPS = [
    "Validando información",
    "Guardando solicitud",
    "Generando folio",
    "Notificando al equipo de TI",
    "Solicitud registrada",
  ];

  useEffect(() => {
    getCatalogo()
      .then(setCatalogo)
      .catch(() => setErrorCatalogo("No se pudo cargar el catálogo."))
      .finally(() => setLoadingCatalogo(false));
  }, []);

  const categorias = ["Todos", ...Object.keys(groupBy(catalogo, "categoria"))];
  const catalogoFiltrado =
    catFiltro === "Todos"
      ? catalogo
      : catalogo.filter((a) => a.categoria === catFiltro);
  const grupos = groupBy(catalogoFiltrado, "categoria");

  const totalSeleccionados =
    Object.values(seleccionados).filter(Boolean).length;

  function toggleArticulo(art) {
    setSeleccionados((prev) => ({
      ...prev,
      [art.idArticulo]: prev[art.idArticulo] ? null : { ...art, cantidad: 1 },
    }));
  }

  function setCantidad(id, val) {
    setSeleccionados((prev) => ({
      ...prev,
      [id]: prev[id] ? { ...prev[id], cantidad: Math.max(1, val) } : prev[id],
    }));
  }

  const articulosSeleccionados = Object.values(seleccionados).filter(Boolean);

  async function handleEnviar() {
    setFase("processing");
    setProcStep(0);
    setErrorEnvio(null);

    // Simular pasos visuales
    for (let i = 0; i < PROC_STEPS.length - 1; i++) {
      await delay(420);
      setProcStep(i + 1);
    }

    try {
      const payload = {
        motivo,
        observaciones,
        articulos: articulosSeleccionados.map((a) => ({
          idArticulo: a.idArticulo,
          cantidad: a.cantidad,
        })),
      };
      const res = await enviarSolicitud(payload);
      setFolio(res.folio);
      await delay(300);
      setProcStep(PROC_STEPS.length);
      await delay(500);
      setFase("success");
    } catch {
      setErrorEnvio(
        "Ocurrió un error al registrar la solicitud. Intenta de nuevo.",
      );
      setFase("wizard");
      setStep(3);
    }
  }

  function delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function resetWizard() {
    setStep(1);
    setSeleccionados({});
    setMotivo(MOTIVOS[0]);
    setObservaciones("");
    setFase("wizard");
    setProcStep(0);
    setFolio("");
  }

  // ── RENDER ──────────────────────────────────────────────

  if (fase === "processing")
    return (
      <div className="hw-wrapper">
        <div className="hw-wz">
          <div className="hw-processing">
            <div className="hw-proc-ring" />
            <ul className="hw-proc-list">
              {PROC_STEPS.map((label, i) => (
                <li
                  key={i}
                  className={`hw-proc-item ${i < procStep ? "done" : i === procStep ? "active" : ""}`}
                >
                  <span className="hw-proc-icon">
                    {i < procStep ? (
                      <i className="ti ti-check" aria-hidden="true" />
                    ) : i === procStep ? (
                      <span className="hw-proc-dot" />
                    ) : (
                      <span className="hw-proc-dot faint" />
                    )}
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );

  if (fase === "success")
    return (
      <div className="hw-wz">
        <div className="hw-success">
          <div className="hw-success-icon">
            <i className="ti ti-check" aria-hidden="true" />
          </div>
          <h2 className="hw-success-title">Solicitud enviada correctamente</h2>
          <p className="hw-success-sub">
            El equipo de Tecnologías de la Información ya fue notificado y dará
            seguimiento a tu requerimiento.
          </p>
          <div className="hw-folio-box">
            <div className="hw-folio-label">Folio de seguimiento</div>
            <div className="hw-folio-val">{folio}</div>
          </div>
          <p className="hw-success-hint">
            Guarda este folio para cualquier seguimiento con el equipo de TI.
          </p>
          <button className="hw-btn hw-btn-primary" onClick={resetWizard}>
            Nueva solicitud
          </button>
        </div>
      </div>
    );

  return (
    <div className="hw-wz">
      {/* Header */}
      <div className="hw-head">
        <div className="hw-eyebrow">Mesa de Servicio · Hardware</div>
        <h1 className="hw-title">
          {step === 1 && "Selecciona los artículos"}
          {step === 2 && "Agrega el detalle"}
          {step === 3 && "Confirma tu solicitud"}
        </h1>
      </div>

      {/* Stepper */}
      <div className="hw-stepper">
        {[1, 2, 3].map((n, idx) => (
          <div key={n} style={{ display: "contents" }}>
            <div
              className={`hw-step ${step === n ? "active" : step > n ? "done" : ""}`}
            >
              <div className="hw-step-circle">
                {step > n ? (
                  <i className="ti ti-check" aria-hidden="true" />
                ) : (
                  n
                )}
              </div>
              <span className="hw-step-label">
                {["Artículos", "Detalle", "Confirmación"][idx]}
              </span>
            </div>
            {idx < 2 && (
              <div className={`hw-connector ${step > n ? "filled" : ""}`}>
                <div className="hw-connector-fill" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── PASO 1: Catálogo ── */}
      {step === 1 && (
        <>
          <div className="hw-body hw-body-split">
            <div className="hw-catalog">
              {loadingCatalogo && (
                <p className="hw-hint">Cargando catálogo...</p>
              )}
              {errorCatalogo && <p className="hw-error">{errorCatalogo}</p>}
              {!loadingCatalogo && !errorCatalogo && (
                <>
                  <div className="hw-cat-filter">
                    {categorias.map((c) => (
                      <button
                        key={c}
                        className={`hw-chip ${catFiltro === c ? "on" : ""}`}
                        onClick={() => setCatFiltro(c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  {Object.entries(grupos).map(([cat, items]) => (
                    <div key={cat} className="hw-group">
                      <div className="hw-group-label">{cat}</div>
                      <div className="hw-grid">
                        {items.map((art) => {
                          const sel = !!seleccionados[art.idArticulo];
                          return (
                            <div
                              key={art.idArticulo}
                              className={`hw-card ${sel ? "selected" : ""}`}
                              onClick={() => toggleArticulo(art)}
                              role="checkbox"
                              aria-checked={sel}
                              tabIndex={0}
                              onKeyDown={(e) =>
                                e.key === "Enter" && toggleArticulo(art)
                              }
                            >
                              {sel && (
                                <div className="hw-check">
                                  <i
                                    className="ti ti-check"
                                    aria-hidden="true"
                                  />
                                </div>
                              )}
                              {art.requiereAutorizacion === "S" && (
                                <div
                                  className="hw-auth-badge"
                                  title="Requiere autorización"
                                >
                                  <i
                                    className="ti ti-shield-check"
                                    aria-hidden="true"
                                  />
                                </div>
                              )}
                              <div className="hw-card-icon">
                                <i
                                  className={`ti ${getIcon(art.nombreArticulo)}`}
                                  aria-hidden="true"
                                />
                              </div>
                              <div className="hw-card-name">
                                {art.nombreArticulo}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Carrito */}
            <aside className="hw-cart">
              <div className="hw-cart-head">
                <div className="hw-cart-icon">
                  <i className="ti ti-shopping-cart" aria-hidden="true" />
                </div>
                <span className="hw-cart-title">Seleccionados</span>
                <span className="hw-cart-count">{totalSeleccionados}</span>
              </div>
              {articulosSeleccionados.length === 0 ? (
                <p className="hw-cart-empty">Ningún artículo seleccionado</p>
              ) : (
                articulosSeleccionados.map((art) => (
                  <div key={art.idArticulo} className="hw-cart-item">
                    <div>
                      <div className="hw-cart-name">{art.nombreArticulo}</div>
                      {art.requiereAutorizacion === "S" && (
                        <div className="hw-cart-auth">
                          <i
                            className="ti ti-shield-check"
                            aria-hidden="true"
                          />{" "}
                          Requiere autorización
                        </div>
                      )}
                    </div>
                    <div className="hw-qty-ctrl">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCantidad(art.idArticulo, art.cantidad - 1);
                        }}
                      >
                        −
                      </button>
                      <span>{art.cantidad}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCantidad(art.idArticulo, art.cantidad + 1);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </aside>
          </div>
          <div className="hw-foot">
            <span className="hw-hint">
              {totalSeleccionados} artículo{totalSeleccionados !== 1 ? "s" : ""}{" "}
              seleccionado{totalSeleccionados !== 1 ? "s" : ""}
            </span>
            <button
              className="hw-btn hw-btn-primary"
              onClick={() => setStep(2)}
              disabled={totalSeleccionados === 0}
            >
              Continuar <i className="ti ti-arrow-right" aria-hidden="true" />
            </button>
          </div>
        </>
      )}

      {/* ── PASO 2: Detalle ── */}
      {step === 2 && (
        <>
          <div className="hw-body">
            <div className="hw-field-group">
              <div className="hw-field">
                <label className="hw-label">Motivo de la solicitud</label>
                <select
                  className="hw-select"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Selecciona por favor...
                  </option>
                  {MOTIVOS.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="hw-field">
                <label className="hw-label">
                  Observaciones <span className="hw-label-opt">(opcional)</span>
                </label>
                <textarea
                  className="hw-textarea"
                  placeholder="Especifica detalles adicionales, urgencia u otra información relevante"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="hw-foot">
            <button className="hw-btn hw-btn-ghost" onClick={() => setStep(1)}>
              <i className="ti ti-arrow-left" aria-hidden="true" /> Atrás
            </button>
            <button
              className="hw-btn hw-btn-primary"
              onClick={() => setStep(3)}
            >
              Continuar <i className="ti ti-arrow-right" aria-hidden="true" />
            </button>
          </div>
        </>
      )}

      {/* ── PASO 3: Confirmación ── */}
      {step === 3 && (
        <>
          <div className="hw-body">
            {errorEnvio && (
              <p className="hw-error" style={{ marginBottom: "12px" }}>
                {errorEnvio}
              </p>
            )}
            <div className="hw-summary">
              <div className="hw-summary-row">
                <span className="hw-summary-label">Solicitante</span>
                <span className="hw-summary-val">
                  {user?.name || user?.login}
                </span>
              </div>
              <div className="hw-summary-row">
                <span className="hw-summary-label">Área</span>
                <span className="hw-summary-val">
                  {user?.area || user?.sitio || "—"}
                </span>
              </div>
              <div className="hw-summary-row">
                <span className="hw-summary-label">Motivo</span>
                <span className="hw-summary-val">{motivo}</span>
              </div>
              {observaciones && (
                <div className="hw-summary-row">
                  <span className="hw-summary-label">Observaciones</span>
                  <span className="hw-summary-val">{observaciones}</span>
                </div>
              )}
              <div className="hw-summary-row hw-summary-art">
                <span className="hw-summary-label">Artículos</span>
                <div className="hw-summary-art-list">
                  {articulosSeleccionados.map((a) => (
                    <div key={a.idArticulo} className="hw-summary-art-item">
                      <span>{a.nombreArticulo}</span>
                      <span className="hw-summary-qty">×{a.cantidad}</span>
                      {a.requiereAutorizacion === "S" && (
                        <span className="hw-summary-req">
                          Requiere autorización
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="hw-foot">
            <button className="hw-btn hw-btn-ghost" onClick={() => setStep(2)}>
              <i className="ti ti-arrow-left" aria-hidden="true" /> Atrás
            </button>
            <button className="hw-btn hw-btn-primary" onClick={handleEnviar}>
              <i className="ti ti-send" aria-hidden="true" /> Enviar solicitud
            </button>
          </div>
        </>
      )}
    </div>
  );
}
