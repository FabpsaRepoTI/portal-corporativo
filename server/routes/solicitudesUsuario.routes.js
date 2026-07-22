const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const ctrl = require("../controllers/solicitudesUsuario.controller");

router.get("/kpis", verifyToken, ctrl.getMisKpis);
router.get("/", verifyToken, ctrl.getMisSolicitudes);
router.get("/:id/detalle", verifyToken, ctrl.getDetalleSolicitud);
router.post("/:id/comentario", verifyToken, ctrl.postComentario);
router.put("/:id/cancelar", verifyToken, ctrl.cancelarSolicitud);

module.exports = router;
