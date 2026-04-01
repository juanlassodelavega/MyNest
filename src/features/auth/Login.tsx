import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleLogin = async () => {
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch {
      setErrorMessage("Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1px solid var(--line)",
    backgroundColor: "var(--surface)",
    color: "var(--ink)",
    boxSizing: "border-box",
  } as const;

  const buttonStyle = {
    width: "100%",
    padding: 12,
    backgroundColor: "var(--brand)",
    color: "#fff",
    border: "1px solid var(--brand)",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    marginTop: 8,
  } as const;

  return (
    <div
      style={{
        minHeight: "calc(100vh - 150px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          padding: 40,
          borderRadius: 16,
          backgroundColor: "var(--surface)",
          boxShadow: "var(--shadow)",
          color: "var(--ink)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <h1 style={{ textAlign: "center", fontSize: 30 }}>Welcome back</h1>

        {errorMessage && (
          <p style={{ color: "var(--danger)", textAlign: "center" }}>
            {errorMessage}
          </p>
        )}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handleLogin} style={buttonStyle} disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>

        <p style={{ textAlign: "center", marginTop: 8 }}>
          New to MyNest?{" "}
          <Link to="/signup" style={{ color: "var(--brand)" }}>
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
