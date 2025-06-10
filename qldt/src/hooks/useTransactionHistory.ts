import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import transactionHistoryService, { 
  Transaction, 
  TransactionStats, 
  TransactionFilter,
  TransactionChartData
} from '../services/transactionHistoryService';

export const useTransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [chartData, setChartData] = useState<TransactionChartData | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [statsLoading, setStatsLoading] = useState<boolean>(false);
  const [chartLoading, setChartLoading] = useState<boolean>(false);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<TransactionFilter>({
    type: 'all',
    status: 'all',
    dateRange: 'all',
    page: 1,
    limit: 10
  });
  
  const { showToast } = useToast();
  
  // Lấy danh sách giao dịch
  const fetchTransactions = useCallback(async (filter?: TransactionFilter) => {
    setLoading(true);
    setError(null);
    
    try {
      const appliedFilter = filter || currentFilter;
      const data = await transactionHistoryService.getTransactions(appliedFilter);
      setTransactions(data);
      
      if (filter) {
        setCurrentFilter(filter);
      }
    } catch (err) {
      console.error('Lỗi khi lấy danh sách giao dịch:', err);
      setError('Không thể tải danh sách giao dịch. Vui lòng thử lại sau.');
      showToast('Không thể tải danh sách giao dịch', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentFilter, showToast]);
  
  // Lấy thống kê giao dịch
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    
    try {
      const data = await transactionHistoryService.getTransactionStats();
      setStats(data);
    } catch (err) {
      console.error('Lỗi khi lấy thống kê giao dịch:', err);
      showToast('Không thể tải thống kê giao dịch', 'error');
    } finally {
      setStatsLoading(false);
    }
  }, [showToast]);
  
  // Lấy dữ liệu biểu đồ
  const fetchChartData = useCallback(async () => {
    setChartLoading(true);
    
    try {
      const data = await transactionHistoryService.getTransactionChartData();
      setChartData(data);
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu biểu đồ:', err);
      showToast('Không thể tải dữ liệu biểu đồ', 'error');
    } finally {
      setChartLoading(false);
    }
  }, [showToast]);
  
  // Lấy chi tiết giao dịch
  const fetchTransactionDetail = useCallback(async (transactionId: string) => {
    setDetailLoading(true);
    
    try {
      const data = await transactionHistoryService.getTransactionDetail(transactionId);
      setSelectedTransaction(data);
      return data;
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết giao dịch:', err);
      showToast('Không thể tải chi tiết giao dịch', 'error');
      return null;
    } finally {
      setDetailLoading(false);
    }
  }, [showToast]);
  
  // Tải biên lai giao dịch
  const downloadReceipt = useCallback(async (transactionId: string) => {
    try {
      const result = await transactionHistoryService.downloadReceipt(transactionId);
      
      if (result.success && result.fileUrl) {
        // Trong môi trường thực tế, đây sẽ mở một tab mới hoặc tải file
        window.open(result.fileUrl, '_blank');
        showToast('Đang tải biên lai giao dịch', 'success');
        return true;
      } else {
        showToast('Không thể tải biên lai giao dịch', 'error');
        return false;
      }
    } catch (err) {
      console.error('Lỗi khi tải biên lai:', err);
      showToast('Không thể tải biên lai giao dịch', 'error');
      return false;
    }
  }, [showToast]);
  
  // Thử lại giao dịch thất bại
  const retryTransaction = useCallback(async (transactionId: string) => {
    try {
      const result = await transactionHistoryService.retryTransaction(transactionId);
      
      if (result.success) {
        showToast(result.message, 'success');
        // Tải lại danh sách giao dịch
        fetchTransactions();
        return true;
      } else {
        showToast(result.message, 'error');
        return false;
      }
    } catch (err) {
      console.error('Lỗi khi thử lại giao dịch:', err);
      showToast('Không thể thử lại giao dịch', 'error');
      return false;
    }
  }, [fetchTransactions, showToast]);
  
  // Xuất dữ liệu giao dịch ra file Excel
  const exportToExcel = useCallback(async () => {
    try {
      const result = await transactionHistoryService.exportToExcel(currentFilter);
      
      if (result.success && result.fileUrl) {
        // Trong môi trường thực tế, đây sẽ mở một tab mới hoặc tải file
        window.open(result.fileUrl, '_blank');
        showToast('Đang xuất dữ liệu ra file Excel', 'success');
        return true;
      } else {
        showToast('Không thể xuất dữ liệu ra file Excel', 'error');
        return false;
      }
    } catch (err) {
      console.error('Lỗi khi xuất file Excel:', err);
      showToast('Không thể xuất dữ liệu ra file Excel', 'error');
      return false;
    }
  }, [currentFilter, showToast]);
  
  // Xuất dữ liệu giao dịch ra file PDF
  const exportToPDF = useCallback(async () => {
    try {
      const result = await transactionHistoryService.exportToPDF(currentFilter);
      
      if (result.success && result.fileUrl) {
        // Trong môi trường thực tế, đây sẽ mở một tab mới hoặc tải file
        window.open(result.fileUrl, '_blank');
        showToast('Đang xuất dữ liệu ra file PDF', 'success');
        return true;
      } else {
        showToast('Không thể xuất dữ liệu ra file PDF', 'error');
        return false;
      }
    } catch (err) {
      console.error('Lỗi khi xuất file PDF:', err);
      showToast('Không thể xuất dữ liệu ra file PDF', 'error');
      return false;
    }
  }, [currentFilter, showToast]);
  
  // Áp dụng bộ lọc
  const applyFilter = useCallback((filter: Partial<TransactionFilter>) => {
    const newFilter = { ...currentFilter, ...filter };
    fetchTransactions(newFilter);
  }, [currentFilter, fetchTransactions]);
  
  // Tìm kiếm giao dịch
  const searchTransactions = useCallback((searchText: string) => {
    const newFilter = { ...currentFilter, searchText, page: 1 };
    fetchTransactions(newFilter);
  }, [currentFilter, fetchTransactions]);
  
  // Áp dụng bộ lọc ngày tùy chỉnh
  const applyDateFilter = useCallback((dateFrom: string, dateTo: string) => {
    if (!dateFrom || !dateTo) {
      showToast('Vui lòng chọn đầy đủ khoảng thời gian', 'warning');
      return;
    }
    
    const newFilter = { 
      ...currentFilter, 
      dateRange: undefined, 
      dateFrom, 
      dateTo,
      page: 1
    };
    
    fetchTransactions(newFilter);
  }, [currentFilter, fetchTransactions, showToast]);
  
  // In danh sách giao dịch
  const printTransactions = useCallback(() => {
    window.print();
  }, []);
  
  // Tải dữ liệu khi component được mount
  useEffect(() => {
    fetchTransactions();
    fetchStats();
    fetchChartData();
  }, [fetchTransactions, fetchStats, fetchChartData]);
  
  return {
    transactions,
    stats,
    chartData,
    selectedTransaction,
    loading,
    statsLoading,
    chartLoading,
    detailLoading,
    error,
    currentFilter,
    fetchTransactions,
    fetchTransactionDetail,
    downloadReceipt,
    retryTransaction,
    exportToExcel,
    exportToPDF,
    applyFilter,
    searchTransactions,
    applyDateFilter,
    printTransactions
  };
};

export default useTransactionHistory;