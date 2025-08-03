import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { is } from "zod/locales";

const PublicRoute = () => {
  const { isAuthenticated } = useAuthStore((state) => state);
  console.log("isAuthenticated", isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default PublicRoute;
