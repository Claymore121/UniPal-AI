import express from 'express';
import { plantillasController } from '../controllers/plantillas.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Crear plantilla (maestros y admin)
router.post(
  '/',
  requireRole('MAESTRO', 'ADMINISTRADOR'),
  plantillasController.create
);

// Obtener plantillas (activas para todos, todas para admin)
router.get(
  '/',
  plantillasController.getAll
);

// Obtener plantilla por ID
router.get(
  '/:id',
  plantillasController.getById
);

// Procesar plantilla con variables (para preview)
router.post(
  '/:id/preview',
  plantillasController.procesar
);

// Actualizar plantilla (creador o admin)
router.put(
  '/:id',
  requireRole('MAESTRO', 'ADMINISTRADOR'),
  plantillasController.update
);

// Eliminar plantilla (soft delete)
router.delete(
  '/:id',
  requireRole('MAESTRO', 'ADMINISTRADOR'),
  plantillasController.delete
);

export default router;






