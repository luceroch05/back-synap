-- ============================================
-- SETUP INICIAL - SISTEMA SYNAP
-- ============================================

USE synap;

-- ============================================
-- 1. AGREGAR COLUMNA 'usuario' A LA TABLA
-- ============================================

ALTER TABLE usuarios
ADD COLUMN usuario VARCHAR(50) UNIQUE NOT NULL AFTER apellidos;

-- ============================================
-- 2. INSERTAR ROLES
-- ============================================

INSERT INTO roles (nombre, descripcion) VALUES
('Administrador', 'Acceso completo al sistema. Puede gestionar usuarios, programas, certificados y configuración.'),
('Admisión', 'Gestiona participantes, inscripciones y emite certificados. No puede modificar configuración del sistema.');

-- ============================================
-- 3. INSERTAR USUARIOS DE PRUEBA
-- Contraseña para todos: admin123
-- ============================================

INSERT INTO usuarios (nombres, apellidos, usuario, correo, contrasena, rol_id, activo) VALUES
('Administrador', 'Sistema', 'admin', 'admin@synap.com', '$2a$10$K7L1OJ45/4Y2nIoB3Py9c.hOBZLf9h8Bk5bhQYhGw2Lq.P0SHPfAm', 1, 1),
('Usuario', 'Admisión', 'admision', 'admision@synap.com', '$2a$10$K7L1OJ45/4Y2nIoB3Py9c.hOBZLf9h8Bk5bhQYhGw2Lq.P0SHPfAm', 2, 1),
('María', 'García', 'mgarcia', 'maria.garcia@synap.com', '$2a$10$K7L1OJ45/4Y2nIoB3Py9c.hOBZLf9h8Bk5bhQYhGw2Lq.P0SHPfAm', 2, 1);

-- ============================================
-- 4. VERIFICAR DATOS INSERTADOS
-- ============================================

SELECT
    u.id,
    u.nombres,
    u.apellidos,
    u.usuario,
    u.correo,
    r.nombre as rol,
    u.activo,
    u.created_at
FROM usuarios u
INNER JOIN roles r ON u.rol_id = r.id
ORDER BY u.id;

-- ============================================
-- CREDENCIALES PARA HACER LOGIN
-- ============================================

/*
USUARIO 1 (Administrador):
- Usuario: admin
- Correo: admin@synap.com
- Contraseña: admin123

USUARIO 2 (Admisión):
- Usuario: admision
- Correo: admision@synap.com
- Contraseña: admin123

USUARIO 3 (Admisión):
- Usuario: mgarcia
- Correo: maria.garcia@synap.com
- Contraseña: admin123

NOTA: Puedes usar el USUARIO o el CORREO para hacer login
*/
