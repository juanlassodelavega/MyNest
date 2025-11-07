import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { FiLogIn, FiLogOut, FiUser } from "react-icons/fi";

export default function Header() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const homeLink = user ? "/dashboard" : "/";

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/"); // redirige al Home
  };

  return (
    <header
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 32px",
        borderBottom: "1px solid #ddd",
        boxSizing: "border-box",
      }}
    >
      {/* Logo con redirección condicional */}
      <Link
        to={homeLink}
        style={{ fontSize: 24, fontWeight: "bold", textDecoration: "none", color: "#333" }}
      >
        MyNest
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {user ? (
          <>
            <Link to="/profile" style={{ fontSize: 24 }}>
              <FiUser />
            </Link>
            <button
              onClick={handleLogout}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 24 }}
            >
              <FiLogOut />
            </button>
          </>
        ) : (
          <Link to="/login" style={{ fontSize: 24 }}>
            <FiLogIn />
          </Link>
        )}
      </div>
    </header>
  );
}
