import prisma from '../config/database.js';
import { AppError } from '../middleware/error.middleware.js';

export const profesoresService = {
  async getClasesByProfesor(profesorId: string) {
    const clases = await prisma.clase.findMany({
      where: { profesorId },
      include: {
        inscripciones: {
          include: {
            alumno: {
              select: {
                id: true,
                nombre: true,
                apellidos: true,
                grado: true,
                nivel: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return clases;
  },

  async getAlumnosByClase(claseId: string, profesorId: string) {
    // Verificar que la clase pertenece al profesor
    const clase = await prisma.clase.findFirst({
      where: {
        id: claseId,
        profesorId,
      },
    });

    if (!clase) {
      throw new AppError('Clase no encontrada o no tienes permisos', 404);
    }

    const inscripciones = await prisma.inscripcion.findMany({
      where: { claseId },
      include: {
        alumno: {
          include: {
            asistencias: {
              where: {
                claseId,
              },
              orderBy: {
                fecha: 'desc',
              },
              take: 5,
            },
            calificaciones: {
              where: {
                claseId,
              },
              orderBy: {
                fecha: 'desc',
              },
              take: 5,
            },
          },
        },
      },
    });

    return inscripciones.map((inscripcion) => inscripcion.alumno);
  },

  async createAsistencia(data: {
    fecha: Date;
    estado: 'PRESENTE' | 'AUSENTE' | 'RETRASO';
    alumnoId: string;
    claseId: string;
    profesorId: string;
  }) {
    // Verificar que la clase pertenece al profesor
    const clase = await prisma.clase.findFirst({
      where: {
        id: data.claseId,
        profesorId: data.profesorId,
      },
    });

    if (!clase) {
      throw new AppError('Clase no encontrada o no tienes permisos', 404);
    }

    // Verificar que el alumno está inscrito en la clase
    const inscripcion = await prisma.inscripcion.findFirst({
      where: {
        alumnoId: data.alumnoId,
        claseId: data.claseId,
      },
    });

    if (!inscripcion) {
      throw new AppError('El alumno no está inscrito en esta clase', 400);
    }

    // Crear o actualizar asistencia
    const asistencia = await prisma.asistencia.upsert({
      where: {
        alumnoId_claseId_fecha: {
          alumnoId: data.alumnoId,
          claseId: data.claseId,
          fecha: data.fecha,
        },
      },
      update: {
        estado: data.estado,
      },
      create: {
        fecha: data.fecha,
        estado: data.estado,
        alumnoId: data.alumnoId,
        claseId: data.claseId,
      },
      include: {
        alumno: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
          },
        },
        clase: true,
      },
    });

    return asistencia;
  },

  async createCalificacion(data: {
    valor: number;
    materia: string;
    notas?: string;
    alumnoId: string;
    claseId: string;
    profesorId: string;
  }) {
    // Verificar que la clase pertenece al profesor
    const clase = await prisma.clase.findFirst({
      where: {
        id: data.claseId,
        profesorId: data.profesorId,
      },
    });

    if (!clase) {
      throw new AppError('Clase no encontrada o no tienes permisos', 404);
    }

    // Verificar que el alumno está inscrito en la clase
    const inscripcion = await prisma.inscripcion.findFirst({
      where: {
        alumnoId: data.alumnoId,
        claseId: data.claseId,
      },
    });

    if (!inscripcion) {
      throw new AppError('El alumno no está inscrito en esta clase', 400);
    }

    const calificacion = await prisma.calificacion.create({
      data: {
        valor: data.valor,
        materia: data.materia,
        notas: data.notas,
        alumnoId: data.alumnoId,
        claseId: data.claseId,
      },
      include: {
        alumno: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
            padreTutorId: true,
          },
        },
        clase: true,
      },
    });

    // Crear notificación para el padre del alumno
    await prisma.notificacion.create({
      data: {
        titulo: `Nueva calificación en ${data.materia}`,
        mensaje: `${calificacion.alumno.nombre} ${calificacion.alumno.apellidos} obtuvo ${data.valor} en ${data.materia}. ${data.notas || ''}`,
        tipo: 'calificacion',
        icono: '📝',
        usuarioId: calificacion.alumno.padreTutorId,
      },
    });

    return calificacion;
  },

  async createComunicado(data: {
    titulo: string;
    mensaje: string;
    claseId?: string;
    todosLosSalones?: boolean;
    profesorId: string;
  }) {
    let usuariosIds: string[] = [];

    if (data.todosLosSalones) {
      // Obtener todos los padres de todos los alumnos de todas las clases del profesor
      const clases = await prisma.clase.findMany({
        where: { profesorId: data.profesorId },
        include: {
          inscripciones: {
            include: {
              alumno: {
                select: {
                  padreTutorId: true,
                },
              },
            },
          },
        },
      });

      usuariosIds = [
        ...new Set(
          clases
            .flatMap((clase) => clase.inscripciones)
            .map((inscripcion) => inscripcion.alumno.padreTutorId)
        ),
      ];
    } else if (data.claseId) {
      // Verificar que la clase pertenece al profesor
      const clase = await prisma.clase.findFirst({
        where: {
          id: data.claseId,
          profesorId: data.profesorId,
        },
        include: {
          inscripciones: {
            include: {
              alumno: {
                select: {
                  padreTutorId: true,
                },
              },
            },
          },
        },
      });

      if (!clase) {
        throw new AppError('Clase no encontrada o no tienes permisos', 404);
      }

      usuariosIds = [
        ...new Set(clase.inscripciones.map((inscripcion) => inscripcion.alumno.padreTutorId)),
      ];
    } else {
      throw new AppError('Debes especificar una clase o todos los salones', 400);
    }

    // Obtener información de la clase para incluir en el mensaje
    let claseInfo = '';
    if (data.claseId) {
      const clase = await prisma.clase.findUnique({
        where: { id: data.claseId },
        select: { nombre: true, materia: true, grado: true },
      });
      if (clase) {
        claseInfo = `\n\nClase: ${clase.nombre} (${clase.materia} - ${clase.grado})`;
      }
    } else if (data.todosLosSalones) {
      claseInfo = '\n\nEnviado a todos los salones';
    }

    // Crear notificaciones para todos los padres
    const notificaciones = await Promise.all(
      usuariosIds.map((usuarioId) =>
        prisma.notificacion.create({
          data: {
            titulo: data.titulo,
            mensaje: `${data.mensaje}${claseInfo}`,
            tipo: 'comunicado',
            icono: '📢',
            usuarioId,
          },
        })
      )
    );

    return notificaciones;
  },
};


