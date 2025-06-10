/**
 * SERVICE.JS - Xử lý các tương tác với API
 */

// Đối tượng chứa các hàm gọi API
const ApiService = {
  // URL cơ sở cho API
  baseUrl: 'https://api.example.com',
  
  // Hàm gọi API chung
  async fetchApi(endpoint, options = {}) {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      // Thiết lập mặc định cho options
      const defaultOptions = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        }
      };
      
      const fetchOptions = { ...defaultOptions, ...options };
      
      // Hiển thị loading nếu cần
      if (options.showLoading) {
        this.showLoading();
      }
      
      const response = await fetch(url, fetchOptions);
      
      // Ẩn loading
      if (options.showLoading) {
        this.hideLoading();
      }
      
      // Kiểm tra response status
      if (!response.ok) {
        // Xử lý lỗi HTTP
        const errorData = await response.json();
        throw new Error(errorData.message || `Lỗi HTTP: ${response.status}`);
      }
      
      // Trả về dữ liệu JSON
      return await response.json();
    } catch (error) {
      // Ẩn loading nếu có lỗi
      if (options.showLoading) {
        this.hideLoading();
      }
      
      console.error('API Error:', error);
      
      // Hiển thị thông báo lỗi nếu cần
      if (options.showError !== false) {
        showToast(error.message || 'Đã xảy ra lỗi khi kết nối đến máy chủ', 'error');
      }
      
      throw error;
    }
  },
  
  // Lấy token từ localStorage
  getToken() {
    return localStorage.getItem('auth_token') || '';
  },
  
  // Hiển thị loading
  showLoading() {
    // Kiểm tra xem đã có loading overlay chưa
    let loadingOverlay = document.querySelector('.loading-overlay');
    
    if (!loadingOverlay) {
      loadingOverlay = document.createElement('div');
      loadingOverlay.className = 'loading-overlay';
      loadingOverlay.innerHTML = `
        <div class="loading-spinner">
          <div class="spinner"></div>
          <div class="loading-text">Đang tải...</div>
        </div>
      `;
      document.body.appendChild(loadingOverlay);
    }
    
    // Hiển thị loading
    loadingOverlay.style.display = 'flex';
  },
  
  // Ẩn loading
  hideLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.display = 'none';
    }
  },
  
  // API đăng nhập
  async login(username, password) {
    return this.fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      showLoading: true
    });
  },
  
  // API đăng xuất
  async logout() {
    return this.fetchApi('/auth/logout', {
      method: 'POST',
      showLoading: true
    });
  },
  
  // API lấy thông tin người dùng
  async getUserInfo() {
    return this.fetchApi('/user/info', {
      method: 'GET',
      showLoading: true
    });
  },
  
  // API lấy danh sách thông báo
  async getNotifications(page = 1, limit = 10, type = 'all') {
    return this.fetchApi(`/notifications?page=${page}&limit=${limit}&type=${type}`, {
      method: 'GET',
      showLoading: true
    });
  },
  
  // API lấy thời khóa biểu
  async getSchedule(semester, year) {
    return this.fetchApi(`/schedule?semester=${semester}&year=${year}`, {
      method: 'GET',
      showLoading: true
    });
  },
  
  // API lấy lịch thi
  async getExamSchedule(semester, year) {
    return this.fetchApi(`/exams?semester=${semester}&year=${year}`, {
      method: 'GET',
      showLoading: true
    });
  },
  
  // API lấy kết quả học tập
  async getAcademicResults(semester, year) {
    return this.fetchApi(`/academic-results?semester=${semester}&year=${year}`, {
      method: 'GET',
      showLoading: true
    });
  },
  
  // API đăng ký học phần
  async registerCourse(courseId, semester, year) {
    return this.fetchApi('/course-registration', {
      method: 'POST',
      body: JSON.stringify({ courseId, semester, year }),
      showLoading: true
    });
  },
  
  // API hủy đăng ký học phần
  async unregisterCourse(registrationId) {
    return this.fetchApi(`/course-registration/${registrationId}`, {
      method: 'DELETE',
      showLoading: true
    });
  },
  
  // API thanh toán học phí
  async payTuition(amount, paymentMethod) {
    return this.fetchApi('/payment/tuition', {
      method: 'POST',
      body: JSON.stringify({ amount, paymentMethod }),
      showLoading: true
    });
  }
};

