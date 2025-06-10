// Định nghĩa các interface cho dữ liệu công nợ
export interface DebtItem {
  id: string;
  debtCode: string;
  debtType: 'tuition' | 'dormitory' | 'insurance' | 'other';
  description: string;
  semester: string;
  academicYear: string;
  amount: number;
  paid: number;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'overdue' | 'upcoming';
}

export interface DebtSummary {
  totalDebt: number;
  totalPaid: number;
  overdueDebt: number;
  upcomingDebt: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'bank_transfer' | 'credit_card' | 'e_wallet' | 'cash';
  icon: string;
  description?: string;
}

export interface PaymentTransaction {
  id: string;
  transactionCode: string;
  paymentDate: string;
  debtType: 'tuition' | 'dormitory' | 'insurance' | 'other';
  description: string;
  semester: string;
  amount: number;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
  bankCode?: string;
  bankTransactionId?: string;
  payer: string;
  notes?: string;
}

export interface PaymentFilter {
  debtType?: string;
  status?: string;
  semester?: string;
  dateRange?: string;
}

export interface PaymentResult {
  success: boolean;
  message: string;
  transactionId?: string;
  receiptUrl?: string;
}

// Mock data cho việc phát triển
const mockDebtItems: DebtItem[] = [
  {
    id: "debt1",
    debtCode: "HP2023-2024-2",
    debtType: "tuition",
    description: "Học phí học kỳ 2, năm học 2023-2024",
    semester: "Học kỳ 2",
    academicYear: "2023-2024",
    amount: 10000000,
    paid: 5000000,
    dueDate: "2024-01-15",
    status: "unpaid"
  },
  {
    id: "debt2",
    debtCode: "KTX2023-2024-2",
    debtType: "dormitory",
    description: "Phí ký túc xá học kỳ 2, năm học 2023-2024",
    semester: "Học kỳ 2",
    academicYear: "2023-2024",
    amount: 2400000,
    paid: 0,
    dueDate: "2024-01-20",
    status: "unpaid"
  },
  {
    id: "debt3",
    debtCode: "BHYT2023-2024",
    debtType: "insurance",
    description: "Bảo hiểm y tế năm học 2023-2024",
    semester: "Năm học 2023-2024",
    academicYear: "2023-2024",
    amount: 600000,
    paid: 600000,
    dueDate: "2023-09-30",
    status: "paid"
  }
];

