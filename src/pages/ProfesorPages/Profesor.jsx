"use client";

import { useMemo, useState, useEffect } from "react";
import {
  GraduationCap,
  BookOpen,
  Users,
  MessageSquare,
  Calendar as CalendarIcon,
  TrendingUp,
  Clock,
  Send,
  Plus,
  Search,
  BarChart3,
  FileText,
  Settings,
  ClipboardCheck, // Nuevo ícono para asistencia
} from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../../services/api";

// --- Datos de ejemplo ---
const classrooms = [
  {
    id: 1,
    name: "Matemáticas 10A",
    students: 28,
    subject: "Matemáticas",
    grade: "10A",
  },
  { id: 2, name: "Física 11B", students: 25, subject: "Física", grade: "11B" },
  {
    id: 3,
    name: "Química 10C",
    students: 30,
    subject: "Química",
    grade: "10C",
  },
];

const students = [
  { id: 1, name: "Ana García", classroom: "10A", average: 9.2, attendance: 95 },
  {
    id: 2,
    name: "Carlos López",
    classroom: "10A",
    average: 8.5,
    attendance: 88,
  },
  {
    id: 3,
    name: "María Rodríguez",
    classroom: "11B",
    average: 9.8,
    attendance: 98,
  },
  {
    id: 4,
    name: "Juan Martínez",
    classroom: "11B",
    average: 7.9,
    attendance: 85,
  },
  {
    id: 5,
    name: "Laura Sánchez",
    classroom: "10C",
    average: 9.0,
    attendance: 92,
  },
  {
    id: 6,
    name: "Pedro Fernández",
    classroom: "10C",
    average: 8.3,
    attendance: 90,
  },
];

const meetings = [
  {
    id: 1,
    title: "Reunión de padres 10A",
    date: "2025-11-01",
    time: "15:00",
    type: "Padres",
  },
  {
    id: 2,
    title: "Junta departamental",
    date: "2025-11-05",
    time: "10:00",
    type: "Profesores",
  },
  {
    id: 3,
    title: "Evaluación trimestral",
    date: "2025-11-10",
    time: "14:00",
    type: "Académica",
  },
];

const recentGrades = [
  {
    student: "Ana García",
    subject: "Matemáticas",
    grade: 9.5,
    date: "2025-10-20",
  },
  {
    student: "Carlos López",
    subject: "Matemáticas",
    grade: 8.0,
    date: "2025-10-20",
  },
  {
    student: "María Rodríguez",
    subject: "Física",
    grade: 10.0,
    date: "2025-10-19",
  },
];

// --- Utilidades simples ---
function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-zinc-200 bg-white p-4 shadow-sm   ${className}`}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className = "" }) {
  return <div className={`mb-3 ${className} `}>{children}</div>;
}

function CardTitle({ children, className = "" }) {
  return (
    <h3 className={`text-base font-semibold text-zinc-900  ${className}`}>
      {children}
    </h3>
  );
}

function CardDescription({ children, className = "" }) {
  return <p className={`text-sm text-zinc-500  ${className}`}>{children}</p>;
}

function Badge({ children, variant = "solid", className = "" }) {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";
  const styles =
    variant === "outline"
      ? "border border-indigo-500 text-indigo-600 "
      : variant === "secondary"
      ? "bg-zinc-100 text-zinc-700  "
      : "bg-indigo-600 text-white";
  return <span className={`${base} ${styles} ${className}`}>{children}</span>;
}

function Button({ children, variant = "solid", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/30";
  const styles =
    variant === "outline"
      ? "border border-zinc-300 bg-transparent text-zinc-900 hover:bg-zinc-100   "
      : "bg-indigo-600 text-white hover:bg-indigo-500";
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30    ${className}`}
      {...props}
    />
  );
}

function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30    ${className}`}
      {...props}
    />
  );
}

function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-zinc-700 ">
      {children}
    </label>
  );
}

function Select({ value, onChange, children, className = "" }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30    ${className}`}
    >
      {children}
    </select>
  );
}

