import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// 🧍 Simulación de backend
const dataBackend = [
  {
    id: 1,
    nombre: "Luis",
    registros: {
      "2025-10-02": "asistencia",
      "2025-10-03": "retraso",
      "2025-10-06": "asistencia",
      "2025-10-07": "asistencia",
      "2025-10-08": "retraso",
      "2025-10-09": "asistencia",
      "2025-10-10": "falta",
      "2025-10-11": "asistencia",
      "2025-10-12": "asistencia",
    },
  },
  {
    id: 2,
    nombre: "María",
    registros: {
      "2025-10-01": "asistencia",
      "2025-10-04": "asistencia",
      "2025-10-06": "falta",
      "2025-10-07": "asistencia",
      "2025-10-08": "asistencia",
      "2025-10-09": "asistencia",
      "2025-10-10": "retraso",
      "2025-10-11": "asistencia",
      "2025-10-12": "falta",
    },
  },
  {
    id: 3,
    nombre: "Carlos",
    registros: {
      "2025-10-02": "asistencia",
      "2025-10-03": "asistencia",
      "2025-10-06": "asistencia",
      "2025-10-07": "retraso",
      "2025-10-08": "asistencia",
      "2025-10-09": "falta",
      "2025-10-10": "asistencia",
      "2025-10-11": "asistencia",
      "2025-10-12": "asistencia",
    },
  },
];

