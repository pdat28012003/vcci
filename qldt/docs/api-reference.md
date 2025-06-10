# Tài liệu tham khảo API

Tài liệu này liệt kê tất cả các API call được sử dụng trong ứng dụng QLDT, bao gồm mô tả tác dụng và vị trí sử dụng của mỗi API.

## Mục lục

1. [Xác thực (Authentication)](#xác-thực-authentication)
2. [Thông tin sinh viên (Student Profile)](#thông-tin-sinh-viên-student-profile)
3. [Kết quả học tập (Academic Results)](#kết-quả-học-tập-academic-results)
4. [Kết quả thi (Exam Results)](#kết-quả-thi-exam-results)
5. [Bảng điểm (Transcript)](#bảng-điểm-transcript)
6. [Đăng ký học phần (Course Registration)](#đăng-ký-học-phần-course-registration)
7. [Lịch học (Schedule)](#lịch-học-schedule)
8. [Lịch thi (Exam Schedule)](#lịch-thi-exam-schedule)
9. [Học phí (Tuition)](#học-phí-tuition)
10. [Thông báo (Notifications)](#thông-báo-notifications)

---

## Xác thực (Authentication)

### 1. Đăng nhập

- **Endpoint:** `/api/auth/login`
- **Method:** POST
- **Mô tả:** Xác thực người dùng và trả về token
- **Tham số:**
  - `email`: Email đăng nhập
  - `password`: Mật khẩu
- **Phản hồi:** Token xác thực và thông tin người dùng
- **Sử dụng tại:**
  - `src/context/AuthContext.tsx` - Hàm `login()`

### 2. Kiểm tra xác thực

- **Endpoint:** `/api/auth/me`
- **Method:** GET
- **Mô tả:** Kiểm tra token hiện tại và trả về thông tin người dùng
- **Headers:**
  - `Authorization`: Bearer token
- **Phản hồi:** Thông tin người dùng
- **Sử dụng tại:**
  - `src/context/AuthContext.tsx` - Hàm `checkAuth()`

### 3. Đăng xuất

- **Endpoint:** `/api/auth/logout`
- **Method:** POST
- **Mô tả:** Hủy token hiện tại
- **Headers:**
  - `Authorization`: Bearer token
- **Sử dụng tại:**
  - `src/context/AuthContext.tsx` - Hàm `logout()`

---

## Thông tin sinh viên (Student Profile)

### 1. Lấy thông tin sinh viên

- **Endpoint:** `/api/student/profile`
- **Method:** GET
- **Mô tả:** Lấy thông tin chi tiết của sinh viên
- **Headers:**
  - `Authorization`: Bearer token
- **Phản hồi:** Thông tin chi tiết sinh viên
- **Sử dụng tại:**
  - `src/components/StudentProfile.tsx`

### 2. Cập nhật thông tin sinh viên

- **Endpoint:** `/api/student/profile/update`
- **Method:** PUT
- **Mô tả:** Cập nhật thông tin sinh viên
- **Headers:**
  - `Authorization`: Bearer token
- **Tham số:**
  - Các trường thông tin cần cập nhật
- **Sử dụng tại:**
  - `src/components/UpdateStudentInfo.tsx`

### 3. Tải lên ảnh đại diện

- **Endpoint:** `/api/student/profile/avatar`
- **Method:** POST
- **Mô tả:** Tải lên ảnh đại diện mới
- **Headers:**
  - `Authorization`: Bearer token
- **Tham số:**
  - `avatar`: File ảnh
- **Sử dụng tại:**
  - `src/components/UpdateStudentInfo.tsx`

---

## Kết quả học tập (Academic Results)

### 1. Lấy thông tin chung về kết quả học tập

- **Endpoint:** `/api/academic-results/info`
- **Method:** GET
- **Mô tả:** Lấy thông tin tổng quan về kết quả học tập
- **Headers:**
  - `Authorization`: Bearer token
- **Phản hồi:** Thông tin tổng quan về kết quả học tập
- **Sử dụng tại:**
  - `src/services/academicResultsService.ts` - Hàm `getAcademicResultsInfo()`
  - `src/components/AcademicResults.tsx`

### 2. Lấy danh sách học kỳ

- **Endpoint:** `/api/academic-results/semesters`
- **Method:** GET
- **Mô tả:** Lấy danh sách các học kỳ
- **Headers:**
  - `Authorization`: Bearer token
- **Phản hồi:** Danh sách học kỳ
- **Sử dụng tại:**
  - `src/services/academicResultsService.ts` - Hàm `getSemesters()`
  - `src/components/AcademicResults.tsx`

### 3. Lấy kết quả học tập theo học kỳ và loại học phần

- **Endpoint:** `/api/academic-results/courses`
- **Method:** GET
- **Mô tả:** Lấy kết quả học tập theo học kỳ và loại học phần
- **Headers:**
  - `Authorization`: Bearer token
- **Tham số:**
  - `semesterId`: ID học kỳ (mặc định: "all")
  - `courseType`: Loại học phần (mặc định: "all")
- **Phản hồi:** Danh sách kết quả học tập
- **Sử dụng tại:**
  - `src/services/academicResultsService.ts` - Hàm `getCourseResults()`
  - `src/components/AcademicResults.tsx`

### 4. Lấy phân bố điểm

- **Endpoint:** `/api/academic-results/grade-distribution`
- **Method:** GET
- **Mô tả:** Lấy phân bố điểm theo học kỳ
- **Headers:**
  - `Authorization`: Bearer token
- **Tham số:**
  - `semesterId`: ID học kỳ (mặc định: "all")
- **Phản hồi:** Phân bố điểm
- **Sử dụng tại:**
  - `src/services/academicResultsService.ts` - Hàm `getGradeDistribution()`
  - `src/components/AcademicResults.tsx`

### 5. Lấy tiến độ học tập

- **Endpoint:** `/api/academic-results/progress`
- **Method:** GET
- **Mô tả:** Lấy tiến độ học tập
- **Headers:**
  - `Authorization`: Bearer token
- **Phản hồi:** Tiến độ học tập
- **Sử dụng tại:**
  - `src/services/academicResultsService.ts` - Hàm `getAcademicProgress()`
  - `src/components/AcademicResults.tsx`

---

## Kết quả thi (Exam Results)

### 1. Lấy thống kê kết quả thi

- **Endpoint:** `/api/exam-results/stats`
- **Method:** GET
- **Mô tả:** Lấy thống kê tổng quan về kết quả thi
- **Headers:**
  - `Authorization`: Bearer token
- **Phản hồi:** Thống kê kết quả thi
- **Sử dụng tại:**
  - `src/services/examResultsService.ts` - Hàm `getExamResultsStats()`
  - `src/components/ExamResults.tsx`

### 2. Lấy danh sách học kỳ

- **Endpoint:** `/api/exam-results/semesters`
- **Method:** GET
- **Mô tả:** Lấy danh sách các học kỳ
- **Headers:**
  - `Authorization`: Bearer token
- **Phản hồi:** Danh sách học kỳ
- **Sử dụng tại:**
  - `src/services/examResultsService.ts` - Hàm `getSemesters()`
  - `src/components/ExamResults.tsx`

### 3. Lấy danh sách môn học

- **Endpoint:** `/api/exam-results/subjects`
- **Method:** GET
- **Mô tả:** Lấy danh sách môn học theo học kỳ
- **Headers:**
  - `Authorization`: Bearer token
- **Tham số:**
  - `semesterId`: ID học kỳ (tùy chọn)
- **Phản hồi:** Danh sách môn học
- **Sử dụng tại:**
  - `src/services/examResultsService.ts` - Hàm `getSubjects()`
  - `src/components/ExamResults.tsx`

### 4. Lấy kết quả thi

- **Endpoint:** `/api/exam-results`
- **Method:** GET
- **Mô tả:** Lấy kết quả thi theo học kỳ, môn học và trạng thái
- **Headers:**
  - `Authorization`: Bearer token
- **Tham số:**
  - `semesterId`: ID học kỳ (mặc định: "all")
  - `subjectId`: ID môn học (mặc định: "all")
  - `status`: Trạng thái (mặc định: "all")
- **Phản hồi:** Danh sách kết quả thi
- **Sử dụng tại:**
  - `src/services/examResultsService.ts` - Hàm `getExamResults()`
  - `src/components/ExamResults.tsx`

### 5. Lấy chi tiết kết quả thi

- **Endpoint:** `/api/exam-results/:id`
- **Method:** GET
- **Mô tả:** Lấy chi tiết kết quả thi theo ID
- **Headers:**
  - `Authorization`: Bearer token
- **Tham số:**
  - `id`: ID kết quả thi
- **Phản hồi:** Chi tiết kết quả thi
- **Sử dụng tại:**
  - `src/services/examResultsService.ts` - Hàm `getExamResultDetail()`
  - `src/components/ExamResults.tsx`

---

## Bảng điểm (Transcript)

### 1. Lấy thông tin sinh viên

- **Endpoint:** `/api/transcript/student-info`
- **Method:** GET
- **Mô tả:** Lấy thông tin sinh viên cho bảng điểm
- **Headers:**
  - `Authorization`: Bearer token
- **Phản hồi:** Thông tin sinh viên
- **Sử dụng tại:**
  - `src/services/transcriptService.ts` - Hàm `getStudentInfo()`
  - `src/components/Transcript.tsx`

### 2. Lấy thống kê điểm

- **Endpoint:** `/api/transcript/grade-summary`
- **Method:** GET
- **Mô tả:** Lấy thống kê tổng quan về điểm
- **Headers:**
  - `Authorization`: Bearer token
- **Phản hồi:** Thống kê điểm
- **Sử dụng tại:**
  - `src/services/transcriptService.ts` - Hàm `getGradeSummary()`
  - `src/components/Transcript.tsx`

### 3. Lấy danh sách học kỳ

- **Endpoint:** `/api/transcript/semesters`
- **Method:** GET
- **Mô tả:** Lấy danh sách các học kỳ
- **Headers:**
  - `Authorization`: Bearer token
- **Phản hồi:** Danh sách học kỳ
- **Sử dụng tại:**
  - `src/services/transcriptService.ts` - Hàm `getSemesters()`
  - `src/components/Transcript.tsx`

### 4. Lấy điểm học phần

- **Endpoint:** `/api/transcript/course-grades`
- **Method:** GET
- **Mô tả:** Lấy điểm học phần theo học kỳ và loại học phần
- **Headers:**
  - `Authorization`: Bearer token
- **Tham số:**
  - `semesterId`: ID học kỳ (mặc định: "all")
  - `courseType`: Loại học phần (mặc định: "all")
- **Phản hồi:** Danh sách điểm học phần
- **Sử dụng tại:**
  - `src/services/transcriptService.ts` - Hàm `getCourseGrades()`
  - `src/components/Transcript.tsx`

### 5. Lấy thống kê học kỳ

- **Endpoint:** `/api/transcript/semester-summaries`
- **Method:** GET
- **Mô tả:** Lấy thống kê điểm theo từng học kỳ
- **Headers:**
  - `Authorization`: Bearer token
- **Phản hồi:** Thống kê học kỳ
- **Sử dụng tại:**
  - `src/services/transcriptService.ts` - Hàm `getSemesterSummaries()`
  - `src/components/Transcript.tsx`

### 6. Lấy phân bố điểm

- **Endpoint:** `/api/transcript/grade-distribution`
- **Method:** GET
- **Mô tả:** Lấy phân bố điểm theo thang điểm chữ
- **Headers:**
  - `Authorization`: Bearer token
- **Phản hồi:** Phân bố điểm
- **Sử dụng tại:**
  - `src/services/transcriptService.ts` - Hàm `getGradeDistribution()`
  - `src/components/Transcript.tsx`

### 7. Lấy tiến độ học tập

- **Endpoint:** `/api/transcript/academic-progress`
- **Method:** GET
- **Mô tả:** Lấy tiến độ học tập
- **Headers:**
  - `Authorization`: Bearer token
- **Phản hồi:** Tiến độ học tập
- **Sử dụng tại:**
  - `src/services/transcriptService.ts` - Hàm `getAcademicProgress()`
  - `src/components/Transcript.tsx`

### 8. Lấy so sánh điểm

- **Endpoint:** `/api/transcript/grade-comparison`
- **Method:** GET
- **Mô tả:** Lấy so sánh điểm với trung bình lớp và khoa
- **Headers:**
  - `Authorization`: Bearer token
- **Phản hồi:** So sánh điểm
- **Sử dụng tại:**
  - `src/services/transcriptService.ts` - Hàm `getGradeComparison()`
  - `src/components/Transcript.tsx`

### 9. Yêu cầu cấp bảng điểm

- **Endpoint:** `/api/transcript/request`
- **Method:** POST
- **Mô tả:** Gửi yêu cầu cấp bảng điểm
- **Headers:**
  - `Authorization`: Bearer token
- **Tham số:**
  - `transcriptType`: Loại bảng điểm (vietnamese/english/both)
  - `copies`: Số lượng bản
  - `purpose`: Mục đích sử dụng
  - `otherPurpose`: Mục đích khác (nếu purpose là "other")
- **Phản hồi:** Thông tin yêu cầu bảng điểm
- **Sử dụng tại:**
  - `src/components/TranscriptModal.tsx`

---

## Đăng ký học phần (Course Registration)

### 1. Lấy thông tin đăng ký học phần

- **Endpoint:** `/api/course-registration/info`
- **Method:** GET
- **Mô tả:** Lấy thông tin về đợt đăng ký học phần
- **Headers:**
  - `Authorization`: Bearer token
- **Phản hồi:** Thông tin đợt đăng ký học phần
- **Sử dụng tại:**
  - `src/components/CourseRegistration.tsx`

### 2. Lấy danh sách học phần có thể đăng ký

- **Endpoint:** `/api/course-registration/available-courses`
- **Method:** GET
- **Mô tả:** Lấy danh sách học phần có thể đăng ký
- **Headers:**
  - `Authorization`: Bearer token
- **Phản hồi:** Danh sách học phần có thể đăng ký
- **Sử dụng tại:**
  - `src/components/CourseRegistration.tsx`

### 3. Đăng ký học phần

- **Endpoint:** `/api/course-registration/register`
- **Method:** POST
- **Mô tả:** Đăng ký học phần
- **Headers:**
  - `Authorization`: Bearer token
- **Tham số:**
  - `courseIds`: Danh sách ID học phần
- **Phản hồi:** Kết quả đăng ký
- **Sử dụng tại:**
  - `src/components/CourseRegistration.tsx`

### 4. Hủy đăng ký học phần

- **Endpoint:** `/api/course-registration/withdraw`
- **Method:** POST
- **Mô tả:** Hủy đăng ký học phần
- **Headers:**
  - `Authorization`: Bearer token
- **Tham số:**
  - `courseIds`: Danh sách ID học phần
- **Phản hồi:** Kết quả hủy đăng ký
- **Sử dụng tại:**
  - `src/components/CourseWithdrawal.tsx`

### 5. Lấy thông tin đăng ký

- **Endpoint:** `/api/course-registration/registered-courses`
- **Method:** GET
- **Mô tả:** Lấy danh sách học phần đã đăng ký
- **Headers:**
  - `Authorization`: Bearer token
- **Phản hồi:** Danh sách học phần đã đăng ký
- **Sử dụng tại:**
  - `src/components/RegistrationInfo.tsx`

---

## Lịch học (Schedule)

### 1. Lấy lịch học

- **Endpoint:** `/api/schedule`
- **Method:** GET
- **Mô tả:** Lấy lịch học theo tuần
- **Headers:**
  - `Authorization`: Bearer token
- **Tham số:**
  - `week`: Tuần (mặc định: tuần hiện tại)
- **Phản hồi:** Lịch học
- **Sử dụng tại:**
  - `src/components/Schedule.tsx`

### 2. Lấy danh sách tuần

- **Endpoint:** `/api/schedule/weeks`
- **Method:** GET
- **Mô tả:** Lấy danh sách các tuần trong học kỳ
- **Headers:**
  - `Authorization`: Bearer token
- **Phản hồi:** Danh sách tuần
- **Sử dụng tại:**
  - `src/components/Schedule.tsx`

---

## Lịch thi (Exam Schedule)

### 1. Lấy lịch thi

- **Endpoint:** `/api/exam-schedule`
- **Method:** GET
- **Mô tả:** Lấy lịch thi theo học kỳ
- **Headers:**
  - `Authorization`: Bearer token
- **Tham số:**
  - `semesterId`: ID học kỳ (mặc định: học kỳ hiện tại)
- **Phản hồi:** Lịch thi
- **Sử dụng tại:**
  - `src/components/ExamSchedule.tsx`

---

## Học phí (Tuition)

### 1. Lấy thông tin học phí

- **Endpoint:** `/api/tuition/info`
- **Method:** GET
- **Mô tả:** Lấy thông tin tổng quan về học phí
- **Headers:**
  - `Authorization`: Bearer token
- **Phản hồi:** Thông tin học phí
- **Sử dụng tại:**
  - `src/components/Tuition.tsx`

### 2. Lấy danh sách học phí

- **Endpoint:** `/api/tuition/list`
- **Method:** GET
- **Mô tả:** Lấy danh sách học phí theo học kỳ
- **Headers:**
  - `Authorization`: Bearer token
- **Tham số:**
  - `semesterId`: ID học kỳ (mặc định: "all")
- **Phản hồi:** Danh sách học phí
- **Sử dụng tại:**
  - `src/components/Tuition.tsx`

### 3. Thanh toán học phí

- **Endpoint:** `/api/tuition/pay`
- **Method:** POST
- **Mô tả:** Thanh toán học phí
- **Headers:**
  - `Authorization`: Bearer token
- **Tham số:**
  - `tuitionId`: ID học phí
  - `amount`: Số tiền thanh toán
  - `method`: Phương thức thanh toán
- **Phản hồi:** Kết quả thanh toán
- **Sử dụng tại:**
  - `src/components/Tuition.tsx`

---

## Thông báo (Notifications)

### 1. Lấy danh sách thông báo

- **Endpoint:** `/api/notifications`
- **Method:** GET
- **Mô tả:** Lấy danh sách thông báo
- **Headers:**
  - `Authorization`: Bearer token
- **Tham số:**
  - `page`: Trang (mặc định: 1)
  - `limit`: Số lượng thông báo mỗi trang (mặc định: 10)
- **Phản hồi:** Danh sách thông báo
- **Sử dụng tại:**
  - `src/components/PersonalNotifications.tsx`

### 2. Đánh dấu thông báo đã đọc

- **Endpoint:** `/api/notifications/mark-as-read`
- **Method:** POST
- **Mô tả:** Đánh dấu thông báo đã đọc
- **Headers:**
  - `Authorization`: Bearer token
- **Tham số:**
  - `notificationId`: ID thông báo
- **Phản hồi:** Kết quả đánh dấu
- **Sử dụng tại:**
  - `src/components/PersonalNotifications.tsx`

### 3. Đánh dấu tất cả thông báo đã đọc

- **Endpoint:** `/api/notifications/mark-all-as-read`
- **Method:** POST
- **Mô tả:** Đánh dấu tất cả thông báo đã đọc
- **Headers:**
  - `Authorization`: Bearer token
- **Phản hồi:** Kết quả đánh dấu
- **Sử dụng tại:**
  - `src/components/PersonalNotifications.tsx`

---

## Lưu ý

- Tất cả các API đều yêu cầu xác thực bằng token, trừ API đăng nhập.
- Trong môi trường phát triển, các API được mô phỏng bằng dữ liệu mẫu.
- Trong môi trường sản xuất, các API sẽ được kết nối với backend thực tế.
- Các tham số mặc định được chỉ định trong mã nguồn của các service tương ứng.
