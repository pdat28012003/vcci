import { useState, useEffect, useCallback } from 'react';
import useOtherFeesService, { 
  OtherFeesSummary, 
  OtherFeeItem, 
  PaymentHistory 
} from '../services/otherFeesService';
import { useToast } from './useUtils';

export const useOtherFees = () => {
  // State cho dữ liệu
  const [feesSummary, setFeesSummary] = useState<OtherFeesSummary | null>(null);
  const [feeItems, setFeeItems] = useState<OtherFeeItem[]>([]);
  const [currentFee, setCurrentFee] = useState<OtherFeeItem | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  
  // State cho UI
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [filteredFeeItems, setFilteredFeeItems] = useState<OtherFeeItem[]>([]);
  
  // Hooks
  const { 
    getOtherFeesSummary, 
    getOtherFeeItems, 
    getOtherFeeDetail, 
    getPaymentHistory,
    payOtherFee,
    downloadReceipt
  } = useOtherFeesService();
  const { showToast } = useToast();

  // Lấy dữ liệu ban đầu
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Gọi API lấy dữ liệu từ service
      const [summaryData, feesData] = await Promise.all([
        getOtherFeesSummary(),
        getOtherFeeItems()
      ]);
      
      setFeesSummary(summaryData);
      setFeeItems(feesData);
      setFilteredFeeItems(feesData);
      
      setLoading(false);
    } catch (err) {
      setError('Có lỗi xảy ra khi tải dữ liệu các khoản thu khác. Vui lòng thử lại sau.');
      setLoading(false);
      showToast('Có lỗi xảy ra khi tải dữ liệu các khoản thu khác', 'error');
    }
  }, [getOtherFeesSummary, getOtherFeeItems, showToast]);

  // Lấy chi tiết khoản thu
  const fetchFeeDetail = useCallback(async (feeId: string) => {
    try {
      setDetailLoading(true);
      
      // Gọi API lấy chi tiết khoản thu và lịch sử thanh toán
      const [detailData, historyData] = await Promise.all([
        getOtherFeeDetail(feeId),
        getPaymentHistory(feeId)
      ]);
      
      setCurrentFee(detailData);
      setPaymentHistory(historyData);
      
      setDetailLoading(false);
    } catch (err) {
      showToast('Có lỗi xảy ra khi tải chi tiết khoản thu', 'error');
      setDetailLoading(false);
    }
  }, [getOtherFeeDetail, getPaymentHistory, showToast]);

  // Lọc dữ liệu theo học kỳ và trạng thái
  const filterFeeData = useCallback(() => {
    let filtered = [...feeItems];
    
    // Lọc theo học kỳ
    if (selectedSemester !== 'all') {
      filtered = filtered.filter(item => item.semesterCode === selectedSemester);
    }
    
    // Lọc theo trạng thái
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }
    
    setFilteredFeeItems(filtered);
  }, [feeItems, selectedSemester, selectedStatus]);

  // Xử lý khi thay đổi học kỳ
  const handleSemesterChange = useCallback((semesterCode: string) => {
    setSelectedSemester(semesterCode);
  }, []);

  // Xử lý khi thay đổi trạng thái
  const handleStatusChange = useCallback((status: string) => {
    setSelectedStatus(status);
  }, []);

  // Hiển thị modal thanh toán
  const handleShowPaymentModal = useCallback((feeId: string) => {
    fetchFeeDetail(feeId).then(() => {
      setShowPaymentModal(true);
    });
  }, [fetchFeeDetail]);

  // Ẩn modal thanh toán
  const handleHidePaymentModal = useCallback(() => {
    setShowPaymentModal(false);
  }, []);

  // Xử lý thanh toán khoản thu
  const handlePayFee = useCallback(async (method: string) => {
    if (!currentFee) return;
    
    try {
      // Tính số tiền cần thanh toán
      const amountToPay = currentFee.amount - currentFee.paid;
      
      if (amountToPay <= 0) {
        showToast('Khoản thu này đã được thanh toán đầy đủ', 'info');
        return;
      }
      
      // Gọi API thanh toán khoản thu
      await payOtherFee(currentFee.id, amountToPay, method);
      
      // Cập nhật lại dữ liệu
      await fetchInitialData();
      
      showToast('Thanh toán khoản thu thành công', 'success');
      handleHidePaymentModal();
    } catch (err) {
      showToast('Có lỗi xảy ra khi thanh toán khoản thu', 'error');
    }
  }, [currentFee, payOtherFee, fetchInitialData, showToast, handleHidePaymentModal]);

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

  // Xem chi tiết khoản thu
  const handleViewFeeDetail = useCallback((feeId: string) => {
    fetchFeeDetail(feeId);
    // Trong thực tế, có thể mở modal hoặc chuyển đến trang chi tiết
    showToast(`Đang tải thông tin chi tiết khoản thu ${feeId}`, 'info');
  }, [fetchFeeDetail, showToast]);

  // Xử lý in dữ liệu
  const handlePrintFeeData = useCallback(() => {
    showToast('Đang chuẩn bị in dữ liệu...', 'info');
    
    // Trong thực tế, đây sẽ là chức năng in thực sự
    setTimeout(() => {
      showToast('Đã gửi lệnh in đến máy in', 'success');
    }, 1000);
  }, [showToast]);

  // Xử lý xuất file
  const handleExportFeeData = useCallback(() => {
    showToast('Đang xuất dữ liệu...', 'info');
    
    // Trong thực tế, đây sẽ là chức năng xuất file thực sự
    setTimeout(() => {
      showToast('Đã xuất dữ liệu thành công', 'success');
    }, 1000);
  }, [showToast]);

  // Cập nhật dữ liệu đã lọc khi thay đổi bộ lọc
  useEffect(() => {
    filterFeeData();
  }, [filterFeeData, selectedSemester, selectedStatus]);

  // Tải dữ liệu khi component được mount
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return {
    // Dữ liệu
    feesSummary,
    feeItems,
    filteredFeeItems,
    currentFee,
    paymentHistory,
    
    // Trạng thái
    selectedSemester,
    selectedStatus,
    loading,
    detailLoading,
    error,
    showPaymentModal,
    
    // Hàm xử lý
    handleSemesterChange,
    handleStatusChange,
    handleShowPaymentModal,
    handleHidePaymentModal,
    handlePayFee,
    handleDownloadReceipt,
    handleViewFeeDetail,
    handlePrintFeeData,
    handleExportFeeData,
    refreshData: fetchInitialData
  };
};

export default useOtherFees;