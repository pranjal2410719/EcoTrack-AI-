import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { showSuccess } from "../utils/toast";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    showSuccess("Signed out", "See you next time! 🌱");
    navigate("/");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-bold text-gray-900">
              EcoTrack <span className="text-primary-600">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  to="/assessment"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Assessment
                </Link>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                  <span className="text-sm text-gray-500">
                    {user?.user_metadata?.name || user?.email?.split("@")[0] || "User"}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="btn-secondary !py-2 !px-4 text-sm"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            )}
            {!user && (
              <Link to="/sign-in" className="btn-primary !py-2.5 !px-5 text-sm">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  to="/assessment"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  Assessment
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  Dashboard
                </Link>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">
                    {user?.user_metadata?.name || user?.email?.split("@")[0] || "User"}
                  </p>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileOpen(false);
                    }}
                    className="btn-secondary !py-2 !px-4 text-sm w-full text-center"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            )}
            {!user && (
              <Link
                to="/sign-in"
                onClick={() => setMobileOpen(false)}
                className="btn-primary !py-2.5 !px-5 text-sm w-full text-center"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
