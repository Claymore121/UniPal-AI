import React, { useMemo, useState, useEffect } from "react";
import api from "../../services/api";

/** ===== Helpers de color y formato ===== */
const gradeTone = (n) => {
  if (n >= 90) return "success";
  if (n >= 80) return "info";
  if (n >= 70) return "warn";
  return "danger";
};

const toneClasses = {
  success: {
    text: "text-emerald-700",
    bgSoft: "bg-emerald-50",
    chip: "bg-emerald-100 text-emerald-700",
    bar: "bg-emerald-500",
    ring: "ring-emerald-400",
  },
  info: {
    text: "text-sky-700",
    bgSoft: "bg-sky-50",
    chip: "bg-sky-100 text-sky-700",
    bar: "bg-sky-500",
    ring: "ring-sky-400",
  },
  warn: {
    text: "text-amber-700",
    bgSoft: "bg-amber-50",
    chip: "bg-amber-100 text-amber-700",
    bar: "bg-amber-500",
    ring: "ring-amber-400",
  },
  danger: {
    text: "text-rose-700",
    bgSoft: "bg-rose-50",
    chip: "bg-rose-100 text-rose-700",
    bar: "bg-rose-500",
    ring: "ring-rose-400",
  },
};

const taskChipClass = (estado) => {
  if (estado === "entregada") return "bg-emerald-100 text-emerald-700";
  if (estado === "pendiente") return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700"; // fallida
};

const formatPct = (n) => `${Math.round(n)}%`;