const mockPaymentTransactions: PaymentTransaction[] = [
  {
    id: "payment1",
    transactionCode: "PAY20240215001",
    paymentDate: "2024-02-15 10:30:45",
    debtType: "tuition",
    description: "Học phí học kỳ 2, năm học 2023-2024",
    semester: "HK2 2023-2024",
    amount: 8500000,
    paymentMethod: "Chuyển khoản",
    status: "completed",
    bankCode: "Vietcombank",
    bankTransactionId: "VCB123456789",
    payer: "Nguyễn Văn A",
    notes: "Thanh toán học phí học kỳ 2 năm học 2023-2024"
  },
  {
    id: "payment2",
    transactionCode: "PAY20230915002",
    paymentDate: "2023-09-15 09:15:22",
    debtType: "tuition",
    description: "Học phí học kỳ 1, năm học 2023-2024",
    semester: "HK1 2023-2024",
    amount: 8500000,
    paymentMethod: "Chuyển khoản",
    status: "completed",
    bankCode: "Vietcombank",
    bankTransactionId: "VCB987654321",
    payer: "Nguyễn Văn A",
    notes: "Thanh toán học phí học kỳ 1 năm học 2023-2024"
  },
  {
    id: "payment3",
    transactionCode: "PAY20230915003",
    paymentDate: "2023-09-15 09:20:15",
    debtType: "insurance",
    description: "Bảo hiểm y tế năm học 2023-2024",
    semester: "Năm học 2023-2024",
    amount: 600000,
    paymentMethod: "Chuyển khoản",
    status: "completed",
    bankCode: "Vietcombank",
    bankTransactionId: "VCB987654322",
    payer: "Nguyễn Văn A",
    notes: "Thanh toán bảo hiểm y tế năm học 2023-2024"
  },
  {
    id: "payment4",
    transactionCode: "PAY20230915004",
    paymentDate: "2023-09-15 09:25:30",
    debtType: "dormitory",
    description: "Phí ký túc xá học kỳ 1, năm học 2023-2024",
    semester: "HK1 2023-2024",
    amount: 1200000,
    paymentMethod: "Chuyển khoản",
    status: "completed",
    bankCode: "Vietcombank",
    bankTransactionId: "VCB987654323",
    payer: "Nguyễn Văn A",
    notes: "Thanh toán phí ký túc xá học kỳ 1 năm học 2023-2024"
  },
  {
    id: "payment5",
    transactionCode: "PAY20230215005",
    paymentDate: "2023-02-15 14:45:10",
    debtType: "tuition",
    description: "Học phí học kỳ 2, năm học 2022-2023",
    semester: "HK2 2022-2023",
    amount: 8500000,
    paymentMethod: "Chuyển khoản",
    status: "completed",
    bankCode: "Vietcombank",
    bankTransactionId: "VCB765432198",
    payer: "Nguyễn Văn A",
    notes: "Thanh toán học phí học kỳ 2 năm học 2022-2023"
  }
];

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "method1",
    name: "Thẻ ATM nội địa",
    type: "bank_transfer",
    icon: "fa-credit-card",
    description: "Hỗ trợ tất cả các ngân hàng có liên kết với NAPAS"
  },
  {
    id: "method2",
    name: "Thẻ quốc tế",
    type: "credit_card",
    icon: "fa-cc-visa",
    description: "Visa, MasterCard, JCB"
  },
  {
    id: "method3",
    name: "Ví điện tử",
    type: "e_wallet",
    icon: "fa-mobile",
    description: "MoMo, ZaloPay, VNPay"
  },
  {
    id: "method4",
    name: "Chuyển khoản ngân hàng",
    type: "bank_transfer",
    icon: "fa-university",
    description: "Chuyển khoản qua tài khoản ngân hàng của trường"
  }
];

