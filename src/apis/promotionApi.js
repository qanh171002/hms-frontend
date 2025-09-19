import axios from "./axiosConfig";

export const getPromotions = async (page = 0, size = 10) => {
  try {
    const response = await axios.get("/promotions", {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching promotions:", error);
    throw error;
  }
};

export const searchPromotions = async (filterRequest, page = 0, size = 10) => {
  try {
    const response = await axios.post("/promotions/search", filterRequest, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching promotions:", error);
    throw error;
  }
};

export const createPromotion = async (promotionData) => {
  try {
    const response = await axios.post("/promotions", promotionData);
    return response.data;
  } catch (error) {
    console.error("Error creating promotion:", error);
    throw error;
  }
};

export const getPromotionById = async (id) => {
  try {
    const response = await axios.get(`/promotions/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching promotion:", error);
    throw error;
  }
};

export const updatePromotion = async (id, promotionData) => {
  try {
    const response = await axios.put(`/promotions/${id}`, promotionData);
    return response.data;
  } catch (error) {
    console.error("Error updating promotion:", error);
    throw error;
  }
};

export const deletePromotion = async (id) => {
  try {
    const response = await axios.delete(`/promotions/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting promotion:", error);
    throw error;
  }
};

export const getActivePromotion = async () => {
  try {
    const response = await axios.get("/promotions/active");
    return response.data;
  } catch (error) {
    console.error("Error fetching active promotion:", error);
    throw error;
  }
};
