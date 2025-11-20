-- =====================================================
-- CLINICA WENKA - DATABASE SCHEMA
-- =====================================================
-- Fixed and optimized version - MySQL 8.0 compatible
-- =====================================================

-- =====================================================
-- 1. TABLA: USUARIOS (para autenticacion)
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. TABLA: ESPECIALIDADES
-- =====================================================
CREATE TABLE IF NOT EXISTS especialidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. TABLA: ESPECIALISTAS
-- =====================================================
CREATE TABLE IF NOT EXISTS especialistas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    especialidad_id INT NOT NULL,
    cedula_profesional VARCHAR(50) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_contratacion DATE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (especialidad_id) REFERENCES especialidades(id) ON DELETE RESTRICT,
    INDEX idx_especialidad (especialidad_id),
    INDEX idx_email (email),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. TABLA: PACIENTES
-- =====================================================
CREATE TABLE IF NOT EXISTS pacientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    fecha_nacimiento DATE NOT NULL,
    sexo CHAR(1) NOT NULL CHECK (sexo IN ('M', 'F', 'O')),
    telefono VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    direccion TEXT,
    ciudad VARCHAR(100),
    codigo_postal VARCHAR(10),
    tipo_sangre VARCHAR(5),
    alergias TEXT,
    enfermedades_cronicas TEXT,
    contacto_emergencia_nombre VARCHAR(150),
    contacto_emergencia_telefono VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_telefono (telefono),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. TABLA: TRATAMIENTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS tratamientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    especialidad_id INT NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    costo DECIMAL(10, 2) NOT NULL,
    duracion_estimada_minutos INT NOT NULL DEFAULT 30,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (especialidad_id) REFERENCES especialidades(id) ON DELETE RESTRICT,
    INDEX idx_especialidad (especialidad_id),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. TABLA: CITAS
-- =====================================================
CREATE TABLE IF NOT EXISTS citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    especialista_id INT NOT NULL,
    tratamiento_id INT NOT NULL,
    fecha_hora TIMESTAMP NOT NULL,
    duracion_minutos INT NOT NULL DEFAULT 30,
    motivo TEXT,
    estado VARCHAR(20) NOT NULL DEFAULT 'programada' 
        CHECK (estado IN ('programada', 'confirmada', 'en_curso', 'completada', 'cancelada', 'no_asistio')),
    notas TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
    FOREIGN KEY (especialista_id) REFERENCES especialistas(id) ON DELETE RESTRICT,
    FOREIGN KEY (tratamiento_id) REFERENCES tratamientos(id) ON DELETE RESTRICT,
    INDEX idx_paciente (paciente_id),
    INDEX idx_especialista (especialista_id),
    INDEX idx_fecha_hora (fecha_hora),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 7. TABLA: HISTORIAL_CLINICO
-- =====================================================
CREATE TABLE IF NOT EXISTS historial_clinico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cita_id INT,
    paciente_id INT NOT NULL,
    especialista_id INT NOT NULL,
    fecha_consulta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motivo_consulta TEXT NOT NULL,
    sintomas TEXT,
    diagnostico TEXT,
    tratamiento_aplicado TEXT,
    medicamentos_recetados TEXT,
    indicaciones TEXT,
    observaciones TEXT,
    proxima_cita DATE,
    archivo_adjunto VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE SET NULL,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
    FOREIGN KEY (especialista_id) REFERENCES especialistas(id) ON DELETE RESTRICT,
    INDEX idx_paciente (paciente_id),
    INDEX idx_especialista (especialista_id),
    INDEX idx_cita (cita_id),
    INDEX idx_fecha_consulta (fecha_consulta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 8. TABLA: PAGOS
-- =====================================================
CREATE TABLE IF NOT EXISTS pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cita_id INT NOT NULL,
    paciente_id INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL 
        CHECK (metodo_pago IN ('efectivo', 'tarjeta_debito', 'tarjeta_credito', 'transferencia', 'otro')),
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' 
        CHECK (estado IN ('pendiente', 'pagado', 'cancelado', 'reembolsado')),
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    referencia VARCHAR(100),
    notas TEXT,
    FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE CASCADE,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
    INDEX idx_cita (cita_id),
    INDEX idx_paciente (paciente_id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- VISTAS UTILES
-- =====================================================

-- Vista: Agenda completa con informacion detallada
DROP VIEW IF EXISTS vista_agenda_completa;
CREATE VIEW vista_agenda_completa AS
SELECT 
    c.id as cita_id,
    c.fecha_hora,
    c.estado,
    CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', COALESCE(p.apellido_materno, '')) as paciente,
    p.telefono as telefono_paciente,
    CONCAT(e.nombre, ' ', e.apellido_paterno) as especialista,
    es.nombre as especialidad,
    t.nombre as tratamiento,
    t.costo,
    c.motivo,
    c.duracion_minutos
FROM citas c
JOIN pacientes p ON c.paciente_id = p.id
JOIN especialistas e ON c.especialista_id = e.id
JOIN especialidades es ON e.especialidad_id = es.id
JOIN tratamientos t ON c.tratamiento_id = t.id
ORDER BY c.fecha_hora;

-- Vista: Historial completo de pacientes
DROP VIEW IF EXISTS vista_historial_pacientes;
CREATE VIEW vista_historial_pacientes AS
SELECT 
    p.id as paciente_id,
    CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', COALESCE(p.apellido_materno, '')) as paciente,
    h.fecha_consulta,
    CONCAT(e.nombre, ' ', e.apellido_paterno) as especialista,
    es.nombre as especialidad,
    h.diagnostico,
    h.tratamiento_aplicado,
    h.medicamentos_recetados,
    h.indicaciones
FROM historial_clinico h
JOIN pacientes p ON h.paciente_id = p.id
JOIN especialistas e ON h.especialista_id = e.id
JOIN especialidades es ON e.especialidad_id = es.id
ORDER BY h.fecha_consulta DESC;

-- Vista: Estado de pagos
DROP VIEW IF EXISTS vista_estado_pagos;
CREATE VIEW vista_estado_pagos AS
SELECT 
    pag.id as pago_id,
    CONCAT(p.nombre, ' ', p.apellido_paterno) as paciente,
    c.fecha_hora as fecha_cita,
    t.nombre as tratamiento,
    pag.monto,
    pag.metodo_pago,
    pag.estado,
    pag.fecha_pago
FROM pagos pag
JOIN pacientes p ON pag.paciente_id = p.id
JOIN citas c ON pag.cita_id = c.id
JOIN tratamientos t ON c.tratamiento_id = t.id
ORDER BY pag.fecha_pago DESC;

-- Vista: Disponibilidad de especialistas
DROP VIEW IF EXISTS vista_disponibilidad_especialistas;
CREATE VIEW vista_disponibilidad_especialistas AS
SELECT 
    e.id,
    CONCAT(e.nombre, ' ', e.apellido_paterno) as especialista,
    es.nombre as especialidad,
    COUNT(CASE WHEN c.estado IN ('programada', 'confirmada', 'en_curso') THEN 1 END) as citas_activas,
    GROUP_CONCAT(DISTINCT DATE(c.fecha_hora) ORDER BY DATE(c.fecha_hora)) as fechas_ocupadas
FROM especialistas e
JOIN especialidades es ON e.especialidad_id = es.id
LEFT JOIN citas c ON e.id = c.especialista_id AND c.estado IN ('programada', 'confirmada', 'en_curso')
WHERE e.activo = TRUE
GROUP BY e.id, es.nombre;