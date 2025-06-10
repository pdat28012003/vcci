import { useState, useEffect, useCallback } from "react";
import useNotificationService, {
  Notification,
} from "../services/notificationService";
import { useToast } from "./useUtils";

// Custom hook để lấy và quản lý danh sách thông báo
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sử dụng notification service
  const {
    getNotifications,
    markAsRead: apiMarkAsRead,
    markAllAsRead: apiMarkAllAsRead,
  } = useNotificationService();
  const { showToast } = useToast();

  // Lấy danh sách thông báo
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await getNotifications();
        setNotifications(data);
        setLoading(false);
      } catch (err) {
        setError("Có lỗi xảy ra khi tải thông báo");
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [getNotifications]);

  // Hàm đánh dấu thông báo đã đọc
  const markAsRead = useCallback(
    async (id: string) => {
      try {
        await apiMarkAsRead(id);

        // Cập nhật state
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === id
              ? { ...notification, unread: false }
              : notification
          )
        );
      } catch (error) {
        showToast("Có lỗi xảy ra khi cập nhật trạng thái thông báo", "error");
        console.error("Error in markAsRead:", error);
      }
    },
    [apiMarkAsRead, showToast]
  );

  // Hàm đánh dấu tất cả thông báo đã đọc
  const markAllAsRead = useCallback(async () => {
    try {
      await apiMarkAllAsRead();

      // Cập nhật state
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, unread: false }))
      );

      showToast("Đã đánh dấu tất cả thông báo là đã đọc", "success");
    } catch (error) {
      showToast("Có lỗi xảy ra khi cập nhật trạng thái thông báo", "error");
      console.error("Error in markAllAsRead:", error);
    }
  }, [apiMarkAllAsRead, showToast]);

  return {
    notifications,
    loading,
    error,
    markAsRead,
    markAllAsRead,
  };
};

export default useNotifications;
export type { Notification };
