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

export const getRoomById = async (id) => {
  try {
    const res = await apiClient.get(`/rooms/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching room with id ${id}:`, error);
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

export const updateRoom = async (id, room) => {
  try {
    const response = await apiClient.put(`/rooms/${id}`, room);
    return {
      id: response.data.id,
      roomNumber: response.data.roomNumber,
      maxOccupancy: response.data.maxOccupancy,
      roomType: response.data.roomType,
      status: response.data.status,
      location: response.data.location,
      prices: response.data.prices || [],
    };
  } catch (error) {
    console.error(`Error updating room with id ${id}:`, error);
    throw error;
  }
};

export const deleteRoom = async (id) => {
  try {
    await apiClient.delete(`/rooms/${id}`);
  } catch (error) {
    console.error(`Error deleting room with id ${id}:`, error);
    throw error;
  }
};

export const filterRooms = async (filters) => {
  try {
    const filterParams = {};

    if (filters.roomType && filters.roomType !== "") {
      filterParams.roomType = filters.roomType;
    }

    if (filters.status && filters.status !== "") {
      filterParams.status = filters.status;
    }

    if (filters.location && filters.location !== "") {
      filterParams.location = filters.location;
    }

    if (filters.maxOccupancy && filters.maxOccupancy !== "") {
      filterParams.maxOccupancy = parseInt(filters.maxOccupancy);
    }

    if (filters.desiredCheckIn && filters.desiredCheckIn !== "") {
      filterParams.desiredCheckIn = new Date(
        filters.desiredCheckIn,
      ).toISOString();
    }

    if (filters.desiredCheckOut && filters.desiredCheckOut !== "") {
      filterParams.desiredCheckOut = new Date(
        filters.desiredCheckOut,
      ).toISOString();
    }

    console.log("Filter params:", filterParams);

    const res = await apiClient.post("/rooms/filter", filterParams);
    console.log("Filter response:", res.data);
    return res.data.content || [];
  } catch (error) {
    console.error("Error filtering rooms:", error);
    throw error;
  }
};
