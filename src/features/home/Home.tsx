import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main
      style={{
        flex: 1,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "0 16px",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: 16 }}>Bienvenido a MyNest 🐾</h1>
      <p style={{ fontSize: "1rem", maxWidth: 400 }}>
        Conéctate con otros dueños de mascotas y comparte tus experiencias.
      </p>
      <div style={{ marginTop: 24, display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <Link to="/login" style={{ padding: "10px 20px", background: "#4CAF50", color: "#fff", borderRadius: 4, textDecoration: "none" }}>Iniciar sesión</Link>
        <Link to="/signup" style={{ padding: "10px 20px", background: "#2196F3", color: "#fff", borderRadius: 4, textDecoration: "none" }}>Registrarse</Link>
      </div>
    </main>
  );
}
