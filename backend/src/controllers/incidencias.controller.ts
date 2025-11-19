import { Request, Response, NextFunction } from 'express';
import { incidenciasService } from '../services/incidencias.service.js';
import { createIncidenciaSchema } from '../utils/validators.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const incidenciasController = {
  /**
   * Crear nueva incidencia (solo maestros)
   */
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = createIncidenciaSchema.parse(req.body);
      const incidencia = await incidenciasService.crearIncidencia(
        validatedData,
        req.user!.id
      );
      res.status(201).json({
        message: 'Incidencia creada exitosamente',
        incidencia,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtener mis incidencias (maestros) o todas (admin)
   */
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userRole = req.user!.role;

      if (userRole === 'ADMINISTRADOR') {
        const filtros = {
          estado: req.query.estado as string | undefined,
          tipo: req.query.tipo as string | undefined,
          severidad: req.query.severidad as string | undefined,
        };
        const incidencias = await incidenciasService.obtenerTodasLasIncidencias(filtros);
        return res.json(incidencias);
      }

      // Maestros ven solo sus incidencias
      const incidencias = await incidenciasService.obtenerIncidenciasPorMaestro(req.user!.id);
      res.json(incidencias);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtener incidencia por ID
   */
  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const incidencia = await incidenciasService.obtenerIncidenciaPorId(
        id,
        req.user!.id,
        req.user!.role
      );
      res.json(incidencia);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Actualizar incidencia
   */
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = createIncidenciaSchema.partial().parse(req.body);
      const incidencia = await incidenciasService.actualizarIncidencia(
        id,
        validatedData,
        req.user!.id,
        req.user!.role
      );
      res.json({
        message: 'Incidencia actualizada exitosamente',
        incidencia,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Cambiar estado de incidencia (solo admin)
   */
  async cambiarEstado(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      if (!estado) {
        return res.status(400).json({ error: 'El estado es requerido' });
      }

      const incidencia = await incidenciasService.cambiarEstado(
        id,
        estado,
        req.user!.id
      );
      res.json({
        message: 'Estado de incidencia actualizado exitosamente',
        incidencia,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Eliminar incidencia
   */
  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await incidenciasService.eliminarIncidencia(
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

