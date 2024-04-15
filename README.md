# Weiki- Repositorio de Web Online

Este repositorio contiene el código del backend y el frontend de la aplicación web Wiki. Aquí encontrarás instrucciones sobre cómo clonar el proyecto, configurar la base de datos MongoDB, e iniciar el servidor y el frontend.


## Clonar el proyecto

Para clonar el proyecto, puedes usar el siguiente comando en tu terminal:

git clone https://github.com/JustKillu/WebWiki

## Configurar la base de datos MongoDB

Este proyecto utiliza MongoDB como base de datos. Para configurar MongoDB, sigue estos pasos:

1. Instala MongoDB en tu máquina local o configura una base de datos MongoDB en la nube.
2. Crea una base de datos llamada 'Weiki'.
3. En el archivo principal del servidor, asegúrate de que la cadena de conexión a MongoDB apunta a tu base de datos MongoDB.

## Iniciar el servidor backend

Para iniciar el servidor, navega hasta la carpeta del servidor en tu terminal y ejecuta el siguiente comando:

\`\`\`
node servidor.js
\`\`\`

El servidor debería comenzar a ejecutarse en `http://localhost:3001`.

## Iniciar el frontend de desarrolo

Para iniciar el frontend, navega hasta la carpeta del frontend en tu terminal y ejecuta el siguiente comando:

\`\`\`
npm run dev
\`\`\`

El frontend debería comenzar a ejecutarse en `http://localhost:5173`.

## Servidor para probar la PWA

Para iniciar este servidor , se tiene que acceder a la carpeta de frontend en tu terminal y ejecutas los siguientes comandos

Este comando sera para "buildear" el proyecto y poder servirlo con server:
\`\`\`
npm run build
\`\`\`


Para servir nuestro proyecto tenemos que usar el siguiente comando:

\`\`\`
serve -s dist
\`\`\`
"dist" es la carpeta donde se esta buildeando nuestro server si la tuya es diferente deberas cambiarlo

El servidor debería comenzar a ejecutarse de manera local  `http://localhost:3000 `.
El servidor debería comenzar a ejecutarse de manera Network  `http://192.168.0.100:3000`

Si el servidor de localhost no se muestra actualizado hay que borrar el cache del navegador! 

# Nota

Crer un .env en la carpeta del backend donde ira l url de la DB de mongodb

# Frontend del repositorio de web online

Este es el frontend de mi aplicación web online. Aquí encontrarás información sobre las rutas y componentes disponibles.

## Archivo principal de React (App.jsx)

El archivo principal de React (App.jsx) es el punto de entrada de la aplicación. Este archivo define las rutas de la aplicación y los componentes que se renderizan en cada ruta.

### Rutas disponibles

- `/`: La ruta raíz de la aplicación que renderiza el componente `LandingPage`.
- `/login`: La ruta para el inicio de sesión de usuarios que renderiza el componente `Login`.
- `/register`: La ruta para el registro de usuarios que renderiza el componente `Register`.
- `/admin`: La ruta para la página de administración que renderiza el componente `AdminPage`. Esta ruta está autenticada y solo es accesible para usuarios con el rol de 'adm'.
- `/wiki`: La ruta para la página de entrada de la wiki que renderiza el componente `WikiEntry`. Esta ruta está autenticada.
- `/entry/:id`: La ruta para los detalles de la entrada que renderiza el componente `EntryDetail`. Esta ruta está autenticada.
- `/unauthorized`: La ruta para la página de acceso no autorizado que renderiza el componente `Unauthorized`.
- `/formulario/:id`: Esta ruta lleva a una entrada de formularios . Los usuarios pueden ver las peticiones subidas por otros usuarios. 
-`/peticion`: Esta ruta lleva a la página de petición. Aquí, los usuarios pueden hacer peticiones para subir articulos.
-`/trivia`: Esta ruta lleva a la página de trivia. Los usuarios pueden jugar a un juego de trivia aquí.

### Componentes

