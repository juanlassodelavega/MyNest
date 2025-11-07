import { useState } from "react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

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

  // Estilos iguales que en login
  const pageStyle = { 
    height: "100%", 
    flex: 1, 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    padding: "16px", 
    boxSizing: "border-box" as const 
  };
  const containerStyle = { 
    width: "100%", 
    maxWidth: 400, 
    padding: 32, 
    borderRadius: 8, 
    border: "1px solid #ddd", 
    backgroundColor: "#1a1a1a", 
    color: "#fff", 
    boxSizing: "border-box" as const 
  };
  const inputStyle = { 
    width: "100%", 
    padding: 8, 
    marginBottom: 12, 
    borderRadius: 4, 
    border: "1px solid #ccc", 
    boxSizing: "border-box" as const 
  };
  const buttonStyle = { 
    width: "100%", 
    padding: 10, 
    backgroundColor: "#4CAF50", 
    color: "#fff", 
    border: "none", 
    borderRadius: 4, 
    cursor: "pointer" 
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={{ textAlign: "center", marginBottom: 16 }}>Registro</h1>

        <input type="text" placeholder="Nombre" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} />
        <input type="text" placeholder="Apellidos" value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} />
        <input type="number" placeholder="Edad" value={age} onChange={(e) => setAge(Number(e.target.value))} style={inputStyle} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />

        <button onClick={handleSignup} style={buttonStyle}>Registrarse</button>

        <p style={{ textAlign: "center", marginTop: 12 }}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ color: "#2196F3" }}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
