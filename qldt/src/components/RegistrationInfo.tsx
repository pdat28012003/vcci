import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useRegistrationInfo from "../hooks/useRegistrationInfo";
import { formatDate } from "../utils/formatters";

// Styled components
const RegistrationInfoWrapper = styled.div`
  padding: 1rem 0;
`;

const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

const ErrorContainer = styled.div`
  background-color: #ffebee;
  border-left: 4px solid #f44336;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 4px;
`;

const TabNavigation = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  overflow-x: auto;
  white-space: nowrap;
`;

const TabItem = styled.div<{ active: boolean }>`
  padding: 12px 20px;
  cursor: pointer;
  font-weight: 600;
  color: ${(props) => (props.active ? "#2196f3" : "#666")};
  border-bottom: 3px solid
    ${(props) => (props.active ? "#2196f3" : "transparent")};
  transition: all 0.3s ease;

  &:hover {
    color: #2196f3;
  }
`;

const FaqFilterContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
`;

const FaqFilterItem = styled.div<{ active: boolean }>`
  padding: 8px 15px;
  border-radius: 20px;
  background-color: ${(props) => (props.active ? "#2196f3" : "#f5f5f5")};
  color: ${(props) => (props.active ? "white" : "#666")};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.active ? "#1976d2" : "#e0e0e0")};
  }
`;

const AccordionItem = styled.div`
  margin-bottom: 10px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  overflow: hidden;
`;

