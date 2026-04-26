// ============================================================
// RUTAS DE CITAS - appointmentRoutes.js
// ============================================================
// Define los endpoints del recurso /appointments y conecta
// cada ruta con su controlador y middleware de validación.
//
// Endpoints disponibles:
//   POST   /api/appointments              Crear cita (formulario público)
//   GET    /api/appointments              Listar citas (panel interno)
//   GET    /api/appointments/stats        Estadísticas rápidas
//   GET    /api/appointments/:id          Obtener cita por id
//   PATCH  /api/appointments/:id/status   Cambiar estado de cita
//   DELETE /api/appointments/:id          Eliminar cita
// ============================================================

const { Router } = require("express");
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  getStats,
  updateStatus,
  deleteAppointment,
  exportIcs,
} = require("../controllers/appointmentController");

const {
  checkValidation,
  reglasCrearCita,
  reglasActualizarEstado,
  reglasListarCitas,
} = require("../middleware/validate");

const router = Router();

// POST   /api/appointments          — Crear nueva cita (formulario del frontend)
router.post(
  "/",
  reglasCrearCita,
  checkValidation,
  createAppointment
);

// GET    /api/appointments/stats     — Estadísticas (debe ir ANTES de /:id)
router.get("/stats", getStats);

// GET    /api/appointments           — Listar citas (con filtros y paginación)
router.get(
  "/",
  reglasListarCitas,
  checkValidation,
  getAppointments
);

// GET    /api/appointments/export.ics — Exportar todas las citas como iCalendar (debe ir ANTES de /:id)
router.get("/export.ics", exportIcs);

// GET    /api/appointments/:id       — Obtener una cita por id
router.get("/:id", getAppointmentById);

// PATCH  /api/appointments/:id/status — Actualizar estado de una cita
router.patch(
  "/:id/status",
  reglasActualizarEstado,
  checkValidation,
  updateStatus
);

// DELETE /api/appointments/:id       — Eliminar una cita
router.delete("/:id", deleteAppointment);

module.exports = router;
