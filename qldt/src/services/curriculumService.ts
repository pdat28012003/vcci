import { useCallback } from "react";
import useApiService from "../hooks/useApiService";

// Interface cho thông tin chung về khung chương trình
export interface CurriculumInfo {
  major: string;
  specialization: string;
  batch: string;
  totalCredits: number;
  duration: string;
}

// Interface cho thống kê tín chỉ
export interface CreditSummary {
  total: number;
  required: number;
  elective: number;
  general: number;
  specialized: number;
}

// Interface cho học phần
export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  type: "required" | "elective";
  category: "general" | "specialized";
  prerequisites: string[];
  previousCourses: string[];
  corequisites: string[];
}

// Interface cho học kỳ
export interface Semester {
  id: string;
  name: string;
  semesterNumber: number;
  courses: Course[];
}

// Interface cho năm học
export interface AcademicYear {
  id: string;
  name: string;
  yearNumber: number;
  totalCredits: number;
  semesters: Semester[];
}

// Interface cho bộ lọc
export interface CurriculumFilter {
  year: string;
  semester: string;
  courseType: string;
  searchText: string;
}

// Hook để quản lý các API liên quan đến khung chương trình
export const useCurriculumService = () => {
  const { fetchApi } = useApiService();

  // Lấy thông tin chung về khung chương trình
  const getCurriculumInfo = useCallback(async (): Promise<CurriculumInfo> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<CurriculumInfo>('/api/curriculum/info');

      // Giả lập độ trễ của API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Dữ liệu mẫu cho thông tin chung
      const curriculumInfo: CurriculumInfo = {
        major: "Công nghệ thông tin",
        specialization: "Kỹ thuật phần mềm",
        batch: "2020-2024",
        totalCredits: 150,
        duration: "4 năm",
      };

      return curriculumInfo;
    } catch (error) {
      console.error("Error fetching curriculum info:", error);
      throw error;
    }
  }, [fetchApi]);

  // Lấy thống kê tín chỉ
  const getCreditSummary = useCallback(async (): Promise<CreditSummary> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<CreditSummary>('/api/curriculum/credits');

      // Giả lập độ trễ của API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Dữ liệu mẫu cho thống kê tín chỉ
      const creditSummary: CreditSummary = {
        total: 150,
        required: 120,
        elective: 30,
        general: 45,
        specialized: 105,
      };

      return creditSummary;
    } catch (error) {
      console.error("Error fetching credit summary:", error);
      throw error;
    }
  }, [fetchApi]);

  // Lấy danh sách năm học và học kỳ
  const getAcademicYears = useCallback(
    async (filter?: CurriculumFilter): Promise<AcademicYear[]> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự với filter
        // return await fetchApi<AcademicYear[]>('/api/curriculum/years', { params: filter });

        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Dữ liệu mẫu cho năm học và học kỳ
        const academicYears: AcademicYear[] = [
          {
            id: "year1",
            name: "Năm thứ nhất",
            yearNumber: 1,
            totalCredits: 36,
            semesters: [
              {
                id: "sem1",
                name: "Học kỳ 1",
                semesterNumber: 1,
                courses: [
                  {
                    id: "course1",
                    code: "MATH1001",
                    name: "Giải tích 1",
                    credits: 3,
                    type: "required",
                    category: "general",
                    prerequisites: [],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course2",
                    code: "MATH1002",
                    name: "Đại số tuyến tính",
                    credits: 3,
                    type: "required",
                    category: "general",
                    prerequisites: [],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course3",
                    code: "PHYS1001",
                    name: "Vật lý đại cương",
                    credits: 3,
                    type: "required",
                    category: "general",
                    prerequisites: [],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course4",
                    code: "COMP1001",
                    name: "Nhập môn lập trình",
                    credits: 3,
                    type: "required",
                    category: "specialized",
                    prerequisites: [],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course5",
                    code: "COMP1002",
                    name: "Nhập môn công nghệ thông tin",
                    credits: 3,
                    type: "required",
                    category: "specialized",
                    prerequisites: [],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course6",
                    code: "ENGL1001",
                    name: "Tiếng Anh 1",
                    credits: 3,
                    type: "required",
                    category: "general",
                    prerequisites: [],
                    previousCourses: [],
                    corequisites: [],
                  },
                ],
              },
              {
                id: "sem2",
                name: "Học kỳ 2",
                semesterNumber: 2,
                courses: [
                  {
                    id: "course7",
                    code: "MATH1003",
                    name: "Giải tích 2",
                    credits: 3,
                    type: "required",
                    category: "general",
                    prerequisites: ["MATH1001"],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course8",
                    code: "MATH1004",
                    name: "Xác suất thống kê",
                    credits: 3,
                    type: "required",
                    category: "general",
                    prerequisites: [],
                    previousCourses: ["MATH1001"],
                    corequisites: [],
                  },
                  {
                    id: "course9",
                    code: "COMP1003",
                    name: "Kỹ thuật lập trình",
                    credits: 3,
                    type: "required",
                    category: "specialized",
                    prerequisites: ["COMP1001"],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course10",
                    code: "COMP1004",
                    name: "Cấu trúc dữ liệu và giải thuật",
                    credits: 3,
                    type: "required",
                    category: "specialized",
                    prerequisites: ["COMP1001"],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course11",
                    code: "ENGL1002",
                    name: "Tiếng Anh 2",
                    credits: 3,
                    type: "required",
                    category: "general",
                    prerequisites: ["ENGL1001"],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course12",
                    code: "POLI1001",
                    name: "Triết học Mác-Lênin",
                    credits: 3,
                    type: "required",
                    category: "general",
                    prerequisites: [],
                    previousCourses: [],
                    corequisites: [],
                  },
                ],
              },
            ],
          },
          {
            id: "year2",
            name: "Năm thứ hai",
            yearNumber: 2,
            totalCredits: 36,
            semesters: [
              {
                id: "sem3",
                name: "Học kỳ 1",
                semesterNumber: 1,
                courses: [
                  {
                    id: "course13",
                    code: "COMP2001",
                    name: "Cơ sở dữ liệu",
                    credits: 3,
                    type: "required",
                    category: "specialized",
                    prerequisites: ["COMP1004"],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course14",
                    code: "COMP2002",
                    name: "Lập trình hướng đối tượng",
                    credits: 3,
                    type: "required",
                    category: "specialized",
                    prerequisites: ["COMP1003"],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course15",
                    code: "COMP2003",
                    name: "Kiến trúc máy tính",
                    credits: 3,
                    type: "required",
                    category: "specialized",
                    prerequisites: [],
                    previousCourses: ["COMP1002"],
                    corequisites: [],
                  },
                  {
                    id: "course16",
                    code: "COMP2004",
                    name: "Hệ điều hành",
                    credits: 3,
                    type: "required",
                    category: "specialized",
                    prerequisites: [],
                    previousCourses: ["COMP2003"],
                    corequisites: [],
                  },
                  {
                    id: "course17",
                    code: "ENGL2001",
                    name: "Tiếng Anh 3",
                    credits: 3,
                    type: "required",
                    category: "general",
                    prerequisites: ["ENGL1002"],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course18",
                    code: "POLI2001",
                    name: "Kinh tế chính trị Mác-Lênin",
                    credits: 2,
                    type: "required",
                    category: "general",
                    prerequisites: ["POLI1001"],
                    previousCourses: [],
                    corequisites: [],
                  },
                ],
              },
              {
                id: "sem4",
                name: "Học kỳ 2",
                semesterNumber: 2,
                courses: [
                  {
                    id: "course19",
                    code: "COMP2005",
                    name: "Mạng máy tính",
                    credits: 3,
                    type: "required",
                    category: "specialized",
                    prerequisites: [],
                    previousCourses: ["COMP2003"],
                    corequisites: [],
                  },
                  {
                    id: "course20",
                    code: "COMP2006",
                    name: "Phân tích và thiết kế hệ thống",
                    credits: 3,
                    type: "required",
                    category: "specialized",
                    prerequisites: ["COMP2001"],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course21",
                    code: "COMP2007",
                    name: "Lập trình Web",
                    credits: 3,
                    type: "required",
                    category: "specialized",
                    prerequisites: ["COMP2002"],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course22",
                    code: "COMP2008",
                    name: "Lập trình Java",
                    credits: 3,
                    type: "required",
                    category: "specialized",
                    prerequisites: ["COMP2002"],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course23",
                    code: "ENGL2002",
                    name: "Tiếng Anh 4",
                    credits: 3,
                    type: "required",
                    category: "general",
                    prerequisites: ["ENGL2001"],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course24",
                    code: "POLI2002",
                    name: "Chủ nghĩa xã hội khoa học",
                    credits: 2,
                    type: "required",
                    category: "general",
                    prerequisites: ["POLI2001"],
                    previousCourses: [],
                    corequisites: [],
                  },
                ],
              },
            ],
          },
          {
            id: "year3",
            name: "Năm thứ ba",
            yearNumber: 3,
            totalCredits: 36,
            semesters: [
              {
                id: "sem5",
                name: "Học kỳ 1",
                semesterNumber: 1,
                courses: [
                  {
                    id: "course25",
                    code: "COMP3001",
                    name: "Công nghệ phần mềm",
                    credits: 4,
                    type: "required",
                    category: "specialized",
                    prerequisites: ["COMP2006"],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course26",
                    code: "COMP3002",
                    name: "Trí tuệ nhân tạo",
                    credits: 3,
                    type: "required",
                    category: "specialized",
                    prerequisites: ["COMP1004"],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course27",
                    code: "COMP3003",
                    name: "An toàn và bảo mật thông tin",
                    credits: 3,
                    type: "required",
                    category: "specialized",
                    prerequisites: [],
                    previousCourses: ["COMP2005"],
                    corequisites: [],
                  },
                  {
                    id: "course28",
                    code: "COMP3004",
                    name: "Lập trình di động",
                    credits: 3,
                    type: "required",
                    category: "specialized",
                    prerequisites: ["COMP2008"],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course29",
                    code: "COMP3005",
                    name: "Phát triển ứng dụng web",
                    credits: 3,
                    type: "required",
                    category: "specialized",
                    prerequisites: ["COMP2007"],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course30",
                    code: "POLI3001",
                    name: "Lịch sử Đảng Cộng sản Việt Nam",
                    credits: 2,
                    type: "required",
                    category: "general",
                    prerequisites: ["POLI2002"],
                    previousCourses: [],
                    corequisites: [],
                  },
                ],
              },
              {
                id: "sem6",
                name: "Học kỳ 2",
                semesterNumber: 2,
                courses: [
                  {
                    id: "course31",
                    code: "COMP3006",
                    name: "Kiểm thử phần mềm",
                    credits: 3,
                    type: "required",
                    category: "specialized",
                    prerequisites: ["COMP3001"],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course32",
                    code: "COMP3007",
                    name: "Quản lý dự án phần mềm",
                    credits: 3,
                    type: "required",
                    category: "specialized",
                    prerequisites: ["COMP3001"],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course33",
                    code: "COMP3008",
                    name: "Học máy",
                    credits: 3,
                    type: "elective",
                    category: "specialized",
                    prerequisites: ["COMP3002"],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course34",
                    code: "COMP3009",
                    name: "Phát triển game",
                    credits: 3,
                    type: "elective",
                    category: "specialized",
                    prerequisites: ["COMP2002"],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course35",
                    code: "COMP3010",
                    name: "Điện toán đám mây",
                    credits: 3,
                    type: "elective",
                    category: "specialized",
                    prerequisites: ["COMP2005"],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course36",
                    code: "COMP3011",
                    name: "Thực tập doanh nghiệp",
                    credits: 3,
                    type: "required",
                    category: "specialized",
                    prerequisites: [],
                    previousCourses: [],
                    corequisites: [],
                  },
                ],
              },
            ],
          },
          {
            id: "year4",
            name: "Năm thứ tư",
            yearNumber: 4,
            totalCredits: 42,
            semesters: [
              {
                id: "sem7",
                name: "Học kỳ 1",
                semesterNumber: 1,
                courses: [
                  {
                    id: "course37",
                    code: "COMP4001",
                    name: "Phân tích dữ liệu lớn",
                    credits: 3,
                    type: "elective",
                    category: "specialized",
                    prerequisites: ["COMP3008"],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course38",
                    code: "COMP4002",
                    name: "Internet vạn vật",
                    credits: 3,
                    type: "elective",
                    category: "specialized",
                    prerequisites: ["COMP2005"],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course39",
                    code: "COMP4003",
                    name: "Blockchain và ứng dụng",
                    credits: 3,
                    type: "elective",
                    category: "specialized",
                    prerequisites: [],
                    previousCourses: ["COMP3003"],
                    corequisites: [],
                  },
                  {
                    id: "course40",
                    code: "COMP4004",
                    name: "Xử lý ngôn ngữ tự nhiên",
                    credits: 3,
                    type: "elective",
                    category: "specialized",
                    prerequisites: ["COMP3008"],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course41",
                    code: "COMP4005",
                    name: "Thị giác máy tính",
                    credits: 3,
                    type: "elective",
                    category: "specialized",
                    prerequisites: ["COMP3008"],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course42",
                    code: "COMP4006",
                    name: "Đồ án chuyên ngành",
                    credits: 3,
                    type: "required",
                    category: "specialized",
                    prerequisites: [],
                    previousCourses: ["COMP3011"],
                    corequisites: [],
                  },
                ],
              },
              {
                id: "sem8",
                name: "Học kỳ 2",
                semesterNumber: 2,
                courses: [
                  {
                    id: "course43",
                    code: "COMP4007",
                    name: "Khóa luận tốt nghiệp",
                    credits: 10,
                    type: "required",
                    category: "specialized",
                    prerequisites: ["COMP4006"],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course44",
                    code: "COMP4008",
                    name: "Chuyên đề tốt nghiệp 1",
                    credits: 3,
                    type: "elective",
                    category: "specialized",
                    prerequisites: [],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course45",
                    code: "COMP4009",
                    name: "Chuyên đề tốt nghiệp 2",
                    credits: 3,
                    type: "elective",
                    category: "specialized",
                    prerequisites: [],
                    previousCourses: [],
                    corequisites: [],
                  },
                  {
                    id: "course46",
                    code: "COMP4010",
                    name: "Chuyên đề tốt nghiệp 3",
                    credits: 4,
                    type: "elective",
                    category: "specialized",
                    prerequisites: [],
                    previousCourses: [],
                    corequisites: [],
                  },
                ],
              },
            ],
          },
        ];

        // Áp dụng bộ lọc nếu có
        if (filter) {
          let filteredYears = [...academicYears];

          // Lọc theo năm học
          if (filter.year && filter.year !== "all") {
            filteredYears = filteredYears.filter(
              (year) => year.yearNumber === parseInt(filter.year)
            );
          }

          // Lọc theo học kỳ và loại học phần cho mỗi năm học
          filteredYears = filteredYears.map((year) => {
            let filteredSemesters = [...year.semesters];

            // Lọc theo học kỳ
            if (filter.semester && filter.semester !== "all") {
              filteredSemesters = filteredSemesters.filter(
                (semester) =>
                  semester.semesterNumber === parseInt(filter.semester)
              );
            }

            // Lọc các học phần trong mỗi học kỳ
            filteredSemesters = filteredSemesters.map((semester) => {
              let filteredCourses = [...semester.courses];

              // Lọc theo loại học phần
              if (filter.courseType && filter.courseType !== "all") {
                if (
                  filter.courseType === "required" ||
                  filter.courseType === "elective"
                ) {
                  filteredCourses = filteredCourses.filter(
                    (course) => course.type === filter.courseType
                  );
                } else if (
                  filter.courseType === "general" ||
                  filter.courseType === "specialized"
                ) {
                  filteredCourses = filteredCourses.filter(
                    (course) => course.category === filter.courseType
                  );
                }
              }

              // Lọc theo từ khóa tìm kiếm
              if (filter.searchText) {
                const searchText = filter.searchText.toLowerCase();
                filteredCourses = filteredCourses.filter(
                  (course) =>
                    course.code.toLowerCase().includes(searchText) ||
                    course.name.toLowerCase().includes(searchText)
                );
              }

              return {
                ...semester,
                courses: filteredCourses,
              };
            });

            return {
              ...year,
              semesters: filteredSemesters,
            };
          });

          return filteredYears;
        }

        return academicYears;
      } catch (error) {
        console.error("Error fetching academic years:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Xuất file khung chương trình
  const exportCurriculum = useCallback(
    async (format: "pdf" | "excel" = "pdf"): Promise<{ url: string }> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<{url: string}>('/api/curriculum/export', { method: 'POST', data: { format } });

        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Dữ liệu mẫu cho URL tải xuống
        return {
          url: `/downloads/curriculum-export.${format}`,
        };
      } catch (error) {
        console.error("Error exporting curriculum:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  return {
    getCurriculumInfo,
    getCreditSummary,
    getAcademicYears,
    exportCurriculum,
  };
};

export default useCurriculumService;
