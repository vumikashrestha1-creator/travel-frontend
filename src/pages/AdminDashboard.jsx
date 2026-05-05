import { useState, useEffect } from "react";
import api from "../api/axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

// ── Country list A-Z ──────────────────────────────────────────────
const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia","Australia",
  "Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium",
  "Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei",
  "Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde",
  "Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica",
  "Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominican Republic","Ecuador",
  "Egypt","El Salvador","Estonia","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia",
  "Germany","Ghana","Greece","Guatemala","Guinea","Haiti","Honduras","Hungary","Iceland","India",
  "Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan",
  "Kenya","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Libya","Liechtenstein",
  "Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania",
  "Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar",
  "Namibia","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea",
  "North Macedonia","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay",
  "Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saudi Arabia",
  "Senegal","Serbia","Sierra Leone","Singapore","Slovakia","Slovenia","Somalia","South Africa",
  "South Korea","Spain","Sri Lanka","Sudan","Sweden","Switzerland","Syria","Taiwan","Tajikistan",
  "Tanzania","Thailand","Timor-Leste","Togo","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan",
  "Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan",
  "Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
];

// ── Popular destinations ──────────────────────────────────────────
const DESTINATIONS = [
  "Bali","Bangkok","Barcelona","Beijing","Berlin","Bucharest","Budapest","Cairo","Cancun",
  "Cape Town","Copenhagen","Dubai","Edinburgh","Florence","Hong Kong","Istanbul","Jakarta",
  "Kathmandu","Kuala Lumpur","Lisbon","London","Los Angeles","Maldives","Marrakech","Melbourne",
  "Mexico City","Milan","Mumbai","Munich","New York","Osaka","Paris","Phuket","Prague","Queenstown",
  "Reykjavik","Rio de Janeiro","Rome","Santorini","Seoul","Singapore","Sydney","Taipei","Tokyo",
  "Toronto","Vancouver","Venice","Vienna","Zurich"
];

