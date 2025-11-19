import prisma from '../config/database.js';
import { AppError } from '../middleware/error.middleware.js';

export const incidenciasService = {
  /**
   * Crear una nueva incidencia (solo maestros)
   */
  async crearIncidencia(
    data: {
      titulo: string;
      descripcion: string;
      tipo: string;
      severidad: string;
      alumnoId: string;
      claseId?: string;
    },
    maestroId: string
  ) {
    // Verificar que el usuario es maestro
    const maestro = await prisma.usuario.findUnique({
      where: { id: maestroId },
    });

    if (!maestro || maestro.role !== 'MAESTRO') {
      throw new AppError('Solo los maestros pueden crear incidencias', 403);
    }

    // Verificar que el alumno existe
    const alumno = await prisma.alumno.findUnique({
      where: { id: data.alumnoId },
    });

    if (!alumno) {
      throw new AppError('Alumno no encontrado', 404);
    }

    // Verificar que la clase existe si se proporciona
    if (data.claseId) {
      const clase = await prisma.clase.findUnique({
        where: { id: data.claseId },
      });

      if (!clase) {
        throw new AppError('Clase no encontrada', 404);
      }

      // Verificar que el maestro es el profesor de la clase
      if (clase.profesorId !== maestroId) {
        throw new AppError('No eres el profesor de esta clase', 403);
      }
    }

    const incidencia = await prisma.incidencia.create({
      data: {
        titulo: data.titulo,
        descripcion: data.descripcion,
        tipo: data.tipo,
        severidad: data.severidad,
        alumnoId: data.alumnoId,
        claseId: data.claseId,
        maestroId: maestroId,
        estado: 'PENDIENTE',
      },
      include: {
        alumno: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
            grado: true,
          },
        },
        clase: {
          select: {
            id: true,
            nombre: true,
            materia: true,
          },
        },
        maestro: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
            modoAnonimo: true,
          },
        },
      },
    });

    return incidencia;
  },

  /**
   * Obtener incidencias por maestro
   */
  async obtenerIncidenciasPorMaestro(maestroId: string) {
    const incidencias = await prisma.incidencia.findMany({
      where: { maestroId },
      include: {
        alumno: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
            grado: true,
          },
        },
        clase: {
          select: {
            id: true,
            nombre: true,
            materia: true,
          },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    });

    return incidencias;
  },

  /**
   * Obtener todas las incidencias (solo administradores)
   */
  async obtenerTodasLasIncidencias(filtros?: {
    estado?: string;
    tipo?: string;
    severidad?: string;
  }) {
    const where: any = {};

    if (filtros?.estado) {
      where.estado = filtros.estado;
    }

    if (filtros?.tipo) {
      where.tipo = filtros.tipo;
    }

    if (filtros?.severidad) {
      where.severidad = filtros.severidad;
    }

    const incidencias = await prisma.incidencia.findMany({
      where,
      include: {
        alumno: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
            grado: true,
            padreTutor: {
              select: {
                id: true,
                nombre: true,
                apellidos: true,
                email: true,
                telefono: true,
              },
            },
          },
        },
        clase: {
          select: {
            id: true,
            nombre: true,
            materia: true,
          },
        },
        maestro: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
            modoAnonimo: true,
          },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    });

    return incidencias;
  },

  /**
   * Obtener incidencia por ID
   */
  async obtenerIncidenciaPorId(incidenciaId: string, userId: string, userRole: string) {
    const incidencia = await prisma.incidencia.findUnique({
      where: { id: incidenciaId },
      include: {
        alumno: {
          include: {
            padreTutor: {
              select: {
                id: true,
                nombre: true,
                apellidos: true,
                email: true,
                telefono: true,
              },
            },
          },
        },
        clase: true,
        maestro: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
            modoAnonimo: true,
          },
        },
      },
    });

    if (!incidencia) {
      throw new AppError('Incidencia no encontrada', 404);
    }

    // Verificar permisos: solo el maestro creador o admin pueden ver
    if (userRole !== 'ADMINISTRADOR' && incidencia.maestroId !== userId) {
      throw new AppError('No tienes permisos para ver esta incidencia', 403);
    }

    return incidencia;
  },

  /**
   * Actualizar incidencia
   */
  async actualizarIncidencia(
    incidenciaId: string,
    data: {
      titulo?: string;
      descripcion?: string;
      tipo?: string;
      severidad?: string;
    },
    userId: string,
    userRole: string
  ) {
    const incidencia = await prisma.incidencia.findUnique({
      where: { id: incidenciaId },
    });

    if (!incidencia) {
      throw new AppError('Incidencia no encontrada', 404);
    }

    // Solo el maestro creador o admin pueden actualizar
    if (userRole !== 'ADMINISTRADOR' && incidencia.maestroId !== userId) {
      throw new AppError('No tienes permisos para actualizar esta incidencia', 403);
    }

    // Solo se pueden actualizar si está en estado PENDIENTE o EN_REVISION
    if (incidencia.estado === 'RESUELTA' || incidencia.estado === 'CERRADA') {
      throw new AppError('No se puede actualizar una incidencia resuelta o cerrada', 400);
    }

    const incidenciaActualizada = await prisma.incidencia.update({
      where: { id: incidenciaId },
      data,
      include: {
        alumno: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
            grado: true,
          },
        },
        clase: {
          select: {
            id: true,
            nombre: true,
            materia: true,
          },
        },
        maestro: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
            modoAnonimo: true,
          },
        },
      },
    });

    return incidenciaActualizada;
  },

  /**
   * Cambiar estado de incidencia (solo administradores)
   */
  async cambiarEstado(
    incidenciaId: string,
    nuevoEstado: string,
    adminId: string
  ) {
    const estadosValidos = ['PENDIENTE', 'EN_REVISION', 'RESUELTA', 'CERRADA'];

    if (!estadosValidos.includes(nuevoEstado)) {
      throw new AppError('Estado inválido', 400);
    }

    const incidencia = await prisma.incidencia.findUnique({
      where: { id: incidenciaId },
    });

    if (!incidencia) {
      throw new AppError('Incidencia no encontrada', 404);
    }

    const incidenciaActualizada = await prisma.incidencia.update({
      where: { id: incidenciaId },
      data: { estado: nuevoEstado },
      include: {
        alumno: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
            grado: true,
          },
        },
        clase: {
          select: {
            id: true,
            nombre: true,
            materia: true,
          },
        },
        maestro: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
            modoAnonimo: true,
          },
        },
      },
    });

    return incidenciaActualizada;
  },

  /**
   * Eliminar incidencia (solo el maestro creador o admin)
   */
  async eliminarIncidencia(incidenciaId: string, userId: string, userRole: string) {
    const incidencia = await prisma.incidencia.findUnique({
      where: { id: incidenciaId },
    });

    if (!incidencia) {
      throw new AppError('Incidencia no encontrada', 404);
    }

    // Solo el maestro creador o admin pueden eliminar
    if (userRole !== 'ADMINISTRADOR' && incidencia.maestroId !== userId) {
      throw new AppError('No tienes permisos para eliminar esta incidencia', 403);
    }

    await prisma.incidencia.delete({
      where: { id: incidenciaId },
    });

    return { message: 'Incidencia eliminada exitosamente' };
  },
};






