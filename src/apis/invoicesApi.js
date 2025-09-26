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
    const processedData = {
      ...invoiceData,
      status: invoiceData.status?.toUpperCase() || "PENDING",
    };
    const response = await axios.post("/invoices", processedData);
    return response.data;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

export const updateInvoice = async (id, invoiceData) => {
  try {
    const processedData = {
      ...invoiceData,
      status: invoiceData.status?.toUpperCase() || "PENDING",
    };
    const response = await axios.put(`/invoices/${id}`, processedData);
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

export const filterInvoices = async (filters, page = 0, size = 10) => {
  try {
    const filterParams = {};

    if (filters.minAmount !== undefined && filters.minAmount !== "") {
      filterParams.minAmount = parseFloat(filters.minAmount);
    }
    if (filters.maxAmount !== undefined && filters.maxAmount !== "") {
      filterParams.maxAmount = parseFloat(filters.maxAmount);
    }
    if (filters.status && filters.status !== "") {
      filterParams.status = filters.status;
    }

    if (filters.issuedDateFrom && filters.issuedDateFrom !== "") {
      filterParams.issuedDateFrom = new Date(
        `${filters.issuedDateFrom}T12:00:00`,
      ).toISOString();
    }
    if (filters.issuedDateTo && filters.issuedDateTo !== "") {
      filterParams.issuedDateTo = new Date(
        `${filters.issuedDateTo}T11:59:59`,
      ).toISOString();
    }
    if (filters.dueDateFrom && filters.dueDateFrom !== "") {
      filterParams.dueDateFrom = new Date(
        `${filters.dueDateFrom}T12:00:00`,
      ).toISOString();
    }
    if (filters.dueDateTo && filters.dueDateTo !== "") {
      filterParams.dueDateTo = new Date(
        `${filters.dueDateTo}T11:59:59`,
      ).toISOString();
    }

    if (filters.paymentMethod && filters.paymentMethod !== "") {
      filterParams.paymentMethod = filters.paymentMethod;
    }
    if (filters.bookingId && String(filters.bookingId).trim() !== "") {
      filterParams.bookingId = parseInt(filters.bookingId);
    }

    const response = await axios.post("/invoices/filter", filterParams, {
      params: { page, size },
    });
    console.log("POST /invoices/filter response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error filtering invoices:", error);
    throw error;
  }
};

export const downloadInvoicePDF = async (invoiceId) => {
  try {
    const response = await axios.get(`/invoices/${invoiceId}/pdf`, {
      responseType: "blob",
    });

    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invoice-${invoiceId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return response.data;
  } catch (error) {
    console.error("Error downloading invoice PDF:", error);
    throw error;
  }
};
