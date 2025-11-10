import { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleSignup = async () => {
    setErrorMessage("");

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !dob
    ) {
      setErrorMessage("Por favor completa todos los campos.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Ingresa un correo válido.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        dob,
        email: user.email,
      });

      navigate("/dashboard");
    } catch (error: any) {
      setErrorMessage("Error al registrar usuario. Inténtalo más tarde.");
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
        <h1 style={{ textAlign: "center" }}>Registro</h1>

        {errorMessage && (
          <p style={{ color: "#ff6b6b", textAlign: "center" }}>
            {errorMessage}
          </p>
        )}

        <input
          type="text"
          placeholder="Nombre"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Apellidos"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          style={inputStyle}
        />
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          style={inputStyle}
        />
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
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle}
        />

        <button onClick={handleSignup} style={buttonStyle}>
          Registrarse
        </button>

        <p style={{ textAlign: "center", marginTop: 8 }}>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" style={{ color: "#2196F3" }}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
