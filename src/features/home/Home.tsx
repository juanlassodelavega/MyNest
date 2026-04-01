import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../../firebase";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const pageStyle: React.CSSProperties = {
    minHeight: "calc(100vh - 150px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    boxSizing: "border-box",
  };

  const containerStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 960,
    padding: 40,
    borderRadius: 20,
    background:
      "linear-gradient(125deg, rgba(0,109,119,0.12), rgba(244,162,97,0.16)), var(--surface)",
    boxShadow: "var(--shadow)",
    color: "var(--ink)",
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    gap: 26,
    flexWrap: "wrap",
  };

  const primaryButtonStyle: React.CSSProperties = {
    padding: "12px 20px",
    borderRadius: 10,
    border: "1px solid var(--brand)",
    backgroundColor: "var(--brand)",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...primaryButtonStyle,
    border: "1px solid var(--line)",
    backgroundColor: "var(--surface)",
    color: "var(--ink)",
  };

  const cardsStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    flex: 1,
    minWidth: 280,
  };

  const ctaStyle: React.CSSProperties = {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 6,
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <section style={{ flex: 1.4, minWidth: 280, display: "grid", gap: 16 }}>
          <span
            style={{
              width: "fit-content",
              padding: "6px 10px",
              borderRadius: 999,
              fontSize: "0.78rem",
              fontWeight: 800,
              letterSpacing: "0.06em",
              color: "var(--brand-strong)",
              backgroundColor: "var(--brand-soft)",
            }}
          >
            PET-FIRST SOCIAL SPACE
          </span>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.9rem)", lineHeight: 1.05 }}>
            Build a better life for your pets, all in one place.
          </h1>
          <p style={{ fontSize: "1.05rem", maxWidth: 560 }}>
            MyNest helps you manage pets, set care reminders, and discover nearby
            pet-friendly places directly on an interactive map.
          </p>
          <div style={ctaStyle}>
            <Link to="/signup">
              <button style={primaryButtonStyle}>Create account</button>
            </Link>
            <Link to="/login">
              <button style={secondaryButtonStyle}>Sign in</button>
            </Link>
          </div>
        </section>

        <section style={cardsStyle}>
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: 14,
              padding: 16,
            }}
          >
            <h3 style={{ marginBottom: 6 }}>Smart reminders</h3>
            <p>Stay on top of vaccines, treatments, and recurring care tasks.</p>
          </div>
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: 14,
              padding: 16,
            }}
          >
            <h3 style={{ marginBottom: 6 }}>Nearby places</h3>
            <p>Find parks, pet shops, groomers, and veterinary points around you.</p>
          </div>
          <div
            style={{
              background: "linear-gradient(145deg, var(--brand), var(--brand-strong))",
              color: "white",
              borderRadius: 14,
              padding: 16,
            }}
          >
            <h3 style={{ marginBottom: 6 }}>Personal profile</h3>
            <p style={{ color: "rgba(255,255,255,0.86)" }}>
              Keep your details and pet information synchronized in one secure
              dashboard.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