const AccordionHeader = styled.div<{ active: boolean }>`
  padding: 15px;
  background-color: #f9f9f9;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const AccordionContent = styled.div<{ active: boolean }>`
  padding: ${(props) => (props.active ? "15px" : "0 15px")};
  max-height: ${(props) => (props.active ? "1000px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
`;

const RegistrationInfo: React.FC = () => {
  // State cho accordion
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  // Sử dụng hook
  const {
    currentSemester,
    upcomingSemester,
    academicProgress,
    registrationSchedule,
    registrationRules,
    notifications,
    registrationGuide,
    faqs,
    loading,
    error,
    activeTab,
    activeFaqCategory,
    handleTabChange,
    handleFaqCategoryChange,
    filteredFaqs,
    refreshData,
    formatSemester,
    getSemesterStatusText,
    getSemesterStatusColor,
  } = useRegistrationInfo();

  // Load CSS
  useEffect(() => {
    // Thêm link CSS vào head
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/css/thong-tin-dang-ky-hoc-phan.css";
    document.head.appendChild(link);

    // Cleanup khi component unmount
    return () => {
      // Tìm và xóa link CSS
      const links = document.head.getElementsByTagName("link");
      for (let i = 0; i < links.length; i++) {
        if (links[i].href.includes("thong-tin-dang-ky-hoc-phan.css")) {
          document.head.removeChild(links[i]);
          break;
        }
      }
    };
  }, []);

  // Xử lý toggle FAQ
  const toggleFaq = (id: string) => {
    if (activeFaq === id) {
      setActiveFaq(null);
    } else {
      setActiveFaq(id);
    }
  };

  // Hiển thị loading
  if (loading) {
    return (
      <LoadingOverlay>
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </LoadingOverlay>
    );
  }

  // Hiển thị lỗi
  if (error) {
    return (
      <ErrorContainer className="error-container">
        <h3 className="error-title">
          <i className="fa fa-exclamation-circle"></i> Đã xảy ra lỗi
        </h3>
        <p className="error-message">{error}</p>
        <button className="retry-button" onClick={refreshData}>
          Thử lại
        </button>
      </ErrorContainer>
    );
  }

  return (
    <RegistrationInfoWrapper>
      {/* Tiêu đề trang */}
      <div className="page-header">
        <h1 className="page-title">
          <i className="fa fa-info-circle" style={{ color: "#2196f3" }}></i>{" "}
          Thông tin đăng ký học phần
        </h1>
        <p className="page-subtitle">
          Thông tin chi tiết về quy trình và kế hoạch đăng ký học phần
        </p>
      </div>

      {/* Thông báo quan trọng */}
      {notifications.length > 0 && notifications.some((n) => n.important) && (
        <div className="notification">
          <h3>
            <i className="fa fa-bell"></i> Thông báo quan trọng
          </h3>
          <p>{notifications.find((n) => n.important)?.content}</p>
        </div>
      )}

      {/* Tab Navigation */}
      <TabNavigation>
        <TabItem
          active={activeTab === "info"}
          onClick={() => handleTabChange("info")}
        >
          Thông tin chung
        </TabItem>
        <TabItem
          active={activeTab === "schedule"}
          onClick={() => handleTabChange("schedule")}
        >
          Lịch trình đăng ký
        </TabItem>
        <TabItem
          active={activeTab === "rules"}
          onClick={() => handleTabChange("rules")}
        >
          Quy định
        </TabItem>
        <TabItem
          active={activeTab === "guide"}
          onClick={() => handleTabChange("guide")}
        >
          Hướng dẫn
        </TabItem>
        <TabItem
          active={activeTab === "faq"}
          onClick={() => handleTabChange("faq")}
        >
          Câu hỏi thường gặp
        </TabItem>
      </TabNavigation>

      {/* Nội dung tab */}
      {activeTab === "info" && (
        <>
          {/* Thông tin học kỳ hiện tại */}
          <div className="info-card">
            <h2>
              <i className="fa fa-calendar-check"></i> Thông tin học kỳ hiện tại
            </h2>

            <div className="semester-info">
              {currentSemester && (
                <div className="semester-card">
                  <h3>
                    <i className="fa fa-calendar"></i> Học kỳ hiện tại
                  </h3>
                  <p>
                    Học kỳ:{" "}
                    <span className="value">
                      {formatSemester(currentSemester)}
                    </span>
                  </p>
                  <p>
                    Thời gian bắt đầu:{" "}
                    <span className="value">
                      {formatDate(currentSemester.startDate)}
                    </span>
                  </p>
                  <p>
                    Thời gian kết thúc:{" "}
                    <span className="value">
                      {formatDate(currentSemester.endDate)}
                    </span>
                  </p>
                  <p>
                    Trạng thái:
                    <span
                      className="value"
                      style={{
                        color: getSemesterStatusColor(currentSemester.status),
                      }}
                    >
                      {getSemesterStatusText(currentSemester.status)}
                    </span>
                  </p>
                </div>
              )}

              {upcomingSemester && (
                <div className="semester-card">
                  <h3>
                    <i className="fa fa-calendar-plus"></i> Học kỳ sắp tới
                  </h3>
                  <p>
                    Học kỳ:{" "}
                    <span className="value">
                      {formatSemester(upcomingSemester)}
                    </span>
                  </p>
                  <p>
                    Thời gian bắt đầu:{" "}
                    <span className="value">
                      {formatDate(upcomingSemester.startDate)}
                    </span>
                  </p>
                  <p>
                    Thời gian kết thúc:{" "}
                    <span className="value">
                      {formatDate(upcomingSemester.endDate)}
                    </span>
                  </p>
                  <p>
                    Trạng thái:
                    <span
                      className="value"
                      style={{
                        color: getSemesterStatusColor(upcomingSemester.status),
                      }}
                    >
                      {getSemesterStatusText(upcomingSemester.status)}
                    </span>
                  </p>
                </div>
              )}

              {academicProgress && (
                <div className="semester-card">
                  <h3>
                    <i className="fa fa-graduation-cap"></i> Tiến độ học tập
                  </h3>
                  <p>
                    Tổng số tín chỉ đã tích lũy:{" "}
                    <span className="value">
                      {academicProgress.completedCredits}/
                      {academicProgress.totalCredits}
                    </span>
                  </p>
                  <p>
                    Số tín chỉ đang học:{" "}
                    <span className="value">
                      {academicProgress.currentCredits}
                    </span>
                  </p>
                  <p>
                    Số tín chỉ còn phải học:{" "}
                    <span className="value">
                      {academicProgress.remainingCredits}
                    </span>
                  </p>
                  <p>
                    Dự kiến tốt nghiệp:{" "}
                    <span className="value">
                      {formatDate(academicProgress.expectedGraduationDate)
                        .split("/")
                        .slice(1)
                        .join("/")}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Thông báo đăng ký học phần */}
          {notifications.length > 0 && (
            <div className="info-card">
              <h2>
                <i className="fa fa-bell"></i> Thông báo đăng ký học phần
              </h2>

              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification ${
                    notification.important ? "warning" : ""
                  }`}
                >
                  <h3>{notification.title}</h3>
                  <p>{notification.content}</p>
                  <small>Ngày đăng: {formatDate(notification.date)}</small>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "schedule" && (
        <div className="info-card">
          <h2>
            <i className="fa fa-clock"></i> Lịch trình đăng ký học phần -{" "}
            {upcomingSemester && formatSemester(upcomingSemester)}
          </h2>

          <div className="timeline">
            {registrationSchedule.map((phase) => (
              <div key={phase.id} className={`timeline-item ${phase.status}`}>
                <div className="timeline-date">
                  {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                </div>
                <div className="timeline-content">
                  <h4>{phase.name}</h4>
                  <p>{phase.description}</p>
                  {phase.eligibility && (
                    <p>
                      <strong>Đối tượng:</strong> {phase.eligibility}
                    </p>
                  )}
                  {phase.timeSlot && (
                    <p>
                      <strong>Thời gian:</strong> {phase.timeSlot}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "rules" && (
        <div className="info-card">
          <h2>
            <i className="fa fa-book"></i> Quy định đăng ký học phần
          </h2>

          <table className="info-table">
            <thead>
              <tr>
                <th>Quy định</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {registrationRules.map((rule) => (
                <tr key={rule.id}>
                  <td>{rule.name}</td>
                  <td>{rule.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "guide" && (
        <div className="info-card">
          <h2>
            <i className="fa fa-question-circle"></i> Hướng dẫn đăng ký học phần
          </h2>

          <div className="guide-container">
            {registrationGuide.map((guide) => (
              <div key={guide.id} className="guide-item">
                <h3 className="guide-title">{guide.title}</h3>
                <p className="guide-description">{guide.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "faq" && (
        <div className="info-card">
          <h2>
            <i className="fa fa-question-circle"></i> Câu hỏi thường gặp
          </h2>

          <FaqFilterContainer>
            <FaqFilterItem
              active={activeFaqCategory === "all"}
              onClick={() => handleFaqCategoryChange("all")}
            >
              Tất cả
            </FaqFilterItem>
            <FaqFilterItem
              active={activeFaqCategory === "general"}
              onClick={() => handleFaqCategoryChange("general")}
            >
              Chung
            </FaqFilterItem>
            <FaqFilterItem
              active={activeFaqCategory === "technical"}
              onClick={() => handleFaqCategoryChange("technical")}
            >
              Kỹ thuật
            </FaqFilterItem>
            <FaqFilterItem
              active={activeFaqCategory === "policy"}
              onClick={() => handleFaqCategoryChange("policy")}
            >
              Chính sách
            </FaqFilterItem>
          </FaqFilterContainer>

          <div className="accordion">
            {filteredFaqs().map((faq) => (
              <AccordionItem key={faq.id}>
                <AccordionHeader
                  active={activeFaq === faq.id}
                  onClick={() => toggleFaq(faq.id)}
                >
                  {faq.question}
                  <i className={`fa fa-chevron-down`}></i>
                </AccordionHeader>
                <AccordionContent active={activeFaq === faq.id}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </div>
        </div>
      )}

      {/* Nút điều hướng */}
      <div className="button-group">
        <button className="btn btn-primary">
          <i className="fa fa-edit"></i> Đăng ký học phần
        </button>
        <button className="btn btn-secondary">
          <i className="fa fa-list"></i> Xem kết quả đăng ký
        </button>
        <button className="btn btn-secondary">
          <i className="fa fa-print"></i> In thông tin
        </button>
      </div>
    </RegistrationInfoWrapper>
  );
};

export default RegistrationInfo;
