import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { FiHome, FiGrid, FiLogIn, FiLogOut, FiUser } from "react-icons/fi";

export default function Header() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  const actionStyle: React.CSSProperties = {
    fontSize: "1.1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 38,
    width: 38,
    borderRadius: 10,
    color: "var(--ink)",
    backgroundColor: "var(--surface-soft)",
    border: "1px solid var(--line)",
  };

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    padding: "8px 12px",
    borderRadius: 10,
    color: isActive ? "var(--brand-strong)" : "var(--ink-muted)",
    backgroundColor: isActive ? "var(--brand-soft)" : "transparent",
    fontWeight: 700,
    fontSize: "0.92rem",
  });

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        backgroundColor: "var(--surface)",
        color: "var(--ink)",
        borderBottom: "1px solid var(--line)",
        position: "sticky",
        top: 0,
        zIndex: 20,
        boxSizing: "border-box",
        width: "100%",
        backdropFilter: "blur(8px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Link
          to={user ? "/dashboard" : "/"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontWeight: 800,
            fontFamily: "Sora, sans-serif",
          }}
        >
          <span style={actionStyle}>{user ? <FiGrid /> : <FiHome />}</span>
          <span>MyNest</span>
        </Link>
      </div>

      <nav style={{ display: "flex", gap: 8 }}>
        <NavLink to="/" style={navLinkStyle}>
          Home
        </NavLink>
        {user && (
          <>
            <NavLink to="/dashboard" style={navLinkStyle}>
              Dashboard
            </NavLink>
            <NavLink to="/profile" style={navLinkStyle}>
              Profile
            </NavLink>
          </>
        )}
      </nav>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {!user && (
          <Link to="/login" style={actionStyle} title="Sign in">
            <FiLogIn />
          </Link>
        )}
        {user && (
          <>
            <Link to="/profile" style={actionStyle} title="Profile">
              <FiUser />
            </Link>
            <button
              onClick={handleLogout}
              style={{
                ...actionStyle,
                cursor: "pointer",
              }}
              title="Sign out"
            >
              <FiLogOut />
            </button>
          </>
        )}
      </div>
    </header>
  );
}
