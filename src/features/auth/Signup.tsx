import { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleSignup = async () => {
    setErrorMessage("");

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !dob
    ) {
      setErrorMessage("Please complete all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        dob,
        email: user.email,
      });

      navigate("/dashboard");
    } catch {
      setErrorMessage("We could not create your account. Please try again.");
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
          maxWidth: 520,
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
        <h1 style={{ textAlign: "center", fontSize: 30 }}>Create your account</h1>

        {errorMessage && (
          <p style={{ color: "var(--danger)", textAlign: "center" }}>
            {errorMessage}
          </p>
        )}

        <input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          style={inputStyle}
        />
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          style={inputStyle}
        />
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
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle}
        />

        <button onClick={handleSignup} style={buttonStyle} disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>

        <p style={{ textAlign: "center", marginTop: 8 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--brand)" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
