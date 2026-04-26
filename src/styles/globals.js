// ============================================================
// 🎨 ESTILOS GLOBALES - globals.js
// ============================================================
// Aquí están todos los colores y estilos base.
// Si quieres cambiar un color, cámbialo aquí y se aplica
// automáticamente en toda la página.
// ============================================================

// ── COLORES PRINCIPALES ──────────────────────────────────────
export const colors = {
  pink:     "#FF7BAC",   // Rosa principal (botones, títulos)
  mint:     "#4ECDC4",   // Verde menta (acentos)
  yellow:   "#FFD166",   // Amarillo (etiquetas)
  lavender: "#C3B1E1",   // Lavanda (sección testimonios)
  coral:    "#FF6B6B",   // Coral (galería)
  cream:    "#FFFAF5",   // Fondo principal
  brown:    "#3D2B1F",   // Texto oscuro
  lightPink:"#FFF0F5",   // Fondo rosa claro
};

// ── FUENTES ──────────────────────────────────────────────────
export const fonts = {
  display: "'Baloo 2', cursive",   // Para títulos grandes
  body:    "'Nunito', sans-serif", // Para texto normal
};

// ── GOOGLE FONTS (pega esto en tu index.html o App.jsx) ──────
export const googleFontsUrl =
  "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Baloo+2:wght@700;800&display=swap";

// ── ESTILOS REUTILIZABLES ────────────────────────────────────
// Son objetos de estilo que se usan en múltiples componentes

export const styles = {
  // Botón principal (rosado)
  btnPrimary: {
    background: colors.pink,
    color: "white",
    border: "none",
    padding: "14px 32px",
    borderRadius: "50px",
    fontFamily: fonts.body,
    fontWeight: 800,
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(255,123,172,0.4)",
    textDecoration: "none",
    display: "inline-block",
    transition: "all 0.2s",
  },

  // Botón secundario (blanco con borde rosado)
  btnSecondary: {
    background: "white",
    color: colors.pink,
    border: `2.5px solid ${colors.pink}`,
    padding: "12px 28px",
    borderRadius: "50px",
    fontFamily: fonts.body,
    fontWeight: 800,
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.2s",
    textDecoration: "none",
    display: "inline-block",
  },

  // Tarjeta blanca con sombra
  card: {
    background: "white",
    borderRadius: "24px",
    padding: "28px 24px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
    transition: "all 0.25s",
  },

  // Etiqueta pequeña (como "🌟 Especialistas en niños")
  tag: {
    display: "inline-block",
    background: colors.yellow,
    color: colors.brown,
    padding: "4px 14px",
    borderRadius: "20px",
    fontWeight: 800,
    fontSize: "0.8rem",
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "12px",
  },

  // Título de sección
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: "clamp(2rem, 5vw, 3rem)",
    fontWeight: 800,
    lineHeight: 1.1,
  },

  // Contenedor con ancho máximo centrado
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  // Sección con padding
  section: {
    padding: "80px 5%",
  },
};

// ── CSS GLOBAL (como string, para inyectar con <style>) ───────
export const globalCSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Nunito', sans-serif; background: #FFFAF5; color: #3D2B1F; overflow-x: hidden; }

  /* Animación flotante */
  .float  { animation: float 3s ease-in-out infinite; }
  .float2 { animation: float 3s ease-in-out infinite 1s; }
  .float3 { animation: float 3s ease-in-out infinite 2s; }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

  /* Hover en tarjetas */
  .card-hover { transition: all 0.25s; }
  .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important; }

  /* Inputs del formulario */
  input, select, textarea {
    width: 100%; padding: 14px 18px;
    border: 2px solid #F0E0EA; border-radius: 16px;
    font-family: 'Nunito', sans-serif; font-size: 1rem;
    color: #3D2B1F; background: white; outline: none;
    transition: border 0.2s;
  }
  input:focus, select:focus, textarea:focus { border-color: #FF7BAC; }
  label { font-weight: 700; font-size: 0.9rem; color: #8B5E78; display: block; margin-bottom: 6px; }

  /* mobile-only: visible solo en movil */
  .mobile-only { display: none; }

  /* Responsive - tablets y moviles */
  @media (max-width: 768px) {
    .hide-mobile   { display: none !important; }
    .mobile-only   { display: block !important; }
    .services-grid { grid-template-columns: 1fr 1fr !important; }
    .gallery-grid  { grid-template-columns: repeat(2, 1fr) !important; }
    .contact-grid  { grid-template-columns: 1fr !important; }
    .hero-grid     { flex-direction: column !important; text-align: center; }
    .stats-row     { justify-content: center !important; }
    .hero-buttons  { justify-content: center !important; }
    .hero-image    { display: none !important; }
    .hero-section  { min-height: auto !important; padding-top: 90px !important; padding-bottom: 50px !important; }
  }

  /* Responsive - phones pequenos */
  @media (max-width: 480px) {
    .services-grid { grid-template-columns: 1fr !important; }
    .gallery-grid  { grid-template-columns: repeat(2, 1fr) !important; }
    .stats-row     { gap: 20px !important; }
  }
`;
