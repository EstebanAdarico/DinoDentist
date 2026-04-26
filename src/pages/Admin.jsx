// ============================================================
// PANEL DE ADMINISTRACION - Admin.jsx
// ============================================================
// Panel interno para gestionar las citas de DinoDentis.
// Muestra estadisticas, filtros, tabla de citas y acciones.
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { colors, fonts } from "../styles/globals";

// ── Constantes ───────────────────────────────────────────────
const API = "http://localhost:3001/api/appointments";

const SERVICIOS = [
  "Limpieza Dental",
  "Blanqueamiento",
  "Ortodoncia",
  "Fluor",
  "Revision Completa",
  "Emergencias",
];

const ESTADO_STYLES = {
  pendiente:  { background: "#FFF3CD", color: "#856404" },
  confirmada: { background: "#D1E7DD", color: "#0A5235" },
  cancelada:  { background: "#F8D7DA", color: "#842029" },
};

const ADMIN_BG = "#F8F0F5";
const LIMIT    = 20;

// ── Helpers ──────────────────────────────────────────────────
function formatFecha(fechaStr) {
  if (!fechaStr) return "—";
  const [y, m, d] = fechaStr.split("T")[0].split("-");
  return `${d}/${m}/${y}`;
}

function toIcsDate(fechaStr) {
  // fechaStr: "2024-06-15T10:00:00.000Z" o "2024-06-15"
  const base = fechaStr.split("T")[0].replace(/-/g, "");
  return `${base}T100000`;
}

function toIcsDateEnd(fechaStr) {
  const base = fechaStr.split("T")[0].replace(/-/g, "");
  return `${base}T110000`;
}

// ── Subcomponentes ───────────────────────────────────────────

