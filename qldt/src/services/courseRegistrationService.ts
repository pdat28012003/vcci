import { useCallback } from "react";
import useApiService from "../hooks/useApiService";

// Interface cho thông tin đợt đăng ký
export interface RegistrationPeriod {
  id: string;
  semester: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  status: "active" | "closed" | "upcoming";
  maxCredits: number;
  registeredCredits: number;
  remainingCredits: number;
  paymentDeadline: string;
}

// Interface cho học phần có thể đăng ký
export interface AvailableCourse {
  id: string;
  code: string;
  name: string;
  credits: number;
  classId: string;
  schedule: string;
  room: string;
  currentStudents: number;
  maxStudents: number;
  status: "open" | "almost-full" | "full";
  department: string;
  type: "required" | "elective";
  category: "general" | "specialized";
}

// Interface cho học phần đã đăng ký
export interface RegisteredCourse {
  id: string;
  code: string;
  name: string;
  credits: number;
  classId: string;
  schedule: string;
  room: string;
  status: "pending" | "confirmed" | "cancelled";
  registrationDate: string;
}

// Interface cho bộ lọc học phần
export interface CourseFilter {
  department?: string;
  type?: string;
  status?: string;
  searchText?: string;
  page?: number;
  limit?: number;
}

// Interface cho kết quả đăng ký
export interface RegistrationResult {
  success: boolean;
  message: string;
  courseId?: string;
}

