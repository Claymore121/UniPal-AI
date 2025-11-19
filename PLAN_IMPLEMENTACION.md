# 📋 Plan de Implementación - UniPal-AI
## Adaptación de Requisitos Funcionales a Stack Node.js/Express/Prisma

> **⚠️ IMPORTANTE**: Este plan adapta los requisitos funcionales del documento original (que especificaba Spring Boot/Java) a tu stack actual de **Node.js + Express + Prisma + React**.

---

## 🎯 Resumen Ejecutivo

Este documento proporciona un plan completo para implementar las nuevas funcionalidades requeridas manteniendo tu código base existente. Se enfoca en:

- ✅ **Mantener** tu arquitectura actual (Node.js/Express/Prisma)
- ✅ **Extender** los modelos existentes en lugar de reemplazarlos
- ✅ **Reutilizar** componentes y estilos de React/Tailwind existentes
- ✅ **Integrar** nuevas funcionalidades de forma incremental

---

## 1️⃣ Cambios en la Base de Datos (Prisma Schema)

### ✅ Cambios Ya Implementados

#### 1.1 Modelo `Usuario` - Actualizado
```prisma
model Usuario {
  // ... campos existentes ...
  imgProfile    String?  @db.VarChar(500) // ✅ AGREGADO: Imagen de perfil
  role          String   @default("PADRE_TUTOR") @db.VarChar(20) 
  // Valores: PADRE_TUTOR, MAESTRO, ADMINISTRADOR
  activo        Boolean  @default(true) // ✅ AGREGADO: Control de usuarios activos
  modoAnonimo   Boolean  @default(false) // ✅ AGREGADO: Para maestros en modo anónimo
  
  // Nuevas relaciones
  incidencias   Incidencia[]
  historialNotificaciones HistorialNotificacion[]
  plantillasCreadas Plantilla[]
}
```

