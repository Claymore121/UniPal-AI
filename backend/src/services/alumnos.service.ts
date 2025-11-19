import prisma from '../config/database.js';
import { AppError } from '../middleware/error.middleware.js';

export const alumnosService = {
  async getHijosByPadre(padreTutorId: string) {
    const hijos = await prisma.alumno.findMany({
      where: { padreTutorId },
      include: {
        inscripciones: {
          include: {
            clase: {
              include: {
                profesor: {
                  select: {
                    id: true,
                    nombre: true,
                    apellidos: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return hijos;
  },

  async getAlumnoById(alumnoId: string, padreTutorId?: string) {
    const where: any = { id: alumnoId };
    if (padreTutorId) {
      where.padreTutorId = padreTutorId;
    }

    const alumno = await prisma.alumno.findFirst({
      where,
      include: {
        inscripciones: {
          include: {
            clase: true,
          },
        },
        asistencias: {
          include: {
            clase: true,
          },
          orderBy: {
            fecha: 'desc',
          },
          take: 10,
        },
        calificaciones: {
          include: {
            clase: true,
          },
          orderBy: {
            fecha: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!alumno) {
      throw new AppError('Alumno no encontrado', 404);
    }

    return alumno;
  },

  async createAlumno(data: {
    nombre: string;
    apellidos: string;
    nivel: 'SECUNDARIA' | 'PREPARATORIA';
    grado: string;
    claveAlumno?: string;
    numeroControl?: string;
    sexo: string;
    imgProfile?: string;
    padreTutorId: string;
  }) {
    // Validar que el padre existe
    const padre = await prisma.usuario.findUnique({
      where: { id: data.padreTutorId },
    });

    if (!padre) {
      throw new AppError('Padre/Tutor no encontrado', 404);
    }

    if (padre.role !== 'PADRE_TUTOR') {
      throw new AppError('El usuario no es un padre/tutor', 403);
    }

    const alumno = await prisma.alumno.create({
      data: {
        nombre: data.nombre,
        apellidos: data.apellidos,
        nivel: data.nivel,
        grado: data.grado,
        claveAlumno: data.claveAlumno,
        numeroControl: data.numeroControl,
        sexo: data.sexo,
        imgProfile: data.imgProfile,
        padreTutorId: data.padreTutorId,
      },
      include: {
        inscripciones: {
          include: {
            clase: true,
          },
        },
      },
    });

    return alumno;
  },

  async getAsistenciasByAlumno(alumnoId: string, padreTutorId?: string) {
    // Verificar que el alumno pertenece al padre
    if (padreTutorId) {
      const alumno = await prisma.alumno.findFirst({
        where: {
          id: alumnoId,
          padreTutorId,
        },
      });

      if (!alumno) {
        throw new AppError('Alumno no encontrado o no tienes permisos', 404);
      }
    }

    const asistencias = await prisma.asistencia.findMany({
      where: { alumnoId },
      include: {
        clase: true,
        alumno: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
          },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    });

    return asistencias;
  },

  async getCalificacionesByAlumno(alumnoId: string, padreTutorId?: string) {
    // Verificar que el alumno pertenece al padre
    if (padreTutorId) {
      const alumno = await prisma.alumno.findFirst({
        where: {
          id: alumnoId,
          padreTutorId,
        },
      });

      if (!alumno) {
        throw new AppError('Alumno no encontrado o no tienes permisos', 404);
      }
    }

    const calificaciones = await prisma.calificacion.findMany({
      where: { alumnoId },
      include: {
        clase: true,
        alumno: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
          },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    });

    return calificaciones;
  },
};







