import React, { useEffect, useState } from "react";
import styled from "styled-components";
import useExamResults from "../hooks/useExamResults";
import { ExamResultStatus } from "../services/examResultsService";
import ExamResultDetail from "./ExamResultDetail";

// Styled components
const ExamResultsWrapper = styled.div`
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
    color: #f44336;
  }
`;

const ExamStats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 200px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }
`;

const StatIcon = styled.div`
  background-color: #f5f5f5;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 24px;
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 14px;
`;

const FilterSection = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const FilterTitle = styled.h2`
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 15px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
`;

const FilterSelect = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const FilterButton = styled.button`
  background-color: #1e3056;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  align-self: flex-end;
  margin-top: 24px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2a4070;
  }
`;

const ExamResultsSection = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ExamResultsTitle = styled.h2`
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
`;

const TableHeader = styled.th`
  background-color: #1e3056;
  color: white;
  padding: 12px 15px;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
`;

const TableRow = styled.tr<{ isPending?: boolean }>`
  background-color: ${({ isPending }) => (isPending ? "#f9f9f9" : "white")};
  
  &:hover {
    background-color: ${({ isPending }) => (isPending ? "#f5f5f5" : "#f9f9f9")};
  }
`;

const GradeExcellent = styled.td`
  color: #4caf50;
  font-weight: bold;
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
`;

const GradeGood = styled.td`
  color: #2196f3;
  font-weight: bold;
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
`;

const GradeAverage = styled.td`
  color: #ff9800;
  font-weight: bold;
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
`;

const GradePoor = styled.td`
  color: #f44336;
  font-weight: bold;
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
`;

const PendingText = styled.span`
  color: #999;
  font-style: italic;
`;

const ActionIcon = styled.button`
  background: none;
  border: none;
  color: #1e3056;
  cursor: pointer;
  font-size: 16px;
  transition: color 0.3s ease;

  &:hover {
    color: #ff7043;
  }

  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const NotesSection = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const NotesTitle = styled.h2`
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
`;

const NotesContainer = styled.div`
  margin-top: 20px;
`;

const NoteItem = styled.div`
  display: flex;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const NoteIcon = styled.div`
  font-size: 24px;
  margin-right: 15px;
  color: #1e3056;
`;

const NoteContent = styled.div`
  flex: 1;
`;

const NoteTitle = styled.h3`
  margin-bottom: 10px;
  color: #333;
`;

const NoteText = styled.p`
  color: #666;
  line-height: 1.5;
  margin-bottom: 10px;
`;

const LinkButton = styled.a`
  display: inline-block;
  color: #1e3056;
  text-decoration: none;
  font-weight: bold;
  margin-top: 5px;

  &:hover {
    text-decoration: underline;
  }
