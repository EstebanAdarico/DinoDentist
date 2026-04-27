// ============================================================
// 💬 TESTIMONIOS - Testimonials.jsx
// ============================================================
// Muestra los comentarios de los padres de familia.
// Para agregar más testimonios, edita "testimonials" en content.js
// ============================================================

import { testimonials } from "../data/content";
import { colors, styles } from "../styles/globals";

export default function Testimonials() {
  return (
    <section
      id="testimonios"
      style={{
        ...styles.section,
        background: "linear-gradient(135deg, #FFF0F8, #F0FFF8)",
        position: "relative",
      }}
    >
      <div style={styles.container}>

        {/* ── Encabezado ── */}
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <div style={styles.tag}>💬 Papás felices</div>
          <h2 style={styles.sectionTitle}>
            Lo que dicen<br />
            <span style={{ color: colors.lavender }}>las familias</span>
          </h2>
        </div>

        {/* ── Grid de testimonios ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {testimonials.map((testimonio, index) => (
            <TestimonialCard key={index} testimonio={testimonio} />
          ))}
        </div>
      </div>

      {/* Dino decorativo - Spinosaurus amarillo */}
      <img
        src="/images/dino-testimonials.png"
        alt=""
        aria-hidden="true"
        className="float2 dino-section-deco"
        style={{
          position: "absolute",
          top: 20,
          left: "-10px",
          width: 200,
          height: 200,
          objectFit: "contain",
          mixBlendMode: "multiply",
          opacity: 0.85,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
    </section>
  );
}

// ── Componente interno: cada tarjeta de testimonio ────────────
function TestimonialCard({ testimonio }) {
  return (
    <div className="card-hover" style={styles.card}>
      {/* Estrellas */}
      <div style={{ fontSize: "1.5rem", marginBottom: 12 }}>
        {"⭐".repeat(testimonio.estrellas)}
      </div>

      {/* Texto del testimonio */}
      <p style={{ color: "#5A3040", lineHeight: 1.7, fontSize: "1rem", marginBottom: 20, fontStyle: "italic" }}>
        "{testimonio.texto}"
      </p>

      {/* Nombre del padre */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 42, height: 42,
          background: "#FFE0EE",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.3rem",
        }}>
          👩
        </div>
        <div style={{ fontWeight: 700, color: colors.brown }}>
          {testimonio.padre}
        </div>
      </div>
    </div>
  );
}
