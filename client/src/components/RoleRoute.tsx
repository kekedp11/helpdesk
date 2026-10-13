import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";
import type { UserRole } from "../types/auth.types";

interface RoleRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

function RoleRoute({
  children,
  allowedRoles,
}: RoleRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default RoleRoute;