BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[usuarios] (
    [id] NVARCHAR(1000) NOT NULL,
    [email] VARCHAR(255) NOT NULL,
    [password] VARCHAR(255) NOT NULL,
    [nombre] VARCHAR(100) NOT NULL,
    [apellidos] VARCHAR(100),
    [telefono] VARCHAR(20),
    [imgProfile] VARCHAR(500),
    [role] VARCHAR(20) NOT NULL CONSTRAINT [usuarios_role_df] DEFAULT 'PADRE_TUTOR',
    [activo] BIT NOT NULL CONSTRAINT [usuarios_activo_df] DEFAULT 1,
    [modoAnonimo] BIT NOT NULL CONSTRAINT [usuarios_modoAnonimo_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [usuarios_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [usuarios_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [usuarios_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[alumnos] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre] VARCHAR(100) NOT NULL,
    [apellidos] VARCHAR(100) NOT NULL,
    [nivel] VARCHAR(20) NOT NULL,
    [grado] VARCHAR(50) NOT NULL,
    [claveAlumno] VARCHAR(50),
    [numeroControl] VARCHAR(50),
    [sexo] VARCHAR(10) NOT NULL,
    [imgProfile] VARCHAR(500),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [alumnos_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [padreTutorId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [alumnos_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[clases] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre] VARCHAR(100) NOT NULL,
    [materia] VARCHAR(100) NOT NULL,
    [grado] VARCHAR(50) NOT NULL,
    [horario] VARCHAR(100) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [clases_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [profesorId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [clases_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[inscripciones] (
    [id] NVARCHAR(1000) NOT NULL,
    [alumnoId] NVARCHAR(1000) NOT NULL,
    [claseId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [inscripciones_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [inscripciones_alumnoId_claseId_key] UNIQUE NONCLUSTERED ([alumnoId],[claseId])
);

-- CreateTable
CREATE TABLE [dbo].[asistencias] (
    [id] NVARCHAR(1000) NOT NULL,
    [fecha] DATETIME2 NOT NULL,
    [estado] VARCHAR(20) NOT NULL,
    [alumnoId] NVARCHAR(1000) NOT NULL,
    [claseId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [asistencias_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [asistencias_alumnoId_claseId_fecha_key] UNIQUE NONCLUSTERED ([alumnoId],[claseId],[fecha])
);

-- CreateTable
CREATE TABLE [dbo].[calificaciones] (
    [id] NVARCHAR(1000) NOT NULL,
    [valor] FLOAT(53) NOT NULL,
    [materia] VARCHAR(100) NOT NULL,
    [fecha] DATETIME2 NOT NULL CONSTRAINT [calificaciones_fecha_df] DEFAULT CURRENT_TIMESTAMP,
    [notas] NVARCHAR(max),
    [alumnoId] NVARCHAR(1000) NOT NULL,
    [claseId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [calificaciones_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[notificaciones] (
    [id] NVARCHAR(1000) NOT NULL,
    [titulo] VARCHAR(200) NOT NULL,
    [mensaje] NVARCHAR(max) NOT NULL,
    [tipo] VARCHAR(50) NOT NULL,
    [icono] VARCHAR(10),
    [leida] BIT NOT NULL CONSTRAINT [notificaciones_leida_df] DEFAULT 0,
    [usuarioId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [notificaciones_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [notificaciones_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[reuniones] (
    [id] NVARCHAR(1000) NOT NULL,
    [titulo] VARCHAR(200) NOT NULL,
    [fecha] DATETIME2 NOT NULL,
    [hora] VARCHAR(10) NOT NULL,
    [tipo] VARCHAR(50) NOT NULL,
    [descripcion] NVARCHAR(max),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [reuniones_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [reuniones_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[incidencias] (
    [id] NVARCHAR(1000) NOT NULL,
    [titulo] VARCHAR(200) NOT NULL,
    [descripcion] NVARCHAR(max) NOT NULL,
    [tipo] VARCHAR(50) NOT NULL,
    [severidad] VARCHAR(20) NOT NULL,
    [estado] VARCHAR(20) NOT NULL CONSTRAINT [incidencias_estado_df] DEFAULT 'PENDIENTE',
    [alumnoId] NVARCHAR(1000) NOT NULL,
    [maestroId] NVARCHAR(1000) NOT NULL,
    [claseId] NVARCHAR(1000),
    [fecha] DATETIME2 NOT NULL CONSTRAINT [incidencias_fecha_df] DEFAULT CURRENT_TIMESTAMP,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [incidencias_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [incidencias_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[plantillas] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre] VARCHAR(200) NOT NULL,
    [asunto] VARCHAR(300) NOT NULL,
    [contenido] NVARCHAR(max) NOT NULL,
    [tipo] VARCHAR(50) NOT NULL,
    [canal] VARCHAR(20) NOT NULL,
    [activa] BIT NOT NULL CONSTRAINT [plantillas_activa_df] DEFAULT 1,
    [creadoPorId] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [plantillas_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [plantillas_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[historial_notificaciones] (
    [id] NVARCHAR(1000) NOT NULL,
    [plantillaId] NVARCHAR(1000),
    [destinatarioId] NVARCHAR(1000) NOT NULL,
    [asunto] VARCHAR(300) NOT NULL,
    [mensaje] NVARCHAR(max) NOT NULL,
    [canal] VARCHAR(20) NOT NULL,
    [estado] VARCHAR(20) NOT NULL,
    [error] NVARCHAR(max),
    [enviadoEn] DATETIME2 NOT NULL CONSTRAINT [historial_notificaciones_enviadoEn_df] DEFAULT CURRENT_TIMESTAMP,
    [leidoEn] DATETIME2,
    CONSTRAINT [historial_notificaciones_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[alumnos] ADD CONSTRAINT [alumnos_padreTutorId_fkey] FOREIGN KEY ([padreTutorId]) REFERENCES [dbo].[usuarios]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[clases] ADD CONSTRAINT [clases_profesorId_fkey] FOREIGN KEY ([profesorId]) REFERENCES [dbo].[usuarios]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[inscripciones] ADD CONSTRAINT [inscripciones_alumnoId_fkey] FOREIGN KEY ([alumnoId]) REFERENCES [dbo].[alumnos]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[inscripciones] ADD CONSTRAINT [inscripciones_claseId_fkey] FOREIGN KEY ([claseId]) REFERENCES [dbo].[clases]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[asistencias] ADD CONSTRAINT [asistencias_alumnoId_fkey] FOREIGN KEY ([alumnoId]) REFERENCES [dbo].[alumnos]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[asistencias] ADD CONSTRAINT [asistencias_claseId_fkey] FOREIGN KEY ([claseId]) REFERENCES [dbo].[clases]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[calificaciones] ADD CONSTRAINT [calificaciones_alumnoId_fkey] FOREIGN KEY ([alumnoId]) REFERENCES [dbo].[alumnos]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[calificaciones] ADD CONSTRAINT [calificaciones_claseId_fkey] FOREIGN KEY ([claseId]) REFERENCES [dbo].[clases]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[notificaciones] ADD CONSTRAINT [notificaciones_usuarioId_fkey] FOREIGN KEY ([usuarioId]) REFERENCES [dbo].[usuarios]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[incidencias] ADD CONSTRAINT [incidencias_alumnoId_fkey] FOREIGN KEY ([alumnoId]) REFERENCES [dbo].[alumnos]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[incidencias] ADD CONSTRAINT [incidencias_maestroId_fkey] FOREIGN KEY ([maestroId]) REFERENCES [dbo].[usuarios]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[incidencias] ADD CONSTRAINT [incidencias_claseId_fkey] FOREIGN KEY ([claseId]) REFERENCES [dbo].[clases]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[plantillas] ADD CONSTRAINT [plantillas_creadoPorId_fkey] FOREIGN KEY ([creadoPorId]) REFERENCES [dbo].[usuarios]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[historial_notificaciones] ADD CONSTRAINT [historial_notificaciones_plantillaId_fkey] FOREIGN KEY ([plantillaId]) REFERENCES [dbo].[plantillas]([id]) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[historial_notificaciones] ADD CONSTRAINT [historial_notificaciones_destinatarioId_fkey] FOREIGN KEY ([destinatarioId]) REFERENCES [dbo].[usuarios]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
