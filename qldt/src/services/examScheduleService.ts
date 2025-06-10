import { useCallback } from "react";
import useApiService from "../hooks/useApiService";

// Interface cho thông tin chung về lịch thi
export interface ExamScheduleInfo {
  studentId: string;
  studentName: string;
  major: string;
  class: string;
  currentSemester: string;
}

// Interface cho học kỳ
export interface SemesterInfo {
  id: string;
  name: string;
  isCurrent: boolean;
}

// Interface cho loại kỳ thi
export enum ExamType {
  ALL = "all",
  MIDTERM = "midterm",
  FINAL = "final",
  MAKEUP = "makeup",
}

// Interface cho thông báo lịch thi
export interface ExamNotification {
  id: string;
  title: string;
  date: string;
  author: string;
  content: string;
  isImportant: boolean;
}

// Interface cho thống kê lịch thi
export interface ExamStats {
  totalExams: number;
  daysUntilExam: number;
  completedExams: number;
  remainingExams: number;
  examRooms: string[];
  lastUpdated: string;
  nextExamDate: string;
  examType: string;
}

// Interface cho lịch thi
export interface ExamSchedule {
  id: string;
  courseCode: string;
  courseName: string;
  examDate: string;
  startTime: string;
  endTime: string;
  room: string;
  className: string;
  examType: ExamType;
  examFormat: string;
  notes: string;
  status: "upcoming" | "completed" | "cancelled";
  dayOfWeek: number; // 2-8 (Thứ 2 đến Chủ nhật)
}

// Interface cho quy định thi
export interface ExamRegulation {
  id: string;
  title: string;
  icon: string;
  content: string;
}

