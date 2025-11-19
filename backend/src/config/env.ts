import dotenv from 'dotenv';

dotenv.config();

// Validar variables requeridas antes de exportar
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL no está definida en .env');
  console.error('💡 Asegúrate de que el archivo backend/.env contenga:');
  console.error('   DATABASE_URL="sqlserver://localhost:1433;database=UniPalDB;user=sa;password=1234;trustServerCertificate=true"');
  process.exit(1);
}

if (!JWT_SECRET) {
  console.error('❌ ERROR: JWT_SECRET no está definida en .env');
  console.error('💡 Asegúrate de que el archivo backend/.env contenga:');
  console.error('   JWT_SECRET="unipal-secret-key-cambiar-en-produccion-2025"');
  process.exit(1);
}

export const env = {
  PORT: process.env.PORT || '3001',
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: DATABASE_URL,
  JWT_SECRET: JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};

