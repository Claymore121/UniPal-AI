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
    name: "Juan Perez",
    grade: "5th Grade",
    imgProfile: boyImg,
    materia: {
      nombre: "matematicas",
      horario: "8:00 - 9:00",
      maestro: "mirna",
      asistencia: "Ausente",
    },
  },
  {
    id: 2,
    name: "Maria Lopez",
    grade: "6th Grade",
    imgProfile: girlImg,
    materia: {
      nombre: "ingles",
      horario: "9:00 - 10:00",
      maestro: "pepito",
      asistencia: "Presente",
    },
  },
  {
    id: 3,
    name: "Javiercin",
    grade: "2th Grade",
    imgProfile: boyImg,
    materia: {
      nombre: "ciencias",
      horario: "11:00 - 12:00",
      maestro: "villacasas",
      asistencia: "Retraso",
    },
  },
];

export default notifications;
