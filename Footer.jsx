// ============================================================
// 🔚 FOOTER - Footer.jsx
// ============================================================
// Pie de página con nombre, especialidad y redes sociales.
// ============================================================

import { doctora } from "../data/content";
import { colors } from "../styles/globals";

export default function Footer() {
  return (
    <footer style={{
      background: "#3D2B1F",
      color: "white",
      padding: "40px 5%",
      textAlign: "center",
    }}>
      {/* Logo */}
      <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: "1.5rem", fontWeight: 800, color: colors.pink, marginBottom: 8 }}>
        🦷 {doctora.nombre}
      </div>

      {/* Especialidad y ciudad */}
      <p style={{ opacity: 0.6, fontSize: "0.9rem", marginBottom: 16 }}>
        {doctora.especialidad} · Lima, Perú
      </p>

      {/* Redes sociales */}
      <div style={{ display: "flex", gap: 20, justifyContent: "center", marginBottom: 20, flexWrap: "wrap" }}>
        <a href={doctora.facebook} target="_blank" rel="noreferrer"
          style={{ opacity: 0.7, cursor: "pointer", fontSize: "0.9rem", color: "white", textDecoration: "none", transition: "opacity 0.2s" }}
          onMouseEnter={(e) => (e.target.style.opacity = 1)}
          onMouseLeave={(e) => (e.target.style.opacity = 0.7)}
        >
          📘 Facebook
        </a>
        <a href={doctora.instagram} target="_blank" rel="noreferrer"
          style={{ opacity: 0.7, cursor: "pointer", fontSize: "0.9rem", color: "white", textDecoration: "none", transition: "opacity 0.2s" }}
          onMouseEnter={(e) => (e.target.style.opacity = 1)}
          onMouseLeave={(e) => (e.target.style.opacity = 0.7)}
        >
          📸 Instagram
        </a>
        <a href={`https://wa.me/${doctora.whatsapp}`} target="_blank" rel="noreferrer"
          style={{ opacity: 0.7, cursor: "pointer", fontSize: "0.9rem", color: "white", textDecoration: "none", transition: "opacity 0.2s" }}
          onMouseEnter={(e) => (e.target.style.opacity = 1)}
          onMouseLeave={(e) => (e.target.style.opacity = 0.7)}
        >
          💬 WhatsApp
        </a>
      </div>

      {/* Copyright */}
      <p style={{ opacity: 0.4, fontSize: "0.8rem" }}>
        © {new Date().getFullYear()} {doctora.nombre} · Todos los derechos reservados
      </p>
    </footer>
  );
}
