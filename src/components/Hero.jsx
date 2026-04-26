// ============================================================
// 🌟 HERO - Hero.jsx
// ============================================================
// La sección principal que se ve al entrar a la página.
// Tiene el título grande, descripción, botones y estadísticas.
// ============================================================

import { estadisticas } from "../data/content";
import { colors, styles } from "../styles/globals";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="hero-section"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "100px 5% 60px",
        position: "relative",
        overflow: "hidden",
        background: colors.cream,
      }}
    >
      {/* ── Burbujas decorativas de fondo ── */}
      <div style={{ position: "absolute", width: 400, height: 400, background: colors.pink, borderRadius: "50%", opacity: 0.12, top: -100, right: -100, pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 200, height: 200, background: colors.mint, borderRadius: "50%", opacity: 0.15, bottom: 50, left: -50, pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 150, height: 150, background: colors.yellow, borderRadius: "50%", opacity: 0.2, top: "30%", left: "10%", pointerEvents: "none" }} />

      {/* ── Contenido principal ── */}
      <div
        className="hero-grid"
        style={{ ...styles.container, display: "flex", alignItems: "center", gap: 60, width: "100%" }}
      >
        {/* Columna izquierda: texto */}
        <div style={{ flex: 1 }}>
          {/* Etiqueta pequeña */}
          <div style={styles.tag}>🌟 Especialistas en niños</div>

          {/* Título principal */}
          <h1 style={{ ...styles.sectionTitle, fontSize: "clamp(2.5rem, 6vw, 4rem)", marginBottom: 20 }}>
            Dentista infantil en Arequipa{" "}
            <span style={{ color: colors.pink }}>que los niños aman 🦷</span>
          </h1>

          {/* Descripción */}
          <p style={{ fontSize: "1.15rem", lineHeight: 1.7, color: "#7A5060", marginBottom: 32, maxWidth: 500 }}>
            Creamos experiencias dentales positivas para que tu hijo ame cuidar su sonrisa.
            Sin miedo, con mucho amor y diversión.
          </p>

          {/* Botones de acción */}
          <div className="hero-buttons" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="#contacto" style={styles.btnPrimary}>📅 Reservar cita</a>
            <a href="#servicios" style={styles.btnSecondary}>Ver servicios</a>
          </div>

          {/* Estadísticas */}
          <div className="stats-row" style={{ display: "flex", gap: 32, marginTop: 40, flexWrap: "wrap" }}>
            {estadisticas.map((stat) => (
              <div key={stat.descripcion}>
                <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: "1.8rem", fontWeight: 800, color: colors.pink }}>
                  {stat.numero}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#B07090", fontWeight: 600 }}>
                  {stat.descripcion}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Columna derecha: ilustración animada */}
        <div className="hero-image" style={{ flex: 1, display: "flex", justifyContent: "center", position: "relative" }}>
          {/* Diente central flotante */}
          <div
            className="float"
            style={{
              width: 320, height: 320,
              background: "linear-gradient(135deg, #FFD6E8, #FFE8F5)",
              borderRadius: "60% 40% 60% 40%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "8rem",
              boxShadow: "0 20px 60px rgba(255,123,172,0.3)",
            }}
          >
            🦷
          </div>

          {/* Burbuja "Sin dolor" */}
          <div className="float2" style={{
            position: "absolute", top: 10, right: 10,
            background: "white", borderRadius: 20, padding: "12px 20px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.1)", fontWeight: 800, fontSize: "0.9rem",
          }}>
            😁 ¡Sin dolor!
          </div>

          {/* Burbuja "Divertido" */}
          <div className="float3" style={{
            position: "absolute", bottom: 20, left: 10,
            background: colors.yellow, borderRadius: 20, padding: "12px 20px",
            boxShadow: "0 8px 30px rgba(255,209,102,0.4)", fontWeight: 800, fontSize: "0.9rem",
          }}>
            🎈 ¡Divertido!
          </div>
        </div>
      </div>
    </section>
  );
}
