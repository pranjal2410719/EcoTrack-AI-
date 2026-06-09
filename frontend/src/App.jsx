import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import AuthLayout from "./layouts/AuthLayout";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import PageSkeleton from "./components/PageSkeleton";
import AssessmentSkeleton from "./components/AssessmentSkeleton";
import DashboardSkeleton from "./components/DashboardSkeleton";

// Lazy-loaded pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const SignInPage = lazy(() => import("./pages/SignInPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const Assessment = lazy(() => import("./pages/Assessment"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Coach = lazy(() => import("./pages/Coach"));
const Simulator = lazy(() => import("./pages/Simulator"));

export default function App() {
  return (
    <Routes>
      {/* ── Public routes (with Navbar + Footer) ── */}
      <Route element={<RootLayout />}>
        <Route path="/" element={<Suspense fallback={<PageSkeleton />}><Home /></Suspense>} />

        {/* Protected routes share the same RootLayout (Navbar visible) */}
        <Route
          path="/assessment"
          element={
            <ProtectedRoute>
              <Suspense fallback={<AssessmentSkeleton />}><Assessment /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Suspense fallback={<DashboardSkeleton />}><Dashboard /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/coach"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageSkeleton />}><Coach /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/simulator"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageSkeleton />}><Simulator /></Suspense>
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ── Auth routes (no Navbar, centered card layout) ── */}
      <Route element={<AuthLayout />}>
        <Route path="/sign-in" element={<Suspense fallback={<PageSkeleton />}><SignInPage /></Suspense>} />
        <Route path="/sign-up" element={<Suspense fallback={<PageSkeleton />}><SignUpPage /></Suspense>} />
      </Route>

      {/* ── Catch-all: redirect unknown paths to home ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
