import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import useDebt from "../hooks/useDebt";
import { useStudentProfile } from "../hooks/useStudentProfile";
import {
  PaymentFilter,
  DebtItem,
  PaymentTransaction,
} from "../services/debtService";

// Styled Components
const PageTitle = styled.h1`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 20px;
  display: flex;
  align-items: center;

  i {
    margin-right: 10px;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatItem = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;

const InfoCard = styled.div`
  background-color: white;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const InfoHeader = styled.div`
  background-color: ${({ theme }) => theme.colors.light};
  padding: 15px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  h2 {
    margin: 0;
    font-size: 18px;
    display: flex;
    align-items: center;

    i {
      margin-right: 10px;
    }
  }
`;

const InfoContent = styled.div`
  padding: 20px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
`;

const InfoItem = styled.div`
  margin-bottom: 10px;
`;

const InfoLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 5px;
  display: flex;
  align-items: center;

  i {
    margin-right: 8px;
    width: 16px;
  }
`;

const InfoValue = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  padding: 15px 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-bottom: 15px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 5px;
  display: flex;
  align-items: center;

  i {
    margin-right: 5px;
  }
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: white;
  min-width: 180px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 15px;
  border-radius: 4px;
  border: none;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;

  i {
    margin-right: 8px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }
`;

const TableContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
  padding: 15px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;

  i {
    margin-right: 10px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.colors.light};

  th {
    padding: 12px 15px;
    text-align: left;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textDark};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    transition: background-color 0.2s;

    &:hover {
      background-color: ${({ theme }) => theme.colors.background};
    }

    &:last-child {
      border-bottom: none;
    }
  }

  td {
    padding: 12px 15px;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const TableFoot = styled.tfoot`
  background-color: ${({ theme }) => theme.colors.light};

  td {
    padding: 12px 15px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textDark};
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const NoDataMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: 8px;
  margin: 20px 0;

  i {
    font-size: 48px;
    color: #4caf50;
    margin-bottom: 15px;
  }

  h3 {
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 10px;
    font-size: 20px;
  }

  p {
    color: ${({ theme }) => theme.colors.text};
    font-size: 16px;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;

  ${({ status, theme }) => {
    if (status === "paid" || status === "completed") {
      return `
        background-color: rgba(76, 175, 80, 0.1);
        color: #4caf50;
      `;
    } else if (status === "unpaid" || status === "pending") {
      return `
        background-color: rgba(255, 152, 0, 0.1);
        color: #ff9800;
      `;
    } else if (status === "overdue" || status === "failed") {
      return `
        background-color: rgba(244, 67, 54, 0.1);
        color: #f44336;
      `;
    } else if (status === "upcoming") {
      return `
        background-color: rgba(33, 150, 243, 0.1);
        color: #2196f3;
      `;
    }
    return `
      background-color: ${theme.colors.light};
      color: ${theme.colors.text};
    `;
  }}
`;

const ActionButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  padding: 5px;
  margin-right: 5px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(74, 144, 226, 0.1);
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PageLink = styled.a<{ active?: boolean }>`
  margin: 0 5px;
  padding: 8px 12px;
  border-radius: 4px;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.light};
  color: ${({ active }) => (active ? "white" : "#333")};
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ active, theme }) =>
      active ? theme.colors.primaryDark : theme.colors.border};
  }
`;

const MethodsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const MethodCard = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const MethodHeader = styled.div`
  background-color: ${({ theme }) => theme.colors.light};
  padding: 15px;
  display: flex;
  align-items: center;

  i {
    font-size: 20px;
    margin-right: 10px;
    color: ${({ theme }) => theme.colors.primary};
  }

  h3 {
    margin: 0;
    font-size: 16px;
    color: ${({ theme }) => theme.colors.textDark};
  }
`;

const MethodBody = styled.div`
  padding: 15px;

  p {
    margin-top: 0;
    color: ${({ theme }) => theme.colors.text};
  }

  ul {
    padding-left: 20px;
    margin-bottom: 0;

    li {
      margin-bottom: 8px;
      color: ${({ theme }) => theme.colors.text};

      &:last-child {
        margin-bottom: 0;
      }

      i {
        margin-right: 8px;
        color: ${({ theme }) => theme.colors.primary};
      }
    }
  }
`;

const Modal = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  background-color: white;
  margin: 10% auto;
  padding: 0;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 95%;
    margin: 5% auto;
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
    }
  }
