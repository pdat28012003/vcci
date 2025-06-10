import { useState, useEffect, useCallback } from "react";
import courseWithdrawalService, {
  RegisteredCourse,
  WithdrawalHistory,
  WithdrawalPeriod,
  WithdrawalReason,
  WithdrawalRequest,
} from "../services/courseWithdrawalService";

// Hook cho trang rút học phần
const useCourseWithdrawal = () => {
  // State cho dữ liệu
  const [withdrawalPeriod, setWithdrawalPeriod] =
    useState<WithdrawalPeriod | null>(null);
  const [registeredCourses, setRegisteredCourses] = useState<
    RegisteredCourse[]
  >([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState<
    WithdrawalHistory[]
  >([]);
  const [withdrawalReasons, setWithdrawalReasons] = useState<
    WithdrawalReason[]
  >([]);

  // State cho modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<RegisteredCourse | null>(
    null
  );
  const [withdrawalReason, setWithdrawalReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  // State cho loading và error
  const [loading, setLoading] = useState({
    period: false,
    courses: false,
    history: false,
    reasons: false,
    withdraw: false,
  });
  const [error, setError] = useState({
    period: null,
    courses: null,
    history: null,
    reasons: null,
    withdraw: null,
  });

  // State cho kết quả rút học phần
  const [withdrawalResult, setWithdrawalResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchWithdrawalPeriod();
    fetchRegisteredCourses();
    fetchWithdrawalHistory();
    fetchWithdrawalReasons();
  }, []);

  // Lấy thông tin kỳ rút học phần
  const fetchWithdrawalPeriod = async () => {
    setLoading((prev) => ({ ...prev, period: true }));
    setError((prev) => ({ ...prev, period: null }));

    try {
      const data = await courseWithdrawalService.getWithdrawalPeriod();
      setWithdrawalPeriod(data);
    } catch (err) {
      setError((prev) => ({ ...prev, period: err }));
    } finally {
      setLoading((prev) => ({ ...prev, period: false }));
    }
  };

  // Lấy danh sách học phần đã đăng ký
  const fetchRegisteredCourses = async () => {
    setLoading((prev) => ({ ...prev, courses: true }));
    setError((prev) => ({ ...prev, courses: null }));

    try {
      const data = await courseWithdrawalService.getRegisteredCourses();
      setRegisteredCourses(data);
    } catch (err) {
      setError((prev) => ({ ...prev, courses: err }));
    } finally {
      setLoading((prev) => ({ ...prev, courses: false }));
    }
  };

  // Lấy lịch sử rút học phần
  const fetchWithdrawalHistory = async () => {
    setLoading((prev) => ({ ...prev, history: true }));
    setError((prev) => ({ ...prev, history: null }));

    try {
      const data = await courseWithdrawalService.getWithdrawalHistory();
      setWithdrawalHistory(data);
    } catch (err) {
      setError((prev) => ({ ...prev, history: err }));
    } finally {
      setLoading((prev) => ({ ...prev, history: false }));
    }
  };

  // Lấy danh sách lý do rút học phần
  const fetchWithdrawalReasons = async () => {
    setLoading((prev) => ({ ...prev, reasons: true }));
    setError((prev) => ({ ...prev, reasons: null }));

    try {
      const data = await courseWithdrawalService.getWithdrawalReasons();
      setWithdrawalReasons(data);
    } catch (err) {
      setError((prev) => ({ ...prev, reasons: err }));
    } finally {
      setLoading((prev) => ({ ...prev, reasons: false }));
    }
  };

  // Mở modal xác nhận rút học phần
  const openWithdrawModal = useCallback((course: RegisteredCourse) => {
    setSelectedCourse(course);
    setWithdrawalReason("");
    setOtherReason("");
    setIsModalOpen(true);
  }, []);

  // Đóng modal xác nhận
  const closeWithdrawModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Đóng modal kết quả
  const closeResultModal = useCallback(() => {
    setIsResultModalOpen(false);
    // Reload dữ liệu sau khi đóng modal kết quả
    fetchRegisteredCourses();
    fetchWithdrawalHistory();
  }, []);

  // Xử lý thay đổi lý do rút học phần
  const handleReasonChange = useCallback((reason: string) => {
    setWithdrawalReason(reason);
    if (reason !== "other") {
      setOtherReason("");
    }
  }, []);

  // Xử lý thay đổi lý do khác
  const handleOtherReasonChange = useCallback((reason: string) => {
    setOtherReason(reason);
  }, []);

  // Gửi yêu cầu rút học phần
  const withdrawCourse = async () => {
    if (!selectedCourse) return;

    // Kiểm tra lý do
    if (!withdrawalReason) {
      alert("Vui lòng chọn lý do rút học phần!");
      return;
    }

    // Kiểm tra lý do khác
    if (withdrawalReason === "other" && !otherReason.trim()) {
      alert("Vui lòng nhập lý do rút học phần!");
      return;
    }

    setLoading((prev) => ({ ...prev, withdraw: true }));
    setError((prev) => ({ ...prev, withdraw: null }));

    try {
      const request: WithdrawalRequest = {
        courseCode: selectedCourse.courseCode,
        courseGroup: selectedCourse.group,
        reason: withdrawalReason,
        otherReason: withdrawalReason === "other" ? otherReason : undefined,
      };

      const result = await courseWithdrawalService.withdrawCourse(request);
      setWithdrawalResult(result);

      // Đóng modal xác nhận và mở modal kết quả
      setIsModalOpen(false);
      setIsResultModalOpen(true);
    } catch (err) {
      setError((prev) => ({ ...prev, withdraw: err }));
      alert("Có lỗi xảy ra khi rút học phần. Vui lòng thử lại sau!");
    } finally {
      setLoading((prev) => ({ ...prev, withdraw: false }));
    }
  };

  return {
    // Dữ liệu
    withdrawalPeriod,
    registeredCourses,
    withdrawalHistory,
    withdrawalReasons,
    selectedCourse,
    withdrawalReason,
    otherReason,
    withdrawalResult,

    // State modal
    isModalOpen,
    isResultModalOpen,

    // Loading và error
    loading,
    error,

    // Các hàm xử lý
    openWithdrawModal,
    closeWithdrawModal,
    closeResultModal,
    handleReasonChange,
    handleOtherReasonChange,
    withdrawCourse,

    // Các hàm fetch dữ liệu
    fetchWithdrawalPeriod,
    fetchRegisteredCourses,
    fetchWithdrawalHistory,
  };
};

export default useCourseWithdrawal;
