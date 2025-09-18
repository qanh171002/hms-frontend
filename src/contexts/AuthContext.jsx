import { createContext, useContext, useState, useEffect } from "react";
import { login, logout, isAuthenticated } from "../apis/authApi";
import {
  getCurrentUser,
  updateUserProfile as updateUserProfileAPI,
} from "../apis/usersApi";
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
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const authenticated = isAuthenticated();

      if (authenticated) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error fetching user data:", error);
          logout();
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (credentials) => {
    try {
      setLoading(true);
      const response = await login(credentials);

      try {
        const userData = await getCurrentUser();
        setUser(userData);
        setIsLoggedIn(true);
        toast.success("Login successful!");
        return response;
      } catch (userError) {
        console.error("Error fetching user after login:", userError);
        throw new Error("Login successful but failed to load user data");
      }
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
      setUser(null);
      toast.success("Logout successful!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout!");
    }
  };

  const updateUserProfile = async (userData) => {
    try {
      const updatedUser = await updateUserProfileAPI(user.id, userData);

      setUser(updatedUser);

      return updatedUser;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  const value = {
    isLoggedIn,
    loading,
    user,
    loginUser,
    logoutUser,
    updateUserProfile,
    refreshUserData: checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
