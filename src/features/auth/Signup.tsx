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
  const [confirmPassword, setConfirmPassword] = useState(""); // confirmación
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !password || !age || !confirmPassword) {
      alert("Por favor completa todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email: user.email,
        age: Number(age),
      });

      alert("Usuario registrado correctamente!");
      navigate("/dashboard"); 
    } catch (error: any) {
      alert(error.message);
    }
  };

  const pageStyle: React.CSSProperties = { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: 16, backgroundColor: "#1e1e2f", boxSizing: "border-box" };
  const containerStyle: React.CSSProperties = { width: "100%", maxWidth: 500, padding: 40, borderRadius: 12, backgroundColor: "#2a2a3d", boxShadow: "0 4px 12px rgba(0,0,0,0.3)", color: "#fff", display: "flex", flexDirection: "column", gap: 16 };
  const inputStyle: React.CSSProperties = { width: "100%", padding: 12, borderRadius: 8, border: "1px solid #555", backgroundColor: "#1a1a2b", color: "#fff", boxSizing: "border-box" };
  const buttonStyle: React.CSSProperties = { width: "100%", padding: 12, backgroundColor: "#4CAF50", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, marginTop: 8 };
  const linkStyle: React.CSSProperties = { color: "#2196F3", textDecoration: "none" };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={{ textAlign: "center" }}>Registro</h1>
        <input type="text" placeholder="Nombre" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} />
        <input type="text" placeholder="Apellidos" value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} />
        <input type="number" placeholder="Edad" value={age} onChange={(e) => setAge(Number(e.target.value))} style={inputStyle} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Confirmar contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} />
        <button onClick={handleSignup} style={buttonStyle}>Registrarse</button>
        <p style={{ textAlign: "center", marginTop: 8 }}>
          ¿Ya tienes cuenta? <Link to="/login" style={linkStyle}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
