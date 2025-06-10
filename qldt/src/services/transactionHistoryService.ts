// Định nghĩa các interface cho dữ liệu lịch sử giao dịch
export interface Transaction {
  id: string;
  transactionId: string;
  date: string;
  type: "tuition" | "deposit" | "fee" | "refund";
  description: string;
  amount: number;
  paymentMethod: string;
  status: "success" | "pending" | "failed";
  details?: {
    cardInfo?: string;
    bank?: string;
    partnerTransactionId?: string;
    note?: string;
    user?: string;
  };
}

export interface TransactionStats {
  totalCount: number;
  totalAmount: number;
  monthlyCount: number;
  monthlyAmount: number;
}

export interface TransactionFilter {
  type?: string;
  status?: string;
  dateRange?: string;
  dateFrom?: string;
  dateTo?: string;
  searchText?: string;
  page?: number;
  limit?: number;
}

export interface TransactionChartData {
  byType: {
    type: string;
    count: number;
    percentage: number;
    color: string;
  }[];
}

// Mock data cho việc phát triển
const mockTransactions: Transaction[] = [
  {
    id: "1",
    transactionId: "PAY20240515001",
    date: "2024-05-15T10:30:45",
    type: "tuition",
    description: "Thanh toán học phí học kỳ 2, năm học 2023-2024",
    amount: 8500000,
    paymentMethod: "Thẻ ATM",
    status: "success",
    details: {
      cardInfo: "**** **** **** 5678",
      bank: "Vietcombank",
      partnerTransactionId: "VNPAY123456789",
      note: "Thanh toán học phí học kỳ 2 năm học 2023-2024",
      user: "Nguyễn Văn A",
    },
  },
  {
    id: "2",
    transactionId: "DEP20240510002",
    date: "2024-05-10T14:15:00",
    type: "deposit",
    description: "Nạp tiền vào tài khoản sinh viên",
    amount: 1000000,
    paymentMethod: "Ví MoMo",
    status: "success",
    details: {
      partnerTransactionId: "MOMO987654321",
      note: "Nạp tiền vào tài khoản sinh viên",
      user: "Nguyễn Văn A",
    },
  },
  {
    id: "3",
    transactionId: "FEE20240505003",
    date: "2024-05-05T09:45:00",
    type: "fee",
    description: "Thanh toán phí ký túc xá học kỳ 2, năm học 2023-2024",
    amount: 1200000,
    paymentMethod: "Chuyển khoản ngân hàng",
    status: "success",
    details: {
      bank: "BIDV",
      partnerTransactionId: "BIDV123456789",
      note: "Thanh toán phí ký túc xá học kỳ 2, năm học 2023-2024",
      user: "Nguyễn Văn A",
    },
  },
  {
    id: "4",
    transactionId: "FEE20240501004",
    date: "2024-05-01T11:20:00",
    type: "fee",
    description:
      "Thanh toán phí hoạt động ngoại khóa học kỳ 2, năm học 2023-2024",
    amount: 200000,
    paymentMethod: "Thẻ ATM",
    status: "success",
    details: {
      cardInfo: "**** **** **** 5678",
      bank: "Vietcombank",
      partnerTransactionId: "VNPAY987654321",
      note: "Thanh toán phí hoạt động ngoại khóa học kỳ 2, năm học 2023-2024",
      user: "Nguyễn Văn A",
    },
  },
  {
    id: "5",
    transactionId: "DEP20240420005",
    date: "2024-04-20T16:30:00",
    type: "deposit",
    description: "Nạp tiền vào tài khoản sinh viên",
    amount: 2000000,
    paymentMethod: "Chuyển khoản ngân hàng",
    status: "success",
    details: {
      bank: "Vietcombank",
      partnerTransactionId: "VCB123456789",
      note: "Nạp tiền vào tài khoản sinh viên",
      user: "Nguyễn Văn A",
    },
  },
  {
    id: "6",
    transactionId: "PAY20240415006",
    date: "2024-04-15T09:10:00",
    type: "tuition",
    description: "Thanh toán học phí học kỳ 2, năm học 2023-2024",
    amount: 8500000,
    paymentMethod: "Thẻ tín dụng",
    status: "failed",
    details: {
      cardInfo: "**** **** **** 1234",
      bank: "Vietinbank",
      partnerTransactionId: "VNPAY123456789",
      note: "Thanh toán học phí học kỳ 2 năm học 2023-2024 - Thất bại do thẻ hết hạn",
      user: "Nguyễn Văn A",
    },
  },
  {
    id: "7",
    transactionId: "PAY20240215007",
    date: "2024-02-15T10:30:00",
    type: "tuition",
    description: "Thanh toán học phí học kỳ 2, năm học 2023-2024",
    amount: 8500000,
    paymentMethod: "Chuyển khoản ngân hàng",
    status: "success",
    details: {
      bank: "Agribank",
      partnerTransactionId: "AGR123456789",
      note: "Thanh toán học phí học kỳ 2 năm học 2023-2024",
      user: "Nguyễn Văn A",
    },
  },
  {
    id: "8",
    transactionId: "PAY20230915008",
    date: "2023-09-15T14:20:00",
    type: "tuition",
    description: "Thanh toán học phí học kỳ 1, năm học 2023-2024",
    amount: 8500000,
    paymentMethod: "Chuyển khoản ngân hàng",
    status: "success",
    details: {
      bank: "Vietcombank",
      partnerTransactionId: "VCB987654321",
      note: "Thanh toán học phí học kỳ 1 năm học 2023-2024",
      user: "Nguyễn Văn A",
    },
  },
  {
    id: "9",
    transactionId: "FEE20230915009",
    date: "2023-09-15T14:25:00",
    type: "fee",
    description: "Thanh toán bảo hiểm y tế năm học 2023-2024",
    amount: 600000,
    paymentMethod: "Chuyển khoản ngân hàng",
    status: "success",
    details: {
      bank: "Vietcombank",
      partnerTransactionId: "VCB987654322",
      note: "Thanh toán bảo hiểm y tế năm học 2023-2024",
      user: "Nguyễn Văn A",
    },
  },
  {
    id: "10",
    transactionId: "FEE20230915010",
    date: "2023-09-15T14:30:00",
    type: "fee",
    description: "Thanh toán phí ký túc xá học kỳ 1, năm học 2023-2024",
    amount: 1200000,
    paymentMethod: "Chuyển khoản ngân hàng",
    status: "success",
    details: {
      bank: "Vietcombank",
      partnerTransactionId: "VCB987654323",
      note: "Thanh toán phí ký túc xá học kỳ 1, năm học 2023-2024",
      user: "Nguyễn Văn A",
    },
  },
];

