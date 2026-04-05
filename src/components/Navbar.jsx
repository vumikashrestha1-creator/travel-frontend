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
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-bold"
          >
            <span className="text-2xl">✈️</span>
            <span>SecureTravel</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/listings"
              className="hover:text-blue-200 transition-colors duration-200"
            >
              Browse Packages
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="hover:text-blue-200 transition-colors duration-200"
                >
                  Dashboard
                </Link>

                <Link
                  to="/bookings"
                  className="hover:text-blue-200 transition-colors duration-200"
                >
                  My Bookings
                </Link>

                {/* Only admins see this */}
                {isAdmin && (
                  <Link
                    to="/admin-dashboard"
                    className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold hover:bg-yellow-400 transition-colors"
                  >
                    Admin
                  </Link>
                )}

                {/* User name + logout */}
                <div className="flex items-center space-x-3">
                  <span className="text-blue-200 text-sm">
                    👤 {user?.full_name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-blue-200 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
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