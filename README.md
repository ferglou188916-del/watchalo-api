# API REST Watchalo

Backend del Desafío Práctico 3. Node.js, Express y MySQL.

## Ejecución local

1. `npm install`
2. Ejecutar `db/database.sql` en MySQL.
3. Copiar `.env.example` a `.env` y editar las credenciales.
4. `npm run dev`

## Endpoints

- GET `/peliculas`
- GET `/peliculas/:id`
- POST `/peliculas`
- PUT `/peliculas/:id`
- DELETE `/peliculas/:id`
- GET `/reservas` (filtros `pelicula_id`, `funcion`, `usuario_id`)
- GET `/reservas/:id`
- POST `/reservas`
- PUT `/reservas/:codigo/validar`

En `POST /reservas`, enviar JSON con `usuario_id`, `pelicula_id`, `nombre_cliente`, `funcion` y `asientos` (arreglo de códigos como `['A1','A2']`). El servidor determina `cantidad`, `total` y `codigo`. El cliente genérico tiene ID `1`.

La reserva se protege con transacción y bloqueo por película para evitar vender dos veces el mismo asiento en una función. El servidor devuelve `409` cuando existe conflicto.

## Railway

Crear un servicio Node y una base de datos MySQL. Configurar `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` a partir de las variables de conexión MySQL de Railway. Importar `database.sql` en la base de datos. El servidor escucha `PORT` de Railway. No subir `.env`.

## Integrantes

Completar nombres y carnets antes de entregar.
