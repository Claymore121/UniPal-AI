import express from 'express';
import { reunionesController } from '../controllers/reuniones.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Crear reunión (maestros y admin)
router.post(
  '/',
  requireRole('MAESTRO', 'ADMINISTRADOR'),
  reunionesController.create
);

// Obtener reuniones (todos los roles autenticados)
router.get(
  '/',
  reunionesController.getAll
);

// Obtener reunión por ID
router.get(
  '/:id',
  reunionesController.getById
);

// Actualizar reunión (creador o admin)
router.put(
  '/:id',
  requireRole('MAESTRO', 'ADMINISTRADOR'),
  reunionesController.update
);

// Eliminar reunión (creador o admin)
router.delete(
  '/:id',
  requireRole('MAESTRO', 'ADMINISTRADOR'),
  reunionesController.delete
);

export default router;






