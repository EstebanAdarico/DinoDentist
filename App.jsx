// ============================================================
// 🏠 APP PRINCIPAL - App.jsx
// ============================================================
// Este es el archivo central que une todos los componentes.
// El orden aquí define el orden de las secciones en la página.
//
// Para agregar o quitar una sección:
//   - Importa el componente arriba
//   - Agrégalo o quítalo dentro del <div> principal
// ============================================================

// ── Importar componentes ─────────────────────────────────────
import Navbar       from "./components/Navbar";
import Hero         from "./components/Hero";
import Services     from "./components/Services";
import Gallery      from "./components/Gallery";
import Testimonials from "./components/Testimonials";
import Contact      from "./components/Contact";
import Footer       from "./components/Footer";

// ── Importar estilos globales ────────────────────────────────
import { globalCSS, googleFontsUrl } from "./styles/globals";

export default function App() {
  return (
    <div>
      {/* ── Fuentes de Google ── */}
      <link href={googleFontsUrl} rel="stylesheet" />

      {/* ── Estilos globales (animaciones, responsive, etc.) ── */}
      <style>{globalCSS}</style>

      {/* ── Menú de navegación (fijo arriba) ── */}
      <Navbar />

      {/* ── Secciones de la página (en orden) ── */}
      <main>
        <Hero />          {/* Sección principal con título y botones  */}
        <Services />      {/* Tarjetas de servicios y precios         */}
        <Gallery />       {/* Galería de niños atendidos              */}
        <Testimonials />  {/* Testimonios de padres                   */}
        <Contact />       {/* Formulario de citas e información       */}
      </main>

      {/* ── Pie de página ── */}
      <Footer />
    </div>
  );
}
