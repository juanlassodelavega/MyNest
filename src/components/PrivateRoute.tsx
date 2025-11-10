import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

interface PrivateRouteProps {
  children: JSX.Element;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div>Cargando...</div>;

  // Si no hay usuario, redirige al login
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
