import apiClient from "./axiosConfig";

export const getBookings = async (page = 0, size = 10) => {
  try {
    const response = await apiClient.get("/bookings", {
      params: { page, size },
    });
    console.log("GET /bookings response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

export const createBooking = async (booking) => {
  try {
    const bookingData = {
      guestFullName: booking.guestFullName,
      guestIdNumber: booking.guestIdNumber || "",
      guestNationality: booking.guestNationality || "",
      roomNumber: parseInt(booking.roomNumber),
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      actualCheckInTime: null,
      actualCheckOutTime: null,
      bookingType: (booking.bookingType || "Daily").toUpperCase(),
      status: (booking.status || "Unconfirmed").toUpperCase(),
      numberOfGuests: parseInt(booking.numberOfGuests) || 1,
      notes: booking.notes || "",
      cancelReason: "",
    };

    const response = await apiClient.post("/bookings", bookingData);
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const getBookingById = async (id) => {
  try {
    const response = await apiClient.get(`/bookings/${id}`);
    console.log("getBookingById - Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching booking with id ${id}:`, error);
    throw error;
  }
};

export const updateBooking = async (id, booking) => {
  try {
    const bookingData = {
      id: parseInt(id),
      guestFullName: booking.guestFullName,
      guestIdNumber: booking.guestIdNumber || "",
      guestNationality: booking.guestNationality || "",
      roomNumber: parseInt(booking.roomNumber),
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      actualCheckInTime: booking.actualCheckInTime || null,
      actualCheckOutTime: booking.actualCheckOutTime || null,
      bookingType: (booking.bookingType || "Daily").toUpperCase(),
      status: (booking.status || "Unconfirmed").toUpperCase(),
      numberOfGuests: parseInt(booking.numberOfGuests) || 1,
      notes: booking.notes || "",
      cancelReason: booking.cancelReason || "",
    };

    console.log("Sending booking data to PUT /bookings:", bookingData);
    const response = await apiClient.put(`/bookings/${id}`, bookingData);
    return response.data;
  } catch (error) {
    console.error(`Error updating booking with id ${id}:`, error);
    throw error;
  }
};

export const deleteBooking = async (id) => {
  try {
    await apiClient.delete(`/bookings/${id}`);
  } catch (error) {
    console.error(`Error deleting booking with id ${id}:`, error);
    throw error;
  }
};

export const filterBookings = async (filters, page = 0, size = 10) => {
  try {
    const filterParams = {};

    if (filters.guestFullName && filters.guestFullName !== "") {
      filterParams.guestFullName = filters.guestFullName;
    }
    if (filters.guestIdNumber && filters.guestIdNumber !== "") {
      filterParams.guestIdNumber = filters.guestIdNumber;
    }
    if (filters.guestNationality && filters.guestNationality !== "") {
      filterParams.guestNationality = filters.guestNationality;
    }
    if (filters.roomNumber && String(filters.roomNumber).trim() !== "") {
      filterParams.roomId = parseInt(filters.roomNumber);
    }

    if (filters.checkInDateFrom && filters.checkInDateFrom !== "") {
      filterParams.checkInDateFrom = new Date(
        `${filters.checkInDateFrom}T12:00:00`,
      ).toISOString();
    }
    if (filters.checkInDateTo && filters.checkInDateTo !== "") {
      filterParams.checkInDateTo = new Date(
        `${filters.checkInDateTo}T11:59:59`,
      ).toISOString();
    }
    if (filters.checkOutDateFrom && filters.checkOutDateFrom !== "") {
      filterParams.checkOutDateFrom = new Date(
        `${filters.checkOutDateFrom}T12:00:00`,
      ).toISOString();
    }
    if (filters.checkOutDateTo && filters.checkOutDateTo !== "") {
      filterParams.checkOutDateTo = new Date(
        `${filters.checkOutDateTo}T11:59:59`,
      ).toISOString();
    }

    if (filters.bookingType && filters.bookingType !== "") {
      filterParams.bookingType = filters.bookingType;
    }
    if (filters.status && filters.status !== "") {
      filterParams.status = filters.status;
    }

    if (
      filters.numberOfGuestsMin !== undefined &&
      filters.numberOfGuestsMin !== ""
    ) {
      filterParams.numberOfGuestsMin = parseInt(filters.numberOfGuestsMin);
    }
    if (
      filters.numberOfGuestsMax !== undefined &&
      filters.numberOfGuestsMax !== ""
    ) {
      filterParams.numberOfGuestsMax = parseInt(filters.numberOfGuestsMax);
    }

    const response = await apiClient.post("/bookings/filter", filterParams, {
      params: { page, size },
    });
    console.log("POST /bookings/filter response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error filtering bookings:", error);
    throw error;
  }
};
