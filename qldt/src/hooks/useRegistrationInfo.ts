import { useState, useEffect, useCallback } from "react";
import {
  useRegistrationInfoService,
  SemesterInfo,
  AcademicProgress,
  RegistrationPhase,
  RegistrationRule,
  RegistrationNotification,
  RegistrationGuide,
  RegistrationFAQ,
} from "../services/registrationInfoService";
import { useToast } from "./useUtils";
import { formatDate as formatDateUtil } from "../utils/formatters";

export const useRegistrationInfo = () => {
  // State cho dữ liệu
  const [currentSemester, setCurrentSemester] = useState<SemesterInfo | null>(
    null
  );
  const [upcomingSemester, setUpcomingSemester] = useState<SemesterInfo | null>(
    null
  );
  const [academicProgress, setAcademicProgress] =
    useState<AcademicProgress | null>(null);
  const [registrationSchedule, setRegistrationSchedule] = useState<
    RegistrationPhase[]
  >([]);
  const [registrationRules, setRegistrationRules] = useState<
    RegistrationRule[]
  >([]);
  const [notifications, setNotifications] = useState<
    RegistrationNotification[]
  >([]);
  const [registrationGuide, setRegistrationGuide] = useState<
    RegistrationGuide[]
  >([]);
  const [faqs, setFaqs] = useState<RegistrationFAQ[]>([]);

  // State cho UI
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("info");
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>("all");

  // Hooks
  const {
    getSemesterInfo,
    getAcademicProgress,
    getRegistrationSchedule,
    getRegistrationRules,
    getRegistrationNotifications,
    getRegistrationGuide,
    getRegistrationFAQs,
  } = useRegistrationInfoService();
  const { showToast } = useToast();

  // Lấy dữ liệu ban đầu
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Gọi API lấy thông tin học kỳ
      const semesterData = await getSemesterInfo();
      setCurrentSemester(semesterData.currentSemester);
      setUpcomingSemester(semesterData.upcomingSemester);

      // Gọi API lấy thông tin tiến độ học tập
      const progressData = await getAcademicProgress();
      setAcademicProgress(progressData);

      // Gọi API lấy lịch trình đăng ký học phần
      const scheduleData = await getRegistrationSchedule(
        semesterData.upcomingSemester.id
      );
      setRegistrationSchedule(scheduleData);

      // Gọi API lấy quy định đăng ký học phần
      const rulesData = await getRegistrationRules();
      setRegistrationRules(rulesData);

      // Gọi API lấy thông báo đăng ký học phần
      const notificationsData = await getRegistrationNotifications();
      setNotifications(notificationsData);

      // Gọi API lấy hướng dẫn đăng ký học phần
      const guideData = await getRegistrationGuide();
      setRegistrationGuide(guideData);

      // Gọi API lấy câu hỏi thường gặp
      const faqsData = await getRegistrationFAQs();
      setFaqs(faqsData);

      setLoading(false);
    } catch (err) {
      setError("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.");
      setLoading(false);
      showToast("Có lỗi xảy ra khi tải dữ liệu", "error");
    }
  }, [
    getSemesterInfo,
    getAcademicProgress,
    getRegistrationSchedule,
    getRegistrationRules,
    getRegistrationNotifications,
    getRegistrationGuide,
    getRegistrationFAQs,
    showToast,
  ]);

  // Xử lý chuyển tab
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  // Xử lý lọc FAQ theo danh mục
  const handleFaqCategoryChange = useCallback((category: string) => {
    setActiveFaqCategory(category);
  }, []);

  // Lọc FAQ theo danh mục
  const filteredFaqs = useCallback(() => {
    if (activeFaqCategory === "all") {
      return faqs;
    }
    return faqs.filter((faq) => faq.category === activeFaqCategory);
  }, [faqs, activeFaqCategory]);

  // Tải dữ liệu khi component được mount
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Định dạng ngày tháng (sử dụng hàm từ utils)
  const formatDate = useCallback((dateString: string): string => {
    return formatDateUtil(dateString);
  }, []);

  // Định dạng học kỳ
  const formatSemester = useCallback((semester: SemesterInfo): string => {
    return `${semester.semesterNumber}, năm học ${semester.academicYear}`;
  }, []);

  // Xác định trạng thái học kỳ
  const getSemesterStatusText = useCallback((status: string): string => {
    switch (status) {
      case "active":
        return "Đang diễn ra";
      case "upcoming":
        return "Sắp diễn ra";
      case "completed":
        return "Đã kết thúc";
      default:
        return "";
    }
  }, []);

  // Xác định màu trạng thái học kỳ
  const getSemesterStatusColor = useCallback((status: string): string => {
    switch (status) {
      case "active":
        return "#4caf50";
      case "upcoming":
        return "#ff9800";
      case "completed":
        return "#9e9e9e";
      default:
        return "";
    }
  }, []);

  return {
    // Dữ liệu
    currentSemester,
    upcomingSemester,
    academicProgress,
    registrationSchedule,
    registrationRules,
    notifications,
    registrationGuide,
    faqs,

    // Trạng thái
    loading,
    error,
    activeTab,
    activeFaqCategory,

    // Hàm xử lý
    handleTabChange,
    handleFaqCategoryChange,
    filteredFaqs,
    refreshData: fetchInitialData,

    // Hàm tiện ích
    formatDate,
    formatSemester,
    getSemesterStatusText,
    getSemesterStatusColor,
  };
};

export default useRegistrationInfo;
