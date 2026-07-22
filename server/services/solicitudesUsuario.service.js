const { getPool } = require("../db");
const sql = require("mssql");

async function getMisKpis(login) {
  const pool = await getPool();
  const result = await pool.request().input("login", sql.VarChar, login).query(`
      SELECT
        SUM(CASE WHEN idEstatus = 1 THEN 1 ELSE 0 END) AS abiertas,
        SUM(CASE WHEN idEstatus = 2 THEN 1 ELSE 0 END) AS enProceso,
        SUM(CASE WHEN idEstatus = 3 THEN 1 ELSE 0 END) AS resueltas,
        SUM(CASE WHEN idEstatus = 4 THEN 1 ELSE 0 END) AS cerradas,
        SUM(CASE WHEN idEstatus = 5 THEN 1 ELSE 0 END) AS canceladas,
        COUNT(*) AS total
      FROM solicitudTI
      WHERE idUsuario = @login
    `);
  return result.recordset[0];
}

async function getMisSolicitudes(login, { estatus, prioridad, buscar }) {
  const pool = await getPool();
  const req = pool.request().input("login", sql.VarChar, login);

  let where = "s.idUsuario = @login";

  if (estatus) {
    req.input("estatus", sql.Int, parseInt(estatus));
    where += " AND s.idEstatus = @estatus";
  }
  if (prioridad) {
    req.input("prioridad", sql.Int, parseInt(prioridad));
    where += " AND s.idPrioridad = @prioridad";
  }
  if (buscar) {
    req.input("buscar", sql.NVarChar, `%${buscar}%`);
    where += " AND (s.folio LIKE @buscar OR s.titulo LIKE @buscar)";
  }

  const result = await req.query(`
    SELECT
      s.idSolicitud,
      s.folio,
      s.titulo,
      s.idEstatus,
      e.estatus          AS estatusNombre,
      e.colorHex         AS estatusColor,
      s.idPrioridad,
      p.prioridad        AS prioridadNombre,
      p.colorHex         AS prioridadColor,
      sv.nombre          AS servicio,
      sv.colorPrimario   AS servicioColor,
      sv.icono           AS servicioIcono,
      s.nombreTecnico,
      s.fechaCreacion,
      s.fechaLimiteResp,
      s.fechaLimiteResol,
      s.tiempoAtencionMin,
      (
        SELECT COUNT(*) FROM solicitudTI_comentarios c
        WHERE c.idSolicitud = s.idSolicitud AND c.esInterno = 0
      ) AS totalMensajes
    FROM solicitudTI s
    JOIN cat_estatusTI  e  ON e.idEstatus  = s.idEstatus
    JOIN cat_prioridad  p  ON p.idPrioridad = s.idPrioridad
    JOIN cat_servicioTI sv ON sv.idServicio = s.idServicio
    WHERE ${where}
    ORDER BY s.fechaCreacion DESC
  `);

  return result.recordset;
}

