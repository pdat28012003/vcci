import React, { useEffect, useState } from "react";
import styled from "styled-components";
import useAcademicResults, { ResultsTabView } from "../hooks/useAcademicResults";
import { CourseType } from "../services/academicResultsService";

// Styled components
const AcademicResultsWrapper = styled.div`
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

const AcademicResults: React.FC = () => {
  // Sử dụng custom hook để lấy dữ liệu và các hàm xử lý
  const {
    resultsInfo,
    semesters,
    courseResults,
    gradeDistribution,
    academicProgress,
    groupedCourseResults,
    selectedSemesterId,
    selectedCourseType,
    activeTab,
    loading,
    error,
    changeSemester,
    changeCourseType,
    changeTab,
    calculateSemesterGPA,
    printResults,
    exportResults,
  } = useAcademicResults();

  // State để theo dõi việc tải CSS
  const [cssLoaded, setCssLoaded] = useState(false);

  // Load CSS
  useEffect(() => {
    // Thêm link CSS vào head
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/css/ket-qua-hoc-tap.css";
    link.onload = () => setCssLoaded(true);
    document.head.appendChild(link);

    // Cleanup khi component unmount
    return () => {
      // Tìm và xóa link CSS
      const links = document.head.getElementsByTagName("link");
      for (let i = 0; i < links.length; i++) {
        if (links[i].href.includes("ket-qua-hoc-tap.css")) {
          document.head.removeChild(links[i]);
          break;
        }
      }
    };
  }, []);

  // Xử lý khi thay đổi học kỳ
  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeSemester(e.target.value);
  };

  // Xử lý khi thay đổi loại học phần
  const handleCourseTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeCourseType(e.target.value as CourseType);
  };

  // Xử lý khi thay đổi tab
  const handleTabChange = (tab: ResultsTabView) => {
    changeTab(tab);
  };

  // Xử lý khi nhấn nút in
  const handlePrint = () => {
    printResults();
  };

  // Xử lý khi nhấn nút xuất file
  const handleExport = () => {
    exportResults("pdf");
  };

  return (
    <AcademicResultsWrapper>
      {/* Hiển thị loading overlay khi đang tải dữ liệu */}
      {loading && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}

      {/* Tiêu đề trang */}
      <h1 className="page-title">
        <i className="fa fa-bar-chart"></i> Kết quả học tập
      </h1>

      {/* Thông báo thành tích */}
      {resultsInfo && (
        <div className="alert alert-success">
          <div className="alert-icon">
            <i className="fa fa-trophy"></i>
          </div>
          <div className="alert-content">
            <div className="alert-title">Chúc mừng!</div>
            <div className="alert-message">
              Bạn đã đạt thành tích học tập xuất sắc trong học kỳ vừa qua. Tiếp tục phát
              huy nhé!
            </div>
          </div>
        </div>
      )}

      {/* Thống kê kết quả học tập */}
      {resultsInfo && (
        <div className="results-stats">
          <div className="stat-item">
            <div className="stat-value">{resultsInfo.gpa.toFixed(2)}</div>
            <div className="stat-label">Điểm trung bình tích lũy</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{resultsInfo.completedCredits}/{resultsInfo.totalCredits}</div>
            <div className="stat-label">Tín chỉ đã tích lũy</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{resultsInfo.academicRank}</div>
            <div className="stat-label">Xếp loại</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{resultsInfo.disciplineScore}/{resultsInfo.maxDisciplineScore}</div>
            <div className="stat-label">Điểm rèn luyện</div>
          </div>
        </div>
      )}

      {/* Tab điều hướng */}
      <div className="results-tabs">
        <div 
          className={`tab-item ${activeTab === ResultsTabView.OVERVIEW ? "active" : ""}`}
          onClick={() => handleTabChange(ResultsTabView.OVERVIEW)}
        >
          Tổng quan
        </div>
        <div 
          className={`tab-item ${activeTab === ResultsTabView.DETAILS ? "active" : ""}`}
          onClick={() => handleTabChange(ResultsTabView.DETAILS)}
        >
          Bảng điểm chi tiết
        </div>
        <div 
          className={`tab-item ${activeTab === ResultsTabView.DISTRIBUTION ? "active" : ""}`}
          onClick={() => handleTabChange(ResultsTabView.DISTRIBUTION)}
        >
          Phân bố điểm
        </div>
        <div 
          className={`tab-item ${activeTab === ResultsTabView.PROGRESS ? "active" : ""}`}
          onClick={() => handleTabChange(ResultsTabView.PROGRESS)}
        >
          Tiến độ học tập
        </div>
        <div 
          className={`tab-item ${activeTab === ResultsTabView.COMPARISON ? "active" : ""}`}
          onClick={() => handleTabChange(ResultsTabView.COMPARISON)}
        >
          So sánh
        </div>
      </div>

      {/* Bộ lọc và điều khiển */}
      <div className="results-controls">
        <div className="control-group">
          <label htmlFor="semester-select"><i className="fa fa-calendar"></i> Học kỳ:</label>
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
        </div>

        <div className="control-group">
          <label htmlFor="course-type"><i className="fa fa-book"></i> Loại học phần:</label>
          <select 
            id="course-type" 
            value={selectedCourseType}
            onChange={handleCourseTypeChange}
          >
            <option value={CourseType.ALL}>Tất cả</option>
            <option value={CourseType.REQUIRED}>Bắt buộc</option>
            <option value={CourseType.ELECTIVE}>Tự chọn</option>
            <option value={CourseType.GENERAL}>Đại cương</option>
            <option value={CourseType.SPECIALIZED}>Chuyên ngành</option>
          </select>
        </div>

        <div className="action-controls">
          <button className="action-btn" onClick={handlePrint}>
            <i className="fa fa-print"></i> In
          </button>
          <button className="action-btn" onClick={handleExport}>
            <i className="fa fa-download"></i> Xuất file
          </button>
        </div>
      </div>

      {/* Nội dung tab */}
      <div className={`tab-content ${activeTab === ResultsTabView.OVERVIEW ? "active" : ""}`}>
        {/* Kết quả học tập theo dạng lưới */}
        <div className="results-grid">
          {courseResults.slice(0, 4).map((course) => (
            <div className="result-card" key={course.id}>
              <div className="result-header">
                {course.courseName}
                <span className="course-code">{course.courseCode}</span>
              </div>
              <div className="result-body">
                <div className="result-info">
                  <div className="result-row">
                    <div className="result-label">Số tín chỉ</div>
                    <div className="result-value">{course.credits}</div>
                  </div>
                  <div className="result-row">
                    <div className="result-label">Học kỳ</div>
                    <div className="result-value">
                      {course.semester.replace("Học kỳ ", "HK")}
                    </div>
                  </div>
                  <div className="result-row">
                    <div className="result-label">Điểm thành phần</div>
                    <div className="result-value">
                      CC: {course.attendance}, BT: {course.assignment}, TH: {course.practice}, 
                      KT: {course.midterm}, THI: {course.final}
                    </div>
                  </div>
                  <div className="result-row">
                    <div className="result-label">Điểm tổng kết</div>
                    <div className="result-value">{course.total}</div>
                  </div>
                </div>
                <div className="result-grade">
                  <div className="grade-circle">
                    <div className="grade-value">{course.letterGrade}</div>
                    <div className="grade-label">{course.gradePoint.toFixed(1)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`tab-content ${activeTab === ResultsTabView.DETAILS ? "active" : ""}`}>
        {/* Bảng kết quả học tập */}
        <div className="results-table-container">
          <h2 className=""><i className="fa fa-table"></i> Bảng điểm chi tiết</h2>
          <table className="results-table">
            <thead>
              <tr>
                <th rowspan={2}>STT</th>
                <th rowspan={2}>Mã học phần</th>
                <th rowspan={2}>Tên học phần</th>
                <th rowspan={2}>Số TC</th>
                <th rowspan={2}>Học kỳ</th>
                <th colspan={6}>Điểm thành phần</th>
                <th rowspan={2}>Điểm chữ</th>
                <th rowspan={2}>Điểm số</th>
                <th rowspan={2}>Kết quả</th>
              </tr>
              <tr>
                <th title="Chuyên cần">CC</th>
                <th title="Bài tập">BT</th>
                <th title="Thực hành">TH</th>
                <th title="Kiểm tra">KT</th>
                <th title="Thi">THI</th>
                <th title="Tổng kết học phần">TKHP</th>
              </tr>
            </thead>
            <tbody>
              {groupedCourseResults.map((group) => (
                <React.Fragment key={group.semesterId}>
                  {group.semesterId !== "all" && (
                    <tr className="semester-header">
                      <td colSpan={14}>
                        <i className="fa fa-calendar"></i> {group.semesterName}
                      </td>
                    </tr>
                  )}
                  {group.courses.map((course, index) => (
                    <tr key={course.id}>
                      <td>{index + 1}</td>
                      <td>{course.courseCode}</td>
                      <td>{course.courseName}</td>
                      <td>{course.credits}</td>
                      <td>{course.semesterId}</td>
                      <td>{course.attendance}</td>
                      <td>{course.assignment}</td>
                      <td>{course.practice}</td>
                      <td>{course.midterm}</td>
                      <td>{course.final}</td>
                      <td>{course.total}</td>
                      <td>{course.letterGrade}</td>
                      <td>{course.gradePoint.toFixed(1)}</td>
                      <td className={`result-${course.status}`}>
                        {course.status === "passed" ? "Đạt" : 
                         course.status === "failed" ? "Không đạt" : "Đang học"}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`tab-content ${activeTab === ResultsTabView.DISTRIBUTION ? "active" : ""}`}>
        {/* Thống kê điểm theo loại */}
        <div className="grade-distribution">
          <h2 className="section-title"><i className="fa fa-pie-chart"></i> Phân bố điểm</h2>
          <div className="distribution-chart">
            {gradeDistribution.map((item) => (
              <div className="distribution-item" key={item.grade}>
                <div
                  className="distribution-bar"
                  style={{
                    width: `${item.percentage}%`,
                    background: item.color,
                  }}
                >
                  <span className="distribution-value">{item.percentage}%</span>
                </div>
                <div className="distribution-label">{item.grade}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`tab-content ${activeTab === ResultsTabView.PROGRESS ? "active" : ""}`}>
        {/* Tiến độ hoàn thành chương trình học */}
        {academicProgress && (
          <div className="program-progress">
            <h2 className="section-title">
              <i className="fa fa-tasks"></i> Tiến độ hoàn thành chương trình học
            </h2>

            <div className="progress-overview">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${academicProgress.completionPercentage}%` }}
                >
                  {academicProgress.completionPercentage.toFixed(1)}%
                </div>
              </div>
              <div className="progress-stats">
                <div className="progress-stat">
                  <div className="stat-value">
                    {academicProgress.completedCredits}/{academicProgress.totalCredits}
                  </div>
                  <div className="stat-label">Tín chỉ đã tích lũy/Tổng số tín chỉ</div>
                </div>
                <div className="progress-stat">
                  <div className="stat-value">{academicProgress.remainingCredits}</div>
                  <div className="stat-label">Tín chỉ còn lại</div>
                </div>
                <div className="progress-stat">
                  <div className="stat-value">{academicProgress.currentCredits}</div>
                  <div className="stat-label">Tín chỉ đang học</div>
                </div>
              </div>
            </div>

            <div className="progress-details">
              {academicProgress.categories.map((category) => (
                <div className="progress-category" key={category.id}>
                  <div className="category-header">
                    <div className="category-name">
                      <i className={`fa ${category.icon}`}></i> {category.name}
                    </div>
                    <div className="category-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${category.completionPercentage}%` }}
                        >
                          {category.completionPercentage}%
                        </div>
                      </div>
                      <div className="progress-value">
                        {category.completedCredits}/{category.totalCredits} tín chỉ
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={`tab-content ${activeTab === ResultsTabView.COMPARISON ? "active" : ""}`}>
        {/* Tab so sánh - sẽ được phát triển sau */}
        <div className="comparison-placeholder">
          <h2 className="section-title">
            <i className="fa fa-line-chart"></i> So sánh kết quả học tập
          </h2>
          <div className="empty-state">
            <i className="fa fa-info-circle"></i>
            <p>Tính năng đang được phát triển và sẽ sớm được cập nhật.</p>
          </div>
        </div>
      </div>

      {/* Thông tin bổ sung */}
      <div className="alert alert-info">
        <div className="alert-icon">
          <i className="fa fa-info-circle"></i>
        </div>
        <div className="alert-content">
          <div className="alert-title">Thông tin quan trọng</div>
          <div className="alert-message">
            Sinh viên cần đạt tối thiểu 2.0 điểm trung bình tích lũy để được xét tốt
            nghiệp. Nếu có thắc mắc về kết quả học tập, vui lòng liên hệ phòng Đào tạo
            trong vòng 7 ngày kể từ ngày công bố điểm.
          </div>
        </div>
      </div>

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
    </AcademicResultsWrapper>
  );
};

export default AcademicResults;