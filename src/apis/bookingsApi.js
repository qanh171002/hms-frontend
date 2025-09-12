import apiClient from "./axiosConfig";

export const getBookings = async () => {
  try {
    const response = await apiClient.get("/bookings");
    console.log("GET /bookings response:", response.data);
    return response.data.content || [];
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
      bookingType: booking.bookingType || "Standard",
      status: booking.status || "Unconfirmed",
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
      bookingType: booking.bookingType || "Hourly",
      status: booking.status || "Unconfirmed",
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