function AdminCalendar({ appointmentDates, selectedDate, onSelectDate }) {
  const [viewDate, setViewDate] = useState(() => new Date());

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthLabel = new Date(year, month, 1).toLocaleDateString("es-PE", {
    month: "long",
    year:  "numeric",
  });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startOffset     = (firstDayOfMonth + 6) % 7; // lunes = 0
  const daysInMonth     = new Date(year, month + 1, 0).getDate();

  const today    = new Date();
  const todayStr = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  function dayBg(count, isSelected, isToday) {
    if (isSelected) return colors.pink;
    if (count >= 5) return "#FF7BAC";
    if (count >= 3) return "#FFB3D1";
    if (count >= 1) return "#FFF0F8";
    if (isToday)    return "#E8FBF9";
    return "transparent";
  }

  function dayTextColor(count, isSelected) {
    if (isSelected)  return "white";
    if (count >= 5)  return "white";
    return colors.brown;
  }

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div style={{
      background: "white",
      borderRadius: 16,
      padding: "20px 24px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      marginBottom: 20,
    }}>
      {/* Header del calendario */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: "1.1rem", color: colors.brown }}>
          📅 Calendario de citas
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
            style={{ background: "none", border: `2px solid #F0E0EA`, borderRadius: 8, cursor: "pointer", padding: "4px 12px", fontWeight: 800, fontSize: "1rem", color: colors.brown, transition: "all 0.15s" }}
          >
            ‹
          </button>
          <span style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: "0.95rem", color: colors.brown, minWidth: 170, textAlign: "center" }}>
            {monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}
          </span>
          <button
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
            style={{ background: "none", border: `2px solid #F0E0EA`, borderRadius: 8, cursor: "pointer", padding: "4px 12px", fontWeight: 800, fontSize: "1rem", color: colors.brown, transition: "all 0.15s" }}
          >
            ›
          </button>
        </div>

        {selectedDate && (
          <button
            onClick={() => onSelectDate("")}
            style={{ background: colors.lightPink, color: colors.pink, border: `2px solid ${colors.pink}`, borderRadius: 20, padding: "5px 16px", fontFamily: fonts.body, fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}
          >
            Limpiar selección
          </button>
        )}
      </div>

      {/* Nombres de días */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 6 }}>
        {["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: "0.72rem", fontWeight: 800, color: "#B07090", padding: "4px 0" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Grid de días */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} />;

          const dateStr    = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const count      = appointmentDates[dateStr] || 0;
          const isSelected = selectedDate === dateStr;
          const isToday    = dateStr === todayStr;

          return (
            <button
              key={day}
              onClick={() => onSelectDate(isSelected ? "" : dateStr)}
              title={count > 0 ? `${count} cita${count !== 1 ? "s" : ""} este día` : isToday ? "Hoy" : undefined}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                padding: "6px 2px",
                minHeight: 52,
                borderRadius: 10,
                border: isSelected
                  ? `2px solid ${colors.pink}`
                  : isToday
                    ? `2px solid ${colors.mint}`
                    : "2px solid transparent",
                background: dayBg(count, isSelected, isToday),
                color: dayTextColor(count, isSelected),
                fontFamily: fonts.body,
                fontWeight: count > 0 || isToday ? 800 : 500,
                fontSize: "0.88rem",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = colors.pink;
                  e.currentTarget.style.transform = "scale(1.05)";
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = isToday ? colors.mint : "transparent";
                  e.currentTarget.style.transform = "scale(1)";
                }
              }}
            >
              {day}
              {count > 0 && (
                <span style={{
                  background: isSelected || count >= 5 ? "rgba(255,255,255,0.35)" : colors.pink,
                  color: "white",
                  fontSize: "0.62rem",
                  fontWeight: 800,
                  borderRadius: 20,
                  padding: "1px 6px",
                  lineHeight: 1.5,
                  minWidth: 18,
                  textAlign: "center",
                }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Leyenda */}
      <div style={{ display: "flex", gap: 18, marginTop: 14, flexWrap: "wrap", fontSize: "0.76rem", color: "#999", borderTop: "1px solid #F5E8EF", paddingTop: 12 }}>
        {[
          { bg: "#FFF0F8", border: `1px solid ${colors.pink}`, label: "1–2 citas" },
          { bg: "#FFB3D1", border: "none",                      label: "3–4 citas" },
          { bg: colors.pink, border: "none",                    label: "5+ citas" },
          { bg: "#E8FBF9", border: `1px solid ${colors.mint}`,  label: "Hoy" },
          { bg: colors.pink, border: "none", outline: true,     label: "Seleccionado" },
        ].map(({ bg, border, label }) => (
          <span key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 12, height: 12, borderRadius: 4, background: bg, border, display: "inline-block", flexShrink: 0 }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
      <div
        style={{
          width: 44,
          height: 44,
          border: `4px solid ${colors.lightPink}`,
          borderTop: `4px solid ${colors.pink}`,
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function StatCard({ label, value, borderColor, textColor }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        padding: "20px 24px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        borderLeft: `5px solid ${borderColor}`,
        flex: "1 1 160px",
        minWidth: 140,
      }}
    >
      <div
        style={{
          fontFamily: fonts.body,
          fontSize: "0.8rem",
          fontWeight: 700,
          color: "#8B7080",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: "2.2rem",
          fontWeight: 800,
          color: textColor || colors.brown,
          lineHeight: 1,
        }}
      >
        {value ?? "—"}
      </div>
    </div>
  );
}

function EstadoBadge({ estado }) {
  const s = ESTADO_STYLES[estado] || { background: "#eee", color: "#555" };
  return (
    <span
      style={{
        ...s,
        padding: "4px 12px",
        borderRadius: 20,
        fontWeight: 700,
        fontSize: "0.78rem",
        fontFamily: fonts.body,
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      {estado ? estado.charAt(0).toUpperCase() + estado.slice(1) : "—"}
    </span>
  );
}

// ── Componente principal ─────────────────────────────────────
export default function Admin() {
  // Stats
  const [stats, setStats]       = useState(null);
  const [statsError, setStatsError] = useState(false);

  // Citas
  const [citas, setCitas]       = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // Filtros
  const [filtroEstado,   setFiltroEstado]   = useState("");
  const [filtroServicio, setFiltroServicio] = useState("");
  const [filtroFecha,    setFiltroFecha]    = useState("");
  const [page,           setPage]           = useState(1);

  // Hover states para botones
  const [hoveredRow,     setHoveredRow]     = useState(null);
  const [downloadingIcs, setDownloadingIcs] = useState(false);

  // Datos del calendario (fecha -> cantidad de citas)
  const [appointmentDates, setAppointmentDates] = useState({});

  // ── Cargar estadisticas ──────────────────────────────────
  useEffect(() => {
    fetch(`${API}/stats`)
      .then(r => r.json())
      .then(data => {
        if (data.ok) setStats(data.stats);
        else setStatsError(true);
      })
      .catch(() => setStatsError(true));
  }, []);

  // ── Cargar fechas para el calendario ────────────────────
  const fetchCalendarDates = useCallback(() => {
    fetch(`${API}?limit=1000`)
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          const counts = {};
          const all = data.citas ?? data.appointments ?? [];
          all.forEach(c => {
            const day = c.fecha?.split("T")[0];
            if (day) counts[day] = (counts[day] || 0) + 1;
          });
          setAppointmentDates(counts);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchCalendarDates();
  }, [fetchCalendarDates]);

  // ── Cargar citas ─────────────────────────────────────────
  const fetchCitas = useCallback(() => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (filtroEstado)   params.set("estado",   filtroEstado);
    if (filtroServicio) params.set("servicio",  filtroServicio);
    if (filtroFecha)    params.set("fecha",     filtroFecha);
    params.set("page",  page);
    params.set("limit", LIMIT);

    fetch(`${API}?${params}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        if (data.ok) {
          setCitas(data.citas ?? data.appointments ?? []);
          setTotal(data.total ?? 0);
        } else {
          setError(data.mensaje || "Error al cargar las citas.");
        }
      })
      .catch(err => setError(`No se pudo conectar al servidor. (${err.message})`))
      .finally(() => setLoading(false));
  }, [filtroEstado, filtroServicio, filtroFecha, page]);

  useEffect(() => {
    fetchCitas();
  }, [fetchCitas]);

  // ── Cambiar estado (optimista) ────────────────────────────
  const handleCambiarEstado = async (id, nuevoEstado) => {
    // Actualizar UI de inmediato
    setCitas(prev =>
      prev.map(c => c.id === id ? { ...c, estado: nuevoEstado } : c)
    );

    try {
      const r = await fetch(`${API}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      // Recargar stats en background
      fetch(`${API}/stats`)
        .then(r => r.json())
        .then(d => { if (d.ok) setStats(d.stats); });
    } catch {
      // Revertir si falla
      fetchCitas();
      alert("Error al actualizar el estado. Por favor intenta de nuevo.");
    }
  };

  // ── Eliminar cita ─────────────────────────────────────────
  const handleEliminar = async (id) => {
    if (!confirm(`¿Eliminar la cita #${id}? Esta accion no se puede deshacer.`)) return;

    try {
      const r = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setCitas(prev => prev.filter(c => c.id !== id));
      setTotal(prev => Math.max(0, prev - 1));
      fetch(`${API}/stats`)
        .then(r => r.json())
        .then(d => { if (d.ok) setStats(d.stats); });
      fetchCalendarDates();
    } catch {
      alert("Error al eliminar la cita. Por favor intenta de nuevo.");
    }
  };

  // ── Descargar .ics ────────────────────────────────────────
  const handleDownloadIcs = async () => {
    setDownloadingIcs(true);
    try {
      const r = await fetch(`${API}/export.ics`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const blob = await r.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = "citas-dinodentis.ics";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("No se pudo descargar el archivo .ics. Verifica que el servidor este activo.");
    } finally {
      setDownloadingIcs(false);
    }
  };

  // ── Limpiar filtros ───────────────────────────────────────
  const limpiarFiltros = () => {
    setFiltroEstado("");
    setFiltroServicio("");
    setFiltroFecha("");
    setPage(1);
  };

  // ── Paginacion ────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  // ── Render ────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: ADMIN_BG,
        fontFamily: fonts.body,
        color: colors.brown,
      }}
    >
      {/* ── HEADER ─────────────────────────────────────────── */}
      <header
        style={{
          background: "white",
          borderBottom: `3px solid ${colors.lightPink}`,
          padding: "0 5%",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 2px 12px rgba(255,123,172,0.1)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            padding: "14px 0",
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
              fontWeight: 800,
              color: colors.pink,
            }}
          >
            DinoDentis — Panel Admin
          </div>

          {/* Acciones del header */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link
              to="/"
              style={{
                background: "white",
                color: colors.pink,
                border: `2px solid ${colors.pink}`,
                padding: "9px 18px",
                borderRadius: 50,
                fontWeight: 700,
                fontSize: "0.88rem",
                textDecoration: "none",
                fontFamily: fonts.body,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.2s",
              }}
            >
              Volver al sitio
            </Link>

            <button
              onClick={handleDownloadIcs}
              disabled={downloadingIcs}
              style={{
                background: colors.mint,
                color: "white",
                border: "none",
                padding: "9px 18px",
                borderRadius: 50,
                fontWeight: 700,
                fontSize: "0.88rem",
                fontFamily: fonts.body,
                cursor: downloadingIcs ? "not-allowed" : "pointer",
                opacity: downloadingIcs ? 0.7 : 1,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.2s",
              }}
            >
              {downloadingIcs ? "Descargando..." : "Descargar .ics"}
            </button>
          </div>
        </div>
      </header>

      {/* ── CONTENIDO ──────────────────────────────────────── */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 5% 60px" }}>

        {/* ── STATS ────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 28,
          }}
        >
          {statsError ? (
            <p style={{ color: colors.coral, fontWeight: 700, padding: "12px 0" }}>
              No se pudieron cargar las estadisticas.
            </p>
          ) : (
            <>
              <StatCard
                label="Total Citas"
                value={stats?.total}
                borderColor={colors.pink}
                textColor={colors.brown}
              />
              <StatCard
                label="Pendientes"
                value={stats?.pendientes}
                borderColor={colors.yellow}
                textColor="#856404"
              />
              <StatCard
                label="Confirmadas"
                value={stats?.confirmadas}
                borderColor={colors.mint}
                textColor="#0A5235"
              />
              <StatCard
                label="Canceladas"
                value={stats?.canceladas}
                borderColor={colors.coral}
                textColor="#842029"
              />
            </>
          )}
        </div>

        {/* ── CALENDARIO ───────────────────────────────────── */}
        <AdminCalendar
          appointmentDates={appointmentDates}
          selectedDate={filtroFecha}
          onSelectDate={(date) => { setFiltroFecha(date); setPage(1); }}
        />

        {/* ── FILTROS ──────────────────────────────────────── */}
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: "18px 20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            marginBottom: 20,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          {/* Select estado */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: "1 1 140px" }}>
            <label
              style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "#8B7080",
                textTransform: "uppercase",
                letterSpacing: "0.4px",
              }}
            >
              Estado
            </label>
            <select
              value={filtroEstado}
              onChange={e => { setFiltroEstado(e.target.value); setPage(1); }}
              style={{
                width: "100%",
                padding: "10px 14px",
                border: `2px solid #F0E0EA`,
                borderRadius: 12,
                fontFamily: fonts.body,
                fontSize: "0.9rem",
                color: colors.brown,
                background: "white",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          {/* Select servicio */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: "1 1 180px" }}>
            <label
              style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "#8B7080",
                textTransform: "uppercase",
                letterSpacing: "0.4px",
              }}
            >
              Servicio
            </label>
            <select
              value={filtroServicio}
              onChange={e => { setFiltroServicio(e.target.value); setPage(1); }}
              style={{
                width: "100%",
                padding: "10px 14px",
                border: `2px solid #F0E0EA`,
                borderRadius: 12,
                fontFamily: fonts.body,
                fontSize: "0.9rem",
                color: colors.brown,
                background: "white",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="">Todos</option>
              {SERVICIOS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Input fecha */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: "1 1 160px" }}>
            <label
              style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "#8B7080",
                textTransform: "uppercase",
                letterSpacing: "0.4px",
              }}
            >
              Fecha
            </label>
            <input
              type="date"
              value={filtroFecha}
              onChange={e => { setFiltroFecha(e.target.value); setPage(1); }}
              style={{
                width: "100%",
                padding: "10px 14px",
                border: `2px solid #F0E0EA`,
                borderRadius: 12,
                fontFamily: fonts.body,
                fontSize: "0.9rem",
                color: colors.brown,
                background: "white",
                outline: "none",
              }}
            />
          </div>

          {/* Boton limpiar */}
          <button
            onClick={limpiarFiltros}
            style={{
              background: colors.lightPink,
              color: colors.pink,
              border: `2px solid ${colors.pink}`,
              padding: "10px 18px",
              borderRadius: 12,
              fontFamily: fonts.body,
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              whiteSpace: "nowrap",
              alignSelf: "flex-end",
              transition: "all 0.2s",
            }}
          >
            Limpiar filtros
          </button>
        </div>

        {/* ── TABLA ────────────────────────────────────────── */}
        <div
          style={{
            background: "white",
            borderRadius: 16,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          {/* Contador de resultados */}
          <div
            style={{
              padding: "14px 20px 10px",
              borderBottom: `1px solid #F0E0EA`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <span
              style={{
                fontFamily: fonts.body,
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "#8B7080",
              }}
            >
              {loading
                ? "Cargando..."
                : `${total} cita${total !== 1 ? "s" : ""} encontrada${total !== 1 ? "s" : ""}`
              }
            </span>
            {total > 0 && (
              <span
                style={{
                  fontFamily: fonts.body,
                  fontSize: "0.82rem",
                  color: "#AAA",
                }}
              >
                Pagina {page} de {totalPages}
              </span>
            )}
          </div>

          {/* Scroll horizontal en movil */}
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            {loading ? (
              <Spinner />
            ) : error ? (
              <div
                style={{
                  padding: "40px 24px",
                  textAlign: "center",
                  color: "#842029",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: 12 }}>!</div>
                <p style={{ fontWeight: 700, marginBottom: 4 }}>Error de conexion</p>
                <p style={{ fontSize: "0.88rem", opacity: 0.8 }}>{error}</p>
                <button
                  onClick={fetchCitas}
                  style={{
                    marginTop: 16,
                    background: colors.pink,
                    color: "white",
                    border: "none",
                    padding: "10px 22px",
                    borderRadius: 50,
                    fontFamily: fonts.body,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Reintentar
                </button>
              </div>
            ) : citas.length === 0 ? (
              <div
                style={{
                  padding: "56px 24px",
                  textAlign: "center",
                  color: "#AAA",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: 12 }}>...</div>
                <p style={{ fontWeight: 700, fontFamily: fonts.body, fontSize: "1rem" }}>
                  No hay citas que mostrar
                </p>
                <p style={{ fontSize: "0.86rem", marginTop: 4 }}>
                  Prueba con otros filtros o espera nuevas solicitudes.
                </p>
              </div>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 700,
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: colors.pink,
                      color: "white",
                    }}
                  >
                    {["#ID", "Paciente", "Telefono", "Fecha", "Servicio", "Estado", "Acciones"].map(col => (
                      <th
                        key={col}
                        style={{
                          padding: "13px 16px",
                          textAlign: "left",
                          fontFamily: fonts.body,
                          fontWeight: 800,
                          fontSize: "0.82rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {citas.map((cita, idx) => (
                    <tr
                      key={cita.id}
                      onMouseEnter={() => setHoveredRow(cita.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{
                        background: hoveredRow === cita.id
                          ? "#FFF0F5"
                          : idx % 2 === 0
                            ? "white"
                            : "#FAFAFA",
                        transition: "background 0.15s",
                        borderBottom: `1px solid #F5E8EF`,
                      }}
                    >
                      {/* ID */}
                      <td
                        style={{
                          padding: "13px 16px",
                          fontFamily: fonts.body,
                          fontWeight: 700,
                          fontSize: "0.88rem",
                          color: "#AAA",
                          whiteSpace: "nowrap",
                        }}
                      >
                        #{cita.id}
                      </td>

                      {/* Nombre */}
                      <td
                        style={{
                          padding: "13px 16px",
                          fontFamily: fonts.body,
                          fontWeight: 700,
                          fontSize: "0.92rem",
                          color: colors.brown,
                          whiteSpace: "nowrap",
                          maxWidth: 180,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {cita.nombre}
                      </td>

                      {/* Telefono */}
                      <td
                        style={{
                          padding: "13px 16px",
                          fontFamily: fonts.body,
                          fontSize: "0.88rem",
                          color: "#666",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {cita.telefono}
                      </td>

                      {/* Fecha */}
                      <td
                        style={{
                          padding: "13px 16px",
                          fontFamily: fonts.body,
                          fontSize: "0.88rem",
                          color: "#555",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatFecha(cita.fecha)}
                      </td>

                      {/* Servicio */}
                      <td
                        style={{
                          padding: "13px 16px",
                          fontFamily: fonts.body,
                          fontSize: "0.88rem",
                          color: colors.brown,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {cita.servicio}
                      </td>

                      {/* Estado badge */}
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <EstadoBadge estado={cita.estado} />
                      </td>

                      {/* Acciones */}
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          {/* Dropdown cambiar estado */}
                          <select
                            value={cita.estado}
                            onChange={e => handleCambiarEstado(cita.id, e.target.value)}
                            aria-label={`Cambiar estado de cita #${cita.id}`}
                            style={{
                              padding: "7px 10px",
                              border: `2px solid #F0E0EA`,
                              borderRadius: 10,
                              fontFamily: fonts.body,
                              fontWeight: 700,
                              fontSize: "0.82rem",
                              color: colors.brown,
                              background: "white",
                              cursor: "pointer",
                              outline: "none",
                              minWidth: 130,
                            }}
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="confirmada">Confirmada</option>
                            <option value="cancelada">Cancelada</option>
                          </select>

                          {/* Boton eliminar */}
                          <button
                            onClick={() => handleEliminar(cita.id)}
                            aria-label={`Eliminar cita #${cita.id}`}
                            style={{
                              background: "#F8D7DA",
                              color: "#842029",
                              border: "2px solid #F5C2C7",
                              padding: "7px 13px",
                              borderRadius: 10,
                              fontFamily: fonts.body,
                              fontWeight: 800,
                              fontSize: "0.82rem",
                              cursor: "pointer",
                              whiteSpace: "nowrap",
                              transition: "all 0.15s",
                              minHeight: 36,
                            }}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* ── PAGINACION ───────────────────────────────────── */}
          {!loading && !error && totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 12,
                padding: "16px 20px",
                borderTop: `1px solid #F0E0EA`,
              }}
            >
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  background: page === 1 ? "#F5F5F5" : colors.pink,
                  color: page === 1 ? "#CCC" : "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: 50,
                  fontFamily: fonts.body,
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  minHeight: 44,
                  minWidth: 100,
                  transition: "all 0.2s",
                }}
              >
                Anterior
              </button>

              <span
                style={{
                  fontFamily: fonts.body,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: "#888",
                }}
              >
                {page} / {totalPages}
              </span>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  background: page === totalPages ? "#F5F5F5" : colors.pink,
                  color: page === totalPages ? "#CCC" : "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: 50,
                  fontFamily: fonts.body,
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                  minHeight: 44,
                  minWidth: 100,
                  transition: "all 0.2s",
                }}
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
