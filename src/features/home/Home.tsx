import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../../firebase";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  // Scroll parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    maxWidth: 700,
    padding: 40,
    borderRadius: 12,
    backgroundColor: "#2a2a3d",
    boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
    color: "#fff",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 24,
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
  };

  const headingStyle: React.CSSProperties = {
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 0,
    zIndex: 2,
  };

  const textStyle: React.CSSProperties = {
    fontSize: 18,
    lineHeight: 1.5,
    color: "white",
    zIndex: 2,
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
    justifyContent: "center",
    zIndex: 2,
  };

  const buttonStyle: React.CSSProperties = {
    padding: "12px 24px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 16,
    transition: "all 0.3s ease",
  };

  const signupButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#4CAF50",
    color: "#fff",
  };

  const loginButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#2196F3",
    color: "#fff",
  };

  const petStyleBase = {
    position: "absolute" as const,
    width: 50,
    height: 50,
    animation: "float 4s ease-in-out infinite",
  };

  const pets = [
    { color: "#FFB74D", top: 10, left: 15, delay: "0s" },
    { color: "#4FC3F7", top: 50, left: 80, delay: "1s" },
    { color: "#81C784", top: 70, left: 40, delay: "2s" },
    { color: "#E57373", top: 30, left: 60, delay: "1.5s" },
    { color: "#BA68C8", top: 20, left: 50, delay: "0.5s" },
    { color: "#FFD54F", top: 60, left: 20, delay: "2.5s" },
    { color: "#4DB6AC", top: 80, left: 70, delay: "3s" },
    { color: "#FF8A65", top: 40, left: 30, delay: "1s" },
  ];

  const styleTag = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
    }
    button:hover {
      transform: scale(1.08);
      opacity: 0.9;
    }
  `;
  // ---------- Fin estilos ----------

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* Mascotas animadas */}
        {pets.map((pet, index) => (
          <div
            key={index}
            style={{
              ...petStyleBase,
              top: `${pet.top}%`,
              left: `${pet.left}%`,
              animationDelay: pet.delay,
              transform: `translateY(${scrollY * 0.05}px)`,
            }}
          >
            <svg viewBox="0 0 64 64" width="100%" height="100%">
              <circle cx="32" cy="32" r="30" fill={pet.color} />
              <circle cx="22" cy="24" r="5" fill="#fff" />
              <circle cx="42" cy="24" r="5" fill="#fff" />
              <circle cx="32" cy="40" r="6" fill="#fff" />
            </svg>
          </div>
        ))}

        <h1 style={headingStyle}>🐾 Bienvenido a MyNest 🐾</h1>
        <p style={textStyle}>
          La red social para dueños de mascotas. Añade tus mascotas, gestiona
          recordatorios y descubre lugares amigables para ellas cerca de ti.
        </p>

        <div style={buttonContainerStyle}>
          <Link to="/signup">
            <button style={signupButtonStyle}>Registrarse</button>
          </Link>
          <Link to="/login">
            <button style={loginButtonStyle}>Iniciar sesión</button>
          </Link>
        </div>
      </div>

      <style>{styleTag}</style>
    </div>
  );
}
