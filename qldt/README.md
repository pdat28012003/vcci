# Dự Án Quản Lý Đào Tạo (QLDT)

Dự án Quản Lý Đào Tạo là một ứng dụng web giúp sinh viên và giảng viên quản lý thông tin học tập, đăng ký học phần, xem kết quả học tập, lịch thi, và nhiều tính năng khác.

## Cấu Trúc Dự Án

```
src/
├── app/              # Next.js app router
├── components/       # React components
├── config/           # Cấu hình ứng dụng
├── context/          # React context providers
├── hooks/            # Custom React hooks
├── pages/            # Next.js pages
├── services/         # API services
├── styles/           # CSS và styled-components
└── utils/            # Utility functions
```

## Flow Call API

### 1. Tổng quan về luồng hoạt động API

Dự án QLDT sử dụng một kiến trúc rõ ràng để gọi và xử lý API, được tổ chức thành 3 lớp chính:

#### 1.1. Cấu trúc tổng thể

- **Config**: Chứa cấu hình API như URL cơ sở và các endpoint
- **Services**: Chứa các hàm gọi API trực tiếp
- **Hooks**: Cung cấp logic nghiệp vụ và quản lý state
- **Context**: Quản lý trạng thái toàn cục như xác thực
- **Components**: Hiển thị dữ liệu và tương tác với người dùng

#### 1.2. Luồng dữ liệu

```
User Interaction → Component → Hook → Service → API → Service → Hook → Component → UI
```

### 2. Chi tiết các thành phần

#### 2.1. Config (src/config/api.ts)

- **Tác dụng**: Định nghĩa URL cơ sở và các endpoint API
- **Input**: Không có
- **Output**: Các hằng số API_BASE_URL và API_ENDPOINTS
- **Ví dụ**:

```typescript
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  STUDENT_PROFILE: "/student/profile",
  // ...
};
```

#### 2.2. useApiService (src/hooks/useApiService.ts)

- **Tác dụng**: Hook cơ sở để gọi API, xử lý token xác thực và lỗi
- **Input**:
  - Endpoint: Đường dẫn API
  - Options: Cấu hình request (method, headers, body, etc.)
- **Output**:
  - fetchApi: Hàm gọi API trực tiếp
  - useApi: Hook để gọi API với state (loading, error, data)
  - Các hàm quản lý token (saveToken, clearToken)
- **Luồng hoạt động**:
  1. Lấy token từ localStorage (nếu có)
  2. Tạo URL đầy đủ bằng cách kết hợp baseUrl và endpoint
  3. Thiết lập headers với Content-Type và Authorization (nếu có token)
  4. Thực hiện fetch request
  5. Xử lý response (kiểm tra status, parse JSON)
  6. Xử lý lỗi và hiển thị thông báo nếu cần
  7. Trả về dữ liệu hoặc throw error

#### 2.3. Services (src/services/\*)

- **Tác dụng**: Cung cấp các hàm gọi API cụ thể cho từng tính năng
- **Input**: Các tham số cần thiết cho API (ID, filters, etc.)
- **Output**: Dữ liệu từ API đã được định dạng theo interface
- **Ví dụ từ academicResultsService.ts**:

```typescript
// Lấy kết quả học tập
const getCourseResults = useCallback(
  async (
    semesterId: string = "all",
    courseType: CourseType = CourseType.ALL
  ): Promise<CourseResult[]> => {
    try {
      // Gọi API thực tế
      // return await fetchApi<CourseResult[]>('/api/academic-results/courses', { params: { semesterId, courseType } });

      // Dữ liệu mẫu
      const courseResults: CourseResult[] = [...];

      // Lọc dữ liệu theo tham số
      let filteredResults = courseResults;
      if (semesterId !== "all") {
        filteredResults = filteredResults.filter(
          (course) => course.semesterId === semesterId
        );
      }
      if (courseType !== CourseType.ALL) {
        filteredResults = filteredResults.filter(
          (course) => course.courseType === courseType
        );
      }

      return filteredResults;
    } catch (error) {
      console.error("Error fetching course results:", error);
      throw error;
    }
  },
  [fetchApi]
);
```

#### 2.4. Hooks (src/hooks/\*)

- **Tác dụng**: Quản lý state và logic nghiệp vụ, gọi services
- **Input**: Tham số từ component (nếu cần)
- **Output**: State và các hàm xử lý để component sử dụng
- **Ví dụ từ useAcademicResults.ts**:

```typescript
// Lấy dữ liệu ban đầu
const fetchInitialData = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    // Gọi API lấy dữ liệu từ service
    const [
      infoData,
      semestersData,
      resultsData,
      distributionData,
      progressData,
    ] = await Promise.all([
      getAcademicResultsInfo(),
      getSemesters(),
      getCourseResults("all", CourseType.ALL),
      getGradeDistribution("all"),
      getAcademicProgress(),
    ]);

    setResultsInfo(infoData);
    setSemesters(semestersData);
    setCourseResults(resultsData);
    setGradeDistribution(distributionData);
    setAcademicProgress(progressData);

    setLoading(false);
  } catch (err) {
    setError(
      "Có lỗi xảy ra khi tải dữ liệu kết quả học tập. Vui lòng thử lại sau."
    );
    setLoading(false);
    showToast("Có lỗi xảy ra khi tải dữ liệu kết quả học tập", "error");
  }
}, [
  getAcademicResultsInfo,
  getSemesters,
  getCourseResults,
  getGradeDistribution,
  getAcademicProgress,
  showToast,
]);
```

