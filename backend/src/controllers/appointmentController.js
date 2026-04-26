// ============================================================
// CONTROLADOR DE CITAS - appointmentController.js
// ============================================================
// Contiene la lógica de negocio para cada endpoint de citas.
// Todos los métodos son async porque el modelo usa sql.js async.
// ============================================================

const { Appointment } = require("../models/Appointment");
const { sendNotificationToDoctor } = require("../services/emailService");

// ── POST /api/appointments ───────────────────────────────────
/**
 * Crea una nueva cita.
 * Guarda en SQLite y dispara la notificación a la doctora de
 * forma no bloqueante (sin await) para responder rápido al cliente.
 */
const createAppointment = async (req, res) => {
  try {
    const { nombre, telefono, fecha, servicio, mensaje } = req.body;

    const nuevaCita = await Appointment.create({ nombre, telefono, fecha, servicio, mensaje });

    console.log(
      `[Cita] Nueva #${nuevaCita.id} — ${nombre} | ${servicio} | ${fecha}`
    );

    // Notificación interna a la doctora (no bloquea la respuesta)
    sendNotificationToDoctor(nuevaCita).catch((err) =>
      console.error("[Cita] Error en notificación email:", err.message)
    );

    return res.status(201).json({
      ok:     true,
      mensaje: "¡Solicitud de cita recibida! Te contactaremos pronto para confirmarla.",
      cita:   nuevaCita,
    });
  } catch (error) {
    console.error("[createAppointment]", error.message);
    return res.status(500).json({
      ok:     false,
      mensaje: "Error al guardar la cita. Por favor intenta nuevamente.",
    });
  }
};

// ── GET /api/appointments ────────────────────────────────────
/**
 * Lista todas las citas con filtros opcionales.
 * Query params: ?fecha=YYYY-MM-DD&servicio=X&estado=pendiente&page=1&limit=50
 */
const getAppointments = async (req, res) => {
  try {
    const { fecha, servicio, estado, page, limit } = req.query;
    const resultado = await Appointment.findAll({ fecha, servicio, estado, page, limit });

    return res.json({
      ok: true,
      ...resultado,
    });
  } catch (error) {
    console.error("[getAppointments]", error.message);
    return res.status(500).json({
      ok:     false,
      mensaje: "Error al obtener las citas.",
    });
  }
};

// ── GET /api/appointments/stats ──────────────────────────────
/**
 * Devuelve estadísticas resumidas de las citas.
 */
const getStats = async (req, res) => {
  try {
    const stats = await Appointment.stats();
    return res.json({ ok: true, stats });
  } catch (error) {
    console.error("[getStats]", error.message);
    return res.status(500).json({
      ok:     false,
      mensaje: "Error al obtener estadísticas.",
    });
  }
};

// ── GET /api/appointments/:id ────────────────────────────────
/**
 * Devuelve una cita específica por su id.
 */
const getAppointmentById = async (req, res) => {
  try {
    const id   = parseInt(req.params.id, 10);
    if (isNaN(id) || id < 1) {
      return res.status(400).json({ ok: false, mensaje: "ID inválido." });
    }

    const cita = await Appointment.findById(id);
    if (!cita) {
      return res.status(404).json({
        ok:     false,
        mensaje: `No se encontró la cita con id ${id}.`,
      });
    }

    return res.json({ ok: true, cita });
  } catch (error) {
    console.error("[getAppointmentById]", error.message);
    return res.status(500).json({
      ok:     false,
      mensaje: "Error al obtener la cita.",
    });
  }
};

// ── PATCH /api/appointments/:id/status ──────────────────────
/**
 * Actualiza el estado de una cita.
 * Body: { "estado": "confirmada" }
 */
