import { Response } from 'express';
import { alumnosService } from '../services/alumnos.service.js';
import { createAlumnoSchema } from '../utils/validators.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const alumnosController = {
  async getHijos(req: AuthRequest, res: Response) {
    const hijos = await alumnosService.getHijosByPadre(req.user!.id);
    res.json(hijos);
  },

  async getAlumnoById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const alumno = await alumnosService.getAlumnoById(id, req.user!.id);
    res.json(alumno);
  },

  async createAlumno(req: AuthRequest, res: Response) {
    const validatedData = createAlumnoSchema.parse(req.body);

    const alumno = await alumnosService.createAlumno({
      ...validatedData,
      padreTutorId: req.user!.id,
    });

    res.status(201).json({
      message: 'Alumno creado exitosamente',
      alumno,
    });
  },

  async getAsistencias(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const asistencias = await alumnosService.getAsistenciasByAlumno(id, req.user!.id);
    res.json(asistencias);
  },

  async getCalificaciones(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const calificaciones = await alumnosService.getCalificacionesByAlumno(id, req.user!.id);
    res.json(calificaciones);
  },
};







