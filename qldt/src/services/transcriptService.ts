import { useCallback } from "react";
import useApiService from "../hooks/useApiService";

// Interface cho thông tin sinh viên
export interface StudentInfo {
  studentId: string;
  studentName: string;
  major: string;
  specialization: string;
  academicYear: string;
}

// Interface cho thống kê điểm
export interface GradeSummary {
  cumulativeGPA: number;
  lastSemesterGPA: number;
  completedCredits: number;
  totalCredits: number;
  academicRank: string;
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
export interface CourseGrade {
  id: string;
  courseCode: string;
  courseName: string;
  credits: number;
  semester: string;
  semesterId: string;
  progressGrade: number;
  examGrade: number;
  finalGrade: number;
  letterGrade: string;
  status: "passed" | "failed" | "inprogress";
  courseType: CourseType[];
}

// Interface cho thống kê học kỳ
export interface SemesterSummary {
  semesterId: string;
  semesterName: string;
  gpa: number;
  totalCredits: number;
  completedCredits: number;
}

// Interface cho phân bố điểm
export interface GradeDistribution {
  grade: string;
  count: number;
  percentage: number;
  color: string;
}

// Interface cho tiến độ học tập
export interface AcademicProgress {
  totalCredits: number;
  completedCredits: number;
  remainingCredits: number;
  completionPercentage: number;
  categories: ProgressCategory[];
}

// Interface cho danh mục tiến độ học tập
export interface ProgressCategory {
  id: string;
  name: string;
  totalCredits: number;
  completedCredits: number;
  completionPercentage: number;
}

// Interface cho so sánh điểm
export interface GradeComparison {
  semesterId: string;
  semesterName: string;
  gpa: number;
  classAverage: number;
  departmentAverage: number;
}

// Hook để quản lý các API liên quan đến bảng điểm
export const useTranscriptService = () => {
  const { fetchApi } = useApiService();

  // Lấy thông tin sinh viên
  const getStudentInfo = useCallback(async (): Promise<StudentInfo> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<StudentInfo>('/api/transcript/student-info');

      // Dữ liệu mẫu cho thông tin sinh viên
      const studentInfo: StudentInfo = {
        studentId: "SV20200001",
        studentName: "Nguyễn Văn A",
        major: "Công nghệ thông tin",
        specialization: "Kỹ thuật phần mềm",
        academicYear: "2020-2024",
      };

      return studentInfo;
    } catch (error) {
      console.error("Error fetching student info:", error);
      throw error;
    }
  }, [fetchApi]);

  // Lấy thống kê điểm
  const getGradeSummary = useCallback(async (): Promise<GradeSummary> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<GradeSummary>('/api/transcript/grade-summary');

      // Dữ liệu mẫu cho thống kê điểm
      const gradeSummary: GradeSummary = {
        cumulativeGPA: 3.65,
        lastSemesterGPA: 3.75,
        completedCredits: 100,
        totalCredits: 150,
        academicRank: "Khá",
      };

      return gradeSummary;
    } catch (error) {
      console.error("Error fetching grade summary:", error);
      throw error;
    }
  }, [fetchApi]);

  // Lấy danh sách học kỳ
  const getSemesters = useCallback(async (): Promise<SemesterInfo[]> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<SemesterInfo[]>('/api/transcript/semesters');

      // Dữ liệu mẫu cho danh sách học kỳ
      const semesters: SemesterInfo[] = [
        {
          id: "all",
          name: "Tất cả",
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
  const getCourseGrades = useCallback(
    async (
      semesterId: string = "all",
      courseType: CourseType = CourseType.ALL
    ): Promise<CourseGrade[]> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<CourseGrade[]>('/api/transcript/course-grades', { params: { semesterId, courseType } });

        // Dữ liệu mẫu cho kết quả học tập
        const courseGrades: CourseGrade[] = [
          // Học kỳ 1, năm học 2020-2021
          {
            id: "course1",
            courseCode: "MATH1001",
            courseName: "Giải tích 1",
            credits: 3,
            semester: "Học kỳ 1, năm học 2020-2021",
            semesterId: "2020-2021-1",
            progressGrade: 8.5,
            examGrade: 8.5,
            finalGrade: 8.5,
            letterGrade: "A",
            status: "passed",
            courseType: [CourseType.GENERAL, CourseType.REQUIRED],
          },
          {
            id: "course2",
            courseCode: "MATH1002",
            courseName: "Đại số tuyến tính",
            credits: 3,
            semester: "Học kỳ 1, năm học 2020-2021",
            semesterId: "2020-2021-1",
            progressGrade: 7.5,
            examGrade: 7.5,
            finalGrade: 7.5,
            letterGrade: "B",
            status: "passed",
            courseType: [CourseType.GENERAL, CourseType.REQUIRED],
          },
          {
            id: "course3",
            courseCode: "PHYS1001",
            courseName: "Vật lý đại cương",
            credits: 3,
            semester: "Học kỳ 1, năm học 2020-2021",
            semesterId: "2020-2021-1",
            progressGrade: 8.0,
            examGrade: 8.0,
            finalGrade: 8.0,
            letterGrade: "B+",
            status: "passed",
            courseType: [CourseType.GENERAL, CourseType.REQUIRED],
          },
          {
            id: "course4",
            courseCode: "COMP1001",
            courseName: "Nhập môn lập trình",
            credits: 3,
            semester: "Học kỳ 1, năm học 2020-2021",
            semesterId: "2020-2021-1",
            progressGrade: 9.0,
            examGrade: 9.0,
            finalGrade: 9.0,
            letterGrade: "A",
            status: "passed",
            courseType: [CourseType.SPECIALIZED, CourseType.REQUIRED],
          },
          {
            id: "course5",
            courseCode: "COMP1002",
            courseName: "Nhập môn công nghệ thông tin",
            credits: 3,
            semester: "Học kỳ 1, năm học 2020-2021",
            semesterId: "2020-2021-1",
            progressGrade: 8.5,
            examGrade: 8.5,
            finalGrade: 8.5,
            letterGrade: "A",
            status: "passed",
            courseType: [CourseType.SPECIALIZED, CourseType.REQUIRED],
          },
          {
            id: "course6",
            courseCode: "ENGL1001",
            courseName: "Tiếng Anh 1",
            credits: 3,
            semester: "Học kỳ 1, năm học 2020-2021",
            semesterId: "2020-2021-1",
            progressGrade: 7.0,
            examGrade: 7.0,
            finalGrade: 7.0,
            letterGrade: "B",
            status: "passed",
            courseType: [CourseType.GENERAL, CourseType.REQUIRED],
          },

          // Học kỳ 2, năm học 2020-2021
          {
            id: "course7",
            courseCode: "MATH1003",
            courseName: "Giải tích 2",
            credits: 3,
            semester: "Học kỳ 2, năm học 2020-2021",
            semesterId: "2020-2021-2",
            progressGrade: 8.0,
            examGrade: 8.0,
            finalGrade: 8.0,
            letterGrade: "B+",
            status: "passed",
            courseType: [CourseType.GENERAL, CourseType.REQUIRED],
          },
          {
            id: "course8",
            courseCode: "MATH1004",
            courseName: "Xác suất thống kê",
            credits: 3,
            semester: "Học kỳ 2, năm học 2020-2021",
            semesterId: "2020-2021-2",
            progressGrade: 7.5,
            examGrade: 7.5,
            finalGrade: 7.5,
            letterGrade: "B",
            status: "passed",
            courseType: [CourseType.GENERAL, CourseType.REQUIRED],
          },
          {
            id: "course9",
            courseCode: "COMP1003",
            courseName: "Kỹ thuật lập trình",
            credits: 3,
            semester: "Học kỳ 2, năm học 2020-2021",
            semesterId: "2020-2021-2",
            progressGrade: 8.5,
            examGrade: 8.5,
            finalGrade: 8.5,
            letterGrade: "A",
            status: "passed",
            courseType: [CourseType.SPECIALIZED, CourseType.REQUIRED],
          },
          {
            id: "course10",
            courseCode: "COMP1004",
            courseName: "Cấu trúc dữ liệu và giải thuật",
            credits: 3,
            semester: "Học kỳ 2, năm học 2020-2021",
            semesterId: "2020-2021-2",
            progressGrade: 8.0,
            examGrade: 8.0,
            finalGrade: 8.0,
            letterGrade: "B+",
            status: "passed",
            courseType: [CourseType.SPECIALIZED, CourseType.REQUIRED],
          },
          {
            id: "course11",
            courseCode: "ENGL1002",
            courseName: "Tiếng Anh 2",
            credits: 3,
            semester: "Học kỳ 2, năm học 2020-2021",
            semesterId: "2020-2021-2",
            progressGrade: 7.5,
            examGrade: 7.5,
            finalGrade: 7.5,
            letterGrade: "B",
            status: "passed",
            courseType: [CourseType.GENERAL, CourseType.REQUIRED],
          },
          {
            id: "course12",
            courseCode: "POLI1001",
            courseName: "Triết học Mác-Lênin",
            credits: 3,
            semester: "Học kỳ 2, năm học 2020-2021",
            semesterId: "2020-2021-2",
            progressGrade: 7.0,
            examGrade: 7.0,
            finalGrade: 7.0,
            letterGrade: "B",
            status: "passed",
            courseType: [CourseType.GENERAL, CourseType.REQUIRED],
          },

          // Học kỳ 1, năm học 2021-2022
          {
            id: "course13",
            courseCode: "COMP2001",
            courseName: "Cơ sở dữ liệu",
            credits: 3,
            semester: "Học kỳ 1, năm học 2021-2022",
            semesterId: "2021-2022-1",
            progressGrade: 8.5,
            examGrade: 8.5,
            finalGrade: 8.5,
            letterGrade: "A",
            status: "passed",
            courseType: [CourseType.SPECIALIZED, CourseType.REQUIRED],
          },
          {
            id: "course14",
            courseCode: "COMP2002",
            courseName: "Lập trình hướng đối tượng",
            credits: 3,
            semester: "Học kỳ 1, năm học 2021-2022",
            semesterId: "2021-2022-1",
            progressGrade: 9.0,
            examGrade: 9.0,
            finalGrade: 9.0,
            letterGrade: "A",
            status: "passed",
            courseType: [CourseType.SPECIALIZED, CourseType.REQUIRED],
          },
          {
            id: "course15",
            courseCode: "COMP2003",
            courseName: "Kiến trúc máy tính",
            credits: 3,
            semester: "Học kỳ 1, năm học 2021-2022",
            semesterId: "2021-2022-1",
            progressGrade: 7.5,
            examGrade: 7.5,
            finalGrade: 7.5,
            letterGrade: "B",
            status: "passed",
            courseType: [CourseType.SPECIALIZED, CourseType.REQUIRED],
          },
          {
            id: "course16",
            courseCode: "COMP2004",
            courseName: "Hệ điều hành",
            credits: 3,
            semester: "Học kỳ 1, năm học 2021-2022",
            semesterId: "2021-2022-1",
            progressGrade: 8.0,
            examGrade: 8.0,
            finalGrade: 8.0,
            letterGrade: "B+",
            status: "passed",
            courseType: [CourseType.SPECIALIZED, CourseType.REQUIRED],
          },
          {
            id: "course17",
            courseCode: "ENGL2001",
            courseName: "Tiếng Anh 3",
            credits: 3,
            semester: "Học kỳ 1, năm học 2021-2022",
            semesterId: "2021-2022-1",
            progressGrade: 7.5,
            examGrade: 7.5,
            finalGrade: 7.5,
            letterGrade: "B",
            status: "passed",
            courseType: [CourseType.GENERAL, CourseType.REQUIRED],
          },
          {
            id: "course18",
            courseCode: "POLI2001",
            courseName: "Kinh tế chính trị Mác-Lênin",
            credits: 2,
            semester: "Học kỳ 1, năm học 2021-2022",
            semesterId: "2021-2022-1",
            progressGrade: 7.0,
            examGrade: 7.0,
            finalGrade: 7.0,
            letterGrade: "B",
            status: "passed",
            courseType: [CourseType.GENERAL, CourseType.REQUIRED],
          },

          // Học kỳ 2, năm học 2021-2022
          {
            id: "course19",
            courseCode: "COMP2005",
            courseName: "Mạng máy tính",
            credits: 3,
            semester: "Học kỳ 2, năm học 2021-2022",
            semesterId: "2021-2022-2",
            progressGrade: 8.0,
            examGrade: 8.0,
            finalGrade: 8.0,
            letterGrade: "B+",
            status: "passed",
            courseType: [CourseType.SPECIALIZED, CourseType.REQUIRED],
          },
          {
            id: "course20",
            courseCode: "COMP2006",
            courseName: "Phân tích và thiết kế hệ thống",
            credits: 3,
            semester: "Học kỳ 2, năm học 2021-2022",
            semesterId: "2021-2022-2",
            progressGrade: 8.5,
            examGrade: 8.5,
            finalGrade: 8.5,
            letterGrade: "A",
            status: "passed",
            courseType: [CourseType.SPECIALIZED, CourseType.REQUIRED],
          },
          {
            id: "course21",
            courseCode: "COMP2007",
            courseName: "Lập trình Web",
            credits: 3,
            semester: "Học kỳ 2, năm học 2021-2022",
            semesterId: "2021-2022-2",
            progressGrade: 9.0,
            examGrade: 9.0,
            finalGrade: 9.0,
            letterGrade: "A",
            status: "passed",
            courseType: [CourseType.SPECIALIZED, CourseType.REQUIRED],
          },
          {
            id: "course22",
            courseCode: "COMP2008",
            courseName: "Lập trình Java",
            credits: 3,
            semester: "Học kỳ 2, năm học 2021-2022",
            semesterId: "2021-2022-2",
            progressGrade: 8.5,
            examGrade: 8.5,
            finalGrade: 8.5,
            letterGrade: "A",
            status: "passed",
            courseType: [CourseType.SPECIALIZED, CourseType.REQUIRED],
          },
          {
            id: "course23",
            courseCode: "ENGL2002",
            courseName: "Tiếng Anh 4",
            credits: 3,
            semester: "Học kỳ 2, năm học 2021-2022",
            semesterId: "2021-2022-2",
            progressGrade: 8.0,
            examGrade: 8.0,
            finalGrade: 8.0,
            letterGrade: "B+",
            status: "passed",
            courseType: [CourseType.GENERAL, CourseType.REQUIRED],
          },
          {
            id: "course24",
            courseCode: "POLI2002",
            courseName: "Chủ nghĩa xã hội khoa học",
            credits: 2,
            semester: "Học kỳ 2, năm học 2021-2022",
            semesterId: "2021-2022-2",
            progressGrade: 7.5,
            examGrade: 7.5,
            finalGrade: 7.5,
            letterGrade: "B",
            status: "passed",
            courseType: [CourseType.GENERAL, CourseType.REQUIRED],
          },

          // Học kỳ 1, năm học 2022-2023
          {
            id: "course25",
            courseCode: "COMP3001",
            courseName: "Công nghệ phần mềm",
            credits: 3,
            semester: "Học kỳ 1, năm học 2022-2023",
            semesterId: "2022-2023-1",
            progressGrade: 8.5,
            examGrade: 8.5,
            finalGrade: 8.5,
            letterGrade: "A",
            status: "passed",
            courseType: [CourseType.SPECIALIZED, CourseType.REQUIRED],
          },
          {
            id: "course26",
            courseCode: "COMP3002",
            courseName: "Trí tuệ nhân tạo",
            credits: 3,
            semester: "Học kỳ 1, năm học 2022-2023",
            semesterId: "2022-2023-1",
            progressGrade: 8.0,
            examGrade: 8.0,
            finalGrade: 8.0,
            letterGrade: "B+",
            status: "passed",
            courseType: [CourseType.SPECIALIZED, CourseType.REQUIRED],
          },
          {
            id: "course27",
            courseCode: "COMP3003",
            courseName: "An toàn thông tin",
            credits: 3,
            semester: "Học kỳ 1, năm học 2022-2023",
            semesterId: "2022-2023-1",
            progressGrade: 7.5,
            examGrade: 7.5,
            finalGrade: 7.5,
            letterGrade: "B",
            status: "passed",
            courseType: [CourseType.SPECIALIZED, CourseType.REQUIRED],
          },
          {
            id: "course28",
            courseCode: "COMP3004",
            courseName: "Lập trình di động",
            credits: 3,
            semester: "Học kỳ 1, năm học 2022-2023",
            semesterId: "2022-2023-1",
            progressGrade: 8.5,
            examGrade: 8.5,
            finalGrade: 8.5,
            letterGrade: "A",
            status: "passed",
            courseType: [CourseType.SPECIALIZED, CourseType.ELECTIVE],
          },
          {
            id: "course29",
            courseCode: "COMP3005",
            courseName: "Lập trình Web nâng cao",
            credits: 3,
            semester: "Học kỳ 1, năm học 2022-2023",
            semesterId: "2022-2023-1",
            progressGrade: 9.0,
            examGrade: 9.0,
            finalGrade: 9.0,
            letterGrade: "A",
            status: "passed",
            courseType: [CourseType.SPECIALIZED, CourseType.ELECTIVE],
          },
        ];

        // Lọc theo học kỳ
        let filteredResults = courseGrades;
        if (semesterId !== "all") {
          filteredResults = filteredResults.filter(
            (course) => course.semesterId === semesterId
          );
        }

        // Lọc theo loại học phần
        if (courseType !== CourseType.ALL) {
          filteredResults = filteredResults.filter((course) =>
            course.courseType.includes(courseType)
          );
        }

        return filteredResults;
      } catch (error) {
        console.error("Error fetching course grades:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Lấy thống kê học kỳ
  const getSemesterSummaries = useCallback(async (): Promise<SemesterSummary[]> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<SemesterSummary[]>('/api/transcript/semester-summaries');

      // Dữ liệu mẫu cho thống kê học kỳ
      const semesterSummaries: SemesterSummary[] = [
        {
          semesterId: "2020-2021-1",
          semesterName: "Học kỳ 1, năm học 2020-2021",
          gpa: 8.08,
          totalCredits: 18,
          completedCredits: 18,
        },
        {
          semesterId: "2020-2021-2",
          semesterName: "Học kỳ 2, năm học 2020-2021",
          gpa: 7.75,
          totalCredits: 18,
          completedCredits: 18,
        },
        {
          semesterId: "2021-2022-1",
          semesterName: "Học kỳ 1, năm học 2021-2022",
          gpa: 7.94,
          totalCredits: 17,
          completedCredits: 17,
        },
        {
          semesterId: "2021-2022-2",
          semesterName: "Học kỳ 2, năm học 2021-2022",
          gpa: 8.25,
          totalCredits: 17,
          completedCredits: 17,
        },
        {
          semesterId: "2022-2023-1",
          semesterName: "Học kỳ 1, năm học 2022-2023",
          gpa: 8.30,
          totalCredits: 15,
          completedCredits: 15,
        },
        {
          semesterId: "2022-2023-2",
          semesterName: "Học kỳ 2, năm học 2022-2023",
          gpa: 8.50,
          totalCredits: 15,
          completedCredits: 15,
        },
      ];

      return semesterSummaries;
    } catch (error) {
      console.error("Error fetching semester summaries:", error);
      throw error;
    }
  }, [fetchApi]);

  // Lấy phân bố điểm
  const getGradeDistribution = useCallback(async (): Promise<GradeDistribution[]> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<GradeDistribution[]>('/api/transcript/grade-distribution');

      // Dữ liệu mẫu cho phân bố điểm
      const gradeDistribution: GradeDistribution[] = [
        {
          grade: "A/A+",
          count: 40,
          percentage: 40,
          color: "#4caf50",
        },
        {
          grade: "B+",
          count: 30,
          percentage: 30,
          color: "#2196f3",
        },
        {
          grade: "B",
          count: 20,
          percentage: 20,
          color: "#03a9f4",
        },
        {
          grade: "C+",
          count: 10,
          percentage: 10,
          color: "#ff9800",
        },
        {
          grade: "C",
          count: 0,
          percentage: 0,
          color: "#ff9800",
        },
        {
          grade: "D+",
          count: 0,
          percentage: 0,
          color: "#ff5722",
        },
        {
          grade: "D",
          count: 0,
          percentage: 0,
          color: "#ff5722",
        },
        {
          grade: "F",
          count: 0,
          percentage: 0,
          color: "#f44336",
        },
      ];

      return gradeDistribution;
    } catch (error) {
      console.error("Error fetching grade distribution:", error);
      throw error;
    }
  }, [fetchApi]);

  // Lấy tiến độ học tập
  const getAcademicProgress = useCallback(async (): Promise<AcademicProgress> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<AcademicProgress>('/api/transcript/academic-progress');

      // Dữ liệu mẫu cho tiến độ học tập
      const academicProgress: AcademicProgress = {
        totalCredits: 150,
        completedCredits: 100,
        remainingCredits: 50,
        completionPercentage: 66.67,
        categories: [
          {
            id: "general",
            name: "Khối kiến thức đại cương",
            totalCredits: 50,
            completedCredits: 40,
            completionPercentage: 80,
          },
          {
            id: "specialized",
            name: "Khối kiến thức chuyên ngành",
            totalCredits: 70,
            completedCredits: 45,
            completionPercentage: 64.29,
          },
          {
            id: "elective",
            name: "Khối kiến thức tự chọn",
            totalCredits: 20,
            completedCredits: 10,
            completionPercentage: 50,
          },
          {
            id: "thesis",
            name: "Khóa luận tốt nghiệp",
            totalCredits: 10,
            completedCredits: 5,
            completionPercentage: 50,
          },
        ],
      };

      return academicProgress;
    } catch (error) {
      console.error("Error fetching academic progress:", error);
      throw error;
    }
  }, [fetchApi]);

  // Lấy so sánh điểm
  const getGradeComparison = useCallback(async (): Promise<GradeComparison[]> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<GradeComparison[]>('/api/transcript/grade-comparison');

      // Dữ liệu mẫu cho so sánh điểm
      const gradeComparison: GradeComparison[] = [
        {
          semesterId: "2020-2021-1",
          semesterName: "HK1 20-21",
          gpa: 8.08,
          classAverage: 7.5,
          departmentAverage: 7.2,
        },
        {
          semesterId: "2020-2021-2",
          semesterName: "HK2 20-21",
          gpa: 7.75,
          classAverage: 7.3,
          departmentAverage: 7.0,
        },
        {
          semesterId: "2021-2022-1",
          semesterName: "HK1 21-22",
          gpa: 7.94,
          classAverage: 7.4,
          departmentAverage: 7.1,
        },
        {
          semesterId: "2021-2022-2",
          semesterName: "HK2 21-22",
          gpa: 8.25,
          classAverage: 7.6,
          departmentAverage: 7.3,
        },
        {
          semesterId: "2022-2023-1",
          semesterName: "HK1 22-23",
          gpa: 8.30,
          classAverage: 7.7,
          departmentAverage: 7.4,
        },
        {
          semesterId: "2022-2023-2",
          semesterName: "HK2 22-23",
          gpa: 8.50,
          classAverage: 7.8,
          departmentAverage: 7.5,
        },
      ];

      return gradeComparison;
    } catch (error) {
      console.error("Error fetching grade comparison:", error);
      throw error;
    }
  }, [fetchApi]);

  return {
    getStudentInfo,
    getGradeSummary,
    getSemesters,
    getCourseGrades,
    getSemesterSummaries,
    getGradeDistribution,
    getAcademicProgress,
    getGradeComparison,
  };
};

export default useTranscriptService;