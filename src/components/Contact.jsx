// ============================================================
// 📅 CONTACTO - Contact.jsx
// ============================================================
// Sección con formulario de citas e información de contacto.
// Cuando el formulario se envía, muestra un mensaje de éxito.
// ============================================================

import { useState } from "react";
import { doctora, services } from "../data/content";
import { colors, styles } from "../styles/globals";

export default function Contact() {
  // Estado del formulario - guarda lo que escribe el usuario
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    fecha: "",
    servicio: "",
    mensaje: "",
  });

  // Estado para saber si el formulario fue enviado con éxito
  const [enviado, setEnviado] = useState(false);

  // Estado para mostrar errores al usuario
  const [error, setError] = useState(null);

  // Estado para deshabilitar el botón mientras se envía
  const [enviando, setEnviando] = useState(false);

  // Disponibilidad del día seleccionado
  const [disponibilidad, setDisponibilidad] = useState(null); // null | { count: number }

  // URL base del backend (ajusta si cambias de puerto)
  const API_URL = "http://localhost:3001/api/appointments";

  // Máximo de citas por día
  const MAX_DIA = 6;

  // Consulta cuántas citas existen para una fecha dada
  const checkFecha = async (fecha) => {
    if (!fecha) { setDisponibilidad(null); return; }
    try {
      const r = await fetch(`${API_URL}?fecha=${fecha}&limit=100`);
      const data = await r.json();
      if (data.ok) setDisponibilidad({ count: data.total ?? 0 });
    } catch {
      setDisponibilidad(null);
    }
  };

  // Función que se ejecuta al presionar "Solicitar cita"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    setEnviando(true);
    setError(null);

    try {
      const respuesta = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        // El servidor respondió con un error (4xx / 5xx)
        const mensajeError =
          datos.errores
            ? datos.errores.map((e) => e.mensaje).join(". ")
            : datos.mensaje || "Error al enviar la solicitud";
        throw new Error(mensajeError);
      }

      // Éxito: limpia el formulario y muestra el mensaje de confirmación
      setEnviado(true);
      setForm({ nombre: "", telefono: "", fecha: "", servicio: "", mensaje: "" });
      setDisponibilidad(null);
      setTimeout(() => setEnviado(false), 5000); // Oculta el mensaje en 5 segundos

    } catch (err) {
      // Error de red (backend apagado) o error devuelto por el servidor
      if (err.name === "TypeError") {
        setError("No se pudo conectar con el servidor. Por favor intenta más tarde.");
      } else {
        setError(err.message);
      }
    } finally {
      setEnviando(false);
    }
  };

  // Función para actualizar un campo del formulario
  const handleChange = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  return (
    <section id="contacto" style={{ ...styles.section, background: colors.cream }}>
      <div style={{ ...styles.container, maxWidth: 1000 }}>

        {/* ── Encabezado ── */}
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <div style={styles.tag}>📅 Agenda tu visita</div>
          <h2 style={styles.sectionTitle}>
            Reserva una <span style={{ color: colors.pink }}>cita</span>
          </h2>
          <p style={{ color: "#B07090", marginTop: 12, fontSize: "1.05rem" }}>
            Es rápido, fácil y tu hijo lo va a amar
          </p>
        </div>

        {/* ── Grid: Info + Formulario ── */}
        <div
          className="contact-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}
        >
          {/* Columna izquierda: información */}
          <div>
            {/* Datos de contacto */}
            <div style={{ ...styles.card, marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Baloo 2', cursive", fontSize: "1.3rem", fontWeight: 700, marginBottom: 20, color: colors.pink }}>
                📍 Información
              </h3>
              {[
                ["📍", doctora.direccion],
                ["📞", `${doctora.telefonoFijo} / ${doctora.telefono}`],
                ["⏰", doctora.horario],
                ["✉️", doctora.email],
              ].map(([icono, texto]) => (
                <div key={texto} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
                  <span style={{ fontSize: "1.2rem" }}>{icono}</span>
                  <span style={{ color: "#7A5060", fontSize: "0.95rem", lineHeight: 1.5 }}>{texto}</span>
                </div>
              ))}
            </div>

            {/* Banner primera cita gratis */}
            <div style={{
              background: `linear-gradient(135deg, ${colors.pink}, #FF5E9E)`,
              borderRadius: 24, padding: 28, color: "white", textAlign: "center",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>🎁</div>
              <h4 style={{ fontFamily: "'Baloo 2', cursive", fontSize: "1.3rem", fontWeight: 800, marginBottom: 8 }}>
                ¡Primera cita gratis!
              </h4>
              <p style={{ opacity: 0.9, fontSize: "0.95rem" }}>
                La primera evaluación para nuevos pacientes no tiene costo 🎉
              </p>
            </div>
          </div>

          {/* Columna derecha: formulario */}
          <div style={styles.card}>
            {enviado ? (
              // Mensaje de éxito al enviar
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: "4rem", marginBottom: 16 }}>🎉</div>
                <h3 style={{ fontFamily: "'Baloo 2', cursive", fontSize: "1.5rem", color: colors.mint, marginBottom: 8 }}>
                  ¡Solicitud enviada!
                </h3>
                <p style={{ color: "#B07090" }}>
                  Te contactaremos pronto para confirmar tu cita.
                </p>
              </div>
            ) : (
              // Formulario
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                {/* Mensaje de error (visible solo si hubo un problema) */}
                {error && (
                  <div style={{
                    background: "#FFF0F0",
                    border: "1px solid #FFB3B3",
                    borderRadius: 10,
                    padding: "12px 16px",
                    color: "#C0392B",
                    fontSize: "0.9rem",
                  }}>
                    ⚠️ {error}
                  </div>
                )}

                <div>
                  <label>Nombre del niño/a 👦</label>
                  <input
                    required
                    placeholder="Ej: Sofía García"
                    value={form.nombre}
                    onChange={(e) => handleChange("nombre", e.target.value)}
                    disabled={enviando}
                  />
                </div>

                <div>
                  <label>Teléfono de contacto 📞</label>
                  <input
                    required
                    placeholder="999 888 777"
                    value={form.telefono}
                    onChange={(e) => handleChange("telefono", e.target.value)}
                    disabled={enviando}
                  />
                </div>

                <div>
                  <label>Fecha preferida 📅</label>
                  <input
                    type="date"
                    required
                    value={form.fecha}
                    onChange={(e) => {
                      handleChange("fecha", e.target.value);
                      checkFecha(e.target.value);
                    }}
                    disabled={enviando}
                  />
                  {disponibilidad !== null && (
                    <div style={{
                      marginTop: 8,
                      padding: "8px 14px",
                      borderRadius: 10,
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      ...(disponibilidad.count >= MAX_DIA
                        ? { background: "#FFF0F0", color: "#C0392B", border: "1px solid #FFB3B3" }
                        : disponibilidad.count >= Math.ceil(MAX_DIA * 0.67)
                          ? { background: "#FFF8E1", color: "#856404", border: "1px solid #FFE082" }
                          : { background: "#E8FBF9", color: "#0A5235", border: "1px solid #4ECDC4" }),
                    }}>
                      {disponibilidad.count >= MAX_DIA
                        ? `🔴 Día lleno (${disponibilidad.count}/${MAX_DIA} citas). Por favor elige otra fecha.`
                        : disponibilidad.count >= Math.ceil(MAX_DIA * 0.67)
                          ? `🟡 Pocos lugares disponibles (${disponibilidad.count}/${MAX_DIA} citas agendadas).`
                          : disponibilidad.count === 0
                            ? `🟢 Día disponible, sin citas agendadas.`
                            : `🟢 Disponible (${disponibilidad.count}/${MAX_DIA} citas agendadas).`}
                    </div>
                  )}
                </div>

                <div>
                  <label>Servicio 🦷</label>
                  <select
                    value={form.servicio}
                    onChange={(e) => handleChange("servicio", e.target.value)}
                    disabled={enviando}
                  >
                    <option value="">Selecciona un servicio...</option>
                    {services.map((s) => (
                      <option key={s.nombre} value={s.nombre}>
                        {s.icon} {s.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Mensaje adicional 💬</label>
                  <textarea
                    rows={3}
                    placeholder="Cuéntanos algo sobre tu pequeño..."
                    value={form.mensaje}
                    onChange={(e) => handleChange("mensaje", e.target.value)}
                    style={{ resize: "vertical" }}
                    disabled={enviando}
                  />
                </div>

                <button
                  type="submit"
                  disabled={enviando}
                  style={{
                    ...styles.btnPrimary,
                    width: "100%",
                    fontSize: "1.05rem",
                    padding: "16px",
                    opacity: enviando ? 0.7 : 1,
                    cursor: enviando ? "not-allowed" : "pointer",
                  }}
                >
                  {enviando ? "Enviando..." : "📅 Solicitar cita"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
