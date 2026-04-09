import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider }    from "./context/AuthContext";
import Navbar              from "./components/Navbar";
import ProtectedRoute      from "./components/ProtectedRoute";
import AdminRoute          from "./components/AdminRoute";
import Login               from "./pages/Login";
import Register            from "./pages/Register";
import Dashboard           from "./pages/Dashboard";
import Listings            from "./pages/Listings";
import Bookings            from "./pages/Bookings";
import AdminDashboard      from "./pages/AdminDashboard";
import ListingDetail       from "./pages/ListingDetail";
import Payment             from "./pages/Payment";
import Home                from "./pages/Home";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">

          <Navbar />

          <Routes>

            {/* Public routes */}
            <Route path="/login"         element={<Login />}    />
            <Route path="/register"      element={<Register />} />
            <Route path="/listings"      element={<Listings />} />
            <Route path="/listings/:id"  element={<ListingDetail />} />

            {/* Customer protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <Bookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/:bookingId"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />

            {/* Admin only route */}
            <Route
              path="/admin-dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            {/* Default redirects */}
            <Route path="/"  element={<Home />} />
            <Route path="*"  element={<Navigate to="/listings" replace />} />

          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;