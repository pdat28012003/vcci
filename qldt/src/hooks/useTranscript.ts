import { useState, useEffect, useCallback } from "react";
import {
  useTranscriptService,
  StudentInfo,
  GradeSummary,
  SemesterInfo,
  CourseGrade,
  CourseType,
  SemesterSummary,
  GradeDistribution,
  AcademicProgress,
  GradeComparison,
} from "../services/transcriptService";
import { useToast } from "./useUtils";

// Hook để quản lý bảng điểm
export const useTranscript = () => {
  // State cho dữ liệu
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [gradeSummary, setGradeSummary] = useState<GradeSummary | null>(null);
  const [semesters, setSemesters] = useState<SemesterInfo[]>([]);
  const [courseGrades, setCourseGrades] = useState<CourseGrade[]>([]);
  const [semesterSummaries, setSemesterSummaries] = useState<SemesterSummary[]>([]);
  const [gradeDistribution, setGradeDistribution] = useState<GradeDistribution[]>([]);
  const [academicProgress, setAcademicProgress] = useState<AcademicProgress | null>(null);
  const [gradeComparison, setGradeComparison] = useState<GradeComparison[]>([]);

  // State cho bộ lọc
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>("all");
  const [selectedCourseType, setSelectedCourseType] = useState<CourseType>(CourseType.ALL);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // State cho tab
  const [activeTab, setActiveTab] = useState<string>("grades");

  // State cho UI
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const {
    getStudentInfo,
    getGradeSummary,
    getSemesters,
    getCourseGrades,
    getSemesterSummaries,
    getGradeDistribution,
    getAcademicProgress,
    getGradeComparison,
  } = useTranscriptService();
  const { showToast } = useToast();

  // Lấy dữ liệu ban đầu
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Gọi API lấy dữ liệu từ service
      const [
        studentInfoData,
        gradeSummaryData,
        semestersData,
        courseGradesData,
        semesterSummariesData,
        gradeDistributionData,
        academicProgressData,
        gradeComparisonData,
      ] = await Promise.all([
        getStudentInfo(),
        getGradeSummary(),
        getSemesters(),
        getCourseGrades(),
        getSemesterSummaries(),
        getGradeDistribution(),
        getAcademicProgress(),
        getGradeComparison(),
      ]);

      setStudentInfo(studentInfoData);
      setGradeSummary(gradeSummaryData);
      setSemesters(semestersData);
      setCourseGrades(courseGradesData);
      setSemesterSummaries(semesterSummariesData);
      setGradeDistribution(gradeDistributionData);
      setAcademicProgress(academicProgressData);
      setGradeComparison(gradeComparisonData);

      setLoading(false);
    } catch (err) {
      setError(
        "Có lỗi xảy ra khi tải dữ liệu bảng điểm. Vui lòng thử lại sau."
      );
      setLoading(false);
      showToast(
        "Có lỗi xảy ra khi tải dữ liệu bảng điểm",
        "error"
      );
    }
  }, [
    getStudentInfo,
    getGradeSummary,
    getSemesters,
    getCourseGrades,
    getSemesterSummaries,
    getGradeDistribution,
    getAcademicProgress,
    getGradeComparison,
    showToast,
  ]);

  // Xử lý khi thay đổi học kỳ
  const handleSemesterChange = useCallback(
    async (semesterId: string) => {
      try {
        setLoading(true);
        setSelectedSemesterId(semesterId);

        // Lấy kết quả học tập mới dựa trên học kỳ đã chọn
        const filteredCourseGrades = await getCourseGrades(
          semesterId,
          selectedCourseType
        );
        setCourseGrades(filteredCourseGrades);

        setLoading(false);
      } catch (err) {
        showToast("Có lỗi xảy ra khi lọc bảng điểm theo học kỳ", "error");
        setLoading(false);
      }
    },
    [selectedCourseType, getCourseGrades, showToast]
  );

  // Xử lý khi thay đổi loại học phần
  const handleCourseTypeChange = useCallback(
    async (courseType: CourseType) => {
      try {
        setLoading(true);
        setSelectedCourseType(courseType);

        // Lấy kết quả học tập mới dựa trên loại học phần đã chọn
        const filteredCourseGrades = await getCourseGrades(
          selectedSemesterId,
          courseType
        );
        setCourseGrades(filteredCourseGrades);

        setLoading(false);
      } catch (err) {
        showToast(
          "Có lỗi xảy ra khi lọc bảng điểm theo loại học phần",
          "error"
        );
        setLoading(false);
      }
    },
    [selectedSemesterId, getCourseGrades, showToast]
  );

  // Xử lý khi thay đổi tab
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  // Xử lý khi tìm kiếm
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
    },
    []
  );

  // Lọc kết quả học tập theo tìm kiếm
  const filteredCourseGrades = useCallback(() => {
    if (!searchQuery) return courseGrades;

    const lowerCaseQuery = searchQuery.toLowerCase();
    return courseGrades.filter(
      (course) =>
        course.courseCode.toLowerCase().includes(lowerCaseQuery) ||
        course.courseName.toLowerCase().includes(lowerCaseQuery)
    );
  }, [courseGrades, searchQuery]);

  // Xử lý khi in bảng điểm
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Xử lý khi xuất file bảng điểm
  const handleExport = useCallback(() => {
    showToast("Đang xuất file bảng điểm...", "info");
    // Trong thực tế, đây sẽ là API call để xuất file
  }, [showToast]);

  // Xử lý khi yêu cầu bảng điểm
  const handleRequestTranscript = useCallback(() => {
    showToast("Chức năng yêu cầu bảng điểm đang được phát triển", "info");
    // Trong thực tế, đây sẽ là API call để yêu cầu bảng điểm
  }, [showToast]);

  // Tải dữ liệu khi component được mount
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return {
    // Dữ liệu
    studentInfo,
    gradeSummary,
    semesters,
    courseGrades: filteredCourseGrades(),
    semesterSummaries,
    gradeDistribution,
    academicProgress,
    gradeComparison,

    // Trạng thái bộ lọc
    selectedSemesterId,
    selectedCourseType,
    searchQuery,

    // Trạng thái tab
    activeTab,

    // Trạng thái UI
    loading,
    error,

    // Hàm xử lý
    handleSemesterChange,
    handleCourseTypeChange,
    handleTabChange,
    handleSearch,
    handlePrint,
    handleExport,
    handleRequestTranscript,
    refreshData: fetchInitialData,
  };
};

export default useTranscript;