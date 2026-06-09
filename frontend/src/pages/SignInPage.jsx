import { useState } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignInPage() {
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/assessment";

  // Already logged in — send them where they came from (or assessment)
  if (!loading && user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
      <p className="text-gray-500 mb-6">Welcome back to EcoTrack AI</p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="signin-email" className="label">Email</label>
          <input
            id="signin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input-field"
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="signin-password" className="label">Password</label>
          <input
            id="signin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input-field"
            required
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full !py-3"
        >
          {submitting ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don't have an account?{" "}
        <Link to="/sign-up" className="text-primary-600 hover:text-primary-700 font-medium">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
