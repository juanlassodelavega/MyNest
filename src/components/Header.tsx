import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { FiLogIn, FiLogOut } from "react-icons/fi";

export default function Header() {
  const [user] = useAuthState(auth);

  return (
    <header
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 32px", // padding fijo en px, no % 
        borderBottom: "1px solid #ddd",
        boxSizing: "border-box",
      }}
    >
      <Link to="/" style={{ fontSize: 24, fontWeight: "bold", textDecoration: "none", color: "white" }}>
        MyNest
      </Link>

      {/* Icono login/logout siempre ocupa espacio fijo */}
      <div style={{ width: 32, textAlign: "right" }}>
        {user ? (
          <button
            onClick={() => auth.signOut()}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 24, color: "white" }}
          >
            <FiLogOut />
          </button>
        ) : (
          <Link to="/login" style={{ fontSize: 24, color: "white" }}>
            <FiLogIn />
          </Link>
        )}
      </div>
    </header>
  );
}
