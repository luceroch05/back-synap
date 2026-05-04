-- =====================================================
-- Script: Inserts Iniciales para SYNAP
-- Descripción: Datos iniciales del sistema
-- =====================================================

USE synap;

-- =====================================================
-- 1. ROLES
-- =====================================================
INSERT INTO roles (nombre, descripcion) VALUES
('Administrador', 'Control total del sistema'),
('Admisión', 'Gestión de inscripciones y emisión de certificados');

-- =====================================================
-- 2. USUARIOS DE PRUEBA
-- Contraseña para ambos: admin123
-- Hash generado con bcryptjs (10 rounds)
-- =====================================================
INSERT INTO usuarios (nombres, apellidos, correo, usuario, contrasena, rol_id, activo) VALUES
('Administrador', 'Sistema', 'admin@synap.com', 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 1, 1),
('Usuario', 'Admisión', 'admision@synap.com', 'admision', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 2, 1);

-- =====================================================
-- 3. TIPOS DE PROGRAMA
-- =====================================================
INSERT INTO tipos_programa (nombre, descripcion, activo) VALUES
('Diplomado', 'Programa de especialización de larga duración', 1),
('Curso', 'Programa de capacitación de corta duración', 1),
('Taller', 'Programa práctico de corta duración', 1),
('Seminario', 'Programa de actualización profesional', 1),
('Certificación', 'Programa con certificación profesional', 1);

-- =====================================================
-- 4. ESTADOS DE INSCRIPCIÓN
-- =====================================================
INSERT INTO estado_inscripcion (nombre, descripcion) VALUES
('Inscrito', 'Participante inscrito en el programa'),
('Aprobado', 'Participante aprobó el programa'),
('Retirado', 'Participante se retiró del programa'),
('Rechazado', 'Inscripción rechazada por admisión'),
('En Proceso', 'Participante cursando el programa');

-- =====================================================
-- 5. ESTADOS DE CERTIFICADO
-- =====================================================
INSERT INTO estado_certificado (nombre, descripcion) VALUES
('Válido', 'Certificado válido y vigente'),
('Anulado', 'Certificado anulado por motivos administrativos');

-- =====================================================
-- 6. VERIFICAR INSERTS
-- =====================================================
SELECT 'ROLES' as Tabla, COUNT(*) as Total FROM roles
UNION ALL
SELECT 'USUARIOS', COUNT(*) FROM usuarios
UNION ALL
SELECT 'TIPOS_PROGRAMA', COUNT(*) FROM tipos_programa
UNION ALL
SELECT 'ESTADO_INSCRIPCION', COUNT(*) FROM estado_inscripcion
UNION ALL
SELECT 'ESTADO_CERTIFICADO', COUNT(*) FROM estado_certificado;

-- =====================================================
-- 7. DATOS DE EJEMPLO (OPCIONAL)
-- =====================================================

-- Programa de ejemplo
INSERT INTO programas (tipo_programa_id, nombre, descripcion, horas_academicas, activo, user_crea_id) VALUES
(1, 'Diplomado en Marketing Digital', 'Programa completo de especialización en marketing digital y redes sociales', 120, 1, 1),
(2, 'Curso de Excel Avanzado', 'Domina Excel con funciones avanzadas, macros y análisis de datos', 40, 1, 1),
(3, 'Taller de Gestión de Proyectos', 'Fundamentos de gestión de proyectos con metodologías ágiles', 24, 1, 1);

-- Grupo de ejemplo
INSERT INTO grupos_programas (programa_id, nombre_grupo, fecha_inicio, fecha_fin, modalidad, activo, user_crea_id) VALUES
(1, 'Grupo A - 2024-I', '2024-01-15', '2024-03-15', 'PRESENCIAL', 1, 1),
(1, 'Grupo B - 2024-I', '2024-01-20', '2024-03-20', 'VIRTUAL', 1, 1),
(2, 'Grupo Único - Enero 2024', '2024-01-10', '2024-02-10', 'MIXTA', 1, 1);

-- Participantes de ejemplo
INSERT INTO participantes (tipo_documento, numero_documento, nombres, apellidos, email, telefono, activo, user_crea_id) VALUES
('DNI', '12345678', 'Juan Carlos', 'Pérez García', 'juan.perez@email.com', '987654321', 1, 1),
('DNI', '87654321', 'María Elena', 'López Ramírez', 'maria.lopez@email.com', '987654322', 1, 1),
('DNI', '11223344', 'Pedro Luis', 'Gonzales Torres', 'pedro.gonzales@email.com', '987654323', 1, 1);

-- Inscripciones de ejemplo
INSERT INTO inscripciones (participante_id, grupo_id, estado_id, fecha_inscripcion, user_crea_id) VALUES
(1, 1, 2, '2024-01-10', 1),  -- Juan - Aprobado
(2, 1, 2, '2024-01-11', 1),  -- María - Aprobado
(3, 2, 1, '2024-01-15', 1);  -- Pedro - Inscrito

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================

SELECT '✅ Script ejecutado correctamente' as Mensaje;
