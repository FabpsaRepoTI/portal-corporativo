const { getPool, sql } = require("../db");

async function getKPIs() {
  const pool = await getPool();
  const res = await pool.request().query(`
    SELECT
      SUM(CASE WHEN idEstatus = 1 THEN 1 ELSE 0 END) AS abiertas,
      SUM(CASE WHEN idEstatus = 2 THEN 1 ELSE 0 END) AS enProgreso,
      SUM(CASE WHEN tecnicoAsignado IS NULL AND idEstatus NOT IN (3,4,5) THEN 1 ELSE 0 END) AS sinAsignar,
      SUM(CASE WHEN fechaLimiteResp < DATEADD(HOUR,2,GETDATE()) AND idEstatus NOT IN (3,4,5) THEN 1 ELSE 0 END) AS proximasVencer,
      SUM(CASE WHEN fechaLimiteResp < GETDATE() AND idEstatus NOT IN (3,4,5) THEN 1 ELSE 0 END) AS vencidas,
      SUM(CASE WHEN idEstatus = 3 AND CAST(fechaResolucion AS DATE) = CAST(GETDATE() AS DATE) THEN 1 ELSE 0 END) AS resueltasHoy
    FROM solicitudTI
  `);
  return res.recordset[0];
}

async function getSolicitudes({
  estatus,
  prioridad,
  categoria,
  tecnico,
  busqueda,
  fechaDesde,
  fechaHasta,
  pagina = 1,
  porPagina = 10,
}) {
  const pool = await getPool();
  const r = pool.request();
  const offset = (pagina - 1) * porPagina;
  let where = "WHERE 1=1";

  if (estatus) {
    r.input("estatus", estatus);
    where += " AND s.idEstatus = @estatus";
  }
  if (prioridad) {
    r.input("prioridad", prioridad);
    where += " AND s.idPrioridad = @prioridad";
  }
  if (categoria) {
    r.input("categoria", categoria);
    where += " AND sv.idServicio = @categoria";
  }
  if (tecnico) {
    r.input("tecnico", tecnico);
    where += " AND s.tecnicoAsignado = @tecnico";
  }
  if (busqueda) {
    r.input("busqueda", `%${busqueda}%`);
    where +=
      " AND (s.folio LIKE @busqueda OR s.nombreUsuario LIKE @busqueda OR s.titulo LIKE @busqueda)";
  }
  if (fechaDesde) {
    r.input("fechaDesde", fechaDesde);
    where += " AND CAST(s.fechaCreacion AS DATE) >= @fechaDesde";
  }
  if (fechaHasta) {
    r.input("fechaHasta", fechaHasta);
    where += " AND CAST(s.fechaCreacion AS DATE) <= @fechaHasta";
  }

  r.input("offset", offset).input("porPagina", porPagina);

  const res = await r.query(`
    SELECT
      s.idSolicitud, s.folio, s.titulo, s.descripcion,
      s.idUsuario, s.nombreUsuario, s.areaUsuario, s.sitioUsuario,
      s.tecnicoAsignado, s.nombreTecnico,
      s.slaRespuestaHrs, s.slaResolucionHrs,
      s.fechaLimiteResp, s.fechaLimiteResol,
      s.fechaCreacion, s.fechaActualizacion, s.fechaResolucion,
      s.tiempoAtencionMin, s.escalaA,
      e.idEstatus, e.estatus,
      sv.idServicio, sv.nombre AS servicio, sv.icono AS servicioIcono,
      ISNULL(svp.nombre, 'General TI') AS categoria,
      p.idPrioridad, p.prioridad, p.colorHex AS prioColor,
      COUNT(*) OVER() AS totalRegistros
    FROM solicitudTI s
    JOIN cat_estatusTI  e    ON e.idEstatus   = s.idEstatus
    JOIN cat_servicioTI sv   ON sv.idServicio  = s.idServicio
    LEFT JOIN cat_servicioTI svp ON svp.idServicio = sv.idServicioPadre
    JOIN cat_prioridad  p    ON p.idPrioridad  = s.idPrioridad
    ${where}
    ORDER BY s.fechaCreacion DESC
    OFFSET @offset ROWS FETCH NEXT @porPagina ROWS ONLY
  `);

  return {
    data: res.recordset,
    total: res.recordset[0]?.totalRegistros ?? 0,
    pagina,
    porPagina,
  };
}