const updateStatus = async (req, res) => {
  try {
    const id     = parseInt(req.params.id, 10);
    const { estado } = req.body;

    const citaActualizada = await Appointment.updateStatus(id, estado);

    if (!citaActualizada) {
      return res.status(404).json({
        ok:     false,
        mensaje: `No se encontró la cita con id ${id}.`,
      });
    }

    console.log(`[Cita] #${id} → estado: "${estado}"`);

    return res.json({
      ok:     true,
      mensaje: `Cita actualizada a "${estado}" correctamente.`,
      cita:   citaActualizada,
    });
  } catch (error) {
    console.error("[updateStatus]", error.message);
    return res.status(error.message.includes("Estado no válido") ? 400 : 500).json({
      ok:     false,
      mensaje: error.message || "Error al actualizar la cita.",
    });
  }
};

// ── DELETE /api/appointments/:id ─────────────────────────────
/**
 * Elimina una cita de la base de datos.
 */
const deleteAppointment = async (req, res) => {
  try {
    const id       = parseInt(req.params.id, 10);
    const eliminado = await Appointment.delete(id);

    if (!eliminado) {
      return res.status(404).json({
        ok:     false,
        mensaje: `No se encontró la cita con id ${id}.`,
      });
    }

    console.log(`[Cita] #${id} eliminada.`);

    return res.json({
      ok:     true,
      mensaje: `Cita #${id} eliminada correctamente.`,
    });
  } catch (error) {
    console.error("[deleteAppointment]", error.message);
    return res.status(500).json({
      ok:     false,
      mensaje: "Error al eliminar la cita.",
    });
  }
};

// ── GET /api/appointments/export.ics ────────────────────────
/**
 * Exporta todas las citas como un archivo iCalendar (.ics).
 * Genera un VEVENT por cada cita con DTSTART, DTEND (1 hora),
 * SUMMARY (nombre + servicio), DESCRIPTION (telefono + mensaje)
 * y un UID unico basado en el id de la cita.
 */
const exportIcs = async (_req, res) => {
  try {
    // Obtener todas las citas sin paginacion
    const resultado = await Appointment.findAll({ limit: 9999, page: 1 });
    const citas = resultado.citas ?? resultado.appointments ?? [];

    const formatIcsDate = (fechaStr) => {
      // Convierte "2024-06-15" o ISO string a formato iCal: 20240615T100000
      const base = (fechaStr || "").split("T")[0].replace(/-/g, "");
      if (!base || base.length < 8) return null;
      return `${base}T100000`;
    };

    const escapeIcs = (str) =>
      String(str || "")
        .replace(/\\/g, "\\\\")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/\n/g, "\\n");

    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//DinoDentis//Panel Admin//ES",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:Citas DinoDentis",
      "X-WR-TIMEZONE:America/Mexico_City",
    ];

    for (const cita of citas) {
      const dtStart = formatIcsDate(cita.fecha);
      if (!dtStart) continue; // saltar citas sin fecha valida

      const dtEnd = dtStart.replace("T100000", "T110000");
      const uid   = `cita-${cita.id}-dinodentis@localhost`;
      const summary     = escapeIcs(`${cita.nombre} — ${cita.servicio}`);
      const description = escapeIcs(
        `Tel: ${cita.telefono}${cita.mensaje ? ` | ${cita.mensaje}` : ""}`
      );
      const now = new Date()
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0];

      lines.push(
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${now}Z`,
        `DTSTART;TZID=America/Mexico_City:${dtStart}`,
        `DTEND;TZID=America/Mexico_City:${dtEnd}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        `STATUS:${cita.estado === "confirmada" ? "CONFIRMED" : cita.estado === "cancelada" ? "CANCELLED" : "TENTATIVE"}`,
        "END:VEVENT"
      );
    }

    lines.push("END:VCALENDAR");
    const icsString = lines.join("\r\n");

    res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="citas-dinodentis.ics"'
    );
    return res.send(icsString);
  } catch (error) {
    console.error("[exportIcs]", error.message);
    return res.status(500).json({
      ok:     false,
      mensaje: "Error al generar el archivo .ics.",
    });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  getStats,
  updateStatus,
  deleteAppointment,
  exportIcs,
};
