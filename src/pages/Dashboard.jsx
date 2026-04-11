import { useState, useEffect } from "react";
import { Link, useNavigate }   from "react-router-dom";
import { useAuth }             from "../context/AuthContext";
import api                     from "../api/axios";

const Dashboard = () => {
  const { user, toggleMFA } = useAuth();
  const navigate            = useNavigate();

  const [bookings,   setBookings]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [mfaLoading, setMfaLoading] = useState(false);
  const [mfaMessage, setMfaMessage] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/api/bookings/my-bookings/");
        setBookings(response.data.results || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const confirmedCount = bookings.filter(
    (b) => b.status === "CONFIRMED"
  ).length;
  const pendingCount   = bookings.filter(
    (b) => b.status === "PENDING"
  ).length;
  const cancelledCount = bookings.filter(
    (b) => b.status === "CANCELLED"
  ).length;

  const handleToggleEmailMFA = async () => {
    setMfaLoading(true);
    setMfaMessage("");
    try {
      const res = await toggleMFA();
      setMfaMessage(res.message);
      setTimeout(() => setMfaMessage(""), 4000);
    } catch {
      setMfaMessage("Failed to update MFA settings.");
    } finally {
      setMfaLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-teal-800 to-teal-600 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.full_name}!
          </h1>
          <p className="text-teal-200">
            Role:{" "}
            <span className="bg-teal-700 px-3 py-1 rounded-full text-sm font-medium">
              {user?.role}
            </span>
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Confirmed Bookings", value: confirmedCount, icon: "✅" },
            { label: "Pending Bookings",   value: pendingCount,   icon: "⏳" },
            { label: "Cancelled",          value: cancelledCount, icon: "❌" },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    {loading ? "..." : value}
                  </p>
                </div>
                <span className="text-3xl">{icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/listings"
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:border-teal-300 hover:shadow-md transition-all group"
          >
            <div className="text-4xl mb-3">🌍</div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-teal-700">
              Browse Travel Packages
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Explore available destinations and book your next trip
            </p>
          </Link>

          <Link
            to="/bookings"
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:border-teal-300 hover:shadow-md transition-all group"
          >
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-teal-700">
              My Bookings
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              View and manage all your travel bookings
            </p>
          </Link>
        </div>

        {/* ── MFA Security Card ───────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🔐 Two-Factor Authentication
          </h2>

          {user?.mfa_enabled ? (
            // ── MFA is currently ON ──────────────────────────
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                  ENABLED
                </span>
                <span className="bg-teal-100 text-teal-700 text-xs px-3 py-1 rounded-full font-medium">
                  {user?.mfa_type === "TOTP"
                    ? "Microsoft Authenticator"
                    : "Email OTP"}
                </span>
              </div>

              {user?.mfa_type === "TOTP" ? (
                // TOTP enabled — show remove button
                <div>
                  <p className="text-sm text-gray-500 mb-4">
                    Your account is protected with Microsoft
                    Authenticator. You need the app on your
                    phone to log in.
                  </p>
                  <button
                    onClick={() => navigate("/disable-totp")}
                    className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-100 transition-colors font-medium"
                  >
                    Remove Authenticator App
                  </button>
                </div>
              ) : (
                // Email OTP enabled — show disable toggle
                <div>
                  <p className="text-sm text-gray-500 mb-4">
                    A 6-digit verification code is sent to your
                    email each time you log in.
                  </p>
                  <button
                    onClick={handleToggleEmailMFA}
                    disabled={mfaLoading}
                    className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-100 transition-colors font-medium disabled:opacity-50"
                  >
                    {mfaLoading ? "Updating..." : "Disable Email OTP"}
                  </button>
                </div>
              )}

              {mfaMessage && (
                <p className="text-sm text-teal-600 font-medium mt-3">
                  {mfaMessage}
                </p>
              )}
            </div>
          ) : (
            // ── MFA is currently OFF ─────────────────────────
            <div>
              <p className="text-sm text-gray-500 mb-5">
                Add extra security to your account.
                Choose a method below to get started.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Email OTP option */}
                <div className="border-2 border-gray-100 rounded-xl p-5 hover:border-teal-300 transition-all">
                  <div className="text-3xl mb-3">📧</div>
                  <p className="font-semibold text-gray-800 text-sm mb-1">
                    Email OTP
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Receive a 6-digit code by email
                    each time you log in. Simple and
                    works on any device.
                  </p>
                  <button
                    onClick={handleToggleEmailMFA}
                    disabled={mfaLoading}
                    className="w-full bg-teal-700 text-white py-2 rounded-lg text-sm hover:bg-teal-800 transition-colors font-medium disabled:bg-teal-300"
                  >
                    {mfaLoading ? "Enabling..." : "Enable Email OTP"}
                  </button>
                </div>

                {/* Microsoft Authenticator option */}
                <div className="border-2 border-gray-100 rounded-xl p-5 hover:border-teal-300 transition-all">
                  <div className="text-3xl mb-3">📱</div>
                  <p className="font-semibold text-gray-800 text-sm mb-1">
                    Microsoft Authenticator
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Use an app on your phone to generate
                    codes. Works offline and changes
                    every 30 seconds.
                  </p>
                  <button
                    onClick={() => navigate("/setup-totp")}
                    className="w-full bg-teal-700 text-white py-2 rounded-lg text-sm hover:bg-teal-800 transition-colors font-medium"
                  >
                    Setup Authenticator App
                  </button>
                </div>
              </div>

              {mfaMessage && (
                <p className="text-sm text-teal-600 font-medium mt-3">
                  {mfaMessage}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Recent bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Bookings
          </h2>
          {loading ? (
            <p className="text-gray-400 text-center py-8">
              Loading...
            </p>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">
                No bookings yet
              </p>
              <Link
                to="/listings"
                className="bg-teal-700 text-white px-6 py-2 rounded-lg hover:bg-teal-800 transition-colors"
              >
                Book your first trip
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 3).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {booking.listing_title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Ref: {booking.booking_reference}
                    </p>
                  </div>
                  <span className={
                    "px-3 py-1 rounded-full text-xs font-medium " +
                    (booking.status === "CONFIRMED"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700")
                  }>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;