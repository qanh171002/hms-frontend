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

export const searchAssets = async (filters, page = 0, size = 10) => {
  try {
    const cleanFilters = {};

    if (filters.name && filters.name.trim() !== "") {
      cleanFilters.name = filters.name.trim();
    }
    if (filters.category && filters.category.trim() !== "") {
      cleanFilters.category = filters.category.trim();
    }
    if (filters.condition && filters.condition.trim() !== "") {
      cleanFilters.condition = filters.condition.trim();
    }
    if (filters.minCost && filters.minCost !== "") {
      cleanFilters.minCost = parseFloat(filters.minCost);
    }
    if (filters.maxCost && filters.maxCost !== "") {
      cleanFilters.maxCost = parseFloat(filters.maxCost);
    }
    if (filters.purchaseDateFrom && filters.purchaseDateFrom.trim() !== "") {
      cleanFilters.purchaseDateFrom = filters.purchaseDateFrom;
    }
    if (filters.purchaseDateTo && filters.purchaseDateTo.trim() !== "") {
      cleanFilters.purchaseDateTo = filters.purchaseDateTo;
    }
    if (filters.roomNumber && filters.roomNumber !== "") {
      cleanFilters.roomNumber = parseInt(filters.roomNumber);
    }

    console.log("Searching assets with filters:", cleanFilters);

    const response = await axios.post("/assets/search", cleanFilters, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching assets:", error);
    throw error;
  }
};
