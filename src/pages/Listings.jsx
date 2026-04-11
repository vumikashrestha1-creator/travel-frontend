import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import FilterBar from "../components/FilterBar";

const DEFAULT_FILTERS = {
  search:     "",
  type:       "ALL",
  sort:       "newest",
  min_price:  "",
  max_price:  "",
  min_rating: "",
  available:  "",
  start_date: "",
  duration:   "",
};

// ── Badge calculation logic ───────────────────────────────────────
const calculateBadges = (listings) => {
  if (!listings || listings.length === 0) return {};

  const available = listings.filter(
    (l) => l.available_seats > 0
  );
  if (available.length === 0) return {};

  // 💰 Cheapest — lowest discounted price
  const cheapest = available.reduce((min, l) =>
    Number(l.discounted_price) < Number(min.discounted_price)
      ? l : min
  );

  // ⚡ Fastest — shortest duration
  const fastest = available.reduce((min, l) =>
    l.duration_days < min.duration_days ? l : min
  );

  // ⭐ Best Value — score formula
  // Higher rating = good
  // Higher discount = good
  // Lower price = good
  // More seats = good (popular but not sold out)
  const bestValue = available.reduce((best, l) => {
    const score =
      Number(l.rating || 0) * 30 +
      Number(l.discount_percent || 0) * 20 +
      Number(l.available_seats || 0) * 0.5 -
      Number(l.discounted_price || 0) / 100;

    const bestScore =
      Number(best.rating || 0) * 30 +
      Number(best.discount_percent || 0) * 20 +
      Number(best.available_seats || 0) * 0.5 -
      Number(best.discounted_price || 0) / 100;

    return score > bestScore ? l : best;
  });

  // 🔥 Most Popular — fewest seats left (selling fast)
  const popular = available.reduce((min, l) =>
    l.available_seats < min.available_seats ? l : min
  );

  // Make sure badges do not overlap on same listing
  const usedIds = new Set();
  const result  = {};

  if (cheapest) {
    result.cheapest = cheapest.id;
    usedIds.add(cheapest.id);
  }

  if (fastest && !usedIds.has(fastest.id)) {
    result.fastest = fastest.id;
    usedIds.add(fastest.id);
  } else if (fastest) {
    // Find next fastest
    const next = available
      .filter((l) => !usedIds.has(l.id))
      .reduce(
        (min, l) => (l.duration_days < min.duration_days ? l : min),
        available.find((l) => !usedIds.has(l.id)) || available[0]
      );
    if (next) {
      result.fastest = next.id;
      usedIds.add(next.id);
    }
  }

  if (bestValue && !usedIds.has(bestValue.id)) {
    result.bestValue = bestValue.id;
    usedIds.add(bestValue.id);
  } else if (bestValue) {
    const next = available
      .filter((l) => !usedIds.has(l.id))
      .reduce((best, l) => {
        const score =
          Number(l.rating || 0) * 30 +
          Number(l.discount_percent || 0) * 20 -
          Number(l.discounted_price || 0) / 100;
        const bestScore =
          Number(best.rating || 0) * 30 +
          Number(best.discount_percent || 0) * 20 -
          Number(best.discounted_price || 0) / 100;
        return score > bestScore ? l : best;
      }, available.find((l) => !usedIds.has(l.id)) || available[0]);
    if (next) {
      result.bestValue = next.id;
      usedIds.add(next.id);
    }
  }

  if (popular && !usedIds.has(popular.id)) {
    result.popular = popular.id;
  }

  return result;
};

// ── Badge display component ───────────────────────────────────────
const ListingBadge = ({ type }) => {
  const badges = {
    cheapest:  {
      label: "💰 Cheapest",
      style: "bg-green-500 text-white",
    },
    fastest:   {
      label: "⚡ Fastest",
      style: "bg-blue-500 text-white",
    },
    bestValue: {
      label: "⭐ Best Value",
      style: "bg-yellow-500 text-white",
    },
    popular:   {
      label: "🔥 Selling Fast",
      style: "bg-orange-500 text-white",
    },
  };

  const badge = badges[type];
  if (!badge) return null;

  return (
    <span
      className={
        "text-xs font-bold px-2 py-1 rounded-full shadow-sm " +
        badge.style
      }
    >
      {badge.label}
    </span>
  );
};

