import prisma from '../config/database.js';
import { AppError } from '../middleware/error.middleware.js';

export const notificacionesService = {
  async getNotificacionesByUsuario(usuarioId: string) {
    const notificaciones = await prisma.notificacion.findMany({
      where: { usuarioId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return notificaciones;
  },

  async marcarComoLeida(notificacionId: string, usuarioId: string) {
    const notificacion = await prisma.notificacion.findFirst({
      where: {
        id: notificacionId,
        usuarioId,
      },
    });

    if (!notificacion) {
      throw new AppError('Notificación no encontrada', 404);
    }

    const updated = await prisma.notificacion.update({
      where: { id: notificacionId },
      data: { leida: true },
    });

    return updated;
  },

  async marcarComoNoLeida(notificacionId: string, usuarioId: string) {
    const notificacion = await prisma.notificacion.findFirst({
      where: {
        id: notificacionId,
        usuarioId,
      },
    });

    if (!notificacion) {
      throw new AppError('Notificación no encontrada', 404);
    }

    const updated = await prisma.notificacion.update({
      where: { id: notificacionId },
      data: { leida: false },
    });

    return updated;
  },

  async eliminarNotificacion(notificacionId: string, usuarioId: string) {
    const notificacion = await prisma.notificacion.findFirst({
      where: {
        id: notificacionId,
        usuarioId,
      },
    });

    if (!notificacion) {
      throw new AppError('Notificación no encontrada', 404);
    }

    await prisma.notificacion.delete({
      where: { id: notificacionId },
    });

    return { message: 'Notificación eliminada' };
  },
};







