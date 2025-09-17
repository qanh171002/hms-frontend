import axios from "./axiosConfig";

export const getDashboardSummary = async () => {
  const response = await axios.get("/dashboard/summary");
  return response.data;
};

export default {
  getDashboardSummary,
};