// Hook để quản lý các API liên quan đến đăng ký học phần
export const useCourseRegistrationService = () => {
  const { fetchApi } = useApiService();

  // Lấy thông tin đợt đăng ký hiện tại
  const getCurrentRegistrationPeriod = useCallback(async (): Promise<RegistrationPeriod> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<RegistrationPeriod>('/api/course-registration/current-period');

      // Giả lập độ trễ của API
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Dữ liệu mẫu cho thông tin đợt đăng ký
      const currentDate = new Date();
      const startDate = new Date(2024, 6, 15, 8, 0); // 15/07/2024 08:00
      const endDate = new Date(2024, 6, 30, 17, 0); // 30/07/2024 17:00
      
      // Tính thời gian còn lại
      const remainingTime = endDate.getTime() - currentDate.getTime();
      const remainingDays = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      const remainingHours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const remainingMinutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      
      const registrationPeriod: RegistrationPeriod = {
        id: "reg-2024-1",
        semester: "1",
        academicYear: "2024-2025",
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status: "active",
        maxCredits: 24,
        registeredCredits: 0,
        remainingCredits: 24,
        paymentDeadline: "2024-08-15T00:00:00.000Z",
      };

      return registrationPeriod;
    } catch (error) {
      console.error("Error fetching current registration period:", error);
      throw error;
    }
  }, [fetchApi]);

  // Lấy danh sách học phần có thể đăng ký
  const getAvailableCourses = useCallback(async (filter?: CourseFilter): Promise<AvailableCourse[]> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự với filter
      // return await fetchApi<AvailableCourse[]>('/api/course-registration/available-courses', { params: filter });

      // Giả lập độ trễ của API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Dữ liệu mẫu cho danh sách học phần có thể đăng ký
      let availableCourses: AvailableCourse[] = [
        {
          id: "course1",
          code: "CNPM101",
          name: "Công nghệ phần mềm nâng cao",
          credits: 3,
          classId: "CNPM101.1",
          schedule: "Thứ 2 (7:00 - 9:30)",
          room: "A305",
          currentStudents: 45,
          maxStudents: 60,
          status: "open",
          department: "cntt",
          type: "required",
          category: "specialized",
        },
        {
          id: "course2",
          code: "CNPM101",
          name: "Công nghệ phần mềm nâng cao",
          credits: 3,
          classId: "CNPM101.2",
          schedule: "Thứ 3 (7:00 - 9:30)",
          room: "A306",
          currentStudents: 58,
          maxStudents: 60,
          status: "almost-full",
          department: "cntt",
          type: "required",
          category: "specialized",
        },
        {
          id: "course3",
          code: "CNPM101",
          name: "Công nghệ phần mềm nâng cao",
          credits: 3,
          classId: "CNPM101.3",
          schedule: "Thứ 4 (7:00 - 9:30)",
          room: "A307",
          currentStudents: 60,
          maxStudents: 60,
          status: "full",
          department: "cntt",
          type: "required",
          category: "specialized",
        },
        {
          id: "course4",
          code: "TTNT201",
          name: "Trí tuệ nhân tạo",
          credits: 3,
          classId: "TTNT201.1",
          schedule: "Thứ 2 (13:00 - 15:30)",
          room: "B203",
          currentStudents: 40,
          maxStudents: 60,
          status: "open",
          department: "cntt",
          type: "required",
          category: "specialized",
        },
        {
          id: "course5",
          code: "TTNT201",
          name: "Trí tuệ nhân tạo",
          credits: 3,
          classId: "TTNT201.2",
          schedule: "Thứ 3 (13:00 - 15:30)",
          room: "B204",
          currentStudents: 35,
          maxStudents: 60,
          status: "open",
          department: "cntt",
          type: "required",
          category: "specialized",
        },
        {
          id: "course6",
          code: "HTTT301",
          name: "Hệ thống thông tin doanh nghiệp",
          credits: 3,
          classId: "HTTT301.1",
          schedule: "Thứ 4 (13:00 - 15:30)",
          room: "A401",
          currentStudents: 30,
          maxStudents: 60,
          status: "open",
          department: "cntt",
          type: "elective",
          category: "specialized",
        },
        {
          id: "course7",
          code: "HTTT301",
          name: "Hệ thống thông tin doanh nghiệp",
          credits: 3,
          classId: "HTTT301.2",
          schedule: "Thứ 5 (13:00 - 15:30)",
          room: "A402",
          currentStudents: 25,
          maxStudents: 60,
          status: "open",
          department: "cntt",
          type: "elective",
          category: "specialized",
        },
        {
          id: "course8",
          code: "MMT202",
          name: "Mạng máy tính nâng cao",
          credits: 3,
          classId: "MMT202.1",
          schedule: "Thứ 6 (7:00 - 9:30)",
          room: "B303",
          currentStudents: 50,
          maxStudents: 60,
          status: "open",
          department: "dtvt",
          type: "required",
          category: "specialized",
        },
        {
          id: "course9",
          code: "ATTT301",
          name: "An toàn thông tin nâng cao",
          credits: 3,
          classId: "ATTT301.1",
          schedule: "Thứ 5 (7:00 - 9:30)",
          room: "B304",
          currentStudents: 40,
          maxStudents: 60,
          status: "open",
          department: "dtvt",
          type: "required",
          category: "specialized",
        },
        {
          id: "course10",
          code: "KTPM301",
          name: "Kiểm thử phần mềm nâng cao",
          credits: 3,
          classId: "KTPM301.1",
          schedule: "Thứ 4 (9:45 - 12:15)",
          room: "A305",
          currentStudents: 35,
          maxStudents: 60,
          status: "open",
          department: "cntt",
          type: "elective",
          category: "specialized",
        },
        {
          id: "course11",
          code: "TOAN101",
          name: "Giải tích",
          credits: 3,
          classId: "TOAN101.1",
          schedule: "Thứ 2 (9:45 - 12:15)",
          room: "C101",
          currentStudents: 45,
          maxStudents: 60,
          status: "open",
          department: "kinhte",
          type: "required",
          category: "general",
        },
        {
          id: "course12",
          code: "TOAN102",
          name: "Đại số tuyến tính",
          credits: 3,
          classId: "TOAN102.1",
          schedule: "Thứ 3 (9:45 - 12:15)",
          room: "C102",
          currentStudents: 40,
          maxStudents: 60,
          status: "open",
          department: "kinhte",
          type: "required",
          category: "general",
        },
        {
          id: "course13",
          code: "VL101",
          name: "Vật lý đại cương",
          credits: 3,
          classId: "VL101.1",
          schedule: "Thứ 4 (9:45 - 12:15)",
          room: "C103",
          currentStudents: 35,
          maxStudents: 60,
          status: "open",
          department: "cokhi",
          type: "required",
          category: "general",
        },
        {
          id: "course14",
          code: "TA101",
          name: "Tiếng Anh 1",
          credits: 3,
          classId: "TA101.1",
          schedule: "Thứ 5 (9:45 - 12:15)",
          room: "C104",
          currentStudents: 30,
          maxStudents: 60,
          status: "open",
          department: "ngoaingu",
          type: "required",
          category: "general",
        },
        {
          id: "course15",
          code: "TA102",
          name: "Tiếng Anh 2",
          credits: 3,
          classId: "TA102.1",
          schedule: "Thứ 6 (9:45 - 12:15)",
          room: "C105",
          currentStudents: 25,
          maxStudents: 60,
          status: "open",
          department: "ngoaingu",
          type: "required",
          category: "general",
        },
      ];

      // Áp dụng bộ lọc nếu có
      if (filter) {
        if (filter.department && filter.department !== "") {
          availableCourses = availableCourses.filter(
            (course) => course.department === filter.department
          );
        }

        if (filter.type && filter.type !== "") {
          if (filter.type === "required" || filter.type === "elective") {
            availableCourses = availableCourses.filter(
              (course) => course.type === filter.type
            );
          } else if (filter.type === "general" || filter.type === "specialized") {
            availableCourses = availableCourses.filter(
              (course) => course.category === filter.type
            );
          }
        }

        if (filter.status && filter.status !== "") {
          availableCourses = availableCourses.filter(
            (course) => course.status === filter.status
          );
        }

        if (filter.searchText && filter.searchText !== "") {
          const searchText = filter.searchText.toLowerCase();
          availableCourses = availableCourses.filter(
            (course) =>
              course.code.toLowerCase().includes(searchText) ||
              course.name.toLowerCase().includes(searchText) ||
              course.classId.toLowerCase().includes(searchText)
          );
        }
      }

      return availableCourses;
    } catch (error) {
      console.error("Error fetching available courses:", error);
      throw error;
    }
  }, [fetchApi]);

  // Lấy danh sách học phần đã đăng ký
  const getRegisteredCourses = useCallback(async (): Promise<RegisteredCourse[]> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<RegisteredCourse[]>('/api/course-registration/registered-courses');

      // Giả lập độ trễ của API
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Dữ liệu mẫu cho danh sách học phần đã đăng ký
      const registeredCourses: RegisteredCourse[] = [];

      return registeredCourses;
    } catch (error) {
      console.error("Error fetching registered courses:", error);
      throw error;
    }
  }, [fetchApi]);

  // Đăng ký học phần
  const registerCourse = useCallback(async (courseId: string): Promise<RegistrationResult> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<RegistrationResult>('/api/course-registration/register', {
      //   method: 'POST',
      //   data: { courseId }
      // });

      // Giả lập độ trễ của API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Giả lập kết quả đăng ký thành công
      return {
        success: true,
        message: "Đăng ký học phần thành công",
        courseId,
      };
    } catch (error) {
      console.error("Error registering course:", error);
      throw error;
    }
  }, [fetchApi]);

  // Hủy đăng ký học phần
  const cancelRegistration = useCallback(async (courseId: string): Promise<RegistrationResult> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<RegistrationResult>('/api/course-registration/cancel', {
      //   method: 'POST',
      //   data: { courseId }
      // });

      // Giả lập độ trễ của API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Giả lập kết quả hủy đăng ký thành công
      return {
        success: true,
        message: "Hủy đăng ký học phần thành công",
        courseId,
      };
    } catch (error) {
      console.error("Error cancelling registration:", error);
      throw error;
    }
  }, [fetchApi]);

  // Lưu đăng ký học phần
  const saveRegistration = useCallback(async (): Promise<RegistrationResult> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<RegistrationResult>('/api/course-registration/save', {
      //   method: 'POST'
      // });

      // Giả lập độ trễ của API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Giả lập kết quả lưu đăng ký thành công
      return {
        success: true,
        message: "Lưu đăng ký học phần thành công",
      };
    } catch (error) {
      console.error("Error saving registration:", error);
      throw error;
    }
  }, [fetchApi]);

  // Hủy tất cả đăng ký học phần
  const cancelAllRegistrations = useCallback(async (): Promise<RegistrationResult> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<RegistrationResult>('/api/course-registration/cancel-all', {
      //   method: 'POST'
      // });

      // Giả lập độ trễ của API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Giả lập kết quả hủy tất cả đăng ký thành công
      return {
        success: true,
        message: "Hủy tất cả đăng ký học phần thành công",
      };
    } catch (error) {
      console.error("Error cancelling all registrations:", error);
      throw error;
    }
  }, [fetchApi]);

  return {
    getCurrentRegistrationPeriod,
    getAvailableCourses,
    getRegisteredCourses,
    registerCourse,
    cancelRegistration,
    saveRegistration,
    cancelAllRegistrations,
  };
};

export default useCourseRegistrationService;