// ✅ util: fecha local YYYY-MM-DD (evita desfaces por UTC)
function toLocalISO(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isWeekend(dateObj) {
  const day = dateObj.getDay(); // 0 = dom, 6 = sáb
  return day === 0 || day === 6;
}

export default function CalendarioAsistencias() {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  // 📌 cada alumno conserva su propia fecha/mes seleccionado
  const [datesByUser, setDatesByUser] = useState({});

  // hoy (local)
  const today = new Date();

  useEffect(() => {
    setUsuarios(dataBackend);
    setSelectedUserId(dataBackend[0].id);
    setDatesByUser({ [dataBackend[0].id]: new Date() });
  }, []);

  const usuarioActual = usuarios.find((u) => u.id === selectedUserId);
  const selectedDate = datesByUser[selectedUserId] ?? new Date();

  // 🟢🔴🟠 clases por fecha (estado > pasado) — NO contamos fines de semana
  const getClassForDate = (dateObj) => {
    if (!usuarioActual) return "";

    const fecha = toLocalISO(dateObj);
    const estado = usuarioActual.registros[fecha]; // asistencia | falta | retraso | undefined

    // Si es fin de semana y no hay registro explícito, no pintamos nada.
    if (isWeekend(dateObj) && !estado) return "";

    // prioridades: falta/retraso/asistencia explícita > "día pasado sin registro"
    if (estado === "falta") return "tw-tile tw-falta";
    if (estado === "retraso") return "tw-tile tw-retraso";
    if (estado === "asistencia") return "tw-tile tw-asistencia";

    // Solo días hábiles entran en 'pasado sin registro'
    const isPast =
      dateObj <
      new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (isPast && !isWeekend(dateObj)) return "tw-tile tw-pasado";
    if (isSameDay(dateObj, today)) return "tw-tile tw-hoy";
    return "";
  };

  // Contadores (mes visible) — solo días hábiles y solo registros explícitos
  const visibleMonth = selectedDate.getMonth();
  const visibleYear = selectedDate.getFullYear();
  const { asistencia, falta, retraso, totalRegistrosHabiles } = (() => {
    if (!usuarioActual)
      return { asistencia: 0, falta: 0, retraso: 0, totalRegistrosHabiles: 0 };
    let a = 0,
      f = 0,
      r = 0,
      t = 0;
    Object.entries(usuarioActual.registros).forEach(([ymd, estado]) => {
      const d = new Date(ymd + "T00:00:00");
      if (
        d.getMonth() === visibleMonth &&
        d.getFullYear() === visibleYear &&
        !isWeekend(d) // excluir sáb y dom
      ) {
        if (estado === "asistencia") a++;
        if (estado === "falta") f++;
        if (estado === "retraso") r++;
        t++;
      }
    });
    return { asistencia: a, falta: f, retraso: r, totalRegistrosHabiles: t };
  })();

  const asistenciaPct =
    totalRegistrosHabiles > 0
      ? Math.round((asistencia / totalRegistrosHabiles) * 100)
      : 0;

  // Para el donut (conic-gradient): calculamos ángulos
  const totalForDonut = Math.max(1, asistencia + falta + retraso); // evitar division por 0
  const degAsis = (asistencia / totalForDonut) * 360;
  const degRetr = (retraso / totalForDonut) * 360 + degAsis;
  const degFalt = 360; // cierra el círculo

  return (
    <>
      <header
        // onClick={() => setOpen((v) => !v)}
        // className="w-full h-[150px] p-4 bg-gradient-to-r from-[#295dfc] to-[#1f3fa9] via-[#5660cd] to-[#295dfc] bg-[length:200%_200%] animate-gradient text-white flex gap-3.5 rounded-b-3xl cursor-pointer select-none"
        className="w-full h-[150px] p-4 bg-gradient-to-r from-[#219a1b] to-[#1b691b]  text-white flex gap-3.5 rounded-b-3xl cursor-pointer select-none"
      >
        <div>
          <h2 className="text-2xl mt-[50px] leading-none">Asistencias</h2>
        </div>
        {/* 
        |<motion.span
          animate={{ rotate: open ? 360 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="w-6 h-6 ml-auto mt-[70px] mr-5"
          aria-hidden="true"
        > */}
        <div
          className="w-6 h-6 ml-auto mt-[70px] mr-5 hover:rotate-0 active:rotate-360 transition "
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          {/* <Bell
            className="w-6 h-6"
            onClick={() => {
              // setIsOpen(true);
            }}
          /> */}
        </div>

        {/* </motion.span> */}
      </header>
      <div className="max-w-md md:max-w-3xl mx-auto mt-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Asistencias del Alumno</h2>

        {/* 🧍 Selector de usuario */}
        {usuarios.length > 0 && (
          <div className="mb-4 w-3/4 md:w-1/2 mx-auto text-left">
            <select
              className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedUserId ?? ""}
              onChange={(e) => {
                const id = Number(e.target.value);
                setSelectedUserId(id);
                setDatesByUser((prev) => ({
                  ...prev,
                  [id]: prev[id] ?? new Date(),
                }));
              }}
            >
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 🗓️ Calendario */}
        <Calendar
          locale="es-MX"
          onChange={(nextDate) =>
            setDatesByUser((prev) => ({ ...prev, [selectedUserId]: nextDate }))
          }
          value={selectedDate}
          onActiveStartDateChange={({ activeStartDate }) => {
            setDatesByUser((prev) => ({
              ...prev,
              [selectedUserId]: activeStartDate,
            }));
          }}
          tileClassName={({ date, view }) =>
            view === "month" ? getClassForDate(date) : undefined
          }
          tileContent={({ date, view }) => {
            if (view !== "month" || !usuarioActual) return null;
            const estado = usuarioActual.registros[toLocalISO(date)];
            if (!estado) return null;
            return (
              <div className="mt-1 flex justify-center">
                <span
                  className={
                    estado === "falta"
                      ? "h-1.5 w-1.5 rounded-full bg-red-500 inline-block"
                      : estado === "retraso"
                      ? "h-1.5 w-1.5 rounded-full bg-orange-400 inline-block"
                      : "h-1.5 w-1.5 rounded-full bg-green-500 inline-block"
                  }
                />
              </div>
            );
          }}
          className="w-full rounded-xl shadow-lg border border-gray-200 p-2 m-auto"
        />

        {/* Leyenda + conteos del mes visible */}
        <div className="mt-4 text-left text-sm text-gray-700 grid grid-cols-2 gap-y-1 gap-x-4 md:grid-cols-4 m-auto w-3/4 md:w-full">
          <p className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full" />
            Asistencia ({asistencia})
          </p>
          <p className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 bg-orange-400 rounded-full" />
            Retraso ({retraso})
          </p>
          <p className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 bg-red-500 rounded-full" />
            Falta ({falta})
          </p>
          <p className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 bg-emerald-200 border border-emerald-300 rounded-sm" />
            Día pasado (sin registro, L–V)
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center">
          <h3 className="text-lg font-semibold">
            Porcentaje de asistencia en el mes
          </h3>

          <div
            className="relative mt-3 h-40 w-40 rounded-full"
            style={{
              background: `conic-gradient(
              #22c55e 0deg ${degAsis}deg,
              #fb923c ${degAsis}deg ${degRetr}deg,
              #ef4444 ${degRetr}deg ${degFalt}deg
            )`,
            }}
            aria-label="Gráfico de asistencias"
          >
            {/* “agujero” del donut */}
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center border">
              <div>
                <div className="text-2xl font-bold">{asistenciaPct}%</div>
                <div className="text-xs text-gray-500">Asistencia</div>
              </div>
            </div>
          </div>

          {/* Etiquetas del pastel */}
          <div className="mt-3 grid grid-cols-3 gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500" />{" "}
              Asistencia
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-orange-400" />{" "}
              Retraso
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-red-500" />{" "}
              Falta
            </div>
          </div>

          <p className="mb-15 text-xs text-gray-500">
            *Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe
            minus ipsam nisi quia..
          </p>
        </div>

        {/* 🎨 Estilos auxiliares para las celdas (aplican sobre react-calendar) */}
        <style>{`
        /* Base: suaviza cada día */
        .react-calendar__tile {
          border-radius: 0.75rem;
        }
        /* Estados explícitos */
        .tw-asistencia {
          background: #22c55e20; /* verde suave */
        }
        .tw-asistencia .react-calendar__tile {
          color: #065f46;
          font-weight: 600;
        }
        .tw-falta {
          background: #ef444420; /* rojo suave */
        }
        .tw-falta .react-calendar__tile {
          color: #7f1d1d;
          font-weight: 700;
        }
        .tw-retraso {
          background: #fb923c20; /* naranja suave */
        }
        .tw-retraso .react-calendar__tile {
          color: #7c2d12;
          font-weight: 700;
        }
        /* Día pasado sin registro (solo L–V) */
        .tw-pasado {
          background: #34d39922; /* verde pálido */
        }
        .tw-pasado .react-calendar__tile {
          color: #065f46;
          font-weight: 500;
        }
        /* Hoy sin registro: borde distintivo */
        .tw-hoy .react-calendar__tile {
          box-shadow: inset 0 0 0 2px #3b82f6;
          border-radius: 0.75rem;
        }
        /* Hover accesible */
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background: rgba(59, 130, 246, 0.12);
        }
      `}</style>
      </div>
    </>
  );
}
