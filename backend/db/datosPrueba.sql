-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar especialidades
INSERT INTO especialidades (nombre, descripcion) VALUES 
    ('Fisioterapia', 'Rehabilitación física y terapias de recuperación'),
    ('Entrenamiento Personalizado', 'Programas de ejercicio y acondicionamiento físico personalizado'),
    ('Odontología', 'Salud bucal, tratamientos dentales y estética dental'),
    ('Podología', 'Cuidado y tratamiento de pies y uñas'),
    ('Medicina General', 'Consultas médicas generales y chequeos'),
    ('Cirugía', 'Procedimientos quirúrgicos diversos');

-- Insertar especialistas
INSERT INTO especialistas (nombre, apellido_paterno, apellido_materno, especialidad_id, cedula_profesional, telefono, email) VALUES 
    ('Kareld', 'Palencia', 'Brito', 1, '1225082', '5551234567', 'kareld.pb@clinicawenka.com'),
    ('Victor', 'Palencia', 'López', 2, '1703711', '5552345678', 'vicpal@clinicawenka.com'),
    ('Karina', 'Zaragoza', 'Bucio', 3, '7526834', '5553456789', 'karina.zb@clinicawenka.com'),
    ('Wendy', 'Jaramillo', 'Solis', 4, '3003491', '5554567890', 'wenjari@clinicawenka.com'),
    ('Emiliano', 'Hernández', 'Jaramillo', 5, '1612067', '5555678901', 'emiliano.hj@clinicawenka.com'),
    ('José', 'Hernández', 'Ramírez', 6, '2003478', '5556789012', 'jose.hr@clinicawenka.com');

-- Insertar pacientes de ejemplo
INSERT INTO pacientes (nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, telefono, email, direccion, ciudad, codigo_postal, tipo_sangre, contacto_emergencia_nombre, contacto_emergencia_telefono) VALUES 
    ('Juan', 'Pérez', 'Ramírez', '1985-03-15', 'M', '5559876543', 'juan.perez@email.com', 'Av. Insurgentes 123', 'Ciudad de México', '06700', 'O+', 'María Pérez', '5559876544'),
    ('Laura', 'García', 'Mendoza', '1992-07-22', 'F', '5558765432', 'laura.garcia@email.com', 'Calle Reforma 456', 'Ciudad de México', '06600', 'A+', 'Pedro García', '5558765433'),
    ('Miguel', 'Torres', 'Silva', '1978-11-08', 'M', '5557654321', 'miguel.torres@email.com', 'Blvd. Central 789', 'Ciudad de México', '06500', 'B+', 'Ana Torres', '5557654322'),
    ('Sofía', 'Hernández', 'Cruz', '1995-05-30', 'F', '5556543210', 'sofia.hernandez@email.com', 'Calle Norte 321', 'Ciudad de México', '06400', 'AB+', 'Luis Hernández', '5556543211'),
    ('Diego', 'Morales', 'Vargas', '1988-09-12', 'M', '5555432109', 'diego.morales@email.com', 'Av. Sur 654', 'Ciudad de México', '06300', 'O-', 'Carmen Morales', '5555432110');

-- Insertar tratamientos
INSERT INTO tratamientos (especialidad_id, nombre, descripcion, costo, duracion_estimada_minutos) VALUES 
    -- Fisioterapia
    (1, 'Terapia de Rehabilitación', 'Sesión de rehabilitación física post-lesión', 450.00, 60),
    (1, 'Masaje Terapéutico', 'Masaje para alivio de tensión muscular', 350.00, 45),
    (1, 'Electroterapia', 'Terapia con corrientes eléctricas', 400.00, 30),
    -- Entrenamiento Personalizado
    (2, 'Sesión de Entrenamiento Personal', 'Entrenamiento personalizado 1 a 1', 500.00, 60),
    (2, 'Evaluación Física Inicial', 'Evaluación completa de condición física', 300.00, 45),
    (2, 'Plan Nutricional', 'Diseño de plan nutricional personalizado', 800.00, 60),
    -- Odontología
    (3, 'Limpieza Dental', 'Profilaxis y limpieza profesional', 600.00, 45),
    (3, 'Extracción Dental', 'Extracción de pieza dental', 800.00, 30),
    (3, 'Blanqueamiento Dental', 'Tratamiento de blanqueamiento profesional', 2500.00, 90),
    (3, 'Resina Dental', 'Restauración con resina', 700.00, 60),
    -- Podología
    (4, 'Tratamiento de Uñas Encarnadas', 'Corrección de uñas encarnadas', 500.00, 30),
    (4, 'Quiropodia', 'Limpieza y cuidado profesional de pies', 350.00, 45),
    (4, 'Tratamiento de Callos', 'Eliminación de callos y durezas', 400.00, 30),
    -- Medicina General
    (5, 'Consulta General', 'Consulta médica general', 400.00, 30),
    (5, 'Chequeo Médico Completo', 'Revisión médica completa con estudios', 1200.00, 60),
    (5, 'Certificado Médico', 'Expedición de certificado médico', 250.00, 20),
    -- Cirugía
    (6, 'Cirugía Menor', 'Procedimientos quirúrgicos menores', 3500.00, 60),
    (6, 'Cirugía de Extirpación', 'Extirpación de quistes o lipomas', 5000.00, 90),
    (6, 'Consulta Pre-quirúrgica', 'Evaluación antes de cirugía', 500.00, 45);

