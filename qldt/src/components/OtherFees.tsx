import React, { useState } from "react";
import styled from "styled-components";
import useOtherFees from "../hooks/useOtherFees";
import { useFormatCurrency, useFormatDate } from "../hooks/useUtils";

// Styled Components
const FeeStats = styled.div`
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

const FeeControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background-color: white;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  label {
    margin-right: 15px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
  }

  select {
    padding: 10px 15px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 4px;
    font-size: 14px;
    min-width: 200px;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-right: 0;
    margin-bottom: 15px;
    width: 100%;

    select {
      flex: 1;
    }
  }
`;

const ActionControls = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    justify-content: flex-end;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-wrap: wrap;
  }
`;

const ActionBtn = styled.button`
  padding: 10px 15px;
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

  &.primary {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    border-color: ${({ theme }) => theme.colors.primary};

    &:hover {
      background-color: ${({ theme }) => theme.colors.primaryDark};
    }
  }

  i {
    margin-right: 8px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex: 1;
    justify-content: center;
  }
`;

const ImportantNotice = styled.div`
  display: flex;
  background-color: rgba(255, 152, 0, 0.1);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const NoticeIcon = styled.div`
  font-size: 24px;
  color: #ff9800;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-right: 0;
    margin-bottom: 15px;
    justify-content: flex-start;
  }
`;

const NoticeContent = styled.div`
  flex: 1;

  h3 {
    margin-top: 0;
    margin-bottom: 10px;
    color: #ff9800;
    font-size: 18px;
  }

  p {
    margin-bottom: 10px;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.text};
  }

  p:last-child {
    margin-bottom: 0;
  }
`;

const FeeTableContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: 30px;
  overflow: hidden;
`;

const TableTitle = styled.h2`
  padding: 15px 20px;
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TableContainer = styled.div`
  overflow-x: auto;
  padding: 20px;
`;

const FeeTable = styled.table`
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

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ status, theme }) =>
    status === "paid"
      ? "rgba(76, 175, 80, 0.1)"
      : status === "pending"
      ? "rgba(255, 152, 0, 0.1)"
      : "rgba(244, 67, 54, 0.1)"};
  color: ${({ status }) =>
    status === "paid"
      ? "#4caf50"
      : status === "pending"
      ? "#ff9800"
      : "#f44336"};
`;

const TableActions = styled.div`
  display: flex;
  gap: 5px;
`;

const TableActionBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-color: white;
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

  &.view-btn:hover {
    background-color: ${({ theme }) => theme.colors.info};
    border-color: ${({ theme }) => theme.colors.info};
  }

  &.download-btn:hover {
    background-color: ${({ theme }) => theme.colors.success};
    border-color: ${({ theme }) => theme.colors.success};
  }
