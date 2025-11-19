// Script para actualizar todas las contraseñas a "1234"
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Actualizando contraseñas a "1234"...\n');

  const password = '1234';
  const hashedPassword = await bcrypt.hash(password, 10);

  // Actualizar todos los usuarios
  const usuarios = await prisma.usuario.findMany();

  if (usuarios.length === 0) {
    console.log('⚠️ No hay usuarios en la base de datos');
    console.log('Ejecuta "npm run seed" primero para crear usuarios');
    return;
  }

  for (const usuario of usuarios) {
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { password: hashedPassword },
    });
    console.log(`✅ Contraseña actualizada para: ${usuario.email}`);
  }

  console.log(`\n🎉 Se actualizaron ${usuarios.length} usuario(s)`);
  console.log('\n📝 Usuarios actualizados:');
  usuarios.forEach(u => {
    console.log(`   - ${u.email} (${u.role}) - Contraseña: 1234`);
  });
  console.log('\n✅ Ahora puedes iniciar sesión con contraseña: 1234');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });







