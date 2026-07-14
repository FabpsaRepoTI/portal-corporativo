const express = require("express");
const router = express.Router();
const { getPool, sql } = require("../db");
const { verifyToken } = require("../middleware/auth");

function requireTI(req, res, next) {
  if (req.user?.area !== "SISTEMAS") {
    return res.status(403).json({ error: "Acceso restringido." });
  }
  next();
}

router.use(verifyToken);
router.use(requireTI);

// GET todas las solicitudes con detalle
router.get("/hardware", async (req, res) => {
  try {
    const db = await getPool();

    const solicitudesResult = await db.request().query(`
      SELECT idSolicitud, folio, fechaRegistro, usuario,
             departamento, motivo, observaciones, estatus
      FROM solicitudHardware
      ORDER BY fechaRegistro DESC
    `);

    const solicitudes = solicitudesResult.recordset;

    for (const s of solicitudes) {
      const detalleResult = await db
        .request()
        .input("id", sql.Int, s.idSolicitud).query(`
          SELECT shd.idDetalle, ch.nombreArticulo, shd.cantidad,
                 shd.estatusDetalle, shd.fechaEstimadaEntrega,
                 shd.observacionAtencion
          FROM solicitudHardwareDetalle shd
          LEFT JOIN catalogoHardware ch ON ch.idArticulo = shd.idArticulo
          WHERE shd.idSolicitud = @id
          ORDER BY shd.idDetalle ASC
        `);
      s.detalle = detalleResult.recordset;
    }

    res.json(solicitudes);
  } catch (err) {
    console.error("Error solicitudes hardware:", err.message);
    res.status(500).json({ error: "Error consultando solicitudes." });
  }
});

// POST atender solicitud
router.post("/hardware/atender", async (req, res) => {
  const { idSolicitud, cambios } = req.body;

  if (!idSolicitud || !Array.isArray(cambios)) {
    return res.status(400).json({ error: "Datos incompletos." });
  }

  let transaction;
  try {
    const db = await getPool();
    transaction = new sql.Transaction(db);
    await transaction.begin();

    for (const c of cambios) {
      await new sql.Request(transaction)
        .input("estatus", sql.VarChar, c.estatus)
        .input("fecha", sql.Date, c.fechaEstimadaEntrega || null)
        .input("obs", sql.VarChar, c.observacionAtencion || null)
        .input("id", sql.Int, parseInt(c.idDetalle)).query(`
          UPDATE solicitudHardwareDetalle
          SET estatusDetalle = @estatus,
              fechaEstimadaEntrega = @fecha,
              observacionAtencion = @obs
          WHERE idDetalle = @id
        `);
    }

    // Calcular estatus general de la solicitud
    const estatusResult = await new sql.Request(transaction).input(
      "idSolicitud",
      sql.Int,
      idSolicitud,
    ).query(`
        SELECT estatusDetalle FROM solicitudHardwareDetalle
        WHERE idSolicitud = @idSolicitud
      `);

    const estatuses = estatusResult.recordset.map((r) =>
      r.estatusDetalle.toLowerCase(),
    );
    let estatusSolicitud = "Pendiente";

    if (estatuses.every((e) => e === "atendida")) {
      estatusSolicitud = "Completada";
    } else if (estatuses.every((e) => e === "rechazada")) {
      estatusSolicitud = "Rechazada";
    } else if (estatuses.some((e) => e === "en proceso" || e === "atendida")) {
      estatusSolicitud = "En proceso";
    }

    await new sql.Request(transaction)
      .input("estatus", sql.VarChar, estatusSolicitud)
      .input("id", sql.Int, idSolicitud).query(`
        UPDATE solicitudHardware SET estatus = @estatus WHERE idSolicitud = @id
      `);

    await transaction.commit();
    res.json({ ok: true, estatusSolicitud });
  } catch (err) {
    if (transaction) await transaction.rollback().catch(() => {});
    console.error("Error atender hardware:", err.message);
    res.status(500).json({ error: "Error guardando cambios." });
  }
});

// POST rechazar solicitud completa
router.post("/hardware/rechazar", async (req, res) => {
  const { idSolicitud } = req.body;

  if (!idSolicitud) {
    return res.status(400).json({ error: "idSolicitud requerido." });
  }

  let transaction;
  try {
    const db = await getPool();
    transaction = new sql.Transaction(db);
    await transaction.begin();

    await new sql.Request(transaction).input("id", sql.Int, idSolicitud).query(`
        UPDATE solicitudHardwareDetalle
        SET estatusDetalle = 'Rechazada'
        WHERE idSolicitud = @id
      `);

    await new sql.Request(transaction).input("id", sql.Int, idSolicitud).query(`
        UPDATE solicitudHardware SET estatus = 'Rechazada' WHERE idSolicitud = @id
      `);

    await transaction.commit();
    res.json({ ok: true });
  } catch (err) {
    if (transaction) await transaction.rollback().catch(() => {});
    console.error("Error rechazar hardware:", err.message);
    res.status(500).json({ error: "Error rechazando solicitud." });
  }
});

module.exports = router;
