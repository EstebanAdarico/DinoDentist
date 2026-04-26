// ============================================================
// MODELO DE CITAS - Appointment.js
// ============================================================
// Encapsula todas las operaciones CRUD sobre la tabla
// appointments. Usa sql.js (async) a través de db.js.
// Cada método retorna una Promesa.
// ============================================================

const { getDb, persistir } = require("../config/db");

// Estados válidos que puede tener una cita
const ESTADOS_VALIDOS = ["pendiente", "confirmada", "cancelada"];

// ── Helper: convierte el resultado de sql.js a array de objetos ──
function resultToRows(result) {
  if (!result || result.length === 0) return [];
  const { columns, values } = result[0];
  return values.map((row) =>
    columns.reduce((obj, col, i) => {
      obj[col] = row[i];
      return obj;
    }, {})
  );
}

// ── Helper: valida que el id sea un entero positivo ──────────
function validarId(id) {
  const n = parseInt(id, 10);
  if (isNaN(n) || n < 1) throw new Error("ID inválido");
  return n;
}

const Appointment = {
  // ── CREATE ─────────────────────────────────────────────────
  /**
   * Inserta una nueva cita en la base de datos.
   * @param {Object} data - { nombre, telefono, fecha, servicio, mensaje }
   * @returns {Promise<Object>} La cita recién creada con su id
   */
  async create(data) {
    const db = await getDb();

    const stmt = db.prepare(`
      INSERT INTO appointments (nombre, telefono, fecha, servicio, mensaje)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run([
      data.nombre.trim(),
      data.telefono.trim(),
      data.fecha.trim(),
      data.servicio.trim(),
      (data.mensaje || "").trim(),
    ]);
    stmt.free();

    // Obtiene el id del último registro insertado
    const idResult = db.exec("SELECT last_insert_rowid() AS id");
    const id = idResult[0].values[0][0];

    persistir(); // Escribe en disco

    return Appointment.findById(id);
  },

  // ── FIND ALL ───────────────────────────────────────────────
  /**
   * Devuelve todas las citas con filtros opcionales.
   * @param {Object} filtros - { fecha, servicio, estado, page, limit }
   * @returns {Promise<{ total: number, citas: Array }>}
   */
  async findAll(filtros = {}) {
    const db = await getDb();

    // Construye la query con filtros dinámicos usando parámetros enlazados
    let where  = "WHERE 1=1";
    const params = [];

    if (filtros.fecha) {
      where += " AND fecha = ?";
      params.push(filtros.fecha);
    }
    if (filtros.servicio) {
      where += " AND servicio = ?";
      params.push(filtros.servicio);
    }
    if (filtros.estado) {
      where += " AND estado = ?";
      params.push(filtros.estado);
    }

    // Paginación
    const page  = Math.max(1, parseInt(filtros.page  || 1,  10));
    const limit = Math.min(100, Math.max(1, parseInt(filtros.limit || 50, 10)));
    const offset = (page - 1) * limit;

    // Conteo total (para paginación en el cliente)
    const countResult = db.exec(`SELECT COUNT(*) AS total FROM appointments ${where}`, params);
    const total = countResult[0]?.values[0][0] ?? 0;

    // Datos de la página
    const dataResult = db.exec(
      `SELECT * FROM appointments ${where} ORDER BY fecha ASC, created_at ASC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return {
      total,
      page,
      limit,
      citas: resultToRows(dataResult),
    };
  },

  // ── FIND BY ID ─────────────────────────────────────────────
  /**
   * Busca una cita por su id.
   * @param {number|string} id
   * @returns {Promise<Object|null>} La cita o null si no existe
   */
  async findById(id) {
    const db = await getDb();
    const n  = validarId(id);
    const result = db.exec("SELECT * FROM appointments WHERE id = ?", [n]);
    const rows   = resultToRows(result);
    return rows[0] || null;
  },

  // ── UPDATE STATUS ──────────────────────────────────────────
  /**
   * Actualiza el estado de una cita.
   * @param {number|string} id
   * @param {string} estado - 'pendiente' | 'confirmada' | 'cancelada'
   * @returns {Promise<Object|null>} La cita actualizada o null si no existe
   */
  async updateStatus(id, estado) {
    if (!ESTADOS_VALIDOS.includes(estado)) {
      throw new Error(`Estado no válido. Valores permitidos: ${ESTADOS_VALIDOS.join(", ")}`);
    }

    const n  = validarId(id);
    const db = await getDb();

    // Verificar existencia antes de actualizar
    const existente = await Appointment.findById(n);
    if (!existente) return null;

    db.run("UPDATE appointments SET estado = ? WHERE id = ?", [estado, n]);
    persistir();

    return Appointment.findById(n);
  },

  // ── DELETE ─────────────────────────────────────────────────
  /**
   * Elimina una cita por su id.
   * @param {number|string} id
   * @returns {Promise<boolean>} true si se eliminó, false si no existía
   */
  async delete(id) {
    const n    = validarId(id);
    const cita = await Appointment.findById(n);
    if (!cita) return false;

    const db = await getDb();
    db.run("DELETE FROM appointments WHERE id = ?", [n]);
    persistir();
    return true;
  },

  // ── STATS ──────────────────────────────────────────────────
  /**
   * Devuelve estadísticas rápidas para un posible panel admin.
   * @returns {Promise<Object>}
   */
  async stats() {
    const db = await getDb();

    const result = db.exec(`
      SELECT
        COUNT(*)                                              AS total,
        SUM(CASE WHEN estado = 'pendiente'  THEN 1 ELSE 0 END) AS pendientes,
        SUM(CASE WHEN estado = 'confirmada' THEN 1 ELSE 0 END) AS confirmadas,
        SUM(CASE WHEN estado = 'cancelada'  THEN 1 ELSE 0 END) AS canceladas
      FROM appointments
    `);

    const rows = resultToRows(result);
    return rows[0] || { total: 0, pendientes: 0, confirmadas: 0, canceladas: 0 };
  },
};

module.exports = { Appointment, ESTADOS_VALIDOS };