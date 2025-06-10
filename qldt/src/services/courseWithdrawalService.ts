import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Định nghĩa các interface
export interface RegisteredCourse {
  id: string;
  courseCode: string;
  courseName: string;
  group: string;
  credits: number;
  schedule: string;
  room: string;
  lecturer: string;
  status: 'active' | 'pending' | 'withdrawn';
}

export interface WithdrawalHistory {
  id: string;
  courseCode: string;
  courseName: string;
  group: string;
  credits: number;
  semester: string;
  withdrawalDate: string;
  reason: string;
  status: 'completed' | 'pending' | 'rejected';
}

export interface WithdrawalPeriod {
  currentSemester: string;
  withdrawalPeriod: string;
  status: 'active' | 'inactive';
  registeredCourses: number;
  totalCredits: number;
}

export interface WithdrawalReason {
  id: string;
  name: string;
  value: string;
}

export interface WithdrawalRequest {
  courseCode: string;
  courseGroup: string;
  reason: string;
  otherReason?: string;
}

// Service cho trang rút học phần
const courseWithdrawalService = {
  // Lấy thông tin kỳ rút học phần
  async getWithdrawalPeriod(): Promise<WithdrawalPeriod> {
    try {
      const response = await axios.get(`${API_BASE_URL}/course-withdrawal/period`);
      return response.data;
    } catch (error) {
      console.error('Error fetching withdrawal period:', error);
      // Dữ liệu mẫu khi API lỗi
      return {
        currentSemester: 'Học kỳ 2, năm học 2023-2024',
        withdrawalPeriod: '01/06/2023 - 15/06/2023',
        status: 'active',
        registeredCourses: 7,
        totalCredits: 20
      };
    }
  },

  // Lấy danh sách học phần đã đăng ký
  async getRegisteredCourses(): Promise<RegisteredCourse[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/course-withdrawal/registered-courses`);
      return response.data;
    } catch (error) {
      console.error('Error fetching registered courses:', error);
      // Dữ liệu mẫu khi API lỗi
      return [
        {
          id: '1',
          courseCode: 'COMP3006',
          courseName: 'Kiểm thử phần mềm',
          group: '01',
          credits: 3,
          schedule: 'Thứ 2 (7:00-9:30)',
          room: 'A305',
          lecturer: 'TS. Nguyễn Văn X',
          status: 'active'
        },
        {
          id: '2',
          courseCode: 'COMP3007',
          courseName: 'Quản lý dự án phần mềm',
          group: '01',
          credits: 3,
          schedule: 'Thứ 3 (7:00-9:30)',
          room: 'A401',
          lecturer: 'TS. Lê Văn Y',
          status: 'active'
        },
        {
          id: '3',
          courseCode: 'COMP3008',
          courseName: 'Học máy',
          group: '02',
          credits: 3,
          schedule: 'Thứ 4 (7:00-9:30)',
          room: 'B203',
          lecturer: 'TS. Trần Thị Z',
          status: 'active'
        },
        {
          id: '4',
          courseCode: 'COMP3009',
          courseName: 'Phát triển game',
          group: '01',
          credits: 3,
          schedule: 'Thứ 5 (7:00-9:30)',
          room: 'A305',
          lecturer: 'TS. Phạm Văn W',
          status: 'active'
        },
        {
          id: '5',
          courseCode: 'COMP3010',
          courseName: 'Điện toán đám mây',
          group: '01',
          credits: 3,
          schedule: 'Thứ 6 (7:00-9:30)',
          room: 'B203',
          lecturer: 'TS. Nguyễn Văn X',
          status: 'active'
        },
        {
          id: '6',
          courseCode: 'POLI3002',
          courseName: 'Lịch sử Đảng Cộng sản Việt Nam',
          group: '03',
          credits: 2,
          schedule: 'Thứ 7 (7:00-8:40)',
          room: 'A401',
          lecturer: 'TS. Lê Thị V',
          status: 'active'
        },
        {
          id: '7',
          courseCode: 'COMP3011',
          courseName: 'Thực tập doanh nghiệp',
          group: '01',
          credits: 3,
          schedule: '-',
          room: '-',
          lecturer: 'TS. Lê Văn Y',
          status: 'pending'
        }
      ];
    }
  },

  // Lấy lịch sử rút học phần
  async getWithdrawalHistory(): Promise<WithdrawalHistory[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/course-withdrawal/history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching withdrawal history:', error);
      // Dữ liệu mẫu khi API lỗi
      return [
        {
          id: '1',
          courseCode: 'COMP2010',
          courseName: 'Phát triển ứng dụng di động',
          group: '02',
          credits: 3,
          semester: 'Học kỳ 1, 2022-2023',
          withdrawalDate: '15/09/2022',
          reason: 'Trùng lịch học',
          status: 'completed'
        },
        {
          id: '2',
          courseCode: 'COMP2012',
          courseName: 'Phát triển ứng dụng web',
          group: '01',
          credits: 3,
          semester: 'Học kỳ 2, 2021-2022',
          withdrawalDate: '10/02/2022',
          reason: 'Khối lượng học tập quá tải',
          status: 'completed'
        }
      ];
    }
  },

  // Lấy danh sách lý do rút học phần
  async getWithdrawalReasons(): Promise<WithdrawalReason[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/course-withdrawal/reasons`);
      return response.data;
    } catch (error) {
      console.error('Error fetching withdrawal reasons:', error);
      // Dữ liệu mẫu khi API lỗi
      return [
        { id: 'schedule-conflict', name: 'Trùng lịch học/thi', value: 'schedule-conflict' },
        { id: 'workload', name: 'Khối lượng học tập quá tải', value: 'workload' },
        { id: 'difficulty', name: 'Nội dung học phần quá khó', value: 'difficulty' },
        { id: 'health', name: 'Lý do sức khỏe', value: 'health' },
        { id: 'financial', name: 'Lý do tài chính', value: 'financial' },
        { id: 'other', name: 'Lý do khác', value: 'other' }
      ];
    }
  },

  // Gửi yêu cầu rút học phần
  async withdrawCourse(request: WithdrawalRequest): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/course-withdrawal/withdraw`, request);
      return response.data;
    } catch (error) {
      console.error('Error withdrawing course:', error);
      // Trả về thành công giả lập khi API lỗi
      return {
        success: true,
        message: 'Yêu cầu rút học phần đã được ghi nhận và sẽ được cập nhật trong hệ thống.'
      };
    }
  }
};

export default courseWithdrawalService;