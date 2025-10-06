import axios from "./axiosConfig";

export const createBookingExtraCharge = async (payload) => {
  try {
    const response = await axios.post("/booking-extra-charges", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating booking extra charge:", error);
    throw error;
  }
};

export const getBookingExtraChargeById = async (id) => {
  try {
    const response = await axios.get(`/booking-extra-charges/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching booking extra charge:", error);
    throw error;
  }
};

export const updateBookingExtraCharge = async (id, payload) => {
  try {
    const response = await axios.put(`/booking-extra-charges/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating booking extra charge:", error);
    throw error;
  }
};

export const deleteBookingExtraCharge = async (id) => {
  try {
    const response = await axios.delete(`/booking-extra-charges/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting booking extra charge:", error);
    throw error;
  }
};
