# MyNest 🐾

**MyNest** es una red social para dueños de mascotas. Permite a los usuarios registrarse, iniciar sesión, gestionar su perfil y mascotas, y marcar en un mapa las ubicaciones de sus lugares favoritos para mascotas.  

El proyecto está desarrollado con **React, TypeScript y Firebase**, y utiliza **Leaflet** para los mapas interactivos.

---

## 🚀 Características

- Registro e inicio de sesión con Firebase Authentication.
- Perfil de usuario con edición de datos y cambio de contraseña.
- Gestión de mascotas: añadir, editar y eliminar.
- Dashboard con mapa interactivo de Leaflet para marcar ubicaciones.
- Navegación protegida con rutas privadas (`PrivateRoute`) para usuarios autenticados.
- Listado de mascotas con información detallada y edad calculada automáticamente.
- Responsive y moderno, compatible con dark/light mode.
- Navegación sencilla entre Home, Login, Signup, Dashboard y Profile.

---

## 🛠 Tecnologías

- **Frontend:** React + TypeScript + Vite  
- **Autenticación:** Firebase Auth  
- **Base de datos:** Firebase Firestore  
- **Mapas:** Leaflet + React-Leaflet  
- **Estilos:** CSS moderno con soporte dark/light mode  
- **Otros:** React Router v7, React Icons, React Firebase Hooks  

---

## 💻 Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/MyNest.git
```
cd MyNest

2. Instalar dependencias:

npm install

3. Configurar Firebase:

- Crea un proyecto en [Firebase](https://firebase.google.com/).  
- Copia tu configuración en `src/firebase.ts` usando variables de entorno.

4. Ejecutar la aplicación:

npm run dev

Abre tu navegador en `http://localhost:5173`.

---

## 🌱 Variables de entorno

Crea un archivo `.env` o `.env.local` en la raíz del proyecto con las siguientes variables:

VITE_FIREBASE_API_KEY=tu_api_key  
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain  
VITE_FIREBASE_PROJECT_ID=tu_project_id  
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket  
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id  
VITE_FIREBASE_APP_ID=tu_app_id  

Estas variables son usadas en `src/firebase.ts` para inicializar Firebase de forma segura.

---

## ⚡ Autores

Juan Lasso de la Vega – [GitHub](https://github.com/juanlassodelavega)  
Miguel Lasso de la Vega – [GitHub](https://github.com/)

---

> ¡Disfruta cuidando y compartiendo tus mascotas con MyNest! 🐶🐱
