# KonectaBackend

## Requisitos de instalación

### 1. Clonar el repositorio

Clona el repositorio con el siguiente comando:

```bash
git clone https://github.com/jako12287/konectaBackend.git

```
### Navega hasta la carpeta del proyecto

cd konectaBackend

### Instalacion de las dependencias necesarias para el proyecto

npm install

### Configurar Docker Desktop
Puedes descargarlo aca https://www.docker.com/products/docker-desktop/

### Copiar el archivo .env

En la raiz del proyecto copiar el archivo .env proporcionado 

### Levantar los contenedores con Docker Compose

docker-compose up --build

Una vez que Docker haya levantado los contenedores, se podra acceder a la API en el siguiente endpoint

http://localhost:3000


### Usuario en BD

La base de datos de Docker ya tiene un usuario administrador creado con los siguientes datos:

Email: konecta@gmail.com
Contraseña: 123456

Mejoras y Prácticas

* Se usa docker para que el entorno de desarrollo sea consistente y se pueda usar en cualquier maquina de manera sencilla y evitar conflictos

* Los volumenes de docker se configuraron para tener persistencia de datos en la bd

* Se configura el archivo .env para tener mayor seguridad ya que son datos sensibles y no pueden ir en el codigo fuente en el repositorio


Seguridad

* Las contraseñas se incriptan usuando bcryptjs para guardarlas en la bd

* Se usa JWT para generar token y autenticar los usuarios segun sus roles lo que les perimite hacer las consultas destinadas para cada uno

* Con Docker se aisla el entorno de ejecucion para mejorar la seguridad y evitar conflictos con dependencias


Decidi usar la base de datos con postgreSQL para una mayor seguridad de los datos y me asegure de usar sequelize para evitar la inyeccion de codigo sql y proteger la informacion, todas las rutas creadas fueron pensadas segun el uso que tiene en el frontend.

Gracias por tomarte el tiempo de leer este Readme y probar mi codigo 