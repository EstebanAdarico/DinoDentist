// ============================================================
// SERVICIO DE EMAIL - emailService.js
// ============================================================
// Envía notificaciones a la doctora cuando llega una nueva cita.
// Si las variables SMTP no están configuradas en .env, solo se
// loguea en consola — la cita se guarda en BD igual.
//
// NOTA: el formulario del frontend no incluye campo de email del
// paciente, por lo que solo se notifica a la doctora.
// Si en el futuro se agrega email al formulario, se puede
// habilitar sendConfirmationEmail pasando cita.email.
// ============================================================

const nodemailer = require("nodemailer");

// Precios referenciales para el email de notificación
const PRECIOS_SERVICIOS = {
  "Limpieza Dental":    "S/ 80",
  "Blanqueamiento":     "S/ 200",
  "Ortodoncia":         "desde S/ 150",
  "Flúor":              "S/ 40",
  "Revisión Completa":  "S/ 60",
  "Emergencias":        "S/ 100",
};

// ── Transporter (lazy init) ──────────────────────────────────
let _transporter = null;

function getTransporter() {
  if (_transporter) return _transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null; // SMTP no configurado → modo simulado
  }

  _transporter = nodemailer.createTransport({
    host:   SMTP_HOST,
    port:   parseInt(SMTP_PORT || "587", 10),
    secure: parseInt(SMTP_PORT || "587", 10) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return _transporter;
}

// ── Helper: formatear fecha en español ──────────────────────
function formatearFecha(fechaStr) {
  const [year, month, day] = fechaStr.split("-").map(Number);
  // Crear fecha local (sin conversión de zona horaria)
  const fecha = new Date(year, month - 1, day);
  return fecha.toLocaleDateString("es-PE", {
    weekday: "long",
    year:    "numeric",
    month:   "long",
    day:     "numeric",
  });
}

// ── Helper: enviar email ─────────────────────────────────────
async function enviarEmail(opciones) {
  const transporter = getTransporter();

  if (!transporter) {
    // Modo simulado: solo log en consola
    console.log(
      `[Email] (simulado) Para: ${opciones.to} | Asunto: ${opciones.subject}`
    );
    return;
  }

  try {
    const info = await transporter.sendMail(opciones);
    console.log(`[Email] Enviado a ${opciones.to} — ID: ${info.messageId}`);
  } catch (error) {
    // El error de email NO debe romper el flujo principal
    console.error(`[Email] Error al enviar a ${opciones.to}:`, error.message);
    throw error; // Re-lanzar para que el controlador lo capture en .catch()
  }
}

// ── Notificación interna a la doctora ───────────────────────
/**
 * Notifica a la doctora sobre una nueva solicitud de cita.
 * @param {Object} cita - Datos de la cita guardada en BD
 */
async function sendNotificationToDoctor(cita) {
  const doctorEmail = process.env.DOCTOR_EMAIL;

  if (!doctorEmail) {
    console.log(
      `[Email] DOCTOR_EMAIL no configurado — cita #${cita.id} guardada sin notificación.`
    );
    return;
  }

  const fechaFormateada = formatearFecha(cita.fecha);
  const precio          = PRECIOS_SERVICIOS[cita.servicio] || "a consultar";

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        body  { font-family: Arial, sans-serif; background: #F0F4FF; margin: 0; padding: 20px; }
        .wrap { max-width: 560px; margin: 0 auto; background: #fff;
                border-radius: 12px; overflow: hidden;
                box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
        .hdr  { background: #FF7BAC; padding: 24px 32px; color: #fff; }
        .hdr h2 { margin: 0; font-size: 1.2rem; }
        .hdr p  { margin: 4px 0 0; opacity: 0.9; font-size: 0.9rem; }
        .bdy  { padding: 28px 32px; }
        table { width: 100%; border-collapse: collapse; }
        td    { padding: 10px 8px; border-bottom: 1px solid #EEE;
                color: #333; font-size: 0.95rem; }
        td:first-child { font-weight: bold; color: #555; width: 42%; }
        .alrt { background: #FFF3CD; border-left: 4px solid #FFC107;
                padding: 12px 16px; border-radius: 4px; margin-top: 20px;
                font-size: 0.9rem; }
        .badge { background: #FFE0EE; color: #C0306A; padding: 3px 10px;
                 border-radius: 20px; font-size: 0.85rem; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="wrap">
        <div class="hdr">
          <h2>🦷 Nueva solicitud de cita — #${cita.id}</h2>
          <p>DinoDentis · Odontología Infantil</p>
        </div>
        <div class="bdy">
          <table>
            <tr><td>Paciente:</td>       <td><strong>${cita.nombre}</strong></td></tr>
            <tr><td>Teléfono:</td>        <td>${cita.telefono}</td></tr>
            <tr><td>Servicio:</td>        <td>${cita.servicio}</td></tr>
            <tr><td>Precio referencial:</td><td>${precio}</td></tr>
            <tr><td>Fecha preferida:</td> <td>${fechaFormateada}</td></tr>
            <tr><td>Estado:</td>          <td><span class="badge">Pendiente</span></td></tr>
            ${cita.mensaje
              ? `<tr><td>Mensaje:</td><td><em>"${cita.mensaje}"</em></td></tr>`
              : ""}
            <tr><td>Registrada el:</td>   <td>${cita.created_at}</td></tr>
          </table>
          <div class="alrt">
            <strong>Acción requerida:</strong> Confirma o reagenda la cita
            contactando al paciente al <strong>${cita.telefono}</strong>.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await enviarEmail({
    from:    `"DinoDentis Sistema" <${process.env.SMTP_USER}>`,
    to:      doctorEmail,
    subject: `[DinoDentis] Nueva cita #${cita.id} — ${cita.nombre} (${cita.servicio})`,
    html,
  });
}

module.exports = { sendNotificationToDoctor };