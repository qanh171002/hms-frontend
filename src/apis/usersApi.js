import apiClient from "./axiosConfig";

export const getCurrentUser = async () => {
  try {
    const res = await apiClient.get("/users/me");
    return res.data;
  } catch (error) {
    console.log("Get current user error: ", error);
    throw error;
  }
};

export const updateUserProfile = async (userId, userData) => {
  try {
    const res = await apiClient.put(`/users/${userId}`, userData);
    return res.data;
  } catch (error) {
    console.log("Update user profile error: ", error);
    throw error;
  }
};
