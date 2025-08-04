import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import PersistentLogin from "./PersistentLogin";

// lazy loading for performance
import { lazy, Suspense } from "react";

const LoginPage = lazy(() => import("../pages/LoginPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const EmailVerificationPage = lazy(() => import("../pages/EmailVerificationPage"));

// Placeholder loading component
//! Change this later
//! User gsap
const AppLoading = () => <div>Loading...</div>;

const AppRoutes = () => {
  return (
    <Suspense fallback={<AppLoading />}>
      <Routes>
        <Route element={<PersistentLogin />}>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<EmailVerificationPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
