import { useState, useCallback, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import debtService, { 
  DebtItem, 
  DebtSummary, 
  PaymentTransaction, 
  PaymentMethod,
  PaymentFilter,
  PaymentResult
} from '../services/debtService';

export const useDebt = () => {
  const [debtList, setDebtList] = useState<DebtItem[]>([]);
  const [debtSummary, setDebtSummary] = useState<DebtSummary | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentTransaction[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedDebt, setSelectedDebt] = useState<DebtItem | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentTransaction | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { showToast } = useToast();

  // Lấy danh sách công nợ
  const fetchDebtList = useCallback(async (filters?: PaymentFilter) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await debtService.getDebtList(filters);
      setDebtList(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Có lỗi xảy ra khi lấy danh sách công nợ'));
      showToast('Không thể lấy danh sách công nợ', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Lấy tổng hợp công nợ
  const fetchDebtSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await debtService.getDebtSummary();
      setDebtSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Có lỗi xảy ra khi lấy tổng hợp công nợ'));
      showToast('Không thể lấy thông tin tổng hợp công nợ', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Lấy chi tiết công nợ
  const fetchDebtDetail = useCallback(async (debtId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await debtService.getDebtDetail(debtId);
      setSelectedDebt(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Có lỗi xảy ra khi lấy chi tiết công nợ'));
      showToast('Không thể lấy thông tin chi tiết công nợ', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Lấy lịch sử thanh toán
  const fetchPaymentHistory = useCallback(async (filters?: PaymentFilter) => {
    setHistoryLoading(true);
    setError(null);
    
    try {
      const data = await debtService.getPaymentHistory(filters);
      setPaymentHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Có lỗi xảy ra khi lấy lịch sử thanh toán'));
      showToast('Không thể lấy lịch sử thanh toán', 'error');
    } finally {
      setHistoryLoading(false);
    }
  }, [showToast]);

  // Lấy chi tiết giao dịch thanh toán
  const fetchPaymentDetail = useCallback(async (paymentId: string) => {
    setHistoryLoading(true);
    setError(null);
    
    try {
      const data = await debtService.getPaymentDetail(paymentId);
      setSelectedPayment(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Có lỗi xảy ra khi lấy chi tiết giao dịch'));
      showToast('Không thể lấy thông tin chi tiết giao dịch', 'error');
      return null;
    } finally {
      setHistoryLoading(false);
    }
  }, [showToast]);

  // Lấy danh sách phương thức thanh toán
  const fetchPaymentMethods = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await debtService.getPaymentMethods();
      setPaymentMethods(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Có lỗi xảy ra khi lấy phương thức thanh toán'));
      showToast('Không thể lấy danh sách phương thức thanh toán', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Thanh toán công nợ
  const payDebt = useCallback(async (
    debtId: string, 
    amount: number, 
    paymentMethodId: string
  ): Promise<PaymentResult> => {
    setPaymentLoading(true);
    setError(null);
    
    try {
      const result = await debtService.payDebt(debtId, amount, paymentMethodId);
      
      if (result.success) {
        showToast('Thanh toán công nợ thành công', 'success');
        // Cập nhật lại danh sách công nợ và tổng hợp
        fetchDebtList();
        fetchDebtSummary();
        fetchPaymentHistory();
      } else {
        showToast(result.message || 'Thanh toán không thành công', 'error');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi thanh toán';
      setError(err instanceof Error ? err : new Error(errorMessage));
      showToast(errorMessage, 'error');
      
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setPaymentLoading(false);
    }
  }, [showToast, fetchDebtList, fetchDebtSummary, fetchPaymentHistory]);

  // Tải biên lai thanh toán
  const downloadReceipt = useCallback(async (paymentId: string): Promise<string | null> => {
    setHistoryLoading(true);
    setError(null);
    
    try {
      const result = await debtService.downloadReceipt(paymentId);
      showToast('Đang tải biên lai thanh toán', 'info');
      return result.url;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Có lỗi xảy ra khi tải biên lai'));
      showToast('Không thể tải biên lai thanh toán', 'error');
      return null;
    } finally {
      setHistoryLoading(false);
    }
  }, [showToast]);

  // Xuất dữ liệu công nợ
  const exportDebtData = useCallback(async (filters?: PaymentFilter): Promise<string | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await debtService.exportDebtData(filters);
      showToast('Đang xuất dữ liệu công nợ', 'info');
      return result.url;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Có lỗi xảy ra khi xuất dữ liệu'));
      showToast('Không thể xuất dữ liệu công nợ', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Định dạng tiền tệ
  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  }, []);

  // Lọc dữ liệu công nợ
  const filterDebtData = useCallback((filters: PaymentFilter) => {
    fetchDebtList(filters);
  }, [fetchDebtList]);

  // Lọc lịch sử thanh toán
  const filterPaymentHistory = useCallback((filters: PaymentFilter) => {
    fetchPaymentHistory(filters);
  }, [fetchPaymentHistory]);

  // Khởi tạo dữ liệu khi component được mount
  useEffect(() => {
    fetchDebtList();
    fetchDebtSummary();
    fetchPaymentMethods();
    fetchPaymentHistory();
  }, [fetchDebtList, fetchDebtSummary, fetchPaymentMethods, fetchPaymentHistory]);

  return {
    debtList,
    debtSummary,
    paymentHistory,
    paymentMethods,
    selectedDebt,
    selectedPayment,
    loading,
    historyLoading,
    paymentLoading,
    error,
    fetchDebtList,
    fetchDebtSummary,
    fetchDebtDetail,
    fetchPaymentHistory,
    fetchPaymentDetail,
    fetchPaymentMethods,
    payDebt,
    downloadReceipt,
    exportDebtData,
    formatCurrency,
    filterDebtData,
    filterPaymentHistory
  };
};

export default useDebt;