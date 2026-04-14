const ExternalBooking = ({ listing }) => {
  const dest = encodeURIComponent(listing.destination || "");
  const orig = encodeURIComponent(listing.origin || "");
  const city = encodeURIComponent(listing.city || "");
  const cin = listing.start_date || "";
  const cout = listing.end_date || "";
  const type = listing.listing_type;

  const buttons =
    type === "HOTEL"
      ? [
          { href: "https://www.booking.com/search.html?ss=" + dest + "&checkin=" + cin + "&checkout=" + cout, label: "🏨 Booking.com", cls: "bg-blue-600 hover:bg-blue-700" },
          { href: "https://www.agoda.com/search?city=" + city + "&checkIn=" + cin + "&checkOut=" + cout, label: "🌏 Agoda", cls: "bg-red-500 hover:bg-red-600" },
          { href: "https://www.hotels.com/search.do?q-destination=" + dest, label: "🏩 Hotels.com", cls: "bg-orange-500 hover:bg-orange-600" },
        ]
      : type === "FLIGHT"
      ? [
          { href: "https://www.skyscanner.com/transport/flights/" + orig + "/" + dest + "/", label: "✈️ Skyscanner", cls: "bg-cyan-600 hover:bg-cyan-700" },
          { href: "https://www.kayak.com/flights/" + orig + "-" + dest + "/" + cin + "/" + cout, label: "🛫 Kayak", cls: "bg-orange-500 hover:bg-orange-600" },
          { href: "https://www.google.com/travel/flights?q=flights+from+" + orig + "+to+" + dest, label: "🔍 Google Flights", cls: "bg-blue-500 hover:bg-blue-600" },
        ]
      : [
          { href: "https://www.expedia.com/Hotel-Search?destination=" + dest + "&startDate=" + cin + "&endDate=" + cout, label: "🌴 Expedia", cls: "bg-yellow-500 hover:bg-yellow-600" },
          { href: "https://www.tripadvisor.com/Search?q=" + dest, label: "🦉 TripAdvisor", cls: "bg-green-600 hover:bg-green-700" },
          { href: "https://www.viator.com/search/" + dest, label: "🎒 Viator", cls: "bg-purple-600 hover:bg-purple-700" },
        ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mt-6">
        <h3 className="text-base font-semibold text-gray-800 mb-1">
        🔗 Also available on
        </h3>
        <p className="text-xs text-gray-400 mb-4">
        Compare prices and book directly on these trusted platforms
        </p>
        <div className="flex flex-col gap-3">
        {buttons.map(function(btn, i) {
            return (
            <a
                key={i}  // Consider using a unique ID from btn if available (e.g., key={btn.id}) for better performance on reorders
                href={btn.href}
                target="_blank"
                rel="noopener noreferrer"
                className={"w-full text-center text-white text-sm font-medium py-2.5 rounded-xl transition-colors " + btn.cls}
            >
                {btn.label} <span className="text-xs opacity-75">↗</span>
            </a>
            );
        })}
        </div>
        <p className="text-xs text-gray-300 mt-4 text-center">
        Opens external website in a new tab
        </p>
    </div>
  );
};

export default ExternalBooking;