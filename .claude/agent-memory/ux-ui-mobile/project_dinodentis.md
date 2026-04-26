---
name: DinoDentis project context
description: Stack, design system, and key architectural decisions for the DinoDentis pediatric dental clinic app
type: project
---

DinoDentis is a React + Vite frontend (`/src`) with an Express backend (`/backend`) running on localhost:3001.

**Why:** Pediatric dental clinic landing page + internal admin panel for managing appointments.

**How to apply:** Always use inline styles with the existing design system from `src/styles/globals.js` (no CSS modules, no Tailwind, no external UI libs). Import colors/fonts/styles from `../styles/globals` and data from `../data/content`.

Key design tokens:
- Admin panel background: `#F8F0F5` (distinct from landing cream `#FFFAF5`)
- Table header: `#FF7BAC` background, white text
- Estado badges: pendiente `#FFF3CD/#856404`, confirmada `#D1E7DD/#0A5235`, cancelada `#F8D7DA/#842029`
- Fonts: display `'Baloo 2', cursive`, body `'Nunito', sans-serif`

Routing: `/` = landing, `/admin` = admin panel (react-router-dom v7, BrowserRouter in main.jsx).

Backend appointment endpoints: GET/POST `/api/appointments`, GET `/api/appointments/stats`, GET `/api/appointments/export.ics`, GET/PATCH/DELETE `/api/appointments/:id` and `/:id/status`.

Admin panel features: stats cards, filters (estado/servicio/fecha), paginated table with optimistic status updates, delete with confirm(), .ics export via blob download.