-- Insertar citas de ejemplo
INSERT INTO citas (paciente_id, especialista_id, tratamiento_id, fecha_hora, motivo, estado) VALUES 
    (1, 1, 1, '2025-11-05 10:00:00', 'Rehabilitación de rodilla', 'completada'),
    (2, 3, 7, '2025-11-06 15:00:00', 'Limpieza dental de rutina', 'programada'),
    (3, 5, 14, '2025-11-07 09:00:00', 'Consulta por gripe', 'programada'),
    (4, 2, 4, '2025-11-08 16:00:00', 'Inicio de entrenamiento personalizado', 'confirmada'),
    (5, 4, 11, '2025-11-09 11:00:00', 'Tratamiento de uña encarnada', 'programada');

-- Insertar historial clínico
INSERT INTO historial_clinico (cita_id, paciente_id, especialista_id, motivo_consulta, sintomas, diagnostico, tratamiento_aplicado, indicaciones, observaciones) VALUES 
    (1, 1, 1, 'Rehabilitación de rodilla post-operatoria', 'Dolor leve, movilidad limitada', 'Recuperación post-operatoria progresiva', 'Ejercicios de fortalecimiento y terapia manual', 'Continuar con ejercicios en casa 3 veces por semana', 'Paciente muestra buena evolución');

-- Insertar pagos
INSERT INTO pagos (cita_id, paciente_id, monto, metodo_pago, estado, referencia) VALUES 
    (1, 1, 450.00, 'tarjeta_debito', 'pagado', 'TRX-2025-001'),
    (2, 2, 600.00, 'efectivo', 'pendiente', NULL),
    (4, 4, 500.00, 'transferencia', 'pagado', 'TRANS-2025-003');

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista: Agenda completa con información detallada
CREATE VIEW vista_agenda_completa AS
SELECT 
    c.id as cita_id,
    c.fecha_hora,
    c.estado,
    p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente,
    p.telefono as telefono_paciente,
    e.nombre || ' ' || e.apellido_paterno as especialista,
    esp.nombre as especialidad,
    t.nombre as tratamiento,
    t.costo,
    c.motivo
FROM citas c
JOIN pacientes p ON c.paciente_id = p.id
JOIN especialistas e ON c.especialista_id = e.id
JOIN especialidades esp ON e.especialidad_id = esp.id
JOIN tratamientos t ON c.tratamiento_id = t.id
ORDER BY c.fecha_hora;

-- Vista: Historial completo de pacientes
CREATE VIEW vista_historial_pacientes AS
SELECT 
    p.id as paciente_id,
    p.nombre || ' ' || p.apellido_paterno || ' ' || COALESCE(p.apellido_materno, '') as paciente,
    h.fecha_consulta,
    e.nombre || ' ' || e.apellido_paterno as especialista,
    esp.nombre as especialidad,
    h.diagnostico,
    h.tratamiento_aplicado
FROM historial_clinico h
JOIN pacientes p ON h.paciente_id = p.id
JOIN especialistas e ON h.especialista_id = e.id
JOIN especialidades esp ON e.especialidad_id = esp.id
ORDER BY h.fecha_consulta DESC;

-- Vista: Estado de pagos
CREATE VIEW vista_estado_pagos AS
SELECT 
    pag.id as pago_id,
    p.nombre || ' ' || p.apellido_paterno as paciente,
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