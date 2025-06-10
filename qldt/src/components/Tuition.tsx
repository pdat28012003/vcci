import React, { useState } from "react";
import styled from "styled-components";
import useTuition from "../hooks/useTuition";
import { useFormatCurrency, useFormatDate } from "../hooks/useUtils";

// Styled Components
const TuitionStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: 20px;
  text-align: center;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 10px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const SemesterSelector = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  background-color: white;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  label {
    margin-right: 15px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
  }

  select {
    flex: 1;
    padding: 10px 15px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 4px;
    font-size: 14px;
    max-width: 400px;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;

    label {
      margin-bottom: 10px;
    }

    select {
      width: 100%;
      max-width: none;
    }
  }
`;

const TuitionInfo = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: 30px;
  overflow: hidden;
`;

const InfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  display: flex;
  align-items: center;

  i {
    margin-right: 10px;
  }
`;

const SemesterStatus = styled.div`
  margin-top: 10px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-top: 10px;
  }
`;

const StatusPaid = styled.span`
  display: inline-block;
  padding: 5px 15px;
  background-color: rgba(76, 175, 80, 0.2);
  color: #4caf50;
  border-radius: 20px;
  font-weight: 500;
  font-size: 14px;
`;

const StatusPending = styled.span`
  display: inline-block;
  padding: 5px 15px;
  background-color: rgba(255, 152, 0, 0.2);
  color: #ff9800;
  border-radius: 20px;
  font-weight: 500;
  font-size: 14px;
`;

const StatusOverdue = styled.span`
  display: inline-block;
  padding: 5px 15px;
  background-color: rgba(244, 67, 54, 0.2);
  color: #f44336;
  border-radius: 20px;
  font-weight: 500;
  font-size: 14px;
`;

const InfoSummary = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: 8px;
`;

const SummaryLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
  display: flex;
  align-items: center;

  i {
    margin-right: 8px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SummaryValue = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const DepositBtn = styled.div`
  display: inline-block;
  padding: 8px 15px;
  background-color: #4caf50;
  color: white;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
`;

const TuitionDetails = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: 30px;
  overflow: hidden;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  padding: 20px;
`;

const TuitionTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  th {
    background-color: ${({ theme }) => theme.colors.light};
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textLight};
  }

  tbody tr:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }

  tfoot {
    font-weight: 500;
  }

  .text-right {
    text-align: right;
  }
`;

const PaymentHistory = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: 30px;
  overflow: hidden;
`;

const PaymentTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  th {
    background-color: ${({ theme }) => theme.colors.light};
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textLight};
  }

  tbody tr:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const StatusCompleted = styled.span`
  display: inline-block;
  padding: 3px 10px;
  background-color: rgba(76, 175, 80, 0.1);
  color: #4caf50;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
`;

const StatusFailed = styled.span`
  display: inline-block;
  padding: 3px 10px;
  background-color: rgba(244, 67, 54, 0.1);
  color: #f44336;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
`;

const ActionBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 5px;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:last-child {
    margin-right: 0;
  }
`;

const ViewBtn = styled(ActionBtn)`
  &:hover {
    background-color: ${({ theme }) => theme.colors.info};
    border-color: ${({ theme }) => theme.colors.info};
  }
`;

const DownloadBtn = styled(ActionBtn)`
  &:hover {
    background-color: ${({ theme }) => theme.colors.success};
    border-color: ${({ theme }) => theme.colors.success};
  }
`;

const PaymentActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 30px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const PaymentBtn = styled.button<{ disabled?: boolean }>`
  padding: 12px 20px;
  background-color: ${({ disabled, theme }) => disabled ? theme.colors.border : theme.colors.primary};
  color: ${({ disabled }) => disabled ? '#999' : 'white'};
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ disabled, theme }) => disabled ? theme.colors.border : theme.colors.primaryDark};
  }

  i {
    margin-right: 10px;
  }
`;

const ReceiptBtn = styled.button`
  padding: 12px 20px;
  background-color: white;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
  }

  i {
    margin-right: 10px;
  }
`;

const Modal = styled.div<{ show: boolean }>`
  display: ${({ show }) => (show ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: ${({ show }) => (show ? '1' : '0')};
  transition: opacity 0.3s ease;
`;

const ModalContent = styled.div`
  position: relative;
  background-color: white;
  margin: 10% auto;
  padding: 0;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  transform: translateY(20px);
  animation: slideIn 0.3s forwards;

  @keyframes slideIn {
    to {
      transform: translateY(0);
    }
  }
`;

const ModalHeader = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 18px;
    display: flex;
    align-items: center;

    i {
      margin-right: 10px;
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const CloseModal = styled.span`
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textLight};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const PaymentMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
`;

const PaymentMethod = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.background};
  }

  input {
    margin-right: 15px;
  }

  label {
    display: flex;
    align-items: center;
    cursor: pointer;
    flex: 1;

    img {
      margin-right: 15px;
      height: 40px;
      width: 100px;
      object-fit: contain;
    }

    span {
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;

      i {
        margin-right: 8px;
        color: ${({ theme }) => theme.colors.primary};
      }
    }
  }
