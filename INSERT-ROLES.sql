-- Insertar roles iniciales del sistema
INSERT INTO roles (id, nombre, descripcion) VALUES 
(1, 'Administrador', 'Control total del sistema: gestiona programas, plantillas, logos, firmas, usuarios y certificados'),
(2, 'Admisión', 'Rol operativo: registra participantes, matrículas, aprobados y emite certificados')
ON DUPLICATE KEY UPDATE 
  nombre = VALUES(nombre),
  descripcion = VALUES(descripcion);
