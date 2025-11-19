import express from 'express';
import { incidenciasController } from '../controllers/incidencias.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Crear incidencia (solo maestros)
router.post(
  '/',
  requireRole('MAESTRO'),
  incidenciasController.create
);

// Obtener incidencias (maestros ven las suyas, admin todas)
router.get(
  '/',
  requireRole('MAESTRO', 'ADMINISTRADOR'),
  incidenciasController.getAll
);

// Obtener incidencia por ID
router.get(
  '/:id',
  requireRole('MAESTRO', 'ADMINISTRADOR'),
  incidenciasController.getById
);

// Actualizar incidencia (maestro propietario o admin)
router.put(
  '/:id',
  requireRole('MAESTRO', 'ADMINISTRADOR'),
  incidenciasController.update
);

// Cambiar estado (solo admin)
router.patch(
  '/:id/estado',
  requireRole('ADMINISTRADOR'),
  incidenciasController.cambiarEstado
);

// Eliminar incidencia (maestro propietario o admin)
router.delete(
  '/:id',
  requireRole('MAESTRO', 'ADMINISTRADOR'),
  incidenciasController.delete
);

export default router;






