import { useState, useEffect, useCallback } from "react";
import {
  useCourseRegistrationService,
  RegistrationPeriod,
  AvailableCourse,
  RegisteredCourse,
  CourseFilter,
} from "../services/courseRegistrationService";
import { useToast } from "./useUtils";

export const useCourseRegistration = () => {
  // State cho dữ liệu
  const [registrationPeriod, setRegistrationPeriod] =
    useState<RegistrationPeriod | null>(null);
  const [availableCourses, setAvailableCourses] = useState<AvailableCourse[]>(
    []
  );
  const [registeredCourses, setRegisteredCourses] = useState<
    RegisteredCourse[]
  >([]);
  const [currentCourse, setCurrentCourse] = useState<AvailableCourse | null>(
    null
  );

  // State cho bộ lọc
  const [filter, setFilter] = useState<CourseFilter>({
    department: "",
    type: "",
    status: "",
    searchText: "",
    page: 1,
    limit: 10,
  });

  // State cho UI
  const [loading, setLoading] = useState<boolean>(true);
  const [filterLoading, setFilterLoading] = useState<boolean>(false);
  const [registrationLoading, setRegistrationLoading] =
    useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Hooks
  const {
    getCurrentRegistrationPeriod,
    getAvailableCourses,
    getRegisteredCourses,
    registerCourse,
    cancelRegistration,
    saveRegistration,
    cancelAllRegistrations,
  } = useCourseRegistrationService();
  const { showToast } = useToast();

  // Lấy dữ liệu ban đầu
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Gọi API lấy dữ liệu từ service
      const [periodData, availableData, registeredData] = await Promise.all([
        getCurrentRegistrationPeriod(),
        getAvailableCourses(),
        getRegisteredCourses(),
      ]);

      setRegistrationPeriod(periodData);
      setAvailableCourses(availableData);
      setRegisteredCourses(registeredData);

      setLoading(false);
    } catch (err) {
      setError(
        "Có lỗi xảy ra khi tải dữ liệu đăng ký học phần. Vui lòng thử lại sau."
      );
      setLoading(false);
      showToast("Có lỗi xảy ra khi tải dữ liệu đăng ký học phần", "error");
    }
  }, [
    getCurrentRegistrationPeriod,
    getAvailableCourses,
    getRegisteredCourses,
    showToast,
  ]);

  // Áp dụng bộ lọc
  const applyFilter = useCallback(
    async (newFilter: Partial<CourseFilter>) => {
      try {
        setFilterLoading(true);

        // Cập nhật state filter
        const updatedFilter = { ...filter, ...newFilter };
        setFilter(updatedFilter);

        // Gọi API với bộ lọc mới
        const filteredCourses = await getAvailableCourses(updatedFilter);
        setAvailableCourses(filteredCourses);

        setFilterLoading(false);
      } catch (err) {
        showToast("Có lỗi xảy ra khi lọc dữ liệu", "error");
        setFilterLoading(false);
      }
    },
    [filter, getAvailableCourses, showToast]
  );

  // Xử lý tìm kiếm học phần
  const searchCourses = useCallback(
    (searchText: string) => {
      applyFilter({ searchText });
    },
    [applyFilter]
  );

  // Xử lý mở modal đăng ký
  const openRegistrationModal = useCallback((course: AvailableCourse) => {
    setCurrentCourse(course);
    setIsModalOpen(true);
  }, []);

  // Xử lý đóng modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => {
      setCurrentCourse(null);
    }, 300);
  }, []);

  // Xử lý đăng ký học phần
  const handleRegisterCourse = useCallback(async () => {
    if (!currentCourse) return;

    try {
      setRegistrationLoading(true);

      // Kiểm tra xem học phần đã được đăng ký chưa
      const isAlreadyRegistered = registeredCourses.some(
        (course) => course.classId === currentCourse.classId
      );

      if (isAlreadyRegistered) {
        showToast("Học phần này đã được đăng ký!", "warning");
        setRegistrationLoading(false);
        closeModal();
        return;
      }

      // Kiểm tra số tín chỉ tối đa
      if (registrationPeriod) {
        const totalCredits = registeredCourses.reduce(
          (sum, course) => sum + course.credits,
          0
        );
        if (
          totalCredits + currentCourse.credits >
          registrationPeriod.maxCredits
        ) {
          showToast(
            `Vượt quá số tín chỉ tối đa (${registrationPeriod.maxCredits})!`,
            "warning"
          );
          setRegistrationLoading(false);
          closeModal();
          return;
        }
      }

      // Gọi API đăng ký học phần
      const result = await registerCourse(currentCourse.id);

      if (result.success) {
        // Thêm học phần vào danh sách đã đăng ký
        const newRegisteredCourse: RegisteredCourse = {
          id: currentCourse.id,
          code: currentCourse.code,
          name: currentCourse.name,
          credits: currentCourse.credits,
          classId: currentCourse.classId,
          schedule: currentCourse.schedule,
          room: currentCourse.room,
          status: "pending",
          registrationDate: new Date().toISOString(),
        };

        setRegisteredCourses((prev) => [...prev, newRegisteredCourse]);

        // Cập nhật số tín chỉ đã đăng ký
        if (registrationPeriod) {
          const newRegisteredCredits =
            registrationPeriod.registeredCredits + currentCourse.credits;
          const newRemainingCredits =
            registrationPeriod.maxCredits - newRegisteredCredits;

          setRegistrationPeriod({
            ...registrationPeriod,
            registeredCredits: newRegisteredCredits,
            remainingCredits: newRemainingCredits,
          });
        }

        showToast(
          `Đã đăng ký học phần ${currentCourse.name} thành công!`,
          "success"
        );
      } else {
        showToast(result.message || "Đăng ký học phần thất bại!", "error");
      }

      setRegistrationLoading(false);
      closeModal();
    } catch (err) {
      showToast("Có lỗi xảy ra khi đăng ký học phần", "error");
      setRegistrationLoading(false);
      closeModal();
    }
  }, [
    currentCourse,
    registeredCourses,
    registrationPeriod,
    registerCourse,
    showToast,
    closeModal,
  ]);

  // Xử lý hủy đăng ký học phần
  const handleCancelRegistration = useCallback(
    async (courseId: string) => {
      try {
        // Tìm thông tin học phần
        const course = registeredCourses.find((c) => c.id === courseId);
        if (!course) return;

        // Gọi API hủy đăng ký
        const result = await cancelRegistration(courseId);

        if (result.success) {
          // Xóa học phần khỏi danh sách đã đăng ký
          setRegisteredCourses((prev) => prev.filter((c) => c.id !== courseId));

          // Cập nhật số tín chỉ đã đăng ký
          if (registrationPeriod) {
            const newRegisteredCredits =
              registrationPeriod.registeredCredits - course.credits;
            const newRemainingCredits =
              registrationPeriod.maxCredits - newRegisteredCredits;

            setRegistrationPeriod({
              ...registrationPeriod,
              registeredCredits: newRegisteredCredits,
              remainingCredits: newRemainingCredits,
            });
          }

          showToast(`Đã hủy đăng ký học phần ${course.name}`, "info");
        } else {
          showToast(
            result.message || "Hủy đăng ký học phần thất bại!",
            "error"
          );
        }
      } catch (err) {
        showToast("Có lỗi xảy ra khi hủy đăng ký học phần", "error");
      }
    },
    [registeredCourses, registrationPeriod, cancelRegistration, showToast]
  );

  // Xử lý hủy tất cả đăng ký
  const handleCancelAllRegistrations = useCallback(async () => {
    if (registeredCourses.length === 0) {
      showToast("Chưa có học phần nào được đăng ký!", "warning");
      return;
    }

    try {
      // Gọi API hủy tất cả đăng ký
      const result = await cancelAllRegistrations();

      if (result.success) {
        // Xóa tất cả học phần khỏi danh sách đã đăng ký
        setRegisteredCourses([]);

        // Cập nhật số tín chỉ đã đăng ký
        if (registrationPeriod) {
          setRegistrationPeriod({
            ...registrationPeriod,
            registeredCredits: 0,
            remainingCredits: registrationPeriod.maxCredits,
          });
        }

        showToast("Đã hủy tất cả học phần đăng ký", "info");
      } else {
        showToast(
          result.message || "Hủy tất cả đăng ký học phần thất bại!",
          "error"
        );
      }
    } catch (err) {
      showToast("Có lỗi xảy ra khi hủy tất cả đăng ký học phần", "error");
    }
  }, [
    registeredCourses,
    registrationPeriod,
    cancelAllRegistrations,
    showToast,
  ]);

  // Xử lý lưu đăng ký
  const handleSaveRegistration = useCallback(async () => {
    if (registeredCourses.length === 0) {
      showToast("Chưa có học phần nào được đăng ký!", "warning");
      return;
    }

    try {
      setSaveLoading(true);

      // Gọi API lưu đăng ký
      const result = await saveRegistration();

      if (result.success) {
        // Cập nhật trạng thái các học phần đã đăng ký
        setRegisteredCourses((prev) =>
          prev.map((course) => ({
            ...course,
            status: "confirmed",
          }))
        );

        showToast("Đã lưu đăng ký học phần thành công!", "success");
      } else {
        showToast(result.message || "Lưu đăng ký học phần thất bại!", "error");
      }

      setSaveLoading(false);
    } catch (err) {
      showToast("Có lỗi xảy ra khi lưu đăng ký học phần", "error");
      setSaveLoading(false);
    }
  }, [registeredCourses, saveRegistration, showToast]);

  // Tính thời gian còn lại
  const calculateRemainingTime = useCallback(() => {
    if (!registrationPeriod) return "";

    const endDate = new Date(registrationPeriod.endDate);
    const currentDate = new Date();

    if (currentDate > endDate) return "0 ngày 00 giờ 00 phút";

    const remainingTime = endDate.getTime() - currentDate.getTime();
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
    );

    return `${days} ngày ${hours.toString().padStart(2, "0")} giờ ${minutes
      .toString()
      .padStart(2, "0")} phút`;
  }, [registrationPeriod]);

  // Tải dữ liệu khi component được mount
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Cập nhật đồng hồ đếm ngược mỗi phút
  useEffect(() => {
    const interval = setInterval(() => {
      if (registrationPeriod && registrationPeriod.status === "active") {
        // Cập nhật thời gian còn lại
        const remainingTime = calculateRemainingTime();

        // Cập nhật UI (không cần cập nhật state vì hàm calculateRemainingTime đã tính toán dựa trên state hiện tại)
        const countdownElement = document.querySelector(".countdown");
        if (countdownElement) {
          countdownElement.textContent = remainingTime;
        }
      }
    }, 60000); // Cập nhật mỗi phút

    return () => clearInterval(interval);
  }, [registrationPeriod, calculateRemainingTime]);

  return {
    // Dữ liệu
    registrationPeriod,
    availableCourses,
    registeredCourses,
    currentCourse,

    // Trạng thái
    filter,
    loading,
    filterLoading,
    registrationLoading,
    saveLoading,
    error,
    isModalOpen,

    // Hàm xử lý
    applyFilter,
    searchCourses,
    openRegistrationModal,
    closeModal,
    registerCourse: handleRegisterCourse,
    cancelRegistration: handleCancelRegistration,
    cancelAllRegistrations: handleCancelAllRegistrations,
    saveRegistration: handleSaveRegistration,
    calculateRemainingTime,
    refreshData: fetchInitialData,
  };
};

export default useCourseRegistration;
