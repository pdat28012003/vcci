import useApiService from "../hooks/useApiService";
import { useCallback } from "react";

// Interface cho thông tin học phí
export interface TuitionItem {
  id: string;
  semester: string;
  academicYear: string;
  semesterCode: string; // Mã học kỳ (ví dụ: 2023-2024-1)
  description: string;
  amount: number;
  paid: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  registeredCredits: number;
}

// Interface cho chi tiết học phí theo môn học
export interface CourseItem {
  id: string;
  code: string;
  name: string;
  credits: number;
  pricePerCredit: number;
  totalPrice: number;
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

// Interface cho thống kê học phí
export interface TuitionSummary {
  totalTuition: number;
  totalPaid: number;
  totalDebt: number;
  totalExcess: number;
}

// Hook để quản lý các API liên quan đến học phí
export const useTuitionService = () => {
  const { fetchApi } = useApiService();

  // Lấy thống kê học phí
  const getTuitionSummary = useCallback(async (): Promise<TuitionSummary> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<TuitionSummary>('/api/tuition/summary');

      // Giả lập độ trễ của API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Dữ liệu mẫu cho thống kê học phí
      const summaryData: TuitionSummary = {
        totalTuition: 15000000,
        totalPaid: 15000000,
        totalDebt: 0,
        totalExcess: 0,
      };

      return summaryData;
    } catch (error) {
      console.error("Error fetching tuition summary:", error);
      throw error;
    }
  }, [fetchApi]);

  // Lấy danh sách học phí theo học kỳ
  const getTuitionItems = useCallback(async (): Promise<TuitionItem[]> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<TuitionItem[]>('/api/tuition/items');

      // Giả lập độ trễ của API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Dữ liệu mẫu cho danh sách học phí
      const tuitionItems: TuitionItem[] = [
        {
          id: "tuition1",
          semester: "Học kỳ 1",
          academicYear: "2020-2021",
          semesterCode: "2020-2021-1",
          description: "Học phí học kỳ 1",
          amount: 8500000,
          paid: 8500000,
          dueDate: "2020-09-15",
          status: "paid",
          registeredCredits: 20,
        },
        {
          id: "tuition2",
          semester: "Học kỳ 2",
          academicYear: "2020-2021",
          semesterCode: "2020-2021-2",
          description: "Học phí học kỳ 2",
          amount: 8500000,
          paid: 8500000,
          dueDate: "2021-01-15",
          status: "paid",
          registeredCredits: 20,
        },
        {
          id: "tuition3",
          semester: "Học kỳ 1",
          academicYear: "2021-2022",
          semesterCode: "2021-2022-1",
          description: "Học phí học kỳ 1",
          amount: 9000000,
          paid: 9000000,
          dueDate: "2021-09-15",
          status: "paid",
          registeredCredits: 21,
        },
        {
          id: "tuition4",
          semester: "Học kỳ 2",
          academicYear: "2021-2022",
          semesterCode: "2021-2022-2",
          description: "Học phí học kỳ 2",
          amount: 9000000,
          paid: 9000000,
          dueDate: "2022-01-15",
          status: "paid",
          registeredCredits: 21,
        },
        {
          id: "tuition5",
          semester: "Học kỳ 1",
          academicYear: "2022-2023",
          semesterCode: "2022-2023-1",
          description: "Học phí học kỳ 1",
          amount: 9500000,
          paid: 9500000,
          dueDate: "2022-09-15",
          status: "paid",
          registeredCredits: 22,
        },
        {
          id: "tuition6",
          semester: "Học kỳ 2",
          academicYear: "2022-2023",
          semesterCode: "2022-2023-2",
          description: "Học phí học kỳ 2",
          amount: 9500000,
          paid: 9500000,
          dueDate: "2023-01-15",
          status: "paid",
          registeredCredits: 22,
        },
        {
          id: "tuition7",
          semester: "Học kỳ 1",
          academicYear: "2023-2024",
          semesterCode: "2023-2024-1",
          description: "Học phí học kỳ 1",
          amount: 10000000,
          paid: 10000000,
          dueDate: "2023-09-15",
          status: "paid",
          registeredCredits: 23,
        },
        {
          id: "tuition8",
          semester: "Học kỳ 2",
          academicYear: "2023-2024",
          semesterCode: "2023-2024-2",
          description: "Học phí học kỳ 2",
          amount: 15000000,
          paid: 15000000,
          dueDate: "2024-01-15",
          status: "paid",
          registeredCredits: 24,
        },
      ];

      return tuitionItems;
    } catch (error) {
      console.error("Error fetching tuition items:", error);
      throw error;
    }
  }, [fetchApi]);

  // Lấy chi tiết học phí theo học kỳ
  const getTuitionDetail = useCallback(
    async (semesterCode: string): Promise<{
      tuitionItem: TuitionItem;
      courses: CourseItem[];
    }> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<{tuitionItem: TuitionItem, courses: CourseItem[]}>(`/api/tuition/detail/${semesterCode}`);

        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Lấy danh sách học phí
        const tuitionItems = await getTuitionItems();
        
        // Tìm học phí theo học kỳ
        const tuitionItem = tuitionItems.find(
          (item) => item.semesterCode === semesterCode
        );

        if (!tuitionItem) {
          throw new Error("Không tìm thấy thông tin học phí cho học kỳ này");
        }

        // Dữ liệu mẫu cho chi tiết học phí theo môn học
        let courses: CourseItem[] = [];

        // Tạo dữ liệu mẫu khác nhau cho mỗi học kỳ
        if (semesterCode === "2023-2024-2") {
          courses = [
            {
              id: "course1",
              code: "LTWNC01",
              name: "Lập trình Web nâng cao",
              credits: 3,
              pricePerCredit: 625000,
              totalPrice: 1875000,
            },
            {
              id: "course2",
              code: "TTNT02",
              name: "Trí tuệ nhân tạo",
              credits: 3,
              pricePerCredit: 625000,
              totalPrice: 1875000,
            },
            {
              id: "course3",
              code: "PTTKHT01",
              name: "Phân tích và thiết kế hệ thống",
              credits: 4,
              pricePerCredit: 625000,
              totalPrice: 2500000,
            },
            {
              id: "course4",
              code: "JAVA03",
              name: "Lập trình Java",
              credits: 3,
              pricePerCredit: 625000,
              totalPrice: 1875000,
            },
            {
              id: "course5",
              code: "CSDL02",
              name: "Cơ sở dữ liệu",
              credits: 4,
              pricePerCredit: 625000,
              totalPrice: 2500000,
            },
            {
              id: "course6",
              code: "MMT01",
              name: "Mạng máy tính",
              credits: 3,
              pricePerCredit: 625000,
              totalPrice: 1875000,
            },
            {
              id: "course7",
              code: "KTPM02",
              name: "Kiểm thử phần mềm",
              credits: 2,
              pricePerCredit: 625000,
              totalPrice: 1250000,
            },
            {
              id: "course8",
              code: "ATTT01",
              name: "An toàn thông tin",
              credits: 2,
              pricePerCredit: 625000,
              totalPrice: 1250000,
            },
          ];
        } else if (semesterCode === "2023-2024-1") {
          courses = [
            {
              id: "course1",
              code: "CNPM01",
              name: "Công nghệ phần mềm",
              credits: 4,
              pricePerCredit: 625000,
              totalPrice: 2500000,
            },
            {
              id: "course2",
              code: "KTMT01",
              name: "Kiến trúc máy tính",
              credits: 3,
              pricePerCredit: 625000,
              totalPrice: 1875000,
            },
            {
              id: "course3",
              code: "HDH01",
              name: "Hệ điều hành",
              credits: 4,
              pricePerCredit: 625000,
              totalPrice: 2500000,
            },
            {
              id: "course4",
              code: "CTDL01",
              name: "Cấu trúc dữ liệu và giải thuật",
              credits: 4,
              pricePerCredit: 625000,
              totalPrice: 2500000,
            },
            {
              id: "course5",
              code: "LTHDT01",
              name: "Lập trình hướng đối tượng",
              credits: 4,
              pricePerCredit: 625000,
              totalPrice: 2500000,
            },
            {
              id: "course6",
              code: "TTHCM01",
              name: "Tư tưởng Hồ Chí Minh",
              credits: 2,
              pricePerCredit: 625000,
              totalPrice: 1250000,
            },
            {
              id: "course7",
              code: "TACN01",
              name: "Tiếng Anh chuyên ngành",
              credits: 2,
              pricePerCredit: 625000,
              totalPrice: 1250000,
            },
          ];
        } else {
          // Tạo dữ liệu mẫu cho các học kỳ khác
          courses = [
            {
              id: "course1",
              code: "MON01",
              name: "Môn học 1",
              credits: 3,
              pricePerCredit: 625000,
              totalPrice: 1875000,
            },
            {
              id: "course2",
              code: "MON02",
              name: "Môn học 2",
              credits: 3,
              pricePerCredit: 625000,
              totalPrice: 1875000,
            },
            {
              id: "course3",
              code: "MON03",
              name: "Môn học 3",
              credits: 4,
              pricePerCredit: 625000,
              totalPrice: 2500000,
            },
            {
              id: "course4",
              code: "MON04",
              name: "Môn học 4",
              credits: 3,
              pricePerCredit: 625000,
              totalPrice: 1875000,
            },
            {
              id: "course5",
              code: "MON05",
              name: "Môn học 5",
              credits: 4,
              pricePerCredit: 625000,
              totalPrice: 2500000,
            },
          ];
        }

        return {
          tuitionItem,
          courses,
        };
      } catch (error) {
        console.error("Error fetching tuition detail:", error);
        throw error;
      }
    },
    [fetchApi, getTuitionItems]
  );

  // Lấy lịch sử thanh toán
  const getPaymentHistory = useCallback(
    async (semesterCode?: string): Promise<PaymentHistory[]> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        // return await fetchApi<PaymentHistory[]>(`/api/tuition/payments${semesterCode ? `?semester=${semesterCode}` : ''}`);

        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Dữ liệu mẫu cho lịch sử thanh toán
        const paymentHistoryData: PaymentHistory[] = [
          {
            id: "payment1",
            date: "2024-02-10",
            amount: 15000000,
            method: "Chuyển khoản ngân hàng",
            transactionId: "VNPAY123456789",
            status: "completed",
          },
        ];

        // Nếu có mã học kỳ, lọc theo học kỳ
        if (semesterCode) {
          return paymentHistoryData.filter((payment) => {
            // Trong thực tế, cần kiểm tra xem payment có thuộc về học kỳ này không
            // Ở đây chỉ là ví dụ
            if (semesterCode === "2023-2024-2") {
              return true;
            }
            return false;
          });
        }

        return paymentHistoryData;
      } catch (error) {
        console.error("Error fetching payment history:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Thanh toán học phí
  const payTuition = useCallback(
    async (
      tuitionId: string,
      amount: number,
      method: string
    ): Promise<PaymentHistory> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        /*
        return await fetchApi<PaymentHistory>('/api/tuition/pay', {
          method: 'POST',
          body: { tuitionId, amount, method },
          showLoading: true,
          showError: true
        });
        */

        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Dữ liệu mẫu cho thanh toán học phí
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
        console.error("Error paying tuition:", error);
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
        return await fetchApi<{ url: string }>(`/api/tuition/receipt/${paymentId}`, {
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
    getTuitionSummary,
    getTuitionItems,
    getTuitionDetail,
    getPaymentHistory,
    payTuition,
    downloadReceipt,
  };
};

export default useTuitionService;