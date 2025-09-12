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

export const createRoom = async (room) => {
  try {
    const res = await apiClient.post("/rooms", room);
    return res.data;
  } catch (error) {
    console.log("Error creating room:", error);
    throw error;
  }
};
