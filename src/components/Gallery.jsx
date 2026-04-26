// ============================================================
// 📸 GALERÍA - Gallery.jsx
// ============================================================
// Muestra las tarjetas de los niños atendidos.
// Para agregar más niños, edita el array "gallery" en content.js
// ============================================================

import { gallery } from "../data/content";
import { colors, styles } from "../styles/globals";

export default function Gallery() {
  return (
    <section id="galeria" style={{ ...styles.section, background: colors.cream }}>
      <div style={styles.container}>

        {/* ── Encabezado ── */}
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <div style={styles.tag}>📸 Nuestros pacientes</div>
          <h2 style={styles.sectionTitle}>
            Niños con <span style={{ color: colors.coral }}>grandes sonrisas</span>
          </h2>
          <p style={{ color: "#B07090", marginTop: 12, fontSize: "1.05rem" }}>
            Cada visita es una nueva sonrisa para recordar
          </p>
        </div>

        {/* ── Grid de tarjetas de niños ── */}
        <div
          className="gallery-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}
        >
          {gallery.map((child, index) => (
            <ChildCard key={index} child={child} />
          ))}
        </div>

        {/* ── Llamada a la acción ── */}
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <p style={{ color: "#B07090", fontWeight: 600, marginBottom: 16 }}>
            ¿Tu hijo también quiere aparecer aquí? 😊
          </p>
          <a href="#contacto" style={styles.btnPrimary}>
            📅 Reserva su cita
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Componente interno: tarjeta de cada niño ─────────────────
function ChildCard({ child }) {
  return (
    <div
      className="card-hover"
      style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", cursor: "pointer" }}
    >
      {/* Fondo con emoji */}
      <div style={{
        background: child.color,
        height: 160,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "5rem",
      }}>
        {child.emoji}
      </div>

      {/* Nombre y edad */}
      <div style={{ background: "white", padding: "16px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: "1.1rem" }}>
          {child.nombre}
        </div>
        <div style={{ color: "#B07090", fontSize: "0.85rem", fontWeight: 600 }}>
          {child.edad}
        </div>
        <div style={{ marginTop: 8, fontSize: "0.8rem" }}>⭐⭐⭐⭐⭐</div>
      </div>
    </div>
  );
}
