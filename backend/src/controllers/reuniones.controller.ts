import { Request, Response, NextFunction } from 'express';
import { reunionesService } from '../services/reuniones.service.js';
import { createReunionSchema } from '../utils/validators.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const reunionesController = {
  /**
   * Crear nueva reunión
   */
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = createReunionSchema.parse(req.body);
      const reunion = await reunionesService.crearReunion(
        {
          ...validatedData,
          fecha: new Date(validatedData.fecha),
        },
        req.user!.id
      );
      res.status(201).json({
        message: 'Reunión creada exitosamente',
        reunion,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtener reuniones (maestros ven las suyas, admin todas, padres las de sus hijos)
   */
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userRole = req.user!.role;

      if (userRole === 'ADMINISTRADOR') {
        const filtros = {
          claseId: req.query.claseId as string | undefined,
          tipo: req.query.tipo as string | undefined,
          fechaDesde: req.query.fechaDesde ? new Date(req.query.fechaDesde as string) : undefined,
          fechaHasta: req.query.fechaHasta ? new Date(req.query.fechaHasta as string) : undefined,
        };
        const reuniones = await reunionesService.obtenerReuniones(filtros);
        return res.json(reuniones);
      }

      if (userRole === 'PADRE_TUTOR') {
        const reuniones = await reunionesService.obtenerReunionesPorPadre(req.user!.id);
        return res.json(reuniones);
      }

      // Maestros ven solo sus reuniones
      const reuniones = await reunionesService.obtenerReunionesPorMaestro(req.user!.id);
      res.json(reuniones);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtener reunión por ID
   */
  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      // Por ahora, obtener todas y filtrar por ID
      // En el futuro se puede crear un método específico
      const reuniones = await reunionesService.obtenerReuniones();
      const reunion = reuniones.find((r) => r.id === id);

      if (!reunion) {
        return res.status(404).json({ error: 'Reunión no encontrada' });
      }

      res.json(reunion);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Actualizar reunión
   */
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = createReunionSchema.partial().parse(req.body);
      const reunion = await reunionesService.actualizarReunion(
        id,
        {
          ...validatedData,
          fecha: validatedData.fecha ? new Date(validatedData.fecha) : undefined,
        },
        req.user!.id,
        req.user!.role
      );
      res.json({
        message: 'Reunión actualizada exitosamente',
        reunion,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Eliminar reunión
   */
  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await reunionesService.eliminarReunion(
        id,
        req.user!.id,
        req.user!.role
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};






