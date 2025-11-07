import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { FiLogIn, FiLogOut, FiUser, FiHome } from "react-icons/fi";

export default function Header() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/"); // Redirige al home
  };

  // Estilo común para iconos
  const iconStyle = { fontSize: "1.5rem", display: "flex", alignItems: "center" };

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        backgroundColor: "#1a1a1a",
        color: "white",
        height: 64, // <-- Altura fija
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      {/* Logo / Home */}
      <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center" }}>
        <Link to={user ? "/dashboard" : "/"} style={{ color: "white", ...iconStyle }}>
          <FiHome />
        </Link>
      </div>

      {/* Centro vacío para mantener espacio */}
      <div style={{ flex: "1 1 auto" }} />

      {/* Zona derecha */}
      <div
        style={{
          flex: "0 0 auto",
          display: "flex",
          gap: 16,
          alignItems: "center",
          height: "100%", // asegura que todo esté centrado verticalmente
        }}
      >
        {!user && (
          <Link to="/login" style={{ color: "white", ...iconStyle }}>
            <FiLogIn />
          </Link>
        )}
        {user && (
          <>
            <Link to="/profile" style={{ color: "white", ...iconStyle }}>
              <FiUser />
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                ...iconStyle,
              }}
              title="Cerrar sesión"
            >
              <FiLogOut />
            </button>
          </>
        )}
      </div>
    </header>
  );
}
