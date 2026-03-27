// ============================================================
// 🔝 NAVBAR - Navbar.jsx
// ============================================================
// Este es el menú de navegación que aparece fijo en la parte
// superior de la página. Se mantiene visible mientras scrolleas.
// ============================================================

import { useState } from "react";
import { doctora, navLinks } from "../data/content";
import { colors, styles } from "../styles/globals";

export default function Navbar() {
  // Estado para mostrar/ocultar el menú en móvil
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      width: "100%",
      zIndex: 100,
      background: "rgba(255,250,245,0.95)",
      backdropFilter: "blur(10px)",
      borderBottom: "2px solid #FFE0EE",
      padding: "0 5%",
    }}>
      {/* ── Barra principal ── */}
      <div style={{
        ...styles.container,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: 70,
      }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "2rem" }}>🦷</span>
          <div>
            <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: "1.2rem", color: colors.pink, lineHeight: 1 }}>
              {doctora.nombre}
            </div>
            <div style={{ fontSize: "0.7rem", color: "#B07090", fontWeight: 600 }}>
              {doctora.especialidad}
            </div>
          </div>
        </div>

        {/* Links en pantalla grande */}
        <div className="hide-mobile" style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{ textDecoration: "none", color: colors.brown, fontWeight: 700, fontSize: "0.95rem", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target.style.color = colors.pink)}
              onMouseLeave={(e) => (e.target.style.color = colors.brown)}
            >
              {link.label}
            </a>
          ))}
          {/* Botón de cita */}
          <a href="#contacto" style={{ ...styles.btnPrimary, padding: "10px 22px", fontSize: "0.9rem" }}>
            📅 Pedir cita
          </a>
        </div>

        {/* Botón hamburguesa para móvil */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", fontSize: "1.8rem", cursor: "pointer", display: "none" }}
          className="mobile-only"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* ── Menú desplegable en móvil ── */}
      {menuOpen && (
        <div style={{ background: "white", padding: "20px 5%", borderTop: "1px solid #FFE0EE", display: "flex", flexDirection: "column", gap: 16 }}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{ textDecoration: "none", color: colors.brown, fontWeight: 700, fontSize: "1.05rem" }}
            >
              {link.label}
            </a>
          ))}
          <a href="#contacto" onClick={() => setMenuOpen(false)} style={{ ...styles.btnPrimary, textAlign: "center" }}>
            📅 Pedir cita
          </a>
        </div>
      )}
    </nav>
  );
}
