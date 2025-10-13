import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// 🧍 Simulación de respuesta del backend (por ejemplo, fetch de /api/asistencias)
const dataBackend = [
  {
    id: 1,
    nombre: "Luis",
    registros: {
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

export default function CalendarioAsistencias() {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [date, setDate] = useState(new Date());

  // 🛰️ Simulamos fetch al backend al montar el componente
  useEffect(() => {
    // aquí podrías hacer un fetch real como:
    // fetch("/api/asistencias").then(res => res.json()).then(setUsuarios);
    setUsuarios(dataBackend);
    setSelectedUserId(dataBackend[0].id);
  }, []);

  const usuarioActual = usuarios.find((u) => u.id === selectedUserId);

  const getClassForDate = (dateObj) => {
    if (!usuarioActual) return "";
    const fecha = dateObj.toISOString().split("T")[0];
    const estado = usuarioActual.registros[fecha];

    if (estado === "asistencia") return "bg-green-500 text-white rounded-full";
    if (estado === "falta") return "bg-red-500 text-white rounded-full";
    if (estado === "retraso") return "bg-orange-400 text-white rounded-full";
    return "";
  };

  return (
    <div className="max-w-sm mx-auto mt-35 text-center">
      <h2 className="text-2xl font-bold mb-4">📅 Asistencias por Alumno</h2>

      {/* 🧍 Selector de usuario */}
      {usuarios.length > 0 && (
        <div className="mb-4">
          <select
            className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedUserId ?? ""}
            onChange={(e) => setSelectedUserId(Number(e.target.value))}
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
        onChange={setDate}
        value={date}
        tileClassName={({ date }) => getClassForDate(date)}
        className="w-full rounded-xl shadow-lg border border-gray-200 p-2"
      />

      <div className="mt-4 text-left text-sm text-gray-600">
        <p>
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>{" "}
          Asistencia
        </p>
        <p>
          <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>{" "}
          Falta
        </p>
        <p>
          <span className="inline-block w-3 h-3 bg-orange-400 rounded-full mr-1"></span>{" "}
          Retraso
        </p>
      </div>
      <div className="mt-50">
        <p className="mt-4 text-xs text-gray-400">
          * Datos simulados. En un entorno real, los datos se obtendrían desde
          un backend.
        </p>
        <div>
          <p className="mt-2 text-xs text-gray-400">
            ** Este calendario es interactivo. Selecciona diferentes usuarios
            para ver sus registros de asistencia.
          </p>
        </div>
      </div>
    </div>
  );
}
