import { useCallback } from "react";
import useApiService from "../hooks/useApiService";

// Interface cho thông tin thống kê kết quả thi
export interface ExamResultsStats {
  totalExams: number;
  completedExams: number;
  pendingExams: number;
  averageGrade: number;
}

// Interface cho học kỳ
export interface SemesterInfo {
  id: string;
  name: string;
  isCurrent: boolean;
}

// Interface cho môn học
export interface SubjectInfo {
  id: string;
  code: string;
  name: string;
}

// Interface cho trạng thái kết quả thi
export enum ExamResultStatus {
  ALL = "all",
  PASSED = "passed",
  FAILED = "failed",
  PENDING = "pending",
}

// Interface cho kết quả thi của một môn học
export interface ExamResult {
  id: string;
  courseCode: string;
  courseName: string;
  credits: number;
  examDate: string;
  progressGrade: number;
  examGrade: number | null;
  finalGrade: number | null;
  status: ExamResultStatus;
  semesterId: string;
  semesterName: string;
}

// Interface cho chi tiết kết quả thi
export interface ExamResultDetail {
  id: string;
  courseCode: string;
  courseName: string;
  credits: number;
  examDate: string;
  examRoom: string;
  examTime: string;
  examType: string;
  examDuration: number;
  progressGrade: number;
  progressComponents: {
    attendance: number;
    assignment: number;
    midterm: number;
    practice: number | null;
  };
  examGrade: number | null;
  finalGrade: number | null;
  status: ExamResultStatus;
  gradeScale: {
    letterGrade: string | null;
    gradePoint: number | null;
  };
  notes: string | null;
  instructor: string;
  department: string;
}

