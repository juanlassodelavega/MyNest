import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

export default function Header() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/"); // Redirige al home al cerrar sesión
  };

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 32px",
        backgroundColor: "#1a1a1a",
        color: "white",
        minHeight: 64,
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <Link
        to={user ? "/dashboard" : "/"}
        style={{ color: "white", fontWeight: 700, fontSize: "1.5rem", textDecoration: "none" }}
      >
        MyNest
      </Link>

      <nav style={{ display: "flex", gap: 16 }}>
        {!user && (
          <Link to="/login" style={{ color: "white" }}>Iniciar sesión</Link>
        )}
        {user && (
          <>
            <Link to="/profile" style={{ color: "white" }}>Perfil</Link>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "1px solid white",
                color: "white",
                padding: "4px 12px",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Cerrar sesión
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
