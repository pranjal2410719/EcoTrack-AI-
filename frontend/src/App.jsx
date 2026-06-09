import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import AuthLayout from "./layouts/AuthLayout";
import Home from "./pages/Home";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Assessment from "./pages/Assessment";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* ── Public routes (with Navbar + Footer) ── */}
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />

        {/* Protected routes share the same RootLayout (Navbar visible) */}
        <Route
          path="/assessment"
          element={
            <ProtectedRoute>
              <Assessment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ── Auth routes (no Navbar, centered card layout) ── */}
      <Route element={<AuthLayout />}>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
      </Route>

      {/* ── Catch-all: redirect unknown paths to home ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