// Service API cho công nợ
const debtService = {
  // Lấy danh sách công nợ
  getDebtList: async (filters?: PaymentFilter): Promise<DebtItem[]> => {
    // Trong môi trường thực tế, đây sẽ là một API call
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredDebts = [...mockDebtItems];
        
        // Áp dụng bộ lọc nếu có
        if (filters) {
          if (filters.debtType && filters.debtType !== 'all') {
            filteredDebts = filteredDebts.filter(debt => debt.debtType === filters.debtType);
          }
          
          if (filters.status && filters.status !== 'all') {
            filteredDebts = filteredDebts.filter(debt => debt.status === filters.status);
          }
          
          if (filters.semester && filters.semester !== 'all') {
            const [year, semester] = filters.semester.split('-');
            filteredDebts = filteredDebts.filter(debt => 
              debt.academicYear === year && debt.semester.includes(`Học kỳ ${semester}`)
            );
          }
        }
        
        resolve(filteredDebts);
      }, 1000);
    });
  },

  // Lấy tổng hợp công nợ
  getDebtSummary: async (): Promise<DebtSummary> => {
    // Trong môi trường thực tế, đây sẽ là một API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Tính toán tổng hợp từ danh sách công nợ
        const totalDebt = mockDebtItems.reduce((sum, item) => sum + (item.amount - item.paid), 0);
        const totalPaid = mockDebtItems.reduce((sum, item) => sum + item.paid, 0);
        const overdueDebt = mockDebtItems
          .filter(item => item.status === 'overdue')
          .reduce((sum, item) => sum + (item.amount - item.paid), 0);
        const upcomingDebt = mockDebtItems
          .filter(item => item.status === 'upcoming')
          .reduce((sum, item) => sum + (item.amount - item.paid), 0);
        
        resolve({
          totalDebt,
          totalPaid,
          overdueDebt,
          upcomingDebt
        });
      }, 1000);
    });
  },

  // Lấy chi tiết một khoản công nợ
  getDebtDetail: async (debtId: string): Promise<DebtItem | null> => {
    // Trong môi trường thực tế, đây sẽ là một API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const debt = mockDebtItems.find(item => item.id === debtId) || null;
        resolve(debt);
      }, 1000);
    });
  },

  // Thanh toán công nợ
  payDebt: async (
    debtId: string, 
    amount: number, 
    paymentMethodId: string
  ): Promise<PaymentResult> => {
    // Trong môi trường thực tế, đây sẽ là một API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const debt = mockDebtItems.find(item => item.id === debtId);
        const paymentMethod = mockPaymentMethods.find(method => method.id === paymentMethodId);
        
        if (!debt || !paymentMethod) {
          resolve({
            success: false,
            message: 'Không tìm thấy thông tin công nợ hoặc phương thức thanh toán'
          });
          return;
        }
        
        // Giả lập thanh toán thành công
        const transactionId = `PAY${new Date().getTime()}`;
        
        resolve({
          success: true,
          message: 'Thanh toán thành công',
          transactionId,
          receiptUrl: `/receipts/${transactionId}.pdf`
        });
      }, 2000);
    });
  },

  // Lấy lịch sử thanh toán
  getPaymentHistory: async (filters?: PaymentFilter): Promise<PaymentTransaction[]> => {
    // Trong môi trường thực tế, đây sẽ là một API call
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredHistory = [...mockPaymentTransactions];
        
        // Áp dụng bộ lọc nếu có
        if (filters) {
          if (filters.debtType && filters.debtType !== 'all') {
            filteredHistory = filteredHistory.filter(payment => payment.debtType === filters.debtType);
          }
          
          if (filters.dateRange && filters.dateRange !== 'all') {
            const now = new Date();
            let startDate = new Date();
            
            // Tính toán ngày bắt đầu dựa trên bộ lọc
            if (filters.dateRange === 'month-3') {
              startDate.setMonth(now.getMonth() - 3);
            } else if (filters.dateRange === 'month-6') {
              startDate.setMonth(now.getMonth() - 6);
            } else if (filters.dateRange === 'year-1') {
              startDate.setFullYear(now.getFullYear() - 1);
            }
            
            filteredHistory = filteredHistory.filter(payment => {
              const paymentDate = new Date(payment.paymentDate);
              return paymentDate >= startDate && paymentDate <= now;
            });
          }
          
          if (filters.semester && filters.semester !== 'all') {
            filteredHistory = filteredHistory.filter(payment => 
              payment.semester.includes(filters.semester || '')
            );
          }
        }
        
        resolve(filteredHistory);
      }, 1000);
    });
  },

  // Lấy chi tiết giao dịch thanh toán
  getPaymentDetail: async (paymentId: string): Promise<PaymentTransaction | null> => {
    // Trong môi trường thực tế, đây sẽ là một API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const payment = mockPaymentTransactions.find(item => item.id === paymentId || item.transactionCode === paymentId) || null;
        resolve(payment);
      }, 1000);
    });
  },

  // Lấy danh sách phương thức thanh toán
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    // Trong môi trường thực tế, đây sẽ là một API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockPaymentMethods);
      }, 1000);
    });
  },

  // Tải biên lai thanh toán
  downloadReceipt: async (paymentId: string): Promise<{ url: string }> => {
    // Trong môi trường thực tế, đây sẽ là một API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          url: `/receipts/${paymentId}.pdf`
        });
      }, 1000);
    });
  },

  // Xuất dữ liệu công nợ
  exportDebtData: async (filters?: PaymentFilter): Promise<{ url: string }> => {
    // Trong môi trường thực tế, đây sẽ là một API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          url: `/exports/debt-data-${new Date().getTime()}.xlsx`
        });
      }, 1000);
    });
  }
};

export default debtService;