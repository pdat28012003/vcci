import { useState, useEffect, useCallback } from "react";
import {
  useSemesterPlanService,
  SemesterPlanInfo,
  SemesterCreditSummary,
  SemesterCourse,
  RoadmapSemester,
  SemesterNote,
} from "../services/semesterPlanService";
import { useToast } from "./useUtils";

export const useSemesterPlan = () => {
  // State cho dữ liệu
  const [semesterPlanInfo, setSemesterPlanInfo] =
    useState<SemesterPlanInfo | null>(null);
  const [creditSummary, setCreditSummary] =
    useState<SemesterCreditSummary | null>(null);
  const [requiredCourses, setRequiredCourses] = useState<SemesterCourse[]>([]);
  const [electiveCourses, setElectiveCourses] = useState<SemesterCourse[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapSemester[]>([]);
  const [notes, setNotes] = useState<SemesterNote[]>([]);
  const [semesters, setSemesters] = useState<{ id: string; name: string }[]>(
    []
  );

  // State cho bộ lọc
  const [selectedSemesterId, setSelectedSemesterId] =
    useState<string>("2023-2024-2");

  // State cho UI
  const [loading, setLoading] = useState<boolean>(true);
  const [semesterLoading, setSemesterLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const {
    getSemesterPlanInfo,
    getSemesterCreditSummary,
    getRequiredCourses,
    getElectiveCourses,
    getLearningRoadmap,
    getSemesterNotes,
    getSemesters,
    exportSemesterPlan,
  } = useSemesterPlanService();
  const { showToast } = useToast();

  // Lấy dữ liệu ban đầu
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Gọi API lấy dữ liệu từ service
      const [infoData, semestersData, roadmapData] = await Promise.all([
        getSemesterPlanInfo(),
        getSemesters(),
        getLearningRoadmap(),
      ]);

      setSemesterPlanInfo(infoData);
      setSemesters(semestersData);
      setRoadmap(roadmapData);

      // Lấy dữ liệu cho học kỳ mặc định
      await fetchSemesterData(selectedSemesterId);

      setLoading(false);
    } catch (err) {
      setError(
        "Có lỗi xảy ra khi tải dữ liệu khung chương trình theo kỳ. Vui lòng thử lại sau."
      );
      setLoading(false);
      showToast(
        "Có lỗi xảy ra khi tải dữ liệu khung chương trình theo kỳ",
        "error"
      );
    }
  }, [
    getSemesterPlanInfo,
    getSemesters,
    getLearningRoadmap,
    selectedSemesterId,
    showToast,
  ]);

  // Lấy dữ liệu cho học kỳ cụ thể
  const fetchSemesterData = useCallback(
    async (semesterId: string) => {
      try {
        setSemesterLoading(true);

        // Gọi API lấy dữ liệu học kỳ
        const [summaryData, requiredData, electiveData, notesData] =
          await Promise.all([
            getSemesterCreditSummary(semesterId),
            getRequiredCourses(semesterId),
            getElectiveCourses(semesterId),
            getSemesterNotes(semesterId),
          ]);

        setCreditSummary(summaryData);
        setRequiredCourses(requiredData);
        setElectiveCourses(electiveData);
        setNotes(notesData);

        setSemesterLoading(false);
      } catch (err) {
        showToast("Có lỗi xảy ra khi tải dữ liệu học kỳ", "error");
        setSemesterLoading(false);
      }
    },
    [
      getSemesterCreditSummary,
      getRequiredCourses,
      getElectiveCourses,
      getSemesterNotes,
      showToast,
    ]
  );

  // Xử lý khi thay đổi học kỳ
  const changeSemester = useCallback(
    async (semesterId: string) => {
      setSelectedSemesterId(semesterId);
      await fetchSemesterData(semesterId);
    },
    [fetchSemesterData]
  );

  // Xử lý in kế hoạch học tập học kỳ
  const printSemesterPlan = useCallback(() => {
    window.print();
  }, []);

  // Xử lý xuất file kế hoạch học tập học kỳ
  const handleExportSemesterPlan = useCallback(
    async (format: "pdf" | "excel" = "pdf") => {
      try {
        showToast(
          `Đang xuất file kế hoạch học tập dạng ${format.toUpperCase()}...`,
          "info"
        );

        // Gọi API xuất file
        const { url } = await exportSemesterPlan(selectedSemesterId, format);

        // Trong thực tế, đây sẽ là tải file thực sự
        // window.open(url, '_blank');

        showToast(`Xuất file kế hoạch học tập thành công`, "success");
      } catch (err) {
        showToast("Có lỗi xảy ra khi xuất file kế hoạch học tập", "error");
      }
    },
    [exportSemesterPlan, selectedSemesterId, showToast]
  );

  // Tải dữ liệu khi component được mount
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return {
    // Dữ liệu
    semesterPlanInfo,
    creditSummary,
    requiredCourses,
    electiveCourses,
    roadmap,
    notes,
    semesters,

    // Trạng thái
    selectedSemesterId,
    loading,
    semesterLoading,
    error,

    // Hàm xử lý
    changeSemester,
    printSemesterPlan,
    exportSemesterPlan: handleExportSemesterPlan,
    refreshData: fetchInitialData,
  };
};

export default useSemesterPlan;
