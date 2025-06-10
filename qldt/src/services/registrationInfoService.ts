import { useCallback } from "react";
import useApiService from "../hooks/useApiService";

// Interface cho thông tin học kỳ
export interface SemesterInfo {
  id: string;
  semesterNumber: number;
  academicYear: string;
  startDate: string;
  endDate: string;
  status: "active" | "upcoming" | "completed";
}

// Interface cho thông tin tiến độ học tập
export interface AcademicProgress {
  totalCredits: number;
  completedCredits: number;
  currentCredits: number;
  remainingCredits: number;
  expectedGraduationDate: string;
  gpa: number;
}

// Interface cho giai đoạn đăng ký học phần
export interface RegistrationPhase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  status: "completed" | "active" | "upcoming";
  eligibility?: string;
  timeSlot?: string;
}

// Interface cho quy định đăng ký học phần
export interface RegistrationRule {
  id: string;
  name: string;
  description: string;
}

// Interface cho thông báo đăng ký học phần
export interface RegistrationNotification {
  id: string;
  title: string;
  content: string;
  date: string;
  important: boolean;
}

// Interface cho hướng dẫn đăng ký học phần
export interface RegistrationGuide {
  id: string;
  step: number;
  title: string;
  description: string;
}

// Interface cho câu hỏi thường gặp
export interface RegistrationFAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// Hook để quản lý các API liên quan đến thông tin đăng ký học phần
export const useRegistrationInfoService = () => {
  const { fetchApi } = useApiService();

  // Lấy thông tin học kỳ hiện tại và sắp tới
  const getSemesterInfo = useCallback(async (): Promise<{
    currentSemester: SemesterInfo;
    upcomingSemester: SemesterInfo;
  }> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<{ currentSemester: SemesterInfo; upcomingSemester: SemesterInfo }>('/api/registration-info/semester-info');

      // Giả lập độ trễ của API
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Dữ liệu mẫu cho thông tin học kỳ
      const currentDate = new Date();

      const currentSemester: SemesterInfo = {
        id: "sem-2023-2",
        semesterNumber: 2,
        academicYear: "2023-2024",
        startDate: "2024-01-15T00:00:00.000Z",
        endDate: "2024-05-15T00:00:00.000Z",
        status: "active",
      };

      const upcomingSemester: SemesterInfo = {
        id: "sem-2024-1",
        semesterNumber: 1,
        academicYear: "2024-2025",
        startDate: "2024-08-15T00:00:00.000Z",
        endDate: "2024-12-31T00:00:00.000Z",
        status: "upcoming",
      };

      return {
        currentSemester,
        upcomingSemester,
      };
    } catch (error) {
      console.error("Error fetching semester info:", error);
      throw error;
    }
  }, [fetchApi]);

  // Lấy thông tin tiến độ học tập
  const getAcademicProgress =
    useCallback(async (): Promise<AcademicProgress> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<AcademicProgress>('/api/registration-info/academic-progress');

        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 600));

        // Dữ liệu mẫu cho thông tin tiến độ học tập
        const academicProgress: AcademicProgress = {
          totalCredits: 150,
          completedCredits: 95,
          currentCredits: 18,
          remainingCredits: 37,
          expectedGraduationDate: "2025-06-30T00:00:00.000Z",
          gpa: 3.2,
        };

        return academicProgress;
      } catch (error) {
        console.error("Error fetching academic progress:", error);
        throw error;
      }
    }, [fetchApi]);

  // Lấy lịch trình đăng ký học phần
  const getRegistrationSchedule = useCallback(
    async (semesterId: string): Promise<RegistrationPhase[]> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<RegistrationPhase[]>(`/api/registration-info/registration-schedule/${semesterId}`);

        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 700));

        // Dữ liệu mẫu cho lịch trình đăng ký học phần
        const currentDate = new Date();

        const registrationSchedule: RegistrationPhase[] = [
          {
            id: "phase-1",
            name: "Giai đoạn chuẩn bị",
            startDate: "2024-07-01T00:00:00.000Z",
            endDate: "2024-07-10T00:00:00.000Z",
            description:
              "Công bố danh sách học phần mở trong học kỳ. Sinh viên xem thông tin và lập kế hoạch đăng ký.",
            status: "completed",
          },
          {
            id: "phase-2",
            name: "Đợt đăng ký 1",
            startDate: "2024-07-15T00:00:00.000Z",
            endDate: "2024-07-20T00:00:00.000Z",
            description:
              "Dành cho sinh viên năm cuối và sinh viên có GPA từ 3.2 trở lên.",
            status: "active",
            eligibility:
              "Sinh viên năm cuối và sinh viên có GPA từ 3.2 trở lên",
            timeSlot: "08:00 - 22:00 hàng ngày",
          },
          {
            id: "phase-3",
            name: "Đợt đăng ký 2",
            startDate: "2024-07-22T00:00:00.000Z",
            endDate: "2024-07-27T00:00:00.000Z",
            description: "Dành cho tất cả sinh viên.",
            status: "upcoming",
            eligibility: "Tất cả sinh viên",
            timeSlot: "08:00 - 22:00 hàng ngày",
          },
          {
            id: "phase-4",
            name: "Đợt điều chỉnh",
            startDate: "2024-08-01T00:00:00.000Z",
            endDate: "2024-08-05T00:00:00.000Z",
            description: "Sinh viên có thể thêm/bớt học phần.",
            status: "upcoming",
            timeSlot: "08:00 - 22:00 hàng ngày",
          },
          {
            id: "phase-5",
            name: "Đợt rút học phần",
            startDate: "2024-08-15T00:00:00.000Z",
            endDate: "2024-08-30T00:00:00.000Z",
            description:
              "Sinh viên có thể rút học phần mà không bị điểm F. Học phí sẽ không được hoàn trả.",
            status: "upcoming",
          },
        ];

        return registrationSchedule;
      } catch (error) {
        console.error("Error fetching registration schedule:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Lấy quy định đăng ký học phần
  const getRegistrationRules = useCallback(async (): Promise<
    RegistrationRule[]
  > => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<RegistrationRule[]>('/api/registration-info/registration-rules');

      // Giả lập độ trễ của API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Dữ liệu mẫu cho quy định đăng ký học phần
      const registrationRules: RegistrationRule[] = [
        {
          id: "rule-1",
          name: "Số tín chỉ tối đa",
          description: "25 tín chỉ/học kỳ",
        },
        {
          id: "rule-2",
          name: "Số tín chỉ tối thiểu",
          description: "12 tín chỉ/học kỳ (trừ học kỳ cuối)",
        },
        {
          id: "rule-3",
          name: "Điều kiện tiên quyết",
          description:
            "Sinh viên phải hoàn thành các học phần tiên quyết trước khi đăng ký học phần kế tiếp",
        },
        {
          id: "rule-4",
          name: "Học phần trùng lịch",
          description:
            "Không được đăng ký các học phần có thời khóa biểu trùng nhau",
        },
        {
          id: "rule-5",
          name: "Học lại",
          description:
            "Sinh viên có thể đăng ký học lại các học phần có điểm dưới C",
        },
        {
          id: "rule-6",
          name: "Học vượt",
          description:
            "Sinh viên có GPA từ 3.2 trở lên có thể đăng ký vượt khung chương trình",
        },
        {
          id: "rule-7",
          name: "Học cải thiện",
          description:
            "Sinh viên có thể đăng ký học cải thiện các học phần đã đạt",
        },
      ];

      return registrationRules;
    } catch (error) {
      console.error("Error fetching registration rules:", error);
      throw error;
    }
  }, [fetchApi]);

  // Lấy thông báo đăng ký học phần
  const getRegistrationNotifications = useCallback(async (): Promise<
    RegistrationNotification[]
  > => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<RegistrationNotification[]>('/api/registration-info/notifications');

      // Giả lập độ trễ của API
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Dữ liệu mẫu cho thông báo đăng ký học phần
      const registrationNotifications: RegistrationNotification[] = [
        {
          id: "notif-1",
          title: "Thông báo quan trọng",
          content:
            "Đợt đăng ký học phần học kỳ 1 năm học 2024-2025 sẽ bắt đầu từ ngày 15/07/2024. Sinh viên vui lòng chuẩn bị kế hoạch học tập và đăng ký đúng thời gian quy định.",
          date: "2024-06-15T00:00:00.000Z",
          important: true,
        },
        {
          id: "notif-2",
          title: "Cập nhật danh sách học phần",
          content:
            "Danh sách học phần mở trong học kỳ 1 năm học 2024-2025 đã được cập nhật. Sinh viên có thể xem danh sách tại mục Đăng ký học phần.",
          date: "2024-06-20T00:00:00.000Z",
          important: false,
        },
        {
          id: "notif-3",
          title: "Thay đổi lịch đăng ký",
          content:
            "Lịch đăng ký học phần đợt 2 được điều chỉnh từ ngày 20/07/2024 sang ngày 22/07/2024. Sinh viên vui lòng lưu ý thay đổi này.",
          date: "2024-06-25T00:00:00.000Z",
          important: true,
        },
      ];

      return registrationNotifications;
    } catch (error) {
      console.error("Error fetching registration notifications:", error);
      throw error;
    }
  }, [fetchApi]);

  // Lấy hướng dẫn đăng ký học phần
  const getRegistrationGuide = useCallback(async (): Promise<
    RegistrationGuide[]
  > => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<RegistrationGuide[]>('/api/registration-info/guide');

      // Giả lập độ trễ của API
      await new Promise((resolve) => setTimeout(resolve, 400));

      // Dữ liệu mẫu cho hướng dẫn đăng ký học phần
      const registrationGuide: RegistrationGuide[] = [
        {
          id: "guide-1",
          step: 1,
          title: "Đăng nhập vào hệ thống quản lý đào tạo",
          description:
            "Sử dụng tài khoản và mật khẩu được cấp để đăng nhập vào hệ thống.",
        },
        {
          id: "guide-2",
          step: 2,
          title: "Chọn mục 'Đăng ký học phần' trong menu chính",
          description:
            "Sau khi đăng nhập, chọn mục 'Đăng ký học phần' trong menu chính để bắt đầu quá trình đăng ký.",
        },
        {
          id: "guide-3",
          step: 3,
          title: "Xem danh sách học phần được mở trong học kỳ",
          description:
            "Hệ thống sẽ hiển thị danh sách các học phần được mở trong học kỳ hiện tại. Bạn có thể sử dụng bộ lọc để tìm kiếm học phần theo mã, tên, khoa, loại học phần, v.v.",
        },
        {
          id: "guide-4",
          step: 4,
          title: "Chọn các học phần muốn đăng ký",
          description:
            "Chọn các học phần muốn đăng ký bằng cách tích vào ô bên cạnh tên học phần. Hệ thống sẽ kiểm tra các điều kiện tiên quyết và trùng lịch.",
        },
        {
          id: "guide-5",
          step: 5,
          title: "Xác nhận đăng ký",
          description:
            "Sau khi chọn xong các học phần, nhấn nút 'Xác nhận đăng ký' để hoàn tất quá trình đăng ký.",
        },
        {
          id: "guide-6",
          step: 6,
          title: "Kiểm tra kết quả đăng ký",
          description:
            "Sau khi đăng ký, bạn có thể kiểm tra kết quả đăng ký trong mục 'Kết quả đăng ký học phần'.",
        },
        {
          id: "guide-7",
          step: 7,
          title: "Thanh toán học phí",
          description:
            "Sau khi đăng ký học phần thành công, bạn cần thanh toán học phí trong thời hạn quy định để hoàn tất quá trình đăng ký.",
        },
      ];

      return registrationGuide;
    } catch (error) {
      console.error("Error fetching registration guide:", error);
      throw error;
    }
  }, [fetchApi]);

  // Lấy câu hỏi thường gặp
  const getRegistrationFAQs = useCallback(async (): Promise<
    RegistrationFAQ[]
  > => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<RegistrationFAQ[]>('/api/registration-info/faqs');

      // Giả lập độ trễ của API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Dữ liệu mẫu cho câu hỏi thường gặp
      const registrationFAQs: RegistrationFAQ[] = [
        {
          id: "faq-1",
          question:
            "Tôi có thể đăng ký tối đa bao nhiêu tín chỉ trong một học kỳ?",
          answer:
            "Sinh viên có thể đăng ký tối đa 25 tín chỉ trong một học kỳ. Riêng sinh viên có GPA từ 3.2 trở lên có thể đăng ký tối đa 30 tín chỉ.",
          category: "general",
        },
        {
          id: "faq-2",
          question: "Làm thế nào để đăng ký học phần khi bị trùng lịch?",
          answer:
            "Hệ thống không cho phép đăng ký các học phần bị trùng lịch. Sinh viên cần chọn lớp học phần khác hoặc đăng ký học phần đó vào học kỳ sau.",
          category: "technical",
        },
        {
          id: "faq-3",
          question: "Tôi có thể hủy đăng ký học phần sau khi đã đăng ký không?",
          answer:
            "Sinh viên có thể hủy đăng ký học phần trong thời gian điều chỉnh đăng ký. Sau thời gian này, sinh viên có thể rút học phần nhưng sẽ không được hoàn trả học phí.",
          category: "policy",
        },
        {
          id: "faq-4",
          question:
            "Tôi không thể đăng ký học phần vì điều kiện tiên quyết. Tôi phải làm gì?",
          answer:
            "Sinh viên cần hoàn thành các học phần tiên quyết trước khi đăng ký học phần kế tiếp. Trong trường hợp đặc biệt, sinh viên có thể liên hệ với phòng đào tạo để được xem xét.",
          category: "technical",
        },
        {
          id: "faq-5",
          question:
            "Tôi đã đăng ký học phần nhưng chưa thanh toán học phí. Tôi có bị hủy đăng ký không?",
          answer:
            "Sinh viên cần thanh toán học phí trong thời hạn quy định. Nếu không thanh toán đúng hạn, đăng ký học phần sẽ bị hủy.",
          category: "policy",
        },
      ];

      return registrationFAQs;
    } catch (error) {
      console.error("Error fetching registration FAQs:", error);
      throw error;
    }
  }, [fetchApi]);

  return {
    getSemesterInfo,
    getAcademicProgress,
    getRegistrationSchedule,
    getRegistrationRules,
    getRegistrationNotifications,
    getRegistrationGuide,
    getRegistrationFAQs,
  };
};

export default useRegistrationInfoService;
