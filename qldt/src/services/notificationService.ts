import useApiService from "../hooks/useApiService";
import { useCallback } from "react";

// Định nghĩa kiểu dữ liệu cho thông báo
export interface Notification {
  id: string;
  title: string;
  content: string;
  date: string;
  department: string;
  author: string;
  type: "important" | "academic" | "event" | "default";
  important: boolean;
  unread: boolean;
  attachments?: string[];
}

// Service để quản lý các API liên quan đến thông báo
export const useNotificationService = () => {
  const { fetchApi } = useApiService();

  // Lấy danh sách thông báo
  const getNotifications = useCallback(async (): Promise<Notification[]> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<Notification[]>('/api/notifications');

      // Giả lập độ trễ của API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Dữ liệu mẫu
      const mockData: Notification[] = [
        {
          id: "1",
          title: "Thông báo về việc đóng học phí học kỳ 2 năm học 2023-2024",
          content:
            "Phòng Tài chính - Kế toán thông báo đến toàn thể sinh viên về việc đóng học phí học kỳ 2 năm học 2023-2024. Thời hạn đóng học phí từ ngày 15/05/2024 đến hết ngày 30/05/2024. Sinh viên vui lòng đóng học phí đúng thời hạn để tránh ảnh hưởng đến việc học tập.",
          date: "15/05/2024",
          department: "Phòng Tài chính - Kế toán",
          author: "Nguyễn Văn X",
          type: "important",
          important: true,
          unread: true,
          attachments: ["thong-bao-hoc-phi.pdf"],
        },
        {
          id: "2",
          title: "Kế hoạch thi kết thúc học phần học kỳ 2 năm học 2023-2024",
          content:
            "Phòng Đào tạo thông báo kế hoạch thi kết thúc học phần học kỳ 2 năm học 2023-2024. Thời gian thi từ ngày 20/06/2024 đến ngày 05/07/2024. Sinh viên vui lòng theo dõi lịch thi cụ thể trên cổng thông tin sinh viên.",
          date: "10/05/2024",
          department: "Phòng Đào tạo",
          author: "Trần Thị Y",
          type: "academic",
          important: false,
          unread: false,
          attachments: ["ke-hoach-thi.pdf", "lich-thi.xlsx"],
        },
        {
          id: "3",
          title: "Thông báo về việc tổ chức Ngày hội việc làm năm 2024",
          content:
            "Trung tâm Hỗ trợ việc làm sinh viên thông báo về việc tổ chức Ngày hội việc làm năm 2024. Thời gian: 08:00 - 16:00, ngày 25/05/2024. Địa điểm: Sân vận động trường. Sinh viên năm cuối và cựu sinh viên được khuyến khích tham dự.",
          date: "05/05/2024",
          department: "Trung tâm Hỗ trợ việc làm sinh viên",
          author: "Lê Văn Z",
          type: "event",
          important: false,
          unread: true,
          attachments: ["poster-ngay-hoi-viec-lam.jpg"],
        },
        {
          id: "4",
          title:
            "Thông báo về việc đăng ký học phần học kỳ 1 năm học 2024-2025",
          content:
            "Phòng Đào tạo thông báo về việc đăng ký học phần học kỳ 1 năm học 2024-2025. Thời gian đăng ký từ ngày 01/06/2024 đến hết ngày 15/06/2024. Sinh viên vui lòng đăng ký học phần đúng thời hạn.",
          date: "01/05/2024",
          department: "Phòng Đào tạo",
          author: "Trần Thị Y",
          type: "academic",
          important: true,
          unread: false,
          attachments: ["huong-dan-dang-ky-hoc-phan.pdf"],
        },
        {
          id: "5",
          title:
            "Thông báo về việc tổ chức khám sức khỏe đầu năm cho sinh viên",
          content:
            "Trạm Y tế thông báo về việc tổ chức khám sức khỏe đầu năm cho sinh viên. Thời gian: Từ ngày 10/05/2024 đến ngày 20/05/2024. Địa điểm: Trạm Y tế trường. Sinh viên vui lòng mang theo thẻ sinh viên và thẻ bảo hiểm y tế.",
          date: "28/04/2024",
          department: "Trạm Y tế",
          author: "Phạm Thị W",
          type: "important",
          important: false,
          unread: false,
          attachments: [],
        },
        {
          id: "6",
          title:
            "Thông báo về việc tổ chức Hội thảo khoa học sinh viên năm 2024",
          content:
            "Phòng Khoa học Công nghệ thông báo về việc tổ chức Hội thảo khoa học sinh viên năm 2024. Thời gian: 08:00 - 16:00, ngày 15/06/2024. Địa điểm: Hội trường lớn. Sinh viên có nghiên cứu khoa học vui lòng đăng ký tham gia.",
          date: "25/04/2024",
          department: "Phòng Khoa học Công nghệ",
          author: "Nguyễn Văn V",
          type: "event",
          important: false,
          unread: false,
          attachments: ["mau-dang-ky-hoi-thao.docx"],
        },
        {
          id: "7",
          title: "Thông báo về việc nghỉ lễ 30/4 và 01/5",
          content:
            "Phòng Hành chính thông báo về việc nghỉ lễ 30/4 và 01/5. Thời gian nghỉ: Từ ngày 30/04/2024 đến hết ngày 01/05/2024. Sinh viên vui lòng theo dõi thông báo về việc học bù (nếu có).",
          date: "20/04/2024",
          department: "Phòng Hành chính",
          author: "Trần Văn U",
          type: "academic",
          important: false,
          unread: false,
          attachments: [],
        },
        {
          id: "8",
          title:
            'Thông báo về việc tổ chức cuộc thi "Ý tưởng sáng tạo sinh viên" năm 2024',
          content:
            'Đoàn Thanh niên - Hội Sinh viên thông báo về việc tổ chức cuộc thi "Ý tưởng sáng tạo sinh viên" năm 2024. Thời gian nhận bài dự thi: Từ ngày 01/05/2024 đến hết ngày 31/05/2024. Sinh viên quan tâm vui lòng đăng ký tham gia.',
          date: "15/04/2024",
          department: "Đoàn Thanh niên - Hội Sinh viên",
          author: "Lê Thị T",
          type: "event",
          important: false,
          unread: false,
          attachments: ["the-le-cuoc-thi.pdf"],
        },
      ];

      return mockData;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }, [fetchApi]);

  // Đánh dấu thông báo đã đọc
  const markAsRead = useCallback(
    async (id: string): Promise<void> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        /*
      await fetchApi(`/api/notifications/${id}/read`, {
        method: 'PUT',
        showError: true
      });
      */

        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 300));

        console.log(`Đã đánh dấu thông báo ${id} là đã đọc`);
      } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Đánh dấu tất cả thông báo đã đọc
  const markAllAsRead = useCallback(async (): Promise<void> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      /*
      await fetchApi('/api/notifications/read-all', {
        method: 'PUT',
        showError: true
      });
      */

      // Giả lập độ trễ của API
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log("Đã đánh dấu tất cả thông báo là đã đọc");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }, [fetchApi]);

  return {
    getNotifications,
    markAsRead,
    markAllAsRead,
  };
};

export default useNotificationService;
