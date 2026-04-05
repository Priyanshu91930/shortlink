import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants";

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
};

export const PublicRoute = ({ children, restricted = false }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated && restricted) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
};

export default ProtectedRoute;
