# 🦷 Página Web - Odontóloga Infantil

## ¿Cómo está organizado este proyecto?

```
dental-project/
│
├── README.md              ← Este archivo (guía del proyecto)
│
└── src/
    ├── data/
    │   └── content.js     ← Aquí editas textos, precios, nombres, etc.
    │
    ├── styles/
    │   └── globals.js     ← Colores y estilos globales
    │
    ├── components/
    │   ├── Navbar.jsx     ← Menú de navegación superior
    │   ├── Hero.jsx       ← Sección principal (la primera que se ve)
    │   ├── Services.jsx   ← Tarjetas de servicios y precios
    │   ├── Gallery.jsx    ← Galería de niños atendidos
    │   ├── Testimonials.jsx ← Comentarios de padres
    │   ├── Contact.jsx    ← Formulario de citas
    │   └── Footer.jsx     ← Pie de página
    │
    └── App.jsx            ← Archivo principal que une todo
```

## 🚀 ¿Cómo iniciar el proyecto?

1. Abre la terminal en VS Code
2. Escribe: `npm install`
3. Luego: `npm run dev`
4. Abre tu navegador en: http://localhost:5173

## ✏️ ¿Qué puedo editar fácilmente?

- **Textos y precios** → `src/data/content.js`
- **Colores** → `src/styles/globals.js`
- **Cada sección** → su archivo en `src/components/`

## 📝 Notas importantes

- Cada archivo tiene comentarios que explican qué hace cada parte
- Si quieres cambiar el nombre de la doctora, búscalo en `content.js`
- Si quieres agregar más servicios, edita el array `services` en `content.js`
