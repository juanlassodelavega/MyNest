import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";

export default function Profile() {
  const [user] = useAuthState(auth);

  if (!user) return <p>No estás logueado.</p>;

  return (
    <div style={{ padding: 16 }}>
      <h1>Perfil de usuario</h1>
      <p>Email: {user.email}</p>
      <p>UID: {user.uid}</p>
    </div>
  );
}
