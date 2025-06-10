import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import useTranscript from "../hooks/useTranscript";
import { CourseType } from "../services/transcriptService";
import TranscriptModal from "./TranscriptModal";
import Chart from "chart.js/auto";

// Styled components
const TranscriptWrapper = styled.div`
  padding: 1rem 0;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #2196f3;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const PageTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;

  i {
    color: #1e3056;
  }
`;

const AlertSuccess = styled.div`
  background-color: #e8f5e9;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const AlertIcon = styled.div`
  background-color: #4caf50;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 20px;
`;

const AlertContent = styled.div`
  flex: 1;
`;

const AlertTitle = styled.div`
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 5px;
  color: #2e7d32;
`;

const AlertMessage = styled.div`
  color: #1b5e20;
`;

const StudentInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const InfoItem = styled.div`
  flex: 1;
  min-width: 200px;
`;

const InfoLabel = styled.div`
  color: #666;
  margin-bottom: 5px;
  font-size: 14px;
`;

const InfoValue = styled.div`
  font-weight: 500;
  color: #333;
  font-size: 16px;
`;

const GradeSummary = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
`;

const SummaryItem = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  flex: 1;
  min-width: 150px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }
`;

const SummaryValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #1e3056;
`;

const SummaryLabel = styled.div`
  color: #666;
  font-size: 14px;
`;

const GradeTabs = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  background-color: white;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const TabItem = styled.div<{ isActive: boolean }>`
  padding: 15px 20px;
  cursor: pointer;
  font-weight: ${({ isActive }) => (isActive ? "bold" : "normal")};
  color: ${({ isActive }) => (isActive ? "#1e3056" : "#666")};
  background-color: ${({ isActive }) => (isActive ? "#f5f5f5" : "white")};
  border-bottom: ${({ isActive }) => (isActive ? "3px solid #1e3056" : "none")};
  transition: all 0.3s ease;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const GradeControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 200px;
`;

const ControlLabel = styled.label`
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ControlSelect = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const ActionControls = styled.div`
  display: flex;
  gap: 10px;
  margin-left: auto;
  align-self: flex-end;

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    justify-content: space-between;
  }
`;

const ActionButton = styled.button`
  background-color: #1e3056;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2a4070;
  }
`;

const GradeTableContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const TableTitle = styled.h2`
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SearchFilter = styled.div`
  display: flex;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: none;
  font-size: 14px;

  &:focus {
    outline: none;
  }
`;

const SearchButton = styled.button`
  background-color: #1e3056;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2a4070;
  }
`;

const GradeTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  background-color: #1e3056;
  color: white;
  padding: 12px 15px;
  text-align: left;
  font-weight: 500;
`;

const TableCell = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  color: #333;
`;

const SemesterHeader = styled.tr`
  background-color: #f5f5f5;
  font-weight: bold;
`;

const SemesterSummary = styled.tr`
  background-color: #f9f9f9;
  font-weight: 500;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ status }) =>
    status === "passed" ? "#e8f5e9" : status === "failed" ? "#ffebee" : "#e3f2fd"};
  color: ${({ status }) =>
    status === "passed" ? "#2e7d32" : status === "failed" ? "#c62828" : "#1565c0"};
`;

const ChartContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h2`
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
`;

const ChartCanvas = styled.canvas`
  width: 100%;
  height: 400px;
`;

const ProgressContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ProgressTitle = styled.h2`
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
`;

const ProgressOverview = styled.div`
  margin-bottom: 30px;
`;

const ProgressBar = styled.div`
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  margin-bottom: 10px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ width: number; color?: string }>`
  height: 100%;
  width: ${({ width }) => width}%;
  background-color: ${({ color }) => color || "#1e3056"};
  border-radius: 10px;
  transition: width 1s ease-in-out;
`;

const ProgressStats = styled.div`
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 14px;
`;

const ProgressCategories = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const CategoryItem = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }
`;

const CategoryName = styled.div`
  font-weight: 500;
  margin-bottom: 10px;
  color: #333;
`;

const CategoryProgress = styled.div`
  margin-bottom: 5px;
`;

const ComparisonContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ComparisonTitle = styled.h2`
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
`;

