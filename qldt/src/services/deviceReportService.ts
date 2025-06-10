import useApiService from "../hooks/useApiService";
import { useCallback } from "react";

// Interface cho form báo hỏng
export interface DeviceReport {
  id?: number;
  location: string;
  room: string;
  deviceType: string;
  description: string;
  priority: "normal" | "urgent" | "very-urgent";
  contact?: string;
  images?: File[];
  date?: string;
  status?: "processing" | "completed";
}

// Interface cho lịch sử báo hỏng
export interface ReportHistoryItem {
  id: number;
  date: string;
  location: string;
  deviceType: string;
  status: "processing" | "completed";
  details?: DeviceReport;
}

// Hook để quản lý các API liên quan đến báo hỏng thiết bị
export const useDeviceReportService = () => {
  const { fetchApi } = useApiService();

  // Gửi báo cáo hỏng thiết bị
  const submitReport = useCallback(
    async (reportData: DeviceReport): Promise<DeviceReport> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        /*
        // Nếu có file ảnh, cần sử dụng FormData để gửi
        if (reportData.images && reportData.images.length > 0) {
          const formData = new FormData();
          
          // Thêm các trường dữ liệu vào formData
          Object.keys(reportData).forEach(key => {
            if (key !== 'images') {
              formData.append(key, reportData[key as keyof DeviceReport] as string);
            }
          });
          
          // Thêm các file ảnh vào formData
          reportData.images.forEach((file, index) => {
            formData.append(`image_${index}`, file);
          });
          
          return await fetchApi<DeviceReport>('/api/device-reports', {
            method: 'POST',
            body: formData,
            headers: {
              // Không cần set Content-Type khi sử dụng FormData, browser sẽ tự set
            },
            showLoading: true,
            showError: true
          });
        } else {
          return await fetchApi<DeviceReport>('/api/device-reports', {
            method: 'POST',
            body: reportData,
            showLoading: true,
            showError: true
          });
        }
        */

        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Dữ liệu mẫu cho báo cáo đã gửi
        const submittedReport: DeviceReport = {
          ...reportData,
          id: Math.floor(Math.random() * 1000) + 1,
          date: new Date().toLocaleDateString("vi-VN"),
          status: "processing",
        };

        return submittedReport;
      } catch (error) {
        console.error("Error submitting device report:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Lấy lịch sử báo cáo hỏng thiết bị
  const getReportHistory = useCallback(
    async (
      page: number = 1,
      limit: number = 10
    ): Promise<{
      data: ReportHistoryItem[];
      total: number;
      page: number;
      totalPages: number;
    }> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        /*
        return await fetchApi<{
          data: ReportHistoryItem[];
          total: number;
          page: number;
          totalPages: number;
        }>(`/api/device-reports?page=${page}&limit=${limit}`, {
          showLoading: true
        });
        */

        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Dữ liệu mẫu cho lịch sử báo cáo
        const mockData: ReportHistoryItem[] = [
          {
            id: 1,
            date: "15/05/2024",
            location: "Phòng A305",
            deviceType: "Máy chiếu",
            status: "processing",
            details: {
              id: 1,
              location: "phong-hoc",
              room: "A305",
              deviceType: "may-chieu",
              description:
                "Máy chiếu không hiển thị hình ảnh, đèn báo nguồn vẫn sáng nhưng không có tín hiệu ra màn hình.",
              priority: "urgent",
              contact: "0987654321",
              date: "15/05/2024",
              status: "processing",
            },
          },
          {
            id: 2,
            date: "10/05/2024",
            location: "Lab CNTT1",
            deviceType: "Máy tính",
            status: "completed",
            details: {
              id: 2,
              location: "phong-lab",
              room: "Lab CNTT1",
              deviceType: "may-tinh",
              description:
                "Máy tính số 15 không khởi động được, màn hình hiển thị lỗi 'No bootable device'.",
              priority: "normal",
              contact: "0987654321",
              date: "10/05/2024",
              status: "completed",
            },
          },
          {
            id: 3,
            date: "05/05/2024",
            location: "Thư viện tầng 2",
            deviceType: "Điều hòa",
            status: "completed",
            details: {
              id: 3,
              location: "thu-vien",
              room: "Thư viện tầng 2",
              deviceType: "dieu-hoa",
              description:
                "Điều hòa phát ra tiếng ồn lớn khi hoạt động và không làm mát hiệu quả.",
              priority: "normal",
              contact: "0987654321",
              date: "05/05/2024",
              status: "completed",
            },
          },
          {
            id: 4,
            date: "01/05/2024",
            location: "KTX B, phòng 205",
            deviceType: "Hệ thống nước",
            status: "completed",
            details: {
              id: 4,
              location: "ktx",
              room: "KTX B, phòng 205",
              deviceType: "nuoc",
              description:
                "Vòi nước trong phòng tắm bị rò rỉ, nước chảy liên tục không thể khóa.",
              priority: "urgent",
              contact: "0987654321",
              date: "01/05/2024",
              status: "completed",
            },
          },
        ];

        // Phân trang dữ liệu mẫu
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = mockData.slice(startIndex, endIndex);
        const total = mockData.length;
        const totalPages = Math.ceil(total / limit);

        return {
          data: paginatedData,
          total,
          page,
          totalPages,
        };
      } catch (error) {
        console.error("Error fetching device report history:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Lấy chi tiết báo cáo hỏng thiết bị
  const getReportDetail = useCallback(
    async (id: number): Promise<DeviceReport> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        /*
        return await fetchApi<DeviceReport>(`/api/device-reports/${id}`, {
          showLoading: true,
          showError: true
        });
        */

        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Dữ liệu mẫu cho chi tiết báo cáo
        const mockDetails: DeviceReport[] = [
          {
            id: 1,
            location: "phong-hoc",
            room: "A305",
            deviceType: "may-chieu",
            description:
              "Máy chiếu không hiển thị hình ảnh, đèn báo nguồn vẫn sáng nhưng không có tín hiệu ra màn hình.",
            priority: "urgent",
            contact: "0987654321",
            date: "15/05/2024",
            status: "processing",
          },
          {
            id: 2,
            location: "phong-lab",
            room: "Lab CNTT1",
            deviceType: "may-tinh",
            description:
              "Máy tính số 15 không khởi động được, màn hình hiển thị lỗi 'No bootable device'.",
            priority: "normal",
            contact: "0987654321",
            date: "10/05/2024",
            status: "completed",
          },
          {
            id: 3,
            location: "thu-vien",
            room: "Thư viện tầng 2",
            deviceType: "dieu-hoa",
            description:
              "Điều hòa phát ra tiếng ồn lớn khi hoạt động và không làm mát hiệu quả.",
            priority: "normal",
            contact: "0987654321",
            date: "05/05/2024",
            status: "completed",
          },
          {
            id: 4,
            location: "ktx",
            room: "KTX B, phòng 205",
            deviceType: "nuoc",
            description:
              "Vòi nước trong phòng tắm bị rò rỉ, nước chảy liên tục không thể khóa.",
            priority: "urgent",
            contact: "0987654321",
            date: "01/05/2024",
            status: "completed",
          },
        ];

        const report = mockDetails.find((item) => item.id === id);
        if (!report) {
          throw new Error("Không tìm thấy báo cáo");
        }

        return report;
      } catch (error) {
        console.error(
          `Error fetching device report detail for ID ${id}:`,
          error
        );
        throw error;
      }
    },
    [fetchApi]
  );

  return {
    submitReport,
    getReportHistory,
    getReportDetail,
  };
};

export default useDeviceReportService;
