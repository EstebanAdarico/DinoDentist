// ============================================================
// AGENTE DE GESTIÓN DE CITAS - agent.js
// ============================================================
// CLI interactivo con IA para gestionar citas de DinoDentis.
// Usa Claude con tool use para interpretar lenguaje natural y
// ejecutar operaciones sobre la base de datos directamente.
//
// Ejecutar: node agent.js
// Requiere: ANTHROPIC_API_KEY en .env
// ============================================================

require("dotenv").config();

const readline  = require("readline");
const Anthropic = require("@anthropic-ai/sdk");
const { Appointment } = require("./src/models/Appointment");

// ── Cliente Claude ────────────────────────────────────────────
const client = new Anthropic.default();

// ── Definición de herramientas ────────────────────────────────
const TOOLS = [
  {
    name: "listar_citas",
    description:
      "Lista las citas registradas. Permite filtrar por fecha (YYYY-MM-DD), servicio, estado (pendiente/confirmada/cancelada) y paginar.",
    input_schema: {
      type: "object",
      properties: {
        fecha:    { type: "string",  description: "Filtrar por fecha exacta (YYYY-MM-DD)" },
        servicio: { type: "string",  description: "Filtrar por tipo de servicio" },
        estado:   { type: "string",  enum: ["pendiente", "confirmada", "cancelada"], description: "Filtrar por estado" },
        page:     { type: "integer", description: "Número de página (default: 1)" },
        limit:    { type: "integer", description: "Resultados por página (default: 50, máx: 100)" },
      },
    },
  },
  {
    name: "obtener_cita",
    description: "Obtiene los detalles completos de una cita por su ID.",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "integer", description: "ID numérico de la cita" },
      },
      required: ["id"],
    },
  },
  {
    name: "actualizar_estado",
    description: "Cambia el estado de una cita a pendiente, confirmada o cancelada.",
    input_schema: {
      type: "object",
      properties: {
        id:     { type: "integer", description: "ID de la cita a actualizar" },
        estado: { type: "string",  enum: ["pendiente", "confirmada", "cancelada"], description: "Nuevo estado" },
      },
      required: ["id", "estado"],
    },
  },
  {
    name: "eliminar_cita",
    description: "Elimina permanentemente una cita de la base de datos.",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "integer", description: "ID de la cita a eliminar" },
      },
      required: ["id"],
    },
  },
  {
    name: "estadisticas",
    description: "Devuelve un resumen con el total de citas y conteo por estado (pendientes, confirmadas, canceladas).",
    input_schema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "crear_cita",
    description: "Registra una nueva cita en el sistema.",
    input_schema: {
      type: "object",
      properties: {
        nombre:   { type: "string", description: "Nombre completo del paciente o padre/tutor" },
        telefono: { type: "string", description: "Número de teléfono de contacto" },
        fecha:    { type: "string", description: "Fecha de la cita (YYYY-MM-DD)" },
        servicio: { type: "string", description: "Tipo de servicio solicitado" },
        mensaje:  { type: "string", description: "Mensaje o nota adicional (opcional)" },
      },
      required: ["nombre", "telefono", "fecha", "servicio"],
    },
  },
];

// ── Ejecutor de herramientas ──────────────────────────────────
async function ejecutarHerramienta(nombre, input) {
  switch (nombre) {
    case "listar_citas": {
      const resultado = await Appointment.findAll(input);
      return JSON.stringify(resultado, null, 2);
    }
    case "obtener_cita": {
      const cita = await Appointment.findById(input.id);
      if (!cita) return JSON.stringify({ error: `No se encontró la cita con id ${input.id}` });
      return JSON.stringify(cita, null, 2);
    }
    case "actualizar_estado": {
      const cita = await Appointment.updateStatus(input.id, input.estado);
      if (!cita) return JSON.stringify({ error: `No se encontró la cita con id ${input.id}` });
      return JSON.stringify(cita, null, 2);
    }
    case "eliminar_cita": {
      const ok = await Appointment.delete(input.id);
      if (!ok) return JSON.stringify({ error: `No se encontró la cita con id ${input.id}` });
      return JSON.stringify({ ok: true, mensaje: `Cita #${input.id} eliminada.` });
    }
    case "estadisticas": {
      const stats = await Appointment.stats();
      return JSON.stringify(stats, null, 2);
    }
    case "crear_cita": {
      const nueva = await Appointment.create(input);
      return JSON.stringify(nueva, null, 2);
    }
    default:
      return JSON.stringify({ error: `Herramienta desconocida: ${nombre}` });
  }
}

