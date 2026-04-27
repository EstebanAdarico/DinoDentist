---
name: DinoDentis — contexto del proyecto
description: Stack, arquitectura y características clave del sitio web DinoDentis (clínica dental infantil)
type: project
---

DinoDentis es un sitio web para una clínica dental infantil construido en React 18 + Vite 5. No usa Tailwind — usa inline styles con un sistema de design tokens centralizado en `src/styles/globals.js` y datos de contenido en `src/data/content.js`.

**Why:** El proyecto está orientado a que el cliente final pueda editar textos y datos sin tocar código de componentes. Todo el contenido editable (nombre, servicios, testimonios, galería, links) vive en `content.js`. Los estilos reutilizables (colores, fuentes, botones, cards) viven en `globals.js`.

**Stack:**
- Frontend: React 18.2 + Vite 5.1 + react-router-dom 7
- Backend: Express (Node.js) en `/backend/`, puerto 3001
- Sin Tailwind — estilos con objetos JS y CSS inyectado via `<style>{globalCSS}</style>`
- Sin TypeScript, sin ESLint configurado
- Google Fonts: Baloo 2 (display) + Nunito (body)

**Estructura de rutas:**
- `/` → Landing (Navbar + Hero + Services + Gallery + Testimonials + Contact + Footer)
- `/admin` → Panel de administración de citas

**How to apply:** Al proponer cambios de estilos, usar el sistema de tokens existente (`colors`, `styles`, `fonts` de globals.js). No proponer Tailwind a menos que el cliente lo pida explícitamente.
