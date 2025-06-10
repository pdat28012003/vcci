import { useCallback } from "react";
import useApiService from "../hooks/useApiService";

// Interface cho thông tin chung về thời khóa biểu
export interface ScheduleInfo {
  studentId: string;
  studentName: string;
  major: string;
  class: string;
  currentSemester: string;
}

// Interface cho tuần học
export interface WeekInfo {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

// Interface cho học kỳ
export interface SemesterInfo {
  id: string;
  name: string;
  isCurrent: boolean;
}

// Interface cho lớp học trong thời khóa biểu
export interface ClassSchedule {
  id: string;
  courseCode: string;
  courseName: string;
  room: string;
  instructor: string;
  className: string;
  dayOfWeek: number; // 2-8 (Thứ 2 đến Chủ nhật)
  startPeriod: number; // 1-12
  endPeriod: number; // 1-12
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  date: string; // YYYY-MM-DD format
}

// Interface cho thời gian tiết học
export interface PeriodTime {
  period: number;
  startTime: string;
  endTime: string;
}

// Hook để quản lý các API liên quan đến thời khóa biểu
export const useScheduleService = () => {
  const { fetchApi } = useApiService();

  // Lấy thông tin chung về thời khóa biểu
  const getScheduleInfo = useCallback(async (): Promise<ScheduleInfo> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<ScheduleInfo>('/api/schedule/info');

      // Dữ liệu mẫu cho thông tin chung - không cần độ trễ để tránh vòng lặp vô hạn
      const scheduleInfo: ScheduleInfo = {
        studentId: "20020001",
        studentName: "Nguyễn Văn A",
        major: "Công nghệ thông tin",
        class: "CNTT2020",
        currentSemester: "Học kỳ 2, năm học 2023-2024",
      };

      return scheduleInfo;
    } catch (error) {
      console.error("Error fetching schedule info:", error);
      throw error;
    }
  }, [fetchApi]);

  // Lấy danh sách học kỳ
  const getSemesters = useCallback(async (): Promise<SemesterInfo[]> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<SemesterInfo[]>('/api/schedule/semesters');

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

  // Lấy danh sách tuần học
  const getWeeks = useCallback(
    async (semesterId: string): Promise<WeekInfo[]> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<WeekInfo[]>('/api/schedule/weeks', { params: { semesterId } });

        // Dữ liệu mẫu cho danh sách tuần học
        const weeks: WeekInfo[] = [
          {
            id: "current",
            name: "Tuần hiện tại",
            startDate: "2024-05-15",
            endDate: "2024-05-21",
            isCurrent: true,
          },
          {
            id: "next",
            name: "Tuần sau",
            startDate: "2024-05-22",
            endDate: "2024-05-28",
            isCurrent: false,
          },
        ];

        // Thêm 20 tuần học
        for (let i = 1; i <= 20; i++) {
          const startDate = new Date(2024, 1, 1 + (i - 1) * 7);
          const endDate = new Date(2024, 1, 7 + (i - 1) * 7);

          const formatDate = (date: Date) => {
            const day = date.getDate().toString().padStart(2, "0");
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
          };

          weeks.push({
            id: `week-${i}`,
            name: `Tuần ${i}`,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            isCurrent: i === 15, // Giả sử tuần hiện tại là tuần 15
          });
        }

        return weeks;
      } catch (error) {
        console.error("Error fetching weeks:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Lấy thời khóa biểu theo tuần
  const getWeekSchedule = useCallback(
    async (semesterId: string, weekId: string): Promise<ClassSchedule[]> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<ClassSchedule[]>('/api/schedule/week', { params: { semesterId, weekId } });

        // Dữ liệu mẫu cho thời khóa biểu theo tuần
        const weekSchedule: ClassSchedule[] = [
          {
            id: "class1",
            courseCode: "COMP3006",
            courseName: "Kiểm thử phần mềm",
            room: "A305",
            instructor: "TS. Nguyễn Văn X",
            className: "CNTT2020",
            dayOfWeek: 5, // Thứ 5
            startPeriod: 10,
            endPeriod: 11,
            startTime: "15:45",
            endTime: "17:25",
            date: "2024-05-18",
          },
          {
            id: "class2",
            courseCode: "COMP3007",
            courseName: "Lập trình Java",
            room: "A401",
            instructor: "TS. Lê Văn Y",
            className: "CNTT2020",
            dayOfWeek: 5, // Thứ 5
            startPeriod: 4,
            endPeriod: 6,
            startTime: "09:45",
            endTime: "12:15",
            date: "2024-05-18",
          },
          {
            id: "class3",
            courseCode: "COMP3008",
            courseName: "Trí tuệ nhân tạo",
            room: "B203",
            instructor: "TS. Trần Thị Z",
            className: "CNTT2020",
            dayOfWeek: 4, // Thứ 4
            startPeriod: 1,
            endPeriod: 3,
            startTime: "07:00",
            endTime: "09:30",
            date: "2024-05-17",
          },
          {
            id: "class4",
            courseCode: "COMP3009",
            courseName: "An toàn thông tin",
            room: "A305",
            instructor: "TS. Phạm Văn W",
            className: "CNTT2020",
            dayOfWeek: 4, // Thứ 4
            startPeriod: 7,
            endPeriod: 8,
            startTime: "13:00",
            endTime: "14:40",
            date: "2024-05-17",
          },
          {
            id: "class5",
            courseCode: "COMP3010",
            courseName: "Cơ sở dữ liệu",
            room: "B203",
            instructor: "TS. Trần Thị Z",
            className: "CNTT2020",
            dayOfWeek: 3, // Thứ 3
            startPeriod: 4,
            endPeriod: 6,
            startTime: "09:45",
            endTime: "12:15",
            date: "2024-05-16",
          },
          {
            id: "class6",
            courseCode: "COMP3011",
            courseName: "Lập trình Web nâng cao",
            room: "A305",
            instructor: "TS. Nguyễn Văn X",
            className: "CNTT2020",
            dayOfWeek: 2, // Thứ 2
            startPeriod: 1,
            endPeriod: 3,
            startTime: "07:00",
            endTime: "09:30",
            date: "2024-05-15",
          },
          {
            id: "class7",
            courseCode: "COMP3012",
            courseName: "Phân tích và thiết kế hệ thống",
            room: "A401",
            instructor: "TS. Lê Văn Y",
            className: "CNTT2020",
            dayOfWeek: 2, // Thứ 2
            startPeriod: 7,
            endPeriod: 9,
            startTime: "13:00",
            endTime: "15:30",
            date: "2024-05-15",
          },
          {
            id: "class8",
            courseCode: "COMP3013",
            courseName: "Mạng máy tính",
            room: "B203",
            instructor: "TS. Phạm Văn W",
            className: "CNTT2020",
            dayOfWeek: 6, // Thứ 6
            startPeriod: 7,
            endPeriod: 9,
            startTime: "13:00",
            endTime: "15:30",
            date: "2024-05-19",
          },
          {
            id: "class9",
            courseCode: "COMP3014",
            courseName: "Lập trình di động",
            room: "A305",
            instructor: "TS. Nguyễn Văn X",
            className: "CNTT2020",
            dayOfWeek: 6, // Thứ 6
            startPeriod: 4,
            endPeriod: 6,
            startTime: "09:45",
            endTime: "12:15",
            date: "2024-05-19",
          },
          {
            id: "class10",
            courseCode: "COMP3015",
            courseName: "Quản lý dự án phần mềm",
            room: "A401",
            instructor: "TS. Lê Văn Y",
            className: "CNTT2020",
            dayOfWeek: 3, // Thứ 3
            startPeriod: 7,
            endPeriod: 9,
            startTime: "13:00",
            endTime: "15:30",
            date: "2024-05-16",
          },
        ];

        return weekSchedule;
      } catch (error) {
        console.error("Error fetching week schedule:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Lấy thời gian các tiết học
  const getPeriodTimes = useCallback(async (): Promise<PeriodTime[]> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<PeriodTime[]>('/api/schedule/period-times');

      // Dữ liệu mẫu cho thời gian các tiết học
      const periodTimes: PeriodTime[] = [
        { period: 1, startTime: "07:00", endTime: "07:50" },
        { period: 2, startTime: "07:50", endTime: "08:40" },
        { period: 3, startTime: "08:40", endTime: "09:30" },
        { period: 4, startTime: "09:45", endTime: "10:35" },
        { period: 5, startTime: "10:35", endTime: "11:25" },
        { period: 6, startTime: "11:25", endTime: "12:15" },
        { period: 7, startTime: "13:00", endTime: "13:50" },
        { period: 8, startTime: "13:50", endTime: "14:40" },
        { period: 9, startTime: "14:40", endTime: "15:30" },
        { period: 10, startTime: "15:45", endTime: "16:35" },
        { period: 11, startTime: "16:35", endTime: "17:25" },
        { period: 12, startTime: "17:25", endTime: "18:15" },
      ];

      return periodTimes;
    } catch (error) {
      console.error("Error fetching period times:", error);
      throw error;
    }
  }, [fetchApi]);

  // Xuất thời khóa biểu
  const exportSchedule = useCallback(
    async (
      semesterId: string,
      weekId: string,
      format: "pdf" | "excel" = "pdf"
    ): Promise<{ url: string }> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<{ url: string }>('/api/schedule/export', {
        //   method: 'POST',
        //   body: { semesterId, weekId, format }
        // });

        // Dữ liệu mẫu cho URL tải xuống
        return {
          url: `/downloads/schedule_${semesterId}_${weekId}.${format}`,
        };
      } catch (error) {
        console.error("Error exporting schedule:", error);
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
        // return await fetchApi<{ success: boolean; message: string }>('/api/schedule/sync-google-calendar', {
        //   method: 'POST',
        //   body: { semesterId }
        // });

        // Dữ liệu mẫu cho kết quả đồng bộ
        return {
          success: true,
          message: "Đã đồng bộ thành công thời khóa biểu với Google Calendar",
        };
      } catch (error) {
        console.error("Error syncing with Google Calendar:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  return {
    getScheduleInfo,
    getSemesters,
    getWeeks,
    getWeekSchedule,
    getPeriodTimes,
    exportSchedule,
    syncWithGoogleCalendar,
  };
};

export default useScheduleService;
