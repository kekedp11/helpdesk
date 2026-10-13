import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const { token, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;