-- =====================================================
-- 1. TABLA: ESPECIALIDADES
-- =====================================================

-- Tabla de usuarios para autenticación
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE especialidades (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. TABLA: ESPECIALISTAS
-- =====================================================
CREATE TABLE especialistas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    especialidad_id INT REFERENCES especialidades(id),
    cedula_profesional VARCHAR(50) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_contratacion DATE DEFAULT CURRENT_DATE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. TABLA: PACIENTES
-- =====================================================
CREATE TABLE pacientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    fecha_nacimiento DATE NOT NULL,
    sexo CHAR(1) CHECK (sexo IN ('M', 'F', 'O')),
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    ciudad VARCHAR(100),
    codigo_postal VARCHAR(10),
    tipo_sangre VARCHAR(5),
    alergias TEXT,
    enfermedades_cronicas TEXT,
    contacto_emergencia_nombre VARCHAR(150),
    contacto_emergencia_telefono VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. TABLA: TRATAMIENTOS
-- =====================================================
CREATE TABLE tratamientos (
    id SERIAL PRIMARY KEY,
    especialidad_id INT REFERENCES especialidades(id),
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    costo DECIMAL(10, 2) NOT NULL,
    duracion_estimada_minutos INT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 5. TABLA: CITAS
-- =====================================================
CREATE TABLE citas (
    id SERIAL PRIMARY KEY,
    paciente_id INT REFERENCES pacientes(id),
    especialista_id INT REFERENCES especialistas(id),
    tratamiento_id INT REFERENCES tratamientos(id),
    fecha_hora TIMESTAMP NOT NULL,
    duracion_minutos INT DEFAULT 30,
    motivo TEXT,
    estado VARCHAR(20) DEFAULT 'programada' CHECK (estado IN ('programada', 'confirmada', 'en_curso', 'completada', 'cancelada', 'no_asistio')),
    notas TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 6. TABLA: HISTORIAL_CLINICO
-- =====================================================
CREATE TABLE historial_clinico (
    id SERIAL PRIMARY KEY,
    cita_id INT REFERENCES citas(id),
    paciente_id INT REFERENCES pacientes(id),
    especialista_id INT REFERENCES especialistas(id),
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
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 7. TABLA: PAGOS
-- =====================================================
CREATE TABLE pagos (
    id SERIAL PRIMARY KEY,
    cita_id INT REFERENCES citas(id),
    paciente_id INT REFERENCES pacientes(id),
    monto DECIMAL(10, 2) NOT NULL,
    metodo_pago VARCHAR(50) CHECK (metodo_pago IN ('efectivo', 'tarjeta_debito', 'tarjeta_credito', 'transferencia', 'otro')),
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagado', 'cancelado', 'reembolsado')),
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    referencia VARCHAR(100),
    notas TEXT
);

