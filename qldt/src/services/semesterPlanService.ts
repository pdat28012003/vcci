import { useCallback } from "react";
import useApiService from "../hooks/useApiService";

// Interface cho thông tin chung về khung chương trình theo kỳ
export interface SemesterPlanInfo {
  major: string;
  specialization: string;
  batch: string;
  currentSemester: string;
}

// Interface cho thống kê tín chỉ học kỳ
export interface SemesterCreditSummary {
  total: number;
  required: number;
  elective: number;
  general: number;
  specialized: number;
}

// Interface cho trạng thái học phần
export type CourseStatus =
  | "in-progress"
  | "completed"
  | "not-started"
  | "not-registered"
  | "not-available";

// Interface cho học phần trong học kỳ
export interface SemesterCourse {
  id: string;
  code: string;
  name: string;
  credits: number;
  type: "required" | "elective";
  prerequisites: string[];
  previousCourses: string[];
  corequisites: string[];
  status: CourseStatus;
}

// Interface cho học kỳ trong lộ trình
export interface RoadmapSemester {
  id: string;
  name: string;
  year: string;
  status: "completed" | "current" | "future";
  totalCredits: number;
  completedCredits: number;
  courses: string[];
}

// Interface cho ghi chú học kỳ
export interface SemesterNote {
  title: string;
  icon: string;
  content: string[];
  isOrderedList?: boolean;
}

// Interface cho bộ lọc học kỳ
export interface SemesterFilter {
  semesterId: string;
}

