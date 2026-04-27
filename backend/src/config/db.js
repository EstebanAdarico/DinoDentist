// ============================================================
// CONFIGURACIÓN DE BASE DE DATOS - db.js
// ============================================================
// Usa sql.js (SQLite compilado a WebAssembly) para persistir
// citas sin requerir compilación nativa ni servidor externo.
// La base de datos se guarda como archivo binario en disco.
//
// NOTA TÉCNICA: sql.js no soporta WAL journal mode porque opera
// sobre un buffer en memoria. Se usa el modo por defecto (DELETE)
// que es totalmente correcto para este caso de uso.
// ============================================================

const initSqlJs = require("sql.js");
const path      = require("path");
const fs        = require("fs");

// Ruta del archivo .db en disco
const DB_PATH = process.env.DB_PATH
  ? path.resolve(process.cwd(), process.env.DB_PATH)
  : path.join(__dirname, "../../data/dinodentis.db");

// Asegura que la carpeta exista
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// ── Instancia compartida (patrón singleton) ──────────────────
let _db   = null;
let _init = null; // Promesa de inicialización (evita doble init en paralelo)

/**
 * Inicializa (o reutiliza) la conexión a la base de datos.
 * Devuelve una promesa con el objeto db listo para usar.
 */
function getDb() {
  if (_db)   return Promise.resolve(_db);
  if (_init) return _init;

  _init = initSqlJs().then((SQL) => {
    // Si ya existe el archivo .db, lo cargamos; si no, creamos uno vacío
    const fileBuffer = fs.existsSync(DB_PATH)
      ? fs.readFileSync(DB_PATH)
      : null;

    _db = fileBuffer ? new SQL.Database(fileBuffer) : new SQL.Database();

    // Activa las foreign keys (buena práctica aunque no haya FK aquí aún)
    _db.run("PRAGMA foreign_keys = ON;");

    // Crea la tabla si no existe
    _db.run(`
      CREATE TABLE IF NOT EXISTS appointments (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre      TEXT    NOT NULL,
        telefono    TEXT    NOT NULL,
        fecha       TEXT    NOT NULL,
        hora        TEXT    NOT NULL DEFAULT '09:00',
        servicio    TEXT    NOT NULL,
        mensaje     TEXT    NOT NULL DEFAULT '',
        email       TEXT    NOT NULL DEFAULT '',
        estado      TEXT    NOT NULL DEFAULT 'pendiente'
                    CHECK(estado IN ('pendiente','confirmada','cancelada')),
        created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
      );
    `);

    // Migración: agrega columnas nuevas si la tabla ya existía sin ellas.
    // sql.js lanza error si la columna ya existe, así que usamos try/catch por cada ALTER.
    try {
      _db.run("ALTER TABLE appointments ADD COLUMN hora  TEXT NOT NULL DEFAULT '09:00'");
    } catch (_) { /* columna ya existe, se ignora */ }
    try {
      _db.run("ALTER TABLE appointments ADD COLUMN email TEXT NOT NULL DEFAULT ''");
    } catch (_) { /* columna ya existe, se ignora */ }

    // Persiste el estado inicial (o estructura creada) en disco
    _persistir();

    console.log(`[DB] Base de datos lista en: ${DB_PATH}`);
    return _db;
  }).catch((err) => {
    _init = null; // Permite reintentar si falla la inicialización
    throw err;
  });

  return _init;
}

/**
 * Persiste el estado actual de la BD en disco.
 * Se llama después de cada escritura (INSERT, UPDATE, DELETE).
 */
function _persistir() {
  if (!_db) return;
  try {
    const data = _db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  } catch (err) {
    console.error("[DB] Error al persistir en disco:", err.message);
  }
}

// Exportamos persistir para que los modelos la llamen tras cada write
module.exports = { getDb, persistir: _persistir };