// ── Cities by country ─────────────────────────────────────────────
const CITIES_BY_COUNTRY = {
  "Australia":       ["Sydney","Melbourne","Brisbane","Perth","Adelaide","Gold Coast","Canberra","Hobart"],
  "Japan":           ["Tokyo","Osaka","Kyoto","Hiroshima","Sapporo","Fukuoka","Nagoya","Nara"],
  "Indonesia":       ["Bali","Jakarta","Yogyakarta","Surabaya","Lombok","Medan","Makassar"],
  "Thailand":        ["Bangkok","Phuket","Chiang Mai","Pattaya","Krabi","Koh Samui","Hua Hin"],
  "France":          ["Paris","Lyon","Marseille","Nice","Bordeaux","Strasbourg","Toulouse"],
  "Italy":           ["Rome","Milan","Florence","Venice","Naples","Turin","Amalfi","Positano"],
  "United Kingdom":  ["London","Edinburgh","Manchester","Birmingham","Liverpool","Bath","Oxford"],
  "United States":   ["New York","Los Angeles","Las Vegas","Miami","Chicago","San Francisco","Hawaii"],
  "United Arab Emirates": ["Dubai","Abu Dhabi","Sharjah","Ajman"],
  "Singapore":       ["Singapore"],
  "Malaysia":        ["Kuala Lumpur","Penang","Langkawi","Kota Kinabalu","Johor Bahru"],
  "India":           ["Mumbai","Delhi","Goa","Jaipur","Agra","Bangalore","Chennai","Kolkata"],
  "China":           ["Beijing","Shanghai","Hong Kong","Guangzhou","Chengdu","Xi an","Hangzhou"],
  "Germany":         ["Berlin","Munich","Frankfurt","Hamburg","Cologne","Stuttgart","Dresden"],
  "Spain":           ["Barcelona","Madrid","Seville","Valencia","Ibiza","Mallorca","Granada"],
  "Greece":          ["Athens","Santorini","Mykonos","Rhodes","Corfu","Thessaloniki","Crete"],
  "Turkey":          ["Istanbul","Cappadocia","Antalya","Bodrum","Izmir","Ankara","Trabzon"],
  "Maldives":        ["Male","Maafushi","Hulhumale","Addu City"],
  "New Zealand":     ["Auckland","Queenstown","Christchurch","Wellington","Rotorua","Dunedin"],
  "South Africa":    ["Cape Town","Johannesburg","Durban","Pretoria","Stellenbosch","Kruger"],
  "Brazil":          ["Rio de Janeiro","Sao Paulo","Salvador","Fortaleza","Brasilia","Manaus"],
  "Canada":          ["Toronto","Vancouver","Montreal","Calgary","Ottawa","Quebec City","Banff"],
  "Vietnam":         ["Hanoi","Ho Chi Minh City","Da Nang","Hoi An","Nha Trang","Hue","Halong Bay"],
  "Nepal":           ["Kathmandu","Pokhara","Chitwan","Lukla","Namche Bazaar"],
  "Portugal":        ["Lisbon","Porto","Algarve","Sintra","Madeira","Azores","Cascais"],
  "Morocco":         ["Marrakech","Casablanca","Fez","Rabat","Chefchaouen","Essaouira"],
  "Egypt":           ["Cairo","Luxor","Aswan","Alexandria","Sharm el-Sheikh","Hurghada"],
  "Mexico":          ["Mexico City","Cancun","Playa del Carmen","Los Cabos","Oaxaca","Guadalajara"],
  "Peru":            ["Lima","Cusco","Machu Picchu","Arequipa","Iquitos","Puno"],
  "Argentina":       ["Buenos Aires","Patagonia","Mendoza","Cordoba","Bariloche","Salta"],
  "Philippines":     ["Manila","Cebu","Boracay","Palawan","Davao","Bohol"],
  "Sri Lanka":       ["Colombo","Kandy","Galle","Sigiriya","Nuwara Eliya","Trincomalee"],
  "Cambodia":        ["Siem Reap","Phnom Penh","Sihanoukville","Kampot"],
  "Iceland":         ["Reykjavik","Akureyri","Vik","Selfoss","Husavik"],
  "Norway":          ["Oslo","Bergen","Tromso","Stavanger","Trondheim","Flam"],
  "Switzerland":     ["Zurich","Geneva","Bern","Lucerne","Interlaken","Zermatt"],
  "Austria":         ["Vienna","Salzburg","Innsbruck","Hallstatt","Graz","Linz"],
  "Czech Republic":  ["Prague","Brno","Cesky Krumlov","Karlovy Vary"],
  "Hungary":         ["Budapest","Debrecen","Pecs","Eger","Miskolc"],
  "Netherlands":     ["Amsterdam","Rotterdam","The Hague","Utrecht","Bruges"],
  "Belgium":         ["Brussels","Bruges","Ghent","Antwerp","Liege"],
  "Sweden":          ["Stockholm","Gothenburg","Malmo","Uppsala","Kiruna"],
  "Denmark":         ["Copenhagen","Aarhus","Odense","Aalborg","Roskilde"],
  "Finland":         ["Helsinki","Rovaniemi","Turku","Tampere","Oulu"],
  "Russia":          ["Moscow","Saint Petersburg","Vladivostok","Kazan","Sochi"],
  "South Korea":     ["Seoul","Busan","Jeju","Incheon","Gyeongju","Suwon"],
  "Taiwan":          ["Taipei","Kaohsiung","Taichung","Tainan","Hualien"],
  "Kenya":           ["Nairobi","Mombasa","Masai Mara","Amboseli","Lake Nakuru"],
  "Tanzania":        ["Dar es Salaam","Zanzibar","Serengeti","Kilimanjaro","Arusha"],
  "Jordan":          ["Amman","Petra","Wadi Rum","Aqaba","Dead Sea"],
  "Israel":          ["Jerusalem","Tel Aviv","Haifa","Eilat","Nazareth"],
  "Saudi Arabia":    ["Riyadh","Jeddah","Mecca","Medina","AlUla","NEOM"],
  "Qatar":           ["Doha","Al Wakra","Al Khor"],
  "Bahrain":         ["Manama","Muharraq","Riffa"],
  "Kuwait":          ["Kuwait City","Ahmadi","Hawalli"],
};

