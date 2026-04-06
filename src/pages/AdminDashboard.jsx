import { useState, useEffect } from "react";
import api from "../api/axios";

const AdminDashboard = () => {
  const [activeTab,   setActiveTab]   = useState("overview");
  const [users,       setUsers]       = useState([]);
  const [bookings,    setBookings]    = useState([]);
  const [listings,    setListings]    = useState([]);
  const [payments,    setPayments]    = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [message,     setMessage]     = useState("");
  const [showForm,    setShowForm]    = useState(false);
  const [newListing,  setNewListing]  = useState({
    title:            "",
    description:      "",
    listing_type:     "PACKAGE",
    origin:           "",
    destination:      "",
    country:          "",
    city:             "",
    price_per_person: "",
    discount_percent: "0",
    available_seats:  "",
    max_seats:        "",
    start_date:       "",
    end_date:         "",
    duration_days:    "",
    image_url:        "",
    includes_hotel:   false,
    includes_flight:  false,
    includes_meals:   false,
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "overview" || activeTab === "users") {
        const res = await api.get("/api/users/admin/users/");
        setUsers(res.data.results || res.data);
      }
      if (activeTab === "overview" || activeTab === "bookings") {
        const res = await api.get("/api/bookings/admin/all/");
        setBookings(res.data.results || res.data);
      }
      if (activeTab === "overview" || activeTab === "listings") {
        const res = await api.get("/api/listings/");
        setListings(res.data.results || res.data);
      }
      if (activeTab === "overview") {
        const res = await api.get("/api/payments/admin/all/");
        setPayments(res.data.results || res.data);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (!window.confirm("Deactivate this user?")) return;
    try {
      await api.delete(`/api/users/admin/users/${userId}/`);
      setMessage("User deactivated successfully.");
      fetchData();
    } catch (error) {
      setMessage("Failed to deactivate user.");
    }
  };

  const handleUpdateBooking = async (bookingId, newStatus) => {
    try {
      await api.patch(`/api/bookings/admin/${bookingId}/update/`, {
        status: newStatus,
      });
      setMessage("Booking updated successfully.");
      fetchData();
    } catch (error) {
      setMessage("Failed to update booking.");
    }
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/listings/create/", newListing);
      setMessage("Listing created successfully.");
      setShowForm(false);
      setNewListing({
        title:            "",
        description:      "",
        listing_type:     "PACKAGE",
        origin:           "",
        destination:      "",
        country:          "",
        city:             "",
        price_per_person: "",
        discount_percent: "0",
        available_seats:  "",
        max_seats:        "",
        start_date:       "",
        end_date:         "",
        duration_days:    "",
        image_url:        "",
        includes_hotel:   false,
        includes_flight:  false,
        includes_meals:   false,
      });
      fetchData();
    } catch (error) {
      setMessage(
        error.response?.data
          ? JSON.stringify(error.response.data)
          : "Failed to create listing."
      );
    }
  };

  const handleDeactivateListing = async (listingId) => {
    if (!window.confirm("Deactivate this listing?")) return;
    try {
      await api.delete(`/api/listings/${listingId}/manage/`);
      setMessage("Listing deactivated.");
      fetchData();
    } catch (error) {
      setMessage("Failed to deactivate listing.");
    }
  };

  const tabClass = (tab) =>
    `px-6 py-3 font-medium text-sm transition-colors cursor-pointer ${
      activeTab === tab
        ? "border-b-2 border-teal-600 text-teal-600"
        : "text-gray-500 hover:text-gray-700"
    }`;

  const statusBadge = (status) => {
    const styles = {
      CONFIRMED: "bg-green-100 text-green-700",
      PENDING:   "bg-yellow-100 text-yellow-700",
      CANCELLED: "bg-red-100 text-red-700",
      COMPLETED: "bg-blue-100 text-blue-700",
      ACTIVE:    "bg-green-100 text-green-700",
      INACTIVE:  "bg-gray-100 text-gray-700",
      SOLDOUT:   "bg-red-100 text-red-700",
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${
      styles[status] || "bg-gray-100 text-gray-700"
    }`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 to-teal-600 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-1">
            Admin Dashboard 🛡️
          </h1>
          <p className="text-teal-200">
            SafeNest Travel — Full system control and management
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg ${
              message.includes("successfully") ||
              message.includes("created")
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {message}
            <button
              onClick={() => setMessage("")}
              className="ml-4 text-sm underline"
            >
              dismiss
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {[
              { key: "overview",  label: "📊 Overview"  },
              { key: "users",     label: "👥 Users"     },
              { key: "bookings",  label: "📋 Bookings"  },
              { key: "listings",  label: "🌍 Listings"  },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={tabClass(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading data...</p>
              </div>
            ) : (
              <>
                {/* ── OVERVIEW TAB ─────────────────────── */}
                {activeTab === "overview" && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">
                      System Overview
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      {[
                        { label:"Total Users",    value:users.length,    icon:"👥" },
                        { label:"Total Bookings", value:bookings.length, icon:"📋" },
                        { label:"Total Listings", value:listings.length, icon:"🌍" },
                        { label:"Total Payments", value:payments.length, icon:"💳" },
                      ].map(({ label, value, icon }) => (
                        <div
                          key={label}
                          className="bg-gray-50 rounded-xl p-5 border border-gray-100"
                        >
                          <div className="text-3xl mb-2">{icon}</div>
                          <p className="text-2xl font-bold text-gray-800">
                            {value}
                          </p>
                          <p className="text-sm text-gray-500">{label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Recent bookings */}
                    <h3 className="text-md font-semibold text-gray-700 mb-3">
                      Recent Bookings
                    </h3>
                    <div className="space-y-2">
                      {bookings.slice(0, 5).map((b) => (
                        <div
                          key={b.id}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm"
                        >
                          <span className="font-medium text-gray-700">
                            {b.user_email}
                          </span>
                          <span className="text-gray-500">
                            {b.listing_title}
                          </span>
                          <span className={statusBadge(b.status)}>
                            {b.status}
                          </span>
                          <span className="font-semibold text-teal-700">
                            ${b.total_price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── USERS TAB ──────────────────────────── */}
                {activeTab === "users" && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      All Users ({users.length})
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 text-left">
                            <th className="px-4 py-3 font-medium text-gray-600">
                              Email
                            </th>
                            <th className="px-4 py-3 font-medium text-gray-600">
                              Name
                            </th>
                            <th className="px-4 py-3 font-medium text-gray-600">
                              Role
                            </th>
                            <th className="px-4 py-3 font-medium text-gray-600">
                              Status
                            </th>
                            <th className="px-4 py-3 font-medium text-gray-600">
                              Joined
                            </th>
                            <th className="px-4 py-3 font-medium text-gray-600">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-gray-800">
                                {user.email}
                              </td>
                              <td className="px-4 py-3 text-gray-600">
                                {user.first_name} {user.last_name}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    user.role === "ADMIN"
                                      ? "bg-blue-100 text-blue-700"
                                      : user.role === "TRAVEL_AGENT"
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-green-100 text-green-700"
                                  }`}
                                >
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    user.is_active
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {user.is_active ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-500">
                                {new Date(
                                  user.date_joined
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3">
                                {user.is_active &&
                                  user.role !== "ADMIN" && (
                                    <button
                                      onClick={() =>
                                        handleDeactivateUser(user.id)
                                      }
                                      className="text-red-600 hover:text-red-800 text-xs font-medium"
                                    >
                                      Deactivate
                                    </button>
                                  )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ── BOOKINGS TAB ────────────────────────── */}
                {activeTab === "bookings" && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      All Bookings ({bookings.length})
                    </h2>
                    <div className="space-y-3">
                      {bookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="border border-gray-100 rounded-xl p-4"
                        >
                          <div className="flex flex-col sm:flex-row justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex flex-wrap gap-2 mb-2">
                                <span className="font-semibold text-gray-800">
                                  {booking.listing_title}
                                </span>
                                <span className={statusBadge(booking.status)}>
                                  {booking.status}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-gray-500">
                                <span>👤 {booking.user_email}</span>
                                <span>🔖 {booking.booking_reference}</span>
                                <span>👥 {booking.number_of_guests} guests</span>
                                <span className="font-semibold text-teal-700">
                                  💰 ${booking.total_price}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <select
                                defaultValue={booking.status}
                                onChange={(e) =>
                                  handleUpdateBooking(
                                    booking.id,
                                    e.target.value
                                  )
                                }
                                className="text-sm border border-gray-200 rounded-lg px-2 py-1 outline-none"
                              >
                                <option value="PENDING">Pending</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── LISTINGS TAB ────────────────────────── */}
                {activeTab === "listings" && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-gray-800">
                        All Listings ({listings.length})
                      </h2>
                      <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-teal-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-800 transition-colors"
                      >
                        {showForm ? "Cancel" : "+ Add Listing"}
                      </button>
                    </div>

                    {/* Create listing form */}
                    {showForm && (
                      <form
                        onSubmit={handleCreateListing}
                        className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200"
                      >
                        <h3 className="font-semibold text-gray-800 mb-4">
                          Create New Listing
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[
                            { name:"title",            label:"Title",              type:"text"   },
                            { name:"origin",           label:"Origin",             type:"text"   },
                            { name:"destination",      label:"Destination",        type:"text"   },
                            { name:"country",          label:"Country",            type:"text"   },
                            { name:"city",             label:"City",               type:"text"   },
                            { name:"price_per_person", label:"Price Per Person",   type:"number" },
                            { name:"discount_percent", label:"Discount %",         type:"number" },
                            { name:"available_seats",  label:"Available Seats",    type:"number" },
                            { name:"max_seats",        label:"Max Seats",          type:"number" },
                            { name:"duration_days",    label:"Duration (days)",    type:"number" },
                            { name:"start_date",       label:"Start Date",         type:"date"   },
                            { name:"end_date",         label:"End Date",           type:"date"   },
                          ].map(({ name, label, type }) => (
                            <div key={name}>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {label}
                              </label>
                              <input
                                type={type}
                                required
                                value={newListing[name]}
                                onChange={(e) =>
                                  setNewListing({
                                    ...newListing,
                                    [name]: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500"
                              />
                            </div>
                          ))}

                          {/* Image URL field */}
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Image URL
                              <span className="text-gray-400 font-normal ml-1">
                                (optional — paste a photo link)
                              </span>
                            </label>
                            <input
                              type="url"
                              value={newListing.image_url}
                              onChange={(e) =>
                                setNewListing({
                                  ...newListing,
                                  image_url: e.target.value,
                                })
                              }
                              placeholder="https://images.unsplash.com/photo-..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            {/* Image preview */}
                            {newListing.image_url && (
                              <div className="mt-2">
                                <img
                                  src={newListing.image_url}
                                  alt="Preview"
                                  className="h-24 w-40 object-cover rounded-lg border border-gray-200"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          {/* Description */}
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <textarea
                              required
                              value={newListing.description}
                              onChange={(e) =>
                                setNewListing({
                                  ...newListing,
                                  description: e.target.value,
                                })
                              }
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          </div>

                          {/* Type */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Listing Type
                            </label>
                            <select
                              value={newListing.listing_type}
                              onChange={(e) =>
                                setNewListing({
                                  ...newListing,
                                  listing_type: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
                            >
                              <option value="PACKAGE">Package</option>
                              <option value="HOTEL">Hotel</option>
                              <option value="FLIGHT">Flight</option>
                            </select>
                          </div>

                          {/* Checkboxes */}
                          <div className="flex items-center gap-6 pt-6">
                            {[
                              { name:"includes_hotel",  label:"Hotel"  },
                              { name:"includes_flight", label:"Flight" },
                              { name:"includes_meals",  label:"Meals"  },
                            ].map(({ name, label }) => (
                              <label
                                key={name}
                                className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={newListing[name]}
                                  onChange={(e) =>
                                    setNewListing({
                                      ...newListing,
                                      [name]: e.target.checked,
                                    })
                                  }
                                  className="w-4 h-4 accent-teal-600"
                                />
                                {label}
                              </label>
                            ))}
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="mt-6 bg-teal-700 text-white px-6 py-2 rounded-lg hover:bg-teal-800 transition-colors font-medium"
                        >
                          Create Listing
                        </button>
                      </form>
                    )}

                    {/* Listings table */}
                    <div className="space-y-3">
                      {listings.map((listing) => (
                        <div
                          key={listing.id}
                          className="border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-3"
                        >
                          <div className="flex gap-4 items-start">
                            {/* Listing thumbnail */}
                            {listing.image_url ? (
                              <img
                                src={listing.image_url}
                                alt={listing.title}
                                className="w-16 h-16 object-cover rounded-lg shrink-0"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
                                <span className="text-2xl">
                                  {listing.listing_type === "HOTEL"
                                    ? "🏨"
                                    : listing.listing_type === "FLIGHT"
                                    ? "✈️"
                                    : "🌴"}
                                </span>
                              </div>
                            )}

                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-800">
                                  {listing.title}
                                </span>
                                <span className={statusBadge(listing.status)}>
                                  {listing.status}
                                </span>
                              </div>
                              <div className="text-sm text-gray-500 flex flex-wrap gap-3">
                                <span>📍 {listing.destination}</span>
                                <span>
                                  💰 ${listing.discounted_price}/person
                                </span>
                                <span>💺 {listing.available_seats} seats</span>
                              </div>
                            </div>
                          </div>

                          {listing.status === "ACTIVE" && (
                            <button
                              onClick={() =>
                                handleDeactivateListing(listing.id)
                              }
                              className="text-red-600 hover:text-red-800 text-sm font-medium self-start shrink-0"
                            >
                              Deactivate
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;