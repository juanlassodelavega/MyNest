import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleLogin = async () => {
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Por favor completa todos los campos.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error: any) {
      setErrorMessage("Credenciales inválidas. Intenta nuevamente.");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #555",
    backgroundColor: "#1a1a2b",
    color: "#fff",
    boxSizing: "border-box",
  } as const;

  const buttonStyle = {
    width: "100%",
    padding: 12,
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    marginTop: 8,
  } as const;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#1e1e2f",
      }}
    >
      <div
        style={{
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
        }}
      >
        <h1 style={{ textAlign: "center" }}>Iniciar Sesión</h1>

        {errorMessage && (
          <p style={{ color: "#ff6b6b", textAlign: "center" }}>{errorMessage}</p>
        )}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handleLogin} style={buttonStyle}>
          Iniciar sesión
        </button>

        <p style={{ textAlign: "center", marginTop: 8 }}>
          ¿No tienes cuenta?{" "}
          <Link to="/signup" style={{ color: "#2196F3" }}>
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
