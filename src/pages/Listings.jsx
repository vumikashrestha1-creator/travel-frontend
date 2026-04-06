import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";

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
      listing:          listingId,
      number_of_guests: guests,
    });

    // Redirect to payment page
    const newBookingId = response.data.booking.id;
    navigate("/payment/" + newBookingId);

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
          <h1 className="text-4xl font-bold text-teal-900 mb-3">
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
            <button
              onClick={() => setMessage("")}
              className="ml-3 text-sm underline"
            >
              dismiss
            </button>
          </div>
        )}

        {/* Search and filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search destinations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
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
                {/* Clickable image and title area */}
                <div
                  onClick={() => navigate(`/listings/${listing.id}`)}
                  className="cursor-pointer"
                >
                  {/* Card image */}
                  <div className="relative h-48 overflow-hidden">
                    {listing.image_url ? (
                      <img
                        src={listing.image_url}
                        alt={listing.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="bg-gradient-to-br from-teal-500 to-teal-700 h-full w-full items-center justify-center"
                      style={{
                        display: listing.image_url ? "none" : "flex",
                      }}
                    >
                      <span className="text-5xl">
                        {listing.listing_type === "HOTEL"
                          ? "🏨"
                          : listing.listing_type === "FLIGHT"
                          ? "✈️"
                          : "🌴"}
                      </span>
                    </div>

                    {/* Type badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-white bg-opacity-90 text-teal-800 text-xs px-2 py-1 rounded-full font-semibold shadow">
                        {listing.listing_type}
                      </span>
                    </div>

                    {/* Discount badge */}
                    {listing.discount_percent > 0 && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow">
                          {listing.discount_percent}% OFF
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Title and destination */}
                  <div className="px-5 pt-4">
                    <h3 className="font-bold text-gray-800 text-lg leading-tight hover:text-teal-700 transition-colors">
                      {listing.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      📍 {listing.origin} → {listing.destination}
                    </p>
                  </div>
                </div>

                {/* Card content — not clickable */}
                <div className="px-5 pb-5">
                  <div className="flex justify-between text-sm text-gray-500 mt-3 mb-3">
                    <span>📅 {listing.start_date}</span>
                    <span>⏱ {listing.duration_days} days</span>
                  </div>

                  {/* Star rating */}
                  {listing.rating > 0 && (
                    <div className="mb-3">
                      <StarRating
                        rating={listing.rating}
                        size="sm"
                        showNumber={true}
                      />
                    </div>
                  )}

                  {/* Includes */}
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                    {listing.includes_hotel  && <span>🏨 Hotel</span>}
                    {listing.includes_flight && <span>✈️ Flight</span>}
                    {listing.includes_meals  && <span>🍽️ Meals</span>}
                  </div>

                  {/* Price and seats */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        {listing.discount_percent > 0 && (
                          <p className="text-xs text-gray-400 line-through">
                            ${listing.price_per_person}
                          </p>
                        )}
                        <p className="text-xl font-bold text-teal-900">
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
                            onChange={(e) =>
                              setGuests(Number(e.target.value))
                            }
                            className="w-20 px-2 py-1 border rounded text-center"
                          />
                        </div>
                        <p className="text-sm font-semibold text-teal-900">
                          Total: $
                          {(
                            listing.discounted_price * guests
                          ).toFixed(2)}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleBook(listing.id)}
                            className="flex-1 bg-teal-700 text-white py-2 rounded-lg text-sm hover:bg-teal-800 transition-colors"
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
                      <div className="flex gap-2">
                        <button
                          onClick={() => setBookingId(listing.id)}
                          className="flex-1 bg-teal-700 hover:bg-teal-800 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Book Now
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/listings/${listing.id}`)
                          }
                          className="px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm transition-colors"
                        >
                          Details
                        </button>
                      </div>
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