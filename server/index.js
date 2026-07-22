const express = require("express");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const hardwareRoutes = require("./routes/hardware.routes");
const { getPool, sql } = require("./db");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: [
      "http://localhost",
      "http://localhost:3000",
      "http://192.168.16.198",
      "http://201.151.218.138",
    ],
  }),
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/public")));

app.use(
  "/uploads",
  express.static(
    process.env.UPLOADS_DIR
      ? process.env.UPLOADS_DIR
      : path.join(__dirname, "../uploads"),
  ),
);

app.use("/api/hardware", hardwareRoutes);

const sistemasAdminRoutes = require("./routes/sistemasAdmin.routes");
app.use("/api/admin", sistemasAdminRoutes);

const serviciosRoutes = require("./routes/servicios.routes");
app.use("/api/servicios", serviciosRoutes);

const solicitudesAdminRoutes = require("./routes/solicitudesAdmin.routes");
app.use("/api/mesa-admin", solicitudesAdminRoutes);

const solicitudesTIRoutes = require("./routes/solicitudes.routes");
app.use("/api/solicitudes", solicitudesTIRoutes);

const solicitudesUsuarioRoutes = require("./routes/solicitudesUsuario.routes");
app.use("/api/solicitudes-usuario", solicitudesUsuarioRoutes);

app.get("/", (req, res) => {
  res.send("API FABPSA funcionando en intranet");
});

app.get("/api/listo", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/birthdays", async (req, res) => {
  try {
    const db = await getPool();
    const result = await db.request().query(`
      SELECT
        LTRIM(RTRIM(A.Nombre)) AS nombre,
        LTRIM(RTRIM(A.apellidoPaterno)) AS apellidoPaterno,
        FORMAT(A.fechaNacimiento, 'd MMMM', 'es-ES') AS fechaNacimiento,
        DAY(A.fechaNacimiento) AS diaNacimiento,
        LTRIM(RTRIM(C.codigoSitio)) AS codigoSitio,
        LTRIM(RTRIM(C.nombreCorto)) AS sitio,
        LTRIM(RTRIM(B.departamento)) AS departamento
      FROM usuariosRH A
      JOIN DEPARTAMENTOS B ON A.departamento = B.codigoDepartamento
      JOIN SITIOS C ON B.codigoSitio = C.codigoSitio
      WHERE MONTH(A.fechaNacimiento) = MONTH(GETDATE())
        AND A.validaExistencia = 1
      ORDER BY DAY(A.fechaNacimiento)
    `);
    const rows = result.recordset.map((r) => ({
      ...r,
      initials: (
        (r.nombre?.[0] || "") + (r.apellidoPaterno?.[0] || "")
      ).toUpperCase(),
    }));
    res.json(rows);
  } catch (err) {
    console.error("DB Error:", err.message);
    res.status(500).json({ error: "Error consultando base de datos." });
  }
});

const JWT_SECRET = "fabpsa_secret_2026_intranet";

app.post("/api/auth/login", async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) {
    return res.status(400).json({ error: "Login y contraseña requeridos." });
  }
  try {
    const db = await getPool();
    const result = await db.request().input("login", sql.VarChar, login.trim())
      .query(`
        SELECT login, pswd, name, email, active,
               priv_admin, role, sitio, area, picture, phone
        FROM sec_users WHERE login = @login
      `);
    const user = result.recordset[0];
    if (!user)
      return res
        .status(401)
        .json({ error: "Usuario o contraseña incorrectos." });
    if (user.active !== "Y")
      return res
        .status(403)
        .json({ error: "Usuario inactivo. Contacta a sistemas." });
    if (user.pswd !== password)
      return res
        .status(401)
        .json({ error: "Usuario o contraseña incorrectos." });

    const payload = {
      login: user.login,
      name: user.name,
      email: user.email,
      role: user.role,
      sitio: user.sitio,
      area: user.area,
      priv_admin: user.priv_admin,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });
    res.json({ token, user: payload });
  } catch (err) {
    console.error("Auth Error:", err.message);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ FABPSA corriendo en http://localhost:${PORT}`);
});
