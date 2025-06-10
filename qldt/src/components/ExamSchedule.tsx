import React, { useEffect, useState } from "react";
import styled from "styled-components";
import useExamSchedule, { ExamTabView } from "../hooks/useExamSchedule";
import { ExamType } from "../services/examScheduleService";

// Styled components
const ExamScheduleWrapper = styled.div`
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
  border-top: 4px solid #e91e63;
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

const ExamSchedule: React.FC = () => {
  // Sử dụng custom hook để lấy dữ liệu và các hàm xử lý
  const {
    examInfo,
    semesters,
    notifications,
    stats,
    regulations,
    groupedExamSchedules,
    selectedSemesterId,
    selectedExamType,
    activeTab,
    searchQuery,
    loading,
    error,
    syncingCalendar,
    changeSemester,
    changeExamType,
    changeTab,
    handleSearch,
    printExamSchedule,
    exportExamSchedule,
    syncCalendar,
    getDaysUntilExam,
    getDayOfWeekName,
  } = useExamSchedule();

  // State để theo dõi việc tải CSS
  const [cssLoaded, setCssLoaded] = useState(false);

  // Load CSS
  useEffect(() => {
    // Thêm link CSS vào head
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/css/lich-thi.css";
    link.onload = () => setCssLoaded(true);
    document.head.appendChild(link);

    // Cleanup khi component unmount
    return () => {
      // Tìm và xóa link CSS
      const links = document.head.getElementsByTagName("link");
      for (let i = 0; i < links.length; i++) {
        if (links[i].href.includes("lich-thi.css")) {
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

  // Xử lý khi thay đổi loại kỳ thi
  const handleExamTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeExamType(e.target.value as ExamType);
  };

  // Xử lý khi thay đổi tab
  const handleTabChange = (tab: ExamTabView) => {
    changeTab(tab);
  };

  // Xử lý khi tìm kiếm
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value);
  };

  // Xử lý khi nhấn nút in
  const handlePrint = () => {
    printExamSchedule();
  };

  // Xử lý khi nhấn nút xuất file
  const handleExport = () => {
    exportExamSchedule("pdf");
  };

  // Xử lý khi nhấn nút đồng bộ với Google Calendar
  const handleSyncCalendar = () => {
    syncCalendar();
  };

  return (
    <ExamScheduleWrapper>
      {/* Hiển thị loading overlay khi đang tải dữ liệu */}
      {loading && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}

      {/* Tiêu đề trang */}
      <h1 className="page-title">
        <i className="fa fa-calendar-check-o" style={{ color: "#e91e63" }}></i>
        <p style={{ color: "black" }}>Lịch thi</p>
      </h1>

      {/* Bộ lọc và điều khiển */}
      <div className="filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm lịch thi..."
            id="subject-filter"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button>
            <i className="fa fa-search"></i>
          </button>
        </div>
        <div className="filter-options">
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
          <select
            id="exam-type"
            value={selectedExamType}
            onChange={handleExamTypeChange}
          >
            <option value={ExamType.ALL}>Tất cả kỳ thi</option>
            <option value={ExamType.MIDTERM}>Giữa kỳ</option>
            <option value={ExamType.FINAL}>Cuối kỳ</option>
            <option value={ExamType.MAKEUP}>Thi lại</option>
          </select>
        </div>
      </div>

      {/* Thông báo quan trọng */}
      {notifications.length > 0 && (
        <div className="notification-item unread">
          <div className="notification-icon important">
            <i className="fa fa-exclamation"></i>
          </div>
          <div className="notification-content">
            <div className="notification-title">
              {notifications[0].title}
              <span className="notification-badge badge-important">
                Quan trọng
              </span>
            </div>
            <div className="notification-meta">
              <span>
                <i className="fa fa-calendar"></i> Ngày đăng:{" "}
                {notifications[0].date}
              </span>
              <span>
                <i className="fa fa-user"></i> Người đăng:{" "}
                {notifications[0].author}
              </span>
            </div>
            <div className="notification-preview">
              {notifications[0].content
                .split("\n\n")
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Thống kê kỳ thi */}
      {stats && (
        <div className="dashboard-cards">
          <div className="card card-orange">
            <div className="card-icon">
              <i className="fa fa-calendar"></i>
            </div>
            <div className="card-value">{stats.totalExams}</div>
            <div className="card-label">Môn thi</div>
            <div className="card-details">
              <small>
                {semesters.find((s) => s.id === selectedSemesterId)?.name}
              </small>
              <small>Cập nhật: {stats.lastUpdated}</small>
            </div>
          </div>
          <div className="card card-blue">
            <div className="card-icon">
              <i className="fa fa-clock-o"></i>
            </div>
            <div className="card-value">{stats.daysUntilExam}</div>
            <div className="card-label">Ngày đến kỳ thi</div>
            <div className="card-details">
              <small>{stats.examType}</small>
              <small>Bắt đầu: {stats.nextExamDate}</small>
            </div>
          </div>
          <div className="card card-green">
            <div className="card-icon">
              <i className="fa fa-check-circle"></i>
            </div>
            <div className="card-value">{stats.completedExams}</div>
            <div className="card-label">Môn đã thi</div>
            <div className="card-details">
              <small>Còn lại: {stats.remainingExams} môn</small>
              <small>Cập nhật: {stats.lastUpdated}</small>
            </div>
          </div>
          <div className="card card-pink">
            <div className="card-icon">
              <i className="fa fa-file-text"></i>
            </div>
            <div className="card-value">{stats.examRooms.length}</div>
            <div className="card-label">Phòng thi</div>
            <div className="card-details">
              <small>{stats.examRooms.join(", ")}</small>
              <small>Xem chi tiết bên dưới</small>
            </div>
          </div>
        </div>
      )}

      {/* Tabs cho các loại lịch thi */}
      <div className="dashboard-preview">
        <h2 style={{ color: "black" }}>
          Lịch thi {semesters.find((s) => s.id === selectedSemesterId)?.name}
        </h2>

        {/* Tabs cho các loại kỳ thi */}
        <div className="exam-tabs">
          <div
            className={`tab ${
              activeTab === ExamTabView.UPCOMING ? "active" : ""
            }`}
            data-tab="upcoming"
            onClick={() => handleTabChange(ExamTabView.UPCOMING)}
          >
            Sắp tới
          </div>
          <div
            className={`tab ${activeTab === ExamTabView.ALL ? "active" : ""}`}
            data-tab="all"
            onClick={() => handleTabChange(ExamTabView.ALL)}
          >
            Tất cả môn thi
          </div>
          <div
            className={`tab ${
              activeTab === ExamTabView.COMPLETED ? "active" : ""
            }`}
            data-tab="completed"
            onClick={() => handleTabChange(ExamTabView.COMPLETED)}
          >
            Đã thi
          </div>
        </div>

        {/* Nội dung tab lịch thi sắp tới */}
        <div
          className={`tab-content ${
            activeTab === ExamTabView.UPCOMING ? "active" : ""
          }`}
          id="upcoming-content"
        >
          {groupedExamSchedules.length > 0 ? (
            <div className="exam-timeline">
              {groupedExamSchedules.map((group) => {
                const [day, month, year] = group.date.split("/");
                const examDate = new Date(`${year}-${month}-${day}`);
                const dayOfWeek =
                  examDate.getDay() === 0 ? 8 : examDate.getDay() + 1; // Chuyển đổi 0 (Chủ nhật) thành 8, và các ngày khác +1
                const dayName = getDayOfWeekName(dayOfWeek);
                const daysUntil = getDaysUntilExam(group.date);

                return (
                  <div className="timeline-item" key={group.date}>
                    <div className="timeline-date">
                      <div className="date-day">{day}</div>
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <span>
                          {dayName}, {group.date}
                        </span>
                        <span className="date-full">
                          {daysUntil === 0
                            ? "Hôm nay"
                            : daysUntil === 1
                            ? "Ngày mai"
                            : `${daysUntil} ngày nữa`}
                        </span>
                      </div>
                      <div className="exam-cards">
                        {group.exams.map((exam) => (
                          <div className="exam-card" key={exam.id}>
                            <div className="exam-time">
                              {exam.startTime} - {exam.endTime}
                            </div>
                            <div className="exam-details">
                              <div className="exam-subject">
                                {exam.courseName}
                              </div>
                              <div className="exam-info">
                                <span>
                                  <i className="fa fa-map-marker"></i> Phòng{" "}
                                  {exam.room}
                                </span>
                                <span>
                                  <i className="fa fa-users"></i> Lớp:{" "}
                                  {exam.className}
                                </span>
                                <span>
                                  <i className="fa fa-info-circle"></i> Hình
                                  thức: {exam.examFormat}
                                </span>
                                <span>
                                  <i className="fa fa-book"></i> Mã HP:{" "}
                                  {exam.courseCode}
                                </span>
                              </div>
                            </div>
                            <div className="exam-status">
                              <span className={`status-${exam.status}`}>
                                {exam.status === "upcoming"
                                  ? "Sắp tới"
                                  : exam.status === "completed"
                                  ? "Đã thi"
                                  : "Đã hủy"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <i className="fa fa-info-circle"></i>
              <p>Không tìm thấy lịch thi nào sắp tới.</p>
            </div>
          )}
        </div>

        {/* Nội dung tab tất cả môn thi */}
        <div
          className={`tab-content ${
            activeTab === ExamTabView.ALL ? "active" : ""
          }`}
          id="all-content"
        >
          {/* Bảng lịch thi chi tiết */}
          <div className="exam-schedule-table">
            <div className="table-container">
              <table className="exam-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã học phần</th>
                    <th>Tên học phần</th>
                    <th>Ngày thi</th>
                    <th>Giờ thi</th>
                    <th>Phòng thi</th>
                    <th>Hình thức</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedExamSchedules.flatMap((group, groupIndex) =>
                    group.exams.map((exam, examIndex) => (
                      <tr key={exam.id}>
                        <td>
                          {groupIndex * group.exams.length + examIndex + 1}
                        </td>
                        <td>{exam.courseCode}</td>
                        <td>{exam.courseName}</td>
                        <td>{exam.examDate}</td>
                        <td>
                          {exam.startTime} - {exam.endTime}
                        </td>
                        <td>{exam.room}</td>
                        <td>{exam.examFormat}</td>
                        <td>{exam.notes}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Nội dung tab đã thi */}
        <div
          className={`tab-content ${
            activeTab === ExamTabView.COMPLETED ? "active" : ""
          }`}
          id="completed-content"
        >
          <div className="empty-state">
            <i className="fa fa-info-circle"></i>
            <p>Chưa có môn thi nào đã hoàn thành trong học kỳ này.</p>
          </div>
        </div>
      </div>

      {/* Quy định thi */}
      <div className="exam-regulations">
        <h2 style={{ color: "black" }}>Quy định thi</h2>

        <div className="regulations-content">
          {regulations.map((regulation) => (
            <div className="regulation-item" key={regulation.id}>
              <div className="regulation-icon">
                <i className={`fa ${regulation.icon}`}></i>
              </div>
              <div className="regulation-text">
                <h3>{regulation.title}</h3>
                <p>{regulation.content}</p>
              </div>
            </div>
          ))}
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
    </ExamScheduleWrapper>
  );
};

export default ExamSchedule;
