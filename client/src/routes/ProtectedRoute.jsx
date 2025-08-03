import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth";

// Checks auth store. if not uthenticated, go back to login
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore((state) => state);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
