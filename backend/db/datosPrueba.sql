-- =====================================================
-- DATOS INICIALES - CLINICA WENKA
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
INSERT INTO especialistas (nombre, apellido_paterno, apellido_materno, especialidad_id, cedula_profesional, telefono, email, activo) VALUES 
    ('Kareld', 'Palencia', 'Brito', 1, '1225082', '5551234567', 'twaaari@gmail.com', TRUE),
    ('Victor', 'Palencia', 'López', 2, '1703711', '5552345678', 'ramosedwin1712@gmail.com', TRUE),
    ('Karina', 'Zaragoza', 'Bucio', 3, '7526834', '5553456789', 'ecodrave1725@gmail.com', TRUE),
    ('Wendy', 'Jaramillo', 'Solis', 4, '3003491', '5554567890', 'edwincrau@gmail.com', TRUE),
    ('Emiliano', 'Hernández', 'Jaramillo', 5, '1612067', '5555678901', 'uyo577292@gmail.com', TRUE),
    ('José', 'Hernández', 'Ramírez', 6, '2003478', '5556789012', 'ramosv.ed.3iv12@gmail.com', TRUE);

-- Insertar pacientes de ejemplo
INSERT INTO pacientes (nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, telefono, email, direccion, ciudad, codigo_postal, tipo_sangre, contacto_emergencia_nombre, contacto_emergencia_telefono) VALUES 
    ('Juan', 'Pérez', 'Ramírez', '1985-03-15', 'M', '5559876543', 'juan.perez@email.com', 'Av. Insurgentes 123', 'Ciudad de México', '06700', 'O+', 'María Pérez', '5559876544'),
    ('Laura', 'García', 'Mendoza', '1992-07-22', 'F', '5558765432', 'laura.garcia@email.com', 'Calle Reforma 456', 'Ciudad de México', '06600', 'A+', 'Pedro García', '5558765433'),
    ('Miguel', 'Torres', 'Silva', '1978-11-08', 'M', '5557654321', 'miguel.torres@email.com', 'Blvd. Central 789', 'Ciudad de México', '06500', 'B+', 'Ana Torres', '5557654322'),
    ('Sofía', 'Hernández', 'Cruz', '1995-05-30', 'F', '5556543210', 'sofia.hernandez@email.com', 'Calle Norte 321', 'Ciudad de México', '06400', 'AB+', 'Luis Hernández', '5556543211'),
    ('Diego', 'Morales', 'Vargas', '1988-09-12', 'M', '5555432109', 'diego.morales@email.com', 'Av. Sur 654', 'Ciudad de México', '06300', 'O-', 'Carmen Morales', '5555432110');

-- Insertar tratamientos
INSERT INTO tratamientos (especialidad_id, nombre, descripcion, costo, duracion_estimada_minutos, activo) VALUES 
    -- Fisioterapia
    (1, 'Terapia de Rehabilitación', 'Sesión de rehabilitación física post-lesión', 450.00, 60, TRUE),
    (1, 'Masaje Terapéutico', 'Masaje para alivio de tensión muscular', 350.00, 45, TRUE),
    (1, 'Electroterapia', 'Terapia con corrientes eléctricas', 400.00, 30, TRUE),
    -- Entrenamiento Personalizado
    (2, 'Sesión de Entrenamiento Personal', 'Entrenamiento personalizado 1 a 1', 500.00, 60, TRUE),
    (2, 'Evaluación Física Inicial', 'Evaluación completa de condición física', 300.00, 45, TRUE),
    (2, 'Plan Nutricional', 'Diseño de plan nutricional personalizado', 800.00, 60, TRUE),
    -- Odontología
    (3, 'Limpieza Dental', 'Profilaxis y limpieza profesional', 600.00, 45, TRUE),
    (3, 'Extracción Dental', 'Extracción de pieza dental', 800.00, 30, TRUE),
    (3, 'Blanqueamiento Dental', 'Tratamiento de blanqueamiento profesional', 2500.00, 90, TRUE),
    (3, 'Resina Dental', 'Restauración con resina', 700.00, 60, TRUE),
    -- Podología
    (4, 'Tratamiento de Uñas Encarnadas', 'Corrección de uñas encarnadas', 500.00, 30, TRUE),
    (4, 'Quiropodia', 'Limpieza y cuidado profesional de pies', 350.00, 45, TRUE),
    (4, 'Tratamiento de Callos', 'Eliminación de callos y durezas', 400.00, 30, TRUE),
    -- Medicina General
    (5, 'Consulta General', 'Consulta médica general', 400.00, 30, TRUE),
    (5, 'Chequeo Médico Completo', 'Revisión médica completa con estudios', 1200.00, 60, TRUE),
    (5, 'Certificado Médico', 'Expedición de certificado médico', 250.00, 20, TRUE),
    -- Cirugía
    (6, 'Cirugía Menor', 'Procedimientos quirúrgicos menores', 3500.00, 60, TRUE),
    (6, 'Cirugía de Extirpación', 'Extirpación de quistes o lipomas', 5000.00, 90, TRUE),
    (6, 'Consulta Pre-quirúrgica', 'Evaluación antes de cirugía', 500.00, 45, TRUE);

