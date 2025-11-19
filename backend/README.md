# Backend UniPal-AI

API REST para la aplicación UniPal-AI construida con Node.js, Express, PostgreSQL y Prisma.

## 🚀 Inicio Rápido

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crea un archivo `.env` en la raíz de `backend/`:
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/unipal_db?schema=public"
JWT_SECRET="tu-secret-super-seguro"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

### 3. Configurar base de datos
```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init
```

### 4. Iniciar servidor
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3001`

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/          # Configuración (DB, env)
│   ├── controllers/      # Controladores de rutas
│   ├── middleware/       # Middleware (auth, errors)
│   ├── routes/          # Definición de rutas
│   ├── services/        # Lógica de negocio
│   ├── utils/           # Utilidades (validators)
│   └── app.ts           # Aplicación principal
├── prisma/
│   └── schema.prisma    # Esquema de base de datos
└── package.json
```

## 🔌 Endpoints Disponibles

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil (requiere auth)

### Alumnos (Padres/Tutores)
- `GET /api/alumnos` - Obtener hijos del usuario
- `GET /api/alumnos/:id` - Obtener detalle de hijo
- `POST /api/alumnos` - Crear nuevo hijo
- `GET /api/alumnos/:id/asistencias` - Asistencias de un hijo
- `GET /api/alumnos/:id/calificaciones` - Calificaciones de un hijo

### Profesores
- `GET /api/profesores/clases` - Obtener clases del profesor
- `GET /api/profesores/clases/:claseId/alumnos` - Alumnos de una clase
- `POST /api/profesores/asistencias` - Registrar asistencia
- `POST /api/profesores/calificaciones` - Registrar calificación
- `POST /api/profesores/comunicados` - Enviar comunicado

### Notificaciones
- `GET /api/notificaciones` - Obtener notificaciones
- `PATCH /api/notificaciones/:id/leida` - Marcar como leída
- `PATCH /api/notificaciones/:id/no-leida` - Marcar como no leída
- `DELETE /api/notificaciones/:id` - Eliminar notificación

## 🔐 Autenticación

Todas las rutas (excepto `/api/auth/register` y `/api/auth/login`) requieren un token JWT en el header:

```
Authorization: Bearer <token>
```

## 🛠️ Scripts Disponibles

- `npm run dev` - Iniciar servidor en modo desarrollo
- `npm run build` - Compilar TypeScript
- `npm start` - Iniciar servidor en producción
- `npm run prisma:generate` - Generar cliente Prisma
- `npm run prisma:migrate` - Ejecutar migraciones
- `npm run prisma:studio` - Abrir Prisma Studio

## 📚 Tecnologías

- **Node.js** - Runtime
- **Express** - Framework web
- **TypeScript** - Lenguaje
- **PostgreSQL** - Base de datos
- **Prisma** - ORM
- **JWT** - Autenticación
- **Zod** - Validación

## 🐛 Solución de Problemas

Ver [SETUP_BACKEND.md](../SETUP_BACKEND.md) para guía detallada de configuración y solución de problemas.







