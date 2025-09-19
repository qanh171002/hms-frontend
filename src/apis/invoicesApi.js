import axios from "./axiosConfig";

export const getInvoices = async (page = 0, size = 10) => {
  try {
    const response = await axios.get("/invoices", {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

export const getInvoiceById = async (id) => {
  try {
    const response = await axios.get(`/invoices/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching invoice:", error);
    throw error;
  }
};

export const createInvoice = async (invoiceData) => {
  try {
    const response = await axios.post("/invoices", invoiceData);
    return response.data;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

export const updateInvoice = async (id, invoiceData) => {
  try {
    const response = await axios.put(`/invoices/${id}`, invoiceData);
    return response.data;
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
};

export const deleteInvoice = async (id) => {
  try {
    const response = await axios.delete(`/invoices/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw error;
  }
};
