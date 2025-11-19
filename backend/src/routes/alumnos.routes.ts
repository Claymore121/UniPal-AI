import express from 'express';
import { alumnosController } from '../controllers/alumnos.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Solo padres/tutores pueden acceder
router.use(requireRole('PADRE_TUTOR'));

router.get('/', alumnosController.getHijos);
router.get('/:id', alumnosController.getAlumnoById);
router.post('/', alumnosController.createAlumno);
router.get('/:id/asistencias', alumnosController.getAsistencias);
router.get('/:id/calificaciones', alumnosController.getCalificaciones);

export default router;







