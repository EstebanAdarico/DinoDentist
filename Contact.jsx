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

  // Estado para saber si el formulario fue enviado
  const [enviado, setEnviado] = useState(false);

  // Función que se ejecuta al presionar "Solicitar cita"
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // AQUÍ puedes conectar con tu backend, WhatsApp API, etc.
    // Por ahora solo muestra el mensaje de éxito
    console.log("Datos del formulario:", form); // Para depuración

    setEnviado(true);
    setTimeout(() => setEnviado(false), 4000); // Oculta el mensaje en 4 segundos
    setForm({ nombre: "", telefono: "", fecha: "", servicio: "", mensaje: "" });
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
                <div>
                  <label>Nombre del niño/a 👦</label>
                  <input
                    required
                    placeholder="Ej: Sofía García"
                    value={form.nombre}
                    onChange={(e) => handleChange("nombre", e.target.value)}
                  />
                </div>

                <div>
                  <label>Teléfono de contacto 📞</label>
                  <input
                    required
                    placeholder="999 888 777"
                    value={form.telefono}
                    onChange={(e) => handleChange("telefono", e.target.value)}
                  />
                </div>

                <div>
                  <label>Fecha preferida 📅</label>
                  <input
                    type="date"
                    required
                    value={form.fecha}
                    onChange={(e) => handleChange("fecha", e.target.value)}
                  />
                </div>

                <div>
                  <label>Servicio 🦷</label>
                  <select
                    value={form.servicio}
                    onChange={(e) => handleChange("servicio", e.target.value)}
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
                  />
                </div>

                <button
                  type="submit"
                  style={{ ...styles.btnPrimary, width: "100%", fontSize: "1.05rem", padding: "16px" }}
                >
                  📅 Solicitar cita
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
