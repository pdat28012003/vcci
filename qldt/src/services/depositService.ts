import useApiService from "../hooks/useApiService";
import { useCallback } from "react";

// Interface cho thông tin tài khoản
export interface AccountInfo {
  studentId: string;
  fullName: string;
  balance: number;
  lastUpdated: string;
}

// Interface cho giao dịch nạp tiền
export interface DepositTransaction {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: "success" | "pending" | "failed";
  receiptUrl?: string;
}

// Hook để quản lý các API liên quan đến nạp tiền
export const useDepositService = () => {
  const { fetchApi } = useApiService();

  // Lấy thông tin tài khoản
  const getAccountInfo = useCallback(async (): Promise<AccountInfo> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<AccountInfo>('/api/account/info');

      // Giả lập độ trễ của API
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Dữ liệu mẫu cho thông tin tài khoản
      const accountInfo: AccountInfo = {
        studentId: "SV20200001",
        fullName: "Nguyễn Văn A",
        balance: 500000,
        lastUpdated: "2024-05-15T10:30:00",
      };

      return accountInfo;
    } catch (error) {
      console.error("Error fetching account info:", error);
      throw error;
    }
  }, [fetchApi]);

  // Lấy lịch sử nạp tiền
  const getDepositHistory = useCallback(
    async (
      dateRange: string = "all",
      status: string = "all"
    ): Promise<DepositTransaction[]> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<DepositTransaction[]>(`/api/deposit/history?dateRange=${dateRange}&status=${status}`);

        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Dữ liệu mẫu cho lịch sử nạp tiền
        const depositHistory: DepositTransaction[] = [
          {
            id: "DEP20240515001",
            date: "2024-05-15T10:30:00",
            amount: 500000,
            method: "Thẻ ATM",
            status: "success",
            receiptUrl: "/receipts/DEP20240515001.pdf",
          },
          {
            id: "DEP20240520004",
            date: "2024-05-20T08:15:00",
            amount: 300000,
            method: "Chuyển khoản ngân hàng",
            status: "pending",
          },
          {
            id: "DEP20240410002",
            date: "2024-04-10T14:15:00",
            amount: 1000000,
            method: "Chuyển khoản ngân hàng",
            status: "success",
            receiptUrl: "/receipts/DEP20240410002.pdf",
          },
          {
            id: "DEP20240325005",
            date: "2024-03-25T16:20:00",
            amount: 200000,
            method: "Ví ZaloPay",
            status: "failed",
          },
          {
            id: "DEP20240305003",
            date: "2024-03-05T09:45:00",
            amount: 2000000,
            method: "Ví MoMo",
            status: "success",
            receiptUrl: "/receipts/DEP20240305003.pdf",
          },
        ];

        // Lọc theo khoảng thời gian
        let filteredHistory = [...depositHistory];
        const now = new Date();

        if (dateRange === "today") {
          const today = new Date().setHours(0, 0, 0, 0);
          filteredHistory = filteredHistory.filter(
            (item) => new Date(item.date).setHours(0, 0, 0, 0) === today
          );
        } else if (dateRange === "week") {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filteredHistory = filteredHistory.filter(
            (item) => new Date(item.date) >= weekAgo
          );
        } else if (dateRange === "month") {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          filteredHistory = filteredHistory.filter(
            (item) => new Date(item.date) >= monthAgo
          );
        } else if (dateRange === "year") {
          const yearStart = new Date(now.getFullYear(), 0, 1);
          filteredHistory = filteredHistory.filter(
            (item) => new Date(item.date) >= yearStart
          );
        }

        // Lọc theo trạng thái
        if (status !== "all") {
          filteredHistory = filteredHistory.filter(
            (item) => item.status === status
          );
        }

        return filteredHistory;
      } catch (error) {
        console.error("Error fetching deposit history:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Lấy chi tiết giao dịch
  const getTransactionDetail = useCallback(
    async (transactionId: string): Promise<DepositTransaction> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<DepositTransaction>(`/api/deposit/transaction/${transactionId}`);

        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Dữ liệu mẫu cho chi tiết giao dịch
        const transactions: Record<string, DepositTransaction> = {
          DEP20240515001: {
            id: "DEP20240515001",
            date: "2024-05-15T10:30:00",
            amount: 500000,
            method: "Thẻ ATM",
            status: "success",
            receiptUrl: "/receipts/DEP20240515001.pdf",
          },
          DEP20240520004: {
            id: "DEP20240520004",
            date: "2024-05-20T08:15:00",
            amount: 300000,
            method: "Chuyển khoản ngân hàng",
            status: "pending",
          },
          DEP20240410002: {
            id: "DEP20240410002",
            date: "2024-04-10T14:15:00",
            amount: 1000000,
            method: "Chuyển khoản ngân hàng",
            status: "success",
            receiptUrl: "/receipts/DEP20240410002.pdf",
          },
          DEP20240325005: {
            id: "DEP20240325005",
            date: "2024-03-25T16:20:00",
            amount: 200000,
            method: "Ví ZaloPay",
            status: "failed",
          },
          DEP20240305003: {
            id: "DEP20240305003",
            date: "2024-03-05T09:45:00",
            amount: 2000000,
            method: "Ví MoMo",
            status: "success",
            receiptUrl: "/receipts/DEP20240305003.pdf",
          },
        };

        const transaction = transactions[transactionId];
        if (!transaction) {
          throw new Error("Không tìm thấy thông tin giao dịch");
        }

        return transaction;
      } catch (error) {
        console.error("Error fetching transaction detail:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Tạo giao dịch nạp tiền
  const createDeposit = useCallback(
    async (amount: number, method: string): Promise<DepositTransaction> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        /*
        return await fetchApi<DepositTransaction>('/api/deposit/create', {
          method: 'POST',
          body: { amount, method },
          showLoading: true,
          showError: true
        });
        */

        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Tạo ID giao dịch mới
        const transactionId = `DEP${new Date()
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, "")}${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`;

        // Dữ liệu mẫu cho giao dịch mới
        const newTransaction: DepositTransaction = {
          id: transactionId,
          date: new Date().toISOString(),
          amount,
          method,
          status: "success",
          receiptUrl: `/receipts/${transactionId}.pdf`,
        };

        return newTransaction;
      } catch (error) {
        console.error("Error creating deposit:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Tải biên lai
  const downloadReceipt = useCallback(
    async (transactionId: string): Promise<{ url: string }> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        /*
        return await fetchApi<{ url: string }>(`/api/deposit/receipt/${transactionId}`, {
          showLoading: true,
          showError: true
        });
        */

        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Dữ liệu mẫu cho URL biên lai
        return {
          url: `/receipts/${transactionId}.pdf`,
        };
      } catch (error) {
        console.error("Error downloading receipt:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Tải lên biên lai chuyển khoản
  const uploadReceipt = useCallback(
    async (transactionId: string, file: File): Promise<DepositTransaction> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        /*
        const formData = new FormData();
        formData.append('file', file);
        
        return await fetchApi<DepositTransaction>(`/api/deposit/upload-receipt/${transactionId}`, {
          method: 'POST',
          body: formData,
          headers: {
            // Không cần set Content-Type khi sử dụng FormData
          },
          showLoading: true,
          showError: true
        });
        */

        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Dữ liệu mẫu cho giao dịch sau khi tải lên biên lai
        const updatedTransaction: DepositTransaction = {
          id: transactionId,
          date: new Date().toISOString(),
          amount: 300000, // Giả sử đây là số tiền của giao dịch
          method: "Chuyển khoản ngân hàng",
          status: "pending", // Chuyển sang trạng thái đang xử lý sau khi tải lên biên lai
        };

        return updatedTransaction;
      } catch (error) {
        console.error("Error uploading receipt:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Sao chép nội dung vào clipboard
  const copyToClipboard = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        console.error("Error copying to clipboard:", error);
        return false;
      }
    },
    []
  );

  return {
    getAccountInfo,
    getDepositHistory,
    getTransactionDetail,
    createDeposit,
    downloadReceipt,
    uploadReceipt,
    copyToClipboard,
  };
};

export default useDepositService;