/** ===== Componente principal ===== */
export default function CalificacionesMovil() {
  const [hijos, setHijos] = useState([]);
  const [calificaciones, setCalificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCalificaciones, setLoadingCalificaciones] = useState(false);
  const [alumnoId, setAlumnoId] = useState(null);

  // Cargar hijos al montar el componente
  useEffect(() => {
    const cargarHijos = async () => {
      try {
        setLoading(true);
        const hijosData = await api.getHijos();
        setHijos(hijosData);
        if (hijosData.length > 0) {
          setAlumnoId(hijosData[0].id);
        }
      } catch (error) {
        console.error("Error cargando hijos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarHijos();
  }, []);

  // Cargar calificaciones cuando se selecciona un alumno
  useEffect(() => {
    const cargarCalificaciones = async () => {
      if (!alumnoId) return;

      try {
        setLoadingCalificaciones(true);
        const calificacionesData = await api.getCalificaciones(alumnoId);
        setCalificaciones(calificacionesData);
      } catch (error) {
        console.error("Error cargando calificaciones:", error);
        setCalificaciones([]);
      } finally {
        setLoadingCalificaciones(false);
      }
    };

    cargarCalificaciones();
  }, [alumnoId]);

  // Obtener el alumno seleccionado
  const alumno = useMemo(
    () => hijos.find((h) => h.id === alumnoId) ?? null,
    [alumnoId, hijos]
  );

  // Transformar calificaciones del backend al formato esperado
  const materiasConCalificaciones = useMemo(() => {
    if (!calificaciones.length) return [];

    // Agrupar calificaciones por materia
    const materiasMap = new Map();

    calificaciones.forEach((cal) => {
      const materiaNombre = cal.materia;
      
      if (!materiasMap.has(materiaNombre)) {
        materiasMap.set(materiaNombre, {
          id: materiaNombre.toLowerCase().replace(/\s+/g, "-"),
          nombre: materiaNombre,
          calificaciones: [],
        });
      }

      materiasMap.get(materiaNombre).calificaciones.push({
        valor: cal.valor,
        fecha: cal.fecha,
        notas: cal.notas,
      });
    });

    // Calcular promedio por materia
    const materias = Array.from(materiasMap.values()).map((materia) => {
      const suma = materia.calificaciones.reduce(
        (acc, cal) => acc + cal.valor,
        0
      );
      const promedio = Math.round(suma / materia.calificaciones.length);

      return {
        ...materia,
        calificacion: promedio,
        tareas: [], // Las tareas no están en el backend por ahora
      };
    });

    return materias;
  }, [calificaciones]);

  // Promedio general del alumno
  const promedio = useMemo(() => {
    if (!materiasConCalificaciones.length) return 0;
    const sum = materiasConCalificaciones.reduce(
      (acc, m) => acc + (m.calificacion ?? 0),
      0
    );
    return Math.round(sum / materiasConCalificaciones.length);
  }, [materiasConCalificaciones]);

  const tonoProm = gradeTone(promedio);
  const tProm = toneClasses[tonoProm];

  return (
    <>
      <header
        onClick={() => setOpen((v) => !v)}
        className="w-full h-[150px] p-4 bg-gradient-to-r from-[#295dfc] to-[#1f3fa9] text-white flex flex-col gap-3.5 rounded-b-3xl cursor-pointer select-none justify-end"
      >
        <h1 className="text-3xl font-semibold">Calificaciones</h1>
        <p className=" text-white/90">Materias, promedios y estado de tareas</p>
      </header>
      <div className="w-full max-w-xl mx-auto p-4 sm:p-6 mb-10">
        {/* Selector de hijo */}
        <div className="mb-4">
          <label className="block text-sm text-zinc-600 mb-1">Alumno</label>
          {loading ? (
            <div className="w-full rounded-lg border px-3 py-2 text-sm bg-zinc-100 animate-pulse">
              Cargando hijos...
            </div>
          ) : hijos.length === 0 ? (
            <div className="w-full rounded-lg border px-3 py-2 text-sm text-zinc-500 text-center">
              No tienes hijos registrados
            </div>
          ) : (
            <select
              className="w-full rounded-lg border px-3 py-2 text-sm"
              value={alumnoId ?? ""}
              onChange={(e) => setAlumnoId(e.target.value)}
            >
              {hijos.map((hijo) => (
                <option key={hijo.id} value={hijo.id}>
                  {hijo.nombre} {hijo.apellidos || ""} — {hijo.grado}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Card de promedio general */}
        {loadingCalificaciones ? (
          <section className="rounded-2xl border p-4 mb-4 bg-zinc-50 animate-pulse">
            <div className="h-20"></div>
          </section>
        ) : materiasConCalificaciones.length === 0 && alumnoId ? (
          <section className="rounded-2xl border p-4 mb-4 bg-zinc-50">
            <p className="text-center text-zinc-500">
              No hay calificaciones registradas para este alumno
            </p>
          </section>
        ) : (
          <section
            className={`rounded-2xl border p-4 mb-4 ${tProm.bgSoft} border-dashed ${tProm.ring}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500">Promedio general</p>
                <p className={`text-3xl font-bold ${tProm.text}`}>{promedio}</p>
              </div>
              {/* Donut simple con conic-gradient */}
              <div
                className="relative h-16 w-16 rounded-full"
                style={{
                  background: `conic-gradient(var(--c) 0% ${promedio}%, #e5e7eb 0%)`,
                  // --c depende del tono
                  ["--c"]: tProm.bar
                    ? `oklch(from theme ${tProm.bar})`
                    : "#10b981",
                }}
              >
                <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center border">
                  <span className="text-xs font-semibold">
                    {formatPct(promedio)}
                  </span>
                </div>
              </div>
            </div>
            {/* Barra de progreso */}
            <div className="mt-3 h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${tProm.bar}`}
                style={{ width: `${Math.min(100, Math.max(0, promedio))}%` }}
              />
            </div>
          </section>
        )}

        {/* Materias */}
        {loadingCalificaciones ? (
          <ul className="space-y-4">
            {[1, 2, 3].map((i) => (
              <li
                key={i}
                className="rounded-2xl border p-4 bg-zinc-50 animate-pulse"
              >
                <div className="h-24"></div>
              </li>
            ))}
          </ul>
        ) : materiasConCalificaciones.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            <p>No hay materias con calificaciones registradas</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {materiasConCalificaciones.map((m) => {
              const tone = toneClasses[gradeTone(m.calificacion ?? 0)];
              const pct = Math.min(100, Math.max(0, m.calificacion ?? 0));

              return (
                <li
                  key={m.id}
                  className={`rounded-2xl border p-4 ${tone.bgSoft} border-zinc-200`}
                >
                  {/* Encabezado materia */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold truncate">
                        {m.nombre}
                      </h3>
                      <p className="text-xs text-zinc-500">Calificación actual</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl font-bold ${tone.text}`}>
                        {m.calificacion}
                      </span>
                      <div className="mt-1 text-[11px] text-zinc-500">
                        {labelFromGrade(m.calificacion)}
                      </div>
                    </div>
                  </div>

                  {/* Progreso materia */}
                  <div className="mt-3 h-2 w-full bg-white rounded-full overflow-hidden ring-1 ring-zinc-100">
                    <div
                      className={`h-full ${tone.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* Información de calificaciones */}
                  <div className="mt-3">
                    <p className="text-xs text-zinc-500 mb-2">
                      Total de calificaciones: {m.calificaciones.length}
                    </p>
                    {/* Lista de calificaciones recientes */}
                    {m.calificaciones.length > 0 && (
                      <div className="mt-2 divide-y divide-zinc-200 bg-white rounded-xl overflow-hidden">
                        {m.calificaciones.slice(0, 3).map((cal, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between px-3 py-2 text-sm"
                          >
                            <div className="min-w-0">
                              <p className="font-medium">
                                Calificación: {cal.valor}
                              </p>
                              <p className="text-[11px] text-zinc-500">
                                {new Date(cal.fecha).toLocaleDateString("es-MX")}
                              </p>
                              {cal.notas && (
                                <p className="text-[11px] text-zinc-400 mt-1">
                                  {cal.notas}
                                </p>
                              )}
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] ${toneClasses[gradeTone(cal.valor)].chip}`}
                            >
                              {labelFromGrade(cal.valor)}
                            </span>
                          </div>
                        ))}
                        {m.calificaciones.length > 3 && (
                          <div className="px-3 py-2 text-xs text-zinc-500 text-center">
                            +{m.calificaciones.length - 3} calificación(es) más
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Leyenda de colores */}
        <footer className="mt-6 ">
          <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-600 sm:grid-cols-4">
            <LegendDot color="bg-emerald-500" label="≥ 90 Excelente" />
            <LegendDot color="bg-sky-500" label="80–89 Bueno" />
            <LegendDot color="bg-amber-500" label="70–79 Regular" />
            <LegendDot color="bg-rose-500" label="< 70 Riesgo" />
          </div>
        </footer>
      </div>
    </>
  );
}

/** ===== Subcomponentes / utilidades ===== */
function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}

function labelFromGrade(n = 0) {
  if (n >= 90) return "Excelente";
  if (n >= 80) return "Bueno";
  if (n >= 70) return "Regular";
  return "En riesgo";
}

function capitalize(s = "") {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
