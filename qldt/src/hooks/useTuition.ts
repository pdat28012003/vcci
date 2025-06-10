import { useState, useEffect, useCallback } from 'react';
import useTuitionService, { 
  TuitionSummary, 
  TuitionItem, 
  CourseItem, 
  PaymentHistory 
} from '../services/tuitionService';
import { useToast } from './useUtils';

export const useTuition = () => {
  // State cho dữ liệu
  const [tuitionSummary, setTuitionSummary] = useState<TuitionSummary | null>(null);
  const [tuitionItems, setTuitionItems] = useState<TuitionItem[]>([]);
  const [currentTuition, setCurrentTuition] = useState<TuitionItem | null>(null);
  const [courseItems, setCourseItems] = useState<CourseItem[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  
  // State cho UI
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  
  // Hooks
  const { 
    getTuitionSummary, 
    getTuitionItems, 
    getTuitionDetail, 
    getPaymentHistory,
    payTuition,
    downloadReceipt
  } = useTuitionService();
  const { showToast } = useToast();

  // Lấy dữ liệu ban đầu
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Gọi API lấy dữ liệu từ service
      const [summaryData, tuitionData] = await Promise.all([
        getTuitionSummary(),
        getTuitionItems()
      ]);
      
      setTuitionSummary(summaryData);
      setTuitionItems(tuitionData);
      
      // Mặc định chọn học kỳ mới nhất
      if (tuitionData.length > 0) {
        const latestSemester = tuitionData[0].semesterCode;
        setSelectedSemester(latestSemester);
        await fetchTuitionDetail(latestSemester);
      }
      
      setLoading(false);
    } catch (err) {
      setError('Có lỗi xảy ra khi tải dữ liệu học phí. Vui lòng thử lại sau.');
      setLoading(false);
      showToast('Có lỗi xảy ra khi tải dữ liệu học phí', 'error');
    }
  }, [getTuitionSummary, getTuitionItems, showToast]);

  // Lấy chi tiết học phí theo học kỳ
  const fetchTuitionDetail = useCallback(async (semesterCode: string) => {
    try {
      setDetailLoading(true);
      
      // Gọi API lấy chi tiết học phí và lịch sử thanh toán
      const [detailData, historyData] = await Promise.all([
        getTuitionDetail(semesterCode),
        getPaymentHistory(semesterCode)
      ]);
      
      setCurrentTuition(detailData.tuitionItem);
      setCourseItems(detailData.courses);
      setPaymentHistory(historyData);
      
      setDetailLoading(false);
    } catch (err) {
      showToast('Có lỗi xảy ra khi tải chi tiết học phí', 'error');
      setDetailLoading(false);
    }
  }, [getTuitionDetail, getPaymentHistory, showToast]);

  // Xử lý khi thay đổi học kỳ
  const handleSemesterChange = useCallback(async (semesterCode: string) => {
    setSelectedSemester(semesterCode);
    await fetchTuitionDetail(semesterCode);
  }, [fetchTuitionDetail]);

  // Hiển thị modal thanh toán
  const handleShowPaymentModal = useCallback(() => {
    setShowPaymentModal(true);
  }, []);

  // Ẩn modal thanh toán
  const handleHidePaymentModal = useCallback(() => {
    setShowPaymentModal(false);
  }, []);

  // Xử lý thanh toán học phí
  const handlePayTuition = useCallback(async (method: string) => {
    if (!currentTuition) return;
    
    try {
      // Tính số tiền cần thanh toán
      const amountToPay = currentTuition.amount - currentTuition.paid;
      
      if (amountToPay <= 0) {
        showToast('Học phí đã được thanh toán đầy đủ', 'info');
        return;
      }
      
      // Gọi API thanh toán học phí
      await payTuition(currentTuition.id, amountToPay, method);
      
      // Cập nhật lại dữ liệu
      await Promise.all([
        fetchInitialData(),
        fetchTuitionDetail(selectedSemester)
      ]);
      
      showToast('Thanh toán học phí thành công', 'success');
      handleHidePaymentModal();
    } catch (err) {
      showToast('Có lỗi xảy ra khi thanh toán học phí', 'error');
    }
  }, [currentTuition, payTuition, fetchInitialData, fetchTuitionDetail, selectedSemester, showToast, handleHidePaymentModal]);

  // Xử lý tải biên lai
  const handleDownloadReceipt = useCallback(async (paymentId: string) => {
    try {
      showToast('Đang tải biên lai...', 'info');
      
      // Gọi API tải biên lai
      const { url } = await downloadReceipt(paymentId);
      
      // Trong thực tế, đây sẽ là tải file thực sự
      // window.open(url, '_blank');
      
      showToast('Tải biên lai thành công', 'success');
    } catch (err) {
      showToast('Có lỗi xảy ra khi tải biên lai', 'error');
    }
  }, [downloadReceipt, showToast]);

  // Xử lý tải tất cả biên lai
  const handleDownloadAllReceipts = useCallback(async () => {
    try {
      showToast('Đang tải tất cả biên lai...', 'info');
      
      // Trong thực tế, đây sẽ là API call để tải tất cả biên lai
      // Giả lập độ trễ
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showToast('Tải tất cả biên lai thành công', 'success');
    } catch (err) {
      showToast('Có lỗi xảy ra khi tải biên lai', 'error');
    }
  }, [showToast]);

  // Xem chi tiết giao dịch
  const handleViewPaymentDetail = useCallback((transactionId: string) => {
    showToast(`Đang tải thông tin chi tiết giao dịch ${transactionId}`, 'info');
    
    // Trong thực tế, đây sẽ là API call để lấy chi tiết giao dịch
    // Giả lập độ trễ
    setTimeout(() => {
      showToast('Đã tải thông tin chi tiết giao dịch', 'success');
    }, 1000);
  }, [showToast]);

  // Tải dữ liệu khi component được mount
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return {
    // Dữ liệu
    tuitionSummary,
    tuitionItems,
    currentTuition,
    courseItems,
    paymentHistory,
    
    // Trạng thái
    selectedSemester,
    loading,
    detailLoading,
    error,
    showPaymentModal,
    
    // Hàm xử lý
    handleSemesterChange,
    handleShowPaymentModal,
    handleHidePaymentModal,
    handlePayTuition,
    handleDownloadReceipt,
    handleDownloadAllReceipts,
    handleViewPaymentDetail,
    refreshData: fetchInitialData
  };
};

export default useTuition;