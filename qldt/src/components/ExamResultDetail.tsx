import React from "react";
import styled from "styled-components";
import { ExamResultDetail as ExamResultDetailType, ExamResultStatus } from "../services/examResultsService";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  color: #1e3056;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #f44336;
  }
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const DetailSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 15px;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
`;

const DetailItem = styled.div`
  margin-bottom: 10px;
`;

const DetailLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
`;

const DetailValue = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #333;
`;

const GradeTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
`;

const TableHeader = styled.th`
  background-color: #f5f5f5;
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
  font-weight: 500;
  color: #333;
`;

const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;

const GradeValue = styled.span<{ status?: string }>`
  font-weight: 500;
  color: ${({ status }) => {
    if (status === "excellent") return "#4caf50";
    if (status === "good") return "#2196f3";
    if (status === "average") return "#ff9800";
    if (status === "poor") return "#f44336";
    return "#333";
  }};
`;

const PendingValue = styled.span`
  color: #999;
  font-style: italic;
`;

const Notes = styled.div`
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
  margin-top: 15px;
`;

interface ExamResultDetailProps {
  examDetail: ExamResultDetailType | null;
  loading: boolean;
  onClose: () => void;
}

const ExamResultDetail: React.FC<ExamResultDetailProps> = ({
  examDetail,
  loading,
  onClose,
}) => {
  if (!examDetail && !loading) return null;

  // Hàm để xác định trạng thái điểm
  const getGradeStatus = (grade: number | null) => {
    if (grade === null) return "";
    if (grade >= 8.5) return "excellent";
    if (grade >= 7.0) return "good";
    if (grade >= 5.5) return "average";
    return "poor";
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {loading
              ? "Đang tải chi tiết kết quả thi..."
              : `Chi tiết kết quả thi: ${examDetail?.courseName}`}
          </ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        <ModalBody>
          {loading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <div
                style={{
                  display: "inline-block",
                  width: "40px",
                  height: "40px",
                  border: "4px solid rgba(0, 0, 0, 0.1)",
                  borderTopColor: "#2196f3",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
              <style>
                {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
                `}
              </style>
            </div>
          ) : examDetail ? (
            <>
              <DetailSection>
                <SectionTitle>Thông tin học phần</SectionTitle>
                <DetailGrid>
                  <DetailItem>
                    <DetailLabel>Mã học phần</DetailLabel>
                    <DetailValue>{examDetail.courseCode}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Tên học phần</DetailLabel>
                    <DetailValue>{examDetail.courseName}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Số tín chỉ</DetailLabel>
                    <DetailValue>{examDetail.credits}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Giảng viên</DetailLabel>
                    <DetailValue>{examDetail.instructor}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Khoa/Bộ môn</DetailLabel>
                    <DetailValue>{examDetail.department}</DetailValue>
                  </DetailItem>
                </DetailGrid>
              </DetailSection>

              <DetailSection>
                <SectionTitle>Thông tin kỳ thi</SectionTitle>
                <DetailGrid>
                  <DetailItem>
                    <DetailLabel>Ngày thi</DetailLabel>
                    <DetailValue>{examDetail.examDate}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Giờ thi</DetailLabel>
                    <DetailValue>{examDetail.examTime}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Phòng thi</DetailLabel>
                    <DetailValue>{examDetail.examRoom}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Hình thức thi</DetailLabel>
                    <DetailValue>{examDetail.examType}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Thời gian làm bài</DetailLabel>
                    <DetailValue>{examDetail.examDuration} phút</DetailValue>
                  </DetailItem>
                </DetailGrid>
              </DetailSection>

              <DetailSection>
                <SectionTitle>Kết quả đánh giá</SectionTitle>
                <GradeTable>
                  <thead>
                    <tr>
                      <TableHeader>Thành phần đánh giá</TableHeader>
                      <TableHeader>Điểm số</TableHeader>
                      <TableHeader>Trọng số</TableHeader>
                      <TableHeader>Ghi chú</TableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <TableCell>Chuyên cần</TableCell>
                      <TableCell>
                        <GradeValue>
                          {examDetail.progressComponents.attendance}
                        </GradeValue>
                      </TableCell>
                      <TableCell>10%</TableCell>
                      <TableCell></TableCell>
                    </tr>
                    <tr>
                      <TableCell>Bài tập</TableCell>
                      <TableCell>
                        <GradeValue>
                          {examDetail.progressComponents.assignment}
                        </GradeValue>
                      </TableCell>
                      <TableCell>10%</TableCell>
                      <TableCell></TableCell>
                    </tr>
                    <tr>
                      <TableCell>Kiểm tra giữa kỳ</TableCell>
                      <TableCell>
                        <GradeValue>
                          {examDetail.progressComponents.midterm}
                        </GradeValue>
                      </TableCell>
                      <TableCell>20%</TableCell>
                      <TableCell></TableCell>
                    </tr>
                    {examDetail.progressComponents.practice !== null && (
                      <tr>
                        <TableCell>Thực hành</TableCell>
                        <TableCell>
                          <GradeValue>
                            {examDetail.progressComponents.practice}
                          </GradeValue>
                        </TableCell>
                        <TableCell>10%</TableCell>
                        <TableCell></TableCell>
                      </tr>
                    )}
                    <tr>
                      <TableCell>
                        <strong>Điểm quá trình</strong>
                      </TableCell>
                      <TableCell>
                        <GradeValue
                          status={getGradeStatus(examDetail.progressGrade)}
                        >
                          <strong>{examDetail.progressGrade}</strong>
                        </GradeValue>
                      </TableCell>
                      <TableCell>40%</TableCell>
                      <TableCell></TableCell>
                    </tr>
                    <tr>
                      <TableCell>
                        <strong>Điểm thi</strong>
                      </TableCell>
                      <TableCell>
                        {examDetail.examGrade !== null ? (
                          <GradeValue
                            status={getGradeStatus(examDetail.examGrade)}
                          >
                            <strong>{examDetail.examGrade}</strong>
                          </GradeValue>
                        ) : (
                          <PendingValue>Chưa có</PendingValue>
                        )}
                      </TableCell>
                      <TableCell>60%</TableCell>
                      <TableCell></TableCell>
                    </tr>
                    <tr>
                      <TableCell>
                        <strong>Điểm tổng kết</strong>
                      </TableCell>
                      <TableCell>
                        {examDetail.finalGrade !== null ? (
                          <GradeValue
                            status={getGradeStatus(examDetail.finalGrade)}
                          >
                            <strong>{examDetail.finalGrade}</strong>
                          </GradeValue>
                        ) : (
                          <PendingValue>Chưa có</PendingValue>
                        )}
                      </TableCell>
                      <TableCell>100%</TableCell>
                      <TableCell>
                        {examDetail.status === ExamResultStatus.PASSED
                          ? "Đạt"
                          : examDetail.status === ExamResultStatus.FAILED
                          ? "Không đạt"
                          : "Đang chờ kết quả"}
                      </TableCell>
                    </tr>
                    {examDetail.gradeScale.letterGrade && (
                      <tr>
                        <TableCell>
                          <strong>Điểm chữ</strong>
                        </TableCell>
                        <TableCell colSpan={3}>
                          <GradeValue
                            status={getGradeStatus(examDetail.finalGrade)}
                          >
                            <strong>{examDetail.gradeScale.letterGrade}</strong> (
                            {examDetail.gradeScale.gradePoint})
                          </GradeValue>
                        </TableCell>
                      </tr>
                    )}
                  </tbody>
                </GradeTable>

                {examDetail.notes && (
                  <Notes>
                    <strong>Ghi chú:</strong> {examDetail.notes}
                  </Notes>
                )}
              </DetailSection>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "20px" }}>
              Không tìm thấy thông tin chi tiết kết quả thi
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ExamResultDetail;