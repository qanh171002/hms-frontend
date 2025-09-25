import apiClient from "./axiosConfig";

export const getDashboardData = async (days = 7) => {
  try {
    console.log(`Fetching dashboard data for ${days} days...`);
    const response = await apiClient.get(`/dashboard/summary?days=${days}`);
    console.log("Dashboard API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    throw error;
  }
};

export default {
  getDashboardData,
};
