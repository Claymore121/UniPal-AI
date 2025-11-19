import { Request, Response, NextFunction } from 'express';
import { plantillasService } from '../services/plantillas.service.js';
import { createPlantillaSchema } from '../utils/validators.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const plantillasController = {
  /**
   * Crear nueva plantilla
   */
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = createPlantillaSchema.parse(req.body);
      const plantilla = await plantillasService.crearPlantilla(
        validatedData,
        req.user!.id
      );
      res.status(201).json({
        message: 'Plantilla creada exitosamente',
        plantilla,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtener plantillas activas (o todas si es admin)
   */
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userRole = req.user!.role;

      if (userRole === 'ADMINISTRADOR') {
        const plantillas = await plantillasService.obtenerTodasLasPlantillas();
        return res.json(plantillas);
      }

      // Otros usuarios ven solo plantillas activas
      const filtros = {
        tipo: req.query.tipo as string | undefined,
        canal: req.query.canal as string | undefined,
      };
      const plantillas = await plantillasService.obtenerPlantillasActivas(filtros);
      res.json(plantillas);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtener plantilla por ID
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const plantilla = await plantillasService.obtenerPlantillaPorId(id);
      res.json(plantilla);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Actualizar plantilla
   */
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = createPlantillaSchema.partial().parse(req.body);
      const plantilla = await plantillasService.actualizarPlantilla(
        id,
        validatedData,
        req.user!.id,
        req.user!.role
      );
      res.json({
        message: 'Plantilla actualizada exitosamente',
        plantilla,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Eliminar plantilla (soft delete)
   */
  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await plantillasService.eliminarPlantilla(
        id,
        req.user!.id,
        req.user!.role
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Procesar plantilla con variables
   */
  async procesar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { variables } = req.body;

      if (!variables || typeof variables !== 'object') {
        return res.status(400).json({ error: 'Las variables son requeridas' });
      }

      const resultado = await plantillasService.procesarPlantilla(id, variables);
      res.json(resultado);
    } catch (error) {
      next(error);
    }
  },
};

