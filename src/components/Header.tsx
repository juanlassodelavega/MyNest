import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { FiLogIn, FiLogOut, FiEdit, FiHome, FiGrid } from "react-icons/fi";

export default function Header() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/"); // Redirige al home
  };

  // Estilo común para iconos
  const iconStyle = { fontSize: "1.5rem", display: "flex", alignItems: "center", color: "white" };

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        backgroundColor: "#1a1a1a",
        color: "white",
        height: 64,
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      {/* Logo / Home o Dashboard */}
      <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center" }}>
        <Link to={user ? "/dashboard" : "/"} style={iconStyle}>
          {user ? <FiGrid /> : <FiHome />}
        </Link>
      </div>

      {/* Centro vacío */}
      <div style={{ flex: "1 1 auto" }} />

      {/* Zona derecha */}
      <div
        style={{
          flex: "0 0 auto",
          display: "flex",
          gap: 16,
          alignItems: "center",
          height: "100%",
        }}
      >
        {!user && (
          <Link to="/login" style={iconStyle}>
            <FiLogIn />
          </Link>
        )}
        {user && (
          <>
            {/* Editar en lugar de Perfil */}
            <Link to="/profile" style={iconStyle}>
              <FiEdit />
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "none",
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
