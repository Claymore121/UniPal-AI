import { data } from "react-router-dom";
import boyImg from "../assets/boy1.png";
import girlImg from "../assets/girl1.png";

export const notifications = [
  {
    id: 1,
    title: "Recordatorio de tarea",
    message: "No olvides revisar el progreso de tus hijos hoy.",
    time: "Hace 2 horas",
    read: false,
    type: "reminder",
    icon: "🔔",
  },
  {
    id: 2,
    title: "Nuevo logro desbloqueado",
    message: "Tu hijo Juan ha completado su tarea de matemáticas.",
    time: "Hace 1 día",
    read: true,
    type: "achievement",
    icon: "🏆",
  },
  {
    id: 3,
    title: "Mensaje de soporte",
    message: "Tu consulta ha sido respondida. Revisa tu bandeja de entrada.",
    time: "Hace 3 días",
    read: false,
    type: "support",
    icon: "💬",
  },
  {
    id: 4,
    title: "ausencia escolar",
    message: "Tu hijo María no asistió a la escuela hoy.",
    time: "Hace 4 días",
    read: true,
    type: "alert",
    icon: "⚠️",
  },
  {
    id: 5,
    title: "Actualización de la aplicación",
    message:
      "La nueva versión de UniPal AI ya está disponible. Actualiza ahora para disfrutar de nuevas funciones.",
    time: "Hace 5 días",
    read: false,
    type: "update",
    icon: "⬆️",
  },
  {
    id: 6,
    title: "Actualización de la aplicación",
    message:
      "La nueva versión de UniPal AI ya está disponible. Actualiza ahora para disfrutar de nuevas funciones.",
    time: "Hace 5 días",
    read: false,
    type: "update",
    icon: "⬆️",
  },
  {
    id: 7,
    title: "Actualización de la aplicación",
    message:
      "La nueva versión de UniPal AI ya está disponible. Actualiza ahora para disfrutar de nuevas funciones.",
    time: "Hace 5 días",
    read: false,
    type: "update",
    icon: "⬆️",
  },
  {
    id: 8,
    title: "Actualización de la aplicación",
    message:
      "La nueva versión de UniPal AI ya está disponible. Actualiza ahora para disfrutar de nuevas funciones.",
    time: "Hace 5 días",
    read: false,
    type: "update",
    icon: "⬆️",
  },
];

export const Alumnos = [
  {
    id: 1,
    nivel: "Secundaria",
    name: "Luis",
    grade: "2do Secundaria",
    imgProfile: boyImg,
    materias: [
      {
        nombre: "Matemáticas",
        horario: "10:00 - 11:00",
        maestro: "Prof. Ramírez",
        asistencia: "Presente",
      },
      {
        nombre: "Inglés",
        horario: "11:00 - 12:00",
        maestro: "Profa. López",
        asistencia: "Ausente",
      },
    ],
  },
  {
    id: 2,
    nivel: "Preparatoria",
    name: "Ana",
    grade: "1ro Preparatoria",
    imgProfile: girlImg,
    materias: [
      {
        nombre: "Ciencias",
        horario: "09:00 - 10:00",
        maestro: "Prof. Villacasas",
        asistencia: "Retraso",
      },
    ],
  },
  {
    id: 3,
    nivel: "Preparatoria",
    name: "javiercin",
    grade: "3ro Preparatoria",
    imgProfile: girlImg,
    materias: [
      {
        nombre: "Ciencias",
        horario: "09:00 - 10:00",
        maestro: "Prof. Villacasas",
        asistencia: "Retraso",
      },
    ],
  },
];

export default notifications;
