import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignUpPage() {
  const { signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Already logged in — go to assessment
  if (!loading && user) {
    return <Navigate to="/assessment" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const { error } = await signUp(email, password, name);
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <span className="text-4xl block mb-4">📧</span>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
        <p className="text-gray-500 mb-6">
          We sent a confirmation link to <strong>{email}</strong>. Click the link to verify
          your account, then sign in.
        </p>
        <Link to="/sign-in" className="btn-primary">
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
      <p className="text-gray-500 mb-6">Start tracking your carbon footprint</p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="signup-name" className="label">Name</label>
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="input-field"
            required
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="signup-email" className="label">Email</label>
          <input
            id="signup-email"
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
          <label htmlFor="signup-password" className="label">Password</label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="input-field"
            minLength={6}
            required
            autoComplete="new-password"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full !py-3"
        >
          {submitting ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{" "}
        <Link to="/sign-in" className="text-primary-600 hover:text-primary-700 font-medium">
          Sign In
        </Link>
      </p>
    </div>
  );
}
