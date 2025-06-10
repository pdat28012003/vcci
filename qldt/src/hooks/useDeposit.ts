import { useState, useEffect, useCallback, useRef } from 'react';
import useDepositService, { 
  AccountInfo, 
  DepositTransaction 
} from '../services/depositService';
import { useToast } from './useUtils';

export const useDeposit = () => {
  // State cho dữ liệu
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [depositHistory, setDepositHistory] = useState<DepositTransaction[]>([]);
  const [currentTransaction, setCurrentTransaction] = useState<DepositTransaction | null>(null);
  
  // State cho UI
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [dateRange, setDateRange] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showBankInfo, setShowBankInfo] = useState<boolean>(false);
  const [showTransactionModal, setShowTransactionModal] = useState<boolean>(false);
  const [processingDeposit, setProcessingDeposit] = useState<boolean>(false);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadAreaRef = useRef<HTMLDivElement>(null);
  const selectedFile = useRef<File | null>(null);
  
  // Hooks
  const { 
    getAccountInfo, 
    getDepositHistory, 
    getTransactionDetail,
    createDeposit,
    downloadReceipt,
    uploadReceipt,
    copyToClipboard
  } = useDepositService();
  const { showToast } = useToast();

  // Lấy dữ liệu ban đầu
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Gọi API lấy thông tin tài khoản
      const accountData = await getAccountInfo();
      setAccountInfo(accountData);
      
      // Gọi API lấy lịch sử nạp tiền
      const historyData = await getDepositHistory();
      setDepositHistory(historyData);
      
      setLoading(false);
    } catch (err) {
      setError('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
      setLoading(false);
      showToast('Có lỗi xảy ra khi tải dữ liệu', 'error');
    }
  }, [getAccountInfo, getDepositHistory, showToast]);

  // Lấy lịch sử nạp tiền theo bộ lọc
  const fetchDepositHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      
      // Gọi API lấy lịch sử nạp tiền theo bộ lọc
      const historyData = await getDepositHistory(dateRange, statusFilter);
      setDepositHistory(historyData);
      
      setHistoryLoading(false);
    } catch (err) {
      showToast('Có lỗi xảy ra khi tải lịch sử nạp tiền', 'error');
      setHistoryLoading(false);
    }
  }, [getDepositHistory, dateRange, statusFilter, showToast]);

  // Lấy chi tiết giao dịch
  const fetchTransactionDetail = useCallback(async (transactionId: string) => {
    try {
      setShowTransactionModal(true);
      
      // Gọi API lấy chi tiết giao dịch
      const transactionData = await getTransactionDetail(transactionId);
      setCurrentTransaction(transactionData);
    } catch (err) {
      showToast('Có lỗi xảy ra khi tải chi tiết giao dịch', 'error');
      setShowTransactionModal(false);
    }
  }, [getTransactionDetail, showToast]);

  // Xử lý khi thay đổi số tiền nạp
  const handleAmountChange = useCallback((value: string) => {
    // Chỉ cho phép nhập số
    const numericValue = value.replace(/[^0-9]/g, '');
    setDepositAmount(numericValue);
  }, []);

  // Định dạng số tiền
  const formatCurrency = useCallback((input: HTMLInputElement) => {
    // Lấy giá trị chỉ chứa số
    const numericValue = input.value.replace(/[^0-9]/g, '');
    
    // Định dạng số với dấu phẩy ngăn cách hàng nghìn
    if (numericValue) {
      const formattedValue = parseInt(numericValue, 10).toLocaleString('vi-VN');
      input.value = formattedValue;
    } else {
      input.value = '';
    }
    
    // Cập nhật state
    setDepositAmount(numericValue);
  }, []);

  // Chọn số tiền từ các nút gợi ý
  const selectAmount = useCallback((amount: number) => {
    setDepositAmount(amount.toString());
    
    // Cập nhật giá trị hiển thị trong input
    const inputElement = document.getElementById('deposit-amount') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = amount.toLocaleString('vi-VN');
    }
  }, []);

  // Xử lý khi thay đổi phương thức thanh toán
  const handleMethodChange = useCallback((method: string) => {
    setSelectedMethod(method);
    setShowBankInfo(method === 'bank');
  }, []);

  // Xử lý khi thay đổi bộ lọc lịch sử
  const handleFilterChange = useCallback(() => {
    fetchDepositHistory();
  }, [fetchDepositHistory]);

  // Xử lý khi tiến hành nạp tiền
  const processDeposit = useCallback(async () => {
    try {
      // Kiểm tra số tiền nạp
      if (!depositAmount || parseInt(depositAmount, 10) <= 0) {
        showToast('Vui lòng nhập số tiền hợp lệ', 'error');
        return;
      }
      
      // Kiểm tra số tiền tối thiểu
      if (parseInt(depositAmount, 10) < 10000) {
        showToast('Số tiền nạp tối thiểu là 10,000 VNĐ', 'error');
        return;
      }
      
      setProcessingDeposit(true);
      
      // Gọi API tạo giao dịch nạp tiền
      const amount = parseInt(depositAmount, 10);
      const transaction = await createDeposit(amount, selectedMethod);
      
      // Cập nhật lại dữ liệu
      await fetchInitialData();
      
      // Hiển thị thông báo thành công
      showToast('Nạp tiền thành công', 'success');
      
      // Reset form
      resetForm();
      
      // Nếu là chuyển khoản, hiển thị thông tin ngân hàng
      if (selectedMethod === 'bank') {
        setShowBankInfo(true);
      }
      
      setProcessingDeposit(false);
    } catch (err) {
      showToast('Có lỗi xảy ra khi xử lý giao dịch nạp tiền', 'error');
      setProcessingDeposit(false);
    }
  }, [depositAmount, selectedMethod, createDeposit, fetchInitialData, showToast]);

  // Reset form
  const resetForm = useCallback(() => {
    setDepositAmount('');
    setSelectedMethod('card');
    setShowBankInfo(false);
    
    // Reset input
    const inputElement = document.getElementById('deposit-amount') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    selectedFile.current = null;
  }, []);

  // Xử lý khi tải biên lai
  const handleDownloadReceipt = useCallback(async (transactionId: string) => {
    try {
      showToast('Đang tải biên lai...', 'info');
      
      // Gọi API tải biên lai
      const { url } = await downloadReceipt(transactionId);
      
      // Trong thực tế, đây sẽ là tải file thực sự
      // window.open(url, '_blank');
      
      showToast('Tải biên lai thành công', 'success');
    } catch (err) {
      showToast('Có lỗi xảy ra khi tải biên lai', 'error');
    }
  }, [downloadReceipt, showToast]);

  // Xử lý khi tải lên biên lai chuyển khoản
  const handleUploadReceipt = useCallback(async () => {
    if (!selectedFile.current) {
      showToast('Vui lòng chọn file biên lai để tải lên', 'error');
      return;
    }
    
    try {
      showToast('Đang tải lên biên lai...', 'info');
      
      // Gọi API tải lên biên lai
      // Trong thực tế, cần có transactionId
      const transactionId = 'DEP20240520004'; // Giả sử đây là ID giao dịch đang xử lý
      await uploadReceipt(transactionId, selectedFile.current);
      
      // Cập nhật lại dữ liệu
      await fetchInitialData();
      
      showToast('Tải lên biên lai thành công', 'success');
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      selectedFile.current = null;
    } catch (err) {
      showToast('Có lỗi xảy ra khi tải lên biên lai', 'error');
    }
  }, [uploadReceipt, fetchInitialData, showToast]);

  // Xử lý khi chọn file
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      selectedFile.current = files[0];
      showToast(`Đã chọn file: ${files[0].name}`, 'info');
    }
  }, [showToast]);

  // Xử lý khi kéo thả file
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (uploadAreaRef.current) {
      uploadAreaRef.current.classList.add('drag-over');
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (uploadAreaRef.current) {
      uploadAreaRef.current.classList.remove('drag-over');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (uploadAreaRef.current) {
      uploadAreaRef.current.classList.remove('drag-over');
    }
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      selectedFile.current = files[0];
      showToast(`Đã chọn file: ${files[0].name}`, 'info');
      
      // Cập nhật file input
      if (fileInputRef.current) {
        // Không thể trực tiếp gán files cho fileInputRef.current.files vì nó là readonly
        // Trong thực tế, cần hiển thị tên file đã chọn
      }
    }
  }, [showToast]);

  // Xử lý khi click vào khu vực tải lên
  const handleUploadAreaClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  // Xử lý khi sao chép nội dung vào clipboard
  const handleCopyToClipboard = useCallback(async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      showToast('Đã sao chép vào clipboard', 'success');
    } else {
      showToast('Không thể sao chép vào clipboard', 'error');
    }
  }, [copyToClipboard, showToast]);

  // Đóng modal chi tiết giao dịch
  const closeTransactionModal = useCallback(() => {
    setShowTransactionModal(false);
    setCurrentTransaction(null);
  }, []);

  // Cập nhật lịch sử nạp tiền khi thay đổi bộ lọc
  useEffect(() => {
    fetchDepositHistory();
  }, [fetchDepositHistory, dateRange, statusFilter]);

  // Tải dữ liệu khi component được mount
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Thiết lập sự kiện kéo thả file
  useEffect(() => {
    const uploadArea = uploadAreaRef.current;
    
    if (uploadArea) {
      const dragOver = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.add('drag-over');
      };
      
      const dragLeave = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('drag-over');
      };
      
      const drop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
          selectedFile.current = files[0];
          showToast(`Đã chọn file: ${files[0].name}`, 'info');
        }
      };
      
      uploadArea.addEventListener('dragover', dragOver);
      uploadArea.addEventListener('dragleave', dragLeave);
      uploadArea.addEventListener('drop', drop);
      
      return () => {
        uploadArea.removeEventListener('dragover', dragOver);
        uploadArea.removeEventListener('dragleave', dragLeave);
        uploadArea.removeEventListener('drop', drop);
      };
    }
  }, [showToast]);

  return {
    // Dữ liệu
    accountInfo,
    depositHistory,
    currentTransaction,
    
    // Trạng thái
    depositAmount,
    selectedMethod,
    dateRange,
    statusFilter,
    loading,
    historyLoading,
    error,
    showBankInfo,
    showTransactionModal,
    processingDeposit,
    
    // Refs
    fileInputRef,
    uploadAreaRef,
    
    // Hàm xử lý
    handleAmountChange,
    formatCurrency,
    selectAmount,
    handleMethodChange,
    handleFilterChange,
    processDeposit,
    resetForm,
    handleDownloadReceipt,
    handleUploadReceipt,
    handleFileSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleUploadAreaClick,
    handleCopyToClipboard,
    fetchTransactionDetail,
    closeTransactionModal,
    setDateRange,
    setStatusFilter,
    refreshData: fetchInitialData
  };
};

export default useDeposit;