const {
  crearSolicitud,
  obtenerSolicitudesUsuario,
} = require("../services/solicitudes.service");
const { enviarCorreoSolicitudTI } = require("../services/mailer.js");
const { getPool } = require("../db");

async function postSolicitud(req, res) {
  try {
    const { slug, titulo, descripcion, idPrioridad } = req.body;
    const user = req.user; // viene del middleware verifyToken

    if (!slug || !titulo?.trim()) {
      return res
        .status(400)
        .json({ ok: false, message: "slug y titulo son requeridos" });
    }

    // Obtener idServicio y nombre del servicio desde el slug
    const pool = await getPool();
    const svcRes = await pool.request().input("slug", slug).query(`
        SELECT idServicio, nombre, tipo, idPrioridadDefault,
               formTitulo, colorPrimario
        FROM cat_servicioTI
        WHERE slug = @slug AND activo = 1
      `);

    if (!svcRes.recordset.length) {
      return res
        .status(404)
        .json({ ok: false, message: "Servicio no encontrado" });
    }

    const svc = svcRes.recordset[0];
    const prioFinal = idPrioridad ?? svc.idPrioridadDefault;

    if (!prioFinal) {
      return res
        .status(400)
        .json({ ok: false, message: "No se pudo determinar la prioridad" });
    }

    // Crear solicitud en DB
    const resultado = await crearSolicitud({
      idServicio: svc.idServicio,
      idPrioridad: prioFinal,
      titulo: titulo.trim(),
      descripcion: descripcion?.trim() ?? "",
      idUsuario: user.login,
      nombreUsuario: user.name ?? user.username ?? "Usuario",
      areaUsuario: user.area ?? "",
      sitioUsuario: user.sitio ?? "",
    });

    // Enviar correos (no bloqueante — si falla el email, la solicitud ya está guardada)
    enviarCorreoSolicitudTI({
      folio: resultado.folio,
      fecha: resultado.fechaCreacion,
      titulo: titulo.trim(),
      descripcion: descripcion?.trim() ?? "",
      servicio: svc.nombre,
      prioridad: resultado.prioridad,
      colorPrioridad: resultado.colorHex,
      slaRespuestaHrs: resultado.slaRespuestaHrs,
      slaResolucionHrs: resultado.slaResolucionHrs,
      fechaLimiteResp: resultado.fechaLimiteResp,
      fechaLimiteResol: resultado.fechaLimiteResol,
      solicitante: user.name ?? user.username ?? "Usuario",
      area: user.area ?? "",
      sitio: user.sitio ?? "",
      correoSolicitante: user.email ?? null,
      tieneEvidencia: false,
    }).catch((err) => console.error("[mailer] solicitudTI:", err.message));

    return res.json({
      ok: true,
      folio: resultado.folio,
      idSolicitud: resultado.idSolicitud,
      slaRespuestaHrs: resultado.slaRespuestaHrs,
      slaResolucionHrs: resultado.slaResolucionHrs,
      fechaLimiteResp: resultado.fechaLimiteResp,
      fechaLimiteResol: resultado.fechaLimiteResol,
      prioridad: resultado.prioridad,
    });
  } catch (err) {
    console.error("[solicitudes] POST:", err);
    res
      .status(500)
      .json({ ok: false, message: err.message ?? "Error interno" });
  }
}

async function getMisSolicitudes(req, res) {
  try {
    const data = await obtenerSolicitudesUsuario(req.user.login);
    res.json({ ok: true, data });
  } catch (err) {
    console.error("[solicitudes] GET mis:", err);
    res
      .status(500)
      .json({ ok: false, message: "Error al obtener solicitudes" });
  }
}

module.exports = { postSolicitud, getMisSolicitudes };
