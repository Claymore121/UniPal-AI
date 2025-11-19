// Cargar variables de entorno primero
console.log('📦 Cargando variables de entorno...');
import dotenv from 'dotenv';
dotenv.config();
console.log('✅ Variables de entorno cargadas');

// Manejar errores no capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Error no capturado:', error);
  if (error.stack) {
    console.error('Stack:', error.stack);
  }
  process.exit(1);
});

process.on('unhandledRejection', (reason: any, promise) => {
  console.error('❌ Promesa rechazada no manejada:', reason);
  if (reason?.stack) {
    console.error('Stack:', reason.stack);
  }
  process.exit(1);
});

console.log('📦 Importando dependencias...');
import express from 'express';
console.log('✅ express importado');
import cors from 'cors';
console.log('✅ cors importado');
import { env } from './config/env.js';
console.log('✅ env importado');
import { errorHandler } from './middleware/error.middleware.js';
console.log('✅ errorHandler importado');

// Routes
console.log('📦 Importando rutas...');
import authRoutes from './routes/auth.routes.js';
console.log('✅ authRoutes importado');
import alumnosRoutes from './routes/alumnos.routes.js';
console.log('✅ alumnosRoutes importado');
import profesoresRoutes from './routes/profesores.routes.js';
console.log('✅ profesoresRoutes importado');
import notificacionesRoutes from './routes/notificaciones.routes.js';
console.log('✅ notificacionesRoutes importado');
import incidenciasRoutes from './routes/incidencias.routes.js';
console.log('✅ incidenciasRoutes importado');
import plantillasRoutes from './routes/plantillas.routes.js';
console.log('✅ plantillasRoutes importado');
import reunionesRoutes from './routes/reuniones.routes.js';
console.log('✅ reunionesRoutes importado');

// Inicializar Prisma para verificar conexión
console.log('📦 Importando Prisma...');
import prisma from './config/database.js';
console.log('✅ Prisma importado');

console.log('📦 Creando aplicación Express...');
const app = express();
console.log('✅ Aplicación Express creada');


