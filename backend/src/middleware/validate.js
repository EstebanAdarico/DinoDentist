// ============================================================
// MIDDLEWARE DE VALIDACIÓN - validate.js
// ============================================================
// Define las reglas de validación para los endpoints usando
// express-validator. También exporta el middleware que verifica
// si hay errores y responde con 422 si los hay.
//
// IMPORTANTE: SERVICIOS_VALIDOS debe coincidir exactamente con
// los valores de la propiedad "nombre" en src/data/content.js
// del frontend. Si agregas un servicio allá, agrégalo aquí.
// ============================================================

const { body, param, query, validationResult } = require("express-validator");

// Servicios válidos — deben coincidir con content.js del frontend
// (campo "nombre" de cada objeto en el array `services`)
const SERVICIOS_VALIDOS = [
  "Limpieza Dental",
  "Blanqueamiento",
  "Ortodoncia",
  "Flúor",
  "Revisión Completa",
  "Emergencias",
];

// ── Middleware verificador de errores ────────────────────────
/**
 * Revisa si express-validator encontró errores.
 * Si los hay, responde 422 con la lista de errores formateados.
 * Si no hay errores, llama a next() para continuar.
 */
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      ok: false,
      mensaje: "Datos inválidos en la solicitud",
      errores: errors.array().map((e) => ({
        campo:   e.path,
        mensaje: e.msg,
      })),
    });
  }
  next();
};

// ── Reglas para crear una cita (POST /api/appointments) ──────
const reglasCrearCita = [
  body("nombre")
    .trim()
    .notEmpty().withMessage("El nombre del niño/a es obligatorio")
    .isLength({ min: 2, max: 100 }).withMessage("El nombre debe tener entre 2 y 100 caracteres")
    .escape(),

  body("telefono")
    .trim()
    .notEmpty().withMessage("El teléfono de contacto es obligatorio")
    .matches(/^[\d\s\-+()]{6,20}$/).withMessage("El teléfono no tiene un formato válido (6-20 dígitos)"),

  body("fecha")
    .trim()
    .notEmpty().withMessage("La fecha preferida es obligatoria")
    .isDate({ format: "YYYY-MM-DD" }).withMessage("La fecha debe tener el formato YYYY-MM-DD")
    .custom((valor) => {
      // La fecha no puede ser en el pasado
      const hoy           = new Date();
      hoy.setHours(0, 0, 0, 0);
      // Parsear como fecha local (sin zona horaria) para evitar off-by-one
      const [y, m, d]     = valor.split("-").map(Number);
      const fechaSolicitada = new Date(y, m - 1, d);
      if (fechaSolicitada < hoy) {
        throw new Error("La fecha no puede ser en el pasado");
      }
      return true;
    }),

  body("servicio")
    .trim()
    .notEmpty().withMessage("Selecciona un servicio")
    .isIn(SERVICIOS_VALIDOS).withMessage(
      `El servicio debe ser uno de: ${SERVICIOS_VALIDOS.join(", ")}`
    ),

  body("mensaje")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 }).withMessage("El mensaje no puede superar los 500 caracteres")
    .escape(),
];

// ── Reglas para actualizar el estado (PATCH /:id/status) ─────
const reglasActualizarEstado = [
  param("id")
    .isInt({ min: 1 }).withMessage("El ID debe ser un número entero positivo"),

  body("estado")
    .trim()
    .notEmpty().withMessage("El campo estado es obligatorio")
    .isIn(["pendiente", "confirmada", "cancelada"])
    .withMessage("El estado debe ser: pendiente, confirmada o cancelada"),
];

// ── Reglas para filtros de listado (GET query params) ────────
const reglasListarCitas = [
  query("fecha")
    .optional()
    .isDate({ format: "YYYY-MM-DD" })
    .withMessage("El filtro de fecha debe tener formato YYYY-MM-DD"),

  query("estado")
    .optional()
    .isIn(["pendiente", "confirmada", "cancelada"])
    .withMessage("Estado inválido. Valores: pendiente, confirmada, cancelada"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El número de página debe ser un entero positivo"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("El límite debe ser un entero entre 1 y 100"),
];

module.exports = {
  checkValidation,
  reglasCrearCita,
  reglasActualizarEstado,
  reglasListarCitas,
  SERVICIOS_VALIDOS,
};