import useApiService from "../hooks/useApiService";
import { useCallback } from "react";

// Interface cho dữ liệu dịch vụ
export interface Service {
  id: string;
  name: string;
  icon: string;
  category: string;
}

// Interface cho thống kê dịch vụ
export interface ServiceStat {
  label: string;
  value: number;
}

// Interface cho đăng ký dịch vụ
export interface ServiceRegistration {
  serviceId: string;
  userId: string;
  status: "pending" | "completed" | "rejected" | "additional_info_required";
  createdAt: string;
  updatedAt: string;
}

// Hook để quản lý các API liên quan đến dịch vụ một cửa
export const useOneStopService = () => {
  const { fetchApi } = useApiService();

  // Lấy danh sách dịch vụ
  const getServices = useCallback(async (): Promise<Service[]> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<Service[]>('/api/services');

      // Giả lập độ trễ của API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Dữ liệu mẫu cho dịch vụ
      const servicesData: Service[] = [
        // Giấy tờ, xác nhận
        {
          id: "lam-the-sinh-vien",
          name: "Làm lại thẻ sinh viên",
          icon: "fa-id-card",
          category: "giay-to",
        },
        {
          id: "giay-xac-nhan-sv",
          name: "Xin giấy xác nhận sinh viên",
          icon: "fa-file",
          category: "giay-to",
        },
        {
          id: "xac-nhan-lich-hoc",
          name: "Xác nhận lịch học",
          icon: "fa-calendar-check",
          category: "giay-to",
        },
        {
          id: "giay-hoan-thanh-chuong-trinh",
          name: "Xin cấp giấy hoàn thành chương trình học",
          icon: "fa-check-square",
          category: "giay-to",
        },
        {
          id: "giay-chung-nhan-tot-nghiep",
          name: "Xin cấp giấy chứng nhận tốt nghiệp tạm thời",
          icon: "fa-graduation-cap",
          category: "giay-to",
        },
        {
          id: "ban-sao-van-bang",
          name: "Cấp bản sao văn bằng chứng chỉ",
          icon: "fa-copy",
          category: "giay-to",
        },
        {
          id: "bang-diem-qua-trinh",
          name: "Cấp bảng điểm quá trình",
          icon: "fa-list-alt",
          category: "giay-to",
        },

        // Chứng chỉ
        {
          id: "chung-chi-tin-hoc",
          name: "Xin cấp chứng chỉ Tin học",
          icon: "fa-desktop",
          category: "chung-chi",
        },
        {
          id: "chung-chi-ngoai-ngu",
          name: "Xin cấp chứng chỉ Ngoại ngữ",
          icon: "fa-language",
          category: "chung-chi",
        },
        {
          id: "chung-chi-ky-nang-mem",
          name: "Xin cấp chứng chỉ Kỹ năng mềm",
          icon: "fa-users",
          category: "chung-chi",
        },
        {
          id: "chung-chi-gdqp",
          name: "Xin cấp chứng chỉ Giáo dục Quốc phòng",
          icon: "fa-shield-alt",
          category: "chung-chi",
        },
        {
          id: "chung-chi-du-lich",
          name: "Xin cấp chứng chỉ nghiệp vụ Du lịch",
          icon: "fa-plane",
          category: "chung-chi",
        },

        // Học phí, miễn giảm
        {
          id: "xac-nhan-vay-von",
          name: "Xác nhận vay vốn",
          icon: "fa-university",
          category: "hoc-phi",
        },
        {
          id: "cap-bu-mien-giam-hoc-phi",
          name: "Xác nhận cấp bù tiền miễn giảm học phí",
          icon: "fa-dollar-sign",
          category: "hoc-phi",
        },
        {
          id: "so-uu-dai-giao-duc",
          name: "Xác nhận sổ ưu đãi trong giáo dục",
          icon: "fa-book",
          category: "hoc-phi",
        },

        // Dịch vụ khác
        {
          id: "phuc-khao-diem",
          name: "Phúc khảo điểm thi kết thúc học phần",
          icon: "fa-search",
          category: "khac",
        },
        {
          id: "dang-ky-hoc-lai",
          name: "Đăng ký học lại (đối với sinh viên liên thông)",
          icon: "fa-sync",
          category: "khac",
        },
        {
          id: "kiem-tra-tieng-anh",
          name: "Kiểm tra năng lực tiếng Anh",
          icon: "fa-language",
          category: "khac",
        },
      ];

      return servicesData;
    } catch (error) {
      console.error("Error fetching services:", error);
      throw error;
    }
  }, [fetchApi]);

  // Lấy thống kê dịch vụ
  const getServiceStats = useCallback(async (): Promise<ServiceStat[]> => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<ServiceStat[]>('/api/services/stats');

      // Giả lập độ trễ của API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Dữ liệu mẫu cho thống kê
      const statsData: ServiceStat[] = [
        { label: "Đang xử lý", value: 2 },
        { label: "Đã hoàn thành", value: 5 },
        { label: "Cần bổ sung", value: 1 },
        { label: "Tổng số", value: 8 },
      ];

      return statsData;
    } catch (error) {
      console.error("Error fetching service stats:", error);
      throw error;
    }
  }, [fetchApi]);

  // Đăng ký dịch vụ
  const registerService = useCallback(
    async (serviceId: string): Promise<ServiceRegistration> => {
      try {
        // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
        /*
      return await fetchApi<ServiceRegistration>('/api/services/register', {
        method: 'POST',
        body: { serviceId },
        showLoading: true,
        showError: true
      });
      */

        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Dữ liệu mẫu cho đăng ký dịch vụ
        const registrationData: ServiceRegistration = {
          serviceId,
          userId: "current-user-id",
          status: "pending",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return registrationData;
      } catch (error) {
        console.error("Error registering service:", error);
        throw error;
      }
    },
    [fetchApi]
  );

  // Lấy danh sách đăng ký dịch vụ của người dùng hiện tại
  const getUserServiceRegistrations = useCallback(async (): Promise<
    ServiceRegistration[]
  > => {
    try {
      // Trong môi trường thực tế, chúng ta sẽ gọi API thực sự
      // return await fetchApi<ServiceRegistration[]>('/api/services/registrations');

      // Giả lập độ trễ của API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Dữ liệu mẫu cho đăng ký dịch vụ của người dùng
      const registrationsData: ServiceRegistration[] = [
        {
          serviceId: "lam-the-sinh-vien",
          userId: "current-user-id",
          status: "pending",
          createdAt: "2024-05-15T08:30:00Z",
          updatedAt: "2024-05-15T08:30:00Z",
        },
        {
          serviceId: "giay-xac-nhan-sv",
          userId: "current-user-id",
          status: "completed",
          createdAt: "2024-05-10T10:15:00Z",
          updatedAt: "2024-05-12T14:20:00Z",
        },
        {
          serviceId: "chung-chi-ngoai-ngu",
          userId: "current-user-id",
          status: "additional_info_required",
          createdAt: "2024-05-08T09:45:00Z",
          updatedAt: "2024-05-09T11:30:00Z",
        },
      ];

      return registrationsData;
    } catch (error) {
      console.error("Error fetching user service registrations:", error);
      throw error;
    }
  }, [fetchApi]);

  return {
    getServices,
    getServiceStats,
    registerService,
    getUserServiceRegistrations,
  };
};

export default useOneStopService;