app.use(
  cors({
    origin: (origin, callback) => {
      // En desarrollo, permitir localhost en cualquier puerto
      if (env.NODE_ENV === 'development') {
        if (!origin || origin.startsWith('http://localhost')) {
          callback(null, true);
        } else {
          callback(null, true); // Permitir todos en desarrollo para facilitar testing
        }
      } else {
        // En producción, solo permitir el origen específico
        const allowedOrigins = [env.FRONTEND_URL];
        if (origin && allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('No permitido por CORS'));
        }
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'UniPal API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/alumnos', alumnosRoutes);
app.use('/api/profesores', profesoresRoutes);
app.use('/api/notificaciones', notificacionesRoutes);
app.use('/api/incidencias', incidenciasRoutes);
app.use('/api/plantillas', plantillasRoutes);
app.use('/api/reuniones', reunionesRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Error handler (debe ser el último middleware)
app.use(errorHandler);

const PORT = env.PORT;

// Verificar conexión a la base de datos antes de iniciar
async function startServer() {
  try {
    console.log('\n🔍 Verificando conexión a la base de datos...');
    console.log('DATABASE_URL:', env.DATABASE_URL ? '✅ Configurada' : '❌ No configurada');
    
    // Verificar conexión a la base de datos
    console.log('Intentando conectar a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');

    console.log(`\n🚀 Iniciando servidor en puerto ${PORT}...`);
    
    // Obtener IP local para acceso desde otros dispositivos
    const os = await import('os');
    const networkInterfaces = os.default.networkInterfaces();
    let wifiIP = 'localhost';
    let primaryIP = 'localhost';
    const allIPs: string[] = [];
    
    // Lista de adaptadores virtuales a excluir
    const virtualAdapters = [
      'virtualbox', 'vmware', 'hyper-v', 'vbox', 'virtual',
      'loopback', 'gns3', 'docker', 'wsl', 'tun', 'tap'
    ];
    
    // Función para verificar si es un adaptador virtual
    const isVirtualAdapter = (name: string): boolean => {
      const lowerName = name.toLowerCase();
      return virtualAdapters.some(virtual => lowerName.includes(virtual));
    };
    
    // Buscar IPs disponibles, priorizando WiFi y excluyendo virtuales
    for (const interfaceName in networkInterfaces) {
      const addresses = networkInterfaces[interfaceName];
      if (addresses) {
        // Saltar adaptadores virtuales
        if (isVirtualAdapter(interfaceName)) {
          continue;
        }
        
        for (const addr of addresses) {
          if (addr.family === 'IPv4' && !addr.internal) {
            allIPs.push(addr.address);
            
            // Priorizar WiFi explícitamente
            const lowerName = interfaceName.toLowerCase();
            if (lowerName.includes('wifi') || 
                lowerName.includes('wireless') ||
                lowerName.includes('inalámbrica') ||
                lowerName.includes('wi-fi')) {
              if (wifiIP === 'localhost') {
                wifiIP = addr.address;
              }
            }
            
            // Primera IP no localhost y no virtual como respaldo
            if (primaryIP === 'localhost' && !isVirtualAdapter(interfaceName)) {
              primaryIP = addr.address;
            }
          }
        }
      }
    }
    
    // Usar WiFi IP si está disponible, sino la primera IP no virtual encontrada
    const localIP = wifiIP !== 'localhost' ? wifiIP : primaryIP;
    
    // Escuchar en 0.0.0.0 para permitir conexiones desde cualquier interfaz de red
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n╔══════════════════════════════════════════════════════════╗`);
      console.log(`║          ✅ SERVIDOR INICIADO CORRECTAMENTE                ║`);
      console.log(`╚══════════════════════════════════════════════════════════╝`);
      console.log(`🚀 Servidor corriendo en:`);
      console.log(`   📍 Local:    http://localhost:${PORT}`);
      console.log(`   🌐 WiFi:     http://${localIP}:${PORT} ${wifiIP !== 'localhost' ? '✅' : '⚠️'}`);
      
      if (allIPs.length > 1) {
        console.log(`\n📡 Todas las IPs disponibles:`);
        allIPs.forEach((ip, index) => {
          const isWifi = ip === wifiIP && wifiIP !== 'localhost';
          console.log(`   ${index + 1}. http://${ip}:${PORT} ${isWifi ? '(WiFi - Usa esta)' : ''}`);
        });
      }
      
      console.log(`\n📡 Ambiente: ${env.NODE_ENV}`);
      console.log(`🌐 Frontend URL: ${env.FRONTEND_URL}`);
      console.log(`\n✅ Servidor listo para recibir peticiones`);
      console.log(`\n💡 Prueba local: http://localhost:${PORT}/api/health`);
      console.log(`💡 Prueba desde celular: http://${localIP}:${PORT}/api/health`);
      console.log(`\n📱 Para acceder desde tu celular:`);
      console.log(`   1. Asegúrate de estar en la misma red WiFi`);
      console.log(`   2. Usa la URL: http://${localIP}:${PORT}`);
      console.log(`   3. Si no funciona, prueba las otras IPs mostradas arriba\n`);
    });
  } catch (error: any) {
    console.error('\n❌ Error al iniciar el servidor:');
    console.error('Mensaje:', error?.message || String(error));
    if (error?.stack) {
      console.error('Stack:', error.stack);
    }
    
    if (error?.message?.includes('DATABASE_URL')) {
      console.error('\n💡 Verifica que el archivo .env tenga DATABASE_URL configurada');
    }
    
    if (error?.message?.includes('connect') || error?.message?.includes('ECONNREFUSED')) {
      console.error('\n💡 Verifica que SQL Server esté corriendo y que la base de datos UniPalDB exista');
      console.error('   Ejecuta: sqlcmd -S localhost -U sa -P 1234 -Q "SELECT 1"');
    }
    
    if (error?.code === 'P1001') {
      console.error('\n💡 Error de Prisma: No se puede conectar a la base de datos');
      console.error('   Verifica que SQL Server esté corriendo');
    }
    
    process.exit(1);
  }
}

// Manejar cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  try {
    await prisma.$disconnect();
  } catch (err) {
    console.error('Error al desconectar Prisma:', err);
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Cerrando servidor...');
  try {
    await prisma.$disconnect();
  } catch (err) {
    console.error('Error al desconectar Prisma:', err);
  }
  process.exit(0);
});

startServer();
