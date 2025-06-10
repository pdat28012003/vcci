import React from 'react';
import styled from 'styled-components';

const DashboardWrapper = styled.div`
  padding: 20px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.text};
  
  i {
    margin-right: 10px;
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const DashboardCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const Card = styled.div<{ color: string }>`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border-top: 4px solid ${({ color }) => color};
`;

const CardIcon = styled.div`
  font-size: 24px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.primary};
`;

const CardValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 5px;
`;

const CardLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 10px;
`;

const CardDetails = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
  
  small {
    margin-bottom: 3px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 500;
  margin: 30px 0 20px;
  color: ${({ theme }) => theme.colors.text};
`;

const DashboardHighlights = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const HighlightSection = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
`;

const HighlightHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: ${({ theme }) => theme.colors.light};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  h3 {
    font-size: 16px;
    font-weight: 500;
    margin: 0;
    
    i {
      margin-right: 8px;
      color: ${({ theme }) => theme.colors.primary};
    }
  }
  
  .view-all {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.accent};
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const HighlightContent = styled.div`
  padding: 15px 20px;
`;

const NotificationItem = styled.div<{ unread?: boolean }>`
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ unread, theme }) => unread ? 'rgba(74, 144, 226, 0.05)' : 'transparent'};
  
  &:last-child {
    border-bottom: none;
  }
`;

const NotificationIcon = styled.div<{ type: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  background-color: ${({ type }) => {
    switch (type) {
      case 'important': return '#ff6b6b';
      case 'event': return '#4a90e2';
      default: return '#aaa';
    }
  }};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  flex-shrink: 0;
`;

const NotificationContent = styled.div`
  flex-grow: 1;
`;

const NotificationTitle = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

const NotificationBadge = styled.span<{ type: string }>`
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  background-color: ${({ type }) => {
    switch (type) {
      case 'important': return '#ff6b6b';
      case 'new': return '#4a90e2';
      default: return '#aaa';
    }
  }};
  color: white;
  font-weight: 400;
`;

const NotificationMeta = styled.div`
  display: flex;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
  
  span {
    margin-right: 15px;
    
    i {
      margin-right: 5px;
    }
  }
`;

const ScheduleItem = styled.div`
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ScheduleTime = styled.div`
  width: 100px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

const ScheduleDetails = styled.div`
  flex-grow: 1;
`;

const ScheduleSubject = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;

const ScheduleMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
  
  span {
    margin-right: 15px;
    
    i {
      margin-right: 5px;
    }
  }
`;

const ExamItem = styled.div`
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ExamDate = styled.div`
  width: 100px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.danger};
  flex-shrink: 0;
`;

const ExamDetails = styled.div`
  flex-grow: 1;
`;

const ExamSubject = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;

const ExamMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
  
  span {
    margin-right: 15px;
    
    i {
      margin-right: 5px;
    }
  }