// Tính toán thống kê từ dữ liệu giao dịch
const calculateStats = (transactions: Transaction[]): TransactionStats => {
  const totalAmount = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );

  // Lấy tháng hiện tại
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Lọc giao dịch trong tháng hiện tại
  const monthlyTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });

  const monthlyAmount = monthlyTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );

  return {
    totalCount: transactions.length,
    totalAmount,
    monthlyCount: monthlyTransactions.length,
    monthlyAmount,
  };
};

// Tính toán dữ liệu biểu đồ
const calculateChartData = (
  transactions: Transaction[]
): TransactionChartData => {
  // Đếm số lượng giao dịch theo loại
  const typeCounts: Record<string, number> = {};
  transactions.forEach((transaction) => {
    const type = transaction.type;
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  // Tính phần trăm và gán màu
  const colors = {
    tuition: "#4caf50",
    deposit: "#2196f3",
    fee: "#ff9800",
    refund: "#9c27b0",
  };

  const typeLabels = {
    tuition: "Học phí",
    deposit: "Nạp tiền",
    fee: "Các khoản thu khác",
    refund: "Hoàn tiền",
  };

  const byType = Object.entries(typeCounts).map(([type, count]) => {
    return {
      type: typeLabels[type as keyof typeof typeLabels],
      count,
      percentage: Math.round((count / transactions.length) * 100),
      color: colors[type as keyof typeof colors],
    };
  });

  return { byType };
};

// Service API cho lịch sử giao dịch
const transactionHistoryService = {
  // Lấy danh sách giao dịch với bộ lọc
  getTransactions: async (
    filter?: TransactionFilter
  ): Promise<Transaction[]> => {
    // Trong môi trường thực tế, đây sẽ là một API call
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredTransactions = [...mockTransactions];

        // Áp dụng bộ lọc nếu có
        if (filter) {
          // Lọc theo loại giao dịch
          if (filter.type && filter.type !== "all") {
            filteredTransactions = filteredTransactions.filter(
              (transaction) => transaction.type === filter.type
            );
          }

          // Lọc theo trạng thái
          if (filter.status && filter.status !== "all") {
            filteredTransactions = filteredTransactions.filter(
              (transaction) => transaction.status === filter.status
            );
          }

          // Lọc theo khoảng thời gian
          if (filter.dateRange && filter.dateRange !== "all") {
            const now = new Date();
            let fromDate = new Date();

            switch (filter.dateRange) {
              case "today":
                fromDate.setHours(0, 0, 0, 0);
                break;
              case "week":
                fromDate.setDate(now.getDate() - 7);
                break;
              case "month":
                fromDate.setDate(now.getDate() - 30);
                break;
              case "month-3":
                fromDate.setMonth(now.getMonth() - 3);
                break;
              case "month-6":
                fromDate.setMonth(now.getMonth() - 6);
                break;
              case "year":
                fromDate.setFullYear(now.getFullYear() - 1);
                break;
            }

            filteredTransactions = filteredTransactions.filter(
              (transaction) => {
                const transactionDate = new Date(transaction.date);
                return transactionDate >= fromDate && transactionDate <= now;
              }
            );
          }

          // Lọc theo khoảng thời gian cụ thể
          if (filter.dateFrom && filter.dateTo) {
            const fromDate = new Date(filter.dateFrom);
            const toDate = new Date(filter.dateTo);
            toDate.setHours(23, 59, 59, 999); // Đến cuối ngày

            filteredTransactions = filteredTransactions.filter(
              (transaction) => {
                const transactionDate = new Date(transaction.date);
                return transactionDate >= fromDate && transactionDate <= toDate;
              }
            );
          }

          // Tìm kiếm theo text
          if (filter.searchText) {
            const searchText = filter.searchText.toLowerCase();
            filteredTransactions = filteredTransactions.filter(
              (transaction) =>
                transaction.transactionId.toLowerCase().includes(searchText) ||
                transaction.description.toLowerCase().includes(searchText)
            );
          }

          // Phân trang
          if (filter.page !== undefined && filter.limit !== undefined) {
            const startIndex = (filter.page - 1) * filter.limit;
            filteredTransactions = filteredTransactions.slice(
              startIndex,
              startIndex + filter.limit
            );
          }
        }

        resolve(filteredTransactions);
      }, 500);
    });
  },

  // Lấy thống kê giao dịch
  getTransactionStats: async (): Promise<TransactionStats> => {
    // Trong môi trường thực tế, đây sẽ là một API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = calculateStats(mockTransactions);
        resolve(stats);
      }, 300);
    });
  },

  // Lấy dữ liệu biểu đồ
  getTransactionChartData: async (): Promise<TransactionChartData> => {
    // Trong môi trường thực tế, đây sẽ là một API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const chartData = calculateChartData(mockTransactions);
        resolve(chartData);
      }, 300);
    });
  },

  // Lấy chi tiết một giao dịch
  getTransactionDetail: async (
    transactionId: string
  ): Promise<Transaction | null> => {
    // Trong môi trường thực tế, đây sẽ là một API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const transaction = mockTransactions.find(
          (t) => t.transactionId === transactionId
        );
        resolve(transaction || null);
      }, 300);
    });
  },

  // Tải biên lai giao dịch
  downloadReceipt: async (
    transactionId: string
  ): Promise<{ success: boolean; fileUrl?: string }> => {
    // Trong môi trường thực tế, đây sẽ là một API call để tải biên lai
    return new Promise((resolve) => {
      setTimeout(() => {
        // Kiểm tra xem giao dịch có tồn tại không
        const transaction = mockTransactions.find(
          (t) => t.transactionId === transactionId
        );

        if (transaction && transaction.status === "success") {
          resolve({
            success: true,
            fileUrl: `/receipts/${transactionId}.pdf`,
          });
        } else {
          resolve({
            success: false,
          });
        }
      }, 500);
    });
  },

  // Thử lại giao dịch thất bại
  retryTransaction: async (
    transactionId: string
  ): Promise<{ success: boolean; message: string }> => {
    // Trong môi trường thực tế, đây sẽ là một API call để thử lại giao dịch
    return new Promise((resolve) => {
      setTimeout(() => {
        // Kiểm tra xem giao dịch có tồn tại không
        const transaction = mockTransactions.find(
          (t) => t.transactionId === transactionId
        );

        if (transaction && transaction.status === "failed") {
          resolve({
            success: true,
            message: "Đã gửi yêu cầu thử lại giao dịch thành công",
          });
        } else {
          resolve({
            success: false,
            message: "Không thể thử lại giao dịch này",
          });
        }
      }, 500);
    });
  },

  // Xuất dữ liệu giao dịch ra file Excel
  exportToExcel: async (
    filter?: TransactionFilter
  ): Promise<{ success: boolean; fileUrl?: string }> => {
    // Trong môi trường thực tế, đây sẽ là một API call để xuất file Excel
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          fileUrl: "/exports/transactions.xlsx",
        });
      }, 1000);
    });
  },

  // Xuất dữ liệu giao dịch ra file PDF
  exportToPDF: async (
    filter?: TransactionFilter
  ): Promise<{ success: boolean; fileUrl?: string }> => {
    // Trong môi trường thực tế, đây sẽ là một API call để xuất file PDF
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          fileUrl: "/exports/transactions.pdf",
        });
      }, 1000);
    });
  },
};

export default transactionHistoryService;
