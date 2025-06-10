import React from "react";
import styled from "styled-components";
import Dashboard from "./Dashboard";
import SchoolAnnouncements from "./SchoolAnnouncements";
import PersonalNotifications from "./PersonalNotifications";
import NewsFeed from "./NewsFeed";
import OneStopService from "./OneStopService";
import UserGuide from "./UserGuide";
import StudentProfile from "./StudentProfile";
import DeviceReportForm from "./DeviceReportForm";
import UpdateStudentInfo from "./UpdateStudentInfo";
import Tuition from "./Tuition";
import OtherFees from "./OtherFees";
import Deposit from "./Deposit";
import DebtPayment from "./DebtPayment";
import TransactionHistory from "./TransactionHistory";
import Curriculum from "./Curriculum";
import SemesterPlan from "./SemesterPlan";
import CourseRegistration from "./CourseRegistration";
import CourseWithdrawal from "./CourseWithdrawal";
import RegistrationInfo from "./RegistrationInfo";
import Schedule from "./Schedule";
import ExamSchedule from "./ExamSchedule";
import AcademicResults from "./AcademicResults";
import ExamResults from "./ExamResults";
import Transcript from "./Transcript";

const MainContentWrapper = styled.div<{ isSidebarActive: boolean }>`
  margin-left: 0;
  margin-top: 60px;
  padding: 20px;
  min-height: calc(100vh - 60px);
  background-color: ${({ theme }) => theme.colors.background};
  transition: margin-left ${({ theme }) => theme.transitions.normal} ease;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-left: 280px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-left: ${({ isSidebarActive }) => (isSidebarActive ? "280px" : "0")};
  }
`;

const ContentSection = styled.div<{ isActive: boolean }>`
  display: ${({ isActive }) => (isActive ? "block" : "none")};
`;

interface MainContentProps {
  activeContent: string;
  setActiveContent: (contentId: string) => void;
  isSidebarActive: boolean;
}

const MainContent: React.FC<MainContentProps> = ({
  activeContent,
  setActiveContent,
  isSidebarActive,
}) => {
  return (
    <MainContentWrapper isSidebarActive={isSidebarActive}>
      {/* Trang chủ - Dashboard */}
      <ContentSection isActive={activeContent === "dashboard"}>
        <Dashboard setActiveContent={setActiveContent} />
      </ContentSection>

      {/* Thông báo từ nhà trường */}
      <ContentSection isActive={activeContent === "thong-bao-nha-truong"}>
        <SchoolAnnouncements />
      </ContentSection>

      {/* Thông báo cá nhân */}
      <ContentSection isActive={activeContent === "thong-bao-ca-nhan"}>
        <PersonalNotifications />
      </ContentSection>

      {/* Bảng tin */}
      <ContentSection isActive={activeContent === "bang-tin"}>
        <NewsFeed />
      </ContentSection>

      {/* Dịch vụ một cửa */}
      <ContentSection isActive={activeContent === "dich-vu-mot-cua"}>
        <OneStopService />
      </ContentSection>

      {/* Hướng dẫn sử dụng */}
      <ContentSection isActive={activeContent === "huong-dan-su-dung"}>
        <UserGuide />
      </ContentSection>

      {/* Báo hỏng thiết bị */}
      <ContentSection isActive={activeContent === "bao-hong-thiet-bi"}>
        <DeviceReportForm />
      </ContentSection>

      {/* Hồ sơ sinh viên */}
      <ContentSection isActive={activeContent === "ho-so-sinh-vien"}>
        <StudentProfile />
      </ContentSection>

      {/* Cập nhật thông tin sinh viên */}
      <ContentSection isActive={activeContent === "cap-nhat-thong-tin"}>
        <UpdateStudentInfo />
      </ContentSection>

      {/* Học phí */}
      <ContentSection isActive={activeContent === "hoc-phi"}>
        <Tuition />
      </ContentSection>

      {/* Các khoản thu khác */}
      <ContentSection isActive={activeContent === "cac-khoan-thu-khac"}>
        <OtherFees />
      </ContentSection>

      {/* Nạp tiền vào tài khoản */}
      <ContentSection isActive={activeContent === "nap-tien-vao-tai-khoan"}>
        <Deposit />
      </ContentSection>

      {/* Thanh toán công nợ */}
      <ContentSection isActive={activeContent === "thanh-toan-cong-no"}>
        <DebtPayment />
      </ContentSection>

      {/* Lịch sử giao dịch */}
      <ContentSection isActive={activeContent === "lich-su-giao-dich"}>
        <TransactionHistory />
      </ContentSection>

      {/* Khung chương trình */}
      <ContentSection isActive={activeContent === "khung-chuong-trinh"}>
        <Curriculum />
      </ContentSection>

      {/* Khung theo kỳ */}
      <ContentSection isActive={activeContent === "khung-theo-ky"}>
        <SemesterPlan />
      </ContentSection>

      {/* Đăng ký học phần */}
      <ContentSection isActive={activeContent === "dang-ky-hoc-phan"}>
        <CourseRegistration />
      </ContentSection>

      {/* Rút học phần */}
      <ContentSection isActive={activeContent === "rut-hoc-phan"}>
        <CourseWithdrawal />
      </ContentSection>

      {/* Thông tin đăng ký học phần */}
      <ContentSection isActive={activeContent === "thong-tin-dang-ky-hoc-phan"}>
        <RegistrationInfo />
      </ContentSection>

      {/* Thời khóa biểu */}
      <ContentSection isActive={activeContent === "thoi-khoa-bieu"}>
        <Schedule />
      </ContentSection>

      {/* Lịch thi */}
      <ContentSection isActive={activeContent === "lich-thi"}>
        <ExamSchedule />
      </ContentSection>

      {/* Kết quả học tập */}
      <ContentSection isActive={activeContent === "ket-qua-hoc-tap"}>
        <AcademicResults />
      </ContentSection>

      {/* Kết quả thi */}
      <ContentSection isActive={activeContent === "ket-qua-thi"}>
        <ExamResults />
      </ContentSection>

      {/* Bảng điểm */}
      <ContentSection isActive={activeContent === "bang-diem"}>
        <Transcript />
      </ContentSection>

      {/* Các phần nội dung khác sẽ được thêm vào tương tự */}
    </MainContentWrapper>
  );
};

export default MainContent;
