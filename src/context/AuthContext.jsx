import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // ── Used after OTP or TOTP verification ──────────────────────
  // Called by OTPVerify.jsx after successful verification
  const loginWithTokens = (userData, tokens) => {
    if (tokens && tokens.access) {
      localStorage.setItem("access_token",  tokens.access);
      localStorage.setItem("refresh_token", tokens.refresh);
    }
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // ── Normal login ──────────────────────────────────────────────
  // Returns mfa_required: true if MFA is enabled
  // Returns mfa_required: false if login is complete
  const login = async (email, password) => {
    const response = await api.post("/api/users/login/", {
      email,
      password,
    });
    const data = response.data;

    // MFA required — return data so Login.jsx can
    // redirect to OTP verification screen
    if (data.mfa_required) {
      return {
        mfa_required: true,
        mfa_type:     data.mfa_type,
        user_id:      data.user_id,
        email:        data.email,
        message:      data.message,
      };
    }

    // No MFA — login directly
    const { user, tokens } = data;
    loginWithTokens(user, tokens);
    return { mfa_required: false, user };
  };

  // ── Register ──────────────────────────────────────────────────
  const register = async (userData) => {
    const response = await api.post("/api/users/register/", userData);
    const { user, tokens } = response.data;
    loginWithTokens(user, tokens);
    return user;
  };

  // ── Logout ────────────────────────────────────────────────────
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      await api.post("/api/users/logout/", { refresh: refreshToken });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  // ── Toggle Email OTP MFA ──────────────────────────────────────
  // userId is only passed by admin toggling another user's MFA
  const toggleMFA = async (userId = null) => {
    const body     = userId ? { user_id: userId } : {};
    const response = await api.post("/api/users/toggle-mfa/", body);

    // Update local user state if toggling own MFA
    if (!userId) {
      const updatedUser = {
        ...user,
        mfa_enabled: response.data.mfa_enabled,
        mfa_type:    response.data.mfa_type,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
    return response.data;
  };

  // ── Disable MFA for a user (Admin only) ──────────────────────
  const adminDisableMFA = async (userId) => {
    const response = await api.post(
      "/api/users/admin/users/" + userId + "/disable-mfa/"
    );
    return response.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        loginWithTokens,
        toggleMFA,
        adminDisableMFA,
        isAdmin:       user?.role === "ADMIN",
        isCustomer:    user?.role === "CUSTOMER",
        isTravelAgent: user?.role === "TRAVEL_AGENT",
        isLoggedIn:    !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};