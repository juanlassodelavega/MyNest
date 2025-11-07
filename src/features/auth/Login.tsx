import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error: any) {
      alert(error.message);
    }
  };

  // ---------- Estilos ----------
  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1e1e2f",
    boxSizing: "border-box",
  };

  const containerStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 500,
    padding: 40,
    borderRadius: 12,
    backgroundColor: "#2a2a3d",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #555",
    backgroundColor: "#1a1a2b",
    color: "#fff",
    boxSizing: "border-box",
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    padding: 12,
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    marginTop: 8,
  };

  const linkStyle: React.CSSProperties = {
    color: "#2196F3",
    textDecoration: "none",
  };
  // ---------- Fin estilos ----------

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={{ textAlign: "center" }}>Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handleLogin} style={buttonStyle}>Iniciar sesión</button>
        <p style={{ textAlign: "center", marginTop: 8 }}>
          ¿No tienes cuenta? <Link to="/signup" style={linkStyle}>Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
