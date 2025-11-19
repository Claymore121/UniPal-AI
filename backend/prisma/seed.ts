import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Función para asegurar que los usuarios se creen correctamente
async function ensureUser(email: string, password: string, nombre: string, apellidos: string, role: string) {
  const existing = await prisma.usuario.findUnique({ where: { email } });
  const hashedPassword = await bcrypt.hash(password, 10);
  
  if (existing) {
    console.log(`   ⚠️ Usuario ${email} ya existe, actualizando contraseña...`);
    return await prisma.usuario.update({
      where: { email },
      data: { password: hashedPassword, nombre, apellidos, role: role as any },
    });
  }
  
  return await prisma.usuario.create({
    data: { email, password: hashedPassword, nombre, apellidos, role: role as any },
  });
}

async function main() {
  console.log('🌱 Iniciando seed de base de datos...');

  // Crear un padre/tutor de prueba (contraseña: 1234)
  const padre = await ensureUser('padre@test.com', '1234', 'Juan', 'Pérez', 'PADRE_TUTOR');
  console.log('✅ Usuario padre creado:', padre.email);

  // Crear un maestro de prueba (contraseña: 1234)
  const maestro = await ensureUser('maestro@test.com', '1234', 'Roberto', 'Méndez', 'MAESTRO');
  console.log('✅ Usuario maestro creado:', maestro.email);

  // Crear un administrador de prueba (contraseña: 1234)
  const admin = await ensureUser('admin@test.com', '1234', 'María', 'González', 'ADMINISTRADOR');
  console.log('✅ Usuario administrador creado:', admin.email);

  // Crear clases
  const clase1 = await prisma.clase.findFirst({
    where: { nombre: 'Matemáticas 10A', profesorId: maestro.id },
  }) || await prisma.clase.create({
    data: {
      nombre: 'Matemáticas 10A',
      materia: 'Matemáticas',
      grado: '10A',
      horario: 'Lunes y Miércoles 10:00 - 11:30',
      profesorId: maestro.id,
    },
  });

  const clase2 = await prisma.clase.findFirst({
    where: { nombre: 'Física 11B', profesorId: maestro.id },
  }) || await prisma.clase.create({
    data: {
      nombre: 'Física 11B',
      materia: 'Física',
      grado: '11B',
      horario: 'Martes y Jueves 09:00 - 10:30',
      profesorId: maestro.id,
    },
  });

  console.log('✅ Clases creadas');

  // Crear alumnos de prueba
  const alumno1 = await prisma.alumno.findFirst({
    where: { 
      nombre: 'Luis',
      apellidos: 'García',
      padreTutorId: padre.id,
    },
  }) || await prisma.alumno.create({
    data: {
      nombre: 'Luis',
      apellidos: 'García',
      nivel: 'SECUNDARIA', // String en lugar de enum
      grado: '2do Secundaria',
      claveAlumno: '23421',
      sexo: 'hombre',
      padreTutorId: padre.id,
    },
  });

  const alumno2 = await prisma.alumno.findFirst({
    where: {
      nombre: 'Ana',
      apellidos: 'López',
      padreTutorId: padre.id,
    },
  }) || await prisma.alumno.create({
    data: {
      nombre: 'Ana',
      apellidos: 'López',
      nivel: 'PREPARATORIA', // String en lugar de enum
      grado: '1ro Preparatoria',
      numeroControl: 'L21490873',
      sexo: 'mujer',
      padreTutorId: padre.id,
    },
  });

  console.log('✅ Alumnos creados');

  // Inscribir alumnos en clases
  const inscripcion1 = await prisma.inscripcion.findFirst({
    where: {
      alumnoId: alumno1.id,
      claseId: clase1.id,
    },
  });

  if (!inscripcion1) {
    await prisma.inscripcion.create({
      data: {
        alumnoId: alumno1.id,
        claseId: clase1.id,
      },
    });
  }

  const inscripcion2 = await prisma.inscripcion.findFirst({
    where: {
      alumnoId: alumno2.id,
      claseId: clase2.id,
    },
  });

  if (!inscripcion2) {
    await prisma.inscripcion.create({
      data: {
        alumnoId: alumno2.id,
        claseId: clase2.id,
      },
    });
  }

  console.log('✅ Inscripciones creadas');

  // Crear algunas asistencias de ejemplo
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const asistencia1 = await prisma.asistencia.findFirst({
    where: {
      alumnoId: alumno1.id,
      claseId: clase1.id,
      fecha: hoy,
    },
  });

  if (!asistencia1) {
    await prisma.asistencia.create({
      data: {
        fecha: hoy,
        estado: 'PRESENTE', // String en lugar de enum
        alumnoId: alumno1.id,
        claseId: clase1.id,
      },
    });
  }

  const asistencia2 = await prisma.asistencia.findFirst({
    where: {
      alumnoId: alumno2.id,
      claseId: clase2.id,
      fecha: hoy,
    },
  });

  if (!asistencia2) {
    await prisma.asistencia.create({
      data: {
        fecha: hoy,
        estado: 'PRESENTE', // String en lugar de enum
        alumnoId: alumno2.id,
        claseId: clase2.id,
      },
    });
  }

  console.log('✅ Asistencias de ejemplo creadas');

  // Crear algunas notificaciones de ejemplo
  // SQL Server no soporta skipDuplicates en createMany, así que verificamos antes de crear
  const notificacionesData = [
    {
      titulo: 'Recordatorio de tarea',
      mensaje: 'No olvides revisar el progreso de tus hijos hoy.',
      tipo: 'reminder',
      icono: '🔔',
      leida: false,
      usuarioId: padre.id,
    },
    {
      titulo: 'Nuevo logro desbloqueado',
      mensaje: 'Tu hijo Luis ha completado su tarea de matemáticas.',
      tipo: 'achievement',
      icono: '🏆',
      leida: true,
      usuarioId: padre.id,
    },
    {
      titulo: 'Mensaje de soporte',
      mensaje: 'Tu consulta ha sido respondida. Revisa tu bandeja de entrada.',
      tipo: 'support',
      icono: '💬',
      leida: false,
      usuarioId: padre.id,
    },
  ];

  for (const notifData of notificacionesData) {
    const existe = await prisma.notificacion.findFirst({
      where: {
        titulo: notifData.titulo,
        usuarioId: notifData.usuarioId,
      },
    });

    if (!existe) {
      await prisma.notificacion.create({
        data: notifData,
      });
    }
  }

  console.log('✅ Notificaciones de ejemplo creadas');

  console.log('\n🎉 Seed completado exitosamente!');
  console.log('\n📝 Usuarios de prueba creados:');
  console.log('   👤 Padre/Tutor:');
  console.log('      Email: padre@test.com');
  console.log('      Password: 1234');
  console.log('\n   👨‍🏫 Maestro:');
  console.log('      Email: maestro@test.com');
  console.log('      Password: 1234');
  console.log('\n   👔 Administrador:');
  console.log('      Email: admin@test.com');
  console.log('      Password: 1234');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

