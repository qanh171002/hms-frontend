import axios from "./axiosConfig";

export const getAssets = async () => {
  try {
    const response = await axios.get("/assets");
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
    const response = await axios.post("/assets", assetData);
    return response.data;
  } catch (error) {
    console.error("Error creating asset:", error);
    throw error;
  }
};

export const updateAsset = async (id, assetData) => {
  try {
    const response = await axios.put(`/assets/${id}`, assetData);
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
