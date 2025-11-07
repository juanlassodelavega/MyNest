import { useState } from "react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !password || !age) {
      alert("Por favor completa todos los campos");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar info adicional en Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email: user.email,
        age: Number(age),
      });

      alert("Usuario registrado correctamente!");
      navigate("/dashboard"); // redirigir al dashboard después del signup
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <main style={{ padding: 32, maxWidth: 400, margin: "0 auto" }}>
      <h1>Registro</h1>

      <input
        type="text"
        placeholder="Nombre"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        style={{ display: "block", marginBottom: 8, width: "100%" }}
      />

      <input
        type="text"
        placeholder="Apellidos"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        style={{ display: "block", marginBottom: 8, width: "100%" }}
      />

      <input
        type="number"
        placeholder="Edad"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
        style={{ display: "block", marginBottom: 8, width: "100%" }}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: 8, width: "100%" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: 8, width: "100%" }}
      />

      <button onClick={handleSignup} style={{ width: "100%" }}>Registrarse</button>
    </main>
  );
}