// Mô phỏng dữ liệu cho demo
const MockData = {
  // Dữ liệu người dùng
  userInfo: {
    id: 'SV001',
    name: 'Nguyễn Văn A',
    studentId: '20020001',
    faculty: 'Công nghệ thông tin',
    major: 'Kỹ thuật phần mềm',
    class: 'KTPM2020',
    email: 'nguyenvana@example.com',
    phone: '0987654321',
    address: 'Số 123, Đường ABC, Phường XYZ, Thành phố Biên Hòa, Đồng Nai',
    avatar: 'https://via.placeholder.com/150',
    status: 'active'
  },
  
  // Dữ liệu thông báo
  notifications: [
    {
      id: 1,
      title: 'Thông báo về việc đóng học phí học kỳ 2 năm học 2023-2024',
      content: 'Phòng Tài chính - Kế toán thông báo về việc đóng học phí học kỳ 2 năm học 2023-2024. Sinh viên vui lòng đóng học phí đúng thời hạn để tránh bị hủy kết quả đăng ký học phần.',
      sender: 'Phòng Tài chính - Kế toán',
      date: '2024-05-15',
      type: 'important',
      isRead: false
    },
    {
      id: 2,
      title: 'Kế hoạch thi kết thúc học phần học kỳ 2 năm học 2023-2024',
      content: 'Phòng Đào tạo thông báo kế hoạch thi kết thúc học phần học kỳ 2 năm học 2023-2024. Sinh viên vui lòng xem lịch thi và chuẩn bị thi đúng thời gian quy định.',
      sender: 'Phòng Đào tạo',
      date: '2024-05-10',
      type: 'academic',
      isRead: true
    },
    {
      id: 3,
      title: 'Thông báo về việc nghỉ lễ 30/4 và 1/5',
      content: 'Trường thông báo lịch nghỉ lễ 30/4 và 1/5 năm 2024. Sinh viên và cán bộ, giảng viên được nghỉ từ ngày 30/4 đến hết ngày 1/5/2024.',
      sender: 'Phòng Hành chính',
      date: '2024-04-25',
      type: 'general',
      isRead: true
    }
  ],
  
  // Dữ liệu thời khóa biểu
  schedule: [
    {
      id: 1,
      subject: 'Lập trình Web nâng cao',
      room: 'A305',
      teacher: 'Nguyễn Văn B',
      dayOfWeek: 2, // Thứ 2
      startTime: '07:00',
      endTime: '09:30',
      weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    },
    {
      id: 2,
      subject: 'Trí tuệ nhân tạo',
      room: 'B203',
      teacher: 'Trần Thị C',
      dayOfWeek: 3, // Thứ 3
      startTime: '09:45',
      endTime: '11:30',
      weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    },
    {
      id: 3,
      subject: 'Phân tích và thiết kế hệ thống',
      room: 'A401',
      teacher: 'Lê Văn D',
      dayOfWeek: 5, // Thứ 5
      startTime: '13:00',
      endTime: '15:30',
      weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    }
  ],
  
  // Dữ liệu lịch thi
  examSchedule: [
    {
      id: 1,
      subject: 'Lập trình Web nâng cao',
      room: 'A305',
      date: '2024-06-20',
      startTime: '07:00',
      endTime: '08:30',
      type: 'final'
    },
    {
      id: 2,
      subject: 'Trí tuệ nhân tạo',
      room: 'B203',
      date: '2024-06-22',
      startTime: '09:00',
      endTime: '10:30',
      type: 'final'
    },
    {
      id: 3,
      subject: 'Phân tích và thiết kế hệ thống',
      room: 'A401',
      date: '2024-06-25',
      startTime: '13:00',
      endTime: '14:30',
      type: 'final'
    }
  ],
  
  // Dữ liệu kết quả học tập
  academicResults: [
    {
      semester: 1,
      year: '2023-2024',
      courses: [
        {
          id: 'CS101',
          name: 'Lập trình cơ bản',
          credits: 3,
          midtermScore: 8.5,
          finalScore: 9.0,
          averageScore: 8.8,
          letterGrade: 'A'
        },
        {
          id: 'CS102',
          name: 'Cấu trúc dữ liệu và giải thuật',
          credits: 4,
          midtermScore: 7.5,
          finalScore: 8.0,
          averageScore: 7.8,
          letterGrade: 'B+'
        },
        {
          id: 'CS103',
          name: 'Cơ sở dữ liệu',
          credits: 3,
          midtermScore: 9.0,
          finalScore: 8.5,
          averageScore: 8.7,
          letterGrade: 'A'
        }
      ],
      gpa: 3.65
    }
  ]
};