1. `LandingPage.jsx`: Este es el componente de la página de inicio.
2. `Login.jsx`: Este componente se utiliza para el inicio de sesión de los usuarios.
3. `Register.jsx`: Este componente se utiliza para el registro de los usuarios.
4. `AdminPage.jsx`: Este componente se utiliza para la página de administración.
5. `WikiEntry.jsx`: Este componente se utiliza para la página de entrada de la wiki.
6. `EntryDetail.jsx`: Este componente se utiliza para los detalles de la entrada.
7. `NavBar.jsx`: Este componente se utiliza para la barra de navegación.
8. `Unauthorized.jsx`: Este componente se utiliza para la página de acceso no autorizado.
9. `triv.jsx`: Componente para la trivia

# Backend del repositorio de web online

Este es el backend de mi aplicación web online. Información sobre las rutas y funcionalidades disponibles.

## Archivo principal del servidor

El archivo principal para correr el servidor es un archivo Node.js que utiliza Express y se conecta a una base de datos MongoDB. Este archivo inicializa la aplicación Express, permite solicitudes CORS desde tu aplicación React, usa express.json() como middleware para analizar el cuerpo de las solicitudes JSON, se conecta a MongoDB y define las rutas de la aplicación.

## Modelo de usuario

1. `User`: Este es el modelo de usuario que define el esquema para los usuarios en la base de datos. Cada usuario tiene un nombre de usuario, contraseña,correo electrónico, rol. El modelo de usuario también incluye una función pre-save para hashear la contraseña antes de guardarla en la base de datos.

2. `WikiEntry.js`: Este es el modelo de publicaciones de la wiki.

3. `peticion.js`: Este es el modelo de las peticiones para subir articulos

## Rutas de autenticación (Auth routes)

1. `POST /register`: Esta ruta permite a los usuarios registrarse. Si el nombre de usuario, la contraseña y el correo electrónico son válidos, se crea un nuevo usuario en la base de datos.

2. `POST /login`: Esta ruta permite a los usuarios iniciar sesión. Si el nombre de usuario y la contraseña son correctos, se genera un token JWT que incluye el ID y el rol del usuario.

3. `GET /user/:id`: Esta ruta permite obtener los detalles de un usuario específico utilizando su ID.

4. `GET /allusers`: Esta ruta permite obtener todos los usuarios. Sin embargo, solo los usuarios con el rol de 'adm' pueden acceder a esta ruta.

## Rutas de la Wiki (Wiki routes)

1. `POST /entry`: Esta ruta permite a los usuarios crear una nueva entrada en la wiki. Si el título y el contenido son válidos, se crea una nueva entrada en la base de datos. También se puede subir una imagen con la entrada.

2. `GET /entries`: Esta ruta permite obtener todas las entradas de la wiki.

3. `GET /entry/:id`: Esta ruta permite obtener los detalles de una entrada específica utilizando su ID.

4. `PUT /entry/:id`: Esta ruta permite actualizar los detalles de una entrada. Si se proporciona una imagen, se guarda en la base de datos junto con el título y el contenido actualizados.

5. `DELETE /entry/:id`: Esta ruta permite eliminar una entrada utilizando su ID.

6. `POST /entry/:id/comment`: Esta ruta permite a los usuarios agregar un comentario a una entrada específica. Se requiere un nombre de usuario y contenido para el comentario.

7. `DELETE /entry/:id/comment/:commentId`: Esta ruta permite eliminar un comentario de una entrada específica utilizando el ID del comentario.

## Rutas de peticion (peticionRoutes)

1. `POST /formulario`: Esta ruta permite a los usuarios crear un nuevo formulario. Si los datos son válidos, se crea un nuevo formulario en la base de datos.

2. `PUT /formulario/:id`: Esta ruta permite actualizar los detalles de un formulario específico utilizando su ID. Si se proporcionan datos válidos, se actualizan en la base de datos.

3. `DELETE /formulario/:id`: Esta ruta permite eliminar un formulario utilizando su ID.

4. `GET /formulario`: Esta ruta permite obtener todos los formularios.

5. `GET /admin`: Esta ruta permite obtener acceso al panel de administración.

6. `DELETE /formulario/:id/comment/:commentId`: Esta ruta permite eliminar un comentario de un formulario específico utilizando el ID del comentario.

7. `POST /formulario/:id/comment`: Esta ruta permite a los usuarios agregar un comentario a un formulario específico. Se requiere un nombre de usuario y contenido para el comentario.

8. `GET /formulario/:id`: Esta ruta permite obtener los detalles de un formulario específico utilizando su ID.
