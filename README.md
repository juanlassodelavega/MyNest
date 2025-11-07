# MyNest 🐾

**MyNest** es una red social para dueños de mascotas. Permite a los usuarios registrarse, iniciar sesión y marcar en un mapa la ubicación de sus mascotas favoritas, compartirlas y llevar un registro de ellas.  

El proyecto está desarrollado con **React, TypeScript y Firebase**, y utiliza **Leaflet** para los mapas interactivos.

---

## 🚀 Características

- Registro e inicio de sesión con Firebase Authentication.
- Dashboard con mapa interactivo de Leaflet.
- Añadir ubicaciones de mascotas haciendo clic en el mapa.
- Listado de mascotas con coordenadas.
- Responsive y moderno, compatible con dark/light mode.
- Navegación sencilla entre Home, Login, Signup y Dashboard.

---

## 🛠 Tecnologías

- **Frontend:** React + TypeScript + Vite  
- **Autenticación:** Firebase Auth  
- **Base de datos:** Firebase Firestore (opcional para persistencia)  
- **Mapas:** Leaflet + React-Leaflet  
- **Estilos:** CSS moderno con soporte dark/light mode  

---

## 💻 Instalación

1. Clonar el repositorio:

git clone https://github.com/tu-usuario/MyNest.git
cd MyNest

2. Instalar dependencias:

npm install

3. Configurar Firebase:

- Crea un proyecto en [Firebase](https://firebase.google.com/).  
- Copia tu configuración en `src/firebase.ts`.

4. Ejecutar la aplicación:

npm run dev

Abre tu navegador en `http://localhost:5173`.

---

## 📂 Estructura de carpetas

src/
 ├─ components/      # Componentes reutilizables (Map, Header, etc.)
 ├─ features/
 │    ├─ dashboard/  # Dashboard con mapa y lista de mascotas
 │    ├─ login/      # Pantalla de login
 │    ├─ signup/     # Pantalla de registro
 │    └─ home/       # Pantalla de inicio
 ├─ firebase.ts      # Configuración de Firebase
 ├─ App.tsx          # Componente principal con rutas
 └─ index.css        # Estilos globales

---

## 🎯 Próximos pasos

- Guardar mascotas en Firebase Firestore para persistencia.  
- Perfil de usuario con foto y detalles de mascotas.  
- Funcionalidades sociales: comentar o dar “me gusta” a mascotas de otros usuarios.  

---

## ⚡ Autor

Juan Lasso de la Vega – [GitHub](https://github.com/juanlassodelavega)
Miguel Lasso de la Vega – [GitHub](https://github.com/)

---

> ¡Disfruta cuidando y compartiendo tus mascotas con MyNest! 🐶🐱
