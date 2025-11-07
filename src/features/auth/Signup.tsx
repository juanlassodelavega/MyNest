import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const pageStyle = { height: "100%", flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "16px", boxSizing: "border-box" as const };
  const containerStyle = { width: "100%", maxWidth: 400, padding: 32, borderRadius: 8, border: "1px solid #ddd", backgroundColor: "#1a1a1a", color: "#fff", boxSizing: "border-box" as const };
  const inputStyle = { width: "100%", padding: 8, marginBottom: 12, borderRadius: 4, border: "1px solid #ccc", boxSizing: "border-box" as const };
  const buttonStyle = { width: "100%", padding: 10, backgroundColor: "#2196F3", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={{ textAlign: "center", marginBottom: 16 }}>Registro</h1>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
        <button onClick={handleSignup} style={buttonStyle}>Registrarse</button>
        <p style={{ textAlign: "center", marginTop: 12 }}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ color: "#4CAF50" }}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
