// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD8U2p6Wa-j6CtLtU6xfwziClTAQsUwFWc",
  authDomain: "mynest-236fa.firebaseapp.com",
  projectId: "mynest-236fa",
  storageBucket: "mynest-236fa.appspot.com",
  messagingSenderId: "54278569543",
  appId: "1:54278569543:web:0bc529d7b308a99fa93b62"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta Auth para usarlo en componentes
export const auth = getAuth(app);
export default app;