#### 2.5. Context (src/context/\*)

- **Tác dụng**: Quản lý trạng thái toàn cục và chia sẻ dữ liệu giữa các component
- **Input**: Không có (hoặc từ localStorage)
- **Output**: Provider và hook để truy cập state và các hàm
- **Ví dụ từ AuthContext.tsx**:

```typescript
// Hàm đăng nhập
const login = useCallback(
  async (email: string, password: string) => {
    setIsLoading(true);

    try {
      // Trong thực tế, đây sẽ là một API call để đăng nhập
      // const response = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Kiểm tra thông tin đăng nhập
      if (email === "nguyenvana@example.com" && password === "password") {
        const mockToken = "mock_token_" + Date.now();
        const mockUser = {
          /* user data */
        };

        localStorage.setItem("auth_token", mockToken);
        setToken(mockToken);
        setUser(mockUser);
        showToast("Đăng nhập thành công", "success");
      } else {
        throw new Error("Email hoặc mật khẩu không đúng");
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      showToast(
        error instanceof Error ? error.message : "Đăng nhập thất bại",
        "error"
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  },
  [showToast]
);
```

#### 2.6. Components (src/components/\*)

- **Tác dụng**: Hiển thị UI và xử lý tương tác người dùng
- **Input**: Props từ component cha và dữ liệu từ hooks
- **Output**: UI và xử lý sự kiện người dùng
- **Ví dụ từ AcademicResults.tsx**:

```typescript
// Xử lý khi thay đổi học kỳ
const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  changeSemester(e.target.value);
};

// Render UI
return (
  <AcademicResultsWrapper>
    {loading && (
      <LoadingOverlay>
        <LoadingSpinner />
      </LoadingOverlay>
    )}

    {/* UI components */}
    <select
      id="semester-select"
      value={selectedSemesterId}
      onChange={handleSemesterChange}
    >
      {semesters.map((semester) => (
        <option key={semester.id} value={semester.id}>
          {semester.name}
        </option>
      ))}
    </select>

    {/* Display data */}
    <div className="results-grid">
      {courseResults.map((course) => (
        <div className="result-card" key={course.id}>
          {/* Course details */}
        </div>
      ))}
    </div>
  </AcademicResultsWrapper>
);
```

### 3. Luồng hoạt động API chi tiết

#### 3.1. Luồng xác thực (Authentication)

1. **Input**: Email và password từ form đăng nhập
2. **Xử lý**:
   - Component gọi hàm login từ useAuth hook
   - useAuth gọi API đăng nhập thông qua fetch
   - API trả về token và thông tin người dùng
   - Token được lưu vào localStorage
   - User được lưu vào state của AuthContext
3. **Output**: Trạng thái đăng nhập và thông tin người dùng

#### 3.2. Luồng lấy dữ liệu (Data Fetching)

1. **Input**: Tham số lọc (nếu có) từ UI
2. **Xử lý**:
   - Component gọi hàm từ custom hook (ví dụ: useAcademicResults)
   - Hook gọi các hàm từ service tương ứng
   - Service gọi API thông qua useApiService
   - useApiService thêm token vào header và thực hiện fetch
   - API trả về dữ liệu
   - Service xử lý và định dạng dữ liệu
   - Hook cập nhật state
3. **Output**: Dữ liệu đã được xử lý và state loading/error

#### 3.3. Luồng cập nhật dữ liệu (Data Updating)

1. **Input**: Dữ liệu mới từ form
2. **Xử lý**:
   - Component gọi hàm từ custom hook
   - Hook gọi hàm từ service
   - Service gọi API với method POST/PUT
   - API xử lý và trả về kết quả
   - Service xử lý response
   - Hook cập nhật state và hiển thị thông báo
3. **Output**: State đã cập nhật và thông báo thành công/lỗi

### 4. Xử lý lỗi và loading

#### 4.1. Xử lý loading

- Mỗi hook quản lý state loading riêng
- Component hiển thị loading indicator khi loading = true
- useApiService có tùy chọn showLoading để hiển thị loading toàn cục

#### 4.2. Xử lý lỗi

- Lỗi được bắt và xử lý ở nhiều cấp:
  1. useApiService: Bắt lỗi HTTP và response không hợp lệ
  2. Service: Bắt lỗi cụ thể của API và log
  3. Hook: Bắt lỗi từ service, cập nhật state error và hiển thị thông báo
  4. Component: Hiển thị thông báo lỗi từ state

### 5. Tối ưu hóa

- Sử dụng React.memo để tránh render không cần thiết
- Sử dụng useCallback để tránh tạo lại hàm
- Sử dụng Promise.all để gọi nhiều API song song
- Lưu token trong localStorage để duy trì đăng nhập giữa các phiên

## Cài Đặt và Chạy Dự Án

### Yêu cầu hệ thống

- Node.js (>= 14.0.0)
- npm hoặc yarn

### Cài đặt

```bash
# Clone repository
git clone <repository-url>

# Di chuyển vào thư mục dự án
cd qldt

# Cài đặt dependencies
npm install
# hoặc
yarn install
```

### Chạy dự án

```bash
# Chạy môi trường development
npm run dev
# hoặc
yarn dev

# Build cho production
npm run build
# hoặc
yarn build
# Chạy bản build
npm start
# hoặc
yarn start
```

## Tác giả

- Nguyễn Văn A - nguyenvana@example.com

## Giấy phép

Dự án này được phân phối dưới giấy phép MIT.
