import axios from "./axiosConfig";

export const getAssets = async (page = 0, size = 10) => {
  try {
    const response = await axios.get("/assets", {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching assets:", error);
    throw error;
  }
};

export const getAssetById = async (id) => {
  try {
    const response = await axios.get(`/assets/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching asset:", error);
    throw error;
  }
};

export const createAsset = async (assetData) => {
  try {
    const processedData = {
      ...assetData,
      condition: assetData.condition?.toUpperCase() || "GOOD",
    };
    const response = await axios.post("/assets", processedData);
    return response.data;
  } catch (error) {
    console.error("Error creating asset:", error);
    throw error;
  }
};

export const updateAsset = async (id, assetData) => {
  try {
    const processedData = {
      ...assetData,
      condition: assetData.condition?.toUpperCase() || "GOOD",
    };
    const response = await axios.put(`/assets/${id}`, processedData);
    return response.data;
  } catch (error) {
    console.error("Error updating asset:", error);
    throw error;
  }
};

export const deleteAsset = async (id) => {
  try {
    const response = await axios.delete(`/assets/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting asset:", error);
    throw error;
  }
};

export const getAssetsByRoomId = async (roomId) => {
  try {
    const response = await axios.get(`/assets/room/${roomId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching assets by room:", error);
    throw error;
  }
};
