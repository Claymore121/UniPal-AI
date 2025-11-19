import { Response, NextFunction } from 'express';
import { profesoresService } from '../services/profesores.service.js';
import { createAsistenciaSchema, createCalificacionSchema, createComunicadoSchema } from '../utils/validators.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const profesoresController = {
  async getClases(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const clases = await profesoresService.getClasesByProfesor(req.user!.id);
      res.json(clases);
    } catch (error) {
      next(error);
    }
  },

  async getAlumnosByClase(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { claseId } = req.params;
      const alumnos = await profesoresService.getAlumnosByClase(claseId, req.user!.id);
      res.json(alumnos);
    } catch (error) {
      next(error);
    }
  },

  async createAsistencia(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = createAsistenciaSchema.parse(req.body);

      const asistencia = await profesoresService.createAsistencia({
        fecha: new Date(validatedData.fecha),
        estado: validatedData.estado,
        alumnoId: validatedData.alumnoId,
        claseId: validatedData.claseId,
        profesorId: req.user!.id,
      });

      res.status(201).json({
        message: 'Asistencia registrada exitosamente',
        asistencia,
      });
    } catch (error) {
      next(error);
    }
  },

  async createCalificacion(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = createCalificacionSchema.parse(req.body);

      const calificacion = await profesoresService.createCalificacion({
        valor: validatedData.valor,
        materia: validatedData.materia,
        notas: validatedData.notas,
        alumnoId: validatedData.alumnoId,
        claseId: validatedData.claseId,
        profesorId: req.user!.id,
      });

      res.status(201).json({
        message: 'Calificación registrada exitosamente',
        calificacion,
      });
    } catch (error) {
      next(error);
    }
  },

  async createComunicado(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = createComunicadoSchema.parse(req.body);

      const notificaciones = await profesoresService.createComunicado({
        titulo: validatedData.titulo,
        mensaje: validatedData.mensaje,
        claseId: validatedData.claseId,
        todosLosSalones: validatedData.todosLosSalones,
        profesorId: req.user!.id,
      });

      res.status(201).json({
        message: 'Comunicado enviado exitosamente',
        notificacionesEnviadas: notificaciones.length,
      });
    } catch (error) {
      next(error);
    }
  },
};