`;

const PaymentSummary = styled.div`
  background-color: ${({ theme }) => theme.colors.light};
  padding: 20px;
  border-radius: 8px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }

  &.total {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    font-weight: 600;
    font-size: 16px;
  }
`;

const ModalFooter = styled.div`
  padding: 15px 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: flex-end;
  gap: 15px;
`;

const CancelBtn = styled.button`
  padding: 10px 20px;
  background-color: white;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }

  i {
    margin-right: 8px;
  }
`;

const ProceedBtn = styled.button`
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }

  i {
    margin-right: 8px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(74, 144, 226, 0.3);
  border-radius: 50%;
  border-top-color: ${({ theme }) => theme.colors.primary};
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorContainer = styled.div`
  background-color: rgba(255, 76, 76, 0.1);
  border-left: 4px solid #ff4c4c;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 4px;
  color: #d32f2f;
`;

const Tuition: React.FC = () => {
  const {
    // Dữ liệu
    tuitionSummary,
    tuitionItems,
    currentTuition,
    courseItems,
    paymentHistory,
    
    // Trạng thái
    selectedSemester,
    loading,
    detailLoading,
    error,
    showPaymentModal,
    
    // Hàm xử lý
    handleSemesterChange,
    handleShowPaymentModal,
    handleHidePaymentModal,
    handlePayTuition,
    handleDownloadReceipt,
    handleDownloadAllReceipts,
    handleViewPaymentDetail
  } = useTuition();
  
  const formatCurrency = useFormatCurrency();
  const formatDate = useFormatDate();
  const [paymentMethod, setPaymentMethod] = useState<string>("vnpay");

  // Xử lý khi thay đổi học kỳ
  const onSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleSemesterChange(e.target.value);
  };

  // Xử lý khi thay đổi phương thức thanh toán
  const onPaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };

  // Xử lý khi tiến hành thanh toán
  const onProceedPayment = () => {
    handlePayTuition(paymentMethod);
  };

  // Hiển thị trạng thái học phí
  const renderTuitionStatus = (status: string) => {
    switch (status) {
      case "paid":
        return <StatusPaid>Đã thanh toán</StatusPaid>;
      case "pending":
        return <StatusPending>Chưa thanh toán</StatusPending>;
      case "overdue":
        return <StatusOverdue>Quá hạn</StatusOverdue>;
      default:
        return null;
    }
  };

  // Hiển thị trạng thái thanh toán
  const renderPaymentStatus = (status: string) => {
    switch (status) {
      case "completed":
        return <StatusCompleted>Thành công</StatusCompleted>;
      case "pending":
        return <StatusPending>Đang xử lý</StatusPending>;
      case "failed":
        return <StatusFailed>Thất bại</StatusFailed>;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Tiêu đề trang */}
      <h1 className="page-title">
        <i className="fa fa-money" style={{ color: "#1e3056" }}></i> Học phí
      </h1>

      {/* Hiển thị lỗi nếu có */}
      {error && (
        <ErrorContainer>
          <p>
            <i className="fa fa-exclamation-circle"></i> {error}
          </p>
        </ErrorContainer>
      )}

      {/* Hiển thị loading */}
      {loading ? (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      ) : (
        <>
          {/* Thống kê học phí */}
          <TuitionStats>
            <StatItem>
              <StatValue>{formatCurrency(tuitionSummary?.totalDebt || 0)}</StatValue>
              <StatLabel>Công nợ học phí</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{formatCurrency(tuitionSummary?.totalPaid || 0)}</StatValue>
              <StatLabel>Đã thanh toán</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{formatCurrency(tuitionSummary?.totalExcess || 0)}</StatValue>
              <StatLabel>Dư nợ</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{formatCurrency(tuitionSummary?.totalTuition || 0)}</StatValue>
              <StatLabel>Tổng học phí</StatLabel>
            </StatItem>
          </TuitionStats>

          {/* Chọn học kỳ */}
          <SemesterSelector>
            <label htmlFor="semester-select">Chọn học kỳ:</label>
            <select 
              id="semester-select" 
              value={selectedSemester}
              onChange={onSemesterChange}
              disabled={detailLoading}
            >
              {tuitionItems.map((item) => (
                <option key={item.id} value={item.semesterCode}>
                  {item.semester}, năm học {item.academicYear}
                </option>
              ))}
            </select>
          </SemesterSelector>

          {/* Hiển thị loading chi tiết */}
          {detailLoading ? (
            <LoadingContainer>
              <LoadingSpinner />
            </LoadingContainer>
          ) : (
            <>
              {/* Thông tin học phí học kỳ hiện tại */}
              {currentTuition && (
                <TuitionInfo>
                  <InfoHeader>
                    <SectionTitle>
                      <i className="fa fa-info-circle"></i>
                      Thông tin học phí {currentTuition.semester}, năm học {currentTuition.academicYear}
                    </SectionTitle>
                    <SemesterStatus>
                      {renderTuitionStatus(currentTuition.status)}
                    </SemesterStatus>
                  </InfoHeader>

                  <InfoSummary>
                    <SummaryItem>
                      <SummaryLabel>
                        <i className="fa fa-book"></i> Tổng số tín chỉ đăng ký:
                      </SummaryLabel>
                      <SummaryValue>{currentTuition.registeredCredits} tín chỉ</SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                      <SummaryLabel>
                        <i className="fa fa-money"></i> Học phí theo tín chỉ:
                      </SummaryLabel>
                      <SummaryValue>{formatCurrency(currentTuition.amount)}</SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                      <SummaryLabel>
                        <i className="fa fa-gift"></i> Miễn giảm học phí:
                      </SummaryLabel>
                      <SummaryValue>{formatCurrency(0)}</SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                      <SummaryLabel>
                        <i className="fa fa-calculator"></i> Học phí phải nộp:
                      </SummaryLabel>
                      <SummaryValue>{formatCurrency(currentTuition.amount)}</SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                      <SummaryLabel>
                        <i className="fa fa-check-circle"></i> Đã thanh toán:
                      </SummaryLabel>
                      <SummaryValue>{formatCurrency(currentTuition.paid)}</SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                      <SummaryLabel>
                        <i className="fa fa-exclamation-circle"></i> Còn phải nộp:
                      </SummaryLabel>
                      <SummaryValue>{formatCurrency(Math.max(0, currentTuition.amount - currentTuition.paid))}</SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                      <SummaryLabel>
                        <i className="fa fa-calendar"></i> Hạn nộp:
                      </SummaryLabel>
                      <SummaryValue>{formatDate(currentTuition.dueDate)}</SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                      <SummaryLabel>
                        <i className="fa fa-info-circle"></i> Trạng thái:
                      </SummaryLabel>
                      <DepositBtn>
                        {currentTuition.status === "paid" ? "Đã thanh toán" : 
                         currentTuition.status === "overdue" ? "Quá hạn" : "Chưa thanh toán"}
                      </DepositBtn>
                    </SummaryItem>
                  </InfoSummary>
                </TuitionInfo>
              )}

              {/* Chi tiết học phí theo môn học */}
              <TuitionDetails>
                <InfoHeader>
                  <SectionTitle>
                    <i className="fa fa-list-alt"></i> Chi tiết học phí theo môn học
                  </SectionTitle>
                </InfoHeader>

                <TableContainer>
                  <TuitionTable>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Mã học phần</th>
                        <th>Tên học phần</th>
                        <th>Số tín chỉ</th>
                        <th>Học phí/tín chỉ</th>
                        <th>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courseItems.map((course, index) => (
                        <tr key={course.id}>
                          <td>{index + 1}</td>
                          <td>{course.code}</td>
                          <td>{course.name}</td>
                          <td>{course.credits}</td>
                          <td>{formatCurrency(course.pricePerCredit)}</td>
                          <td>{formatCurrency(course.totalPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3} className="text-right">Tổng cộng:</td>
                        <td>{currentTuition?.registeredCredits || 0}</td>
                        <td></td>
                        <td>{formatCurrency(currentTuition?.amount || 0)}</td>
                      </tr>
                    </tfoot>
                  </TuitionTable>
                </TableContainer>
              </TuitionDetails>

              {/* Lịch sử thanh toán */}
              <PaymentHistory>
                <InfoHeader>
                  <SectionTitle>
                    <i className="fa fa-history"></i> Lịch sử thanh toán
                  </SectionTitle>
                </InfoHeader>

                <TableContainer>
                  <PaymentTable>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Ngày thanh toán</th>
                        <th>Số tiền</th>
                        <th>Phương thức</th>
                        <th>Mã giao dịch</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory.length > 0 ? (
                        paymentHistory.map((payment, index) => (
                          <tr key={payment.id}>
                            <td>{index + 1}</td>
                            <td>{formatDate(payment.date)}</td>
                            <td>{formatCurrency(payment.amount)}</td>
                            <td>{payment.method}</td>
                            <td>{payment.transactionId}</td>
                            <td>{renderPaymentStatus(payment.status)}</td>
                            <td style={{ display: 'flex' }}>
                              <ViewBtn 
                                title="Xem chi tiết"
                                onClick={() => handleViewPaymentDetail(payment.transactionId)}
                              >
                                <i className="fa fa-eye"></i>
                              </ViewBtn>
                              <DownloadBtn 
                                title="Tải biên lai"
                                onClick={() => handleDownloadReceipt(payment.id)}
                              >
                                <i className="fa fa-download"></i>
                              </DownloadBtn>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: '30px' }}>
                            Không có lịch sử thanh toán nào
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </PaymentTable>
                </TableContainer>
              </PaymentHistory>

              {/* Nút thanh toán học phí */}
              <PaymentActions>
                <PaymentBtn 
                  onClick={handleShowPaymentModal}
                  disabled={currentTuition?.status === "paid"}
                >
                  <i className="fa fa-credit-card"></i> Thanh toán học phí
                </PaymentBtn>
                <ReceiptBtn onClick={handleDownloadAllReceipts}>
                  <i className="fa fa-file-text-o"></i> Xuất biên lai
                </ReceiptBtn>
              </PaymentActions>
            </>
          )}

          {/* Modal phương thức thanh toán */}
          <Modal show={showPaymentModal} onClick={(e) => {
            if (e.target === e.currentTarget) handleHidePaymentModal();
          }}>
            <ModalContent>
              <ModalHeader>
                <h3><i className="fa fa-credit-card"></i> Chọn phương thức thanh toán</h3>
                <CloseModal onClick={handleHidePaymentModal}>&times;</CloseModal>
              </ModalHeader>
              <ModalBody>
                <PaymentMethods>
                  <PaymentMethod>
                    <input
                      type="radio"
                      id="method-vnpay"
                      name="payment-method"
                      value="vnpay"
                      checked={paymentMethod === "vnpay"}
                      onChange={onPaymentMethodChange}
                    />
                    <label htmlFor="method-vnpay">
                      <img src="https://via.placeholder.com/100x40" alt="VNPAY" />
                      <span>Thanh toán qua VNPAY</span>
                    </label>
                  </PaymentMethod>
                  <PaymentMethod>
                    <input
                      type="radio"
                      id="method-momo"
                      name="payment-method"
                      value="momo"
                      checked={paymentMethod === "momo"}
                      onChange={onPaymentMethodChange}
                    />
                    <label htmlFor="method-momo">
                      <img src="https://via.placeholder.com/100x40" alt="MoMo" />
                      <span>Thanh toán qua MoMo</span>
                    </label>
                  </PaymentMethod>
                  <PaymentMethod>
                    <input
                      type="radio"
                      id="method-bank"
                      name="payment-method"
                      value="bank"
                      checked={paymentMethod === "bank"}
                      onChange={onPaymentMethodChange}
                    />
                    <label htmlFor="method-bank">
                      <img src="https://via.placeholder.com/100x40" alt="Internet Banking" />
                      <span><i className="fa fa-info-circle"></i> Thanh toán qua Internet Banking</span>
                    </label>
                  </PaymentMethod>
                  <PaymentMethod>
                    <input
                      type="radio"
                      id="method-qr"
                      name="payment-method"
                      value="qr"
                      checked={paymentMethod === "qr"}
                      onChange={onPaymentMethodChange}
                    />
                    <label htmlFor="method-qr">
                      <img src="https://via.placeholder.com/100x40" alt="QR Code" />
                      <span>Quét mã QR</span>
                    </label>
                  </PaymentMethod>
                </PaymentMethods>

                <PaymentSummary>
                  <h4><i className="fa fa-info-circle"></i> Thông tin thanh toán</h4>
                  <SummaryRow>
                    <div className="summary-label">
                      <i className="fa fa-calendar"></i> Học kỳ:
                    </div>
                    <div className="summary-value">
                      {currentTuition?.semester}, năm học {currentTuition?.academicYear}
                    </div>
                  </SummaryRow>
                  <SummaryRow>
                    <div className="summary-label">
                      <i className="fa fa-money"></i> Số tiền:
                    </div>
                    <div className="summary-value">
                      {formatCurrency(currentTuition ? Math.max(0, currentTuition.amount - currentTuition.paid) : 0)}
                    </div>
                  </SummaryRow>
                  <SummaryRow>
                    <div className="summary-label">
                      <i className="fa fa-percent"></i> Phí giao dịch:
                    </div>
                    <div className="summary-value">
                      {formatCurrency(0)}
                    </div>
                  </SummaryRow>
                  <SummaryRow className="total">
                    <div className="summary-label">
                      <i className="fa fa-calculator"></i> Tổng cộng:
                    </div>
                    <div className="summary-value">
                      {formatCurrency(currentTuition ? Math.max(0, currentTuition.amount - currentTuition.paid) : 0)}
                    </div>
                  </SummaryRow>
                </PaymentSummary>
              </ModalBody>
              <ModalFooter>
                <CancelBtn onClick={handleHidePaymentModal}>
                  <i className="fa fa-times"></i> Hủy
                </CancelBtn>
                <ProceedBtn onClick={onProceedPayment}>
                  <i className="fa fa-check"></i> Tiến hành thanh toán
                </ProceedBtn>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
};

export default Tuition;