import axios from "./axiosConfig";

export const getCurrentUser = async () => {
  try {
    const response = await axios.get("/users/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

export const updateUserProfile = async (id, userData) => {
  try {
    const response = await axios.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const getUsers = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(`/users?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await axios.post("/users", userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const searchUsersByRole = async (role, page = 0, size = 10) => {
  try {
    const filter = {
      roles: role && role !== "All" ? [role] : [],
    };

    const response = await axios.post(
      `/users/search?page=${page}&size=${size}`,
      filter,
    );
    return response.data;
  } catch (error) {
    console.error("Error searching users by role:", error);
    throw error;
  }
};
