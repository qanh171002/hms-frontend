import apiClient from "./axiosConfig";

export const getNotifications = async () => {
  try {
    const response = await apiClient.get("/notifications");
    console.log("GET /notifications response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const getUnreadCount = async () => {
  try {
    const response = await apiClient.get("/notifications/unread-count");
    console.log("GET /notifications/unread-count response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching unread count:", error);
    throw error;
  }
};

export const markNotificationAsRead = async (id) => {
  try {
    const response = await apiClient.put(`/notifications/${id}/read`);
    console.log(`PUT /notifications/${id}/read response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error marking notification ${id} as read:`, error);
    throw error;
  }
};

export const deleteNotification = async (id) => {
  try {
    await apiClient.delete(`/notifications/${id}`);
    console.log(`DELETE /notifications/${id} successful`);
  } catch (error) {
    console.error(`Error deleting notification ${id}:`, error);
    throw error;
  }
};
