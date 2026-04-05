import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);

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

  const confirmedCount = bookings.filter(b => b.status === "CONFIRMED").length;
  const pendingCount   = bookings.filter(b => b.status === "PENDING").length;
  const cancelledCount = bookings.filter(b => b.status === "CANCELLED").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.full_name}! 👋
          </h1>
          <p className="text-blue-200">
            Role:{" "}
            <span className="bg-blue-800 px-3 py-1 rounded-full text-sm font-medium">
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
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="text-4xl mb-3">🌍</div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700">
              Browse Travel Packages
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Explore available destinations and book your next trip
            </p>
          </Link>

          <Link
            to="/bookings"
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700">
              My Bookings
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              View and manage all your travel bookings
            </p>
          </Link>
        </div>

        {/* Recent bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Bookings
          </h2>
          {loading ? (
            <p className="text-gray-400 text-center py-8">Loading...</p>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No bookings yet</p>
              <Link
                to="/listings"
                className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
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
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === "CONFIRMED"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
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