// Hook để quản lý các API liên quan đến lịch thi
export const useExamScheduleService = () => {
  const { fetchApi } = useApiService();

  // Lấy thông tin chung về lịch thi
  const getExamScheduleInfo = useCallback(async (): Promise<ExamScheduleInfo> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<ExamScheduleInfo>('/api/exam-schedule/info');

      // Dữ liệu mẫu cho thông tin chung
      const examScheduleInfo: ExamScheduleInfo = {
        studentId: "20020001",
        studentName: "Nguyễn Văn A",
        major: "Công nghệ thông tin",
        class: "CNTT2020",
        currentSemester: "Học kỳ 2, năm học 2023-2024",
      };

      return examScheduleInfo;
    } catch (error) {
      console.error("Error fetching exam schedule info:", error);
      throw error;
    }
  }, [fetchApi]);

  // Lấy danh sách học kỳ
  const getSemesters = useCallback(async (): Promise<SemesterInfo[]> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<SemesterInfo[]>('/api/exam-schedule/semesters');

      // Dữ liệu mẫu cho danh sách học kỳ
      const semesters: SemesterInfo[] = [
        {
          id: "2023-2024-2",
          name: "Học kỳ 2, năm học 2023-2024",
          isCurrent: true,
        },
        {
          id: "2023-2024-1",
          name: "Học kỳ 1, năm học 2023-2024",
          isCurrent: false,
        },
        {
          id: "2022-2023-2",
          name: "Học kỳ 2, năm học 2022-2023",
          isCurrent: false,
        },
        {
          id: "2022-2023-1",
          name: "Học kỳ 1, năm học 2022-2023",
          isCurrent: false,
        },
      ];

      return semesters;
    } catch (error) {
      console.error("Error fetching semesters:", error);
      throw error;
    }
  }, [fetchApi]);

  // Lấy thông báo lịch thi
  const getExamNotifications = useCallback(
    async (semesterId: string): Promise<ExamNotification[]> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<ExamNotification[]>('/api/exam-schedule/notifications', { params: { semesterId } });

        // Dữ liệu mẫu cho thông báo lịch thi
        const notifications: ExamNotification[] = [
          {
            id: "notification1",
            title: "Thông báo về kỳ thi cuối kỳ học kỳ 2 năm học 2023-2024",
            date: "01/06/2024",
            author: "Phòng Đào tạo",
            content: "Kỳ thi cuối kỳ sẽ diễn ra từ ngày 15/06/2024 đến ngày 30/06/2024. Sinh viên cần mang theo thẻ sinh viên và đến trước giờ thi ít nhất 15 phút. Các trường hợp đi trễ quá 15 phút sẽ không được dự thi.\n\nSinh viên cần kiểm tra kỹ lịch thi và phòng thi. Mọi thắc mắc vui lòng liên hệ Phòng Đào tạo trước ngày 10/06/2024.",
            isImportant: true,
          },
        ];

        return notifications;
      } catch (error) {
        console.error("Error fetching exam notifications:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Lấy thống kê lịch thi
  const getExamStats = useCallback(
    async (semesterId: string): Promise<ExamStats> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<ExamStats>('/api/exam-schedule/stats', { params: { semesterId } });

        // Dữ liệu mẫu cho thống kê lịch thi
        const stats: ExamStats = {
          totalExams: 8,
          daysUntilExam: 14,
          completedExams: 0,
          remainingExams: 8,
          examRooms: ["A305", "A401", "B203"],
          lastUpdated: "01/06/2024",
          nextExamDate: "15/06/2024",
          examType: "Kỳ thi cuối kỳ",
        };

        return stats;
      } catch (error) {
        console.error("Error fetching exam stats:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Lấy lịch thi
  const getExamSchedules = useCallback(
    async (
      semesterId: string,
      examType: ExamType = ExamType.ALL
    ): Promise<ExamSchedule[]> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<ExamSchedule[]>('/api/exam-schedule/schedules', { params: { semesterId, examType } });

        // Dữ liệu mẫu cho lịch thi
        const examSchedules: ExamSchedule[] = [
          {
            id: "exam1",
            courseCode: "LTWNC01",
            courseName: "Lập trình Web nâng cao",
            examDate: "15/06/2024",
            startTime: "07:00",
            endTime: "08:30",
            room: "A305",
            className: "CNTT2020",
            examType: ExamType.FINAL,
            examFormat: "Thi viết",
            notes: "Mang theo bút, thước kẻ",
            status: "upcoming",
            dayOfWeek: 7, // Thứ 7
          },
          {
            id: "exam2",
            courseCode: "TTNT02",
            courseName: "Trí tuệ nhân tạo",
            examDate: "17/06/2024",
            startTime: "07:00",
            endTime: "08:30",
            room: "B203",
            className: "CNTT2020",
            examType: ExamType.FINAL,
            examFormat: "Thi viết",
            notes: "Mang theo bút, thước kẻ",
            status: "upcoming",
            dayOfWeek: 2, // Thứ 2
          },
          {
            id: "exam3",
            courseCode: "ATTT01",
            courseName: "An toàn thông tin",
            examDate: "17/06/2024",
            startTime: "13:00",
            endTime: "14:30",
            room: "A305",
            className: "CNTT2020",
            examType: ExamType.FINAL,
            examFormat: "Thi trắc nghiệm",
            notes: "Mang theo bút chì 2B",
            status: "upcoming",
            dayOfWeek: 2, // Thứ 2
          },
          {
            id: "exam4",
            courseCode: "PTTKHT01",
            courseName: "Phân tích và thiết kế hệ thống",
            examDate: "20/06/2024",
            startTime: "07:00",
            endTime: "08:30",
            room: "A401",
            className: "CNTT2020",
            examType: ExamType.FINAL,
            examFormat: "Thi viết",
            notes: "Mang theo bút, thước kẻ",
            status: "upcoming",
            dayOfWeek: 5, // Thứ 5
          },
          {
            id: "exam5",
            courseCode: "JAVA03",
            courseName: "Lập trình Java",
            examDate: "22/06/2024",
            startTime: "07:00",
            endTime: "08:30",
            room: "A401",
            className: "CNTT2020",
            examType: ExamType.FINAL,
            examFormat: "Thi thực hành",
            notes: "Thi trên máy tính",
            status: "upcoming",
            dayOfWeek: 7, // Thứ 7
          },
          {
            id: "exam6",
            courseCode: "KTPM02",
            courseName: "Kiểm thử phần mềm",
            examDate: "22/06/2024",
            startTime: "13:00",
            endTime: "14:30",
            room: "A305",
            className: "CNTT2020",
            examType: ExamType.FINAL,
            examFormat: "Thi viết",
            notes: "Mang theo bút, thước kẻ",
            status: "upcoming",
            dayOfWeek: 7, // Thứ 7
          },
          {
            id: "exam7",
            courseCode: "CSDL02",
            courseName: "Cơ sở dữ liệu",
            examDate: "25/06/2024",
            startTime: "07:00",
            endTime: "08:30",
            room: "B203",
            className: "CNTT2020",
            examType: ExamType.FINAL,
            examFormat: "Thi viết",
            notes: "Mang theo bút, thước kẻ",
            status: "upcoming",
            dayOfWeek: 3, // Thứ 3
          },
          {
            id: "exam8",
            courseCode: "MMT01",
            courseName: "Mạng máy tính",
            examDate: "27/06/2024",
            startTime: "07:00",
            endTime: "08:30",
            room: "B203",
            className: "CNTT2020",
            examType: ExamType.FINAL,
            examFormat: "Thi viết",
            notes: "Mang theo bút, thước kẻ",
            status: "upcoming",
            dayOfWeek: 5, // Thứ 5
          },
        ];

        // Lọc theo loại kỳ thi nếu cần
        if (examType !== ExamType.ALL) {
          return examSchedules.filter((exam) => exam.examType === examType);
        }

        return examSchedules;
      } catch (error) {
        console.error("Error fetching exam schedules:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Lấy quy định thi
  const getExamRegulations = useCallback(async (): Promise<ExamRegulation[]> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<ExamRegulation[]>('/api/exam-schedule/regulations');

      // Dữ liệu mẫu cho quy định thi
      const regulations: ExamRegulation[] = [
        {
          id: "reg1",
          title: "Thời gian",
          icon: "fa-clock-o",
          content:
            "Sinh viên phải có mặt tại phòng thi trước giờ thi ít nhất 15 phút. Sinh viên đến trễ quá 15 phút sau khi bắt đầu thi sẽ không được dự thi.",
        },
        {
          id: "reg2",
          title: "Giấy tờ",
          icon: "fa-id-card",
          content:
            "Sinh viên phải mang theo thẻ sinh viên hoặc giấy tờ tùy thân có ảnh (CMND, CCCD, bằng lái xe) khi đi thi. Sinh viên không có giấy tờ tùy thân sẽ không được dự thi.",
        },
        {
          id: "reg3",
          title: "Vật dụng cấm mang vào phòng thi",
          icon: "fa-ban",
          content:
            "Sinh viên không được mang vào phòng thi: điện thoại di động, thiết bị ghi âm, ghi hình, thiết bị truyền tin, tài liệu (trừ những môn được phép mang tài liệu theo quy định của giảng viên).",
        },
        {
          id: "reg4",
          title: "Vật dụng được phép mang vào phòng thi",
          icon: "fa-check-circle",
          content:
            "Sinh viên được phép mang vào phòng thi: bút, thước kẻ, máy tính cầm tay không có chức năng soạn thảo văn bản và không có thẻ nhớ (đối với các môn được phép sử dụng máy tính).",
        },
        {
          id: "reg5",
          title: "Quy định về gian lận",
          icon: "fa-exclamation-triangle",
          content:
            "Sinh viên bị phát hiện gian lận trong kỳ thi sẽ bị xử lý theo quy định của nhà trường, từ nhắc nhở, cảnh cáo đến đình chỉ thi và hủy kết quả thi.",
        },
        {
          id: "reg6",
          title: "Sức khỏe",
          icon: "fa-medkit",
          content:
            "Sinh viên có vấn đề về sức khỏe cần báo trước cho Phòng Đào tạo để được hỗ trợ. Trường hợp đau ốm đột xuất trong ngày thi, cần có giấy xác nhận của cơ sở y tế.",
        },
      ];

      return regulations;
    } catch (error) {
      console.error("Error fetching exam regulations:", error);
      throw error;
    }
  }, [fetchApi]);

  // Xuất lịch thi
  const exportExamSchedule = useCallback(
    async (
      semesterId: string,
      format: "pdf" | "excel" = "pdf"
    ): Promise<{ url: string }> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<{ url: string }>('/api/exam-schedule/export', {
        //   method: 'POST',
        //   body: { semesterId, format }
        // });

        // Dữ liệu mẫu cho URL tải xuống
        return {
          url: `/downloads/exam_schedule_${semesterId}.${format}`,
        };
      } catch (error) {
        console.error("Error exporting exam schedule:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Đồng bộ với Google Calendar
  const syncWithGoogleCalendar = useCallback(
    async (
      semesterId: string
    ): Promise<{ success: boolean; message: string }> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<{ success: boolean; message: string }>('/api/exam-schedule/sync-google-calendar', {
        //   method: 'POST',
        //   body: { semesterId }
        // });

        // Dữ liệu mẫu cho kết quả đồng bộ
        return {
          success: true,
          message: "Đã đồng bộ thành công lịch thi với Google Calendar",
        };
      } catch (error) {
        console.error("Error syncing with Google Calendar:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  return {
    getExamScheduleInfo,
    getSemesters,
    getExamNotifications,
    getExamStats,
    getExamSchedules,
    getExamRegulations,
    exportExamSchedule,
    syncWithGoogleCalendar,
  };
};

export default useExamScheduleService;