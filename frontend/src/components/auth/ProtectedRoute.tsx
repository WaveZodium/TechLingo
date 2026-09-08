import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import type { UserRole } from "../../api/authApi";

type ProtectedRouteProps = {
  requiredRole?: UserRole;
};

function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { isAuth, role } = useAuth();

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
