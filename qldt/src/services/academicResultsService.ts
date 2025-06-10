import { useCallback } from "react";
import useApiService from "../hooks/useApiService";

// Interface cho thông tin chung về kết quả học tập
export interface AcademicResultsInfo {
  studentId: string;
  studentName: string;
  major: string;
  class: string;
  currentSemester: string;
  gpa: number;
  totalCredits: number;
  completedCredits: number;
  academicRank: string;
  disciplineScore: number;
  maxDisciplineScore: number;
}

// Interface cho học kỳ
export interface SemesterInfo {
  id: string;
  name: string;
  isCurrent: boolean;
}

// Interface cho loại học phần
export enum CourseType {
  ALL = "all",
  REQUIRED = "required",
  ELECTIVE = "elective",
  GENERAL = "general",
  SPECIALIZED = "specialized",
}

// Interface cho kết quả học tập của một học phần
export interface CourseResult {
  id: string;
  courseCode: string;
  courseName: string;
  credits: number;
  semester: string;
  semesterId: string;
  attendance: number;
  assignment: number | string;
  practice: number | string;
  midterm: number;
  final: number;
  total: number;
  letterGrade: string;
  gradePoint: number;
  status: "passed" | "failed" | "inprogress";
  courseType: CourseType;
}

// Interface cho phân bố điểm
export interface GradeDistribution {
  grade: string;
  percentage: number;
  color: string;
}

// Interface cho tiến độ học tập
export interface AcademicProgress {
  totalCredits: number;
  completedCredits: number;
  remainingCredits: number;
  currentCredits: number;
  completionPercentage: number;
  categories: ProgressCategory[];
}

// Interface cho danh mục tiến độ học tập
export interface ProgressCategory {
  id: string;
  name: string;
  icon: string;
  totalCredits: number;
  completedCredits: number;
  completionPercentage: number;
}