`;

interface DashboardProps {
  setActiveContent: (contentId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveContent }) => {
  return (
    <DashboardWrapper>
      <PageTitle>
        <i className="fa fa-dashboard"></i> Trang chủ
      </PageTitle>
      
      {/* Thẻ thông tin tổng quan */}
      <DashboardCards>
        <Card color="#ff9f43">
          <CardIcon>
            <i className="fa fa-calendar-check-o"></i>
          </CardIcon>
          <CardValue>12</CardValue>
          <CardLabel>Học phần đã đăng ký</CardLabel>
          <CardDetails>
            <small>Học kỳ 2, năm học 2023-2024</small>
            <small>Tổng số tín chỉ: 24</small>
          </CardDetails>
        </Card>
        
        <Card color="#4a90e2">
          <CardIcon>
            <i className="fa fa-graduation-cap"></i>
          </CardIcon>
          <CardValue>3.65</CardValue>
          <CardLabel>Điểm trung bình tích lũy</CardLabel>
          <CardDetails>
            <small>Xếp loại: Giỏi</small>
            <small>Cập nhật: 15/05/2024</small>
          </CardDetails>
        </Card>
        
        <Card color="#28a745">
          <CardIcon>
            <i className="fa fa-check-circle"></i>
          </CardIcon>
          <CardValue>85</CardValue>
          <CardLabel>Điểm rèn luyện</CardLabel>
          <CardDetails>
            <small>Xếp loại: Tốt</small>
            <small>Học kỳ 1, năm học 2023-2024</small>
          </CardDetails>
        </Card>
        
        <Card color="#ff6b6b">
          <CardIcon>
            <i className="fa fa-money"></i>
          </CardIcon>
          <CardValue>0</CardValue>
          <CardLabel>Công nợ học phí (VNĐ)</CardLabel>
          <CardDetails>
            <small>Đã thanh toán: 15,000,000 VNĐ</small>
            <small>Cập nhật: 10/05/2024</small>
          </CardDetails>
        </Card>
        
        <Card color="#6c5ce7">
          <CardIcon>
            <i className="fa fa-bell"></i>
          </CardIcon>
          <CardValue>5</CardValue>
          <CardLabel>Thông báo mới</CardLabel>
          <CardDetails>
            <small>3 thông báo quan trọng</small>
            <small>2 thông báo thường</small>
          </CardDetails>
        </Card>
      </DashboardCards>
      
      <SectionTitle>Thông tin nổi bật</SectionTitle>
      
      {/* Phần thông tin nổi bật */}
      <DashboardHighlights>
        {/* Thông báo quan trọng */}
        <HighlightSection>
          <HighlightHeader>
            <h3><i className="fa fa-bullhorn"></i> Thông báo quan trọng</h3>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setActiveContent("thong-bao-nha-truong"); }}
              className="view-all"
            >
              Xem tất cả
            </a>
          </HighlightHeader>
          <HighlightContent>
            <NotificationItem unread>
              <NotificationIcon type="important">
                <i className="fa fa-exclamation"></i>
              </NotificationIcon>
              <NotificationContent>
                <NotificationTitle>
                  Thông báo về việc đóng học phí học kỳ 2 năm học 2023-2024
                  <NotificationBadge type="important">Quan trọng</NotificationBadge>
                  <NotificationBadge type="new">Mới</NotificationBadge>
                </NotificationTitle>
                <NotificationMeta>
                  <span>
                    <i className="fa fa-building-o"></i> Phòng Tài chính - Kế toán
                  </span>
                  <span><i className="fa fa-calendar"></i> 15/05/2024</span>
                </NotificationMeta>
              </NotificationContent>
            </NotificationItem>
            <NotificationItem>
              <NotificationIcon type="event">
                <i className="fa fa-calendar-check-o"></i>
              </NotificationIcon>
              <NotificationContent>
                <NotificationTitle>
                  Kế hoạch thi kết thúc học phần học kỳ 2 năm học 2023-2024
                </NotificationTitle>
                <NotificationMeta>
                  <span><i className="fa fa-building-o"></i> Phòng Đào tạo</span>
                  <span><i className="fa fa-calendar"></i> 10/05/2024</span>
                </NotificationMeta>
              </NotificationContent>
            </NotificationItem>
          </HighlightContent>
        </HighlightSection>
        
        {/* Lịch học hôm nay */}
        <HighlightSection>
          <HighlightHeader>
            <h3><i className="fa fa-calendar"></i> Lịch học hôm nay</h3>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setActiveContent("thoi-khoa-bieu"); }}
              className="view-all"
            >
              Xem TKB
            </a>
          </HighlightHeader>
          <HighlightContent>
            <ScheduleItem>
              <ScheduleTime>07:00 - 09:30</ScheduleTime>
              <ScheduleDetails>
                <ScheduleSubject>Lập trình Web nâng cao</ScheduleSubject>
                <ScheduleMeta>
                  <span><i className="fa fa-map-marker"></i> Phòng A305</span>
                  <span><i className="fa fa-user"></i> GV. Nguyễn Văn B</span>
                </ScheduleMeta>
              </ScheduleDetails>
            </ScheduleItem>
            <ScheduleItem>
              <ScheduleTime>09:45 - 11:30</ScheduleTime>
              <ScheduleDetails>
                <ScheduleSubject>Trí tuệ nhân tạo</ScheduleSubject>
                <ScheduleMeta>
                  <span><i className="fa fa-map-marker"></i> Phòng B203</span>
                  <span><i className="fa fa-user"></i> GV. Trần Thị C</span>
                </ScheduleMeta>
              </ScheduleDetails>
            </ScheduleItem>
            <ScheduleItem>
              <ScheduleTime>13:00 - 15:30</ScheduleTime>
              <ScheduleDetails>
                <ScheduleSubject>Phân tích và thiết kế hệ thống</ScheduleSubject>
                <ScheduleMeta>
                  <span><i className="fa fa-map-marker"></i> Phòng A401</span>
                  <span><i className="fa fa-user"></i> GV. Lê Văn D</span>
                </ScheduleMeta>
              </ScheduleDetails>
            </ScheduleItem>
          </HighlightContent>
        </HighlightSection>
        
        {/* Lịch thi sắp tới */}
        <HighlightSection>
          <HighlightHeader>
            <h3><i className="fa fa-file-text-o"></i> Lịch thi sắp tới</h3>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setActiveContent("lich-thi"); }}
              className="view-all"
            >
              Xem tất cả
            </a>
          </HighlightHeader>
          <HighlightContent>
            <ExamItem>
              <ExamDate>20/06/2024</ExamDate>
              <ExamDetails>
                <ExamSubject>Lập trình Web nâng cao</ExamSubject>
                <ExamMeta>
                  <span><i className="fa fa-clock-o"></i> 07:00 - 08:30</span>
                  <span><i className="fa fa-map-marker"></i> Phòng A305</span>
                </ExamMeta>
              </ExamDetails>
            </ExamItem>
            <ExamItem>
              <ExamDate>22/06/2024</ExamDate>
              <ExamDetails>
                <ExamSubject>Trí tuệ nhân tạo</ExamSubject>
                <ExamMeta>
                  <span><i className="fa fa-clock-o"></i> 09:00 - 10:30</span>
                  <span><i className="fa fa-map-marker"></i> Phòng B203</span>
                </ExamMeta>
              </ExamDetails>
            </ExamItem>
            <ExamItem>
              <ExamDate>25/06/2024</ExamDate>
              <ExamDetails>
                <ExamSubject>Phân tích và thiết kế hệ thống</ExamSubject>
                <ExamMeta>
                  <span><i className="fa fa-clock-o"></i> 13:00 - 14:30</span>
                  <span><i className="fa fa-map-marker"></i> Phòng A401</span>
                </ExamMeta>
              </ExamDetails>
            </ExamItem>
          </HighlightContent>
        </HighlightSection>
      </DashboardHighlights>
    </DashboardWrapper>
  );
};

export default Dashboard;