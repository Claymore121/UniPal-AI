import express from 'express';
import { notificacionesController } from '../controllers/notificaciones.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/', notificacionesController.getNotificaciones);
router.patch('/:id/leida', notificacionesController.marcarComoLeida);
router.patch('/:id/no-leida', notificacionesController.marcarComoNoLeida);
router.delete('/:id', notificacionesController.eliminarNotificacion);

export default router;







