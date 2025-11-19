import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { registerSchema, loginSchema } from '../utils/validators.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = registerSchema.parse(req.body);

      const user = await authService.register(
        validatedData.email,
        validatedData.password,
        validatedData.nombre,
        validatedData.role,
        validatedData.apellidos,
        validatedData.telefono
      );

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user,
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = loginSchema.parse(req.body);

      const result = await authService.login(validatedData.email, validatedData.password);

      res.json({
        message: 'Login exitoso',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.getProfile(req.user!.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },
};


