import { useState, useEffect, useCallback } from "react";
import {
  useExamScheduleService,
  ExamScheduleInfo,
  SemesterInfo,
  ExamNotification,
  ExamStats,
  ExamSchedule,
  ExamRegulation,
  ExamType,
} from "../services/examScheduleService";
import { useToast } from "./useUtils";

// Enum cho tab hiển thị
export enum ExamTabView {
  UPCOMING = "upcoming",
  ALL = "all",
  COMPLETED = "completed",
}

// Hook để quản lý lịch thi
export const useExamSchedule = () => {
  // State cho dữ liệu
  const [examInfo, setExamInfo] = useState<ExamScheduleInfo | null>(null);
  const [semesters, setSemesters] = useState<SemesterInfo[]>([]);
  const [notifications, setNotifications] = useState<ExamNotification[]>([]);
  const [stats, setStats] = useState<ExamStats | null>(null);
  const [examSchedules, setExamSchedules] = useState<ExamSchedule[]>([]);
  const [regulations, setRegulations] = useState<ExamRegulation[]>([]);

  // State cho bộ lọc và hiển thị
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>("");
  const [selectedExamType, setSelectedExamType] = useState<ExamType>(
    ExamType.ALL
  );
  const [activeTab, setActiveTab] = useState<ExamTabView>(ExamTabView.UPCOMING);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // State cho UI
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [syncingCalendar, setSyncingCalendar] = useState<boolean>(false);

  // Hooks
  const {
    getExamScheduleInfo,
    getSemesters,
    getExamNotifications,
    getExamStats,
    getExamSchedules,
    getExamRegulations,
    exportExamSchedule,
    syncWithGoogleCalendar,
  } = useExamScheduleService();
  const { showToast } = useToast();

  // Lấy dữ liệu ban đầu
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Gọi API lấy dữ liệu từ service
      const [infoData, semestersData, regulationsData] = await Promise.all([
        getExamScheduleInfo(),
        getSemesters(),
        getExamRegulations(),
      ]);

      setExamInfo(infoData);
      setSemesters(semestersData);
      setRegulations(regulationsData);

      // Tìm học kỳ hiện tại
      const currentSemester = semestersData.find((sem) => sem.isCurrent);
      if (currentSemester) {
        setSelectedSemesterId(currentSemester.id);

        // Lấy thông báo, thống kê và lịch thi cho học kỳ hiện tại
        const [notificationsData, statsData, schedulesData] = await Promise.all(
          [
            getExamNotifications(currentSemester.id),
            getExamStats(currentSemester.id),
            getExamSchedules(currentSemester.id, ExamType.ALL),
          ]
        );

        setNotifications(notificationsData);
        setStats(statsData);
        setExamSchedules(schedulesData);
      }

      setLoading(false);
    } catch (err) {
      setError("Có lỗi xảy ra khi tải dữ liệu lịch thi. Vui lòng thử lại sau.");
      setLoading(false);
      showToast("Có lỗi xảy ra khi tải dữ liệu lịch thi", "error");
    }
  }, [
    getExamScheduleInfo,
    getSemesters,
    getExamNotifications,
    getExamStats,
    getExamSchedules,
    getExamRegulations,
    showToast,
  ]);

  // Xử lý khi thay đổi học kỳ
  const changeSemester = useCallback(
    async (semesterId: string) => {
      try {
        setLoading(true);
        setSelectedSemesterId(semesterId);

        // Lấy thông báo, thống kê và lịch thi cho học kỳ mới
        const [notificationsData, statsData, schedulesData] = await Promise.all(
          [
            getExamNotifications(semesterId),
            getExamStats(semesterId),
            getExamSchedules(semesterId, selectedExamType),
          ]
        );

        setNotifications(notificationsData);
        setStats(statsData);
        setExamSchedules(schedulesData);
        setLoading(false);
      } catch (err) {
        showToast("Có lỗi xảy ra khi thay đổi học kỳ", "error");
        setLoading(false);
      }
    },
    [
      getExamNotifications,
      getExamStats,
      getExamSchedules,
      selectedExamType,
      showToast,
    ]
  );

  // Xử lý khi thay đổi loại kỳ thi
  const changeExamType = useCallback(
    async (examType: ExamType) => {
      try {
        setLoading(true);
        setSelectedExamType(examType);

        // Lấy lịch thi cho loại kỳ thi mới
        const schedulesData = await getExamSchedules(
          selectedSemesterId,
          examType
        );
        setExamSchedules(schedulesData);
        setLoading(false);
      } catch (err) {
        showToast("Có lỗi xảy ra khi thay đổi loại kỳ thi", "error");
        setLoading(false);
      }
    },
    [getExamSchedules, selectedSemesterId, showToast]
  );

  // Xử lý khi thay đổi tab
  const changeTab = useCallback((tab: ExamTabView) => {
    setActiveTab(tab);
  }, []);

  // Xử lý khi tìm kiếm
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Lọc lịch thi theo tab và tìm kiếm
  const filteredExamSchedules = useCallback(() => {
    // Lọc theo tab
    let filtered = [...examSchedules];
    if (activeTab === ExamTabView.UPCOMING) {
      filtered = filtered.filter((exam) => exam.status === "upcoming");
    } else if (activeTab === ExamTabView.COMPLETED) {
      filtered = filtered.filter((exam) => exam.status === "completed");
    }

    // Lọc theo tìm kiếm
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (exam) =>
          exam.courseName.toLowerCase().includes(query) ||
          exam.courseCode.toLowerCase().includes(query) ||
          exam.room.toLowerCase().includes(query) ||
          exam.examFormat.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [examSchedules, activeTab, searchQuery]);

  // Nhóm lịch thi theo ngày
  const groupedExamSchedules = useCallback(() => {
    const filtered = filteredExamSchedules();
    const grouped: Record<string, ExamSchedule[]> = {};

    filtered.forEach((exam) => {
      if (!grouped[exam.examDate]) {
        grouped[exam.examDate] = [];
      }
      grouped[exam.examDate].push(exam);
    });

    // Sắp xếp theo ngày
    return Object.keys(grouped)
      .sort((a, b) => {
        const dateA = new Date(a.split("/").reverse().join("-"));
        const dateB = new Date(b.split("/").reverse().join("-"));
        return dateA.getTime() - dateB.getTime();
      })
      .map((date) => ({
        date,
        exams: grouped[date].sort((a, b) => {
          // Sắp xếp theo thời gian trong ngày
          const timeA = a.startTime.split(":").map(Number);
          const timeB = b.startTime.split(":").map(Number);
          if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0];
          return timeA[1] - timeB[1];
        }),
      }));
  }, [filteredExamSchedules]);

  // Xử lý in lịch thi
  const printExamSchedule = useCallback(() => {
    window.print();
  }, []);

  // Xử lý xuất file lịch thi
  const handleExportExamSchedule = useCallback(
    async (format: "pdf" | "excel" = "pdf") => {
      try {
        showToast(
          `Đang xuất file lịch thi dạng ${format.toUpperCase()}...`,
          "info"
        );

        // Gọi API xuất file
        const { url } = await exportExamSchedule(selectedSemesterId, format);

        // Trong thực tế, đây sẽ là tải file thực sự
        // window.open(url, '_blank');

        showToast(`Xuất file lịch thi thành công`, "success");
      } catch (err) {
        showToast("Có lỗi xảy ra khi xuất file lịch thi", "error");
      }
    },
    [exportExamSchedule, selectedSemesterId, showToast]
  );

  // Xử lý đồng bộ với Google Calendar
  const handleSyncCalendar = useCallback(async () => {
    try {
      setSyncingCalendar(true);
      showToast("Đang đồng bộ lịch thi với Google Calendar...", "info");

      // Gọi API đồng bộ
      const result = await syncWithGoogleCalendar(selectedSemesterId);

      setSyncingCalendar(false);
      showToast(result.message, result.success ? "success" : "error");
    } catch (err) {
      setSyncingCalendar(false);
      showToast("Có lỗi xảy ra khi đồng bộ với Google Calendar", "error");
    }
  }, [syncWithGoogleCalendar, selectedSemesterId, showToast]);

  // Tính số ngày còn lại đến ngày thi
  const getDaysUntilExam = useCallback((examDate: string) => {
    const [day, month, year] = examDate.split("/").map(Number);
    const examDateObj = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = examDateObj.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }, []);

  // Lấy tên thứ trong tuần
  const getDayOfWeekName = useCallback((dayOfWeek: number) => {
    switch (dayOfWeek) {
      case 2:
        return "Thứ 2";
      case 3:
        return "Thứ 3";
      case 4:
        return "Thứ 4";
      case 5:
        return "Thứ 5";
      case 6:
        return "Thứ 6";
      case 7:
        return "Thứ 7";
      case 8:
        return "Chủ nhật";
      default:
        return `Ngày ${dayOfWeek}`;
    }
  }, []);

  // Tải dữ liệu khi component được mount
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return {
    // Dữ liệu
    examInfo,
    semesters,
    notifications,
    stats,
    examSchedules,
    regulations,
    filteredExamSchedules: filteredExamSchedules(),
    groupedExamSchedules: groupedExamSchedules(),

    // Trạng thái
    selectedSemesterId,
    selectedExamType,
    activeTab,
    searchQuery,
    loading,
    error,
    syncingCalendar,

    // Hàm xử lý
    changeSemester,
    changeExamType,
    changeTab,
    handleSearch,
    printExamSchedule,
    exportExamSchedule: handleExportExamSchedule,
    syncCalendar: handleSyncCalendar,
    getDaysUntilExam,
    getDayOfWeekName,
    refreshData: fetchInitialData,
  };
};

export default useExamSchedule;
