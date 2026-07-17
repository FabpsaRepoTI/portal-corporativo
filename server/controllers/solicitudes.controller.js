const sql = require("mssql");
const { getPool } = require("../db");

exports.crearSolicitud = async (req, res) => {
  const { slug, titulo, descripcion, idPrioridad } = req.body;
  const idUsuario = req.user.id; // viene del JWT

  if (!slug || !titulo || !descripcion) {
    return res.status(400).json({ message: "Campos requeridos incompletos." });
  }

  try {
    const pool = await getPool();

    // 1. Obtener idServicio desde el slug
    const svcResult = await pool
      .request()
      .input("slug", sql.NVarChar, slug)
      .query(
        "SELECT idServicio, idPrioridadDefault FROM cat_servicioTI WHERE slug = @slug",
      );

    if (!svcResult.recordset.length) {
      return res.status(404).json({ message: "Servicio no encontrado." });
    }

    const { idServicio, idPrioridadDefault } = svcResult.recordset[0];
    const prioFinal = idPrioridad ?? idPrioridadDefault;

    // 2. Obtener SLA de la prioridad
    const prioResult = await pool
      .request()
      .input("id", sql.Int, prioFinal)
      .query(
        "SELECT slaRespuestaHrs, slaResolucionHrs FROM cat_prioridad WHERE idPrioridad = @id",
      );

    const { slaRespuestaHrs, slaResolucionHrs } = prioResult.recordset[0];

    const ahora = new Date();
    const fechaResp = new Date(ahora.getTime() + slaRespuestaHrs * 3600000);
    const fechaResol = new Date(ahora.getTime() + slaResolucionHrs * 3600000);

    // 3. Insertar solicitud y obtener folio
    const insertResult = await pool
      .request()
      .input("idServicio", sql.Int, idServicio)
      .input("idPrioridad", sql.Int, prioFinal)
      .input("idUsuario", sql.Int, idUsuario)
      .input("titulo", sql.NVarChar, titulo)
      .input("descripcion", sql.NVarChar, descripcion)
      .input("fechaSlaRespuesta", sql.DateTime, fechaResp)
      .input("fechaSlaResolucion", sql.DateTime, fechaResol).query(`
        INSERT INTO solicitudTI
          (idServicio, idPrioridad, idUsuario, titulo, descripcion,
           idEstatus, fechaCreacion, fechaSlaRespuesta, fechaSlaResolucion)
        OUTPUT INSERTED.idSolicitud
        VALUES
          (@idServicio, @idPrioridad, @idUsuario, @titulo, @descripcion,
           1, GETDATE(), @fechaSlaRespuesta, @fechaSlaResolucion)
      `);

    const idSolicitud = insertResult.recordset[0].idSolicitud;
    const folio = `TI-${String(idSolicitud).padStart(5, "0")}`;

    return res.status(201).json({ folio, idSolicitud });
  } catch (err) {
    console.error("[crearSolicitud]", err);
    return res.status(500).json({ message: "Error al guardar la solicitud." });
  }
};
