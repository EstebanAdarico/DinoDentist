// ============================================================
// SERVIDOR PRINCIPAL - server.js
// ============================================================
// Punto de entrada del backend de DinoDentis.
// Configura Express, middlewares globales, rutas y arranca
// el servidor en el puerto definido por la variable PORT.
//
// Ejecutar en desarrollo: npm run dev
// Ejecutar en producción: npm start
// ============================================================

require("dotenv").config(); // Carga variables de entorno desde .env

const express   = require("express");
const cors      = require("cors");
const morgan    = require("morgan");
const rateLimit = require("express-rate-limit");

// Importa las rutas
const appointmentRoutes = require("./src/routes/appointmentRoutes");

const app  = express();
const PORT = process.env.PORT || 3001;

// ── CORS ─────────────────────────────────────────────────────
// Permite requests solo desde el frontend.
// Ajusta FRONTEND_URL en .env para producción.
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: [
      FRONTEND_URL,
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    methods:        ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── MIDDLEWARES GLOBALES ──────────────────────────────────────
app.use(express.json({ limit: "10kb" }));         // Parsea body JSON (límite anti-payload gigante)
app.use(express.urlencoded({ extended: false }));  // Parsea form data
app.use(morgan("dev"));                            // Logging HTTP en consola

// ── RATE LIMITING ─────────────────────────────────────────────
// Protege el endpoint público de citas contra spam/abuso.

// Limiter específico para POST (crear cita): 20 solicitudes / 15 min por IP
const citasPostLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             20,
  standardHeaders: true,
  legacyHeaders:   false,
  skip:            (req) => req.method !== "POST",
  message: {
    ok:      false,
    mensaje: "Demasiadas solicitudes. Por favor espera unos minutos antes de intentarlo de nuevo.",
  },
});

// Limiter general: 100 requests / minuto por IP
const generalLimiter = rateLimit({
  windowMs:        60 * 1000,
  max:             100,
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    ok:      false,
    mensaje: "Demasiadas solicitudes. Intenta de nuevo en un momento.",
  },
});

// ── RUTAS ────────────────────────────────────────────────────
app.use("/api/appointments", generalLimiter, citasPostLimiter, appointmentRoutes);

// Ruta raíz — health check / documentación rápida de endpoints
app.get("/", (req, res) => {
  res.json({
    ok:       true,
    mensaje:  "DinoDentis API funcionando",
    version:  "1.0.0",
    endpoints: {
      "POST   /api/appointments":             "Crear nueva cita (formulario público)",
      "GET    /api/appointments":             "Listar citas (filtros: fecha, servicio, estado, page, limit)",
      "GET    /api/appointments/stats":       "Estadísticas de citas",
      "GET    /api/appointments/:id":         "Obtener cita por id",
      "PATCH  /api/appointments/:id/status":  "Actualizar estado (pendiente/confirmada/cancelada)",
      "DELETE /api/appointments/:id":         "Eliminar cita",
    },
  });
});

// Health check explícito
app.get("/health", (req, res) => {
  res.json({ ok: true, status: "healthy", timestamp: new Date().toISOString() });
});

// ── MANEJO DE RUTAS NO ENCONTRADAS ───────────────────────────
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
});

// ── MANEJO GLOBAL DE ERRORES ─────────────────────────────────
// Este middleware captura cualquier error lanzado con next(error)
// o errores no controlados en middlewares anteriores
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("[Error global]", err.stack || err.message);
  res.status(err.status || 500).json({
    ok: false,
    mensaje: err.message || "Error interno del servidor",
  });
});

// ── ARRANQUE DEL SERVIDOR ────────────────────────────────────
app.listen(PORT, () => {
  console.log("============================================");
  console.log("  🦕  DinoDentis Backend arrancado          ");
  console.log(`  Puerto   : http://localhost:${PORT}        `);
  console.log(`  API      : http://localhost:${PORT}/api/appointments`);
  console.log(`  Frontend : ${FRONTEND_URL}                 `);
  console.log("============================================");
});

module.exports = app; // Para tests futuros
