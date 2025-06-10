import useApiService from "../hooks/useApiService";
import { useCallback } from "react";

// Interface cho thông tin khoản thu khác
export interface OtherFeeItem {
  id: string;
  code: string;
  name: string;
  semester: string;
  academicYear: string;
  semesterCode: string; // Mã học kỳ (ví dụ: 2023-2024-1)
  amount: number;
  paid: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
}

// Interface cho lịch sử thanh toán
export interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  method: string;
  transactionId: string;
  status: "completed" | "pending" | "failed";
}

// Interface cho thống kê các khoản thu khác
export interface OtherFeesSummary {
  totalFees: number;
  totalPaid: number;
  totalDebt: number;
  totalExcess: number;
}

// Hook để quản lý các API liên quan đến các khoản thu khác
export const useOtherFeesService = () => {
  const { fetchApi } = useApiService();

  // Lấy thống kê các khoản thu khác
  const getOtherFeesSummary = useCallback(async (): Promise<OtherFeesSummary> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<OtherFeesSummary>('/api/other-fees/summary');

      // Giả lập độ trễ của API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Dữ liệu mẫu cho thống kê các khoản thu khác
      const summaryData: OtherFeesSummary = {
        totalFees: 3450000,
        totalPaid: 3450000,
        totalDebt: 0,
        totalExcess: 0,
      };

      return summaryData;
    } catch (error) {
      console.error("Error fetching other fees summary:", error);
      throw error;
    }
  }, [fetchApi]);

  // Lấy danh sách các khoản thu khác
  const getOtherFeeItems = useCallback(async (): Promise<OtherFeeItem[]> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<OtherFeeItem[]>('/api/other-fees/items');

      // Giả lập độ trễ của API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Dữ liệu mẫu cho danh sách các khoản thu khác
      const otherFeeItems: OtherFeeItem[] = [
        {
          id: "fee1",
          code: "BHYT2023",
          name: "Bảo hiểm y tế",
          semester: "",
          academicYear: "2023-2024",
          semesterCode: "2023-2024",
          amount: 600000,
          paid: 600000,
          dueDate: "2023-09-15",
          status: "paid",
        },
        {
          id: "fee2",
          code: "KTX2023",
          name: "Phí ký túc xá",
          semester: "Học kỳ 1",
          academicYear: "2023-2024",
          semesterCode: "2023-2024-1",
          amount: 1200000,
          paid: 1200000,
          dueDate: "2023-09-15",
          status: "paid",
        },
        {
          id: "fee3",
          code: "TSV2023",
          name: "Thẻ sinh viên",
          semester: "",
          academicYear: "2023-2024",
          semesterCode: "2023-2024",
          amount: 50000,
          paid: 50000,
          dueDate: "2023-09-30",
          status: "paid",
        },
        {
          id: "fee4",
          code: "HDNK2023",
          name: "Hoạt động ngoại khóa",
          semester: "Học kỳ 1",
          academicYear: "2023-2024",
          semesterCode: "2023-2024-1",
          amount: 200000,
          paid: 200000,
          dueDate: "2023-10-15",
          status: "paid",
        },
        {
          id: "fee5",
          code: "KTX2024",
          name: "Phí ký túc xá",
          semester: "Học kỳ 2",
          academicYear: "2023-2024",
          semesterCode: "2023-2024-2",
          amount: 1200000,
          paid: 1200000,
          dueDate: "2024-02-15",
          status: "paid",
        },
        {
          id: "fee6",
          code: "HDNK2024",
          name: "Hoạt động ngoại khóa",
          semester: "Học kỳ 2",
          academicYear: "2023-2024",
          semesterCode: "2023-2024-2",
          amount: 200000,
          paid: 200000,
          dueDate: "2024-03-15",
          status: "paid",
        },
      ];

      return otherFeeItems;
    } catch (error) {
      console.error("Error fetching other fee items:", error);
      throw error;
    }
  }, [fetchApi]);

  // Lấy chi tiết khoản thu
  const getOtherFeeDetail = useCallback(
    async (feeId: string): Promise<OtherFeeItem> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<OtherFeeItem>(`/api/other-fees/detail/${feeId}`);

        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Lấy danh sách các khoản thu khác
        const otherFeeItems = await getOtherFeeItems();
        
        // Tìm khoản thu theo ID
        const feeItem = otherFeeItems.find((item) => item.id === feeId);

        if (!feeItem) {
          throw new Error("Không tìm thấy thông tin khoản thu này");
        }

        return feeItem;
      } catch (error) {
        console.error("Error fetching other fee detail:", error);
        throw error;
      }
    },
    [fetchApi, getOtherFeeItems]
  );

  // Lấy lịch sử thanh toán
  const getPaymentHistory = useCallback(
    async (feeId?: string): Promise<PaymentHistory[]> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<PaymentHistory[]>(`/api/other-fees/payments${feeId ? `?feeId=${feeId}` : ''}`);

        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Dữ liệu mẫu cho lịch sử thanh toán
        const paymentHistoryData: PaymentHistory[] = [
          {
            id: "payment1",
            date: "2023-09-10",
            amount: 600000,
            method: "Chuyển khoản ngân hàng",
            transactionId: "VNPAY123456789",
            status: "completed",
          },
          {
            id: "payment2",
            date: "2023-09-10",
            amount: 1200000,
            method: "Chuyển khoản ngân hàng",
            transactionId: "VNPAY123456790",
            status: "completed",
          },
          {
            id: "payment3",
            date: "2023-09-15",
            amount: 50000,
            method: "Ví điện tử MoMo",
            transactionId: "MOMO123456789",
            status: "completed",
          },
          {
            id: "payment4",
            date: "2023-10-05",
            amount: 200000,
            method: "Thẻ tín dụng",
            transactionId: "CARD123456789",
            status: "completed",
          },
          {
            id: "payment5",
            date: "2024-02-10",
            amount: 1200000,
            method: "Chuyển khoản ngân hàng",
            transactionId: "VNPAY123456791",
            status: "completed",
          },
          {
            id: "payment6",
            date: "2024-03-05",
            amount: 200000,
            method: "Ví điện tử ZaloPay",
            transactionId: "ZALO123456789",
            status: "completed",
          },
        ];

        // Nếu có mã khoản thu, lọc theo khoản thu
        if (feeId) {
          // Trong thực tế, cần kiểm tra xem payment có thuộc về khoản thu này không
          // Ở đây chỉ là ví dụ
          if (feeId === "fee1") {
            return paymentHistoryData.filter(payment => payment.id === "payment1");
          } else if (feeId === "fee2") {
            return paymentHistoryData.filter(payment => payment.id === "payment2");
          } else if (feeId === "fee3") {
            return paymentHistoryData.filter(payment => payment.id === "payment3");
          } else if (feeId === "fee4") {
            return paymentHistoryData.filter(payment => payment.id === "payment4");
          } else if (feeId === "fee5") {
            return paymentHistoryData.filter(payment => payment.id === "payment5");
          } else if (feeId === "fee6") {
            return paymentHistoryData.filter(payment => payment.id === "payment6");
          }
        }

        return paymentHistoryData;
      } catch (error) {
        console.error("Error fetching payment history:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Thanh toán khoản thu
  const payOtherFee = useCallback(
    async (
      feeId: string,
      amount: number,
      method: string
    ): Promise<PaymentHistory> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        /*
        return await fetchApi<PaymentHistory>('/api/other-fees/pay', {
          method: 'POST',
          body: { feeId, amount, method },
          showLoading: true,
          showError: true
        });
        */

        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Dữ liệu mẫu cho thanh toán khoản thu
        const paymentData: PaymentHistory = {
          id: `payment-${Date.now()}`,
          date: new Date().toISOString(),
          amount,
          method,
          transactionId: `${method.toUpperCase()}${Date.now()}`,
          status: "completed",
        };

        return paymentData;
      } catch (error) {
        console.error("Error paying other fee:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Tải biên lai
  const downloadReceipt = useCallback(
    async (paymentId: string): Promise<{ url: string }> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        /*
        return await fetchApi<{ url: string }>(`/api/other-fees/receipt/${paymentId}`, {
          showLoading: true,
          showError: true
        });
        */

        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Dữ liệu mẫu cho URL biên lai
        return {
          url: `/receipts/${paymentId}.pdf`,
        };
      } catch (error) {
        console.error("Error downloading receipt:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  return {
    getOtherFeesSummary,
    getOtherFeeItems,
    getOtherFeeDetail,
    getPaymentHistory,
    payOtherFee,
    downloadReceipt,
  };
};

export default useOtherFeesService;