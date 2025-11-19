import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import { env } from '../config/env.js';
import { AppError } from '../middleware/error.middleware.js';

export const authService = {
  async register(
    email: string,
    password: string,
    nombre: string,
    role: 'PADRE_TUTOR' | 'MAESTRO' | 'ADMINISTRADOR',
    apellidos?: string,
    telefono?: string
  ) {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('El email ya está registrado', 400);
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.usuario.create({
      data: {
        email,
        password: hashedPassword,
        nombre,
        apellidos,
        telefono,
        role,
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellidos: true,
        role: true,
        telefono: true,
        createdAt: true,
      },
    });

    return user;
  },

  async login(email: string, password: string) {
    // Buscar usuario
    const user = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Credenciales inválidas', 401);
    }

    // Verificar contraseña
    // Nota: bcrypt.compare compara la contraseña en texto plano con el hash almacenado
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      // Log para depuración (solo en desarrollo)
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚠️ Intento de login fallido para: ${email}`);
        console.log(`   Contraseña recibida: "${password}"`);
        console.log(`   Longitud de contraseña: ${password.length}`);
        console.log(`   Hash almacenado: ${user.password.substring(0, 30)}...`);
        
        // Verificar si la contraseña es "1234"
        if (password === '1234') {
          console.log(`   ⚠️ La contraseña es "1234", pero no coincide con el hash almacenado`);
          console.log(`   💡 Ejecuta: npm run update-passwords`);
        }
      }
      throw new AppError('Credenciales inválidas', 401);
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      env.JWT_SECRET,
      {
        expiresIn: env.JWT_EXPIRES_IN,
      }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellidos: user.apellidos,
        role: user.role,
        telefono: user.telefono,
      },
    };
  },

  async getProfile(userId: string) {
    const user = await prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellidos: true,
        role: true,
        telefono: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    return user;
  },
};

