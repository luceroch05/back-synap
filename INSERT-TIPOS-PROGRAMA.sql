-- Insertar tipos de programa iniciales
INSERT INTO tipos_programa (id, nombre, descripcion, activo) VALUES
(1, 'Diplomado', 'Programa de formación especializada de larga duración', 1),
(2, 'Curso', 'Programa de capacitación de duración media', 1),
(3, 'Taller', 'Programa práctico de corta duración', 1),
(4, 'Seminario', 'Programa de actualización y discusión de temas específicos', 1),
(5, 'Certificación', 'Programa que otorga certificación profesional', 1)
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  descripcion = VALUES(descripcion),
  activo = VALUES(activo);
