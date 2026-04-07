import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isLoggedIn, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-teal-700 to-teal-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2"
          >
            <span className="text-2xl">🏠</span>
            <div>
              <span className="text-xl font-bold tracking-wide">
                SafeNest
              </span>
              <span className="text-teal-300 text-xl font-light">
                {" "}Travel
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/listings"
              onClick={() => window.location.href = "/listings"}
              className="hover:text-teal-200 transition-colors duration-200 text-sm font-medium"
>
              Browse Packages
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="hover:text-teal-200 transition-colors duration-200 text-sm font-medium"
                >
                  Dashboard
                </Link>

                <Link
                  to="/bookings"
                  className="hover:text-teal-200 transition-colors duration-200 text-sm font-medium"
                >
                  My Bookings
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin-dashboard"
                    className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold hover:bg-yellow-300 transition-colors"
                  >
                    Admin
                  </Link>
                )}

                <div className="flex items-center space-x-3">
                  <span className="text-teal-200 text-sm">
                    👤 {user?.full_name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-teal-200 transition-colors duration-200 text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-teal-500 hover:bg-teal-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;