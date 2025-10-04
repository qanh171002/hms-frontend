import { useState, useRef, useEffect } from "react";
import { HiBell, HiOutlineBell, HiXMark, HiCheck } from "react-icons/hi2";
import { useNotifications } from "../hooks/useNotifications";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const {
    notifications,
    isLoading,
    unreadCount,
    refreshNotifications,
    lastUpdated,
    markAsRead,
    deleteNotification,
    markAllAsRead,
  } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatNotificationTime = (createdAt) => {
    const notificationDate = new Date(createdAt);
    const now = new Date();
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return notificationDate.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const getNotificationTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "checkout":
        return "text-orange-600 bg-orange-50";
      case "booking":
        return "text-blue-600 bg-blue-50";
      case "payment":
        return "text-green-600 bg-green-50";
      case "system":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-purple-600 bg-purple-50";
    }
  };

  const handleMarkAsRead = (id, e) => {
    e.stopPropagation();
    markAsRead(id);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    deleteNotification(id);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
        aria-label="Thông báo"
      >
        {unreadCount > 0 ? (
          <HiBell className="h-6 w-6 text-blue-500" />
        ) : (
          <HiOutlineBell className="h-6 w-6" />
        )}

        {/* Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="fixed top-16 right-2 z-[99999] w-[calc(100vw-1rem)] max-w-sm rounded-lg border border-gray-200 bg-white shadow-lg sm:absolute sm:top-auto sm:right-0 sm:mt-2 sm:w-80 sm:max-w-sm md:w-72 md:max-w-sm lg:w-80 lg:max-w-md xl:w-96 xl:max-w-lg 2xl:w-[28rem] 2xl:max-w-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-3 py-3 sm:px-4">
            <h3 className="flex-shrink-0 text-sm font-semibold text-gray-800">
              Notifications
            </h3>
            <div className="ml-2 flex flex-shrink-0 items-center gap-1 sm:gap-1 md:gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex-shrink-0 text-xs whitespace-nowrap text-green-600 transition-colors hover:text-green-800"
                >
                  <span className="hidden md:inline">Mark all as read</span>
                  <span className="md:hidden">Mark all</span>
                </button>
              )}
              <button
                onClick={refreshNotifications}
                className="flex-shrink-0 text-xs whitespace-nowrap text-blue-600 transition-colors hover:text-blue-800"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[40vh] overflow-y-auto sm:max-h-80 md:max-h-96 lg:max-h-[28rem] xl:max-h-[32rem]">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <HiOutlineBell className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 transition-colors hover:bg-gray-50 sm:p-4 md:p-4 ${
                      !notification.read ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-2 sm:space-x-3 md:space-x-3">
                      <div className="flex-shrink-0">
                        <div
                          className={`mt-2 h-2 w-2 rounded-full ${
                            !notification.read ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        ></div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2 md:gap-2">
                              <p
                                className={`w-fit rounded-full px-2 py-1 text-xs ${getNotificationTypeColor(notification.type)}`}
                              >
                                {notification.type}
                              </p>
                              <span className="text-xs text-gray-500">
                                {formatNotificationTime(notification.createdAt)}
                              </span>
                            </div>
                            <p className="mb-1 text-sm font-medium break-words text-gray-800">
                              {notification.title}
                            </p>
                            <p className="text-sm break-words text-gray-600">
                              {notification.message}
                            </p>
                          </div>
                          <div className="ml-2 flex flex-shrink-0 items-center gap-1">
                            {!notification.read && (
                              <button
                                onClick={(e) =>
                                  handleMarkAsRead(notification.id, e)
                                }
                                className="rounded p-1 text-green-600 transition-colors hover:bg-green-100"
                                title="Mark as read"
                              >
                                <HiCheck className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={(e) => handleDelete(notification.id, e)}
                              className="rounded p-1 text-red-600 transition-colors hover:bg-red-100"
                              title="Delete notification"
                            >
                              <HiXMark className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="rounded-b-lg border-t border-gray-200 bg-gray-50 px-3 py-3 sm:px-4 md:px-4">
              <div className="flex flex-col gap-1 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  {notifications.length} notifications
                  {unreadCount > 0 && (
                    <span className="ml-1 font-medium text-blue-600">
                      ({unreadCount} unread)
                    </span>
                  )}
                </span>
                {lastUpdated && (
                  <span className="text-xs">
                    Updated: {lastUpdated.toLocaleTimeString("vi-VN")}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
