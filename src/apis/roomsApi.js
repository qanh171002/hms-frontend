import apiClient from "./axiosConfig";

export const getRooms = async () => {
  try {
    const res = await apiClient.get("/rooms");
    console.log(res.data);
    return res.data.content || [];
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
};
