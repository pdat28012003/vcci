import React, { useEffect } from "react";
import styled from "styled-components";
import useSchedule, { ScheduleViewMode } from "../hooks/useSchedule";

// Styled components
const ScheduleWrapper = styled.div`
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

const Schedule: React.FC = () => {
  // Sử dụng custom hook để lấy dữ liệu và các hàm xử lý
  const {
    scheduleInfo,
    semesters,
    weeks,
    weekSchedule,
    periodTimes,
    selectedSemesterId,
    selectedWeekId,
    viewMode,
    loading,
    scheduleLoading,
    error,
    syncingCalendar,
    changeSemester,
    changeWeek,
    navigateWeek,
    changeViewMode,
    printSchedule,
    exportSchedule,
    syncCalendar,
    getCurrentWeekInfo,
    refreshData,
  } = useSchedule();

  // Load CSS
  useEffect(() => {
    // Thêm link CSS vào head
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/css/thoi-khoa-bieu.css";
    document.head.appendChild(link);

    // Cleanup khi component unmount
    return () => {
      // Tìm và xóa link CSS
      const links = document.head.getElementsByTagName("link");
      for (let i = 0; i < links.length; i++) {
        if (links[i].href.includes("thoi-khoa-bieu.css")) {
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

  // Xử lý khi thay đổi tuần
  const handleWeekChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeWeek(e.target.value);
  };

  // Xử lý khi thay đổi chế độ xem
  const handleViewChange = (mode: ScheduleViewMode) => {
    changeViewMode(mode);
  };

  // Xử lý khi nhấn nút in
  const handlePrint = () => {
    printSchedule();
  };

  // Xử lý khi nhấn nút xuất file
  const handleExport = () => {
    exportSchedule("pdf");
  };

  // Xử lý khi nhấn nút đồng bộ với Google Calendar
  const handleSyncCalendar = () => {
    syncCalendar();
  };

  // Lấy thông tin tuần hiện tại
  // Sử dụng useMemo để tránh tính toán lại mỗi khi render
  const currentWeekInfo = React.useMemo(() => {
    return getCurrentWeekInfo();
  }, [getCurrentWeekInfo, selectedWeekId, weeks]);

  // Tạo lưới thời gian cho thời khóa biểu
  const renderTimeGrid = React.useCallback(() => {
    // Tạo mảng các ngày trong tuần
    const daysOfWeek = [
      { day: 2, name: "Thứ 2" },
      { day: 3, name: "Thứ 3" },
      { day: 4, name: "Thứ 4" },
      { day: 5, name: "Thứ 5" },
      { day: 6, name: "Thứ 6" },
      { day: 7, name: "Thứ 7" },
      { day: 8, name: "Chủ nhật" },
    ];

    // Lấy ngày từ lịch học
    const getDayDate = (dayOfWeek: number) => {
      if (!weekSchedule || weekSchedule.length === 0) return "";

      const classOnDay = weekSchedule.find(
        (cls) => cls.dayOfWeek === dayOfWeek
      );
      if (classOnDay) {
        const dateParts = classOnDay.date.split("-");
        return dateParts[2];
      }
      return "";
    };

    // Tạo các lớp học cho mỗi ngày
    const getClassesForDay = (dayOfWeek: number) => {
      if (!weekSchedule || weekSchedule.length === 0) return [];

      // Lọc các lớp học theo ngày
      const classesForDay = weekSchedule.filter(
        (cls) => cls.dayOfWeek === dayOfWeek
      );

      // Nhóm các lớp học theo tiết bắt đầu để xử lý trùng lịch
      const classesByPeriod = classesForDay.reduce((acc, cls) => {
        const key = cls.startPeriod;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(cls);
        return acc;
      }, {} as Record<number, typeof classesForDay>);

      // Mảng màu sắc cho các lớp học
      const colors = [
        { bg: "rgba(33, 150, 243, 0.1)", border: "#2196f3" },
        { bg: "rgba(76, 175, 80, 0.1)", border: "#4CAF50" },
        { bg: "rgba(255, 152, 0, 0.1)", border: "#FF9800" },
        { bg: "rgba(156, 39, 176, 0.1)", border: "#9C27B0" },
        { bg: "rgba(233, 30, 99, 0.1)", border: "#E91E63" },
      ];

      // Tạo các phần tử React cho từng lớp học
      const result = [];

      for (const [startPeriod, classes] of Object.entries(classesByPeriod)) {
        // Nếu chỉ có 1 lớp học trong tiết này
        if (classes.length === 1) {
          const cls = classes[0];
          // Chọn màu dựa trên mã môn học
          const colorIndex =
            cls.courseCode.charCodeAt(cls.courseCode.length - 1) %
            colors.length;
          const color = colors[colorIndex];

          result.push(
            <div
              key={cls.id}
              className="class-item"
              style={{
                gridRow: `${cls.startPeriod} / span ${
                  cls.endPeriod - cls.startPeriod + 1
                }`,
                zIndex: cls.startPeriod,
                backgroundColor: color.bg,
                borderLeftColor: color.border,
              }}
            >
              <div className="class-name">{cls.courseName}</div>
              <div className="class-info">
                <div>
                  <i className="fa fa-map-marker"></i> {cls.room}
                </div>
                <div>
                  <i className="fa fa-user"></i> {cls.instructor}
                </div>
              </div>
            </div>
          );
        }
        // Nếu có nhiều lớp học trong cùng tiết
        else {
          for (let i = 0; i < classes.length; i++) {
            const cls = classes[i];
            // Chọn màu dựa trên mã môn học
            const colorIndex =
              cls.courseCode.charCodeAt(cls.courseCode.length - 1) %
              colors.length;
            const color = colors[colorIndex];

            result.push(
              <div
                key={cls.id}
                className="class-item multiple"
                style={{
                  gridRow: `${cls.startPeriod} / span ${
                    cls.endPeriod - cls.startPeriod + 1
                  }`,
                  zIndex: cls.startPeriod,
                  left: `${i * 5}px`,
                  width: `calc(100% - ${i * 5}px)`,
                  opacity: 1 - i * 0.1,
                  backgroundColor: color.bg,
                  borderLeftColor: color.border,
                }}
              >
                <div className="class-name">{cls.courseName}</div>
                <div className="class-info">
                  <div>
                    <i className="fa fa-map-marker"></i> {cls.room}
                  </div>
                  <div>
                    <i className="fa fa-user"></i> {cls.instructor}
                  </div>
                </div>
              </div>
            );
          }
        }
      }

      return result;
    };

    return (
      <div className="schedule-grid card">
        {/* Cột thời gian */}
        <div className="time-column">
          <div className="day-header">
            Thời gian
            <br />
            <small>
              <i className="fa fa-clock-o"></i>
            </small>
          </div>
          {periodTimes && periodTimes.length > 0 ? (
            periodTimes.map((period) => (
              <div key={period.period} className="time-slot">
                <span className="period">Tiết {period.period}</span>
                <span className="time">
                  {period.startTime} - {period.endTime}
                </span>
              </div>
            ))
          ) : (
            <div className="time-slot">
              <span className="period">Đang tải...</span>
            </div>
          )}
        </div>

        {/* Các cột ngày trong tuần */}
        {daysOfWeek.map((day) => (
          <div key={day.day} className="day-column">
            <div className="day-header">
              {day.name}
              <br />
              <small>{getDayDate(day.day)}</small>
            </div>
            <div className="day-schedule">{getClassesForDay(day.day)}</div>
          </div>
        ))}
      </div>
    );
  }, [periodTimes, weekSchedule]);

  // Tạo danh sách lịch học
  const renderScheduleList = React.useCallback(() => {
    // Kiểm tra dữ liệu
    if (!weekSchedule || weekSchedule.length === 0) {
      return (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            backgroundColor: "white",
            borderRadius: "8px",
          }}
        >
          Không có lịch học nào trong tuần này
        </div>
      );
    }

    // Nhóm lịch học theo ngày
    const scheduleByDay = weekSchedule.reduce((acc, cls) => {
      const day = cls.dayOfWeek;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(cls);
      return acc;
    }, {} as Record<number, typeof weekSchedule>);

    // Sắp xếp các ngày
    const sortedDays = Object.keys(scheduleByDay)
      .map(Number)
      .sort((a, b) => a - b);

    // Lấy tên ngày
    const getDayName = (day: number) => {
      switch (day) {
        case 2:
          return "Thứ 2";
        case 3:
          return "Thứ 3";
        case 4:
          return "Thứ 4";
        case 5:
          return "Thứ 5";
        case 6:
          return "Thứ 6";
        case 7:
          return "Thứ 7";
        case 8:
          return "Chủ nhật";
        default:
          return `Ngày ${day}`;
      }
    };

    // Lấy ngày từ lịch học
    const getDayDate = (day: number) => {
      const classOnDay = scheduleByDay[day][0];
      if (classOnDay) {
        const dateParts = classOnDay.date.split("-");
        return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      }
      return "";
    };

    return (
      <div className="schedule-list">
        {sortedDays.map((day) => (
          <div key={day} className="list-day">
            <div className="list-day-header">
              {getDayName(day)} ({getDayDate(day)})
            </div>
            <div className="list-classes">
              {scheduleByDay[day]
                .sort((a, b) => a.startPeriod - b.startPeriod)
                .map((cls) => (
                  <div key={cls.id} className="list-class-item">
                    <div className="class-time">
                      {cls.startTime} - {cls.endTime}
                    </div>
                    <div className="class-details">
                      <div className="class-name">{cls.courseName}</div>
                      <div className="class-info">
                        <span>
                          <i className="fa fa-map-marker"></i> Phòng {cls.room}
                        </span>
                        <span>
                          <i className="fa fa-user"></i> GV: {cls.instructor}
                        </span>
                        <span>
                          <i className="fa fa-users"></i> Lớp: {cls.className}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

        {sortedDays.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              backgroundColor: "white",
              borderRadius: "8px",
            }}
          >
            Không có lịch học nào trong tuần này
          </div>
        )}
      </div>
    );
  }, [weekSchedule]);

  return (
    <ScheduleWrapper>
      {/* Hiển thị loading overlay khi đang tải dữ liệu */}
      {loading && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}

      {/* Tiêu đề trang */}
      <div className="page-header">
        <h1 className="page-title">
          <i className="fa fa-calendar" style={{ color: "#2196f3" }}></i> Thời
          khóa biểu
        </h1>
        <p className="page-subtitle">Quản lý và theo dõi lịch học của bạn</p>
      </div>

      {/* Bộ lọc và điều khiển */}
      <div className="schedule-controls card">
        <div className="control-section">
          <div className="control-group">
            <label htmlFor="semester-select">
              <i className="fa fa-graduation-cap"></i> Học kỳ
            </label>
            <select
              id="semester-select"
              className="form-select"
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
            <label htmlFor="week-select">
              <i className="fa fa-calendar-check-o"></i> Tuần học
            </label>
            <select
              id="week-select"
              className="form-select"
              value={selectedWeekId}
              onChange={handleWeekChange}
            >
              {weeks.map((week) => (
                <option key={week.id} value={week.id}>
                  {week.id === "current"
                    ? `Tuần hiện tại (${week.startDate.split("-")[2]}/${
                        week.startDate.split("-")[1]
                      } - ${week.endDate.split("-")[2]}/${
                        week.endDate.split("-")[1]
                      }/${week.endDate.split("-")[0]})`
                    : week.id === "next"
                    ? `Tuần sau (${week.startDate.split("-")[2]}/${
                        week.startDate.split("-")[1]
                      } - ${week.endDate.split("-")[2]}/${
                        week.endDate.split("-")[1]
                      }/${week.endDate.split("-")[0]})`
                    : `${week.name} (${week.startDate.split("-")[2]}/${
                        week.startDate.split("-")[1]
                      } - ${week.endDate.split("-")[2]}/${
                        week.endDate.split("-")[1]
                      }/${week.endDate.split("-")[0]})`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="control-section">
          <div className="view-controls btn-group">
            <button
              className={`btn btn-primary ${
                viewMode === ScheduleViewMode.WEEK ? "active" : ""
              }`}
              onClick={() => handleViewChange(ScheduleViewMode.WEEK)}
            >
              <i className="fa fa-calendar"></i> Tuần
            </button>
            <button
              className={`btn btn-primary ${
                viewMode === ScheduleViewMode.LIST ? "active" : ""
              }`}
              onClick={() => handleViewChange(ScheduleViewMode.LIST)}
            >
              <i className="fa fa-list"></i> Danh sách
            </button>
          </div>

          <div className="action-controls">
            <button
              className="btn btn-outline"
              onClick={handlePrint}
              title="In thời khóa biểu"
            >
              <i className="fa fa-print"></i>
            </button>
            <button
              className="btn btn-outline"
              onClick={handleExport}
              title="Xuất file PDF"
            >
              <i className="fa fa-download"></i>
            </button>
            <button
              className="btn btn-outline"
              onClick={handleSyncCalendar}
              title="Đồng bộ với Google Calendar"
              disabled={syncingCalendar}
            >
              <i
                className={`fa ${
                  syncingCalendar ? "fa-spinner fa-spin" : "fa-refresh"
                }`}
              ></i>
            </button>
          </div>
        </div>
      </div>

      {/* Điều hướng tuần */}
      <div className="week-navigation card">
        <button
          className="btn btn-outline"
          onClick={() => navigateWeek("prev")}
        >
          <i className="fa fa-chevron-left"></i> Tuần trước
        </button>
        <div className="current-week">
          {currentWeekInfo && (
            <>
              <span className="week-label">{currentWeekInfo.label}</span>
              <span className="week-date">{currentWeekInfo.dateRange}</span>
            </>
          )}
        </div>
        <button
          className="btn btn-outline"
          onClick={() => navigateWeek("next")}
        >
          Tuần sau <i className="fa fa-chevron-right"></i>
        </button>
      </div>

      {/* Hiển thị loading khi đang tải lịch học */}
      {scheduleLoading ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <LoadingSpinner style={{ margin: "0 auto" }} />
          <div style={{ marginTop: "1rem" }}>Đang tải thời khóa biểu...</div>
        </div>
      ) : (
        <>
          {/* Chế độ xem theo tuần */}
          <div
            id="week-view"
            className={`schedule-view ${
              viewMode === ScheduleViewMode.WEEK ? "active" : ""
            }`}
          >
            {periodTimes && periodTimes.length > 0 ? (
              renderTimeGrid()
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  backgroundColor: "white",
                  borderRadius: "8px",
                }}
              >
                Đang tải dữ liệu thời khóa biểu...
              </div>
            )}
          </div>

          {/* Chế độ xem danh sách */}
          <div
            id="list-view"
            className={`schedule-view ${
              viewMode === ScheduleViewMode.LIST ? "active" : ""
            }`}
          >
            {weekSchedule ? (
              renderScheduleList()
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  backgroundColor: "white",
                  borderRadius: "8px",
                }}
              >
                Đang tải dữ liệu thời khóa biểu...
              </div>
            )}
          </div>
        </>
      )}

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
    </ScheduleWrapper>
  );
};

export default Schedule;