function Modal({ open, onClose, title, description, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-4 shadow-xl  ">
        <div className="mb-4">
          {title ? (
            <h4 className="text-lg font-semibold text-zinc-900 ">{title}</h4>
          ) : null}
          {description ? (
            <p className="text-sm text-zinc-500 ">{description}</p>
          ) : null}
        </div>
        {children}
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  // filtros y pestañas
  const [selectedClassroom, setSelectedClassroom] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [tab, setTab] = useState("classrooms");

  // modales
  const [openNotice, setOpenNotice] = useState(false);
  const [openMeeting, setOpenMeeting] = useState(false);
  const [openGrade, setOpenGrade] = useState(false);
  const [openAttendance, setOpenAttendance] = useState(false); // Nuevo estado para modal de asistencia

  // Datos del backend
  const [clases, setClases] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el formulario de calificación
  const [formCalificacion, setFormCalificacion] = useState({
    claseId: "",
    alumnoId: "",
    valor: "",
    materia: "",
    notas: "",
  });
  const [alumnosClase, setAlumnosClase] = useState([]);
  const [enviandoCalificacion, setEnviandoCalificacion] = useState(false);

  // Estados para el formulario de comunicado
  const [formComunicado, setFormComunicado] = useState({
    claseId: "",
    todosLosSalones: false,
    titulo: "",
    mensaje: "",
  });
  const [enviandoComunicado, setEnviandoComunicado] = useState(false);

  // Estados para el formulario de reunión
  const [formReunion, setFormReunion] = useState({
    titulo: "",
    fecha: "",
    hora: "",
    tipo: "PADRES",
    descripcion: "",
    claseId: "",
  });
  const [enviandoReunion, setEnviandoReunion] = useState(false);
  const [reuniones, setReuniones] = useState([]);

  // Estados para el formulario de asistencia
  const [formAsistencia, setFormAsistencia] = useState({
    claseId: "",
    materia: "",
    fecha: new Date().toISOString().split("T")[0], // Fecha actual por defecto
  });
  const [alumnosAsistencia, setAlumnosAsistencia] = useState([]);
  const [enviandoAsistencia, setEnviandoAsistencia] = useState(false);

  // Cargar clases del maestro y reuniones
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cargar clases y reuniones por separado para que un error no afecte al otro
        const [clasesResult, reunionesResult] = await Promise.allSettled([
          api.getClases(),
          api.getReuniones(),
        ]);

        // Procesar clases
        if (clasesResult.status === "fulfilled") {
          // Verificar que la respuesta sea un array
          if (Array.isArray(clasesResult.value)) {
            setClases(clasesResult.value);
          } else {
            console.error(
              "Respuesta de clases no es un array:",
              clasesResult.value
            );
            setError("Formato de respuesta inválido al cargar clases");
            setClases([]);
          }
        } else {
          console.error("Error cargando clases:", clasesResult.reason);
          const errorMessage =
            clasesResult.reason?.message ||
            clasesResult.reason?.error ||
            "Error desconocido";
          setError("Error al cargar clases: " + errorMessage);
          setClases([]);
        }

        // Procesar reuniones
        if (reunionesResult.status === "fulfilled") {
          // Verificar que la respuesta sea un array
          if (Array.isArray(reunionesResult.value)) {
            setReuniones(reunionesResult.value);
          } else {
            console.error(
              "Respuesta de reuniones no es un array:",
              reunionesResult.value
            );
            setReuniones([]);
          }
        } else {
          console.error("Error cargando reuniones:", reunionesResult.reason);
          // No mostrar error de reuniones como error principal, solo loguear
          setReuniones([]);
        }
      } catch (err) {
        console.error("Error inesperado cargando datos:", err);
        setError(err.message || "Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // Cargar alumnos cuando se selecciona una clase en el formulario
  useEffect(() => {
    const cargarAlumnos = async () => {
      if (!formCalificacion.claseId) {
        setAlumnosClase([]);
        return;
      }

      try {
        const alumnosData = await api.getAlumnosByClase(
          formCalificacion.claseId
        );
        setAlumnosClase(alumnosData);
        // Limpiar alumno seleccionado si cambia la clase
        setFormCalificacion((prev) => ({ ...prev, alumnoId: "" }));
      } catch (err) {
        console.error("Error cargando alumnos:", err);
        setAlumnosClase([]);
      }
    };

    cargarAlumnos();
  }, [formCalificacion.claseId]);

  // Cargar alumnos cuando se selecciona una clase en el formulario de asistencia
  useEffect(() => {
    const cargarAlumnosAsistencia = async () => {
      if (!formAsistencia.claseId) {
        setAlumnosAsistencia([]);
        return;
      }

      try {
        const alumnosData = await api.getAlumnosByClase(formAsistencia.claseId);
        // Inicializar todos los alumnos como "PRESENTE" por defecto
        const alumnosConEstado = alumnosData.map((alumno) => ({
          ...alumno,
          estado: "PRESENTE",
        }));
        setAlumnosAsistencia(alumnosConEstado);
      } catch (err) {
        console.error("Error cargando alumnos para asistencia:", err);
        setAlumnosAsistencia([]);
      }
    };

    cargarAlumnosAsistencia();
  }, [formAsistencia.claseId]);

  // Manejar cambio de clase en el formulario
  const handleClaseChange = (claseId) => {
    const claseSeleccionada = clases.find((c) => c.id === claseId);
    setFormCalificacion({
      ...formCalificacion,
      claseId,
      materia: claseSeleccionada?.materia || "",
      alumnoId: "",
    });
  };

  // Manejar cambio de clase en el formulario de asistencia
  const handleClaseChangeAsistencia = (claseId) => {
    const claseSeleccionada = clases.find((c) => c.id === claseId);
    setFormAsistencia({
      ...formAsistencia,
      claseId,
      materia: claseSeleccionada?.materia || "",
    });
  };

  // Manejar cambio de estado de asistencia para un alumno
  const handleCambioAsistencia = (alumnoId, nuevoEstado) => {
    setAlumnosAsistencia((prev) =>
      prev.map((alumno) =>
        alumno.id === alumnoId ? { ...alumno, estado: nuevoEstado } : alumno
      )
    );
  };

  // Manejar envío de calificación
  const handleEnviarCalificacion = async (e) => {
    e.preventDefault();

    if (
      !formCalificacion.claseId ||
      !formCalificacion.alumnoId ||
      !formCalificacion.valor ||
      !formCalificacion.materia
    ) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      setEnviandoCalificacion(true);
      await api.registrarCalificacion({
        alumnoId: formCalificacion.alumnoId,
        claseId: formCalificacion.claseId,
        valor: parseFloat(formCalificacion.valor),
        materia: formCalificacion.materia,
        notas: formCalificacion.notas || undefined,
      });

      alert("Calificación registrada exitosamente");
      // Limpiar formulario
      setFormCalificacion({
        claseId: "",
        alumnoId: "",
        valor: "",
        materia: "",
        notas: "",
      });
      setOpenGrade(false);
      // Recargar datos si es necesario
    } catch (err) {
      console.error("Error registrando calificación:", err);
      alert(err.message || "Error al registrar la calificación");
    } finally {
      setEnviandoCalificacion(false);
    }
  };

  // Manejar envío de comunicado
  const handleEnviarComunicado = async (e) => {
    e.preventDefault();

    if (!formComunicado.titulo || !formComunicado.mensaje) {
      alert("Por favor completa el título y el mensaje");
      return;
    }

    if (!formComunicado.todosLosSalones && !formComunicado.claseId) {
      alert("Por favor selecciona una clase o marca 'Todos los salones'");
      return;
    }

    try {
      setEnviandoComunicado(true);
      const result = await api.enviarComunicado({
        titulo: formComunicado.titulo,
        mensaje: formComunicado.mensaje,
        claseId: formComunicado.todosLosSalones
          ? undefined
          : formComunicado.claseId,
        todosLosSalones: formComunicado.todosLosSalones,
      });

      alert(
        `Comunicado enviado exitosamente a ${result.notificacionesEnviadas} padre(s)`
      );
      // Limpiar formulario
      setFormComunicado({
        claseId: "",
        todosLosSalones: false,
        titulo: "",
        mensaje: "",
      });
      setOpenNotice(false);
    } catch (err) {
      console.error("Error enviando comunicado:", err);
      alert(err.message || "Error al enviar el comunicado");
    } finally {
      setEnviandoComunicado(false);
    }
  };

  // Manejar envío de reunión
  const handleEnviarReunion = async (e) => {
    e.preventDefault();

    if (
      !formReunion.titulo ||
      !formReunion.fecha ||
      !formReunion.hora ||
      !formReunion.tipo
    ) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      setEnviandoReunion(true);
      const reunion = await api.crearReunion({
        titulo: formReunion.titulo,
        fecha: formReunion.fecha,
        hora: formReunion.hora,
        tipo: formReunion.tipo,
        descripcion: formReunion.descripcion || undefined,
        claseId: formReunion.claseId || undefined,
      });

      alert("Reunión agendada exitosamente");
      // Limpiar formulario
      setFormReunion({
        titulo: "",
        fecha: "",
        hora: "",
        tipo: "PADRES",
        descripcion: "",
        claseId: "",
      });
      setOpenMeeting(false);
      // Recargar reuniones
      const reunionesData = await api.getReuniones();
      setReuniones(reunionesData);
    } catch (err) {
      console.error("Error creando reunión:", err);
      alert(err.message || "Error al crear la reunión");
    } finally {
      setEnviandoReunion(false);
    }
  };

  // Manejar envío de asistencia
  const handleEnviarAsistencia = async (e) => {
    e.preventDefault();

    if (
      !formAsistencia.claseId ||
      !formAsistencia.materia ||
      !formAsistencia.fecha
    ) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    if (alumnosAsistencia.length === 0) {
      alert("No hay alumnos para registrar asistencia");
      return;
    }

    try {
      setEnviandoAsistencia(true);

      // Preparar datos para enviar
      const registrosAsistencia = alumnosAsistencia.map((alumno) => ({
        alumnoId: alumno.id,
        estado: alumno.estado,
        fecha: formAsistencia.fecha,
        claseId: formAsistencia.claseId,
        materia: formAsistencia.materia,
      }));

      // Aquí llamarías a tu API para guardar la asistencia
      // await api.registrarAsistencia(registrosAsistencia);

      // Por ahora solo mostramos un mensaje de éxito
      alert(
        `Asistencia registrada exitosamente para ${alumnosAsistencia.length} alumnos`
      );

      // Limpiar formulario
      setFormAsistencia({
        claseId: "",
        materia: "",
        fecha: new Date().toISOString().split("T")[0],
      });
      setAlumnosAsistencia([]);
      setOpenAttendance(false);
    } catch (err) {
      console.error("Error registrando asistencia:", err);
      alert(err.message || "Error al registrar la asistencia");
    } finally {
      setEnviandoAsistencia(false);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) =>
        (selectedClassroom === "all" || s.classroom === selectedClassroom) &&
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [selectedClassroom, searchTerm]);

  const topStudents = useMemo(() => {
    return [...students].sort((a, b) => b.average - a.average).slice(0, 3);
  }, []);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900  ">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-gradient-to-r from-[#295dfc] to-[#1f3fa9] backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-black">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl text-white font-semibold">
                  Portal del Profesor
                </h1>
                <p className="text-sm text-black-500">Prof. Roberto Méndez</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white cursor-pointer hover:bg-zinc-100 transition"
                onClick={() => navigate("/profesor/config")}
              >
                <Settings className="w-6 h-6 text-zinc-700" />
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 cursor-pointer overflow-hidden">
                <img
                  src="/src/assets/profesor1.png"
                  alt="avatar"
                  className="h-full w-full object-cover"
                  onClick={() => navigate("/login")}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left */}
          <div className="space-y-6 lg:col-span-3">
            {/* Resumen */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-zinc-500 ">
                  Resumen
                </CardTitle>
              </CardHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-100 text-indigo-700  ">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <span className="text-sm">Salones</span>
                  </div>
                  <span className="text-2xl font-bold">
                    {loading ? "..." : clases.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-100 text-emerald-700  ">
                      <Users className="h-4 w-4" />
                    </div>
                    <span className="text-sm">Alumnos</span>
                  </div>
                  <span className="text-2xl font-bold">{students.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-100 text-violet-700  ">
                      <CalendarIcon className="h-4 w-4" />
                    </div>
                    <span className="text-sm">Reuniones</span>
                  </div>
                  <span className="text-2xl font-bold">
                    {loading ? "..." : reuniones.length}
                  </span>
                </div>
              </div>
            </Card>

            {/* Acciones rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-zinc-500 ">
                  Acciones Rápidas
                </CardTitle>
              </CardHeader>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setOpenNotice(true)}
                >
                  <MessageSquare className="h-4 w-4" />
                  Nuevo Comunicado
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setOpenMeeting(true)}
                >
                  <CalendarIcon className="h-4 w-4" />
                  Agendar Reunión
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setOpenGrade(true)}
                >
                  <FileText className="h-4 w-4" />
                  Registrar Calificación
                </Button>
                {/* Nuevo botón para tomar asistencia */}
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setOpenAttendance(true)}
                >
                  <ClipboardCheck className="h-4 w-4" />
                  Tomar Asistencia
                </Button>
              </div>
            </Card>

            {/* Próximas reuniones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm text-zinc-500 ">
                  <Clock className="h-4 w-4" />
                  Próximas Reuniones
                </CardTitle>
              </CardHeader>
              <div className="h-52 space-y-3 overflow-y-auto pr-1">
                {loading ? (
                  <p className="text-center text-zinc-500 text-sm">
                    Cargando...
                  </p>
                ) : reuniones.length === 0 ? (
                  <p className="text-center text-zinc-500 text-sm">
                    No hay reuniones programadas
                  </p>
                ) : (
                  reuniones.slice(0, 5).map((m) => (
                    <div
                      key={m.id}
                      className="rounded-lg border border-zinc-200 bg-white p-3  "
                    >
                      <p className="text-sm font-medium">{m.titulo}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500 ">
                        <CalendarIcon className="h-3 w-3" />
                        <span>
                          {new Date(m.fecha).toLocaleDateString("es-MX")}
                        </span>
                        <span>•</span>
                        <Clock className="h-3 w-3" />
                        <span>{m.hora}</span>
                      </div>
                      {m.clase && (
                        <p className="mt-1 text-xs text-zinc-400">
                          {m.clase.nombre}
                        </p>
                      )}
                      <Badge variant="secondary" className="mt-2">
                        {m.tipo}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Center */}
          <div className="space-y-6 lg:col-span-6">
            {/* Salones y alumnos */}
            <Card>
              <CardHeader>
                <CardTitle>Mis Salones y Alumnos</CardTitle>
                <CardDescription>
                  Gestiona tus clases y estudiantes
                </CardDescription>
              </CardHeader>

              {/* Tabs simples */}
              <div className="grid w-full grid-cols-2 rounded-lg border border-zinc-200 p-1 text-sm ">
                <button
                  onClick={() => setTab("classrooms")}
                  className={`rounded-md px-3 py-2 font-medium ${
                    tab === "classrooms"
                      ? "bg-[#295dfc] text-white shadow-sm  "
                      : "text-zinc-500 hover:text-zinc-700  "
                  }`}
                >
                  Salones
                </button>
                <button
                  onClick={() => setTab("students")}
                  className={`rounded-md px-3 py-2 font-medium ${
                    tab === "students"
                      ? "bg-[#295dfc] text-white shadow-sm "
                      : "text-zinc-500 hover:text-zinc-700  "
                  }`}
                >
                  Alumnos
                </button>
              </div>

              {/* Contenido tabs */}
              {tab === "classrooms" ? (
                <div className="mt-4 space-y-4">
                  {loading ? (
                    <p className="text-center text-zinc-500">
                      Cargando clases...
                    </p>
                  ) : error ? (
                    <div className="text-center">
                      <p className="text-red-500 font-medium mb-2">{error}</p>
                      <button
                        onClick={() => window.location.reload()}
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Recargar página
                      </button>
                    </div>
                  ) : clases.length === 0 ? (
                    <p className="text-center text-zinc-500">
                      No tienes clases asignadas
                    </p>
                  ) : (
                    clases.map((c) => (
                      <div
                        key={c.id}
                        className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-indigo-500  "
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{c.nombre}</h3>
                            <p className="text-sm text-zinc-500 ">
                              {c.materia} • Grado {c.grado}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {c.inscripciones?.length || 0} alumnos
                          </Badge>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              setSelectedClassroom(c.id);
                              setTab("students");
                            }}
                          >
                            <Users className="h-4 w-4" /> Ver Alumnos
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <BarChart3 className="h-4 w-4" /> Estadísticas
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  <div className="flex gap-2 flex-col">
                    <div className="relative flex-1">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                      <Input
                        placeholder="Buscar alumno..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-[140px]"
                      />
                    </div>
                    <Select
                      value={selectedClassroom}
                      onChange={(e) => setSelectedClassroom(e.target.value)}
                      className="w-[140px] "
                    >
                      <option value="all">Todos</option>
                      <option value="10A">10A</option>
                      <option value="11B">11B</option>
                      <option value="10C">10C</option>
                    </Select>
                  </div>

                  <div className="h-[400px] space-y-3 overflow-y-auto pr-1">
                    {filteredStudents.map((s) => (
                      <div
                        key={s.id}
                        className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-indigo-500  "
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                              {s.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <p className="font-medium">{s.name}</p>
                              <p className="text-sm text-zinc-500 ">
                                Salón {s.classroom}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              Promedio: {s.average}
                            </p>
                            <p className="text-xs text-zinc-500 ">
                              Asistencia: {s.attendance}%
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Calificaciones recientes */}
            <Card>
              <CardHeader>
                <CardTitle>Calificaciones Recientes</CardTitle>
                <CardDescription>
                  Últimas evaluaciones registradas
                </CardDescription>
              </CardHeader>
              <div className="space-y-3">
                {recentGrades.map((g, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3  "
                  >
                    <div>
                      <p className="font-medium">{g.student}</p>
                      <p className="text-sm text-zinc-500 ">{g.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600 ">
                        {g.grade}
                      </p>
                      <p className="text-xs text-zinc-500 ">{g.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right */}
          <div className="space-y-6 lg:col-span-3">
            {/* Rendimiento general */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm text-zinc-500 ">
                  <TrendingUp className="h-4 w-4" /> Rendimiento General
                </CardTitle>
              </CardHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500 ">Promedio General</span>
                    <span className="font-semibold">8.8</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-200 ">
                    <div
                      className="h-full rounded-full bg-indigo-600"
                      style={{ width: "88%" }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500 ">Asistencia Promedio</span>
                    <span className="font-semibold">91%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-200 ">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: "91%" }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500 ">Tareas Entregadas</span>
                    <span className="font-semibold">85%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-200 ">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{ width: "85%" }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Por materia */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-zinc-500 ">
                  Por Materia
                </CardTitle>
              </CardHeader>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-indigo-600"></span>
                    <span className="text-sm">Matemáticas</span>
                  </div>
                  <span className="text-sm font-semibold">8.5</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                    <span className="text-sm">Física</span>
                  </div>
                  <span className="text-sm font-semibold">8.9</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-violet-500"></span>
                    <span className="text-sm">Química</span>
                  </div>
                  <span className="text-sm font-semibold">9.0</span>
                </div>
              </div>
            </Card>

            {/* Mejores promedios */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-zinc-500 ">
                  Mejores Promedios
                </CardTitle>
              </CardHeader>
              <div className="space-y-3">
                {topStudents.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700  ">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-zinc-500 ">{s.classroom}</p>
                    </div>
                    <span className="text-lg font-bold text-indigo-600 ">
                      {s.average}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Actividad */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-zinc-500 ">
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-600"></span>
                  <div>
                    <p>3 calificaciones registradas</p>
                    <p className="text-xs text-zinc-500 ">Hace 2 horas</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"></span>
                  <div>
                    <p>Comunicado enviado a 10A</p>
                    <p className="text-xs text-zinc-500 ">Hace 5 horas</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-violet-500"></span>
                  <div>
                    <p>Reunión programada</p>
                    <p className="text-xs text-zinc-500 ">Ayer</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Modales */}
      <Modal
        open={openNotice}
        onClose={() => {
          setOpenNotice(false);
          setFormComunicado({
            claseId: "",
            todosLosSalones: false,
            titulo: "",
            mensaje: "",
          });
        }}
        title="Enviar Comunicado"
        description="Envía un mensaje a los padres de familia"
      >
        <form onSubmit={handleEnviarComunicado} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Destinatario *</Label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formComunicado.todosLosSalones}
                  onChange={(e) =>
                    setFormComunicado({
                      ...formComunicado,
                      todosLosSalones: e.target.checked,
                      claseId: e.target.checked ? "" : formComunicado.claseId,
                    })
                  }
                  className="rounded border-zinc-300"
                />
                <span className="text-sm">Todos los salones</span>
              </label>
              {!formComunicado.todosLosSalones && (
                <Select
                  id="recipient"
                  value={formComunicado.claseId}
                  onChange={(e) =>
                    setFormComunicado({
                      ...formComunicado,
                      claseId: e.target.value,
                    })
                  }
                  required={!formComunicado.todosLosSalones}
                >
                  <option value="" disabled>
                    Seleccionar clase
                  </option>
                  {clases.map((clase) => (
                    <option key={clase.id} value={clase.id}>
                      {clase.nombre} ({clase.materia} - {clase.grado})
                    </option>
                  ))}
                </Select>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Asunto *</Label>
            <Input
              id="subject"
              value={formComunicado.titulo}
              onChange={(e) =>
                setFormComunicado({
                  ...formComunicado,
                  titulo: e.target.value,
                })
              }
              placeholder="Título del comunicado"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Mensaje *</Label>
            <Textarea
              id="message"
              rows={4}
              value={formComunicado.mensaje}
              onChange={(e) =>
                setFormComunicado({
                  ...formComunicado,
                  mensaje: e.target.value,
                })
              }
              placeholder="Escribe tu mensaje aquí..."
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={enviandoComunicado}
          >
            <Send className="h-4 w-4" />{" "}
            {enviandoComunicado ? "Enviando..." : "Enviar Comunicado"}
          </Button>
        </form>
      </Modal>

      <Modal
        open={openMeeting}
        onClose={() => {
          setOpenMeeting(false);
          setFormReunion({
            titulo: "",
            fecha: "",
            hora: "",
            tipo: "PADRES",
            descripcion: "",
            claseId: "",
          });
        }}
        title="Agendar Reunión"
        description="Programa una reunión con padres o colegas"
      >
        <form onSubmit={handleEnviarReunion} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meeting-title">Título *</Label>
            <Input
              id="meeting-title"
              value={formReunion.titulo}
              onChange={(e) =>
                setFormReunion({
                  ...formReunion,
                  titulo: e.target.value,
                })
              }
              placeholder="Nombre de la reunión"
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="meeting-date">Fecha *</Label>
              <Input
                id="meeting-date"
                type="date"
                value={formReunion.fecha}
                onChange={(e) =>
                  setFormReunion({
                    ...formReunion,
                    fecha: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting-time">Hora *</Label>
              <Input
                id="meeting-time"
                type="time"
                value={formReunion.hora}
                onChange={(e) =>
                  setFormReunion({
                    ...formReunion,
                    hora: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="meeting-type">Tipo *</Label>
            <Select
              id="meeting-type"
              value={formReunion.tipo}
              onChange={(e) =>
                setFormReunion({
                  ...formReunion,
                  tipo: e.target.value,
                })
              }
              required
            >
              <option value="PADRES">Padres de familia</option>
              <option value="DEPARTAMENTAL">Departamental</option>
              <option value="GENERAL">General</option>
            </Select>
          </div>
          {formReunion.tipo === "PADRES" && (
            <div className="space-y-2">
              <Label htmlFor="meeting-class">Clase (opcional)</Label>
              <Select
                id="meeting-class"
                value={formReunion.claseId}
                onChange={(e) =>
                  setFormReunion({
                    ...formReunion,
                    claseId: e.target.value,
                  })
                }
              >
                <option value="">Sin clase específica</option>
                {clases.map((clase) => (
                  <option key={clase.id} value={clase.id}>
                    {clase.nombre} ({clase.materia} - {clase.grado})
                  </option>
                ))}
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="meeting-description">Descripción (opcional)</Label>
            <Textarea
              id="meeting-description"
              rows={3}
              value={formReunion.descripcion}
              onChange={(e) =>
                setFormReunion({
                  ...formReunion,
                  descripcion: e.target.value,
                })
              }
              placeholder="Detalles adicionales..."
            />
          </div>
          <Button type="submit" className="w-full" disabled={enviandoReunion}>
            <Plus className="h-4 w-4" />{" "}
            {enviandoReunion ? "Creando..." : "Crear Reunión"}
          </Button>
        </form>
      </Modal>

      <Modal
        open={openGrade}
        onClose={() => {
          setOpenGrade(false);
          setFormCalificacion({
            claseId: "",
            alumnoId: "",
            valor: "",
            materia: "",
            notas: "",
          });
        }}
        title="Registrar Calificación"
        description="Registra una calificación para un alumno"
      >
        <form onSubmit={handleEnviarCalificacion} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="grade-classroom">Clase *</Label>
            <Select
              id="grade-classroom"
              value={formCalificacion.claseId}
              onChange={(e) => handleClaseChange(e.target.value)}
              required
            >
              <option value="" disabled>
                Seleccionar clase
              </option>
              {clases.map((clase) => (
                <option key={clase.id} value={clase.id}>
                  {clase.nombre} ({clase.materia} - {clase.grado})
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade-student">Alumno *</Label>
            <Select
              id="grade-student"
              value={formCalificacion.alumnoId}
              onChange={(e) =>
                setFormCalificacion({
                  ...formCalificacion,
                  alumnoId: e.target.value,
                })
              }
              required
              disabled={!formCalificacion.claseId || alumnosClase.length === 0}
            >
              <option value="" disabled>
                {!formCalificacion.claseId
                  ? "Primero selecciona una clase"
                  : alumnosClase.length === 0
                  ? "Cargando alumnos..."
                  : "Seleccionar alumno"}
              </option>
              {alumnosClase.map((alumno) => (
                <option key={alumno.id} value={alumno.id}>
                  {alumno.nombre} {alumno.apellidos}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade-subject">Materia *</Label>
            <Input
              id="grade-subject"
              value={formCalificacion.materia}
              onChange={(e) =>
                setFormCalificacion({
                  ...formCalificacion,
                  materia: e.target.value,
                })
              }
              placeholder="Ej: Matemáticas"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade-value">Calificación *</Label>
            <Input
              id="grade-value"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={formCalificacion.valor}
              onChange={(e) =>
                setFormCalificacion({
                  ...formCalificacion,
                  valor: e.target.value,
                })
              }
              placeholder="0.0 - 10.0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade-notes">Notas (opcional)</Label>
            <Textarea
              id="grade-notes"
              rows={3}
              value={formCalificacion.notas}
              onChange={(e) =>
                setFormCalificacion({
                  ...formCalificacion,
                  notas: e.target.value,
                })
              }
              placeholder="Observaciones adicionales..."
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={enviandoCalificacion}
          >
            {enviandoCalificacion ? "Guardando..." : "Guardar Calificación"}
          </Button>
        </form>
      </Modal>

      {/* Modal para tomar asistencia */}
      <Modal
        open={openAttendance}
        onClose={() => {
          setOpenAttendance(false);
          setFormAsistencia({
            claseId: "",
            materia: "",
            fecha: new Date().toISOString().split("T")[0],
          });
          setAlumnosAsistencia([]);
        }}
        title="Tomar Asistencia"
        description="Registra la asistencia para una clase"
      >
        <form onSubmit={handleEnviarAsistencia} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="attendance-class">Clase *</Label>
              <Select
                id="attendance-class"
                value={formAsistencia.claseId}
                onChange={(e) => handleClaseChangeAsistencia(e.target.value)}
                required
              >
                <option value="" disabled>
                  Seleccionar clase
                </option>
                {clases.map((clase) => (
                  <option key={clase.id} value={clase.id}>
                    {clase.nombre} ({clase.materia} - {clase.grado})
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendance-date">Fecha *</Label>
              <Input
                id="attendance-date"
                type="date"
                value={formAsistencia.fecha}
                onChange={(e) =>
                  setFormAsistencia({
                    ...formAsistencia,
                    fecha: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attendance-subject">Materia *</Label>
            <Input
              id="attendance-subject"
              value={formAsistencia.materia}
              onChange={(e) =>
                setFormAsistencia({
                  ...formAsistencia,
                  materia: e.target.value,
                })
              }
              placeholder="Ej: Matemáticas"
              required
            />
          </div>

          {/* Lista de alumnos para tomar asistencia */}
          {alumnosAsistencia.length > 0 && (
            <div className="space-y-3">
              <Label>Asistencia de Alumnos</Label>
              <div className="max-h-60 overflow-y-auto border rounded-lg p-3 space-y-2">
                {alumnosAsistencia.map((alumno) => (
                  <div
                    key={alumno.id}
                    className="flex items-center justify-between p-2 border-b last:border-b-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {alumno.nombre} {alumno.apellidos}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleCambioAsistencia(alumno.id, "PRESENTE")
                        }
                        className={`px-3 py-1 text-xs rounded border ${
                          alumno.estado === "PRESENTE"
                            ? "bg-green-500 text-white border-green-500"
                            : "bg-white text-green-600 border-green-600"
                        }`}
                      >
                        Presente
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleCambioAsistencia(alumno.id, "FALTA")
                        }
                        className={`px-3 py-1 text-xs rounded border ${
                          alumno.estado === "FALTA"
                            ? "bg-red-500 text-white border-red-500"
                            : "bg-white text-red-600 border-red-600"
                        }`}
                      >
                        Falta
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleCambioAsistencia(alumno.id, "RETARDO")
                        }
                        className={`px-3 py-1 text-xs rounded border ${
                          alumno.estado === "RETARDO"
                            ? "bg-yellow-500 text-white border-yellow-500"
                            : "bg-white text-yellow-600 border-yellow-600"
                        }`}
                      >
                        Retardo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={enviandoAsistencia || alumnosAsistencia.length === 0}
          >
            <ClipboardCheck className="h-4 w-4" />
            {enviandoAsistencia ? "Guardando..." : "Guardar Asistencia"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