`;

const Modal = styled.div<{ show: boolean }>`
  display: ${({ show }) => (show ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: ${({ show }) => (show ? "1" : "0")};
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

const PaymentInfo = styled.div`
  margin-bottom: 20px;
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.div`
  width: 150px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textLight};
`;

const InfoValue = styled.div`
  flex: 1;
  color: ${({ theme }) => theme.colors.text};
`;

const PaymentMethods = styled.div`
  margin-bottom: 20px;

  h4 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 16px;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const MethodOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MethodOption = styled.div`
  display: flex;
  align-items: center;

  input {
    margin-right: 10px;
  }

  label {
    cursor: pointer;
  }
`;

const TransferInfo = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: 8px;

  h4 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 16px;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const BankInfo = styled.div`
  margin-bottom: 15px;
`;

const NoteBox = styled.div`
  padding: 10px;
  background-color: rgba(255, 152, 0, 0.1);
  border-radius: 4px;

  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
  }
`;

const QrInfo = styled.div`
  margin-top: 20px;
  text-align: center;

  h4 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 16px;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const QrContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
`;

const QrImage = styled.img`
  max-width: 200px;
  height: auto;
`;

const ModalFooter = styled.div`
  padding: 15px 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const CancelBtn = styled.button`
  padding: 10px 15px;
  background-color: white;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
`;

const ConfirmBtn = styled.button`
  padding: 10px 15px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
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

const OtherFees: React.FC = () => {
  const {
    // Dữ liệu
    feesSummary,
    filteredFeeItems,
    currentFee,

    // Trạng thái
    selectedSemester,
    selectedStatus,
    loading,
    error,
    showPaymentModal,

    // Hàm xử lý
    handleSemesterChange,
    handleStatusChange,
    handleShowPaymentModal,
    handleHidePaymentModal,
    handlePayFee,
    handleDownloadReceipt,
    handleViewFeeDetail,
    handlePrintFeeData,
    handleExportFeeData,
  } = useOtherFees();

  const formatCurrency = useFormatCurrency();
  const formatDate = useFormatDate();
  const [paymentMethod, setPaymentMethod] = useState<string>("transfer");
  const [showQrInfo, setShowQrInfo] = useState<boolean>(false);

  // Xử lý khi thay đổi học kỳ
  const onSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleSemesterChange(e.target.value);
  };

  // Xử lý khi thay đổi trạng thái
  const onStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleStatusChange(e.target.value);
  };

  // Xử lý khi thay đổi phương thức thanh toán
  const onPaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const method = e.target.value;
    setPaymentMethod(method);
    setShowQrInfo(method === "qr");
  };

  // Xử lý khi tiến hành thanh toán
  const onProcessPayment = () => {
    handlePayFee(paymentMethod);
  };

  // Hiển thị trạng thái khoản thu
  const renderFeeStatus = (status: string) => {
    switch (status) {
      case "paid":
        return <StatusBadge status="paid">Đã thanh toán</StatusBadge>;
      case "pending":
        return <StatusBadge status="pending">Chưa thanh toán</StatusBadge>;
      case "overdue":
        return <StatusBadge status="overdue">Quá hạn</StatusBadge>;
      default:
        return null;
    }
  };

  // Tính tổng các giá trị
  const calculateTotals = () => {
    let totalAmount = 0;
    let totalPaid = 0;
    let totalDebt = 0;

    filteredFeeItems.forEach((item) => {
      totalAmount += item.amount;
      totalPaid += item.paid;
      totalDebt += Math.max(0, item.amount - item.paid);
    });

    return { totalAmount, totalPaid, totalDebt };
  };

  const { totalAmount, totalPaid, totalDebt } = calculateTotals();

  return (
    <>
      {/* Tiêu đề trang */}
      <h1 className="page-title">
        <i className="fa fa-money" style={{ color: "#ff9800" }}></i> Các khoản
        thu khác
      </h1>

      {/* Thống kê tổng quan */}
      <FeeStats>
        <StatItem>
          <StatValue>{formatCurrency(feesSummary?.totalDebt || 0)}</StatValue>
          <StatLabel>Tổng công nợ</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{formatCurrency(feesSummary?.totalPaid || 0)}</StatValue>
          <StatLabel>Đã thanh toán</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{formatCurrency(feesSummary?.totalDebt || 0)}</StatValue>
          <StatLabel>Còn phải nộp</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{formatCurrency(feesSummary?.totalFees || 0)}</StatValue>
          <StatLabel>Tổng các khoản thu</StatLabel>
        </StatItem>
      </FeeStats>

      {/* Bộ lọc và điều khiển */}
      <FeeControls>
        <div>
          <ControlGroup>
            <label htmlFor="semester-select">Học kỳ:</label>
            <select
              id="semester-select"
              value={selectedSemester}
              onChange={onSemesterChange}
            >
              <option value="all">Tất cả</option>
              <option value="2023-2024-2">Học kỳ 2, năm học 2023-2024</option>
              <option value="2023-2024-1">Học kỳ 1, năm học 2023-2024</option>
              <option value="2022-2023-2">Học kỳ 2, năm học 2022-2023</option>
              <option value="2022-2023-1">Học kỳ 1, năm học 2022-2023</option>
            </select>
          </ControlGroup>

          <ControlGroup>
            <label htmlFor="fee-status">Trạng thái:</label>
            <select
              id="fee-status"
              value={selectedStatus}
              onChange={onStatusChange}
            >
              <option value="all">Tất cả</option>
              <option value="paid">Đã thanh toán</option>
              <option value="pending">Chưa thanh toán</option>
              <option value="overdue">Quá hạn</option>
            </select>
          </ControlGroup>
        </div>

        <ActionControls>
          <ActionBtn onClick={handlePrintFeeData}>
            <i className="fa fa-print"></i> In
          </ActionBtn>
          <ActionBtn onClick={handleExportFeeData}>
            <i className="fa fa-download"></i> Xuất file
          </ActionBtn>
          <ActionBtn
            className="primary"
            onClick={() =>
              handleShowPaymentModal(filteredFeeItems[0]?.id || "")
            }
            disabled={
              filteredFeeItems.length === 0 ||
              filteredFeeItems.every((item) => item.status === "paid")
            }
          >
            <i className="fa fa-credit-card"></i> Thanh toán
          </ActionBtn>
        </ActionControls>
      </FeeControls>

      {/* Thông báo quan trọng */}
      <ImportantNotice>
        <NoticeIcon>
          <i className="fa fa-exclamation-triangle"></i>
        </NoticeIcon>
        <NoticeContent>
          <h3>Thông báo quan trọng</h3>
          <p>
            Sinh viên cần thanh toán đầy đủ các khoản thu khác để đảm bảo quyền
            lợi học tập và tham gia các hoạt động của trường. Các khoản thu khác
            bao gồm: phí thẻ sinh viên, bảo hiểm y tế, phí ký túc xá, phí hoạt
            động ngoại khóa, v.v.
          </p>
          <p>
            Mọi thắc mắc về các khoản thu khác vui lòng liên hệ Phòng Kế hoạch -
            Tài chính, email: tckt@dntu.edu.vn, điện thoại: 0251.3456.789.
          </p>
        </NoticeContent>
      </ImportantNotice>

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
          {/* Bảng các khoản thu chi tiết */}
          <FeeTableContainer>
            <TableTitle>Danh sách các khoản thu</TableTitle>
            <TableContainer>
              <FeeTable>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã khoản thu</th>
                    <th>Tên khoản thu</th>
                    <th>Học kỳ</th>
                    <th>Số tiền</th>
                    <th>Đã nộp</th>
                    <th>Còn nợ</th>
                    <th>Hạn nộp</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFeeItems.length > 0 ? (
                    filteredFeeItems.map((fee, index) => (
                      <tr key={fee.id} className={`fee-row ${fee.status}`}>
                        <td>{index + 1}</td>
                        <td>{fee.code}</td>
                        <td>{fee.name}</td>
                        <td>
                          {fee.semester
                            ? `${fee.semester}, năm học ${fee.academicYear}`
                            : `Năm học ${fee.academicYear}`}
                        </td>
                        <td>{formatCurrency(fee.amount)}</td>
                        <td>{formatCurrency(fee.paid)}</td>
                        <td>
                          {formatCurrency(Math.max(0, fee.amount - fee.paid))}
                        </td>
                        <td>{formatDate(fee.dueDate)}</td>
                        <td>{renderFeeStatus(fee.status)}</td>
                        <td>
                          <TableActions>
                            <TableActionBtn
                              className="view-btn"
                              title="Xem chi tiết"
                              onClick={() => handleViewFeeDetail(fee.id)}
                            >
                              <i className="fa fa-eye"></i>
                            </TableActionBtn>
                            <TableActionBtn
                              className="download-btn"
                              title="Tải biên lai"
                              onClick={() => handleDownloadReceipt(fee.id)}
                              disabled={fee.status !== "paid"}
                            >
                              <i className="fa fa-download"></i>
                            </TableActionBtn>
                          </TableActions>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={10}
                        style={{ textAlign: "center", padding: "30px" }}
                      >
                        Không có khoản thu nào phù hợp với tiêu chí tìm kiếm
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4}>
                      <strong>Tổng cộng:</strong>
                    </td>
                    <td>{formatCurrency(totalAmount)}</td>
                    <td>{formatCurrency(totalPaid)}</td>
                    <td>{formatCurrency(totalDebt)}</td>
                    <td colSpan={3}></td>
                  </tr>
                </tfoot>
              </FeeTable>
            </TableContainer>
          </FeeTableContainer>
        </>
      )}

      {/* Modal thanh toán */}
      <Modal
        show={showPaymentModal}
        onClick={(e) => {
          if (e.target === e.currentTarget) handleHidePaymentModal();
        }}
      >
        <ModalContent>
          <ModalHeader>
            <h3>
              <i className="fa fa-credit-card"></i> Thanh toán khoản thu
            </h3>
            <CloseModal onClick={handleHidePaymentModal}>&times;</CloseModal>
          </ModalHeader>
          <ModalBody>
            <PaymentInfo>
              <InfoRow>
                <InfoLabel>Khoản thu:</InfoLabel>
                <InfoValue>{currentFee?.name}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Mã khoản thu:</InfoLabel>
                <InfoValue>{currentFee?.code}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Học kỳ:</InfoLabel>
                <InfoValue>
                  {currentFee?.semester
                    ? `${currentFee.semester}, năm học ${currentFee.academicYear}`
                    : `Năm học ${currentFee?.academicYear}`}
                </InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Số tiền:</InfoLabel>
                <InfoValue>{formatCurrency(currentFee?.amount || 0)}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Đã nộp:</InfoLabel>
                <InfoValue>{formatCurrency(currentFee?.paid || 0)}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Còn nợ:</InfoLabel>
                <InfoValue>
                  {formatCurrency(
                    currentFee
                      ? Math.max(0, currentFee.amount - currentFee.paid)
                      : 0
                  )}
                </InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Hạn nộp:</InfoLabel>
                <InfoValue>
                  {currentFee ? formatDate(currentFee.dueDate) : ""}
                </InfoValue>
              </InfoRow>
            </PaymentInfo>

            <PaymentMethods>
              <h4>Chọn phương thức thanh toán</h4>

              <MethodOptions>
                <MethodOption>
                  <input
                    type="radio"
                    id="method-card"
                    name="payment-method"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={onPaymentMethodChange}
                  />
                  <label htmlFor="method-card">Thẻ ATM/Thẻ tín dụng</label>
                </MethodOption>

                <MethodOption>
                  <input
                    type="radio"
                    id="method-ewallet"
                    name="payment-method"
                    value="ewallet"
                    checked={paymentMethod === "ewallet"}
                    onChange={onPaymentMethodChange}
                  />
                  <label htmlFor="method-ewallet">Ví điện tử</label>
                </MethodOption>

                <MethodOption>
                  <input
                    type="radio"
                    id="method-transfer"
                    name="payment-method"
                    value="transfer"
                    checked={paymentMethod === "transfer"}
                    onChange={onPaymentMethodChange}
                  />
                  <label htmlFor="method-transfer">
                    Chuyển khoản ngân hàng
                  </label>
                </MethodOption>

                <MethodOption>
                  <input
                    type="radio"
                    id="method-qr"
                    name="payment-method"
                    value="qr"
                    checked={paymentMethod === "qr"}
                    onChange={onPaymentMethodChange}
                  />
                  <label htmlFor="method-qr">Quét mã QR</label>
                </MethodOption>
              </MethodOptions>
            </PaymentMethods>

            {/* Thông tin chuyển khoản */}
            {paymentMethod === "transfer" && (
              <TransferInfo>
                <h4>Thông tin chuyển khoản</h4>

                <BankInfo>
                  <InfoRow>
                    <InfoLabel>Tên tài khoản:</InfoLabel>
                    <InfoValue>Trường Đại học Công nghệ Đồng Nai</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>Số tài khoản:</InfoLabel>
                    <InfoValue>1234567890</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>Ngân hàng:</InfoLabel>
                    <InfoValue>Vietcombank - Chi nhánh Đồng Nai</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>Nội dung chuyển khoản:</InfoLabel>
                    <InfoValue>
                      SV20200001 - Nguyen Van A - {currentFee?.code}
                    </InfoValue>
                  </InfoRow>
                </BankInfo>

                <NoteBox>
                  <p>
                    <strong>Lưu ý:</strong> Sau khi chuyển khoản, vui lòng chụp
                    lại biên lai/màn hình xác nhận và gửi về email:
                    tckt@dntu.edu.vn hoặc tải lên hệ thống để được xác nhận
                    thanh toán nhanh chóng.
                  </p>
                </NoteBox>
              </TransferInfo>
            )}

            {/* QR Code */}
            {paymentMethod === "qr" && (
              <QrInfo>
                <h4>Quét mã QR để thanh toán</h4>

                <QrContainer>
                  <QrImage
                    src="assets/images/payment-qr.png"
                    alt="QR Code thanh toán"
                  />
                </QrContainer>

                <NoteBox>
                  <p>
                    <strong>Hướng dẫn:</strong> Mở ứng dụng ngân hàng hoặc ví
                    điện tử, chọn chức năng quét mã QR và quét mã trên để thanh
                    toán.
                  </p>
                </NoteBox>
              </QrInfo>
            )}
          </ModalBody>
          <ModalFooter>
            <CancelBtn onClick={handleHidePaymentModal}>Hủy</CancelBtn>
            <ConfirmBtn onClick={onProcessPayment}>Tiếp tục</ConfirmBtn>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default OtherFees;
