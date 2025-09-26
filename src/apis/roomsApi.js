import apiClient from "./axiosConfig";

export const getRooms = async (page = 0, size = 10) => {
  try {
    const res = await apiClient.get("/rooms", { params: { page, size } });
    if (!res || !res.data) {
      return { content: [], totalPages: 1, totalElements: 0 };
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return { content: [], totalPages: 1, totalElements: 0 };
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
    const processedRoom = {
      ...room,
      status: room.status?.toUpperCase() || "AVAILABLE",
    };
    const res = await apiClient.post("/rooms", processedRoom);
    return res.data;
  } catch (error) {
    console.log("Error creating room:", error);
    throw error;
  }
};

export const updateRoom = async (id, room) => {
  try {
    const processedRoom = {
      ...room,
      status: room.status?.toUpperCase() || "AVAILABLE",
    };
    const response = await apiClient.put(`/rooms/${id}`, processedRoom);
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

export const filterRooms = async (filters, page = 0, size = 10) => {
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
        `${filters.desiredCheckIn}T12:00:00`,
      ).toISOString();
    }

    if (filters.desiredCheckOut && filters.desiredCheckOut !== "") {
      filterParams.desiredCheckOut = new Date(
        `${filters.desiredCheckOut}T11:59:59`,
      ).toISOString();
    }

    const requestBody =
      Object.keys(filterParams).length > 0 ? filterParams : {};

    console.log("Filter params:", requestBody);

    console.log("Filter params:", filterParams);

    const res = await apiClient.post(
      `/rooms/filter?page=${page}&size=${size}`,
      filterParams,
    );

    if (!res || !res.data) {
      console.warn("Empty response from /rooms/filter");
      return { content: [], totalPages: 1, totalElements: 0 };
    }

    return res.data;
  } catch (error) {
    console.error("Error filtering rooms:", error);
    return { content: [], totalPages: 1, totalElements: 0 };
  }
};
