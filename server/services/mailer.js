const nodemailer = require("nodemailer");

const fs = require("fs");
const path = require("path");

// Leer logo como base64
const logoPath = path.join(__dirname, "../../client/src/logo-fabpsa.png");
const logoBase64 = fs.existsSync(logoPath)
  ? `data:image/png;base64,${fs.readFileSync(logoPath).toString("base64")}`
  : "";

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: "notificaciones@fabpsa.com.mx",
    pass: "FaNo*/180",
  },
});

const DESTINATARIO_TI = "juan.ramirez@fabpsa.com.mx";

function construirFilasArticulos(articulos) {
  return articulos
    .map(
      (a) => `
        <tr>
          <td style="font-size:12px;color:#1e293b;padding:8px 0;border-bottom:1px solid #f1f3f7">${a.nombreArticulo}</td>
          <td style="font-size:12px;color:#1e293b;padding:8px 0;border-bottom:1px solid #f1f3f7">${a.cantidad}</td>
          <td style="font-size:12px;padding:8px 0;border-bottom:1px solid #f1f3f7;color:${
            a.requiereAutorizacion === "S" ? "#d99a3e" : "#64748b"
          }">${a.requiereAutorizacion === "S" ? "Requiere" : "No requiere"}</td>
        </tr>`,
    )
    .join("");
}

