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

// ── Importar routing ────────────────────────────────────────
import { Routes, Route } from "react-router-dom";

// ── Importar componentes ─────────────────────────────────────
import Navbar       from "./components/Navbar";
import Hero         from "./components/Hero";
import Services     from "./components/Services";
import Gallery      from "./components/Gallery";
import Testimonials from "./components/Testimonials";
import Contact      from "./components/Contact";
import Footer       from "./components/Footer";

// ── Importar páginas ─────────────────────────────────────────
import Admin from "./pages/Admin";

// ── Importar estilos globales ────────────────────────────────
import { globalCSS } from "./styles/globals";

// ── Landing completa ─────────────────────────────────────────
function Landing() {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <div>
      {/* ── Estilos globales (animaciones, responsive, etc.) ── */}
      <style>{globalCSS}</style>

      <Routes>
        <Route path="/"      element={<Landing />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}
