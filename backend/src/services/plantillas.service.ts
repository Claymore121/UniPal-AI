import prisma from '../config/database.js';
import { AppError } from '../middleware/error.middleware.js';

export const plantillasService = {
  /**
   * Crear una nueva plantilla
   */
  async crearPlantilla(
    data: {
      nombre: string;
      asunto: string;
      contenido: string;
      tipo: string;
      canal: string;
    },
    creadoPorId: string
  ) {
    // Verificar que el usuario tiene permisos (MAESTRO o ADMINISTRADOR)
    const usuario = await prisma.usuario.findUnique({
      where: { id: creadoPorId },
    });

    if (!usuario || (usuario.role !== 'MAESTRO' && usuario.role !== 'ADMINISTRADOR')) {
      throw new AppError('Solo maestros y administradores pueden crear plantillas', 403);
    }

    const plantilla = await prisma.plantilla.create({
      data: {
        nombre: data.nombre,
        asunto: data.asunto,
        contenido: data.contenido,
        tipo: data.tipo,
        canal: data.canal,
        activa: true,
        creadoPorId: creadoPorId,
      },
      include: {
        creadoPor: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
          },
        },
      },
    });

    return plantilla;
  },

  /**
   * Obtener todas las plantillas activas
   */
  async obtenerPlantillasActivas(filtros?: {
    tipo?: string;
    canal?: string;
  }) {
    const where: any = {
      activa: true,
    };

    if (filtros?.tipo) {
      where.tipo = filtros.tipo;
    }

    if (filtros?.canal) {
      where.canal = filtros.canal;
    }

    const plantillas = await prisma.plantilla.findMany({
      where,
      include: {
        creadoPor: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return plantillas;
  },

  /**
   * Obtener todas las plantillas (incluyendo inactivas, solo para admin)
   */
  async obtenerTodasLasPlantillas() {
    const plantillas = await prisma.plantilla.findMany({
      include: {
        creadoPor: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return plantillas;
  },

  /**
   * Obtener plantilla por ID
   */
  async obtenerPlantillaPorId(plantillaId: string) {
    const plantilla = await prisma.plantilla.findUnique({
      where: { id: plantillaId },
      include: {
        creadoPor: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
          },
        },
      },
    });

    if (!plantilla) {
      throw new AppError('Plantilla no encontrada', 404);
    }

    return plantilla;
  },

  /**
   * Actualizar plantilla
   */
  async actualizarPlantilla(
    plantillaId: string,
    data: {
      nombre?: string;
      asunto?: string;
      contenido?: string;
      tipo?: string;
      canal?: string;
      activa?: boolean;
    },
    userId: string,
    userRole: string
  ) {
    const plantilla = await prisma.plantilla.findUnique({
      where: { id: plantillaId },
    });

    if (!plantilla) {
      throw new AppError('Plantilla no encontrada', 404);
    }

    // Solo el creador o admin pueden actualizar
    if (userRole !== 'ADMINISTRADOR' && plantilla.creadoPorId !== userId) {
      throw new AppError('No tienes permisos para actualizar esta plantilla', 403);
    }

    const plantillaActualizada = await prisma.plantilla.update({
      where: { id: plantillaId },
      data,
      include: {
        creadoPor: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
          },
        },
      },
    });

    return plantillaActualizada;
  },

  /**
   * Eliminar plantilla (soft delete: activa = false)
   */
  async eliminarPlantilla(plantillaId: string, userId: string, userRole: string) {
    const plantilla = await prisma.plantilla.findUnique({
      where: { id: plantillaId },
    });

    if (!plantilla) {
      throw new AppError('Plantilla no encontrada', 404);
    }

    // Solo el creador o admin pueden eliminar
    if (userRole !== 'ADMINISTRADOR' && plantilla.creadoPorId !== userId) {
      throw new AppError('No tienes permisos para eliminar esta plantilla', 403);
    }

    // Soft delete
    const plantillaEliminada = await prisma.plantilla.update({
      where: { id: plantillaId },
      data: { activa: false },
    });

    return { message: 'Plantilla eliminada exitosamente' };
  },

  /**
   * Procesar plantilla: reemplazar variables en el contenido
   * Variables soportadas: {{nombre}}, {{apellidos}}, {{grado}}, etc.
   */
  async procesarPlantilla(plantillaId: string, variables: Record<string, string>) {
    const plantilla = await this.obtenerPlantillaPorId(plantillaId);

    let contenidoProcesado = plantilla.contenido;
    let asuntoProcesado = plantilla.asunto;

    // Reemplazar variables en el contenido
    Object.keys(variables).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      contenidoProcesado = contenidoProcesado.replace(regex, variables[key]);
      asuntoProcesado = asuntoProcesado.replace(regex, variables[key]);
    });

    return {
      asunto: asuntoProcesado,
      contenido: contenidoProcesado,
      canal: plantilla.canal,
    };
  },
};






