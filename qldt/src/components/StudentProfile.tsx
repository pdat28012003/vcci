import React, { useRef, useState } from "react";
import styled from "styled-components";
import useStudentProfile from "../hooks/useStudentProfile";
import { useFormatCurrency, useFormatDate } from "../hooks/useUtils";

// Styled Components
const ProfileSection = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: 30px;
  overflow: hidden;
`;

const ProfileHeader = styled.div`
  display: flex;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.light};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const ProfileAvatar = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin-right: 30px;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid white;
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-right: 0;
    margin-bottom: 20px;
  }
`;

const ChangeAvatarBtn = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const StudentName = styled.h2`
  margin: 0 0 10px 0;
  font-size: 24px;
  color: ${({ theme }) => theme.colors.text};
`;

const StudentDetail = styled.div`
  margin-bottom: 5px;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 14px;
`;

const StudentStatus = styled.span<{ status?: string }>`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ status, theme }) => {
    switch (status) {
      case "Đang học":
        return "rgba(76, 175, 80, 0.1)";
      case "Bảo lưu":
        return "rgba(255, 152, 0, 0.1)";
      case "Đã tốt nghiệp":
        return "rgba(33, 150, 243, 0.1)";
      default:
        return "rgba(158, 158, 158, 0.1)";
    }
  }};
  color: ${({ status, theme }) => {
    switch (status) {
      case "Đang học":
        return "#4CAF50";
      case "Bảo lưu":
        return "#FF9800";
      case "Đã tốt nghiệp":
        return "#2196F3";
      default:
        return "#9E9E9E";
    }
  }};
`;

const ProfileTabs = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  background-color: white;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &::-webkit-scrollbar {
    height: 0;
    display: none;
  }

  scrollbar-width: none;
`;

const TabButton = styled.button<{ isActive: boolean }>`
  padding: 15px 20px;
  background-color: transparent;
  border: none;
  border-bottom: 3px solid
    ${({ isActive, theme }) =>
      isActive ? theme.colors.primary : "transparent"};
  color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary : theme.colors.text};
  font-weight: ${({ isActive }) => (isActive ? "500" : "400")};
  cursor: pointer;
  white-space: nowrap;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
  }

  i {
    margin-right: 8px;
  }
`;

const TabContent = styled.div<{ isActive: boolean }>`
  display: ${({ isActive }) => (isActive ? "block" : "none")};
  padding: 20px;
`;

const InfoSection = styled.div`
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 18px;
  font-weight: 500;
  display: flex;
  align-items: center;

  i {
    margin-right: 10px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 5px;
`;

const InfoValue = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const FamilyMember = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: 8px;

  h4 {
    margin: 0 0 15px 0;
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
    display: flex;
    align-items: center;

    i {
      margin-right: 10px;
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const DocumentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const DocumentItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: 8px;
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const DocumentIcon = styled.i`
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(74, 144, 226, 0.1);
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  margin-right: 15px;
`;

const DocumentInfo = styled.div`
  flex: 1;
`;

const DocumentName = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;

const DocumentStatus = styled.span<{ status: string }>`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ status, theme }) => {
    switch (status) {
      case "completed":
        return "rgba(76, 175, 80, 0.1)";
      case "processing":
        return "rgba(255, 152, 0, 0.1)";
      case "not-submitted":
        return "rgba(244, 67, 54, 0.1)";
      default:
        return "rgba(158, 158, 158, 0.1)";
    }
  }};
  color: ${({ status, theme }) => {
    switch (status) {
      case "completed":
        return "#4CAF50";
      case "processing":
        return "#FF9800";
      case "not-submitted":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  }};
`;

const DocumentActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: white;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TuitionSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const SummaryItem = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const SummaryLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 10px;
`;

const SummaryValue = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const TuitionTableContainer = styled.div`
  overflow-x: auto;
`;

const TuitionTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  th {
    background-color: ${({ theme }) => theme.colors.light};
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textLight};
  }

  tr:hover td {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const PaymentStatus = styled.span<{ status: string }>`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ status, theme }) => {
    switch (status) {
      case "Đã thanh toán":
        return "rgba(76, 175, 80, 0.1)";
      case "Quá hạn":
        return "rgba(244, 67, 54, 0.1)";
      case "Chưa thanh toán":
        return "rgba(255, 152, 0, 0.1)";
      default:
        return "rgba(158, 158, 158, 0.1)";
    }
  }};
  color: ${({ status, theme }) => {
    switch (status) {
      case "Đã thanh toán":
        return "#4CAF50";
      case "Quá hạn":
        return "#F44336";
      case "Chưa thanh toán":
        return "#FF9800";
      default:
        return "#9E9E9E";
    }
  }};
