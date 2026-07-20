const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const {
  postSolicitud,
  getMisSolicitudes,
} = require("../controllers/solicitudes.controller");

router.post("/", verifyToken, postSolicitud);
router.get("/mias", verifyToken, getMisSolicitudes);

module.exports = router;