async function enviarCorreoSolicitudHardware({
  folio,
  usuario,
  departamento,
  motivo,
  fecha,
  articulos,
}) {
  const filasHtml = construirFilasArticulos(articulos);

  /*const html = `
 <div style="background:#0f172a;padding:28px 32px;text-align:center">
  <img src="http://localhost:3001/logo-fabpsa.png" 
       alt="FABPSA" 
       style="height:36px;margin-bottom:10px;display:block;margin-left:auto;margin-right:auto" />
  <div style="color:#f8fafc;font-size:15px;font-weight:600">Portal Corporativo FABPSA</div>
  <div style="color:rgba(248,250,252,0.5);font-size:11px;margin-top:2px">Nueva solicitud de Mesa de Servicio</div>
</div>
      <div style="padding:28px 32px">
        <p style="font-size:13px;color:#1e293b;margin-bottom:14px;line-height:1.6">
          Estimado equipo de Sistemas,<br>Se ha generado una nueva solicitud de Hardware.
        </p>
        <div style="background:#f0fbf6;border:1px solid #c7ede0;border-radius:10px;padding:14px 16px;margin-bottom:18px;text-align:center">
          <div style="font-size:9px;letter-spacing:0.08em;text-transform:uppercase;color:#64748b">Folio</div>
          <div style="font-size:18px;font-weight:700;color:#2baf8b;margin-top:2px">${folio}</div>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:18px">
          <tr>
            <th style="text-align:left;font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:#94a3b8;padding:8px 0;border-bottom:1px solid #e5eaf2">Artículo</th>
            <th style="text-align:left;font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:#94a3b8;padding:8px 0;border-bottom:1px solid #e5eaf2">Cantidad</th>
            <th style="text-align:left;font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:#94a3b8;padding:8px 0;border-bottom:1px solid #e5eaf2">Autorización</th>
          </tr>
          ${filasHtml}
        </table>
        <div style="font-size:11px;color:#64748b;line-height:1.8">
          Solicitante: ${usuario}<br>
          Departamento: ${departamento || "No especificado"}<br>
          Motivo: ${motivo || "No especificado"}<br>
          Fecha: ${fecha}
        </div>
      </div>
      <div style="padding:16px 32px;text-align:center;font-size:10px;color:#94a3b8;background:#f8fafd">
        Este es un correo automático del Portal Corporativo FABPSA. No responder directamente.
      </div>
    </div>
  </div>`;*/
  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        
        <!-- HEADER -->
        <tr>
          <td style="background:#0f172a;padding:28px 36px">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  ${logoBase64 ? `<img src="${logoBase64}" alt="FABPSA" style="height:38px;display:block" />` : ""}
                </td>
                <td align="right" style="vertical-align:middle">
                  <div style="color:#4cc9a6;font-size:10px;letter-spacing:0.12em;text-transform:uppercase">Mesa de Servicio</div>
                  <div style="color:rgba(248,250,252,0.5);font-size:10px;margin-top:2px">Solicitud de Hardware</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOLIO BANNER -->
        <tr>
          <td style="background:#0d9488;padding:16px 36px">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <div style="color:rgba(255,255,255,0.75);font-size:9px;letter-spacing:0.1em;text-transform:uppercase">Nueva solicitud registrada</div>
                  <div style="color:#ffffff;font-size:22px;font-weight:700;margin-top:4px;letter-spacing:0.04em">${folio}</div>
                </td>
                <td align="right" style="vertical-align:middle">
                  <div style="background:rgba(255,255,255,0.15);border-radius:8px;padding:8px 14px;display:inline-block">
                    <div style="color:rgba(255,255,255,0.75);font-size:9px;text-transform:uppercase;letter-spacing:0.08em">Estatus</div>
                    <div style="color:#ffffff;font-size:11px;font-weight:600;margin-top:2px">Pendiente</div>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:28px 36px">
            
            <p style="font-size:13px;color:#475569;line-height:1.7;margin:0 0 24px">
              Estimado equipo de Sistemas,<br>
              Se ha generado una nueva solicitud de equipamiento a través del Portal Corporativo FABPSA.
            </p>

            <!-- INFO SOLICITANTE -->
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;margin-bottom:20px">
              <div style="font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#94a3b8;margin-bottom:12px">Información del solicitante</div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:5px 0;font-size:12px;color:#64748b;width:40%">Solicitante</td>
                  <td style="padding:5px 0;font-size:12px;color:#1e293b;font-weight:600">${usuario}</td>
                </tr>
                <tr>
                  <td style="padding:5px 0;font-size:12px;color:#64748b">Departamento</td>
                  <td style="padding:5px 0;font-size:12px;color:#1e293b;font-weight:600">${departamento || "No especificado"}</td>
                </tr>
                <tr>
                  <td style="padding:5px 0;font-size:12px;color:#64748b">Motivo</td>
                  <td style="padding:5px 0;font-size:12px;color:#1e293b;font-weight:600">${motivo || "No especificado"}</td>
                </tr>
                <tr>
                  <td style="padding:5px 0;font-size:12px;color:#64748b">Fecha</td>
                  <td style="padding:5px 0;font-size:12px;color:#1e293b;font-weight:600">${fecha}</td>
                </tr>
              </table>
            </div>

            <!-- ARTÍCULOS -->
            <div style="font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#94a3b8;margin-bottom:10px">Artículos solicitados</div>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden">
              <tr style="background:#f8fafc">
                <th style="text-align:left;font-size:10px;color:#64748b;padding:10px 16px;font-weight:500;border-bottom:1px solid #e2e8f0">Artículo</th>
                <th style="text-align:center;font-size:10px;color:#64748b;padding:10px 16px;font-weight:500;border-bottom:1px solid #e2e8f0">Cantidad</th>
                <th style="text-align:left;font-size:10px;color:#64748b;padding:10px 16px;font-weight:500;border-bottom:1px solid #e2e8f0">Autorización</th>
              </tr>
              ${articulos
                .map(
                  (a, i) => `
              <tr style="background:${i % 2 === 0 ? "#ffffff" : "#f8fafc"}">
                <td style="padding:10px 16px;font-size:12px;color:#1e293b">${a.nombreArticulo}</td>
                <td style="padding:10px 16px;font-size:12px;color:#1e293b;text-align:center">${a.cantidad}</td>
                <td style="padding:10px 16px;font-size:12px">
                  ${
                    a.requiereAutorizacion === "S"
                      ? `<span style="background:#fef3c7;color:#d97706;font-size:10px;padding:2px 8px;border-radius:4px;font-weight:500">Requiere</span>`
                      : `<span style="background:#f1f5f9;color:#64748b;font-size:10px;padding:2px 8px;border-radius:4px">No requiere</span>`
                  }
                </td>
              </tr>`,
                )
                .join("")}
            </table>

          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 36px;text-align:center">
            <p style="font-size:10px;color:#94a3b8;margin:0">
              Este es un correo automático generado por el Portal Corporativo FABPSA.<br>Por favor no responder directamente a este mensaje.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
  await transporter.sendMail({
    from: '"Portal FABPSA" <notificaciones@fabpsa.com.mx>',
    to: DESTINATARIO_TI,
    subject: `Nueva solicitud de Hardware — Folio ${folio}`,
    html,
  });
}

module.exports = { enviarCorreoSolicitudHardware };