`;

const ExamResults: React.FC = () => {
  // Sử dụng custom hook để lấy dữ liệu và các hàm xử lý
  const {
    stats,
    semesters,
    subjects,
    examResults,
    selectedExamDetail,
    semesterStats,
    selectedSemesterId,
    selectedSubjectId,
    selectedStatus,
    selectedSemesterName,
    loading,
    detailLoading,
    error,
    showDetailModal,
    handleFilterChange,
    handleViewExamDetail,
    closeDetailModal,
  } = useExamResults();

  // State để theo dõi việc tải CSS
  const [cssLoaded, setCssLoaded] = useState(false);

  // State cho form lọc
  const [formSemesterId, setFormSemesterId] = useState<string>("all");
  const [formSubjectId, setFormSubjectId] = useState<string>("all");
  const [formStatus, setFormStatus] = useState<ExamResultStatus>(ExamResultStatus.ALL);

  // Load CSS
  useEffect(() => {
    // Thêm link CSS vào head
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/css/ket-qua-thi.css";
    link.onload = () => setCssLoaded(true);
    document.head.appendChild(link);

    // Cleanup khi component unmount
    return () => {
      // Tìm và xóa link CSS
      const links = document.head.getElementsByTagName("link");
      for (let i = 0; i < links.length; i++) {
        if (links[i].href.includes("ket-qua-thi.css")) {
          document.head.removeChild(links[i]);
          break;
        }
      }
    };
  }, []);

  // Cập nhật form state khi selectedSemesterId thay đổi
  useEffect(() => {
    setFormSemesterId(selectedSemesterId);
  }, [selectedSemesterId]);

  // Cập nhật form state khi selectedSubjectId thay đổi
  useEffect(() => {
    setFormSubjectId(selectedSubjectId);
  }, [selectedSubjectId]);

  // Cập nhật form state khi selectedStatus thay đổi
  useEffect(() => {
    setFormStatus(selectedStatus);
  }, [selectedStatus]);

  // Xử lý khi nhấn nút lọc
  const handleFilter = () => {
    handleFilterChange(formSemesterId, formSubjectId, formStatus);
  };

  // Hàm để xác định loại điểm
  const getGradeComponent = (grade: number | null, value: React.ReactNode) => {
    if (grade === null) return <TableCell>{value}</TableCell>;
    if (grade >= 8.5) return <GradeExcellent>{value}</GradeExcellent>;
    if (grade >= 7.0) return <GradeGood>{value}</GradeGood>;
    if (grade >= 5.5) return <GradeAverage>{value}</GradeAverage>;
    return <GradePoor>{value}</GradePoor>;
  };

  return (
    <ExamResultsWrapper>
      {/* Hiển thị loading overlay khi đang tải dữ liệu */}
      {loading && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}

      {/* Tiêu đề trang */}
      <PageTitle>
        <i className="fa fa-file-text"></i> Kết quả thi
      </PageTitle>

      {/* Thống kê tổng quan */}
      <ExamStats>
        <StatCard>
          <StatIcon style={{ color: "#ff9800" }}>
            <i className="fa fa-calendar-check-o"></i>
          </StatIcon>
          <StatInfo>
            <StatValue>{semesterStats.totalExams}</StatValue>
            <StatLabel>Tổng số môn đã thi</StatLabel>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon style={{ color: "#4caf50" }}>
            <i className="fa fa-check-circle"></i>
          </StatIcon>
          <StatInfo>
            <StatValue>{semesterStats.completedExams}</StatValue>
            <StatLabel>Đã có kết quả</StatLabel>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon style={{ color: "#2196f3" }}>
            <i className="fa fa-clock-o"></i>
          </StatIcon>
          <StatInfo>
            <StatValue>{semesterStats.pendingExams}</StatValue>
            <StatLabel>Đang chờ kết quả</StatLabel>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon style={{ color: "#f44336" }}>
            <i className="fa fa-line-chart"></i>
          </StatIcon>
          <StatInfo>
            <StatValue>{semesterStats.averageGrade}</StatValue>
            <StatLabel>Điểm trung bình</StatLabel>
          </StatInfo>
        </StatCard>
      </ExamStats>

      {/* Bộ lọc kết quả thi */}
      <FilterSection>
        <FilterTitle>Lọc kết quả thi</FilterTitle>
        <FilterContainer>
          <FilterGroup>
            <FilterLabel htmlFor="semester-select">Học kỳ:</FilterLabel>
            <FilterSelect
              id="semester-select"
              value={formSemesterId}
              onChange={(e) => setFormSemesterId(e.target.value)}
            >
              {semesters.map((semester) => (
                <option key={semester.id} value={semester.id}>
                  {semester.name}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel htmlFor="subject-select">Môn học:</FilterLabel>
            <FilterSelect
              id="subject-select"
              value={formSubjectId}
              onChange={(e) => setFormSubjectId(e.target.value)}
            >
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel htmlFor="status-select">Trạng thái:</FilterLabel>
            <FilterSelect
              id="status-select"
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value as ExamResultStatus)}
            >
              <option value={ExamResultStatus.ALL}>Tất cả trạng thái</option>
              <option value={ExamResultStatus.PASSED}>Đạt</option>
              <option value={ExamResultStatus.FAILED}>Không đạt</option>
              <option value={ExamResultStatus.PENDING}>Đang chờ kết quả</option>
            </FilterSelect>
          </FilterGroup>
          <FilterButton onClick={handleFilter}>
            <i className="fa fa-filter"></i> Lọc kết quả
          </FilterButton>
        </FilterContainer>
      </FilterSection>

      {/* Bảng kết quả thi */}
      <ExamResultsSection>
        <ExamResultsTitle>
          Kết quả thi {selectedSemesterName}
        </ExamResultsTitle>
        <TableContainer>
          <DataTable>
            <thead>
              <tr>
                <TableHeader width="5%">STT</TableHeader>
                <TableHeader width="10%">Mã học phần</TableHeader>
                <TableHeader width="25%">Tên học phần</TableHeader>
                <TableHeader width="10%">Số tín chỉ</TableHeader>
                <TableHeader width="15%">Ngày thi</TableHeader>
                <TableHeader width="10%">Điểm quá trình</TableHeader>
                <TableHeader width="10%">Điểm thi</TableHeader>
                <TableHeader width="10%">Điểm tổng kết</TableHeader>
                <TableHeader width="5%">Thao tác</TableHeader>
              </tr>
            </thead>
            <tbody>
              {examResults.length > 0 ? (
                examResults.map((result, index) => (
                  <TableRow
                    key={result.id}
                    isPending={result.status === ExamResultStatus.PENDING}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{result.courseCode}</TableCell>
                    <TableCell>{result.courseName}</TableCell>
                    <TableCell>{result.credits}</TableCell>
                    <TableCell>{result.examDate}</TableCell>
                    <TableCell>{result.progressGrade}</TableCell>
                    {result.examGrade !== null ? (
                      <TableCell>{result.examGrade}</TableCell>
                    ) : (
                      <TableCell>
                        <PendingText>Chưa có</PendingText>
                      </TableCell>
                    )}
                    {result.finalGrade !== null ? (
                      getGradeComponent(result.finalGrade, result.finalGrade)
                    ) : (
                      <TableCell>
                        <PendingText>Chưa có</PendingText>
                      </TableCell>
                    )}
                    <TableCell>
                      {result.status !== ExamResultStatus.PENDING ? (
                        <ActionIcon
                          title="Xem chi tiết"
                          onClick={() => handleViewExamDetail(result.id)}
                        >
                          <i className="fa fa-eye"></i>
                        </ActionIcon>
                      ) : (
                        <ActionIcon title="Chưa có kết quả" disabled>
                          <i className="fa fa-eye-slash"></i>
                        </ActionIcon>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <tr>
                  <TableCell colSpan={9} style={{ textAlign: "center" }}>
                    Không có kết quả thi nào phù hợp với điều kiện lọc
                  </TableCell>
                </tr>
              )}
            </tbody>
          </DataTable>
        </TableContainer>
      </ExamResultsSection>

      {/* Ghi chú và hướng dẫn */}
      <NotesSection>
        <NotesTitle>Ghi chú và hướng dẫn</NotesTitle>
        <NotesContainer>
          <NoteItem>
            <NoteIcon>
              <i className="fa fa-info-circle"></i>
            </NoteIcon>
            <NoteContent>
              <NoteTitle>Cách tính điểm tổng kết</NoteTitle>
              <NoteText>
                Điểm tổng kết = (Điểm quá trình × 0.4) + (Điểm thi × 0.6)
              </NoteText>
            </NoteContent>
          </NoteItem>

          <NoteItem>
            <NoteIcon>
              <i className="fa fa-exclamation-triangle"></i>
            </NoteIcon>
            <NoteContent>
              <NoteTitle>Quy định về điểm đạt</NoteTitle>
              <NoteText>
                Điểm tổng kết phải đạt từ 4.0 trở lên và điểm thi phải đạt từ
                3.0 trở lên.
              </NoteText>
            </NoteContent>
          </NoteItem>

          <NoteItem>
            <NoteIcon>
              <i className="fa fa-question-circle"></i>
            </NoteIcon>
            <NoteContent>
              <NoteTitle>Thắc mắc về điểm</NoteTitle>
              <NoteText>
                Nếu có thắc mắc về điểm, sinh viên có thể nộp đơn phúc tra
                trong vòng 7 ngày kể từ ngày công bố điểm.
              </NoteText>
              <LinkButton href="#" onClick={() => alert("Đang chuyển đến trang nộp đơn phúc tra")}>
                <i className="fa fa-arrow-right"></i> Đến trang nộp đơn phúc tra
              </LinkButton>
            </NoteContent>
          </NoteItem>
        </NotesContainer>
      </NotesSection>

      {/* Modal chi tiết kết quả thi */}
      {showDetailModal && (
        <ExamResultDetail
          examDetail={selectedExamDetail}
          loading={detailLoading}
          onClose={closeDetailModal}
        />
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
    </ExamResultsWrapper>
  );
};

export default ExamResults;