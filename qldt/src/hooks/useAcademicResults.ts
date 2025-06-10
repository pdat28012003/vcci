import { useState, useEffect, useCallback } from "react";
import {
  useAcademicResultsService,
  AcademicResultsInfo,
  SemesterInfo,
  CourseResult,
  GradeDistribution,
  AcademicProgress,
  CourseType,
} from "../services/academicResultsService";
import { useToast } from "./useUtils";

// Enum cho tab hiển thị
export enum ResultsTabView {
  OVERVIEW = "overview",
  DETAILS = "details",
  DISTRIBUTION = "distribution",
  PROGRESS = "progress",
  COMPARISON = "comparison",
}

// Hook để quản lý kết quả học tập
export const useAcademicResults = () => {
  // State cho dữ liệu
  const [resultsInfo, setResultsInfo] = useState<AcademicResultsInfo | null>(null);
  const [semesters, setSemesters] = useState<SemesterInfo[]>([]);
  const [courseResults, setCourseResults] = useState<CourseResult[]>([]);
  const [gradeDistribution, setGradeDistribution] = useState<GradeDistribution[]>([]);
  const [academicProgress, setAcademicProgress] = useState<AcademicProgress | null>(null);

  // State cho bộ lọc và hiển thị
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>("all");
  const [selectedCourseType, setSelectedCourseType] = useState<CourseType>(CourseType.ALL);
  const [activeTab, setActiveTab] = useState<ResultsTabView>(ResultsTabView.OVERVIEW);

  // State cho UI
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const {
    getAcademicResultsInfo,
    getSemesters,
    getCourseResults,
    getGradeDistribution,
    getAcademicProgress,
    exportAcademicResults,
  } = useAcademicResultsService();
  const { showToast } = useToast();

  // Lấy dữ liệu ban đầu
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Gọi API lấy dữ liệu từ service
      const [infoData, semestersData, resultsData, distributionData, progressData] = await Promise.all([
        getAcademicResultsInfo(),
        getSemesters(),
        getCourseResults("all", CourseType.ALL),
        getGradeDistribution("all"),
        getAcademicProgress(),
      ]);

      setResultsInfo(infoData);
      setSemesters(semestersData);
      setCourseResults(resultsData);
      setGradeDistribution(distributionData);
      setAcademicProgress(progressData);

      setLoading(false);
    } catch (err) {
      setError(
        "Có lỗi xảy ra khi tải dữ liệu kết quả học tập. Vui lòng thử lại sau."
      );
      setLoading(false);
      showToast(
        "Có lỗi xảy ra khi tải dữ liệu kết quả học tập",
        "error"
      );
    }
  }, [
    getAcademicResultsInfo,
    getSemesters,
    getCourseResults,
    getGradeDistribution,
    getAcademicProgress,
    showToast,
  ]);

  // Xử lý khi thay đổi học kỳ
  const changeSemester = useCallback(
    async (semesterId: string) => {
      try {
        setLoading(true);
        setSelectedSemesterId(semesterId);
        
        // Lấy kết quả học tập và phân bố điểm cho học kỳ mới
        const [resultsData, distributionData] = await Promise.all([
          getCourseResults(semesterId, selectedCourseType),
          getGradeDistribution(semesterId),
        ]);
        
        setCourseResults(resultsData);
        setGradeDistribution(distributionData);
        setLoading(false);
      } catch (err) {
        showToast("Có lỗi xảy ra khi thay đổi học kỳ", "error");
        setLoading(false);
      }
    },
    [getCourseResults, getGradeDistribution, selectedCourseType, showToast]
  );

  // Xử lý khi thay đổi loại học phần
  const changeCourseType = useCallback(
    async (courseType: CourseType) => {
      try {
        setLoading(true);
        setSelectedCourseType(courseType);
        
        // Lấy kết quả học tập cho loại học phần mới
        const resultsData = await getCourseResults(selectedSemesterId, courseType);
        setCourseResults(resultsData);
        setLoading(false);
      } catch (err) {
        showToast("Có lỗi xảy ra khi thay đổi loại học phần", "error");
        setLoading(false);
      }
    },
    [getCourseResults, selectedSemesterId, showToast]
  );

  // Xử lý khi thay đổi tab
  const changeTab = useCallback((tab: ResultsTabView) => {
    setActiveTab(tab);
  }, []);

  // Tính điểm trung bình học kỳ
  const calculateSemesterGPA = useCallback((semesterId: string) => {
    const semesterCourses = courseResults.filter(
      (course) => course.semesterId === semesterId && course.status === "passed"
    );
    
    if (semesterCourses.length === 0) return 0;
    
    const totalGradePoints = semesterCourses.reduce(
      (sum, course) => sum + course.gradePoint * course.credits,
      0
    );
    
    const totalCredits = semesterCourses.reduce(
      (sum, course) => sum + course.credits,
      0
    );
    
    return totalGradePoints / totalCredits;
  }, [courseResults]);

  // Nhóm kết quả học tập theo học kỳ
  const groupedCourseResults = useCallback(() => {
    const grouped: Record<string, CourseResult[]> = {};

    courseResults.forEach((course) => {
      if (!grouped[course.semesterId]) {
        grouped[course.semesterId] = [];
      }
      grouped[course.semesterId].push(course);
    });

    // Sắp xếp theo học kỳ (mới nhất trước)
    return Object.keys(grouped)
      .sort((a, b) => {
        // Nếu "all" thì đặt lên đầu
        if (a === "all") return -1;
        if (b === "all") return 1;
        
        // Sắp xếp theo năm học và học kỳ
        const [yearA, semA] = a.split("-");
        const [yearB, semB] = b.split("-");
        
        // So sánh năm học trước
        if (yearA !== yearB) return yearB.localeCompare(yearA);
        
        // Nếu cùng năm học, so sánh học kỳ
        return semB.localeCompare(semA);
      })
      .map((semesterId) => ({
        semesterId,
        semesterName: semesters.find((s) => s.id === semesterId)?.name || semesterId,
        courses: grouped[semesterId].sort((a, b) => {
          // Sắp xếp theo mã học phần
          return a.courseCode.localeCompare(b.courseCode);
        }),
      }));
  }, [courseResults, semesters]);

  // Xử lý in kết quả học tập
  const printResults = useCallback(() => {
    window.print();
  }, []);

  // Xử lý xuất file kết quả học tập
  const handleExportResults = useCallback(
    async (format: "pdf" | "excel" = "pdf") => {
      try {
        showToast(
          `Đang xuất file kết quả học tập dạng ${format.toUpperCase()}...`,
          "info"
        );

        // Gọi API xuất file
        const { url } = await exportAcademicResults(selectedSemesterId, format);

        // Trong thực tế, đây sẽ là tải file thực sự
        // window.open(url, '_blank');

        showToast(`Xuất file kết quả học tập thành công`, "success");
      } catch (err) {
        showToast("Có lỗi xảy ra khi xuất file kết quả học tập", "error");
      }
    },
    [exportAcademicResults, selectedSemesterId, showToast]
  );

  // Tải dữ liệu khi component được mount
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return {
    // Dữ liệu
    resultsInfo,
    semesters,
    courseResults,
    gradeDistribution,
    academicProgress,
    groupedCourseResults: groupedCourseResults(),

    // Trạng thái
    selectedSemesterId,
    selectedCourseType,
    activeTab,
    loading,
    error,

    // Hàm xử lý
    changeSemester,
    changeCourseType,
    changeTab,
    calculateSemesterGPA,
    printResults,
    exportResults: handleExportResults,
    refreshData: fetchInitialData,
  };
};

export default useAcademicResults;