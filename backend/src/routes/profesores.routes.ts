import express from 'express';
import { profesoresController } from '../controllers/profesores.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Solo maestros pueden acceder
router.use(requireRole('MAESTRO'));

router.get('/clases', profesoresController.getClases);
router.get('/clases/:claseId/alumnos', profesoresController.getAlumnosByClase);
router.post('/asistencias', profesoresController.createAsistencia);
router.post('/calificaciones', profesoresController.createCalificacion);
router.post('/comunicados', profesoresController.createComunicado);

export default router;


