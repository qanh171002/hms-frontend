import axios from "./axiosConfig";

export const getExtraCharges = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(
      `/extra-charges?page=${page}&size=${size}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching extra charges:", error);
    throw error;
  }
};

export const getExtraChargeById = async (id) => {
  try {
    const response = await axios.get(`/extra-charges/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching extra charge:", error);
    throw error;
  }
};

export const createExtraCharge = async (extraChargeData) => {
  try {
    const response = await axios.post("/extra-charges", extraChargeData);
    return response.data;
  } catch (error) {
    console.error("Error creating extra charge:", error);
    throw error;
  }
};

export const updateExtraCharge = async (id, extraChargeData) => {
  try {
    const response = await axios.put(`/extra-charges/${id}`, extraChargeData);
    return response.data;
  } catch (error) {
    console.error("Error updating extra charge:", error);
    throw error;
  }
};

export const deleteExtraCharge = async (id) => {
  try {
    const response = await axios.delete(`/extra-charges/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting extra charge:", error);
    throw error;
  }
};
