import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Listings = () => {
  const [listings,  setListings]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState("ALL");
  const [bookingId, setBookingId] = useState(null);
  const [guests,    setGuests]    = useState(1);
  const [message,   setMessage]   = useState("");

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, [filter]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      let url = "/api/listings/?available=true";
      if (filter !== "ALL") url += `&type=${filter}`;
      const response = await api.get(url);
      setListings(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (listingId) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    try {
      const response = await api.post("/api/bookings/create/", {
        listing: listingId,
        number_of_guests: guests,
      });
      setMessage(
        `Booking created! Reference: ${response.data.reference}`
      );
      setBookingId(null);
      fetchListings();
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Booking failed. Please try again."
      );
    }
  };

  const filtered = listings.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900 mb-3">
            Travel Packages 🌍
          </h1>
          <p className="text-gray-500 text-lg">
            Discover amazing destinations around the world
          </p>
        </div>

        {/* Success or error message */}
        {message && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg ${
              message.includes("Reference")
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Search and filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search destinations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="ALL">All Types</option>
            <option value="PACKAGE">Packages</option>
            <option value="HOTEL">Hotels</option>
            <option value="FLIGHT">Flights</option>
          </select>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading packages...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-500 text-lg">No packages found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Card image */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 h-40 flex items-center justify-center">
                  <span className="text-5xl">
                    {listing.listing_type === "HOTEL"
                      ? "🏨"
                      : listing.listing_type === "FLIGHT"
                      ? "✈️"
                      : "🌴"}
                  </span>
                </div>

                {/* Card content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800 text-lg leading-tight">
                      {listing.title}
                    </h3>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full ml-2 shrink-0">
                      {listing.listing_type}
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm mb-3">
                    📍 {listing.origin} → {listing.destination}
                  </p>

                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span>📅 {listing.start_date}</span>
                    <span>⏱ {listing.duration_days} days</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                    {listing.includes_hotel  && <span>🏨 Hotel</span>}
                    {listing.includes_flight && <span>✈️ Flight</span>}
                    {listing.includes_meals  && <span>🍽️ Meals</span>}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        {listing.discount_percent > 0 && (
                          <p className="text-xs text-gray-400 line-through">
                            ${listing.price_per_person}
                          </p>
                        )}
                        <p className="text-xl font-bold text-blue-900">
                          ${listing.discounted_price}
                          <span className="text-sm font-normal text-gray-500">
                            /person
                          </span>
                        </p>
                      </div>
                      <span className="text-sm text-green-600 font-medium">
                        {listing.available_seats} seats left
                      </span>
                    </div>

                    {/* Booking section */}
                    {bookingId === listing.id ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600">
                            Guests:
                          </label>
                          <input
                            type="number"
                            min="1"
                            max={listing.available_seats}
                            value={guests}
                            onChange={(e) => setGuests(Number(e.target.value))}
                            className="w-20 px-2 py-1 border rounded text-center"
                          />
                        </div>
                        <p className="text-sm font-semibold text-blue-900">
                          Total: ${(listing.discounted_price * guests).toFixed(2)}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleBook(listing.id)}
                            className="flex-1 bg-blue-900 text-white py-2 rounded-lg text-sm hover:bg-blue-800 transition-colors"
                          >
                            Confirm Book
                          </button>
                          <button
                            onClick={() => setBookingId(null)}
                            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setBookingId(listing.id)}
                        className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Book Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Listings;