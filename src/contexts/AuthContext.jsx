import { createContext, useContext, useState, useEffect } from "react";
import { login, logout, isAuthenticated } from "../apis/authApi";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      setIsLoggedIn(isAuthenticated());
    } catch (error) {
      console.error("Error checking auth:", error);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginUser = async (credentials) => {
    try {
      setLoading(true);
      const response = await login(credentials);
      if (!response?.token) {
        throw new Error("No token received from server");
      }
      setIsLoggedIn(true);
      toast.success("Login successful!");
      return response;
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed!");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    try {
      logout();
      setIsLoggedIn(false);
      toast.success("Logout successful!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout!");
    }
  };

  const value = {
    isLoggedIn,
    loading,
    loginUser,
    logoutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