// Hook để quản lý các API liên quan đến kết quả học tập
export const useAcademicResultsService = () => {
  const { fetchApi } = useApiService();

  // Lấy thông tin chung về kết quả học tập
  const getAcademicResultsInfo =
    useCallback(async (): Promise<AcademicResultsInfo> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<AcademicResultsInfo>('/api/academic-results/info');

        // Dữ liệu mẫu cho thông tin chung
        const academicResultsInfo: AcademicResultsInfo = {
          studentId: "20020001",
          studentName: "Nguyễn Văn A",
          major: "Công nghệ thông tin",
          class: "CNTT2020",
          currentSemester: "Học kỳ 2, năm học 2023-2024",
          gpa: 3.65,
          totalCredits: 140,
          completedCredits: 110,
          academicRank: "Giỏi",
          disciplineScore: 85,
          maxDisciplineScore: 100,
        };

        return academicResultsInfo;
      } catch (error) {
        console.error("Error fetching academic results info:", error);
        throw error;
      }
    }, [fetchApi]);

  // Lấy danh sách học kỳ
  const getSemesters = useCallback(async (): Promise<SemesterInfo[]> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<SemesterInfo[]>('/api/academic-results/semesters');

      // Dữ liệu mẫu cho danh sách học kỳ
      const semesters: SemesterInfo[] = [
        {
          id: "all",
          name: "Tất cả các học kỳ",
          isCurrent: false,
        },
        {
          id: "2023-2024-1",
          name: "Học kỳ 1, năm học 2023-2024",
          isCurrent: true,
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
        {
          id: "2021-2022-2",
          name: "Học kỳ 2, năm học 2021-2022",
          isCurrent: false,
        },
        {
          id: "2021-2022-1",
          name: "Học kỳ 1, năm học 2021-2022",
          isCurrent: false,
        },
        {
          id: "2020-2021-2",
          name: "Học kỳ 2, năm học 2020-2021",
          isCurrent: false,
        },
        {
          id: "2020-2021-1",
          name: "Học kỳ 1, năm học 2020-2021",
          isCurrent: false,
        },
      ];

      return semesters;
    } catch (error) {
      console.error("Error fetching semesters:", error);
      throw error;
    }
  }, [fetchApi]);

  // Lấy kết quả học tập
  const getCourseResults = useCallback(
    async (
      semesterId: string = "all",
      courseType: CourseType = CourseType.ALL
    ): Promise<CourseResult[]> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<CourseResult[]>('/api/academic-results/courses', { params: { semesterId, courseType } });

        // Dữ liệu mẫu cho kết quả học tập
        const courseResults: CourseResult[] = [
          {
            id: "course1",
            courseCode: "CNPM01",
            courseName: "Công nghệ phần mềm",
            credits: 3,
            semester: "Học kỳ 1, năm học 2023-2024",
            semesterId: "2023-2024-1",
            attendance: 10,
            assignment: 9,
            practice: 8,
            midterm: 8.5,
            final: 8,
            total: 8.4,
            letterGrade: "A",
            gradePoint: 4.0,
            status: "passed",
            courseType: CourseType.SPECIALIZED,
          },
          {
            id: "course2",
            courseCode: "KTMT01",
            courseName: "Kiến trúc máy tính",
            credits: 3,
            semester: "Học kỳ 1, năm học 2023-2024",
            semesterId: "2023-2024-1",
            attendance: 10,
            assignment: 8,
            practice: 8,
            midterm: 7.5,
            final: 7,
            total: 7.6,
            letterGrade: "B+",
            gradePoint: 3.5,
            status: "passed",
            courseType: CourseType.SPECIALIZED,
          },
          {
            id: "course3",
            courseCode: "HDH01",
            courseName: "Hệ điều hành",
            credits: 4,
            semester: "Học kỳ 1, năm học 2023-2024",
            semesterId: "2023-2024-1",
            attendance: 10,
            assignment: 9,
            practice: 9,
            midterm: 8,
            final: 8,
            total: 8.4,
            letterGrade: "A",
            gradePoint: 4.0,
            status: "passed",
            courseType: CourseType.SPECIALIZED,
          },
          {
            id: "course4",
            courseCode: "NMCNTT01",
            courseName: "Nhập môn CNTT",
            credits: 2,
            semester: "Học kỳ 1, năm học 2023-2024",
            semesterId: "2023-2024-1",
            attendance: 10,
            assignment: 8,
            practice: "-",
            midterm: 7,
            final: 8,
            total: 8.0,
            letterGrade: "B+",
            gradePoint: 3.5,
            status: "passed",
            courseType: CourseType.GENERAL,
          },
          {
            id: "course5",
            courseCode: "CTDL01",
            courseName: "Cấu trúc dữ liệu và giải thuật",
            credits: 4,
            semester: "Học kỳ 1, năm học 2023-2024",
            semesterId: "2023-2024-1",
            attendance: 10,
            assignment: 9,
            practice: 8,
            midterm: 8,
            final: 8,
            total: 8.3,
            letterGrade: "A",
            gradePoint: 4.0,
            status: "passed",
            courseType: CourseType.SPECIALIZED,
          },
          {
            id: "course6",
            courseCode: "CSDL01",
            courseName: "Cơ sở dữ liệu",
            credits: 4,
            semester: "Học kỳ 2, năm học 2022-2023",
            semesterId: "2022-2023-2",
            attendance: 10,
            assignment: 9,
            practice: 9,
            midterm: 9,
            final: 9,
            total: 9.1,
            letterGrade: "A+",
            gradePoint: 4.0,
            status: "passed",
            courseType: CourseType.SPECIALIZED,
          },
          {
            id: "course7",
            courseCode: "LTW01",
            courseName: "Lập trình Web",
            credits: 3,
            semester: "Học kỳ 2, năm học 2022-2023",
            semesterId: "2022-2023-2",
            attendance: 10,
            assignment: 8,
            practice: 9,
            midterm: 8,
            final: 8,
            total: 8.3,
            letterGrade: "A",
            gradePoint: 4.0,
            status: "passed",
            courseType: CourseType.SPECIALIZED,
          },
          {
            id: "course8",
            courseCode: "MMT01",
            courseName: "Mạng máy tính",
            credits: 3,
            semester: "Học kỳ 2, năm học 2022-2023",
            semesterId: "2022-2023-2",
            attendance: 10,
            assignment: 7,
            practice: 8,
            midterm: 7,
            final: 7,
            total: 7.4,
            letterGrade: "B",
            gradePoint: 3.0,
            status: "passed",
            courseType: CourseType.SPECIALIZED,
          },
          {
            id: "course9",
            courseCode: "PTTKHT01",
            courseName: "Phân tích và thiết kế hệ thống",
            credits: 4,
            semester: "Học kỳ 2, năm học 2022-2023",
            semesterId: "2022-2023-2",
            attendance: 10,
            assignment: 9,
            practice: 9,
            midterm: 8,
            final: 9,
            total: 8.9,
            letterGrade: "A",
            gradePoint: 4.0,
            status: "passed",
            courseType: CourseType.SPECIALIZED,
          },
          {
            id: "course10",
            courseCode: "JAVA01",
            courseName: "Lập trình Java",
            credits: 3,
            semester: "Học kỳ 2, năm học 2022-2023",
            semesterId: "2022-2023-2",
            attendance: 10,
            assignment: 9,
            practice: 9,
            midterm: 9,
            final: 9,
            total: 9.1,
            letterGrade: "A+",
            gradePoint: 4.0,
            status: "passed",
            courseType: CourseType.SPECIALIZED,
          },
        ];

        // Lọc theo học kỳ và loại học phần
        let filteredResults = courseResults;

        if (semesterId !== "all") {
          filteredResults = filteredResults.filter(
            (course) => course.semesterId === semesterId
          );
        }

        if (courseType !== CourseType.ALL) {
          filteredResults = filteredResults.filter(
            (course) => course.courseType === courseType
          );
        }

        return filteredResults;
      } catch (error) {
        console.error("Error fetching course results:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Lấy phân bố điểm
  const getGradeDistribution = useCallback(
    async (semesterId: string = "all"): Promise<GradeDistribution[]> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<GradeDistribution[]>('/api/academic-results/grade-distribution', { params: { semesterId } });

        // Dữ liệu mẫu cho phân bố điểm
        const gradeDistribution: GradeDistribution[] = [
          {
            grade: "A/A+",
            percentage: 40,
            color: "linear-gradient(to right, #4caf50, #81c784)",
          },
          {
            grade: "B+",
            percentage: 30,
            color: "linear-gradient(to right, #2196f3, #64b5f6)",
          },
          {
            grade: "B",
            percentage: 20,
            color: "linear-gradient(to right, #03a9f4, #4fc3f7)",
          },
          {
            grade: "C+",
            percentage: 10,
            color: "linear-gradient(to right, #ff9800, #ffb74d)",
          },
          {
            grade: "C",
            percentage: 0,
            color: "linear-gradient(to right, #ff9800, #ffb74d)",
          },
          {
            grade: "D+",
            percentage: 0,
            color: "linear-gradient(to right, #ff5722, #ff8a65)",
          },
          {
            grade: "D",
            percentage: 0,
            color: "linear-gradient(to right, #ff5722, #ff8a65)",
          },
          {
            grade: "F",
            percentage: 0,
            color: "linear-gradient(to right, #f44336, #e57373)",
          },
        ];

        return gradeDistribution;
      } catch (error) {
        console.error("Error fetching grade distribution:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Lấy tiến độ học tập
  const getAcademicProgress =
    useCallback(async (): Promise<AcademicProgress> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<AcademicProgress>('/api/academic-results/progress');

        // Dữ liệu mẫu cho tiến độ học tập
        const academicProgress: AcademicProgress = {
          totalCredits: 140,
          completedCredits: 110,
          remainingCredits: 30,
          currentCredits: 24,
          completionPercentage: 78.6,
          categories: [
            {
              id: "general",
              name: "Khối kiến thức đại cương",
              icon: "fa-book",
              totalCredits: 35,
              completedCredits: 35,
              completionPercentage: 100,
            },
            {
              id: "foundation",
              name: "Khối kiến thức cơ sở ngành",
              icon: "fa-cubes",
              totalCredits: 50,
              completedCredits: 45,
              completionPercentage: 90,
            },
            {
              id: "specialized",
              name: "Khối kiến thức chuyên ngành",
              icon: "fa-code",
              totalCredits: 50,
              completedCredits: 30,
              completionPercentage: 60,
            },
            {
              id: "thesis",
              name: "Khóa luận tốt nghiệp",
              icon: "fa-graduation-cap",
              totalCredits: 5,
              completedCredits: 0,
              completionPercentage: 0,
            },
          ],
        };

        return academicProgress;
      } catch (error) {
        console.error("Error fetching academic progress:", error);
        throw error;
      }
    }, [fetchApi]);

  // Xuất kết quả học tập
  const exportAcademicResults = useCallback(
    async (
      semesterId: string = "all",
      format: "pdf" | "excel" = "pdf"
    ): Promise<{ url: string }> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<{ url: string }>('/api/academic-results/export', {
        //   method: 'POST',
        //   body: { semesterId, format }
        // });

        // Dữ liệu mẫu cho URL tải xuống
        return {
          url: `/downloads/academic_results_${semesterId}.${format}`,
        };
      } catch (error) {
        console.error("Error exporting academic results:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  return {
    getAcademicResultsInfo,
    getSemesters,
    getCourseResults,
    getGradeDistribution,
    getAcademicProgress,
    exportAcademicResults,
  };
};

export default useAcademicResultsService;