#### 1.2 Nuevo Modelo: `Incidencia`
```prisma
model Incidencia {
  id          String   @id @default(uuid())
  titulo      String   @db.VarChar(200)
  descripcion String   @db.NVarChar(Max)
  tipo        String   @db.VarChar(50) // CONDUCTA, ACADEMICA, DISCIPLINARIA, OTRA
  severidad   String   @db.VarChar(20) // BAJA, MEDIA, ALTA, CRITICA
  estado      String   @default("PENDIENTE") @db.VarChar(20)
  // PENDIENTE, EN_REVISION, RESUELTA, CERRADA
  alumnoId    String
  alumno      Alumno   @relation(...)
  maestroId   String
  maestro     Usuario  @relation(...)
  claseId     String?
  clase       Clase?   @relation(...)
  fecha       DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### 1.3 Nuevo Modelo: `Plantilla`
```prisma
model Plantilla {
  id          String   @id @default(uuid())
  nombre      String   @db.VarChar(200)
  asunto      String   @db.VarChar(300)
  contenido   String   @db.NVarChar(Max)
  tipo        String   @db.VarChar(50) // ASISTENCIA, CALIFICACION, INCIDENCIA, GENERAL
  canal       String   @db.VarChar(20) // WHATSAPP, EMAIL, AMBOS
  activa      Boolean  @default(true)
  creadoPorId String?
  creadoPor   Usuario? @relation(...)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### 1.4 Nuevo Modelo: `HistorialNotificacion`
```prisma
model HistorialNotificacion {
  id          String   @id @default(uuid())
  plantillaId String?
  plantilla   Plantilla? @relation(...)
  destinatarioId String
  destinatario Usuario @relation(...)
  asunto      String   @db.VarChar(300)
  mensaje     String   @db.NVarChar(Max)
  canal       String   @db.VarChar(20) // WHATSAPP, EMAIL, AMBOS
  estado      String   @db.VarChar(20) // ENVIADA, FALLIDA, PENDIENTE
  error       String?  @db.NVarChar(Max)
  enviadoEn   DateTime @default(now())
  leidoEn     DateTime?
}
```

### 📝 Próximos Pasos para Base de Datos

1. **Ejecutar migración de Prisma:**
   ```bash
   cd backend
   npx prisma migrate dev --name add_new_features
   npx prisma generate
   ```

2. **Actualizar seed.ts** para incluir usuarios de prueba con roles `MAESTRO` y `ADMINISTRADOR`

---

## 2️⃣ Nuevas Rutas de API (Backend - Express)

### 2.1 Rutas de Incidencias (`/api/incidencias`)

**Archivo**: `backend/src/routes/incidencias.routes.ts`

```typescript
// GET /api/incidencias - Listar incidencias (maestros ven las suyas, admin todas)
// GET /api/incidencias/:id - Obtener detalle de incidencia
// POST /api/incidencias - Crear nueva incidencia (solo MAESTRO)
// PUT /api/incidencias/:id - Actualizar incidencia (maestro propietario o admin)
// PATCH /api/incidencias/:id/estado - Cambiar estado (solo ADMINISTRADOR)
// DELETE /api/incidencias/:id - Eliminar incidencia
```

**Middleware requerido:**
- `authenticate` - Todas las rutas
- `requireRole(['MAESTRO', 'ADMINISTRADOR'])` - Para crear/editar
- `requireRole(['ADMINISTRADOR'])` - Para cambiar estado

### 2.2 Rutas de Plantillas (`/api/plantillas`)

**Archivo**: `backend/src/routes/plantillas.routes.ts`

```typescript
// GET /api/plantillas - Listar todas las plantillas activas
// GET /api/plantillas/:id - Obtener detalle de plantilla
// POST /api/plantillas - Crear plantilla (MAESTRO o ADMINISTRADOR)
// PUT /api/plantillas/:id - Actualizar plantilla
// DELETE /api/plantillas/:id - Eliminar plantilla (soft delete: activa = false)
// POST /api/plantillas/:id/preview - Vista previa con datos de ejemplo
```

### 2.3 Rutas de Notificaciones Mejoradas (`/api/notificaciones`)

**Extender**: `backend/src/routes/notificaciones.routes.ts`

```typescript
// Nuevas rutas:
// POST /api/notificaciones/enviar - Enviar notificación usando plantilla
// POST /api/notificaciones/masivo - Envío masivo a múltiples destinatarios
// GET /api/notificaciones/historial - Historial de notificaciones enviadas
// GET /api/notificaciones/historial/:id - Detalle de notificación enviada
// POST /api/notificaciones/historial/:id/marcar-leida - Marcar como leída
```

### 2.4 Rutas de Administración (`/api/admin`)

**Archivo**: `backend/src/routes/admin.routes.ts`

```typescript
// GET /api/admin/usuarios - Listar todos los usuarios (solo ADMINISTRADOR)
// GET /api/admin/usuarios/:id - Detalle de usuario
// POST /api/admin/usuarios - Crear usuario (admin)
// PUT /api/admin/usuarios/:id - Actualizar usuario
// PATCH /api/admin/usuarios/:id/activar - Activar/desactivar usuario
// GET /api/admin/alumnos - Listar todos los alumnos
// GET /api/admin/incidencias - Listar todas las incidencias
// GET /api/admin/estadisticas - Dashboard con estadísticas generales
```

**Middleware requerido:**
- `authenticate` - Todas las rutas
- `requireRole(['ADMINISTRADOR'])` - Todas las rutas

### 2.5 Rutas de Maestros Mejoradas (`/api/maestros`)

**Extender**: `backend/src/routes/profesores.routes.ts` o crear `maestros.routes.ts`

```typescript
// Nuevas rutas:
// GET /api/maestros/perfil - Perfil del maestro actual
// PUT /api/maestros/perfil - Actualizar perfil (incluye modoAnonimo)
// GET /api/maestros/clases/:claseId/alumnos - Alumnos de una clase
// POST /api/maestros/incidencias - Crear incidencia (alias de /api/incidencias)
// GET /api/maestros/incidencias - Mis incidencias
```

---

## 3️⃣ Integraciones de Terceros (Librerías NPM)

### 3.1 WhatsApp Cloud API

**Librería recomendada**: `@whatsapp-cloud/api` o `whatsapp-web.js`

**Instalación:**
```bash
cd backend
npm install @whatsapp-cloud/api
# O alternativamente:
npm install whatsapp-web.js
```

**Configuración en `.env`:**
```env
WHATSAPP_API_TOKEN=tu_token_de_whatsapp_cloud
WHATSAPP_PHONE_NUMBER_ID=tu_phone_number_id
WHATSAPP_VERIFY_TOKEN=tu_verify_token
```

**Servicio**: `backend/src/services/whatsapp.service.ts`
```typescript
import { WhatsAppCloudAPI } from '@whatsapp-cloud/api';

export const whatsappService = {
  async enviarMensaje(telefono: string, mensaje: string) {
    // Implementación usando WhatsApp Cloud API
  },
  
  async enviarPlantilla(telefono: string, plantillaId: string, variables: object) {
    // Enviar mensaje usando plantilla de WhatsApp
  }
};
```

### 3.2 SendGrid (Email)

**Librería recomendada**: `@sendgrid/mail`

**Instalación:**
```bash
npm install @sendgrid/mail
```

**Configuración en `.env`:**
```env
SENDGRID_API_KEY=tu_api_key_de_sendgrid
SENDGRID_FROM_EMAIL=noreply@unipal.edu
```

**Servicio**: `backend/src/services/email.service.ts`
```typescript
import sgMail from '@sendgrid/mail';

export const emailService = {
  async enviarEmail(destinatario: string, asunto: string, contenido: string) {
    // Implementación usando SendGrid
  },
  
  async enviarPlantilla(destinatario: string, plantillaId: string, variables: object) {
    // Enviar email usando plantilla de SendGrid
  }
};
```

### 3.3 Jobs Asíncronos (Cola de Trabajo)

**Librería recomendada**: `bullmq` + `ioredis`

**Instalación:**
```bash
npm install bullmq ioredis
npm install --save-dev @types/ioredis
```

**Configuración en `.env`:**
```env
REDIS_URL=redis://localhost:6379
```

**Estructura:**
```
backend/src/
  ├── queues/
  │   ├── notificaciones.queue.ts
  │   └── workers/
  │       └── notificaciones.worker.ts
```

**Ejemplo de uso:**
```typescript
// backend/src/queues/notificaciones.queue.ts
import { Queue } from 'bullmq';

export const notificacionesQueue = new Queue('notificaciones', {
  connection: { host: 'localhost', port: 6379 }
});

// Agregar trabajo a la cola
await notificacionesQueue.add('enviar-notificacion', {
  destinatarioId: '...',
  plantillaId: '...',
  variables: {...}
});
```

**Alternativa más simple (sin Redis)**: `node-cron` para tareas programadas
```bash
npm install node-cron
```

---

## 4️⃣ Cambios en el Frontend (React)

### 4.1 Nuevos Layouts

#### `AdminLayout.jsx`
**Ubicación**: `src/layouts/AdminLayout.jsx`

```jsx
// Layout específico para administradores
// Incluye sidebar con opciones de administración
// Reutiliza estilos de Tailwind existentes
```

#### `MaestroLayout.jsx`
**Ubicación**: `src/layouts/MaestroLayout.jsx`

```jsx
// Layout para maestros
// Similar al layout de padres pero con opciones de maestro
// Toggle para modo anónimo
```

### 4.2 Nuevas Páginas/Componentes

#### Páginas de Administración
```
src/pages/AdminPages/
  ├── Dashboard.jsx          # Estadísticas generales
  ├── GestionUsuarios.jsx    # CRUD de usuarios
  ├── GestionAlumnos.jsx      # Lista de todos los alumnos
  ├── GestionIncidencias.jsx  # Ver y gestionar todas las incidencias
  └── Configuracion.jsx       # Configuración del sistema
```

#### Páginas de Maestro
```
src/pages/MaestroPages/
  ├── Dashboard.jsx           # Dashboard del maestro
  ├── MisClases.jsx           # Clases asignadas
  ├── RegistrarIncidencia.jsx # Formulario para crear incidencia
  ├── MisIncidencias.jsx      # Lista de incidencias creadas
  ├── EnviarNotificacion.jsx  # Enviar notificación usando plantilla
  └── Perfil.jsx              # Perfil con toggle de modo anónimo
```

#### Componentes Reutilizables
```
src/components/
  ├── IncidenciaCard.jsx      # Tarjeta para mostrar incidencia
  ├── PlantillaSelector.jsx   # Selector de plantillas
  ├── ModoAnonimoToggle.jsx   # Toggle para modo anónimo
  └── EnvioMasivoForm.jsx     # Formulario para envío masivo
```

### 4.3 Actualización de Rutas

**Archivo**: `src/routes/AppRouter.jsx`

```jsx
// Agregar rutas protegidas por rol:
<Route element={<ProtectedRoute requiredRole="ADMINISTRADOR" />}>
  <Route path="/admin/*" element={<AdminLayout />}>
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="usuarios" element={<GestionUsuarios />} />
    {/* ... más rutas de admin ... */}
  </Route>
</Route>

<Route element={<ProtectedRoute requiredRole="MAESTRO" />}>
  <Route path="/maestro/*" element={<MaestroLayout />}>
    <Route path="dashboard" element={<MaestroDashboard />} />
    <Route path="incidencias/nueva" element={<RegistrarIncidencia />} />
    {/* ... más rutas de maestro ... */}
  </Route>
</Route>
```

### 4.4 Componente: `ProtectedRoute`

**Archivo**: `src/components/ProtectedRoute.jsx`

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Necesitarás crear este hook

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />; // O página de acceso denegado
  }
  
  return children;
};
```

### 4.5 Actualización de `api.js`

**Archivo**: `src/services/api.js`

```javascript
// Agregar nuevos métodos:

