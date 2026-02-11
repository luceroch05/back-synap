-- ============================================
-- ACTUALIZAR CONTRASEÑAS DE USUARIOS
-- Hash correcto para contraseña: admin123
-- ============================================

USE synap;

-- Actualizar contraseñas de todos los usuarios
-- Nuevo hash generado con bcryptjs para "admin123"
UPDATE usuarios
SET contrasena = '$2b$10$T0c6U9VC0lWfgq6TAueM8OKS6zetumcQZLileSPZI2hhkPjbzQBh2'
WHERE usuario IN ('admin', 'admision', 'mgarcia');

-- Verificar que se actualizaron correctamente
SELECT
    id,
    nombres,
    apellidos,
    usuario,
    correo,
    rol_id,
    activo
FROM usuarios
WHERE usuario IN ('admin', 'admision', 'mgarcia');