// Hook để quản lý các API liên quan đến kết quả thi
export const useExamResultsService = () => {
  const { fetchApi } = useApiService();

  // Lấy thông tin thống kê kết quả thi
  const getExamResultsStats = useCallback(async (): Promise<ExamResultsStats> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<ExamResultsStats>('/api/exam-results/stats');

      // Dữ liệu mẫu cho thông tin thống kê
      const examResultsStats: ExamResultsStats = {
        totalExams: 12,
        completedExams: 10,
        pendingExams: 2,
        averageGrade: 8.2,
      };

      return examResultsStats;
    } catch (error) {
      console.error("Error fetching exam results stats:", error);
      throw error;
    }
  }, [fetchApi]);

  // Lấy danh sách học kỳ
  const getSemesters = useCallback(async (): Promise<SemesterInfo[]> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<SemesterInfo[]>('/api/exam-results/semesters');

      // Dữ liệu mẫu cho danh sách học kỳ
      const semesters: SemesterInfo[] = [
        {
          id: "all",
          name: "Tất cả",
          isCurrent: false,
        },
        {
          id: "20232",
          name: "Học kỳ 2, năm học 2023-2024",
          isCurrent: true,
        },
        {
          id: "20231",
          name: "Học kỳ 1, năm học 2023-2024",
          isCurrent: false,
        },
        {
          id: "20222",
          name: "Học kỳ 2, năm học 2022-2023",
          isCurrent: false,
        },
        {
          id: "20221",
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

  // Lấy danh sách môn học
  const getSubjects = useCallback(
    async (semesterId: string = "all"): Promise<SubjectInfo[]> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<SubjectInfo[]>('/api/exam-results/subjects', { params: { semesterId } });

        // Dữ liệu mẫu cho danh sách môn học
        const subjects: SubjectInfo[] = [
          {
            id: "all",
            code: "all",
            name: "Tất cả môn học",
          },
          {
            id: "CNPM101",
            code: "CNPM101",
            name: "Công nghệ phần mềm nâng cao",
          },
          {
            id: "TTNT201",
            code: "TTNT201",
            name: "Trí tuệ nhân tạo",
          },
          {
            id: "HTTT301",
            code: "HTTT301",
            name: "Hệ thống thông tin doanh nghiệp",
          },
          {
            id: "MMT202",
            code: "MMT202",
            name: "Mạng máy tính nâng cao",
          },
          {
            id: "ATTT301",
            code: "ATTT301",
            name: "An toàn thông tin nâng cao",
          },
          {
            id: "KTPM301",
            code: "KTPM301",
            name: "Kiểm thử phần mềm nâng cao",
          },
          {
            id: "QLDA401",
            code: "QLDA401",
            name: "Quản lý dự án phần mềm",
          },
          {
            id: "PTUD301",
            code: "PTUD301",
            name: "Phát triển ứng dụng di động",
          },
          {
            id: "CSDL401",
            code: "CSDL401",
            name: "Cơ sở dữ liệu phân tán",
          },
          {
            id: "KTMT301",
            code: "KTMT301",
            name: "Kiến trúc máy tính nâng cao",
          },
        ];

        // Lọc theo học kỳ nếu cần
        if (semesterId !== "all") {
          // Trong thực tế, API sẽ trả về danh sách môn học đã được lọc
          // Ở đây chúng ta giả định rằng tất cả các môn học đều có trong học kỳ được chọn
        }

        return subjects;
      } catch (error) {
        console.error("Error fetching subjects:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Lấy danh sách kết quả thi
  const getExamResults = useCallback(
    async (
      semesterId: string = "all",
      subjectId: string = "all",
      status: ExamResultStatus = ExamResultStatus.ALL
    ): Promise<ExamResult[]> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<ExamResult[]>('/api/exam-results', {
        //   params: { semesterId, subjectId, status }
        // });

        // Dữ liệu mẫu cho danh sách kết quả thi
        const examResults: ExamResult[] = [
          {
            id: "exam1",
            courseCode: "CNPM101",
            courseName: "Công nghệ phần mềm nâng cao",
            credits: 3,
            examDate: "10/06/2024",
            progressGrade: 8.5,
            examGrade: 8.0,
            finalGrade: 8.2,
            status: ExamResultStatus.PASSED,
            semesterId: "20232",
            semesterName: "Học kỳ 2, năm học 2023-2024",
          },
          {
            id: "exam2",
            courseCode: "TTNT201",
            courseName: "Trí tuệ nhân tạo",
            credits: 3,
            examDate: "05/06/2024",
            progressGrade: 7.5,
            examGrade: 8.5,
            finalGrade: 8.1,
            status: ExamResultStatus.PASSED,
            semesterId: "20232",
            semesterName: "Học kỳ 2, năm học 2023-2024",
          },
          {
            id: "exam3",
            courseCode: "HTTT301",
            courseName: "Hệ thống thông tin doanh nghiệp",
            credits: 3,
            examDate: "01/06/2024",
            progressGrade: 9.0,
            examGrade: 8.5,
            finalGrade: 8.7,
            status: ExamResultStatus.PASSED,
            semesterId: "20232",
            semesterName: "Học kỳ 2, năm học 2023-2024",
          },
          {
            id: "exam4",
            courseCode: "MMT202",
            courseName: "Mạng máy tính nâng cao",
            credits: 3,
            examDate: "28/05/2024",
            progressGrade: 8.0,
            examGrade: 7.5,
            finalGrade: 7.7,
            status: ExamResultStatus.PASSED,
            semesterId: "20232",
            semesterName: "Học kỳ 2, năm học 2023-2024",
          },
          {
            id: "exam5",
            courseCode: "ATTT301",
            courseName: "An toàn thông tin nâng cao",
            credits: 3,
            examDate: "25/05/2024",
            progressGrade: 7.0,
            examGrade: 7.0,
            finalGrade: 7.0,
            status: ExamResultStatus.PASSED,
            semesterId: "20232",
            semesterName: "Học kỳ 2, năm học 2023-2024",
          },
          {
            id: "exam6",
            courseCode: "KTPM301",
            courseName: "Kiểm thử phần mềm nâng cao",
            credits: 3,
            examDate: "20/05/2024",
            progressGrade: 9.5,
            examGrade: 9.0,
            finalGrade: 9.2,
            status: ExamResultStatus.PASSED,
            semesterId: "20232",
            semesterName: "Học kỳ 2, năm học 2023-2024",
          },
          {
            id: "exam7",
            courseCode: "QLDA401",
            courseName: "Quản lý dự án phần mềm",
            credits: 3,
            examDate: "15/05/2024",
            progressGrade: 8.0,
            examGrade: 8.0,
            finalGrade: 8.0,
            status: ExamResultStatus.PASSED,
            semesterId: "20232",
            semesterName: "Học kỳ 2, năm học 2023-2024",
          },
          {
            id: "exam8",
            courseCode: "PTUD301",
            courseName: "Phát triển ứng dụng di động",
            credits: 3,
            examDate: "10/05/2024",
            progressGrade: 8.5,
            examGrade: 9.0,
            finalGrade: 8.8,
            status: ExamResultStatus.PASSED,
            semesterId: "20232",
            semesterName: "Học kỳ 2, năm học 2023-2024",
          },
          {
            id: "exam9",
            courseCode: "CSDL401",
            courseName: "Cơ sở dữ liệu phân tán",
            credits: 3,
            examDate: "15/06/2024",
            progressGrade: 8.5,
            examGrade: null,
            finalGrade: null,
            status: ExamResultStatus.PENDING,
            semesterId: "20232",
            semesterName: "Học kỳ 2, năm học 2023-2024",
          },
          {
            id: "exam10",
            courseCode: "KTMT301",
            courseName: "Kiến trúc máy tính nâng cao",
            credits: 3,
            examDate: "20/06/2024",
            progressGrade: 7.5,
            examGrade: null,
            finalGrade: null,
            status: ExamResultStatus.PENDING,
            semesterId: "20232",
            semesterName: "Học kỳ 2, năm học 2023-2024",
          },
          {
            id: "exam11",
            courseCode: "LTDT101",
            courseName: "Lý thuyết đồ thị",
            credits: 3,
            examDate: "10/01/2024",
            progressGrade: 8.0,
            examGrade: 7.5,
            finalGrade: 7.7,
            status: ExamResultStatus.PASSED,
            semesterId: "20231",
            semesterName: "Học kỳ 1, năm học 2023-2024",
          },
          {
            id: "exam12",
            courseCode: "CTDL101",
            courseName: "Cấu trúc dữ liệu và giải thuật",
            credits: 4,
            examDate: "15/01/2024",
            progressGrade: 7.0,
            examGrade: 6.5,
            finalGrade: 6.7,
            status: ExamResultStatus.PASSED,
            semesterId: "20231",
            semesterName: "Học kỳ 1, năm học 2023-2024",
          },
        ];

        // Lọc theo học kỳ
        let filteredResults = examResults;
        if (semesterId !== "all") {
          filteredResults = filteredResults.filter(
            (result) => result.semesterId === semesterId
          );
        }

        // Lọc theo môn học
        if (subjectId !== "all") {
          filteredResults = filteredResults.filter(
            (result) => result.courseCode === subjectId
          );
        }

        // Lọc theo trạng thái
        if (status !== ExamResultStatus.ALL) {
          filteredResults = filteredResults.filter(
            (result) => result.status === status
          );
        }

        return filteredResults;
      } catch (error) {
        console.error("Error fetching exam results:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Lấy chi tiết kết quả thi
  const getExamResultDetail = useCallback(
    async (examId: string): Promise<ExamResultDetail> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<ExamResultDetail>(`/api/exam-results/${examId}`);

        // Dữ liệu mẫu cho chi tiết kết quả thi
        const examResultDetails: Record<string, ExamResultDetail> = {
          exam1: {
            id: "exam1",
            courseCode: "CNPM101",
            courseName: "Công nghệ phần mềm nâng cao",
            credits: 3,
            examDate: "10/06/2024",
            examRoom: "A1.203",
            examTime: "07:30 - 09:30",
            examType: "Tự luận",
            examDuration: 120,
            progressGrade: 8.5,
            progressComponents: {
              attendance: 10,
              assignment: 8.5,
              midterm: 8.0,
              practice: 8.5,
            },
            examGrade: 8.0,
            finalGrade: 8.2,
            status: ExamResultStatus.PASSED,
            gradeScale: {
              letterGrade: "B+",
              gradePoint: 3.5,
            },
            notes: null,
            instructor: "TS. Nguyễn Văn A",
            department: "Khoa Công nghệ thông tin",
          },
          // Thêm chi tiết cho các kết quả thi khác nếu cần
        };

        // Trong thực tế, API sẽ trả về chi tiết kết quả thi dựa trên examId
        // Ở đây chúng ta giả định rằng chỉ có chi tiết cho exam1
        if (examId === "exam1") {
          return examResultDetails.exam1;
        } else {
          // Tạo dữ liệu mẫu cho các examId khác
          const examResult = {
            id: examId,
            courseCode: "UNKNOWN",
            courseName: "Unknown Course",
            credits: 3,
            examDate: "01/01/2024",
            examRoom: "Unknown",
            examTime: "Unknown",
            examType: "Unknown",
            examDuration: 120,
            progressGrade: 0,
            progressComponents: {
              attendance: 0,
              assignment: 0,
              midterm: 0,
              practice: null,
            },
            examGrade: null,
            finalGrade: null,
            status: ExamResultStatus.PENDING,
            gradeScale: {
              letterGrade: null,
              gradePoint: null,
            },
            notes: "Không tìm thấy thông tin chi tiết",
            instructor: "Unknown",
            department: "Unknown",
          };

          throw new Error("Exam result detail not found");
        }
      } catch (error) {
        console.error(`Error fetching exam result detail for ${examId}:`, error);
        throw error;
      }
    },
    [fetchApi]
  );

  return {
    getExamResultsStats,
    getSemesters,
    getSubjects,
    getExamResults,
    getExamResultDetail,
  };
};

export default useExamResultsService;