import React, { useMemo, useState } from "react";

/** ===== EJEMPLO DE DATOS (puedes reemplazar por fetch a tu API) ===== */
const MOCK = [
  {
    id: 1,
    nombre: "Luis",
    grado: "2° Secundaria",
    materias: [
      {
        id: "mat",
        nombre: "Matemáticas",
        calificacion: 92,
        tareas: [
          { id: "t1", titulo: "Ecuaciones lineales", estado: "entregada" },
          { id: "t2", titulo: "Inecuaciones", estado: "pendiente" },
          { id: "t3", titulo: "Sistema 2x2", estado: "entregada" },
        ],
      },
      {
        id: "his",
        nombre: "Historia",
        calificacion: 84,
        tareas: [
          { id: "t1", titulo: "Mapa mental: Revolución", estado: "entregada" },
          { id: "t2", titulo: "Línea del tiempo", estado: "entregada" },
          { id: "t3", titulo: "Resumen WWI", estado: "fallida" },
        ],
      },
      {
        id: "esp",
        nombre: "Español",
        calificacion: 68,
        tareas: [
          { id: "t1", titulo: "Ensayo", estado: "fallida" },
          { id: "t2", titulo: "Lectura guiada", estado: "pendiente" },
        ],
      },
    ],
  },
  {
    id: 2,
    nombre: "María",
    grado: "3° Secundaria",
    materias: [
      {
        id: "qui",
        nombre: "Química",
        calificacion: 78,
        tareas: [
          { id: "t1", titulo: "Tabla periódica", estado: "entregada" },
          { id: "t2", titulo: "Enlaces químicos", estado: "pendiente" },
        ],
      },
      {
        id: "ing",
        nombre: "Inglés",
        calificacion: 95,
        tareas: [
          { id: "t1", titulo: "Reading B1", estado: "entregada" },
          { id: "t2", titulo: "Vocabulary", estado: "entregada" },
        ],
      },
    ],
  },
];

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
export default function CalificacionesMovil({ data = MOCK }) {
  // Filtro rápido por hijo (para móviles con varios hijos)
  const [alumnoId, setAlumnoId] = useState(data?.[0]?.id ?? null);

  const alumno = useMemo(
    () => data.find((a) => a.id === alumnoId) ?? data[0],
    [alumnoId, data]
  );

  // Promedio general del alumno
  const promedio = useMemo(() => {
    if (!alumno?.materias?.length) return 0;
    const sum = alumno.materias.reduce(
      (acc, m) => acc + (m.calificacion ?? 0),
      0
    );
    return Math.round(sum / alumno.materias.length);
  }, [alumno]);

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
          <select
            className="w-full rounded-lg border px-3 py-2 text-sm"
            value={alumno?.id ?? ""}
            onChange={(e) => setAlumnoId(Number(e.target.value))}
          >
            {data.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre} — {a.grado}
              </option>
            ))}
          </select>
        </div>

        {/* Card de promedio general */}
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

        {/* Materias */}
        <ul className="space-y-4">
          {alumno?.materias?.map((m) => {
            const tone = toneClasses[gradeTone(m.calificacion ?? 0)];
            const pct = Math.min(100, Math.max(0, m.calificacion ?? 0));
            const entregadas = m.tareas.filter(
              (t) => t.estado === "entregada"
            ).length;
            const pendientes = m.tareas.filter(
              (t) => t.estado === "pendiente"
            ).length;
            const fallidas = m.tareas.filter(
              (t) => t.estado === "fallida"
            ).length;

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

                {/* Chips de tareas */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs ${taskChipClass(
                      "entregada"
                    )}`}
                  >
                    Entregadas: {entregadas}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs ${taskChipClass(
                      "pendiente"
                    )}`}
                  >
                    Pendientes: {pendientes}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs ${taskChipClass(
                      "fallida"
                    )}`}
                  >
                    Fallidas: {fallidas}
                  </span>
                </div>

                {/* Lista compacta de tareas (mobile) */}
                <div className="mt-3 divide-y divide-zinc-200 bg-white rounded-xl overflow-hidden">
                  {m.tareas.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between px-3 py-2 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="truncate">{t.titulo}</p>
                        <p className="text-[11px] text-zinc-500">Tarea</p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] ${taskChipClass(
                          t.estado
                        )}`}
                      >
                        {capitalize(t.estado)}
                      </span>
                    </div>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>

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
