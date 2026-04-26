// ============================================================
// 📋 ARCHIVO DE CONTENIDO - content.js
// ============================================================
// Aquí puedes editar TODOS los textos, precios y datos
// sin tocar el código principal. ¡Es tu panel de control!
// ============================================================

// ── INFORMACIÓN DE LA DOCTORA ────────────────────────────────
export const doctora = {
  nombre: "DinoDentist",           // ← Cambia el nombre aquí
  especialidad: "Odontología Infantil",
  telefono: "999 888 777",              // ← Tu número real
  telefonoFijo: "(01) 234-5678",
  email: "contacto@dralopez.pe",        // ← Tu email real
  direccion: "Av. Dental 456, Lima, Perú", // ← Tu dirección real
  horario: "Lun–Vie: 9am–6pm | Sáb: 9am–1pm",
  facebook: "https://facebook.com/",    // ← Tu Facebook real
  instagram: "https://instagram.com/",  // ← Tu Instagram real
  whatsapp: "51999888777",              // ← Tu WhatsApp (con código de país)
};

// ── ESTADÍSTICAS DE LA CLÍNICA ───────────────────────────────
export const estadisticas = [
  { numero: "500+", descripcion: "Niños atendidos" },
  { numero: "8+",   descripcion: "Años de experiencia" },
  { numero: "⭐ 5.0", descripcion: "Calificación" },
];

// ── LISTA DE SERVICIOS ───────────────────────────────────────
// Para agregar un servicio: copia un bloque { } y pégalo al final
export const services = [
  {
    icon: "🦷",
    nombre: "Limpieza Dental",
    descripcion: "Profilaxis y sellantes para dientes sanos",
    precio: "S/ 80",
  },
  {
    icon: "✨",
    nombre: "Blanqueamiento",
    descripcion: "Sonrisas más brillantes y seguras",
    precio: "S/ 200",
  },
  {
    icon: "🎀",
    nombre: "Ortodoncia",
    descripcion: "Brackets y alineadores para niños",
    precio: "Desde S/ 150",
  },
  {
    icon: "🛡️",
    nombre: "Flúor",
    descripcion: "Protección contra caries",
    precio: "S/ 40",
  },
  {
    icon: "🔍",
    nombre: "Revisión Completa",
    descripcion: "Chequeo completo y radiografías",
    precio: "S/ 60",
  },
  {
    icon: "🌟",
    nombre: "Emergencias",
    descripcion: "Atención rápida cuando más lo necesitas",
    precio: "S/ 100",
  },
];

// ── GALERÍA DE NIÑOS ATENDIDOS ───────────────────────────────
// Para agregar un niño: copia un bloque { } y pégalo al final
// Los colores son el fondo de la tarjeta
export const gallery = [
  { nombre: "Sofía",    edad: "7 años",  emoji: "😁", color: "#FFD6E0" },
  { nombre: "Mateo",    edad: "5 años",  emoji: "😄", color: "#D6EAFF" },
  { nombre: "Valeria",  edad: "9 años",  emoji: "😊", color: "#D6FFE8" },
  { nombre: "Lucas",    edad: "6 años",  emoji: "😃", color: "#FFF3D6" },
  { nombre: "Isabella", edad: "8 años",  emoji: "🥰", color: "#EDD6FF" },
  { nombre: "Sebastián",edad: "4 años",  emoji: "😁", color: "#FFE8D6" },
  { nombre: "Camila",   edad: "10 años", emoji: "😊", color: "#D6FFFD" },
  { nombre: "Emilio",   edad: "7 años",  emoji: "😄", color: "#FFD6F0" },
];

// ── TESTIMONIOS DE PADRES ────────────────────────────────────
export const testimonials = [
  {
    padre: "Mamá de Sofía",
    texto: "Mi hija llegaba con miedo y ahora pide ir a su cita. ¡Increíble!",
    estrellas: 5,
  },
  {
    padre: "Papá de Mateo",
    texto: "La Dra. es súper paciente y gentil con los niños. 100% recomendada.",
    estrellas: 5,
  },
  {
    padre: "Mamá de Valeria",
    texto: "El consultorio es muy acogedor. Valeria salió con una gran sonrisa.",
    estrellas: 5,
  },
];

// ── NAVEGACIÓN ───────────────────────────────────────────────
export const navLinks = [
  { label: "Inicio",      href: "#inicio" },
  { label: "Servicios",   href: "#servicios" },
  { label: "Galería",     href: "#galeria" },
  { label: "Testimonios", href: "#testimonios" },
  { label: "Contacto",    href: "#contacto" },
];