async function getSolicitudDetalle(idSolicitud) {
  const pool = await getPool();

  const solRes = await pool.request().input("idSolicitud", idSolicitud).query(`
    SELECT
      s.idSolicitud, s.folio, s.titulo, s.descripcion,
      s.idUsuario, s.nombreUsuario, s.areaUsuario, s.sitioUsuario,
      s.tecnicoAsignado, s.nombreTecnico,
      s.slaRespuestaHrs, s.slaResolucionHrs,
      s.fechaLimiteResp, s.fechaLimiteResol,
      s.fechaCreacion, s.fechaActualizacion, s.fechaResolucion,
      s.tiempoAtencionMin, s.escalaA,
      e.idEstatus, e.estatus,
      sv.idServicio, sv.nombre AS servicio, sv.icono AS servicioIcono,
      ISNULL(svp.nombre, 'General TI') AS categoria,
      p.idPrioridad, p.prioridad, p.colorHex AS prioColor
    FROM solicitudTI s
    JOIN cat_estatusTI  e    ON e.idEstatus   = s.idEstatus
    JOIN cat_servicioTI sv   ON sv.idServicio  = s.idServicio
    LEFT JOIN cat_servicioTI svp ON svp.idServicio = sv.idServicioPadre
    JOIN cat_prioridad  p    ON p.idPrioridad  = s.idPrioridad
    WHERE s.idSolicitud = @idSolicitud
  `);

  if (!solRes.recordset.length) return null;

  const archRes = await pool.request().input("idSolicitud", idSolicitud).query(`
    SELECT idArchivo, nombreArchivo, rutaServidor, mimeType, tamanoBytes, fechaSubida
    FROM solicitudTI_archivos WHERE idSolicitud = @idSolicitud ORDER BY fechaSubida
  `);

  const comRes = await pool.request().input("idSolicitud", idSolicitud).query(`
    SELECT idComentario, idUsuario, nombreUsuario, esInterno, comentario, fecha
    FROM solicitudTI_comentarios WHERE idSolicitud = @idSolicitud ORDER BY fecha ASC
  `);

  const bitRes = await pool.request().input("idSolicitud", idSolicitud).query(`
    SELECT idBitacora, idUsuario, nombreUsuario, nota, fecha
    FROM solicitudTI_bitacora WHERE idSolicitud = @idSolicitud ORDER BY fecha ASC
  `);

  const evalRes = await pool.request().input("idSolicitud", idSolicitud).query(`
  SELECT TOP 1
    calificacion,
    comentario,
    fechaRegistro AS fecha
  FROM solicitudTI_evaluacion
  WHERE idSolicitud = @idSolicitud
  ORDER BY fechaRegistro DESC
`);

  const ev = evalRes.recordset[0];
  return {
    ...solRes.recordset[0],
    archivos: archRes.recordset,
    comentarios: comRes.recordset,
    bitacora: bitRes.recordset,
    evaluacion: ev
      ? {
          estrellas: ev.calificacion,
          comentario: ev.comentario,
          fecha: ev.fecha,
        }
      : null,
  };
}

async function asignar(idSolicitud, tecnicoLogin, nombreTecnico) {
  const pool = await getPool();
  await pool
    .request()
    .input("idSolicitud", idSolicitud)
    .input("tecnicoAsignado", tecnicoLogin)
    .input("nombreTecnico", nombreTecnico).query(`
      UPDATE solicitudTI
      SET tecnicoAsignado    = @tecnicoAsignado,
          nombreTecnico      = @nombreTecnico,
          idEstatus          = CASE WHEN idEstatus = 1 THEN 2 ELSE idEstatus END,
          fechaActualizacion = GETDATE()
      WHERE idSolicitud = @idSolicitud
    `);
}

// ── MODIFICADO: valida asignación antes de permitir Resuelto ──
async function cambiarEstatus(idSolicitud, idEstatus, loginSolicitante) {
  const pool = await getPool();

  // Si se intenta marcar como Resuelto (3), verificar que esté asignado
  // al ingeniero que hace la acción
  if (idEstatus === 3) {
    const check = await pool
      .request()
      .input("id", sql.Int, idSolicitud)
      .query(`SELECT tecnicoAsignado FROM solicitudTI WHERE idSolicitud = @id`);

    const row = check.recordset[0];

    if (!row) throw new Error("Solicitud no encontrada");

    // Sin asignar
    if (!row.tecnicoAsignado) {
      return {
        ok: false,
        code: "SIN_ASIGNAR",
        message: "Debes asignarte el ticket antes de marcarlo como resuelto.",
      };
    }

    // Asignado a otro ingeniero
    if (loginSolicitante && row.tecnicoAsignado !== loginSolicitante) {
      return {
        ok: false,
        code: "NO_ASIGNADO",
        message: `Este ticket está asignado a otro ingeniero. Transfíerelo primero o solicita que te lo asignen.`,
      };
    }
  }

  await pool
    .request()
    .input("idSolicitud", idSolicitud)
    .input("idEstatus", idEstatus).query(`
      UPDATE solicitudTI
      SET idEstatus          = @idEstatus,
          fechaResolucion    = CASE WHEN @idEstatus IN (3,4) THEN GETDATE() ELSE fechaResolucion END,
          tiempoAtencionMin  = CASE WHEN @idEstatus IN (3,4) THEN DATEDIFF(MINUTE, fechaCreacion, GETDATE()) ELSE tiempoAtencionMin END,
          fechaActualizacion = GETDATE()
      WHERE idSolicitud = @idSolicitud
    `);

  return { ok: true };
}

