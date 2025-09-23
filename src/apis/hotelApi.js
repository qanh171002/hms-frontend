import apiClient from "./axiosConfig";

export const getHotelInfo = async () => {
  try {
    const response = await apiClient.get("/hotel-info");
    console.log("GET /hotel-info response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching hotel info:", error);
    throw error;
  }
};

export const updateHotelInfo = async (hotelData) => {
  try {
    const response = await apiClient.put("/hotel-info", hotelData);
    console.log("PUT /hotel-info response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating hotel info:", error);
    throw error;
  }
};