// Incidencias
async crearIncidencia(data) { ... }
async obtenerIncidencias() { ... }
async actualizarIncidencia(id, data) { ... }

// Plantillas
async obtenerPlantillas() { ... }
async crearPlantilla(data) { ... }
async actualizarPlantilla(id, data) { ... }

// Notificaciones mejoradas
async enviarNotificacion(data) { ... }
async enviarNotificacionMasiva(data) { ... }
async obtenerHistorialNotificaciones() { ... }

// Admin
async obtenerUsuarios() { ... }
async crearUsuario(data) { ... }
async actualizarUsuario(id, data) { ... }
async obtenerEstadisticas() { ... }
```

---

## 5️⃣ Actualización de Validadores (Zod)

**Archivo**: `backend/src/utils/validators.ts`

```typescript
// Actualizar registerSchema para incluir nuevos roles
export const registerSchema = z.object({
  // ... campos existentes ...
  role: z.enum(['PADRE_TUTOR', 'MAESTRO', 'ADMINISTRADOR']).default('PADRE_TUTOR'),
  imgProfile: z.string().url().optional(),
});

// Nuevos schemas
export const createIncidenciaSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido'),
  descripcion: z.string().min(1, 'La descripción es requerida'),
  tipo: z.enum(['CONDUCTA', 'ACADEMICA', 'DISCIPLINARIA', 'OTRA']),
  severidad: z.enum(['BAJA', 'MEDIA', 'ALTA', 'CRITICA']),
  alumnoId: z.string().uuid(),
  claseId: z.string().uuid().optional(),
});