const Transcript: React.FC = () => {
  // Sử dụng custom hook để lấy dữ liệu và các hàm xử lý
  const {
    studentInfo,
    gradeSummary,
    semesters,
    courseGrades,
    semesterSummaries,
    gradeDistribution,
    academicProgress,
    gradeComparison,
    selectedSemesterId,
    selectedCourseType,
    searchQuery,
    activeTab,
    loading,
    error,
    handleSemesterChange,
    handleCourseTypeChange,
    handleTabChange,
    handleSearch,
    handlePrint,
    handleExport,
    handleRequestTranscript,
  } = useTranscript();

  // State cho modal yêu cầu bảng điểm
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);

  // Refs cho các biểu đồ
  const semesterGPAChartRef = useRef<HTMLCanvasElement>(null);
  const gradeDistributionChartRef = useRef<HTMLCanvasElement>(null);
  const semesterGPAChartInstance = useRef<Chart | null>(null);
  const gradeDistributionChartInstance = useRef<Chart | null>(null);

  // State cho tìm kiếm
  const [searchText, setSearchText] = useState("");

  // Xử lý khi nhấn Enter trong ô tìm kiếm
  const handleSearchKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(searchText);
    }
  };

  // Xử lý khi nhấn nút tìm kiếm
  const handleSearchClick = () => {
    handleSearch(searchText);
  };

  // Vẽ biểu đồ điểm trung bình học kỳ
  useEffect(() => {
    if (
      activeTab === "progress" &&
      semesterGPAChartRef.current &&
      semesterSummaries.length > 0
    ) {
      // Hủy biểu đồ cũ nếu có
      if (semesterGPAChartInstance.current) {
        semesterGPAChartInstance.current.destroy();
      }

      const ctx = semesterGPAChartRef.current.getContext("2d");
      if (ctx) {
        // Chuẩn bị dữ liệu
        const labels = semesterSummaries.map((semester) => semester.semesterName);
        const data = semesterSummaries.map((semester) => semester.gpa);

        // Tạo biểu đồ mới
        semesterGPAChartInstance.current = new Chart(ctx, {
          type: "line",
          data: {
            labels,
            datasets: [
              {
                label: "Điểm trung bình học kỳ",
                data,
                backgroundColor: "rgba(30, 48, 86, 0.2)",
                borderColor: "rgba(30, 48, 86, 1)",
                borderWidth: 2,
                tension: 0.4,
                pointBackgroundColor: "rgba(30, 48, 86, 1)",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: false,
                min: 0,
                max: 10,
                ticks: {
                  stepSize: 1,
                },
              },
            },
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
              tooltip: {
                backgroundColor: "rgba(30, 48, 86, 0.8)",
                titleColor: "#fff",
                bodyColor: "#fff",
                borderColor: "rgba(30, 48, 86, 1)",
                borderWidth: 1,
                padding: 10,
                displayColors: false,
              },
            },
          },
        });
      }
    }

    return () => {
      // Hủy biểu đồ khi component unmount
      if (semesterGPAChartInstance.current) {
        semesterGPAChartInstance.current.destroy();
      }
    };
  }, [activeTab, semesterSummaries]);

  // Vẽ biểu đồ phân bố điểm
  useEffect(() => {
    if (
      activeTab === "distribution" &&
      gradeDistributionChartRef.current &&
      gradeDistribution.length > 0
    ) {
      // Hủy biểu đồ cũ nếu có
      if (gradeDistributionChartInstance.current) {
        gradeDistributionChartInstance.current.destroy();
      }

      const ctx = gradeDistributionChartRef.current.getContext("2d");
      if (ctx) {
        // Chuẩn bị dữ liệu
        const labels = gradeDistribution.map((item) => item.grade);
        const data = gradeDistribution.map((item) => item.percentage);
        const colors = gradeDistribution.map((item) => item.color);

        // Tạo biểu đồ mới
        gradeDistributionChartInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                label: "Phân bố điểm (%)",
                data,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  callback: function (value) {
                    return value + "%";
                  },
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return context.parsed.y + "%";
                  },
                },
              },
            },
          },
        });
      }
    }

    return () => {
      // Hủy biểu đồ khi component unmount
      if (gradeDistributionChartInstance.current) {
        gradeDistributionChartInstance.current.destroy();
      }
    };
  }, [activeTab, gradeDistribution]);

  // Vẽ biểu đồ so sánh điểm
  const comparisonChartRef = useRef<HTMLCanvasElement>(null);
  const comparisonChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (
      activeTab === "comparison" &&
      comparisonChartRef.current &&
      gradeComparison.length > 0
    ) {
      // Hủy biểu đồ cũ nếu có
      if (comparisonChartInstance.current) {
        comparisonChartInstance.current.destroy();
      }

      const ctx = comparisonChartRef.current.getContext("2d");
      if (ctx) {
        // Chuẩn bị dữ liệu
        const labels = gradeComparison.map((item) => item.semesterName);
        const studentData = gradeComparison.map((item) => item.gpa);
        const classData = gradeComparison.map((item) => item.classAverage);
        const departmentData = gradeComparison.map((item) => item.departmentAverage);

        // Tạo biểu đồ mới
        comparisonChartInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                label: "Điểm của bạn",
                data: studentData,
                backgroundColor: "rgba(30, 48, 86, 0.8)",
                borderColor: "rgba(30, 48, 86, 1)",
                borderWidth: 1,
              },
              {
                label: "Trung bình lớp",
                data: classData,
                backgroundColor: "rgba(33, 150, 243, 0.8)",
                borderColor: "rgba(33, 150, 243, 1)",
                borderWidth: 1,
              },
              {
                label: "Trung bình khoa",
                data: departmentData,
                backgroundColor: "rgba(76, 175, 80, 0.8)",
                borderColor: "rgba(76, 175, 80, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: false,
                min: 0,
                max: 10,
                ticks: {
                  stepSize: 1,
                },
              },
            },
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
            },
          },
        });
      }
    }

    return () => {
      // Hủy biểu đồ khi component unmount
      if (comparisonChartInstance.current) {
        comparisonChartInstance.current.destroy();
      }
    };
  }, [activeTab, gradeComparison]);

  // Nhóm kết quả học tập theo học kỳ
  const groupedCourseGrades = courseGrades.reduce((acc, course) => {
    if (!acc[course.semesterId]) {
      acc[course.semesterId] = {
        semesterName: course.semester,
        courses: [],
      };
    }
    acc[course.semesterId].courses.push(course);
    return acc;
  }, {} as Record<string, { semesterName: string; courses: typeof courseGrades }>);

  // Sắp xếp học kỳ theo thứ tự thời gian (giả định rằng semesterId có định dạng "YYYY-YYYY-N")
  const sortedSemesterIds = Object.keys(groupedCourseGrades).sort((a, b) => {
    const [yearA, termA] = a.split("-");
    const [yearB, termB] = b.split("-");
    return yearA === yearB ? termA.localeCompare(termB) : yearA.localeCompare(yearB);
  });

  return (
    <TranscriptWrapper>
      {/* Hiển thị loading overlay khi đang tải dữ liệu */}
      {loading && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}

      {/* Tiêu đề trang */}
      <PageTitle>
        <i className="fa fa-bar-chart"></i> Bảng điểm
      </PageTitle>

      {/* Thông báo thành tích */}
      <AlertSuccess>
        <AlertIcon>
          <i className="fa fa-trophy"></i>
        </AlertIcon>
        <AlertContent>
          <AlertTitle>Chúc mừng!</AlertTitle>
          <AlertMessage>
            Bạn đã đạt thành tích học tập tốt trong học kỳ vừa qua. Tiếp tục phát huy
            nhé!
          </AlertMessage>
        </AlertContent>
      </AlertSuccess>

      {/* Thông tin sinh viên */}
      {studentInfo && (
        <StudentInfo>
          <InfoItem>
            <InfoLabel>Mã sinh viên:</InfoLabel>
            <InfoValue>{studentInfo.studentId}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Họ và tên:</InfoLabel>
            <InfoValue>{studentInfo.studentName}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Ngành học:</InfoLabel>
            <InfoValue>{studentInfo.major}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Chuyên ngành:</InfoLabel>
            <InfoValue>{studentInfo.specialization}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Khóa học:</InfoLabel>
            <InfoValue>{studentInfo.academicYear}</InfoValue>
          </InfoItem>
        </StudentInfo>
      )}

      {/* Thống kê điểm */}
      {gradeSummary && (
        <GradeSummary>
          <SummaryItem>
            <SummaryValue>{gradeSummary.cumulativeGPA}</SummaryValue>
            <SummaryLabel>Điểm trung bình tích lũy</SummaryLabel>
          </SummaryItem>
          <SummaryItem>
            <SummaryValue>{gradeSummary.lastSemesterGPA}</SummaryValue>
            <SummaryLabel>Điểm trung bình học kỳ gần nhất</SummaryLabel>
          </SummaryItem>
          <SummaryItem>
            <SummaryValue>
              {gradeSummary.completedCredits}/{gradeSummary.totalCredits}
            </SummaryValue>
            <SummaryLabel>Số tín chỉ tích lũy</SummaryLabel>
          </SummaryItem>
          <SummaryItem>
            <SummaryValue>{gradeSummary.academicRank}</SummaryValue>
            <SummaryLabel>Xếp loại</SummaryLabel>
          </SummaryItem>
        </GradeSummary>
      )}

      {/* Tab điều hướng */}
      <GradeTabs>
        <TabItem
          isActive={activeTab === "grades"}
          onClick={() => handleTabChange("grades")}
        >
          Bảng điểm
        </TabItem>
        <TabItem
          isActive={activeTab === "distribution"}
          onClick={() => handleTabChange("distribution")}
        >
          Phân bố điểm
        </TabItem>
        <TabItem
          isActive={activeTab === "progress"}
          onClick={() => handleTabChange("progress")}
        >
          Tiến độ học tập
        </TabItem>
        <TabItem
          isActive={activeTab === "comparison"}
          onClick={() => handleTabChange("comparison")}
        >
          So sánh
        </TabItem>
      </GradeTabs>

      {/* Nội dung tab Bảng điểm */}
      {activeTab === "grades" && (
        <>
          {/* Bộ lọc và điều khiển */}
          <GradeControls>
            <ControlGroup>
              <ControlLabel htmlFor="semester-select">
                <i className="fa fa-calendar"></i> Học kỳ:
              </ControlLabel>
              <ControlSelect
                id="semester-select"
                value={selectedSemesterId}
                onChange={(e) => handleSemesterChange(e.target.value)}
              >
                {semesters.map((semester) => (
                  <option key={semester.id} value={semester.id}>
                    {semester.name}
                  </option>
                ))}
              </ControlSelect>
            </ControlGroup>

            <ControlGroup>
              <ControlLabel htmlFor="course-type">
                <i className="fa fa-book"></i> Loại học phần:
              </ControlLabel>
              <ControlSelect
                id="course-type"
                value={selectedCourseType}
                onChange={(e) => handleCourseTypeChange(e.target.value as CourseType)}
              >
                <option value={CourseType.ALL}>Tất cả</option>
                <option value={CourseType.REQUIRED}>Bắt buộc</option>
                <option value={CourseType.ELECTIVE}>Tự chọn</option>
                <option value={CourseType.GENERAL}>Đại cương</option>
                <option value={CourseType.SPECIALIZED}>Chuyên ngành</option>
              </ControlSelect>
            </ControlGroup>

            <ActionControls>
              <ActionButton onClick={handlePrint}>
                <i className="fa fa-print"></i> In
              </ActionButton>
              <ActionButton onClick={handleExport}>
                <i className="fa fa-download"></i> Xuất file
              </ActionButton>
              <ActionButton onClick={() => setShowTranscriptModal(true)}>
                <i className="fa fa-file-text"></i> Yêu cầu bảng điểm
              </ActionButton>
            </ActionControls>
          </GradeControls>

          {/* Bảng điểm chi tiết */}
          <GradeTableContainer>
            <TableTitle>
              <i className="fa fa-table"></i> Bảng điểm chi tiết
            </TableTitle>

            <SearchFilter>
              <SearchInput
                type="text"
                id="grade-search"
                placeholder="Tìm kiếm theo mã hoặc tên học phần..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyUp={handleSearchKeyUp}
              />
              <SearchButton onClick={handleSearchClick}>
                <i className="fa fa-search"></i>
              </SearchButton>
            </SearchFilter>

            <GradeTable>
              <thead>
                <tr>
                  <TableHeader>STT</TableHeader>
                  <TableHeader>Mã học phần</TableHeader>
                  <TableHeader>Tên học phần</TableHeader>
                  <TableHeader>Số tín chỉ</TableHeader>
                  <TableHeader>Học kỳ</TableHeader>
                  <TableHeader>Điểm quá trình</TableHeader>
                  <TableHeader>Điểm thi</TableHeader>
                  <TableHeader>Điểm tổng kết</TableHeader>
                  <TableHeader>Điểm chữ</TableHeader>
                  <TableHeader>Kết quả</TableHeader>
                </tr>
              </thead>
              <tbody>
                {sortedSemesterIds.length > 0 ? (
                  sortedSemesterIds.map((semesterId) => {
                    const semesterData = groupedCourseGrades[semesterId];
                    const semesterSummary = semesterSummaries.find(
                      (summary) => summary.semesterId === semesterId
                    );

                    return (
                      <React.Fragment key={semesterId}>
                        {/* Tiêu đề học kỳ */}
                        <SemesterHeader>
                          <TableCell colSpan={10}>{semesterData.semesterName}</TableCell>
                        </SemesterHeader>

                        {/* Danh sách học phần trong học kỳ */}
                        {semesterData.courses.map((course, index) => (
                          <tr
                            key={course.id}
                            className={`grade-row ${course.courseType.join(" ")}`}
                          >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{course.courseCode}</TableCell>
                            <TableCell>{course.courseName}</TableCell>
                            <TableCell>{course.credits}</TableCell>
                            <TableCell>{course.semester}</TableCell>
                            <TableCell>{course.progressGrade}</TableCell>
                            <TableCell>{course.examGrade}</TableCell>
                            <TableCell>{course.finalGrade}</TableCell>
                            <TableCell>{course.letterGrade}</TableCell>
                            <TableCell>
                              <StatusBadge status={course.status}>
                                {course.status === "passed"
                                  ? "Đạt"
                                  : course.status === "failed"
                                  ? "Không đạt"
                                  : "Đang học"}
                              </StatusBadge>
                            </TableCell>
                          </tr>
                        ))}

                        {/* Tổng kết học kỳ */}
                        {semesterSummary && (
                          <SemesterSummary>
                            <TableCell colSpan={3}>
                              Điểm trung bình học kỳ: {semesterSummary.gpa}
                            </TableCell>
                            <TableCell>{semesterSummary.totalCredits}</TableCell>
                            <TableCell colSpan={6}>
                              Số tín chỉ đạt: {semesterSummary.completedCredits}/
                              {semesterSummary.totalCredits}
                            </TableCell>
                          </SemesterSummary>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <TableCell colSpan={10} style={{ textAlign: "center" }}>
                      Không có dữ liệu bảng điểm
                    </TableCell>
                  </tr>
                )}
              </tbody>
            </GradeTable>
          </GradeTableContainer>
        </>
      )}

      {/* Nội dung tab Phân bố điểm */}
      {activeTab === "distribution" && (
        <ChartContainer>
          <ChartTitle>Phân bố điểm theo thang điểm chữ</ChartTitle>
          <ChartCanvas ref={gradeDistributionChartRef} />
        </ChartContainer>
      )}

      {/* Nội dung tab Tiến độ học tập */}
      {activeTab === "progress" && academicProgress && (
        <>
          <ChartContainer>
            <ChartTitle>Điểm trung bình học kỳ</ChartTitle>
            <ChartCanvas ref={semesterGPAChartRef} />
          </ChartContainer>

          <ProgressContainer>
            <ProgressTitle>Tiến độ hoàn thành chương trình học</ProgressTitle>

            <ProgressOverview>
              <ProgressBar>
                <ProgressFill
                  width={academicProgress.completionPercentage}
                  color="#4caf50"
                />
              </ProgressBar>
              <ProgressStats>
                <div>
                  Đã hoàn thành: {academicProgress.completedCredits}/
                  {academicProgress.totalCredits} tín chỉ
                </div>
                <div>{academicProgress.completionPercentage.toFixed(1)}%</div>
              </ProgressStats>
            </ProgressOverview>

            <ProgressCategories>
              {academicProgress.categories.map((category) => (
                <CategoryItem key={category.id}>
                  <CategoryName>{category.name}</CategoryName>
                  <CategoryProgress>
                    <ProgressBar>
                      <ProgressFill
                        width={category.completionPercentage}
                        color={
                          category.id === "general"
                            ? "#2196f3"
                            : category.id === "specialized"
                            ? "#4caf50"
                            : category.id === "elective"
                            ? "#ff9800"
                            : "#9c27b0"
                        }
                      />
                    </ProgressBar>
                    <ProgressStats>
                      <div>
                        {category.completedCredits}/{category.totalCredits} tín chỉ
                      </div>
                      <div>{category.completionPercentage.toFixed(1)}%</div>
                    </ProgressStats>
                  </CategoryProgress>
                </CategoryItem>
              ))}
            </ProgressCategories>
          </ProgressContainer>
        </>
      )}

      {/* Nội dung tab So sánh */}
      {activeTab === "comparison" && (
        <ComparisonContainer>
          <ComparisonTitle>So sánh điểm trung bình học kỳ</ComparisonTitle>
          <ChartCanvas ref={comparisonChartRef} />
        </ComparisonContainer>
      )}

      {/* Modal yêu cầu bảng điểm */}
      <TranscriptModal
        isOpen={showTranscriptModal}
        onClose={() => setShowTranscriptModal(false)}
      />

      {/* Hiển thị thông báo lỗi nếu có */}
      {error && (
        <div
          style={{
            textAlign: "center",
            padding: "1rem",
            color: "red",
            backgroundColor: "#ffebee",
            borderRadius: "4px",
            marginTop: "1rem",
          }}
        >
          {error}
        </div>
      )}
    </TranscriptWrapper>
  );
};

export default Transcript;