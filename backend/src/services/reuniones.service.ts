import prisma from '../config/database.js';
import { AppError } from '../middleware/error.middleware.js';

export const reunionesService = {
  /**
   * Crear una nueva reunión
   */
  async crearReunion(
    data: {
      titulo: string;
      fecha: Date;
      hora: string;
      tipo: string;
      descripcion?: string;
      claseId?: string;
    },
    creadoPorId: string
  ) {
    // Verificar que el usuario es maestro o administrador
    const usuario = await prisma.usuario.findUnique({
      where: { id: creadoPorId },
    });

    if (!usuario || (usuario.role !== 'MAESTRO' && usuario.role !== 'ADMINISTRADOR')) {
      throw new AppError('Solo maestros y administradores pueden crear reuniones', 403);
    }

    // Si se especifica una clase, verificar que el maestro es el profesor de esa clase
    if (data.claseId && usuario.role === 'MAESTRO') {
      const clase = await prisma.clase.findFirst({
        where: {
          id: data.claseId,
          profesorId: creadoPorId,
        },
      });

      if (!clase) {
        throw new AppError('Clase no encontrada o no tienes permisos', 404);
      }
    }

    const reunion = await prisma.reunion.create({
      data: {
        titulo: data.titulo,
        fecha: data.fecha,
        hora: data.hora,
        tipo: data.tipo,
        descripcion: data.descripcion,
        claseId: data.claseId,
        creadoPorId: creadoPorId,
      },
      include: {
        clase: {
          select: {
            id: true,
            nombre: true,
            materia: true,
            grado: true,
          },
        },
        creadoPor: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
          },
        },
      },
    });

    // Si la reunión es de tipo PADRES y tiene una clase, crear notificaciones para los padres
    if (data.tipo === 'PADRES' && data.claseId) {
      const clase = await prisma.clase.findFirst({
        where: { id: data.claseId },
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

      if (clase) {
        const padresIds = [
          ...new Set(clase.inscripciones.map((inscripcion) => inscripcion.alumno.padreTutorId)),
        ];

        // Crear notificaciones para los padres
        await Promise.all(
          padresIds.map((padreId) =>
            prisma.notificacion.create({
              data: {
                titulo: `Nueva reunión: ${data.titulo}`,
                mensaje: `Se ha agendado una reunión para el ${new Date(data.fecha).toLocaleDateString('es-MX')} a las ${data.hora}. ${data.descripcion || ''}`,
                tipo: 'reunion',
                icono: '📅',
                usuarioId: padreId,
              },
            })
          )
        );
      }
    }

    return reunion;
  },

  /**
   * Obtener reuniones por creador (maestro)
   */
  async obtenerReunionesPorMaestro(maestroId: string) {
    const reuniones = await prisma.reunion.findMany({
      where: { 
        creadoPor: {
          id: maestroId
        }
      },
      include: {
        clase: {
          select: {
            id: true,
            nombre: true,
            materia: true,
            grado: true,
          },
        },
        creadoPor: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
          },
        },
      },
      orderBy: {
        fecha: 'asc',
      },
    });

    return reuniones;
  },

  /**
   * Obtener todas las reuniones (admin) o por clase
   */
  async obtenerReuniones(filtros?: {
    claseId?: string;
    tipo?: string;
    fechaDesde?: Date;
    fechaHasta?: Date;
  }) {
    const where: any = {};

    if (filtros?.claseId) {
      where.claseId = filtros.claseId;
    }

    if (filtros?.tipo) {
      where.tipo = filtros.tipo;
    }

    if (filtros?.fechaDesde || filtros?.fechaHasta) {
      where.fecha = {};
      if (filtros.fechaDesde) {
        where.fecha.gte = filtros.fechaDesde;
      }
      if (filtros.fechaHasta) {
        where.fecha.lte = filtros.fechaHasta;
      }
    }

    const reuniones = await prisma.reunion.findMany({
      where,
      include: {
        clase: {
          select: {
            id: true,
            nombre: true,
            materia: true,
            grado: true,
          },
        },
        creadoPor: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
          },
        },
      },
      orderBy: {
        fecha: 'asc',
      },
    });

    return reuniones;
  },

  /**
   * Obtener reuniones para un padre (reuniones de las clases de sus hijos)
   */
  async obtenerReunionesPorPadre(padreId: string) {
    // Obtener todas las clases donde están inscritos los hijos del padre
    const hijos = await prisma.alumno.findMany({
      where: { padreTutorId: padreId },
      include: {
        inscripciones: {
          include: {
            clase: true,
          },
        },
      },
    });

    const claseIds = [
      ...new Set(
        hijos.flatMap((hijo) => hijo.inscripciones.map((inscripcion) => inscripcion.claseId))
      ),
    ];

    const reuniones = await prisma.reunion.findMany({
      where: {
        claseId: {
          in: claseIds,
        },
        tipo: 'PADRES',
      },
      include: {
        clase: {
          select: {
            id: true,
            nombre: true,
            materia: true,
            grado: true,
          },
        },
        creadoPor: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
          },
        },
      },
      orderBy: {
        fecha: 'asc',
      },
    });

    return reuniones;
  },

  /**
   * Actualizar reunión
   */
  async actualizarReunion(
    reunionId: string,
    data: {
      titulo?: string;
      fecha?: Date;
      hora?: string;
      tipo?: string;
      descripcion?: string;
    },
    userId: string,
    userRole: string
  ) {
    const reunion = await prisma.reunion.findUnique({
      where: { id: reunionId },
    });

    if (!reunion) {
      throw new AppError('Reunión no encontrada', 404);
    }

    // Solo el creador o admin pueden actualizar
    if (userRole !== 'ADMINISTRADOR' && reunion.creadoPorId !== userId) {
      throw new AppError('No tienes permisos para actualizar esta reunión', 403);
    }

    const reunionActualizada = await prisma.reunion.update({
      where: { id: reunionId },
      data,
      include: {
        clase: {
          select: {
            id: true,
            nombre: true,
            materia: true,
            grado: true,
          },
        },
        creadoPor: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
          },
        },
      },
    });

    return reunionActualizada;
  },

  /**
   * Eliminar reunión
   */
  async eliminarReunion(reunionId: string, userId: string, userRole: string) {
    const reunion = await prisma.reunion.findUnique({
      where: { id: reunionId },
    });

    if (!reunion) {
      throw new AppError('Reunión no encontrada', 404);
    }

    // Solo el creador o admin pueden eliminar
    if (userRole !== 'ADMINISTRADOR' && reunion.creadoPorId !== userId) {
      throw new AppError('No tienes permisos para eliminar esta reunión', 403);
    }

    await prisma.reunion.delete({
      where: { id: reunionId },
    });

    return { message: 'Reunión eliminada exitosamente' };
  },
};






