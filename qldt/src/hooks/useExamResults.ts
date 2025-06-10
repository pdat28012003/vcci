import { useState, useEffect, useCallback } from "react";
import {
  useExamResultsService,
  ExamResultsStats,
  SemesterInfo,
  SubjectInfo,
  ExamResult,
  ExamResultDetail,
  ExamResultStatus,
} from "../services/examResultsService";
import { useToast } from "./useUtils";

// Hook để quản lý kết quả thi
export const useExamResults = () => {
  // State cho dữ liệu
  const [stats, setStats] = useState<ExamResultsStats | null>(null);
  const [semesters, setSemesters] = useState<SemesterInfo[]>([]);
  const [subjects, setSubjects] = useState<SubjectInfo[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [selectedExamDetail, setSelectedExamDetail] =
    useState<ExamResultDetail | null>(null);

  // State cho bộ lọc
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>("all");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<ExamResultStatus>(
    ExamResultStatus.ALL
  );

  // State cho UI
  const [loading, setLoading] = useState<boolean>(true);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  // Hooks
  const {
    getExamResultsStats,
    getSemesters,
    getSubjects,
    getExamResults,
    getExamResultDetail,
  } = useExamResultsService();
  const { showToast } = useToast();

  // Lấy dữ liệu ban đầu
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Gọi API lấy dữ liệu từ service
      const [statsData, semestersData, subjectsData, resultsData] =
        await Promise.all([
          getExamResultsStats(),
          getSemesters(),
          getSubjects(),
          getExamResults(),
        ]);

      setStats(statsData);
      setSemesters(semestersData);
      setSubjects(subjectsData);
      setExamResults(resultsData);

      // Tìm học kỳ hiện tại và thiết lập mặc định
      const currentSemester = semestersData.find(
        (semester) => semester.isCurrent
      );
      if (currentSemester) {
        setSelectedSemesterId(currentSemester.id);
        // Cập nhật lại danh sách kết quả thi cho học kỳ hiện tại
        const currentResults = await getExamResults(
          currentSemester.id,
          "all",
          ExamResultStatus.ALL
        );
        setExamResults(currentResults);
      }

      setLoading(false);
    } catch (err) {
      setError(
        "Có lỗi xảy ra khi tải dữ liệu kết quả thi. Vui lòng thử lại sau."
      );
      setLoading(false);
      showToast("Có lỗi xảy ra khi tải dữ liệu kết quả thi", "error");
    }
  }, [
    getExamResultsStats,
    getSemesters,
    getSubjects,
    getExamResults,
    showToast,
  ]);

  // Xử lý khi thay đổi bộ lọc
  const handleFilterChange = useCallback(
    async (
      semesterId: string = selectedSemesterId,
      subjectId: string = selectedSubjectId,
      status: ExamResultStatus = selectedStatus
    ) => {
      try {
        setLoading(true);

        // Cập nhật state cho bộ lọc
        setSelectedSemesterId(semesterId);
        setSelectedSubjectId(subjectId);
        setSelectedStatus(status);

        // Lấy danh sách môn học mới nếu học kỳ thay đổi
        if (semesterId !== selectedSemesterId) {
          const newSubjects = await getSubjects(semesterId);
          setSubjects(newSubjects);
          // Reset môn học đã chọn
          subjectId = "all";
          setSelectedSubjectId("all");
        }

        // Lấy kết quả thi mới dựa trên bộ lọc
        const filteredResults = await getExamResults(
          semesterId,
          subjectId,
          status
        );
        setExamResults(filteredResults);

        setLoading(false);
      } catch (err) {
        showToast("Có lỗi xảy ra khi lọc kết quả thi", "error");
        setLoading(false);
      }
    },
    [
      selectedSemesterId,
      selectedSubjectId,
      selectedStatus,
      getSubjects,
      getExamResults,
      showToast,
    ]
  );

  // Xử lý khi xem chi tiết kết quả thi
  const handleViewExamDetail = useCallback(
    async (examId: string) => {
      try {
        setDetailLoading(true);
        setShowDetailModal(true);

        // Lấy chi tiết kết quả thi
        const detail = await getExamResultDetail(examId);
        setSelectedExamDetail(detail);

        setDetailLoading(false);
      } catch (err) {
        showToast("Có lỗi xảy ra khi tải chi tiết kết quả thi", "error");
        setDetailLoading(false);
        setShowDetailModal(false);
      }
    },
    [getExamResultDetail, showToast]
  );

  // Đóng modal chi tiết
  const closeDetailModal = useCallback(() => {
    setShowDetailModal(false);
    setSelectedExamDetail(null);
  }, []);

  // Tính toán thống kê cho học kỳ đã chọn
  const calculateSemesterStats = useCallback(() => {
    if (!examResults.length) {
      return {
        totalExams: 0,
        completedExams: 0,
        pendingExams: 0,
        averageGrade: 0,
      };
    }

    const completedExams = examResults.filter(
      (result) =>
        result.status === ExamResultStatus.PASSED ||
        result.status === ExamResultStatus.FAILED
    );

    const pendingExams = examResults.filter(
      (result) => result.status === ExamResultStatus.PENDING
    );

    const totalExams = examResults.length;

    // Tính điểm trung bình
    const totalGrades = completedExams.reduce(
      (sum, result) => sum + (result.finalGrade || 0),
      0
    );

    const averageGrade =
      completedExams.length > 0
        ? parseFloat((totalGrades / completedExams.length).toFixed(1))
        : 0;

    return {
      totalExams,
      completedExams: completedExams.length,
      pendingExams: pendingExams.length,
      averageGrade,
    };
  }, [examResults]);

  // Lấy tên học kỳ đã chọn
  const getSelectedSemesterName = useCallback(() => {
    const semester = semesters.find((s) => s.id === selectedSemesterId);
    return semester ? semester.name : "Tất cả học kỳ";
  }, [semesters, selectedSemesterId]);

  // Tải dữ liệu khi component được mount
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return {
    // Dữ liệu
    stats,
    semesters,
    subjects,
    examResults,
    selectedExamDetail,
    semesterStats: calculateSemesterStats(),

    // Trạng thái bộ lọc
    selectedSemesterId,
    selectedSubjectId,
    selectedStatus,
    selectedSemesterName: getSelectedSemesterName(),

    // Trạng thái UI
    loading,
    detailLoading,
    error,
    showDetailModal,

    // Hàm xử lý
    handleFilterChange,
    handleViewExamDetail,
    closeDetailModal,
    refreshData: fetchInitialData,
  };
};

export default useExamResults;