const AdminDashboard = () => {
  const [activeTab,   setActiveTab]   = useState("overview");
  const [users,       setUsers]       = useState([]);
  const [bookings,    setBookings]    = useState([]);
  const [listings,    setListings]    = useState([]);
  const [payments,    setPayments]    = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [message,     setMessage]     = useState("");

  const [showForm,        setShowForm]        = useState(false);
  const [autofillDest,    setAutofillDest]    = useState("");
  const [autofillLoading, setAutofillLoading] = useState(false);
  const [autofillMsg,     setAutofillMsg]     = useState("");
  const [formErrors,      setFormErrors]      = useState({});

  const [newListing, setNewListing] = useState({
    title: "", description: "", listing_type: "PACKAGE",
    origin: "Sydney", destination: "", country: "", city: "",
    price_per_person: "", discount_percent: "0",
    available_seats: "", max_seats: "",
    start_date: "", end_date: "", duration_days: "",
    image_url: "", includes_hotel: false,
    includes_flight: false, includes_meals: false,
  });

  const [showUserForm, setShowUserForm] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "", first_name: "", last_name: "",
    password: "", role: "CUSTOMER",
  });

  const [editingUserId,   setEditingUserId]   = useState(null);
  const [editingUserRole, setEditingUserRole] = useState("");

  // Get cities based on selected country
  const availableCities = CITIES_BY_COUNTRY[newListing.country] || [];

  useEffect(() => { fetchData(); }, [activeTab]);

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

  // Validate listing form
  const validateListing = () => {
    const errors = {};
    if (!newListing.title.trim())            errors.title            = "Title is required";
    if (!newListing.destination.trim())      errors.destination      = "Destination is required";
    if (!newListing.country)                 errors.country          = "Please select a country";
    if (!newListing.city.trim())             errors.city             = "City is required";
    if (!newListing.origin.trim())           errors.origin           = "Origin is required";
    if (!newListing.price_per_person)        errors.price_per_person = "Price is required";
    if (Number(newListing.price_per_person) <= 0) errors.price_per_person = "Price must be greater than 0";
    if (!newListing.available_seats)         errors.available_seats  = "Available seats is required";
    if (!newListing.max_seats)               errors.max_seats        = "Max seats is required";
    if (Number(newListing.available_seats) > Number(newListing.max_seats))
      errors.available_seats = "Available seats cannot exceed max seats";
    if (!newListing.duration_days)           errors.duration_days    = "Duration is required";
    if (!newListing.start_date)              errors.start_date       = "Start date is required";
    if (!newListing.end_date)               errors.end_date         = "End date is required";
    if (newListing.start_date && newListing.end_date && newListing.end_date <= newListing.start_date)
      errors.end_date = "End date must be after start date";
    if (!newListing.description.trim())      errors.description      = "Description is required";
    return errors;
  };

  const handleAutofill = async () => {
    if (!autofillDest.trim()) { setAutofillMsg("Please type a destination first."); return; }
    setAutofillLoading(true);
    setAutofillMsg("Gemini is generating listing details...");
    try {
      const res = await api.post("/api/ai/autofill/", {
        destination: autofillDest.trim(), listing_type: newListing.listing_type,
      });
      const d = res.data;
      setNewListing({
        ...newListing,
        title: d.title || "", description: d.description || "",
        country: d.country || "", city: d.city || "",
        origin: d.origin || "Sydney", destination: autofillDest.trim(),
        price_per_person: d.price_per_person || "", duration_days: d.duration_days || "",
        image_url: d.image_url || "", max_seats: d.max_seats || "",
        available_seats: d.available_seats || "", start_date: d.start_date || "",
        end_date: d.end_date || "", includes_hotel: d.includes_hotel || false,
        includes_flight: d.includes_flight || false, includes_meals: d.includes_meals || false,
      });
      setFormErrors({});
      setAutofillMsg("All fields filled! Please review and adjust before saving.");
    } catch (err) {
      setAutofillMsg("Autofill failed. Please fill in the fields manually.");
    } finally {
      setAutofillLoading(false);
    }
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    const errors = validateListing();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    try {
      await api.post("/api/listings/create/", newListing);
      setMessage("Listing created successfully.");
      setShowForm(false);
      setAutofillDest(""); setAutofillMsg("");
      setNewListing({
        title: "", description: "", listing_type: "PACKAGE",
        origin: "Sydney", destination: "", country: "", city: "",
        price_per_person: "", discount_percent: "0",
        available_seats: "", max_seats: "", start_date: "", end_date: "",
        duration_days: "", image_url: "", includes_hotel: false,
        includes_flight: false, includes_meals: false,
      });
      fetchData();
    } catch (error) {
      setMessage(error.response?.data ? JSON.stringify(error.response.data) : "Failed to create listing.");
    }
  };

  const handleDeactivateListing = async (listingId) => {
    if (!window.confirm("Deactivate this listing?")) return;
    try {
      await api.delete("/api/listings/" + listingId + "/manage/");
      setMessage("Listing deactivated.");
      fetchData();
    } catch (error) { setMessage("Failed to deactivate listing."); }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/users/admin/users/create/", newUser);
      setMessage("User created successfully.");
      setShowUserForm(false);
      setNewUser({ email: "", first_name: "", last_name: "", password: "", role: "CUSTOMER" });
      fetchData();
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to create user.");
    }
  };

  const handleUpdateRole = async (userId) => {
    try {
      await api.patch("/api/users/admin/users/" + userId + "/role/", { role: editingUserRole });
      setMessage("User role updated successfully.");
      setEditingUserId(null);
      fetchData();
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to update role.");
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (!window.confirm("Deactivate this user?")) return;
    try {
      await api.delete("/api/users/admin/users/" + userId + "/");
      setMessage("User deactivated successfully.");
      fetchData();
    } catch (error) { setMessage("Failed to deactivate user."); }
  };

  const handleReactivateUser = async (userId) => {
    try {
      await api.patch("/api/users/admin/users/" + userId + "/");
      setMessage("User reactivated successfully.");
      fetchData();
    } catch (error) { setMessage("Failed to reactivate user."); }
  };

  const handleUpdateBooking = async (bookingId, newStatus) => {
    try {
      await api.patch("/api/bookings/admin/" + bookingId + "/update/", { status: newStatus });
      setMessage("Booking updated successfully.");
      fetchData();
    } catch (error) { setMessage("Failed to update booking."); }
  };

  const tabClass = (tab) =>
    "px-6 py-3 font-medium text-sm transition-colors cursor-pointer " +
    (activeTab === tab ? "border-b-2 border-teal-600 text-teal-600" : "text-gray-500 hover:text-gray-700");

  const statusBadge = (s) => {
    const styles = {
      CONFIRMED: "bg-green-100 text-green-700", PENDING: "bg-yellow-100 text-yellow-700",
      CANCELLED: "bg-red-100 text-red-700", COMPLETED: "bg-blue-100 text-blue-700",
      ACTIVE: "bg-green-100 text-green-700", INACTIVE: "bg-gray-100 text-gray-700",
      SOLDOUT: "bg-red-100 text-red-700",
    };
    return "px-2 py-1 rounded-full text-xs font-medium " + (styles[s] || "bg-gray-100 text-gray-700");
  };

  const roleBadge = (role) => {
    const styles = {
      ADMIN: "bg-blue-100 text-blue-700", TRAVEL_AGENT: "bg-purple-100 text-purple-700",
      MANAGER: "bg-orange-100 text-orange-700", CUSTOMER: "bg-green-100 text-green-700",
    };
    return "px-2 py-1 rounded-full text-xs font-medium " + (styles[role] || "bg-gray-100 text-gray-700");
  };

  // Error message component
  const FieldError = ({ name }) => formErrors[name]
    ? <p className="text-red-500 text-xs mt-1">{formErrors[name]}</p>
    : null;

  // Input class with error highlight
  const inputClass = (name) =>
    "w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500 " +
    (formErrors[name] ? "border-red-400 bg-red-50" : "border-gray-300");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="bg-gradient-to-r from-teal-800 to-teal-600 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
          <p className="text-teal-200">SafeNest Travel - Full system control and management</p>
        </div>

        {message && (
          <div className={"mb-6 px-4 py-3 rounded-lg " + (message.includes("successfully") || message.includes("created") ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700")}>
            {message}
            <button onClick={() => setMessage("")} className="ml-4 text-sm underline">dismiss</button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {[
              { key: "overview",  label: "Overview"  },
              { key: "users",     label: "Users"     },
              { key: "bookings",  label: "Bookings"  },
              { key: "listings",  label: "Listings"  },
              { key: "analytics", label: "Analytics" },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setActiveTab(key)} className={tabClass(key)}>{label}</button>
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
                {activeTab === "overview" && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">System Overview</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      {[
                        { label:"Total Users",    value:users.length,    icon:"👥" },
                        { label:"Total Bookings", value:bookings.length, icon:"📋" },
                        { label:"Total Listings", value:listings.length, icon:"🌍" },
                        { label:"Total Payments", value:payments.length, icon:"💳" },
                      ].map(({ label, value, icon }) => (
                        <div key={label} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                          <div className="text-3xl mb-2">{icon}</div>
                          <p className="text-2xl font-bold text-gray-800">{value}</p>
                          <p className="text-sm text-gray-500">{label}</p>
                        </div>
                      ))}
                    </div>
                    <h3 className="text-md font-semibold text-gray-700 mb-3">Recent Bookings</h3>
                    <div className="space-y-2">
                      {bookings.slice(0, 5).map((b) => (
                        <div key={b.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm">
                          <span className="font-medium text-gray-700">{b.user_email}</span>
                          <span className="text-gray-500">{b.listing_title}</span>
                          <span className={statusBadge(b.status)}>{b.status}</span>
                          <span className="font-semibold text-teal-700">${b.total_price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "users" && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-gray-800">All Users ({users.length})</h2>
                      <button onClick={() => setShowUserForm(!showUserForm)} className="bg-teal-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-800 transition-colors">
                        {showUserForm ? "Cancel" : "+ Add User"}
                      </button>
                    </div>
                    {showUserForm && (
                      <form onSubmit={handleCreateUser} className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-4">Create New User</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[
                            { name:"email", label:"Email", type:"email" },
                            { name:"first_name", label:"First Name", type:"text" },
                            { name:"last_name", label:"Last Name", type:"text" },
                            { name:"password", label:"Password", type:"password" },
                          ].map(({ name, label, type }) => (
                            <div key={name}>
                              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                              <input type={type} required value={newUser[name]} onChange={(e) => setNewUser({ ...newUser, [name]: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500" />
                            </div>
                          ))}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none">
                              <option value="CUSTOMER">Customer</option>
                              <option value="MANAGER">Manager</option>
                              <option value="TRAVEL_AGENT">Travel Agent</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                          </div>
                        </div>
                        <button type="submit" className="mt-4 bg-teal-700 text-white px-6 py-2 rounded-lg hover:bg-teal-800 transition-colors font-medium text-sm">Create User</button>
                      </form>
                    )}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 text-left">
                            {["Email","Name","Role","Status","Joined","Actions"].map(h => (
                              <th key={h} className="px-4 py-3 font-medium text-gray-600">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-gray-800">{user.email}</td>
                              <td className="px-4 py-3 text-gray-600">{user.first_name} {user.last_name}</td>
                              <td className="px-4 py-3">
                                {editingUserId === user.id ? (
                                  <div className="flex gap-2 items-center">
                                    <select value={editingUserRole} onChange={(e) => setEditingUserRole(e.target.value)} className="text-xs border border-gray-300 rounded px-2 py-1 outline-none">
                                      <option value="CUSTOMER">Customer</option>
                                      <option value="MANAGER">Manager</option>
                                      <option value="TRAVEL_AGENT">Travel Agent</option>
                                      <option value="ADMIN">Admin</option>
                                    </select>
                                    <button onClick={() => handleUpdateRole(user.id)} className="text-xs bg-teal-700 text-white px-2 py-1 rounded hover:bg-teal-800">Save</button>
                                    <button onClick={() => setEditingUserId(null)} className="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
                                  </div>
                                ) : (
                                  <span className={roleBadge(user.role)}>{user.role}</span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <span className={"px-2 py-1 rounded-full text-xs font-medium " + (user.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                                  {user.is_active ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-500">{new Date(user.date_joined).toLocaleDateString()}</td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2 flex-wrap">
                                  {user.role !== "ADMIN" && (
                                    <button onClick={() => { setEditingUserId(user.id); setEditingUserRole(user.role); }} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Edit Role</button>
                                  )}
                                  {user.role !== "ADMIN" && (
                                    user.is_active
                                      ? <button onClick={() => handleDeactivateUser(user.id)} className="text-red-600 hover:text-red-800 text-xs font-medium">Deactivate</button>
                                      : <button onClick={() => handleReactivateUser(user.id)} className="text-green-600 hover:text-green-800 text-xs font-medium">Reactivate</button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === "bookings" && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">All Bookings ({bookings.length})</h2>
                    <div className="space-y-3">
                      {bookings.map((booking) => (
                        <div key={booking.id} className="border border-gray-100 rounded-xl p-4">
                          <div className="flex flex-col sm:flex-row justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex flex-wrap gap-2 mb-2">
                                <span className="font-semibold text-gray-800">{booking.listing_title}</span>
                                <span className={statusBadge(booking.status)}>{booking.status}</span>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-gray-500">
                                <span>👤 {booking.user_email}</span>
                                <span>🔖 {booking.booking_reference}</span>
                                <span>👥 {booking.number_of_guests} guests</span>
                                <span className="font-semibold text-teal-700">💰 ${booking.total_price}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <select defaultValue={booking.status} onChange={(e) => handleUpdateBooking(booking.id, e.target.value)} className="text-sm border border-gray-200 rounded-lg px-2 py-1 outline-none">
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

                {activeTab === "analytics" && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">Analytics Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <h3 className="font-semibold text-gray-700 mb-4">Booking Status</h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie data={[
                              { name: "Confirmed", value: bookings.filter(b => b.status === "CONFIRMED").length },
                              { name: "Pending",   value: bookings.filter(b => b.status === "PENDING").length   },
                              { name: "Cancelled", value: bookings.filter(b => b.status === "CANCELLED").length },
                              { name: "Completed", value: bookings.filter(b => b.status === "COMPLETED").length },
                            ]} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                              {["#0d9488","#f59e0b","#ef4444","#3b82f6"].map((color, i) => <Cell key={i} fill={color} />)}
                            </Pie>
                            <Tooltip /><Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <h3 className="font-semibold text-gray-700 mb-4">Top Destinations</h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={listings.slice(0,5).map(l => ({ name: l.destination || l.title?.slice(0,10), seats: l.max_seats - l.available_seats }))}>
                            <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis />
                            <Tooltip /><Bar dataKey="seats" fill="#0d9488" name="Bookings" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <h3 className="font-semibold text-gray-700 mb-4">Revenue by Listing</h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={listings.slice(0,5).map(l => ({ name: l.destination || l.title?.slice(0,10), revenue: l.price_per_person * (l.max_seats - l.available_seats) }))}>
                            <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis />
                            <Tooltip /><Bar dataKey="revenue" fill="#6366f1" name="Revenue ($)" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <h3 className="font-semibold text-gray-700 mb-4">User Roles</h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie data={[
                              { name: "Customer",     value: users.filter(u => u.role === "CUSTOMER").length     },
                              { name: "Admin",        value: users.filter(u => u.role === "ADMIN").length        },
                              { name: "Travel Agent", value: users.filter(u => u.role === "TRAVEL_AGENT").length },
                              { name: "Manager",      value: users.filter(u => u.role === "MANAGER").length      },
                            ]} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                              {["#0d9488","#3b82f6","#8b5cf6","#f59e0b"].map((color, i) => <Cell key={i} fill={color} />)}
                            </Pie>
                            <Tooltip /><Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "listings" && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-gray-800">All Listings ({listings.length})</h2>
                      <button onClick={() => setShowForm(!showForm)} className="bg-teal-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-800 transition-colors">
                        {showForm ? "Cancel" : "+ Add Listing"}
                      </button>
                    </div>

                    {showForm && (
                      <form onSubmit={handleCreateListing} className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-4">Create New Listing</h3>

                        {/* AI Autofill */}
                        <div className="bg-gradient-to-r from-teal-700 to-teal-500 rounded-xl p-5 mb-6">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">✨</span>
                            <h4 className="text-white font-bold text-base">AI Autofill — Powered by Gemini</h4>
                          </div>
                          <p className="text-teal-100 text-xs mb-4">Type a destination and click Autofill. Gemini fills in all fields automatically.</p>
                          <div className="flex flex-wrap gap-2">
                            <input type="text" value={autofillDest} onChange={(e) => setAutofillDest(e.target.value)} onKeyDown={(e) => e.key === "Enter" && e.preventDefault()} placeholder="e.g. Bali, Tokyo, Paris..." className="flex-1 min-w-48 px-3 py-2 rounded-lg text-sm outline-none text-gray-800" />
                            <select value={newListing.listing_type} onChange={(e) => setNewListing({ ...newListing, listing_type: e.target.value })} className="px-3 py-2 rounded-lg text-sm outline-none text-gray-800">
                              <option value="PACKAGE">Package</option>
                              <option value="HOTEL">Hotel</option>
                              <option value="FLIGHT">Flight</option>
                            </select>
                            <button type="button" onClick={handleAutofill} disabled={autofillLoading} className="bg-white text-teal-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-teal-50 transition-colors disabled:opacity-60 whitespace-nowrap">
                              {autofillLoading ? "Generating..." : "Autofill with AI"}
                            </button>
                          </div>
                          {autofillMsg && (
                            <p className={"mt-3 text-xs font-medium " + (autofillMsg.includes("filled") ? "text-green-200" : autofillMsg.includes("failed") ? "text-red-200" : "text-teal-100")}>{autofillMsg}</p>
                          )}
                        </div>

                        {/* Validation error summary */}
                        {Object.keys(formErrors).length > 0 && (
                          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm font-medium">Please fix the following errors:</p>
                            <ul className="mt-1 space-y-1">
                              {Object.values(formErrors).map((err, i) => (
                                <li key={i} className="text-red-600 text-xs">• {err}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                          {/* Title */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                            <input type="text" value={newListing.title} onChange={(e) => setNewListing({ ...newListing, title: e.target.value })} className={inputClass("title")} placeholder="e.g. Bali Adventure Package" />
                            <FieldError name="title" />
                          </div>

                          {/* Origin */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Origin *</label>
                            <input type="text" value={newListing.origin} onChange={(e) => setNewListing({ ...newListing, origin: e.target.value })} className={inputClass("origin")} placeholder="e.g. Sydney" />
                            <FieldError name="origin" />
                          </div>

                          {/* Destination dropdown */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Destination *</label>
                            <select value={newListing.destination} onChange={(e) => setNewListing({ ...newListing, destination: e.target.value })} className={inputClass("destination")}>
                              <option value="">-- Select Destination --</option>
                              {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                              <option value="__other__">Other (type below)</option>
                            </select>
                            {newListing.destination === "__other__" && (
                              <input type="text" placeholder="Type destination name" onChange={(e) => setNewListing({ ...newListing, destination: e.target.value })} className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500" />
                            )}
                            <FieldError name="destination" />
                          </div>

                          {/* Country dropdown A-Z */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                            <select
                              value={newListing.country}
                              onChange={(e) => setNewListing({ ...newListing, country: e.target.value, city: "" })}
                              className={inputClass("country")}
                            >
                              <option value="">-- Select Country --</option>
                              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <FieldError name="country" />
                          </div>

                          {/* City — smart dropdown based on country */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                            {availableCities.length > 0 ? (
                              <select value={newListing.city} onChange={(e) => setNewListing({ ...newListing, city: e.target.value })} className={inputClass("city")}>
                                <option value="">-- Select City --</option>
                                {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                            ) : (
                              <input type="text" value={newListing.city} onChange={(e) => setNewListing({ ...newListing, city: e.target.value })} className={inputClass("city")} placeholder={newListing.country ? "Type city name" : "Select a country first"} />
                            )}
                            <FieldError name="city" />
                          </div>

                          {/* Price */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Person (USD) *</label>
                            <input type="number" value={newListing.price_per_person} onChange={(e) => setNewListing({ ...newListing, price_per_person: e.target.value })} className={inputClass("price_per_person")} placeholder="e.g. 1200" min="1" />
                            <FieldError name="price_per_person" />
                          </div>

                          {/* Discount */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                            <input type="number" value={newListing.discount_percent} onChange={(e) => setNewListing({ ...newListing, discount_percent: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500" min="0" max="100" />
                          </div>

                          {/* Available Seats */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Available Seats *</label>
                            <input type="number" value={newListing.available_seats} onChange={(e) => setNewListing({ ...newListing, available_seats: e.target.value })} className={inputClass("available_seats")} placeholder="e.g. 20" min="1" />
                            <FieldError name="available_seats" />
                          </div>

                          {/* Max Seats */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Seats *</label>
                            <input type="number" value={newListing.max_seats} onChange={(e) => setNewListing({ ...newListing, max_seats: e.target.value })} className={inputClass("max_seats")} placeholder="e.g. 20" min="1" />
                            <FieldError name="max_seats" />
                          </div>

                          {/* Duration */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days) *</label>
                            <input type="number" value={newListing.duration_days} onChange={(e) => setNewListing({ ...newListing, duration_days: e.target.value })} className={inputClass("duration_days")} placeholder="e.g. 7" min="1" />
                            <FieldError name="duration_days" />
                          </div>

                          {/* Start Date */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                            <input type="date" value={newListing.start_date} onChange={(e) => setNewListing({ ...newListing, start_date: e.target.value })} className={inputClass("start_date")} />
                            <FieldError name="start_date" />
                          </div>

                          {/* End Date */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                            <input type="date" value={newListing.end_date} onChange={(e) => setNewListing({ ...newListing, end_date: e.target.value })} className={inputClass("end_date")} />
                            <FieldError name="end_date" />
                          </div>

                          {/* Image URL */}
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL <span className="text-gray-400 font-normal">(optional)</span></label>
                            <input type="url" value={newListing.image_url} onChange={(e) => setNewListing({ ...newListing, image_url: e.target.value })} placeholder="https://images.unsplash.com/photo-..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500" />
                            {newListing.image_url && (
                              <img src={newListing.image_url} alt="Preview" className="mt-2 h-24 w-40 object-cover rounded-lg border border-gray-200" onError={(e) => { e.target.style.display = "none"; }} />
                            )}
                          </div>

                          {/* Description */}
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                            <textarea value={newListing.description} onChange={(e) => setNewListing({ ...newListing, description: e.target.value })} rows={3} className={inputClass("description")} placeholder="Describe the travel package..." />
                            <FieldError name="description" />
                          </div>

                          {/* Listing Type */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type</label>
                            <select value={newListing.listing_type} onChange={(e) => setNewListing({ ...newListing, listing_type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none">
                              <option value="PACKAGE">Package</option>
                              <option value="HOTEL">Hotel</option>
                              <option value="FLIGHT">Flight</option>
                            </select>
                          </div>

                          {/* Checkboxes */}
                          <div className="flex items-center gap-6 pt-6">
                            {[
                              { name:"includes_hotel", label:"Hotel" },
                              { name:"includes_flight", label:"Flight" },
                              { name:"includes_meals", label:"Meals" },
                            ].map(({ name, label }) => (
                              <label key={name} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input type="checkbox" checked={newListing[name]} onChange={(e) => setNewListing({ ...newListing, [name]: e.target.checked })} className="w-4 h-4 accent-teal-600" />
                                {label}
                              </label>
                            ))}
                          </div>
                        </div>

                        <button type="submit" className="mt-6 bg-teal-700 text-white px-6 py-2 rounded-lg hover:bg-teal-800 transition-colors font-medium">
                          Create Listing
                        </button>
                      </form>
                    )}

                    <div className="space-y-3">
                      {listings.map((listing) => (
                        <div key={listing.id} className="border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-3">
                          <div className="flex gap-4 items-start">
                            {listing.image_url ? (
                              <img src={listing.image_url} alt={listing.title} className="w-16 h-16 object-cover rounded-lg shrink-0" onError={(e) => { e.target.style.display = "none"; }} />
                            ) : (
                              <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
                                <span className="text-2xl">{listing.listing_type === "HOTEL" ? "🏨" : listing.listing_type === "FLIGHT" ? "✈️" : "🌴"}</span>
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-800">{listing.title}</span>
                                <span className={statusBadge(listing.status)}>{listing.status}</span>
                              </div>
                              <div className="text-sm text-gray-500 flex flex-wrap gap-3">
                                <span>📍 {listing.destination}</span>
                                <span>💰 ${listing.discounted_price}/person</span>
                                <span>💺 {listing.available_seats} seats</span>
                              </div>
                            </div>
                          </div>
                          {listing.status === "ACTIVE" && (
                            <button onClick={() => handleDeactivateListing(listing.id)} className="text-red-600 hover:text-red-800 text-sm font-medium self-start shrink-0">Deactivate</button>
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