export const createPlantillaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  asunto: z.string().min(1, 'El asunto es requerido'),
  contenido: z.string().min(1, 'El contenido es requerido'),
  tipo: z.enum(['ASISTENCIA', 'CALIFICACION', 'INCIDENCIA', 'GENERAL']),
  canal: z.enum(['WHATSAPP', 'EMAIL', 'AMBOS']),
});

export const enviarNotificacionSchema = z.object({
  plantillaId: z.string().uuid().optional(),
  destinatarioId: z.string().uuid(),
  asunto: z.string().min(1),
  mensaje: z.string().min(1),
  canal: z.enum(['WHATSAPP', 'EMAIL', 'AMBOS']),
  variables: z.record(z.any()).optional(), // Variables para reemplazar en plantilla
});
```

---

## 6️⃣ Middleware de Autorización Mejorado

**Archivo**: `backend/src/middleware/auth.middleware.ts`

```typescript
// Agregar función para verificar múltiples roles
export const requireAnyRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('No autenticado', 401);
    }
    
    if (!roles.includes(req.user.role)) {
      throw new AppError('No autorizado', 403);
    }
    
    next();
  };
};

// Función para verificar si es admin o propietario del recurso
export const requireAdminOrOwner = (getOwnerId: (req: Request) => string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('No autenticado', 401);
    }
    
    if (req.user.role === 'ADMINISTRADOR') {
      return next();
    }
    
    const ownerId = getOwnerId(req);
    if (req.user.id !== ownerId) {
      throw new AppError('No autorizado', 403);
    }
    
    next();
  };
};
```

---

## 7️⃣ Servicios de Negocio

### 7.1 Servicio de Incidencias

**Archivo**: `backend/src/services/incidencias.service.ts`

```typescript
export const incidenciasService = {
  async crearIncidencia(data, maestroId) { ... },
  async obtenerIncidenciasPorMaestro(maestroId) { ... },
  async obtenerTodasLasIncidencias() { ... }, // Solo admin
  async actualizarIncidencia(id, data, userId, userRole) { ... },
  async cambiarEstado(id, nuevoEstado, adminId) { ... },
};
```

### 7.2 Servicio de Plantillas

**Archivo**: `backend/src/services/plantillas.service.ts`

```typescript
export const plantillasService = {
  async crearPlantilla(data, creadoPorId) { ... },
  async obtenerPlantillasActivas() { ... },
  async actualizarPlantilla(id, data) { ... },
  async procesarPlantilla(plantillaId, variables) { ... }, // Reemplazar variables
};
```

### 7.3 Servicio de Notificaciones Mejorado

**Archivo**: `backend/src/services/notificaciones.service.ts` (extender)

```typescript
export const notificacionesService = {
  // ... métodos existentes ...
  
  async enviarNotificacionConPlantilla(plantillaId, destinatarioId, variables) {
    // 1. Obtener plantilla
    // 2. Procesar variables
    // 3. Enviar por canal correspondiente (WhatsApp/Email)
    // 4. Guardar en HistorialNotificacion
  },
  
  async enviarMasivo(plantillaId, destinatarioIds, variables) {
    // Enviar a múltiples destinatarios usando cola de trabajos
  },
  
  async obtenerHistorial(destinatarioId) { ... },
};
```

---

## 8️⃣ Orden de Implementación Recomendado

### Fase 1: Base de Datos y Autenticación (Semana 1)
1. ✅ Actualizar schema de Prisma (YA HECHO)
2. Ejecutar migración de Prisma
3. Actualizar validadores de Zod para nuevos roles
4. Actualizar middleware de autenticación
5. Actualizar seed.ts con usuarios de prueba

### Fase 2: Backend - Incidencias (Semana 2)
1. Crear servicio de incidencias
2. Crear controlador de incidencias
3. Crear rutas de incidencias
4. Probar endpoints con Postman/Thunder Client

### Fase 3: Backend - Plantillas y Notificaciones (Semana 3)
1. Crear servicio de plantillas
2. Extender servicio de notificaciones
3. Crear rutas correspondientes
4. Integrar WhatsApp Cloud API (opcional en esta fase)

### Fase 4: Backend - Administración (Semana 4)
1. Crear rutas de administración
2. Implementar servicio de estadísticas
3. Probar todos los endpoints

### Fase 5: Frontend - Maestros (Semana 5)
1. Crear MaestroLayout
2. Crear páginas de maestro
3. Integrar con API
4. Implementar modo anónimo

### Fase 6: Frontend - Administración (Semana 6)
1. Crear AdminLayout
2. Crear páginas de administración
3. Integrar con API
4. Dashboard con estadísticas

### Fase 7: Integraciones Externas (Semana 7)
1. Configurar SendGrid
2. Configurar WhatsApp Cloud API
3. Implementar cola de trabajos (BullMQ)
4. Probar envíos reales

### Fase 8: Testing y Ajustes (Semana 8)
1. Pruebas end-to-end
2. Corrección de bugs
3. Optimización de rendimiento
4. Documentación final

---

## 9️⃣ Checklist de Implementación

### Backend
- [ ] Migración de Prisma ejecutada
- [ ] Validadores de Zod actualizados
- [ ] Middleware de autorización mejorado
- [ ] Servicio de incidencias implementado
- [ ] Servicio de plantillas implementado
- [ ] Servicio de notificaciones extendido
- [ ] Rutas de incidencias creadas
- [ ] Rutas de plantillas creadas
- [ ] Rutas de administración creadas
- [ ] Integración con WhatsApp (opcional)
- [ ] Integración con SendGrid
- [ ] Cola de trabajos configurada

### Frontend
- [ ] ProtectedRoute component creado
- [ ] AdminLayout creado
- [ ] MaestroLayout creado
- [ ] Páginas de administración creadas
- [ ] Páginas de maestro creadas
- [ ] Componentes reutilizables creados
- [ ] API service actualizado
- [ ] Rutas protegidas configuradas
- [ ] Modo anónimo implementado

### Testing
- [ ] Pruebas de endpoints con Postman
- [ ] Pruebas de autenticación por roles
- [ ] Pruebas de envío de notificaciones
- [ ] Pruebas de creación de incidencias
- [ ] Pruebas end-to-end en frontend

---

## 🔟 Notas Importantes

1. **Imágenes de Perfil**: El campo `imgProfile` ya fue agregado al modelo `Usuario`. Asegúrate de:
   - Actualizar el frontend para permitir subir imágenes
   - Configurar almacenamiento (local o cloud como AWS S3, Cloudinary)
   - Actualizar el servicio de autenticación para incluir `imgProfile` en las respuestas

2. **Modo Anónimo**: Los maestros pueden activar `modoAnonimo` para ocultar su identidad al crear incidencias. El frontend debe mostrar "Maestro" en lugar del nombre real cuando esté activo.

3. **Seguridad**: 
   - Nunca exponer contraseñas en respuestas de API
   - Validar todos los inputs con Zod
   - Usar HTTPS en producción
   - Implementar rate limiting para prevenir abuso

4. **Performance**:
   - Usar cola de trabajos para envíos masivos
   - Implementar paginación en listados
   - Cachear plantillas frecuentemente usadas

---

## 📚 Recursos Adicionales

- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de Express](https://expressjs.com/)
- [Documentación de BullMQ](https://docs.bullmq.io/)
- [WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [SendGrid Node.js](https://github.com/sendgrid/sendgrid-nodejs)

---

**Última actualización**: 2025-01-14
**Versión del plan**: 1.0






