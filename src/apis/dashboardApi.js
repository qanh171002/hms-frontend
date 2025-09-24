import apiClient from "./axiosConfig";

export const getDashboardData = async () => {
  try {
    const response = await apiClient.get("/dashboard/summary");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

export default {
  getDashboardData,
};
