import { useState } from "react";
import { signup } from "./auth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await signup(email, password);
      alert("Usuario registrado!");
      navigate("/feed");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <main style={{ padding: 32 }}>
      <h1>Registro</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: 8 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: 8 }}
      />
      <button onClick={handleSignup}>Sign Up</button>
    </main>
  );
}