const Listings = () => {
  const [listings,   setListings]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [filters,    setFilters]    = useState(DEFAULT_FILTERS);
  const [bookingId,  setBookingId]  = useState(null);
  const [guests,     setGuests]     = useState(1);
  const [message,    setMessage]    = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [total,      setTotal]      = useState(0);
  const [badges,     setBadges]     = useState({});

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search)
        params.append("search",     filters.search);
      if (filters.type && filters.type !== "ALL")
        params.append("type",       filters.type);
      if (filters.sort && filters.sort !== "newest")
        params.append("sort",       filters.sort);
      if (filters.min_price)
        params.append("min_price",  filters.min_price);
      if (filters.max_price)
        params.append("max_price",  filters.max_price);
      if (filters.min_rating)
        params.append("min_rating", filters.min_rating);
      if (filters.available)
        params.append("available",  filters.available);
      if (filters.start_date)
        params.append("start_date", filters.start_date);
      if (filters.duration)
        params.append("duration",   filters.duration);

      const response = await api.get(
        "/api/listings/?" + params.toString()
      );
      const data = response.data.results || response.data;
      const list = Array.isArray(data) ? data : [];
      setListings(list);
      setTotal(list.length);

      // Calculate badges after fetching
      setBadges(calculateBadges(list));

    } catch (error) {
      console.error("Error fetching listings:", error);
      setListings([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchListings();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchListings]);

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
      const newBookingId = response.data.booking
        ? response.data.booking.id
        : response.data.id;
      navigate("/payment/" + newBookingId);
    } catch (error) {
      setMessage(
        error.response?.data?.error ||
        "Booking failed. Please try again."
      );
    }
  };

  const handleReset = () => {
    setFilters({ ...DEFAULT_FILTERS });
    setShowFilter(false);
  };

  const hasActiveFilters = Object.entries(filters).some(
    ([key, val]) =>
      val !== "" &&
      val !== "ALL" &&
      val !== "newest" &&
      key !== "search"
  );

  // Get badge type for a listing
  const getBadgeType = (listingId) => {
    if (badges.cheapest  === listingId) return "cheapest";
    if (badges.fastest   === listingId) return "fastest";
    if (badges.bestValue === listingId) return "bestValue";
    if (badges.popular   === listingId) return "popular";
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-teal-900 mb-2">
            Travel Packages 🌍
          </h1>
          <p className="text-gray-500">
            Discover amazing destinations around the world
          </p>
        </div>

        {/* Badge legend */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {[
            { type: "cheapest",  label: "💰 Cheapest",     style: "bg-green-100 text-green-700 border border-green-200"  },
            { type: "fastest",   label: "⚡ Fastest",      style: "bg-blue-100 text-blue-700 border border-blue-200"     },
            { type: "bestValue", label: "⭐ Best Value",   style: "bg-yellow-100 text-yellow-700 border border-yellow-200"},
            { type: "popular",   label: "🔥 Selling Fast", style: "bg-orange-100 text-orange-700 border border-orange-200"},
          ].map(({ type, label, style }) => (
            <span
              key={type}
              className={"text-xs px-3 py-1 rounded-full font-medium " + style}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Error message */}
        {message && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 flex justify-between items-center">
            <span>{message}</span>
            <button
              onClick={() => setMessage("")}
              className="text-sm underline ml-4"
            >
              dismiss
            </button>
          </div>
        )}

        {/* Search + Filter */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Search destinations, packages..."
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm"
          />
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={
              "px-4 py-3 rounded-xl border text-sm font-medium transition-colors flex items-center gap-2 " +
              (showFilter
                ? "bg-teal-700 text-white border-teal-700"
                : "bg-white text-gray-700 border-gray-300 hover:border-teal-400")
            }
          >
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                !
              </span>
            )}
          </button>
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="px-4 py-3 rounded-xl border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        <div className="flex gap-6">

          {/* Filter sidebar */}
          {showFilter && (
            <div className="w-64 shrink-0">
              <FilterBar
                filters={filters}
                onFilterChange={setFilters}
                onReset={handleReset}
              />
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* Results + sort */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">
                {loading
                  ? "Searching..."
                  : total +
                    " package" +
                    (total !== 1 ? "s" : "") +
                    " found"}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Sort:</span>
                <select
                  value={filters.sort}
                  onChange={(e) =>
                    setFilters({ ...filters, sort: e.target.value })
                  }
                  className="text-sm border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="newest">Newest</option>
                  <option value="cheapest">Cheapest</option>
                  <option value="expensive">Most Expensive</option>
                  <option value="rating">Highest Rated</option>
                  <option value="duration">Shortest</option>
                  <option value="discount">Best Discount</option>
                </select>
              </div>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Finding packages...</p>
              </div>

            ) : listings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-gray-500 text-lg font-medium">
                  No packages found
                </p>
                <p className="text-gray-400 text-sm mt-1 mb-4">
                  Try adjusting your filters
                </p>
                <button
                  onClick={handleReset}
                  className="bg-teal-700 text-white px-6 py-2 rounded-lg hover:bg-teal-800 transition-colors text-sm"
                >
                  Reset Filters
                </button>
              </div>

            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {listings.map((listing) => {
                  const badgeType = getBadgeType(listing.id);
                  return (
                    <div
                      key={listing.id}
                      className={
                        "bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all " +
                        (badgeType === "bestValue"
                          ? "border-yellow-300"
                          : badgeType === "cheapest"
                          ? "border-green-300"
                          : badgeType === "fastest"
                          ? "border-blue-300"
                          : badgeType === "popular"
                          ? "border-orange-300"
                          : "border-gray-100")
                      }
                    >
                      {/* Clickable image */}
                      <div
                        onClick={() =>
                          navigate("/listings/" + listing.id)
                        }
                        className="cursor-pointer"
                      >
                        <div className="relative h-48 overflow-hidden">
                          {listing.image_url ? (
                            <img
                              src={listing.image_url}
                              alt={listing.title}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="bg-gradient-to-br from-teal-500 to-teal-700 h-full w-full flex items-center justify-center">
                              <span className="text-5xl">
                                {listing.listing_type === "HOTEL"
                                  ? "🏨"
                                  : listing.listing_type === "FLIGHT"
                                  ? "✈️"
                                  : "🌴"}
                              </span>
                            </div>
                          )}

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

                        {/* Title */}
                        <div className="px-4 pt-4 pb-1">
                          <h3 className="font-bold text-gray-800 text-base leading-tight hover:text-teal-700 transition-colors">
                            {listing.title}
                          </h3>
                          <p className="text-gray-400 text-xs mt-1">
                            {listing.origin} to {listing.destination}
                          </p>
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="px-4 pb-4">

                        {/* Value badge row */}
                        {badgeType && (
                          <div className="mt-2 mb-2">
                            <ListingBadge type={badgeType} />
                          </div>
                        )}

                        <div className="flex justify-between text-xs text-gray-400 mt-2 mb-2">
                          <span>📅 {listing.start_date}</span>
                          <span>⏱ {listing.duration_days} days</span>
                        </div>

                        {/* Star rating */}
                        {listing.rating > 0 && (
                          <div className="mb-2">
                            <StarRating
                              rating={Number(listing.rating)}
                              size="sm"
                              showNumber={true}
                            />
                          </div>
                        )}

                        {/* Includes */}
                        <div className="flex gap-2 mb-3 text-xs text-gray-400 flex-wrap">
                          {listing.includes_hotel  && <span>🏨 Hotel</span>}
                          {listing.includes_flight && <span>✈️ Flight</span>}
                          {listing.includes_meals  && <span>🍽️ Meals</span>}
                        </div>

                        {/* Price */}
                        <div className="border-t pt-3">
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              {listing.discount_percent > 0 && (
                                <p className="text-xs text-gray-400 line-through">
                                  ${listing.price_per_person}
                                </p>
                              )}
                              <p className="text-lg font-bold text-teal-900">
                                ${listing.discounted_price}
                                <span className="text-xs font-normal text-gray-400">
                                  /person
                                </span>
                              </p>
                            </div>
                            <span className="text-xs text-green-600 font-medium">
                              {listing.available_seats} left
                            </span>
                          </div>

                          {/* Booking buttons */}
                          {bookingId === listing.id ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <label className="text-gray-500 text-xs">
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
                                  className="w-16 px-2 py-1 border rounded text-center text-sm"
                                />
                                <span className="text-xs text-teal-700 font-semibold">
                                  ${(
                                    Number(listing.discounted_price) * guests
                                  ).toFixed(2)}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleBook(listing.id)}
                                  className="flex-1 bg-teal-700 text-white py-2 rounded-lg text-xs hover:bg-teal-800 transition-colors"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setBookingId(null)}
                                  className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-xs hover:bg-gray-200 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() => setBookingId(listing.id)}
                                className="flex-1 bg-teal-700 hover:bg-teal-800 text-white py-2 rounded-lg text-xs font-medium transition-colors"
                              >
                                Book Now
                              </button>
                              <button
                                onClick={() =>
                                  navigate("/listings/" + listing.id)
                                }
                                className="px-3 bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 rounded-lg text-xs transition-colors"
                              >
                                Details
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;