// ── NUEVO: escalar solicitud ────────────────────────────────────
async function escalar(
  idSolicitud,
  escalaA,
  comentario,
  loginUsuario,
  nombreUsuario,
) {
  const pool = await getPool();

  // Actualizar estatus a Escalado (8) y guardar a quién se escala
  await pool
    .request()
    .input("idSolicitud", sql.Int, idSolicitud)
    .input("escalaA", sql.NVarChar(200), escalaA).query(`
      UPDATE solicitudTI
      SET idEstatus          = 8,
          escalaA            = @escalaA,
          fechaActualizacion = GETDATE()
      WHERE idSolicitud = @idSolicitud
    `);

  // Registrar en bitácora automáticamente
  const notaBitacora = comentario?.trim()
    ? `Escalado a ${escalaA}. Motivo: ${comentario.trim()}`
    : `Escalado a ${escalaA}.`;

  await pool
    .request()
    .input("idSolicitud", sql.Int, idSolicitud)
    .input("idUsuario", sql.VarChar, loginUsuario)
    .input("nombreUsuario", sql.NVarChar, nombreUsuario)
    .input("nota", sql.NVarChar, notaBitacora).query(`
      INSERT INTO solicitudTI_bitacora (idSolicitud, idUsuario, nombreUsuario, nota)
      VALUES (@idSolicitud, @idUsuario, @nombreUsuario, @nota)
    `);

  return { ok: true };
}

async function cambiarPrioridad(idSolicitud, idPrioridad) {
  const pool = await getPool();
  const pr = await pool
    .request()
    .input("idPrioridad", idPrioridad)
    .query(
      "SELECT slaRespuestaHrs, slaResolucionHrs FROM cat_prioridad WHERE idPrioridad = @idPrioridad",
    );

  if (!pr.recordset.length) throw new Error("Prioridad no encontrada");
  const { slaRespuestaHrs, slaResolucionHrs } = pr.recordset[0];

  await pool
    .request()
    .input("idSolicitud", idSolicitud)
    .input("idPrioridad", idPrioridad)
    .input("slaRespuestaHrs", slaRespuestaHrs)
    .input("slaResolucionHrs", slaResolucionHrs).query(`
      UPDATE solicitudTI
      SET idPrioridad        = @idPrioridad,
          slaRespuestaHrs    = @slaRespuestaHrs,
          slaResolucionHrs   = @slaResolucionHrs,
          fechaLimiteResp    = DATEADD(HOUR, @slaRespuestaHrs,  fechaCreacion),
          fechaLimiteResol   = DATEADD(HOUR, @slaResolucionHrs, fechaCreacion),
          fechaActualizacion = GETDATE()
      WHERE idSolicitud = @idSolicitud
    `);
}

async function agregarComentario(
  idSolicitud,
  idUsuario,
  nombreUsuario,
  esInterno,
  comentario,
) {
  const pool = await getPool();
  await pool
    .request()
    .input("idSolicitud", idSolicitud)
    .input("idUsuario", idUsuario)
    .input("nombreUsuario", nombreUsuario)
    .input("esInterno", esInterno)
    .input("comentario", comentario).query(`
      INSERT INTO solicitudTI_comentarios (idSolicitud, idUsuario, nombreUsuario, esInterno, comentario)
      VALUES (@idSolicitud, @idUsuario, @nombreUsuario, @esInterno, @comentario)
    `);
}

async function agregarBitacora(idSolicitud, idUsuario, nombreUsuario, nota) {
  const pool = await getPool();
  await pool
    .request()
    .input("idSolicitud", idSolicitud)
    .input("idUsuario", idUsuario)
    .input("nombreUsuario", nombreUsuario)
    .input("nota", nota).query(`
      INSERT INTO solicitudTI_bitacora (idSolicitud, idUsuario, nombreUsuario, nota)
      VALUES (@idSolicitud, @idUsuario, @nombreUsuario, @nota)
    `);
}

async function getTecnicosSistemas() {
  const pool = await getPool();
  const res = await pool.request().query(`
    SELECT login, name FROM sec_users WHERE area = 'SISTEMAS' AND active = 'Y' ORDER BY name
  `);
  return res.recordset;
}

async function transferir(idSolicitud, tecnicoLogin, nombreTecnico) {
  const pool = await getPool();
  await pool
    .request()
    .input("idSolicitud", idSolicitud)
    .input("tecnicoAsignado", tecnicoLogin)
    .input("nombreTecnico", nombreTecnico).query(`
      UPDATE solicitudTI
      SET tecnicoAsignado    = @tecnicoAsignado,
          nombreTecnico      = @nombreTecnico,
          fechaActualizacion = GETDATE()
      WHERE idSolicitud = @idSolicitud
    `);
}

module.exports = {
  getKPIs,
  getSolicitudes,
  getSolicitudDetalle,
  asignar,
  cambiarEstatus,
  cambiarPrioridad,
  agregarComentario,
  agregarBitacora,
  getTecnicosSistemas,
  transferir,
  escalar,
};
