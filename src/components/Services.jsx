// ============================================================
// 🔧 SERVICIOS - Services.jsx
// ============================================================
// Muestra las tarjetas de servicios con ícono, nombre,
// descripción y precio. Los datos vienen de content.js
// ============================================================

import { services } from "../data/content";
import { colors, styles } from "../styles/globals";

export default function Services() {
  return (
    <section id="servicios" style={{ ...styles.section, background: "#FFF0F8" }}>
      <div style={styles.container}>

        {/* ── Encabezado de sección ── */}
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <div style={styles.tag}>🔧 Lo que hacemos</div>
          <h2 style={styles.sectionTitle}>
            Nuestros <span style={{ color: colors.mint }}>servicios</span>
          </h2>
          <p style={{ color: "#B07090", marginTop: 12, fontSize: "1.05rem" }}>
            Todo lo que tu pequeño necesita para una sonrisa perfecta
          </p>
        </div>

        {/* ── Grid de tarjetas ── */}
        <div
          className="services-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}
        >
          {services.map((servicio, index) => (
            <ServiceCard key={index} servicio={servicio} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Componente interno: tarjeta individual ────────────────────
// Separamos la tarjeta en su propio componente para que sea
// más fácil de editar y reutilizar
function ServiceCard({ servicio }) {
  return (
    <div
      className="card-hover"
      style={{
        ...styles.card,
        cursor: "pointer",
        border: "2px solid transparent",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = colors.pink)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
    >
      {/* Ícono */}
      <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{servicio.icon}</div>

      {/* Nombre */}
      <h3 style={{ fontFamily: "'Baloo 2', cursive", fontSize: "1.2rem", fontWeight: 700, marginBottom: 8 }}>
        {servicio.nombre}
      </h3>

      {/* Descripción */}
      <p style={{ color: "#B07090", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: 16 }}>
        {servicio.descripcion}
      </p>

      {/* Precio */}
      <div style={{
        background: "#FFF0F8",
        borderRadius: 12,
        padding: "8px 16px",
        display: "inline-block",
        fontWeight: 800,
        color: colors.pink,
        fontSize: "1rem",
      }}>
        {servicio.precio}
      </div>
    </div>
  );
}
