CREATE DATABASE IF NOT EXISTS cine CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cine;
CREATE TABLE IF NOT EXISTS usuarios (
 id INT AUTO_INCREMENT PRIMARY KEY,
 nombre VARCHAR(100) NOT NULL,
 correo VARCHAR(150) NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS peliculas (
 id INT AUTO_INCREMENT PRIMARY KEY,
 codigo VARCHAR(40) NOT NULL UNIQUE,
 nombre VARCHAR(150) NOT NULL,
 genero VARCHAR(80) NOT NULL,
 duracion INT NOT NULL,
 clasificacion VARCHAR(30) NOT NULL,
 sala VARCHAR(60) NOT NULL,
 precio DECIMAL(10,2) NOT NULL,
 estado ENUM('Disponible','No disponible') NOT NULL DEFAULT 'Disponible',
 imagenUrl TEXT NULL,
 fecha VARCHAR(10) NULL,
 hora VARCHAR(5) NULL,
 CHECK (precio >= 0),
 CHECK (duracion > 0)
);
CREATE TABLE IF NOT EXISTS reservas (
 id INT AUTO_INCREMENT PRIMARY KEY,
 codigo VARCHAR(40) NOT NULL UNIQUE,
 usuario_id INT NOT NULL,
 pelicula_id INT NOT NULL,
 nombre_cliente VARCHAR(120) NOT NULL,
 funcion VARCHAR(130) NOT NULL,
 asientos VARCHAR(500) NOT NULL,
 cantidad INT NOT NULL,
 total DECIMAL(10,2) NOT NULL,
 utilizado TINYINT(1) NOT NULL DEFAULT 0,
 fecha_compra TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
 FOREIGN KEY (pelicula_id) REFERENCES peliculas(id) ON DELETE RESTRICT
);
INSERT INTO usuarios (id,nombre,correo) VALUES (1,'Cliente Cine','cliente@watchalo.local') ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);
INSERT INTO peliculas (codigo,nombre,genero,duracion,clasificacion,sala,precio,estado,imagenUrl,fecha,hora) VALUES
('W001','Interstellar','Ciencia ficción',169,'B','Sala 1',5.50,'Disponible','','2026-10-12','18:00'),
('W002','Coco','Animación',105,'A','Sala 2',4.00,'Disponible','','2026-10-12','16:00'),
('W003','Dune: Parte Dos','Ciencia ficción',166,'B','Sala 3',6.00,'Disponible','','2026-10-12','19:00'),
('W004','Intensamente 2','Animación',96,'A','Sala 4',4.50,'Disponible','','2026-10-12','15:00'),
('W005','El origen','Acción',148,'B','Sala 5',5.00,'Disponible','','2026-10-12','20:00')
ON DUPLICATE KEY UPDATE codigo=VALUES(codigo);