// Hook để quản lý các API liên quan đến khung chương trình theo kỳ
export const useSemesterPlanService = () => {
  const { fetchApi } = useApiService();

  // Lấy thông tin chung về khung chương trình theo kỳ
  const getSemesterPlanInfo =
    useCallback(async (): Promise<SemesterPlanInfo> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<SemesterPlanInfo>('/api/semester-plan/info');

        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Dữ liệu mẫu cho thông tin chung
        const semesterPlanInfo: SemesterPlanInfo = {
          major: "Công nghệ thông tin",
          specialization: "Kỹ thuật phần mềm",
          batch: "2020-2024",
          currentSemester: "Học kỳ 2, năm học 2023-2024",
        };

        return semesterPlanInfo;
      } catch (error) {
        console.error("Error fetching semester plan info:", error);
        throw error;
      }
    }, [fetchApi]);

  // Lấy thống kê tín chỉ học kỳ
  const getSemesterCreditSummary = useCallback(
    async (semesterId: string): Promise<SemesterCreditSummary> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<SemesterCreditSummary>('/api/semester-plan/credits', { params: { semesterId } });

        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Dữ liệu mẫu cho thống kê tín chỉ học kỳ
        const creditSummary: SemesterCreditSummary = {
          total: 22,
          required: 14,
          elective: 8,
          general: 2,
          specialized: 20,
        };

        return creditSummary;
      } catch (error) {
        console.error("Error fetching semester credit summary:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Lấy danh sách học phần bắt buộc trong học kỳ
  const getRequiredCourses = useCallback(
    async (semesterId: string): Promise<SemesterCourse[]> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<SemesterCourse[]>('/api/semester-plan/required-courses', { params: { semesterId } });

        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Dữ liệu mẫu cho học phần bắt buộc
        const requiredCourses: SemesterCourse[] = [
          {
            id: "course1",
            code: "COMP3006",
            name: "Kiểm thử phần mềm",
            credits: 3,
            type: "required",
            prerequisites: ["COMP3001"],
            previousCourses: [],
            corequisites: [],
            status: "in-progress",
          },
          {
            id: "course2",
            code: "COMP3007",
            name: "Quản lý dự án phần mềm",
            credits: 3,
            type: "required",
            prerequisites: ["COMP3001"],
            previousCourses: [],
            corequisites: [],
            status: "in-progress",
          },
          {
            id: "course3",
            code: "COMP3011",
            name: "Thực tập doanh nghiệp",
            credits: 3,
            type: "required",
            prerequisites: [],
            previousCourses: [],
            corequisites: [],
            status: "not-started",
          },
          {
            id: "course4",
            code: "POLI3002",
            name: "Lịch sử Đảng Cộng sản Việt Nam",
            credits: 2,
            type: "required",
            prerequisites: ["POLI3001"],
            previousCourses: [],
            corequisites: [],
            status: "in-progress",
          },
        ];

        return requiredCourses;
      } catch (error) {
        console.error("Error fetching required courses:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Lấy danh sách học phần tự chọn trong học kỳ
  const getElectiveCourses = useCallback(
    async (semesterId: string): Promise<SemesterCourse[]> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<SemesterCourse[]>('/api/semester-plan/elective-courses', { params: { semesterId } });

        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Dữ liệu mẫu cho học phần tự chọn
        const electiveCourses: SemesterCourse[] = [
          {
            id: "course5",
            code: "COMP3008",
            name: "Học máy",
            credits: 3,
            type: "elective",
            prerequisites: ["COMP3002"],
            previousCourses: [],
            corequisites: [],
            status: "in-progress",
          },
          {
            id: "course6",
            code: "COMP3009",
            name: "Phát triển game",
            credits: 3,
            type: "elective",
            prerequisites: ["COMP2002"],
            previousCourses: [],
            corequisites: [],
            status: "in-progress",
          },
          {
            id: "course7",
            code: "COMP3010",
            name: "Điện toán đám mây",
            credits: 3,
            type: "elective",
            prerequisites: ["COMP2005"],
            previousCourses: [],
            corequisites: [],
            status: "in-progress",
          },
          {
            id: "course8",
            code: "COMP3012",
            name: "Phát triển ứng dụng đa nền tảng",
            credits: 3,
            type: "elective",
            prerequisites: ["COMP3004"],
            previousCourses: [],
            corequisites: [],
            status: "not-available",
          },
          {
            id: "course9",
            code: "COMP3013",
            name: "Phân tích dữ liệu lớn",
            credits: 3,
            type: "elective",
            prerequisites: ["COMP2001"],
            previousCourses: [],
            corequisites: [],
            status: "not-registered",
          },
          {
            id: "course10",
            code: "COMP3014",
            name: "Thiết kế giao diện người dùng",
            credits: 3,
            type: "elective",
            prerequisites: [],
            previousCourses: ["COMP2007"],
            corequisites: [],
            status: "not-registered",
          },
        ];

        return electiveCourses;
      } catch (error) {
        console.error("Error fetching elective courses:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Lấy lộ trình học tập
  const getLearningRoadmap = useCallback(async (): Promise<
    RoadmapSemester[]
  > => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<RoadmapSemester[]>('/api/semester-plan/roadmap');

      // Giả lập độ trễ của API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Dữ liệu mẫu cho lộ trình học tập
      const roadmap: RoadmapSemester[] = [
        {
          id: "sem1",
          name: "Học kỳ 1",
          year: "2020-2021",
          status: "completed",
          totalCredits: 18,
          completedCredits: 18,
          courses: [
            "MATH1001",
            "MATH1002",
            "PHYS1001",
            "COMP1001",
            "COMP1002",
            "ENGL1001",
          ],
        },
        {
          id: "sem2",
          name: "Học kỳ 2",
          year: "2020-2021",
          status: "completed",
          totalCredits: 18,
          completedCredits: 18,
          courses: [
            "MATH1003",
            "MATH1004",
            "COMP1003",
            "COMP1004",
            "ENGL1002",
            "POLI1001",
          ],
        },
        {
          id: "sem3",
          name: "Học kỳ 1",
          year: "2021-2022",
          status: "completed",
          totalCredits: 17,
          completedCredits: 17,
          courses: [
            "COMP2001",
            "COMP2002",
            "COMP2003",
            "COMP2004",
            "ENGL2001",
            "POLI2001",
          ],
        },
        {
          id: "sem4",
          name: "Học kỳ 2",
          year: "2021-2022",
          status: "completed",
          totalCredits: 17,
          completedCredits: 17,
          courses: [
            "COMP2005",
            "COMP2006",
            "COMP2007",
            "COMP2008",
            "ENGL2002",
            "POLI2002",
          ],
        },
        {
          id: "sem5",
          name: "Học kỳ 1",
          year: "2022-2023",
          status: "completed",
          totalCredits: 17,
          completedCredits: 17,
          courses: [
            "COMP3001",
            "COMP3002",
            "COMP3003",
            "COMP3004",
            "COMP3005",
            "POLI3001",
          ],
        },
        {
          id: "sem6",
          name: "Học kỳ 2",
          year: "2022-2023",
          status: "current",
          totalCredits: 22,
          completedCredits: 17,
          courses: [
            "COMP3006",
            "COMP3007",
            "COMP3008",
            "COMP3009",
            "COMP3010",
            "POLI3002",
          ],
        },
        {
          id: "sem7",
          name: "Học kỳ 1",
          year: "2023-2024",
          status: "future",
          totalCredits: 18,
          completedCredits: 0,
          courses: [
            "COMP4001",
            "COMP4002",
            "COMP4003",
            "COMP4004",
            "COMP4005",
            "COMP4006",
          ],
        },
        {
          id: "sem8",
          name: "Học kỳ 2",
          year: "2023-2024",
          status: "future",
          totalCredits: 10,
          completedCredits: 0,
          courses: ["COMP4007"],
        },
      ];

      return roadmap;
    } catch (error) {
      console.error("Error fetching learning roadmap:", error);
      throw error;
    }
  }, [fetchApi]);

  // Lấy ghi chú học kỳ
  const getSemesterNotes = useCallback(
    async (semesterId: string): Promise<SemesterNote[]> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<SemesterNote[]>('/api/semester-plan/notes', { params: { semesterId } });

        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Dữ liệu mẫu cho ghi chú học kỳ
        const notes: SemesterNote[] = [
          {
            title: "Ghi chú quan trọng",
            icon: "info-circle",
            content: [
              "Sinh viên phải hoàn thành tất cả các học phần bắt buộc trong học kỳ.",
              "Sinh viên cần đăng ký ít nhất 9 tín chỉ học phần tự chọn trong học kỳ này.",
              "Học phần COMP3011 (Thực tập doanh nghiệp) có thể đăng ký vào cuối học kỳ và thực hiện trong kỳ hè.",
              "Sinh viên cần đảm bảo đã hoàn thành các học phần tiên quyết trước khi đăng ký học phần mới.",
              "Thời gian đăng ký học phần cho học kỳ tiếp theo: 15/05/2023 - 30/05/2023.",
            ],
          },
          {
            title: "Hướng dẫn đăng ký học phần",
            icon: "graduation-cap",
            content: [
              "Đăng nhập vào cổng thông tin sinh viên",
              'Chọn mục "Đăng ký học phần" trong menu chính',
              "Chọn học kỳ đăng ký và các học phần muốn đăng ký",
              "Kiểm tra thông tin và xác nhận đăng ký",
              "Thanh toán học phí theo thời hạn quy định",
            ],
            isOrderedList: true,
          },
        ];

        return notes;
      } catch (error) {
        console.error("Error fetching semester notes:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Lấy danh sách học kỳ
  const getSemesters = useCallback(async (): Promise<
    { id: string; name: string }[]
  > => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<{id: string, name: string}[]>('/api/semester-plan/semesters');

      // Giả lập độ trễ của API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Dữ liệu mẫu cho danh sách học kỳ
      const semesters = [
        { id: "2023-2024-2", name: "Học kỳ 2, năm học 2023-2024" },
        { id: "2023-2024-1", name: "Học kỳ 1, năm học 2023-2024" },
        { id: "2022-2023-2", name: "Học kỳ 2, năm học 2022-2023" },
        { id: "2022-2023-1", name: "Học kỳ 1, năm học 2022-2023" },
        { id: "2021-2022-2", name: "Học kỳ 2, năm học 2021-2022" },
        { id: "2021-2022-1", name: "Học kỳ 1, năm học 2021-2022" },
        { id: "2020-2021-2", name: "Học kỳ 2, năm học 2020-2021" },
        { id: "2020-2021-1", name: "Học kỳ 1, năm học 2020-2021" },
      ];

      return semesters;
    } catch (error) {
      console.error("Error fetching semesters:", error);
      throw error;
    }
  }, [fetchApi]);

  // Xuất file kế hoạch học tập học kỳ
  const exportSemesterPlan = useCallback(
    async (
      semesterId: string,
      format: "pdf" | "excel" = "pdf"
    ): Promise<{ url: string }> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<{url: string}>('/api/semester-plan/export', {
        //   method: 'POST',
        //   data: { semesterId, format }
        // });

        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Dữ liệu mẫu cho URL tải xuống
        return {
          url: `/downloads/semester-plan-${semesterId}.${format}`,
        };
      } catch (error) {
        console.error("Error exporting semester plan:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  return {
    getSemesterPlanInfo,
    getSemesterCreditSummary,
    getRequiredCourses,
    getElectiveCourses,
    getLearningRoadmap,
    getSemesterNotes,
    getSemesters,
    exportSemesterPlan,
  };
};

export default useSemesterPlanService;
