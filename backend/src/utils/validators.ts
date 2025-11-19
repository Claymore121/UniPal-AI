import { z } from 'zod';

// Validaciones de autenticación
export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellidos: z.string().optional(),
  telefono: z.string().optional(),
  role: z.enum(['PADRE_TUTOR', 'MAESTRO', 'ADMINISTRADOR']).default('PADRE_TUTOR'),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

// Validaciones de alumnos
export const createAlumnoSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellidos: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres'),
  nivel: z.enum(['SECUNDARIA', 'PREPARATORIA']),
  grado: z.string().min(1, 'El grado es requerido'),
  claveAlumno: z.string().optional(),
  numeroControl: z.string().optional(),
  sexo: z.string().min(1, 'El sexo es requerido'),
  imgProfile: z.string().optional(),
});

// Validaciones de asistencias
export const createAsistenciaSchema = z.object({
  fecha: z.string().or(z.date()),
  estado: z.enum(['PRESENTE', 'AUSENTE', 'RETRASO']),
  alumnoId: z.string().min(1, 'El ID del alumno es requerido'),
  claseId: z.string().min(1, 'El ID de la clase es requerido'),
});

// Validaciones de calificaciones
export const createCalificacionSchema = z.object({
  valor: z.number().min(0).max(10),
  materia: z.string().min(1, 'La materia es requerida'),
  notas: z.string().optional(),
  alumnoId: z.string().min(1, 'El ID del alumno es requerido'),
  claseId: z.string().min(1, 'El ID de la clase es requerido'),
});

// Validaciones de notificaciones
export const createNotificacionSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido'),
  mensaje: z.string().min(1, 'El mensaje es requerido'),
  tipo: z.string().min(1, 'El tipo es requerido'),
  icono: z.string().optional(),
  usuarioId: z.string().min(1, 'El ID del usuario es requerido'),
});

// Validaciones de comunicados
export const createComunicadoSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido'),
  mensaje: z.string().min(1, 'El mensaje es requerido'),
  claseId: z.string().optional(),
  todosLosSalones: z.boolean().default(false),
});

// Validaciones de incidencias
export const createIncidenciaSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido'),
  descripcion: z.string().min(1, 'La descripción es requerida'),
  tipo: z.enum(['CONDUCTA', 'ACADEMICA', 'DISCIPLINARIA', 'OTRA']),
  severidad: z.enum(['BAJA', 'MEDIA', 'ALTA', 'CRITICA']),
  alumnoId: z.string().uuid('El ID del alumno debe ser un UUID válido'),
  claseId: z.string().uuid('El ID de la clase debe ser un UUID válido').optional(),
});

// Validaciones de plantillas
export const createPlantillaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  asunto: z.string().min(1, 'El asunto es requerido'),
  contenido: z.string().min(1, 'El contenido es requerido'),
  tipo: z.enum(['ASISTENCIA', 'CALIFICACION', 'INCIDENCIA', 'GENERAL']),
  canal: z.enum(['WHATSAPP', 'EMAIL', 'AMBOS']),
});

// Validaciones de reuniones
export const createReunionSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido'),
  fecha: z.string().or(z.date()),
  hora: z.string().min(1, 'La hora es requerida'),
  tipo: z.enum(['PADRES', 'DEPARTAMENTAL', 'GENERAL']),
  descripcion: z.string().optional(),
  claseId: z.string().uuid().optional(),
});