`;

const CloseButton = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const ModalFooter = styled.div`
  padding: 15px 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const PaymentDetailRow = styled.div`
  display: flex;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const PaymentDetailLabel = styled.div`
  width: 40%;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
  display: flex;
  align-items: center;

  i {
    margin-right: 8px;
    width: 16px;
  }
`;

const PaymentDetailValue = styled.div`
  width: 60%;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
`;

const LoadingSpinner = styled.div`
  border: 4px solid ${({ theme }) => theme.colors.light};
  border-top: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  width: 30px;
  height: 30px;
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

// Component chính
const DebtPayment: React.FC = () => {
  // State
  const [filters, setFilters] = useState<PaymentFilter>({
    debtType: "all",
    status: "all",
    semester: "all",
  });
  const [historyFilters, setHistoryFilters] = useState<PaymentFilter>({
    dateRange: "all",
    debtType: "all",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Hooks
  const {
    debtList,
    debtSummary,
    paymentHistory,
    loading,
    historyLoading,
    selectedPayment,
    fetchPaymentDetail,
    downloadReceipt,
    exportDebtData,
    formatCurrency,
    filterDebtData,
    filterPaymentHistory,
  } = useDebt();

  const { profile } = useStudentProfile();

  // Handlers
  const handleDebtFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    filterDebtData(newFilters);
  };

  const handleHistoryFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newFilters = { ...historyFilters, [name]: value };
    setHistoryFilters(newFilters);
    filterPaymentHistory(newFilters);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = async () => {
    await exportDebtData(filters);
  };

  const handleViewPaymentDetail = async (paymentId: string) => {
    const payment = await fetchPaymentDetail(paymentId);
    if (payment) {
      setIsModalOpen(true);
    }
  };

  const handleDownloadReceipt = async (paymentId: string) => {
    await downloadReceipt(paymentId);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Render helpers
  const renderStatusBadge = (status: string) => {
    let label = "";

    switch (status) {
      case "paid":
        label = "Đã thanh toán";
        break;
      case "unpaid":
        label = "Chưa thanh toán";
        break;
      case "overdue":
        label = "Quá hạn";
        break;
      case "upcoming":
        label = "Sắp đến hạn";
        break;
      case "completed":
        label = "Thành công";
        break;
      case "pending":
        label = "Đang xử lý";
        break;
      case "failed":
        label = "Thất bại";
        break;
      default:
        label = status;
    }

    return <StatusBadge status={status}>{label}</StatusBadge>;
  };

  // Render
  return (
    <>
      <PageTitle>
        <i className="fa fa-money"></i> Thanh toán công nợ
      </PageTitle>

      {/* Thống kê công nợ */}
      <StatsContainer>
        <StatItem>
          <StatValue>
            {debtSummary ? formatCurrency(debtSummary.totalDebt) : "0 VNĐ"}
          </StatValue>
          <StatLabel>Tổng công nợ</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>
            {debtSummary ? formatCurrency(debtSummary.totalPaid) : "0 VNĐ"}
          </StatValue>
          <StatLabel>Đã thanh toán</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>
            {debtSummary ? formatCurrency(debtSummary.overdueDebt) : "0 VNĐ"}
          </StatValue>
          <StatLabel>Công nợ quá hạn</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>
            {debtSummary ? formatCurrency(debtSummary.upcomingDebt) : "0 VNĐ"}
          </StatValue>
          <StatLabel>Công nợ sắp đến hạn</StatLabel>
        </StatItem>
      </StatsContainer>

      {/* Thông tin sinh viên */}
      <InfoCard>
        <InfoHeader>
          <h2>
            <i className="fa fa-user-circle"></i> Thông tin sinh viên
          </h2>
        </InfoHeader>
        <InfoContent>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>
                <i className="fa fa-id-card"></i> Mã sinh viên:
              </InfoLabel>
              <InfoValue>{profile?.studentId || "SV20200001"}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>
                <i className="fa fa-user"></i> Họ và tên:
              </InfoLabel>
              <InfoValue>
                {profile?.personalInfo?.fullName || "Nguyễn Văn A"}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>
                <i className="fa fa-graduation-cap"></i> Ngành học:
              </InfoLabel>
              <InfoValue>
                {profile?.academicInfo?.major || "Công nghệ thông tin"}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>
                <i className="fa fa-users"></i> Lớp:
              </InfoLabel>
              <InfoValue>
                {profile?.academicInfo?.className || "CNTT2020"}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>
                <i className="fa fa-calendar"></i> Khóa học:
              </InfoLabel>
              <InfoValue>
                {profile?.academicInfo?.course || "2020-2024"}
              </InfoValue>
            </InfoItem>
          </InfoGrid>
        </InfoContent>
      </InfoCard>

      {/* Bộ lọc và điều khiển */}
      <ControlsContainer>
        <FilterContainer>
          <FilterGroup>
            <FilterLabel htmlFor="debtType">
              <i className="fa fa-filter"></i> Loại công nợ:
            </FilterLabel>
            <FilterSelect
              id="debtType"
              name="debtType"
              value={filters.debtType}
              onChange={handleDebtFilterChange}
            >
              <option value="all">Tất cả</option>
              <option value="tuition">Học phí</option>
              <option value="dormitory">Ký túc xá</option>
              <option value="insurance">Bảo hiểm</option>
              <option value="other">Khác</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel htmlFor="status">
              <i className="fa fa-check-circle"></i> Trạng thái:
            </FilterLabel>
            <FilterSelect
              id="status"
              name="status"
              value={filters.status}
              onChange={handleDebtFilterChange}
            >
              <option value="all">Tất cả</option>
              <option value="unpaid">Chưa thanh toán</option>
              <option value="paid">Đã thanh toán</option>
              <option value="overdue">Quá hạn</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel htmlFor="semester">
              <i className="fa fa-calendar"></i> Học kỳ:
            </FilterLabel>
            <FilterSelect
              id="semester"
              name="semester"
              value={filters.semester}
              onChange={handleDebtFilterChange}
            >
              <option value="all">Tất cả</option>
              <option value="2023-2024-2">Học kỳ 2, năm học 2023-2024</option>
              <option value="2023-2024-1">Học kỳ 1, năm học 2023-2024</option>
              <option value="2022-2023-2">Học kỳ 2, năm học 2022-2023</option>
              <option value="2022-2023-1">Học kỳ 1, năm học 2022-2023</option>
            </FilterSelect>
          </FilterGroup>
        </FilterContainer>

        <ActionButtons>
          <Button onClick={handlePrint}>
            <i className="fa fa-print"></i> In
          </Button>
          <Button onClick={handleExport}>
            <i className="fa fa-download"></i> Xuất file
          </Button>
        </ActionButtons>
      </ControlsContainer>

      {/* Thông báo quan trọng */}
      <InfoCard>
        <InfoHeader>
          <h2>
            <i className="fa fa-exclamation-triangle"></i> Thông báo quan trọng
          </h2>
        </InfoHeader>
        <InfoContent>
          <p>
            Sinh viên cần thanh toán công nợ đúng hạn để tránh bị khóa tài khoản
            và không thể tham gia các kỳ thi. Công nợ quá hạn sẽ bị tính phí
            phạt theo quy định của nhà trường.
          </p>
          <p>
            Mọi thắc mắc về công nợ vui lòng liên hệ Phòng Kế hoạch - Tài chính,
            email: <a href="mailto:tckt@dntu.edu.vn">tckt@dntu.edu.vn</a>, điện
            thoại:
            <a href="tel:02513456789">0251.3456.789</a>.
          </p>
        </InfoContent>
      </InfoCard>

      {/* Bảng công nợ chi tiết */}
      <TableContainer>
        <SectionTitle>
          <i className="fa fa-list-alt"></i> Danh sách công nợ
        </SectionTitle>

        {loading ? (
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        ) : debtList.length === 0 ? (
          <NoDataMessage>
            <i className="fa fa-check-circle"></i>
            <h3>Bạn không có khoản công nợ nào!</h3>
            <p>Tất cả các khoản phí đã được thanh toán đầy đủ.</p>
          </NoDataMessage>
        ) : (
          <Table>
            <TableHead>
              <tr>
                <th>STT</th>
                <th>Mã công nợ</th>
                <th>Loại công nợ</th>
                <th>Mô tả</th>
                <th>Học kỳ</th>
                <th>Số tiền</th>
                <th>Đã thanh toán</th>
                <th>Còn nợ</th>
                <th>Hạn nộp</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </TableHead>
            <TableBody>
              {debtList.map((debt, index) => (
                <tr key={debt.id}>
                  <td>{index + 1}</td>
                  <td>{debt.debtCode}</td>
                  <td>
                    {debt.debtType === "tuition"
                      ? "Học phí"
                      : debt.debtType === "dormitory"
                      ? "Ký túc xá"
                      : debt.debtType === "insurance"
                      ? "Bảo hiểm"
                      : "Khác"}
                  </td>
                  <td>{debt.description}</td>
                  <td>
                    {debt.semester}, {debt.academicYear}
                  </td>
                  <td>{formatCurrency(debt.amount)}</td>
                  <td>{formatCurrency(debt.paid)}</td>
                  <td>{formatCurrency(debt.amount - debt.paid)}</td>
                  <td>{new Date(debt.dueDate).toLocaleDateString("vi-VN")}</td>
                  <td>{renderStatusBadge(debt.status)}</td>
                  <td>
                    {debt.status !== "paid" && (
                      <ActionButton title="Thanh toán">
                        <i className="fa fa-credit-card"></i>
                      </ActionButton>
                    )}
                    <ActionButton title="Xem chi tiết">
                      <i className="fa fa-eye"></i>
                    </ActionButton>
                  </td>
                </tr>
              ))}
            </TableBody>
            <TableFoot>
              <tr>
                <td colSpan={5} style={{ textAlign: "right" }}>
                  <strong>Tổng cộng:</strong>
                </td>
                <td>
                  {formatCurrency(
                    debtList.reduce((sum, item) => sum + item.amount, 0)
                  )}
                </td>
                <td>
                  {formatCurrency(
                    debtList.reduce((sum, item) => sum + item.paid, 0)
                  )}
                </td>
                <td>
                  {formatCurrency(
                    debtList.reduce(
                      (sum, item) => sum + (item.amount - item.paid),
                      0
                    )
                  )}
                </td>
                <td colSpan={3}></td>
              </tr>
            </TableFoot>
          </Table>
        )}
      </TableContainer>

      {/* Lịch sử thanh toán */}
      <TableContainer>
        <SectionTitle>
          <i className="fa fa-history"></i> Lịch sử thanh toán
        </SectionTitle>

        <ControlsContainer>
          <FilterContainer>
            <FilterGroup>
              <FilterLabel htmlFor="dateRange">
                <i className="fa fa-calendar"></i> Thời gian:
              </FilterLabel>
              <FilterSelect
                id="dateRange"
                name="dateRange"
                value={historyFilters.dateRange}
                onChange={handleHistoryFilterChange}
              >
                <option value="all">Tất cả</option>
                <option value="month-3">3 tháng gần đây</option>
                <option value="month-6">6 tháng gần đây</option>
                <option value="year-1">1 năm gần đây</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel htmlFor="paymentType">
                <i className="fa fa-filter"></i> Loại thanh toán:
              </FilterLabel>
              <FilterSelect
                id="paymentType"
                name="debtType"
                value={historyFilters.debtType}
                onChange={handleHistoryFilterChange}
              >
                <option value="all">Tất cả</option>
                <option value="tuition">Học phí</option>
                <option value="dormitory">Ký túc xá</option>
                <option value="insurance">Bảo hiểm</option>
                <option value="other">Khác</option>
              </FilterSelect>
            </FilterGroup>
          </FilterContainer>
        </ControlsContainer>

        {historyLoading ? (
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        ) : (
          <>
            <Table>
              <TableHead>
                <tr>
                  <th>STT</th>
                  <th>Mã giao dịch</th>
                  <th>Ngày thanh toán</th>
                  <th>Loại công nợ</th>
                  <th>Mô tả</th>
                  <th>Học kỳ</th>
                  <th>Số tiền</th>
                  <th>Phương thức</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </TableHead>
              <TableBody>
                {paymentHistory.map((payment, index) => (
                  <tr key={payment.id} className="history-row">
                    <td>{index + 1}</td>
                    <td>{payment.transactionCode}</td>
                    <td>
                      {new Date(payment.paymentDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </td>
                    <td>
                      {payment.debtType === "tuition"
                        ? "Học phí"
                        : payment.debtType === "dormitory"
                        ? "Ký túc xá"
                        : payment.debtType === "insurance"
                        ? "Bảo hiểm"
                        : "Khác"}
                    </td>
                    <td>{payment.description}</td>
                    <td>{payment.semester}</td>
                    <td>{formatCurrency(payment.amount)}</td>
                    <td>{payment.paymentMethod}</td>
                    <td>{renderStatusBadge(payment.status)}</td>
                    <td>
                      <ActionButton
                        title="Xem chi tiết"
                        onClick={() => handleViewPaymentDetail(payment.id)}
                      >
                        <i className="fa fa-eye"></i>
                      </ActionButton>
                      <ActionButton
                        title="Tải biên lai"
                        onClick={() => handleDownloadReceipt(payment.id)}
                      >
                        <i className="fa fa-download"></i>
                      </ActionButton>
                    </td>
                  </tr>
                ))}
              </TableBody>
            </Table>

            <Pagination>
              <PageLink href="#" active={true}>
                1
              </PageLink>
              <PageLink href="#">2</PageLink>
              <PageLink href="#">3</PageLink>
              <PageLink href="#">&raquo;</PageLink>
            </Pagination>
          </>
        )}
      </TableContainer>

      {/* Hướng dẫn thanh toán */}
      <TableContainer>
        <SectionTitle>
          <i className="fa fa-credit-card"></i> Hướng dẫn thanh toán công nợ
        </SectionTitle>

        <InfoContent>
          <MethodsGrid>
            {/* Thanh toán trực tuyến */}
            <MethodCard>
              <MethodHeader>
                <i className="fa fa-globe"></i>
                <h3>Thanh toán trực tuyến</h3>
              </MethodHeader>
              <MethodBody>
                <p>
                  Sinh viên có thể thanh toán công nợ trực tuyến thông qua các
                  phương thức sau:
                </p>
                <ul>
                  <li>
                    <i className="fa fa-credit-card"></i>
                    <strong>Thẻ ATM nội địa:</strong> Hỗ trợ tất cả các ngân
                    hàng có liên kết với NAPAS.
                  </li>
                  <li>
                    <i className="fa fa-cc-visa"></i>{" "}
                    <strong>Thẻ quốc tế:</strong> Visa, MasterCard, JCB.
                  </li>
                  <li>
                    <i className="fa fa-mobile"></i>{" "}
                    <strong>Ví điện tử:</strong> MoMo, ZaloPay, VNPay.
                  </li>
                  <li>
                    <i className="fa fa-qrcode"></i> <strong>QR Code:</strong>{" "}
                    Quét mã QR để thanh toán qua ứng dụng ngân hàng.
                  </li>
                </ul>
              </MethodBody>
            </MethodCard>

            {/* Chuyển khoản ngân hàng */}
            <MethodCard>
              <MethodHeader>
                <i className="fa fa-university"></i>
                <h3>Chuyển khoản ngân hàng</h3>
              </MethodHeader>
              <MethodBody>
                <p>
                  Sinh viên có thể chuyển khoản công nợ vào tài khoản của
                  trường:
                </p>
                <ul>
                  <li>
                    <i className="fa fa-building"></i>
                    <strong>Tên tài khoản:</strong> Trường Đại học Công nghệ
                    Đồng Nai
                  </li>
                  <li>
                    <i className="fa fa-hashtag"></i>
                    <strong>Số tài khoản:</strong> 1234567890
                  </li>
                  <li>
                    <i className="fa fa-university"></i>
                    <strong>Ngân hàng:</strong> Vietcombank - Chi nhánh Đồng Nai
                  </li>
                  <li>
                    <i className="fa fa-file-text"></i>
                    <strong>Nội dung chuyển khoản:</strong> [Mã sinh viên] - [Họ
                    tên] - [Mã công nợ]
                  </li>
                  <li>
                    <i className="fa fa-info-circle"></i>
                    <strong>Ví dụ:</strong> SV20200001 - Nguyen Van A -
                    HP2023-2024-2
                  </li>
                </ul>
              </MethodBody>
            </MethodCard>

            {/* Thanh toán trực tiếp */}
            <MethodCard>
              <MethodHeader>
                <i className="fa fa-map-marker"></i>
                <h3>Thanh toán trực tiếp</h3>
              </MethodHeader>
              <MethodBody>
                <p>Sinh viên có thể đến thanh toán trực tiếp tại:</p>
                <ul>
                  <li>
                    <i className="fa fa-building"></i>
                    <strong>Phòng Kế hoạch - Tài chính:</strong> Phòng A101, Tòa
                    nhà A, Trường Đại học Công nghệ Đồng Nai
                  </li>
                  <li>
                    <i className="fa fa-clock-o"></i>
                    <strong>Thời gian làm việc:</strong> Từ thứ 2 đến thứ 6
                    (7:30 - 11:30 và 13:30 - 17:00)
                  </li>
                  <li>
                    <i className="fa fa-money"></i>
                    <strong>Phương thức thanh toán:</strong> Tiền mặt, thẻ ngân
                    hàng
                  </li>
                </ul>
              </MethodBody>
            </MethodCard>

            {/* Lưu ý quan trọng */}
            <MethodCard>
              <MethodHeader>
                <i className="fa fa-exclamation-triangle"></i>
                <h3>Lưu ý quan trọng</h3>
              </MethodHeader>
              <MethodBody>
                <ul>
                  <li>
                    <i className="fa fa-calendar-check-o"></i> Sinh viên cần
                    thanh toán công nợ đúng hạn để tránh bị khóa tài khoản và
                    không thể tham gia các kỳ thi.
                  </li>
                  <li>
                    <i className="fa fa-refresh"></i> Sau khi thanh toán, sinh
                    viên nên kiểm tra lại thông tin thanh toán trên hệ thống sau
                    24-48 giờ.
                  </li>
                  <li>
                    <i className="fa fa-question-circle"></i> Nếu có thắc mắc về
                    công nợ, vui lòng liên hệ Phòng Kế hoạch - Tài chính.
                  </li>
                </ul>
              </MethodBody>
            </MethodCard>
          </MethodsGrid>
        </InfoContent>
      </TableContainer>

      {/* Modal xem chi tiết giao dịch */}
      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <ModalHeader>
            <h3>
              <i className="fa fa-info-circle"></i> Chi tiết giao dịch
            </h3>
            <CloseButton onClick={closeModal}>&times;</CloseButton>
          </ModalHeader>
          <ModalBody>
            {selectedPayment && (
              <div>
                <PaymentDetailRow>
                  <PaymentDetailLabel>
                    <i className="fa fa-hashtag"></i> Mã giao dịch:
                  </PaymentDetailLabel>
                  <PaymentDetailValue>
                    {selectedPayment.transactionCode}
                  </PaymentDetailValue>
                </PaymentDetailRow>
                <PaymentDetailRow>
                  <PaymentDetailLabel>
                    <i className="fa fa-calendar"></i> Ngày thanh toán:
                  </PaymentDetailLabel>
                  <PaymentDetailValue>
                    {selectedPayment.paymentDate}
                  </PaymentDetailValue>
                </PaymentDetailRow>
                <PaymentDetailRow>
                  <PaymentDetailLabel>
                    <i className="fa fa-tag"></i> Loại công nợ:
                  </PaymentDetailLabel>
                  <PaymentDetailValue>
                    {selectedPayment.debtType === "tuition"
                      ? "Học phí"
                      : selectedPayment.debtType === "dormitory"
                      ? "Ký túc xá"
                      : selectedPayment.debtType === "insurance"
                      ? "Bảo hiểm"
                      : "Khác"}
                  </PaymentDetailValue>
                </PaymentDetailRow>
                <PaymentDetailRow>
                  <PaymentDetailLabel>
                    <i className="fa fa-file-text-o"></i> Mô tả:
                  </PaymentDetailLabel>
                  <PaymentDetailValue>
                    {selectedPayment.description}
                  </PaymentDetailValue>
                </PaymentDetailRow>
                <PaymentDetailRow>
                  <PaymentDetailLabel>
                    <i className="fa fa-graduation-cap"></i> Học kỳ:
                  </PaymentDetailLabel>
                  <PaymentDetailValue>
                    {selectedPayment.semester}
                  </PaymentDetailValue>
                </PaymentDetailRow>
                <PaymentDetailRow>
                  <PaymentDetailLabel>
                    <i className="fa fa-money"></i> Số tiền:
                  </PaymentDetailLabel>
                  <PaymentDetailValue>
                    {formatCurrency(selectedPayment.amount)}
                  </PaymentDetailValue>
                </PaymentDetailRow>
                <PaymentDetailRow>
                  <PaymentDetailLabel>
                    <i className="fa fa-credit-card"></i> Phương thức thanh
                    toán:
                  </PaymentDetailLabel>
                  <PaymentDetailValue>
                    {selectedPayment.paymentMethod}
                  </PaymentDetailValue>
                </PaymentDetailRow>
                {selectedPayment.bankCode && (
                  <PaymentDetailRow>
                    <PaymentDetailLabel>
                      <i className="fa fa-university"></i> Ngân hàng:
                    </PaymentDetailLabel>
                    <PaymentDetailValue>
                      {selectedPayment.bankCode}
                    </PaymentDetailValue>
                  </PaymentDetailRow>
                )}
                {selectedPayment.bankTransactionId && (
                  <PaymentDetailRow>
                    <PaymentDetailLabel>
                      <i className="fa fa-barcode"></i> Mã giao dịch ngân hàng:
                    </PaymentDetailLabel>
                    <PaymentDetailValue>
                      {selectedPayment.bankTransactionId}
                    </PaymentDetailValue>
                  </PaymentDetailRow>
                )}
                <PaymentDetailRow>
                  <PaymentDetailLabel>
                    <i className="fa fa-user"></i> Người thanh toán:
                  </PaymentDetailLabel>
                  <PaymentDetailValue>
                    {selectedPayment.payer}
                  </PaymentDetailValue>
                </PaymentDetailRow>
                <PaymentDetailRow>
                  <PaymentDetailLabel>
                    <i className="fa fa-info-circle"></i> Trạng thái:
                  </PaymentDetailLabel>
                  <PaymentDetailValue>
                    {renderStatusBadge(selectedPayment.status)}
                  </PaymentDetailValue>
                </PaymentDetailRow>
                {selectedPayment.notes && (
                  <PaymentDetailRow>
                    <PaymentDetailLabel>
                      <i className="fa fa-sticky-note"></i> Ghi chú:
                    </PaymentDetailLabel>
                    <PaymentDetailValue>
                      {selectedPayment.notes}
                    </PaymentDetailValue>
                  </PaymentDetailRow>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() =>
                selectedPayment && handleDownloadReceipt(selectedPayment.id)
              }
            >
              <i className="fa fa-download"></i> Tải biên lai
            </Button>
            <Button onClick={closeModal} style={{ backgroundColor: "#f44336" }}>
              <i className="fa fa-times"></i> Đóng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DebtPayment;
