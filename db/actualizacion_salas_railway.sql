-- Ejecutar en la base de datos railway existente; conserva peliculas, usuarios y reservas.
CREATE TABLE IF NOT EXISTS salas (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(60) NOT NULL UNIQUE,
  filas INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- Migración conservadora: la Sala 1 ya existe en el teléfono con 15 filas x 5 asientos.
INSERT INTO salas (nombre, filas) VALUES ('SALA 1', 15)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);
