Watchalo API REST

API REST desarrollada con Node.js, Express y MySQL para la aplicación móvil Wáchalo, correspondiente al Desafío Práctico 3.

Tecnologías utilizadas

Node.js

Express

MySQL

Railway

Git y GitHub

Funcionalidades

Consultar, agregar, editar y eliminar películas.

Registrar y administrar salas de cine.

Registrar compras y reservas de boletos.

Consultar asientos ocupados.

Validar boletos mediante códigos QR.

Proteger películas y salas que tengan reservas asociadas.

Instalación

1. Clonar el repositorio

git clone https://github.com/ferglou188916-del/watchalo-api.git
cd watchalo-api

2. Instalar dependencias

npm install

3. Configurar variables de entorno

Copiar .env.example como .env y modificar los valores según la instalación local de MySQL.

4. Preparar la base de datos

Crear una base de datos llamada cine y ejecutar, en este orden:

db/database.railway.sql

db/actualizacion_salas_railway.sql

Estos archivos contienen la estructura y los datos iniciales necesarios para utilizar la API.

5. Iniciar el servidor

npm start

El servidor se ejecutará en:

http://localhost:3000

Endpoints principales

Método

Endpoint

Descripción

GET

/peliculas

Consultar películas

POST

/peliculas

Registrar película

PUT

/peliculas/:id

Actualizar película

DELETE

/peliculas/:id

Eliminar película

GET

/salas

Consultar salas

POST

/salas

Registrar sala

GET

/reservas

Consultar reservas

POST

/reservas

Registrar compra

PUT

/reservas/:codigo/validar

Validar boleto

API desplegada

La API también está disponible públicamente en Railway:

https://watchalo-api-production-8d5a.up.railway.app

Para consultar las películas:

https://watchalo-api-production-8d5a.up.railway.app/peliculas

Aplicación móvil

El frontend está desarrollado con React Native y Expo. Utiliza esta API para almacenar y consultar películas, salas, compras y boletos.

La aplicación también incorpora notificaciones locales mediante expo-notifications.

Consideraciones

Las credenciales de base de datos no se incluyen en el repositorio.

Las variables privadas se configuran mediante .env.

Railway debe permanecer disponible para utilizar la API pública.

Las películas o salas que tienen reservas asociadas están protegidas contra eliminaciones que comprometan el historial.
