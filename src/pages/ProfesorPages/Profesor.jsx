"use client";

import { useMemo, useState } from "react";
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
} from "lucide-react";

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

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900  ">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-gradient-to-r from-[#295dfc] to-[#1f3fa9] backdrop-blur  ">
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
                <p className="text-sm text-black-500 ">Prof. Roberto Méndez</p>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 font-semibold text-zinc-700  cursor-pointer ">
              <img
                src="/src/assets/profesor1.png"
                alt=""
                className=" bg-cover h-full w-full "
              />
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
                    {classrooms.length}
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
                  <span className="text-2xl font-bold">{meetings.length}</span>
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
                {meetings.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-lg border border-zinc-200 bg-white p-3  "
                  >
                    <p className="text-sm font-medium">{m.title}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500 ">
                      <CalendarIcon className="h-3 w-3" />
                      <span>{m.date}</span>
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      <span>{m.time}</span>
                    </div>
                    <Badge variant="secondary" className="mt-2">
                      {m.type}
                    </Badge>
                  </div>
                ))}
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
                  {classrooms.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-indigo-500  "
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{c.name}</h3>
                          <p className="text-sm text-zinc-500 ">
                            {c.subject} • Grado {c.grade}
                          </p>
                        </div>
                        <Badge variant="outline">{c.students} alumnos</Badge>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" className="flex-1">
                          <Users className="h-4 w-4" /> Ver Alumnos
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <BarChart3 className="h-4 w-4" /> Estadísticas
                        </Button>
                      </div>
                    </div>
                  ))}
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
        onClose={() => setOpenNotice(false)}
        title="Enviar Comunicado"
        description="Envía un mensaje a tus alumnos o padres de familia"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Destinatario</Label>
            <Select defaultValue="" onChange={() => {}}>
              <option value="" disabled>
                Seleccionar grupo
              </option>
              <option value="all">Todos los salones</option>
              <option value="10A">Matemáticas 10A</option>
              <option value="11B">Física 11B</option>
              <option value="10C">Química 10C</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Asunto</Label>
            <Input id="subject" placeholder="Título del comunicado" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Mensaje</Label>
            <Textarea
              id="message"
              rows={4}
              placeholder="Escribe tu mensaje aquí..."
            />
          </div>
          <Button className="w-full">
            <Send className="h-4 w-4" /> Enviar Comunicado
          </Button>
        </div>
      </Modal>

      <Modal
        open={openMeeting}
        onClose={() => setOpenMeeting(false)}
        title="Nueva Reunión"
        description="Programa una reunión con padres o colegas"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meeting-title">Título</Label>
            <Input id="meeting-title" placeholder="Nombre de la reunión" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="meeting-date">Fecha</Label>
              <Input id="meeting-date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting-time">Hora</Label>
              <Input id="meeting-time" type="time" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="meeting-type">Tipo</Label>
            <Select defaultValue="" onChange={() => {}}>
              <option value="" disabled>
                Seleccionar tipo
              </option>
              <option value="parents">Padres de familia</option>
              <option value="teachers">Profesores</option>
              <option value="academic">Académica</option>
            </Select>
          </div>
          <Button className="w-full">
            <Plus className="h-4 w-4" /> Crear Reunión
          </Button>
        </div>
      </Modal>

      <Modal
        open={openGrade}
        onClose={() => setOpenGrade(false)}
        title="Nueva Calificación"
        description="Registra una calificación para un alumno"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="grade-classroom">Salón</Label>
            <Select defaultValue="" onChange={() => {}}>
              <option value="" disabled>
                Seleccionar salón
              </option>
              <option value="10A">Matemáticas 10A</option>
              <option value="11B">Física 11B</option>
              <option value="10C">Química 10C</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="grade-student">Alumno</Label>
            <Select defaultValue="" onChange={() => {}}>
              <option value="" disabled>
                Seleccionar alumno
              </option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="grade-value">Calificación</Label>
            <Input
              id="grade-value"
              type="number"
              min="0"
              max="10"
              step="0.1"
              placeholder="0.0 - 10.0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="grade-notes">Notas (opcional)</Label>
            <Textarea
              id="grade-notes"
              rows={3}
              placeholder="Observaciones..."
            />
          </div>
          <Button className="w-full">Guardar Calificación</Button>
        </div>
      </Modal>
    </div>
  );
}
