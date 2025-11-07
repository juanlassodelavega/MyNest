import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { FiLogIn, FiLogOut, FiUser, FiHome } from "react-icons/fi";

export default function Header() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  const iconStyle = { fontSize: "1.5rem", display: "flex", alignItems: "center" };

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
      <Link to={user ? "/dashboard" : "/"} style={{ color: "white", ...iconStyle }}>
        <FiHome />
      </Link>

      <nav style={{ display: "flex", gap: 16, alignItems: "center" }}>
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
      </nav>
    </header>
  );
}
