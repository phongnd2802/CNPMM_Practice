import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/auth.context.jsx";

export default function ProtectedRoute({ children }) {
  const { auth, appLoading } = useContext(AuthContext);
  if (appLoading) return null;
  if (!auth?.isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