-- Insertar citas de ejemplo (con fechas futuras)
INSERT INTO citas (paciente_id, especialista_id, tratamiento_id, fecha_hora, duracion_minutos, motivo, estado) VALUES 
    (1, 1, 1, DATE_ADD(NOW(), INTERVAL 1 DAY), 60, 'Rehabilitación de rodilla', 'programada'),
    (2, 3, 7, DATE_ADD(NOW(), INTERVAL 2 DAY), 45, 'Limpieza dental de rutina', 'programada'),
    (3, 5, 14, DATE_ADD(NOW(), INTERVAL 3 DAY), 30, 'Consulta por gripe', 'programada'),
    (4, 2, 4, DATE_ADD(NOW(), INTERVAL 5 DAY), 60, 'Inicio de entrenamiento personalizado', 'confirmada'),
    (5, 4, 11, DATE_ADD(NOW(), INTERVAL 7 DAY), 30, 'Tratamiento de uña encarnada', 'programada');

-- Insertar historial clínico
INSERT INTO historial_clinico (cita_id, paciente_id, especialista_id, motivo_consulta, sintomas, diagnostico, tratamiento_aplicado, indicaciones, observaciones) VALUES 
    (1, 1, 1, 'Rehabilitación de rodilla post-operatoria', 'Dolor leve, movilidad limitada', 'Recuperación post-operatoria progresiva', 'Ejercicios de fortalecimiento y terapia manual', 'Continuar con ejercicios en casa 3 veces por semana', 'Paciente muestra buena evolución');

-- Insertar pagos
INSERT INTO pagos (cita_id, paciente_id, monto, metodo_pago, estado, referencia) VALUES 
    (1, 1, 450.00, 'tarjeta_debito', 'pendiente', NULL),
    (2, 2, 600.00, 'efectivo', 'pendiente', NULL),
    (4, 4, 500.00, 'transferencia', 'pendiente', NULL);

-- =====================================================
-- VISTAS ÚTILES (Sintaxis MySQL)
-- =====================================================

-- Vista: Agenda completa con información detallada
DROP VIEW IF EXISTS vista_agenda_completa;
CREATE VIEW vista_agenda_completa AS
SELECT 
    c.id as cita_id,
    c.fecha_hora,
    c.estado,
    CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', COALESCE(p.apellido_materno, '')) as paciente,
    p.telefono as telefono_paciente,
    CONCAT(e.nombre, ' ', e.apellido_paterno) as especialista,
    esp.nombre as especialidad,
    t.nombre as tratamiento,
    t.costo,
    c.motivo,
    c.duracion_minutos
FROM citas c
JOIN pacientes p ON c.paciente_id = p.id
JOIN especialistas e ON c.especialista_id = e.id
JOIN especialidades esp ON e.especialidad_id = esp.id
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
    esp.nombre as especialidad,
    h.diagnostico,
    h.tratamiento_aplicado,
    h.medicamentos_recetados,
    h.indicaciones
FROM historial_clinico h
JOIN pacientes p ON h.paciente_id = p.id
JOIN especialistas e ON h.especialista_id = e.id
JOIN especialidades esp ON e.especialidad_id = esp.id
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
    esp.nombre as especialidad,
    COUNT(CASE WHEN c.estado IN ('programada', 'confirmada', 'en_curso') THEN 1 END) as citas_activas,
    GROUP_CONCAT(DISTINCT DATE(c.fecha_hora) ORDER BY DATE(c.fecha_hora)) as fechas_ocupadas
FROM especialistas e
JOIN especialidades esp ON e.especialidad_id = esp.id
LEFT JOIN citas c ON e.id = c.especialista_id AND c.estado IN ('programada', 'confirmada', 'en_curso')
WHERE e.activo = TRUE
GROUP BY e.id, esp.nombre;

-- =====================================================
-- VERIFICACIÓN
-- =====================================================
SELECT 'Datos insertados exitosamente' as mensaje;
SELECT 'Especialidades' as tabla, COUNT(*) as total FROM especialidades
UNION ALL SELECT 'Especialistas', COUNT(*) FROM especialistas
UNION ALL SELECT 'Tratamientos', COUNT(*) FROM tratamientos
UNION ALL SELECT 'Pacientes', COUNT(*) FROM pacientes
UNION ALL SELECT 'Citas', COUNT(*) FROM citas;