`;

const ProfileActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const UpdateProfileButton = styled.button`
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }

  i {
    font-size: 16px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textLight};

  i {
    margin-right: 10px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  text-align: center;

  i {
    font-size: 48px;
    color: ${({ theme }) => theme.colors.danger};
    margin-bottom: 20px;
  }

  p {
    font-size: 18px;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 20px;
  }
`;

const RetryButton = styled.button`
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const StudentProfile: React.FC = () => {
  const {
    profile,
    loading,
    error,
    activeTab,
    changeTab,
    updateAvatar,
    uploadDocument,
    refreshProfile,
  } = useStudentProfile();
  const formatCurrency = useFormatCurrency();
  const formatDate = useFormatDate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentFileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>("");

  // Xử lý khi click vào nút đổi avatar
  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Xử lý khi chọn file avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateAvatar(file);
    }
  };

  // Xử lý khi click vào nút upload tài liệu
  const handleUploadButtonClick = (documentId: string) => {
    setSelectedDocumentId(documentId);
    documentFileInputRef.current?.click();
  };

  // Xử lý khi chọn file tài liệu
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedDocumentId) {
      uploadDocument(selectedDocumentId, file);
    }
  };

  // Xác định trạng thái thanh toán
  const getPaymentStatus = (amount: number, paid: number, dueDate: string) => {
    const remaining = amount - paid;
    const dueDateObj = new Date(dueDate);
    const today = new Date();

    if (remaining <= 0) {
      return "Đã thanh toán";
    } else if (dueDateObj < today) {
      return "Quá hạn";
    } else {
      return "Chưa thanh toán";
    }
  };

  // Tính tổng học phí
  const calculateTotal = (field: "amount" | "paid") => {
    if (!profile) return 0;
    return profile.tuition.reduce(
      (total, item) => total + (item[field] || 0),
      0
    );
  };

  // Hiển thị trạng thái tài liệu
  const getDocumentStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Đã nộp";
      case "processing":
        return "Đang xử lý";
      case "not-submitted":
        return "Chưa nộp";
      default:
        return "Không xác định";
    }
  };

  // Hiển thị loading
  if (loading && !profile) {
    return (
      <LoadingContainer>
        <i className="fa fa-spinner"></i> Đang tải thông tin sinh viên...
      </LoadingContainer>
    );
  }

  // Hiển thị lỗi
  if (error && !profile) {
    return (
      <ErrorContainer>
        <i className="fa fa-exclamation-circle"></i>
        <p>{error}</p>
        <RetryButton onClick={refreshProfile}>
          <i className="fa fa-refresh"></i> Thử lại
        </RetryButton>
      </ErrorContainer>
    );
  }

  // Nếu không có dữ liệu
  if (!profile) {
    return (
      <ErrorContainer>
        <i className="fa fa-user-times"></i>
        <p>Không tìm thấy thông tin sinh viên</p>
        <RetryButton onClick={refreshProfile}>
          <i className="fa fa-refresh"></i> Thử lại
        </RetryButton>
      </ErrorContainer>
    );
  }

  return (
    <>
      <h1 className="page-title">
        <i className="fa fa-user-graduate"></i> Hồ sơ sinh viên
      </h1>

      <ProfileSection>
        <ProfileHeader>
          <ProfileAvatar>
            <img src={profile.avatar} alt="Avatar" />
            <ChangeAvatarBtn onClick={handleAvatarButtonClick}>
              <i className="fa fa-camera"></i>
            </ChangeAvatarBtn>
            <HiddenFileInput
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </ProfileAvatar>
          <ProfileInfo>
            <StudentName>{profile.personalInfo.fullName}</StudentName>
            <StudentDetail>Mã sinh viên: {profile.studentId}</StudentDetail>
            <StudentDetail>Lớp: {profile.className}</StudentDetail>
            <StudentDetail>
              Trạng thái:{" "}
              <StudentStatus status={profile.status}>
                {profile.status}
              </StudentStatus>
            </StudentDetail>
          </ProfileInfo>
        </ProfileHeader>

        <ProfileTabs>
          <TabButton
            isActive={activeTab === "personal-info"}
            onClick={() => changeTab("personal-info")}
          >
            <i className="fa fa-user"></i> Thông tin cá nhân
          </TabButton>
          <TabButton
            isActive={activeTab === "academic-info"}
            onClick={() => changeTab("academic-info")}
          >
            <i className="fa fa-graduation-cap"></i> Thông tin học tập
          </TabButton>
          <TabButton
            isActive={activeTab === "contact-info"}
            onClick={() => changeTab("contact-info")}
          >
            <i className="fa fa-address-book"></i> Thông tin liên hệ
          </TabButton>
          <TabButton
            isActive={activeTab === "family-info"}
            onClick={() => changeTab("family-info")}
          >
            <i className="fa fa-users"></i> Thông tin gia đình
          </TabButton>
          <TabButton
            isActive={activeTab === "documents"}
            onClick={() => changeTab("documents")}
          >
            <i className="fa fa-file"></i> Hồ sơ, giấy tờ
          </TabButton>
          <TabButton
            isActive={activeTab === "tuition-info"}
            onClick={() => changeTab("tuition-info")}
          >
            <i className="fa fa-money-bill"></i> Học phí
          </TabButton>
        </ProfileTabs>

        {/* Tab thông tin cá nhân */}
        <TabContent isActive={activeTab === "personal-info"}>
          <InfoSection>
            <SectionTitle>
              <i className="fa fa-info-circle"></i> Thông tin cơ bản
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Họ và tên:</InfoLabel>
                <InfoValue>{profile.personalInfo.fullName}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Ngày sinh:</InfoLabel>
                <InfoValue>
                  {formatDate(profile.personalInfo.dateOfBirth)}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Giới tính:</InfoLabel>
                <InfoValue>{profile.personalInfo.gender}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Số CMND/CCCD:</InfoLabel>
                <InfoValue>{profile.personalInfo.idNumber}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Ngày cấp:</InfoLabel>
                <InfoValue>
                  {formatDate(profile.personalInfo.idIssueDate)}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Nơi cấp:</InfoLabel>
                <InfoValue>{profile.personalInfo.idIssuePlace}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Dân tộc:</InfoLabel>
                <InfoValue>{profile.personalInfo.ethnicity}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Tôn giáo:</InfoLabel>
                <InfoValue>{profile.personalInfo.religion}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Quốc tịch:</InfoLabel>
                <InfoValue>{profile.personalInfo.nationality}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </InfoSection>

          <InfoSection>
            <SectionTitle>
              <i className="fa fa-certificate"></i> Thông tin khác
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Đối tượng ưu tiên:</InfoLabel>
                <InfoValue>{profile.personalInfo.priorityObject}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Khu vực:</InfoLabel>
                <InfoValue>{profile.personalInfo.area}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Đoàn viên:</InfoLabel>
                <InfoValue>
                  {profile.personalInfo.isYouthUnionMember ? "Có" : "Không"}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Đảng viên:</InfoLabel>
                <InfoValue>
                  {profile.personalInfo.isPartyMember ? "Có" : "Không"}
                </InfoValue>
              </InfoItem>
              {profile.personalInfo.isYouthUnionMember && (
                <>
                  <InfoItem>
                    <InfoLabel>Ngày vào Đoàn:</InfoLabel>
                    <InfoValue>
                      {formatDate(
                        profile.personalInfo.youthUnionJoinDate || ""
                      )}
                    </InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Nơi vào Đoàn:</InfoLabel>
                    <InfoValue>
                      {profile.personalInfo.youthUnionJoinPlace}
                    </InfoValue>
                  </InfoItem>
                </>
              )}
            </InfoGrid>
          </InfoSection>
        </TabContent>

        {/* Tab thông tin học tập */}
        <TabContent isActive={activeTab === "academic-info"}>
          <InfoSection>
            <SectionTitle>
              <i className="fa fa-university"></i> Thông tin nhập học
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Khoa:</InfoLabel>
                <InfoValue>{profile.academicInfo.faculty}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Ngành:</InfoLabel>
                <InfoValue>{profile.academicInfo.major}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Chuyên ngành:</InfoLabel>
                <InfoValue>{profile.academicInfo.specialization}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Lớp:</InfoLabel>
                <InfoValue>{profile.academicInfo.className}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Khóa học:</InfoLabel>
                <InfoValue>{profile.academicInfo.course}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Bậc đào tạo:</InfoLabel>
                <InfoValue>{profile.academicInfo.educationLevel}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Hệ đào tạo:</InfoLabel>
                <InfoValue>{profile.academicInfo.educationType}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Cố vấn học tập:</InfoLabel>
                <InfoValue>{profile.academicInfo.academicAdvisor}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </InfoSection>

          <InfoSection>
            <SectionTitle>
              <i className="fa fa-history"></i> Thông tin trước khi nhập học
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Trường THPT:</InfoLabel>
                <InfoValue>{profile.academicInfo.highSchool}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Năm tốt nghiệp THPT:</InfoLabel>
                <InfoValue>
                  {profile.academicInfo.highSchoolGraduationYear}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Điểm thi THPT QG:</InfoLabel>
                <InfoValue>{profile.academicInfo.nationalExamScore}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Tổ hợp xét tuyển:</InfoLabel>
                <InfoValue>
                  {profile.academicInfo.admissionCombination}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Phương thức trúng tuyển:</InfoLabel>
                <InfoValue>{profile.academicInfo.admissionMethod}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </InfoSection>

          <InfoSection>
            <SectionTitle>
              <i className="fa fa-chart-line"></i> Kết quả học tập
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Điểm trung bình tích lũy:</InfoLabel>
                <InfoValue>{profile.academicInfo.gpa}/4.0</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Xếp loại học lực:</InfoLabel>
                <InfoValue>{profile.academicInfo.academicStanding}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Số tín chỉ đã đăng ký:</InfoLabel>
                <InfoValue>{profile.academicInfo.registeredCredits}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Số tín chỉ đã tích lũy:</InfoLabel>
                <InfoValue>{profile.academicInfo.completedCredits}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Số tín chỉ còn phải học:</InfoLabel>
                <InfoValue>{profile.academicInfo.remainingCredits}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Điểm rèn luyện trung bình:</InfoLabel>
                <InfoValue>{profile.academicInfo.conductScore}/100</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Xếp loại rèn luyện:</InfoLabel>
                <InfoValue>{profile.academicInfo.conductRating}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </InfoSection>
        </TabContent>

        {/* Tab thông tin liên hệ */}
        <TabContent isActive={activeTab === "contact-info"}>
          <InfoSection>
            <SectionTitle>
              <i className="fa fa-phone"></i> Thông tin liên hệ
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Điện thoại:</InfoLabel>
                <InfoValue>{profile.contactInfo.phone}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Email cá nhân:</InfoLabel>
                <InfoValue>{profile.contactInfo.personalEmail}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Email trường cấp:</InfoLabel>
                <InfoValue>{profile.contactInfo.schoolEmail}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Facebook:</InfoLabel>
                <InfoValue>{profile.contactInfo.facebook}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </InfoSection>

          <InfoSection>
            <SectionTitle>
              <i className="fa fa-map-marker"></i> Địa chỉ
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Địa chỉ thường trú:</InfoLabel>
                <InfoValue>{profile.contactInfo.permanentAddress}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Địa chỉ tạm trú:</InfoLabel>
                <InfoValue>{profile.contactInfo.temporaryAddress}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Nơi ở hiện tại:</InfoLabel>
                <InfoValue>{profile.contactInfo.currentResidence}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </InfoSection>

          <InfoSection>
            <SectionTitle>
              <i className="fa fa-exclamation-circle"></i> Thông tin khẩn cấp
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Người liên hệ:</InfoLabel>
                <InfoValue>
                  {profile.contactInfo.emergencyContact.name} (
                  {profile.contactInfo.emergencyContact.relationship})
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Số điện thoại:</InfoLabel>
                <InfoValue>
                  {profile.contactInfo.emergencyContact.phone}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Địa chỉ:</InfoLabel>
                <InfoValue>
                  {profile.contactInfo.emergencyContact.address}
                </InfoValue>
              </InfoItem>
            </InfoGrid>
          </InfoSection>
        </TabContent>

        {/* Tab thông tin gia đình */}
        <TabContent isActive={activeTab === "family-info"}>
          <InfoSection>
            <SectionTitle>
              <i className="fa fa-users"></i> Thông tin gia đình
            </SectionTitle>

            <FamilyMember>
              <h4>
                <i className="fa fa-user"></i> Thông tin bố
              </h4>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Họ và tên:</InfoLabel>
                  <InfoValue>{profile.familyInfo.father.name}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Năm sinh:</InfoLabel>
                  <InfoValue>{profile.familyInfo.father.birthYear}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Nghề nghiệp:</InfoLabel>
                  <InfoValue>{profile.familyInfo.father.occupation}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Nơi làm việc:</InfoLabel>
                  <InfoValue>{profile.familyInfo.father.workplace}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Điện thoại:</InfoLabel>
                  <InfoValue>{profile.familyInfo.father.phone}</InfoValue>
                </InfoItem>
              </InfoGrid>
            </FamilyMember>

            <FamilyMember>
              <h4>
                <i className="fa fa-user"></i> Thông tin mẹ
              </h4>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Họ và tên:</InfoLabel>
                  <InfoValue>{profile.familyInfo.mother.name}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Năm sinh:</InfoLabel>
                  <InfoValue>{profile.familyInfo.mother.birthYear}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Nghề nghiệp:</InfoLabel>
                  <InfoValue>{profile.familyInfo.mother.occupation}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Nơi làm việc:</InfoLabel>
                  <InfoValue>{profile.familyInfo.mother.workplace}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Điện thoại:</InfoLabel>
                  <InfoValue>{profile.familyInfo.mother.phone}</InfoValue>
                </InfoItem>
              </InfoGrid>
            </FamilyMember>

            {profile.familyInfo.siblings.map((sibling, index) => (
              <FamilyMember key={index}>
                <h4>
                  <i className="fa fa-user"></i> Thông tin anh/chị/em
                </h4>
                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>Họ và tên:</InfoLabel>
                    <InfoValue>{sibling.name}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Năm sinh:</InfoLabel>
                    <InfoValue>{sibling.birthYear}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Quan hệ:</InfoLabel>
                    <InfoValue>{sibling.relationship}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Nghề nghiệp:</InfoLabel>
                    <InfoValue>{sibling.occupation}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Nơi học tập:</InfoLabel>
                    <InfoValue>{sibling.studyPlace}</InfoValue>
                  </InfoItem>
                </InfoGrid>
              </FamilyMember>
            ))}
          </InfoSection>
        </TabContent>

        {/* Tab hồ sơ, giấy tờ */}
        <TabContent isActive={activeTab === "documents"}>
          <InfoSection>
            <SectionTitle>
              <i className="fa fa-file-text"></i> Danh sách hồ sơ, giấy tờ
            </SectionTitle>
            <DocumentList>
              {profile.documents.map((document) => (
                <DocumentItem key={document.id}>
                  <DocumentIcon className={`fa ${document.icon}`} />
                  <DocumentInfo>
                    <DocumentName>{document.name}</DocumentName>
                    <DocumentStatus status={document.status}>
                      {getDocumentStatusText(document.status)}
                    </DocumentStatus>
                  </DocumentInfo>
                  <DocumentActions>
                    {document.status !== "not-submitted" && (
                      <>
                        <ActionButton title="Xem tài liệu">
                          <i className="fa fa-eye"></i>
                        </ActionButton>
                        <ActionButton title="Tải xuống">
                          <i className="fa fa-download"></i>
                        </ActionButton>
                      </>
                    )}
                    {document.status === "not-submitted" && (
                      <ActionButton
                        title="Tải lên tài liệu"
                        onClick={() => handleUploadButtonClick(document.id)}
                      >
                        <i className="fa fa-upload"></i>
                      </ActionButton>
                    )}
                  </DocumentActions>
                </DocumentItem>
              ))}
              <HiddenFileInput
                type="file"
                ref={documentFileInputRef}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleDocumentChange}
              />
            </DocumentList>
          </InfoSection>
        </TabContent>

        {/* Tab học phí */}
        <TabContent isActive={activeTab === "tuition-info"}>
          <InfoSection>
            <SectionTitle>
              <i className="fa fa-money-bill"></i> Thông tin học phí
            </SectionTitle>

            <TuitionSummary>
              <SummaryItem>
                <SummaryLabel>Tổng học phí:</SummaryLabel>
                <SummaryValue>
                  {formatCurrency(calculateTotal("amount"))}
                </SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>Đã thanh toán:</SummaryLabel>
                <SummaryValue>
                  {formatCurrency(calculateTotal("paid"))}
                </SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>Còn nợ:</SummaryLabel>
                <SummaryValue>
                  {formatCurrency(
                    calculateTotal("amount") - calculateTotal("paid")
                  )}
                </SummaryValue>
              </SummaryItem>
            </TuitionSummary>

            <TuitionTableContainer>
              <TuitionTable>
                <thead>
                  <tr>
                    <th>Học kỳ</th>
                    <th>Năm học</th>
                    <th>Mô tả</th>
                    <th>Số tiền</th>
                    <th>Đã thanh toán</th>
                    <th>Còn nợ</th>
                    <th>Trạng thái</th>
                    <th>Hạn thanh toán</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.tuition.map((item) => {
                    const remaining = item.amount - item.paid;
                    const status = getPaymentStatus(
                      item.amount,
                      item.paid,
                      item.dueDate
                    );

                    return (
                      <tr key={item.id}>
                        <td>{item.semester}</td>
                        <td>{item.academicYear}</td>
                        <td>{item.description}</td>
                        <td>{formatCurrency(item.amount)}</td>
                        <td>{formatCurrency(item.paid)}</td>
                        <td>{formatCurrency(remaining)}</td>
                        <td>
                          <PaymentStatus status={status}>
                            {status}
                          </PaymentStatus>
                        </td>
                        <td>{formatDate(item.dueDate)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </TuitionTable>
            </TuitionTableContainer>
          </InfoSection>
        </TabContent>
      </ProfileSection>

      <ProfileActions>
        <UpdateProfileButton
          onClick={() => (window.location.href = "#cap-nhat-thong-tin")}
        >
          <i className="fa-solid fa-user-pen"></i> Cập nhật thông tin
        </UpdateProfileButton>
      </ProfileActions>
    </>
  );
};

export default StudentProfile;
