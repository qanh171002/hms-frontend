import { useState, useEffect, useCallback } from "react";
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  deleteNotification,
} from "../apis/notificationsApi";
import { NotificationContext } from "./NotificationContext";
import { useAuth } from "../hooks/useAuth";

export const NotificationProvider = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const [notificationsData, unreadCountData] = await Promise.all([
        getNotifications(),
        getUnreadCount(),
      ]);
      setNotifications(notificationsData || []);
      setUnreadCount(unreadCountData || 0);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !user) {
      setNotifications([]);
      setUnreadCount(0);
      setLastUpdated(null);
      return;
    }

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchNotifications, isLoggedIn, user]);

  const markAsRead = useCallback(async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, []);

  const deleteNotificationById = useCallback(async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => {
        const notification = prev.find((n) => n.id === id);
        const wasUnread = notification && !notification.read;
        const newNotifications = prev.filter((n) => n.id !== id);
        if (wasUnread) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
        return newNotifications;
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.read);
      await Promise.all(
        unreadNotifications.map((n) => markNotificationAsRead(n.id)),
      );

      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true })),
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  }, [notifications]);

  const refreshNotifications = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const value = {
    notifications,
    unreadCount,
    isLoading,
    lastUpdated,
    markAsRead,
    deleteNotification: deleteNotificationById,
    markAllAsRead,
    refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
