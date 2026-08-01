const express = require("express");
const router = express.Router();
const { addClient } = require("../sse.manager");
const svc = require("../services/notificaciones.service");

// SSE — acepta token por query param porque EventSource no soporta headers
router.get("/stream", (req, res) => {
  // Headers CORS explícitos para SSE
  const origin = req.headers.origin || "http://localhost:3000";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  const token = req.query.token;
  if (!token) {
    res.write(`data: ${JSON.stringify({ error: "sin token" })}\n\n`);
    return res.end();
  }

  try {
    const jwt = require("jsonwebtoken");
    const { JWT_SECRET } = require("../middleware/auth");
    const payload = jwt.verify(token, JWT_SECRET);
    const { addClient } = require("../sse.manager");
    addClient(payload.login, res);
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: "token invalido" })}\n\n`);
    res.end();
  }
});

// Lista paginada
router.get("/", (req, res) => {
  const { verifyToken } = require("../middleware/auth");
  verifyToken(req, res, async () => {
    try {
      const { pagina = 1, limite = 30 } = req.query;
      const data = await svc.getNotificaciones(req.user.login, {
        pagina: parseInt(pagina),
        limite: parseInt(limite),
      });
      res.json({ ok: true, data });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });
});

// Contador de no leídas
router.get("/count", (req, res) => {
  const { verifyToken } = require("../middleware/auth");
  verifyToken(req, res, async () => {
    try {
      const total = await svc.getCount(req.user.login);
      res.json({ ok: true, total });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });
});

// Marcar una como leída
router.patch("/:id/leer", (req, res) => {
  const { verifyToken } = require("../middleware/auth");
  verifyToken(req, res, async () => {
    try {
      await svc.marcarLeida(parseInt(req.params.id), req.user.login);
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });
});

// Marcar todas como leídas
router.patch("/leer-todas", (req, res) => {
  const { verifyToken } = require("../middleware/auth");
  verifyToken(req, res, async () => {
    try {
      await svc.marcarTodasLeidas(req.user.login);
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });
});

// Eliminar una notificación
router.delete("/:id", (req, res) => {
  const { verifyToken } = require("../middleware/auth");
  verifyToken(req, res, async () => {
    try {
      await svc.eliminar(parseInt(req.params.id), req.user.login);
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });
});

module.exports = router;
