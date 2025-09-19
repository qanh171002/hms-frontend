import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api";

// login api
export const login = async (credentials) => {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Login response: ", res.data);
    if (res.data.token) {
      const token = res.data.token;
      localStorage.setItem("hms-token", token);
    }
    return res.data;
  } catch (error) {
    console.log("Login error: ", error);
    const errorMessage =
      error.response?.data?.message || error.message || "Login failed!";
    throw new Error(errorMessage);
  }
};

export const logout = () => {
  localStorage.removeItem("hms-token");
};

export const getToken = () => {
  return localStorage.getItem("hms-token");
};

export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};
