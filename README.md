# UniPal-AI

Asistente virtual para escuelas secundarias y preparatorias

## 📋 Descripción

UniPal-AI es una aplicación web completa que conecta padres/tutores, profesores y alumnos, permitiendo gestionar asistencias, calificaciones, notificaciones y comunicación en tiempo real.

## 🚀 Tecnologías

### Frontend
- React 19.1.1
- Vite 7.1.7
- Tailwind CSS 4.1.14
- React Router DOM 7.9.3
- Framer Motion 12.23.24
- React Calendar 6.0.0

### Backend (En desarrollo)
- Node.js + Express
- PostgreSQL + Prisma
- JWT Authentication

## 📦 Instalación

### Requisitos Previos
- Node.js 18+ y npm
- SQL Server (local o remoto)
- Git

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/UniPal-AI.git
cd UniPal-AI
```

### 2. Configurar Backend

#### 2.1 Instalar dependencias
```bash
cd backend
npm install
```

#### 2.2 Configurar variables de entorno
Crea un archivo `.env` en la carpeta `backend/` con el siguiente contenido:

```env
# Base de datos SQL Server
DATABASE_URL="sqlserver://localhost:1433;database=UniPalDB;user=sa;password=TU_PASSWORD;trustServerCertificate=true"

# JWT Secret (cambiar en producción)
JWT_SECRET="unipal-secret-key-cambiar-en-produccion-2025"
JWT_EXPIRES_IN="7d"

# Puerto del servidor
PORT=3001

# Ambiente
NODE_ENV=development

# URL del frontend (se detecta automáticamente)
FRONTEND_URL="http://localhost:5173"
```

**⚠️ IMPORTANTE:** Reemplaza `TU_PASSWORD` con la contraseña de tu SQL Server.

#### 2.3 Configurar base de datos
```bash
# Generar cliente Prisma
npm run prisma:generate

# Ejecutar migraciones (crea las tablas)
npm run prisma:migrate

# Poblar con datos de prueba (opcional)
npm run seed
```

#### 2.4 Iniciar servidor backend
```bash
npm run dev
```

El servidor mostrará las URLs disponibles:
- **Local:** `http://localhost:3001`
- **Red:** `http://TU_IP:3001` (para acceso desde celular)

### 3. Configurar Frontend

#### 3.1 Instalar dependencias
```bash
# Desde la raíz del proyecto
npm install
```

#### 3.2 Iniciar servidor frontend
```bash
npm run dev
```

El frontend estará disponible en:
- **Local:** `http://localhost:5173`
- **Red:** `http://TU_IP:5173` (para acceso desde celular)

### 4. Acceso desde Celular

1. **Asegúrate de estar en la misma red WiFi**
2. **Abre el puerto en el firewall:**
   - Windows: PowerShell como Administrador
   ```powershell
   New-NetFirewallRule -DisplayName "UniPal Backend" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow
   New-NetFirewallRule -DisplayName "UniPal Frontend" -Direction Inbound -LocalPort 5173 -Protocol TCP -Action Allow
   ```

3. **Usa la IP que muestra el servidor backend al iniciar:**
   - Ejemplo: `http://192.168.100.40:5173`

**✨ Nota:** La detección de IP es automática. El frontend detectará automáticamente si accedes desde localhost o desde IP de red y ajustará la URL del backend automáticamente.

## 📖 Documentación

Ver [PLAN_DE_ACCION.md](./PLAN_DE_ACCION.md) para el plan completo de implementación del backend.

## 🎯 Estado del Proyecto

- ✅ Frontend completo y funcional
- 🚧 Backend en desarrollo
- 🚧 Integración Frontend-Backend pendiente
