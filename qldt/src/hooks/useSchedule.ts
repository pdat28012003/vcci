import { useState, useEffect, useCallback } from "react";
import {
  useScheduleService,
  ScheduleInfo,
  SemesterInfo,
  WeekInfo,
  ClassSchedule,
  PeriodTime,
} from "../services/scheduleService";
import { useToast } from "./useUtils";

// Enum cho chế độ xem
export enum ScheduleViewMode {
  WEEK = "week",
  LIST = "list",
}

// Hook để quản lý thời khóa biểu
export const useSchedule = () => {
  // State cho dữ liệu
  const [scheduleInfo, setScheduleInfo] = useState<ScheduleInfo | null>(null);
  const [semesters, setSemesters] = useState<SemesterInfo[]>([]);
  const [weeks, setWeeks] = useState<WeekInfo[]>([]);
  const [weekSchedule, setWeekSchedule] = useState<ClassSchedule[]>([]);
  const [periodTimes, setPeriodTimes] = useState<PeriodTime[]>([]);

  // State cho bộ lọc và hiển thị
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>("");
  const [selectedWeekId, setSelectedWeekId] = useState<string>("current");
  const [viewMode, setViewMode] = useState<ScheduleViewMode>(ScheduleViewMode.WEEK);

  // State cho UI
  const [loading, setLoading] = useState<boolean>(true);
  const [scheduleLoading, setScheduleLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [syncingCalendar, setSyncingCalendar] = useState<boolean>(false);

  // Hooks
  const {
    getScheduleInfo,
    getSemesters,
    getWeeks,
    getWeekSchedule,
    getPeriodTimes,
    exportSchedule,
    syncWithGoogleCalendar,
  } = useScheduleService();
  const { showToast } = useToast();

  // Lấy dữ liệu ban đầu
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Gọi API lấy dữ liệu từ service
      const [infoData, semestersData, periodTimesData] = await Promise.all([
        getScheduleInfo(),
        getSemesters(),
        getPeriodTimes(),
      ]);

      setScheduleInfo(infoData);
      setSemesters(semestersData);
      setPeriodTimes(periodTimesData);

      // Tìm học kỳ hiện tại
      const currentSemester = semestersData.find((sem) => sem.isCurrent);
      if (currentSemester) {
        setSelectedSemesterId(currentSemester.id);
        
        // Lấy danh sách tuần học
        const weeksData = await getWeeks(currentSemester.id);
        setWeeks(weeksData);
        
        // Tìm tuần hiện tại
        const currentWeek = weeksData.find((week) => week.isCurrent);
        if (currentWeek) {
          setSelectedWeekId(currentWeek.id);
          
          // Lấy thời khóa biểu cho tuần hiện tại
          const scheduleData = await getWeekSchedule(
            currentSemester.id,
            currentWeek.id
          );
          setWeekSchedule(scheduleData);
        }
      }

      setLoading(false);
    } catch (err) {
      setError(
        "Có lỗi xảy ra khi tải dữ liệu thời khóa biểu. Vui lòng thử lại sau."
      );
      setLoading(false);
      showToast(
        "Có lỗi xảy ra khi tải dữ liệu thời khóa biểu",
        "error"
      );
    }
  }, [
    getScheduleInfo,
    getSemesters,
    getWeeks,
    getWeekSchedule,
    getPeriodTimes,
    showToast,
  ]);

  // Lấy thời khóa biểu cho tuần cụ thể
  const fetchWeekSchedule = useCallback(
    async (semesterId: string, weekId: string) => {
      try {
        setScheduleLoading(true);

        // Gọi API lấy thời khóa biểu
        const scheduleData = await getWeekSchedule(semesterId, weekId);
        setWeekSchedule(scheduleData);

        setScheduleLoading(false);
      } catch (err) {
        showToast("Có lỗi xảy ra khi tải thời khóa biểu", "error");
        setScheduleLoading(false);
      }
    },
    [getWeekSchedule, showToast]
  );

  // Xử lý khi thay đổi học kỳ
  const changeSemester = useCallback(
    async (semesterId: string) => {
      try {
        setSelectedSemesterId(semesterId);
        
        // Lấy danh sách tuần học cho học kỳ mới
        const weeksData = await getWeeks(semesterId);
        setWeeks(weeksData);
        
        // Mặc định chọn tuần hiện tại hoặc tuần đầu tiên
        const currentWeek = weeksData.find((week) => week.isCurrent) || weeksData[0];
        if (currentWeek) {
          setSelectedWeekId(currentWeek.id);
          
          // Lấy thời khóa biểu cho tuần đã chọn
          await fetchWeekSchedule(semesterId, currentWeek.id);
        }
      } catch (err) {
        showToast("Có lỗi xảy ra khi thay đổi học kỳ", "error");
      }
    },
    [getWeeks, fetchWeekSchedule, showToast]
  );

  // Xử lý khi thay đổi tuần
  const changeWeek = useCallback(
    async (weekId: string) => {
      setSelectedWeekId(weekId);
      if (selectedSemesterId) {
        await fetchWeekSchedule(selectedSemesterId, weekId);
      }
    },
    [fetchWeekSchedule, selectedSemesterId]
  );

  // Xử lý khi điều hướng tuần (trước/sau)
  const navigateWeek = useCallback(
    async (direction: "prev" | "next") => {
      const currentIndex = weeks.findIndex((week) => week.id === selectedWeekId);
      if (currentIndex === -1) return;

      let newIndex;
      if (direction === "prev") {
        newIndex = Math.max(0, currentIndex - 1);
      } else {
        newIndex = Math.min(weeks.length - 1, currentIndex + 1);
      }

      const newWeekId = weeks[newIndex].id;
      await changeWeek(newWeekId);
    },
    [weeks, selectedWeekId, changeWeek]
  );

  // Xử lý khi thay đổi chế độ xem
  const changeViewMode = useCallback((mode: ScheduleViewMode) => {
    setViewMode(mode);
  }, []);

  // Xử lý in thời khóa biểu
  const printSchedule = useCallback(() => {
    window.print();
  }, []);

  // Xử lý xuất file thời khóa biểu
  const handleExportSchedule = useCallback(
    async (format: "pdf" | "excel" = "pdf") => {
      try {
        showToast(
          `Đang xuất file thời khóa biểu dạng ${format.toUpperCase()}...`,
          "info"
        );

        // Gọi API xuất file
        const { url } = await exportSchedule(selectedSemesterId, selectedWeekId, format);

        // Trong thực tế, đây sẽ là tải file thực sự
        // window.open(url, '_blank');

        showToast(`Xuất file thời khóa biểu thành công`, "success");
      } catch (err) {
        showToast("Có lỗi xảy ra khi xuất file thời khóa biểu", "error");
      }
    },
    [exportSchedule, selectedSemesterId, selectedWeekId, showToast]
  );

  // Xử lý đồng bộ với Google Calendar
  const handleSyncCalendar = useCallback(async () => {
    try {
      setSyncingCalendar(true);
      showToast("Đang đồng bộ thời khóa biểu với Google Calendar...", "info");

      // Gọi API đồng bộ
      const result = await syncWithGoogleCalendar(selectedSemesterId);

      setSyncingCalendar(false);
      showToast(result.message, result.success ? "success" : "error");
    } catch (err) {
      setSyncingCalendar(false);
      showToast(
        "Có lỗi xảy ra khi đồng bộ với Google Calendar",
        "error"
      );
    }
  }, [syncWithGoogleCalendar, selectedSemesterId, showToast]);

  // Lấy thông tin tuần hiện tại
  const getCurrentWeekInfo = useCallback(() => {
    const currentWeek = weeks.find((week) => week.id === selectedWeekId);
    if (!currentWeek) return null;

    // Lấy số tuần từ id (nếu có định dạng "week-X")
    let weekNumber = "";
    if (currentWeek.id.startsWith("week-")) {
      weekNumber = currentWeek.id.replace("week-", "");
    }

    return {
      label: weekNumber ? `Tuần ${weekNumber}` : currentWeek.name,
      dateRange: `${formatDate(currentWeek.startDate)} - ${formatDate(currentWeek.endDate)}`,
    };
  }, [weeks, selectedWeekId]);

  // Hàm hỗ trợ định dạng ngày
  const formatDate = (dateString: string) => {
    const parts = dateString.split("-");
    return `${parts[2]}/${parts[1]}`;
  };

  // Tải dữ liệu khi component được mount
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return {
    // Dữ liệu
    scheduleInfo,
    semesters,
    weeks,
    weekSchedule,
    periodTimes,

    // Trạng thái
    selectedSemesterId,
    selectedWeekId,
    viewMode,
    loading,
    scheduleLoading,
    error,
    syncingCalendar,

    // Hàm xử lý
    changeSemester,
    changeWeek,
    navigateWeek,
    changeViewMode,
    printSchedule,
    exportSchedule: handleExportSchedule,
    syncCalendar: handleSyncCalendar,
    getCurrentWeekInfo,
    refreshData: fetchInitialData,
  };
};

export default useSchedule;