import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthInit } from "./hooks/useAuthInit";
import { ProtectedRoute, PublicRoute } from "./routes/ProtectedRoute";
import { MainLayout, AuthLayout, DashboardLayout } from "./layouts";
import { LoadingScreen } from "./components/ui";
import { ROUTES } from "./constants";

// Lazy load pages for code splitting
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const GithubCallbackPage = lazy(() => import("./pages/GithubCallbackPage"));
const GoogleCallbackPage = lazy(() => import("./pages/GoogleCallbackPage"));
const AdInterstitialPage = lazy(() => import("./pages/AdInterstitialPage"));
const AdminSettingsPage = lazy(() => import("./pages/AdminSettingsPage"));

const App = () => {
  useAuthInit();

  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public routes with main layout */}
          <Route element={<MainLayout />}>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route
              path={ROUTES.LOGIN}
              element={
                <PublicRoute restricted>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path={ROUTES.REGISTER}
              element={
                <PublicRoute restricted>
                  <RegisterPage />
                </PublicRoute>
              }
            />
            <Route
              path={ROUTES.GITHUB_CALLBACK}
              element={<GithubCallbackPage />}
            />
            <Route
              path="/auth/google/callback"
              element={<GoogleCallbackPage />}
            />
          </Route>

          {/* Protected routes */}
          <Route element={<DashboardLayout />}>
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute adminOnly>
                  <AdminSettingsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Ad Interstitial - No header/footer */}
          <Route path="/ad/:slug" element={<AdInterstitialPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
