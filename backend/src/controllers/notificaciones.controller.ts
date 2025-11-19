import { Response } from 'express';
import { notificacionesService } from '../services/notificaciones.service.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const notificacionesController = {
  async getNotificaciones(req: AuthRequest, res: Response) {
    const notificaciones = await notificacionesService.getNotificacionesByUsuario(req.user!.id);
    res.json(notificaciones);
  },

  async marcarComoLeida(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const notificacion = await notificacionesService.marcarComoLeida(id, req.user!.id);
    res.json(notificacion);
  },

  async marcarComoNoLeida(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const notificacion = await notificacionesService.marcarComoNoLeida(id, req.user!.id);
    res.json(notificacion);
  },

  async eliminarNotificacion(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const result = await notificacionesService.eliminarNotificacion(id, req.user!.id);
    res.json(result);
  },
};