async function getDetalleSolicitud(idSolicitud, login) {
  const pool = await getPool();

  // Verificar ownership
  const check = await pool
    .request()
    .input("id", sql.Int, idSolicitud)
    .input("login", sql.VarChar, login)
    .query(
      `SELECT idSolicitud FROM solicitudTI WHERE idSolicitud = @id AND idUsuario = @login`,
    );

  if (!check.recordset.length) return null;

  // Detalle principal
  const detalle = await pool.request().input("id", sql.Int, idSolicitud).query(`
      SELECT
        s.idSolicitud, s.folio, s.titulo, s.descripcion,
        s.idEstatus,
        e.estatus        AS estatusNombre,
        e.colorHex       AS estatusColor,
        s.idPrioridad,
        p.prioridad      AS prioridadNombre,
        p.colorHex       AS prioridadColor,
        sv.nombre        AS servicio,
        sv.colorPrimario AS servicioColor,
        sv.icono         AS servicioIcono,
        spad.nombre      AS categoria,
        s.tecnicoAsignado,
        s.nombreTecnico,
        s.fechaCreacion,
        s.fechaLimiteResp,
        s.fechaLimiteResol,
        s.fechaResolucion,
        s.tiempoAtencionMin,
        s.slaRespuestaHrs,
        s.slaResolucionHrs,
        s.camposExtra
      FROM solicitudTI s
      JOIN cat_estatusTI  e   ON e.idEstatus   = s.idEstatus
      JOIN cat_prioridad  p   ON p.idPrioridad  = s.idPrioridad
      JOIN cat_servicioTI sv  ON sv.idServicio  = s.idServicio
      LEFT JOIN cat_servicioTI spad ON spad.idServicio = sv.idServicioPadre
      WHERE s.idSolicitud = @id
    `);

  // Comentarios (solo esInterno = 0, o los del técnico esInterno = 1 que son públicos)
  // Mostramos todos excepto los marcados como bitácora interna
  // En este módulo mostramos esInterno = 0 (usuario) y 1 (técnico visible al usuario)
  // La bitácora real está en solicitudTI_bitacora — esa tabla NO se toca aquí
  const comentarios = await pool.request().input("id", sql.Int, idSolicitud)
    .query(`
      SELECT
        idComentario, idUsuario, nombreUsuario,
        esInterno, comentario, fecha
      FROM solicitudTI_comentarios
      WHERE idSolicitud = @id
      ORDER BY fecha ASC
    `);

  // Archivos adjuntos
  const archivos = await pool.request().input("id", sql.Int, idSolicitud)
    .query(`
      SELECT idArchivo, nombreArchivo, rutaServidor, mimeType, tamanoBytes, fechaSubida
      FROM solicitudTI_archivos
      WHERE idSolicitud = @id
      ORDER BY fechaSubida ASC
    `);

  return {
    ...detalle.recordset[0],
    comentarios: comentarios.recordset,
    archivos: archivos.recordset,
  };
}

async function postComentario(idSolicitud, login, nombreUsuario, comentario) {
  const pool = await getPool();

  // Verificar ownership
  const check = await pool
    .request()
    .input("id", sql.Int, idSolicitud)
    .input("login", sql.VarChar, login)
    .query(
      `SELECT idSolicitud FROM solicitudTI WHERE idSolicitud = @id AND idUsuario = @login`,
    );

  if (!check.recordset.length) return null;

  await pool
    .request()
    .input("id", sql.Int, idSolicitud)
    .input("login", sql.VarChar, login)
    .input("nombre", sql.NVarChar, nombreUsuario)
    .input("comentario", sql.NVarChar, comentario).query(`
      INSERT INTO solicitudTI_comentarios
        (idSolicitud, idUsuario, nombreUsuario, esInterno, comentario, fecha)
      VALUES
        (@id, @login, @nombre, 0, @comentario, GETDATE())
    `);

  // Devolver el comentario recién insertado
  const result = await pool
    .request()
    .input("id", sql.Int, idSolicitud)
    .input("login", sql.VarChar, login).query(`
      SELECT TOP 1 idComentario, idUsuario, nombreUsuario, esInterno, comentario, fecha
      FROM solicitudTI_comentarios
      WHERE idSolicitud = @id AND idUsuario = @login
      ORDER BY fecha DESC
    `);

  return result.recordset[0];
}

async function cancelarSolicitud(idSolicitud, login) {
  const pool = await getPool();
  const check = await pool
    .request()
    .input("id", sql.Int, idSolicitud)
    .input("login", sql.VarChar, login)
    .query(
      `SELECT idEstatus FROM solicitudTI WHERE idSolicitud = @id AND idUsuario = @login`,
    );

  if (!check.recordset.length) return { ok: false, error: "No autorizado" };
  if (check.recordset[0].idEstatus !== 1)
    return {
      ok: false,
      error: "Solo se pueden cancelar tickets en estado Abierto",
    };

  await pool
    .request()
    .input("id", sql.Int, idSolicitud)
    .query(
      `UPDATE solicitudTI SET idEstatus = 5, fechaActualizacion = GETDATE() WHERE idSolicitud = @id`,
    );

  return { ok: true };
}

module.exports = {
  getMisKpis,
  getMisSolicitudes,
  getDetalleSolicitud,
  postComentario,
  cancelarSolicitud,
};