// ── Bucle agentico ────────────────────────────────────────────
async function procesarMensaje(historial) {
  // Bucle interno: Claude puede usar varias herramientas en cadena
  while (true) {
    const response = await client.messages.create({
      model:      "claude-opus-4-6",
      max_tokens: 4096,
      system: `Eres el asistente de gestión de citas de DinoDentis, una clínica de odontología infantil.
Tu rol es ayudar al personal de la clínica a consultar, confirmar, cancelar y administrar citas.
Responde siempre en español, de forma clara y concisa.
Cuando muestres listas de citas, presenta la información en formato legible (no JSON crudo).
Fechas en formato DD/MM/YYYY para mostrar, pero usa YYYY-MM-DD para las herramientas.`,
      tools:    TOOLS,
      messages: historial,
    });

    // Si Claude terminó sin usar herramientas → respuesta final
    if (response.stop_reason === "end_turn") {
      const texto = response.content
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("");
      return { respuesta: texto, historial };
    }

    // Claude quiere usar herramientas
    if (response.stop_reason === "tool_use") {
      // Agrega la respuesta del asistente al historial
      historial.push({ role: "assistant", content: response.content });

      // Ejecuta todas las herramientas solicitadas
      const resultados = [];
      for (const bloque of response.content) {
        if (bloque.type !== "tool_use") continue;

        process.stdout.write(`  [herramienta: ${bloque.name}]\n`);
        const salida = await ejecutarHerramienta(bloque.name, bloque.input);

        resultados.push({
          type:        "tool_result",
          tool_use_id: bloque.id,
          content:     salida,
        });
      }

      // Agrega resultados y vuelve a llamar a Claude
      historial.push({ role: "user", content: resultados });
      continue;
    }

    // Cualquier otro stop_reason inesperado
    break;
  }

  return { respuesta: "No se pudo completar la solicitud.", historial };
}

// ── Interfaz CLI ──────────────────────────────────────────────
async function iniciar() {
  console.log("============================================");
  console.log("  🦕  DinoDentis — Agente de Citas         ");
  console.log("  Escribe tu consulta en lenguaje natural.  ");
  console.log("  Escribe 'salir' para terminar.            ");
  console.log("============================================\n");

  // Historial de conversación (se mantiene entre turnos)
  const historial = [];

  const rl = readline.createInterface({
    input:  process.stdin,
    output: process.stdout,
  });

  const preguntar = () => {
    rl.question("Tú: ", async (input) => {
      const texto = input.trim();

      if (!texto) { preguntar(); return; }
      if (texto.toLowerCase() === "salir") {
        console.log("\n¡Hasta luego! 🦕");
        rl.close();
        process.exit(0);
      }

      historial.push({ role: "user", content: texto });

      try {
        const { respuesta, historial: nuevoHistorial } = await procesarMensaje(historial);

        // Actualiza el historial con la respuesta del asistente
        if (nuevoHistorial.at(-1)?.role !== "assistant") {
          nuevoHistorial.push({ role: "assistant", content: respuesta });
        }

        console.log(`\nAgente: ${respuesta}\n`);
      } catch (err) {
        if (err instanceof Anthropic.APIError) {
          console.error(`\n[Error API] ${err.status}: ${err.message}\n`);
        } else {
          console.error(`\n[Error] ${err.message}\n`);
        }
      }

      preguntar();
    });
  };

  preguntar();
}

iniciar();
