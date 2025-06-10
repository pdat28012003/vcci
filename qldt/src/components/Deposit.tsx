import React from "react";
import styled from "styled-components";
import useDeposit from "../hooks/useDeposit";
import { useFormatCurrency, useFormatDate } from "../hooks/useUtils";

// Styled Components
const PageContainer = styled.div`
  padding-bottom: 30px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 30px;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;

  i {
    margin-right: 10px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const AccountInfo = styled.div`
  margin-bottom: 30px;
`;

const InfoCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
`;

const InfoHeader = styled.div`
  padding: 15px 20px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
  }
`;

const InfoBody = styled.div`
  padding: 20px;
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 15px;

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

  &.balance {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.success};
  }
`;

const DepositSection = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: 20px;
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const DepositForm = styled.div`
  max-width: 600px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const AmountInput = styled.div`
  position: relative;

  input {
    width: 100%;
    padding: 12px 15px;
    padding-right: 50px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 4px;
    font-size: 16px;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }

  .currency {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const AmountSuggestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const AmountBtn = styled.button`
  padding: 8px 15px;
  background-color: white;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

const PaymentMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
`;

const PaymentMethod = styled.div`
  display: flex;
  align-items: center;

  input {
    margin-right: 0;
  }

  label {
    display: flex;
    align-items: center;
    cursor: pointer;
    flex: 1;
    margin-bottom: 0;
    padding: 10px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 4px;
    transition: all 0.3s ease;

    &:hover {
      background-color: ${({ theme }) => theme.colors.background};
    }
  }

  input:checked + label {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: rgba(74, 144, 226, 0.05);
  }
`;

const MethodIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.primary};
`;

const MethodInfo = styled.div`
  margin-left: 10px;
`;

const MethodName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const MethodDesc = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const FormActions = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
`;

const CancelBtn = styled.button`
  padding: 12px 20px;
  background-color: white;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }

  i {
    margin-right: 8px;
  }
`;

const DepositBtn = styled.button`
  padding: 12px 20px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }

  i {
    margin-right: 8px;
  }
`;

const BankTransferInfo = styled.div<{ show: boolean }>`
  display: ${({ show }) => (show ? "block" : "none")};
  margin-top: 30px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: 8px;
`;

const BankInfoTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;

  i {
    margin-right: 10px;
    color: ${({ theme }) => theme.colors.info};
  }
`;

const TransferDetails = styled.div`
  margin-bottom: 20px;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.div`
  width: 180px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textLight};
`;

const DetailValue = styled.div`
  flex: 1;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

const CopyBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 10px;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const QrCode = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;

  img {
    max-width: 200px;
    height: auto;
    margin-bottom: 10px;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const TransferNote = styled.div`
  margin-bottom: 20px;

  h4 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.warning};
    display: flex;
    align-items: center;

    i {
      margin-right: 8px;
    }
  }

  ul {
    margin: 0;
    padding-left: 20px;

    li {
      margin-bottom: 8px;
      font-size: 14px;
      color: ${({ theme }) => theme.colors.text};
      line-height: 1.5;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;

const UploadReceipt = styled.div`
  margin-top: 20px;
`;

const UploadTitle = styled.h4`
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;

  i {
    margin-right: 8px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const UploadArea = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 15px;

  &:hover, &.drag-over {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: rgba(74, 144, 226, 0.05);
  }

  i {
    font-size: 32px;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 10px;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const UploadActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const UploadBtn = styled.button`
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }

  i {
    margin-right: 8px;
  }
`;

const DepositHistory = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: 20px;
  margin-bottom: 30px;
`;

const HistoryFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;

  label {
    margin-right: 10px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
  }

  select {
    padding: 8px 15px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 4px;
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const HistoryTableContainer = styled.div`
  overflow-x: auto;
`;

const HistoryTable = styled.table`
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

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ status }) => 
    status === 'success' 
      ? 'rgba(76, 175, 80, 0.1)' 
      : status === 'pending' 
        ? 'rgba(255, 152, 0, 0.1)' 
        : 'rgba(244, 67, 54, 0.1)'};
  color: ${({ status }) => 
    status === 'success' 
      ? '#4caf50' 
      : status === 'pending' 
        ? '#ff9800' 
        : '#f44336'};
`;

const ActionBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 5px;
  transition: all 0.3s ease;

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

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;

  a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin: 0 5px;
    border-radius: 4px;
    background-color: white;
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      background-color: ${({ theme }) => theme.colors.background};
    }

    &.active {
      background-color: ${({ theme }) => theme.colors.primary};
      color: white;
      border-color: ${({ theme }) => theme.colors.primary};
    }
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
      color: ${({ theme }) => theme.colors.info};
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

const TransactionDetails = styled.div`
  margin-bottom: 20px;
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

const Deposit: React.FC = () => {
  const {
    // Dữ liệu
    accountInfo,
    depositHistory,
    currentTransaction,
    
    // Trạng thái
    depositAmount,
    selectedMethod,
    dateRange,
    statusFilter,
    loading,
    historyLoading,
    error,
    showBankInfo,
    showTransactionModal,
    processingDeposit,
    
    // Refs
    fileInputRef,
    uploadAreaRef,
    
    // Hàm xử lý
    handleAmountChange,
    formatCurrency,
    selectAmount,
    handleMethodChange,
    processDeposit,
    resetForm,
    handleDownloadReceipt,
    handleUploadReceipt,
    handleFileSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleUploadAreaClick,
    handleCopyToClipboard,
    fetchTransactionDetail,
    closeTransactionModal,
    setDateRange,
    setStatusFilter
  } = useDeposit();
  
  const formatCurrencyValue = useFormatCurrency();
  const formatDateValue = useFormatDate();

  // Xử lý khi thay đổi phương thức thanh toán
  const onMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleMethodChange(e.target.value);
  };

  // Xử lý khi thay đổi bộ lọc lịch sử
  const onDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateRange(e.target.value);
  };

  const onStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  // Hiển thị trạng thái giao dịch
  const renderTransactionStatus = (status: string) => {
    switch (status) {
      case "success":
        return <StatusBadge status="success">Thành công</StatusBadge>;
      case "pending":
        return <StatusBadge status="pending">Đang xử lý</StatusBadge>;
      case "failed":
        return <StatusBadge status="failed">Thất bại</StatusBadge>;
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      {/* Tiêu đề trang */}
      <PageTitle>
        <i className="fa fa-credit-card"></i> Nạp tiền vào tài khoản
      </PageTitle>

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
          {/* Thông tin tài khoản */}
          <AccountInfo>
            <InfoCard>
              <InfoHeader>
                <h2>Thông tin tài khoản</h2>
              </InfoHeader>
              <InfoBody>
                <InfoRow>
                  <InfoLabel>Mã sinh viên:</InfoLabel>
                  <InfoValue>{accountInfo?.studentId}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Họ và tên:</InfoLabel>
                  <InfoValue>{accountInfo?.fullName}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Số dư tài khoản:</InfoLabel>
                  <InfoValue className="balance">
                    {formatCurrencyValue(accountInfo?.balance || 0)}
                  </InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Cập nhật lần cuối:</InfoLabel>
                  <InfoValue>
                    {accountInfo?.lastUpdated
                      ? formatDateValue(accountInfo.lastUpdated)
                      : ""}
                  </InfoValue>
                </InfoRow>
              </InfoBody>
            </InfoCard>
          </AccountInfo>

          {/* Nạp tiền vào tài khoản */}
          <DepositSection>
            <SectionTitle>Nạp tiền vào tài khoản</SectionTitle>

            <DepositForm>
              <FormGroup>
                <label htmlFor="deposit-amount">Số tiền nạp:</label>
                <AmountInput>
                  <input
                    type="text"
                    id="deposit-amount"
                    placeholder="Nhập số tiền muốn nạp"
                    onChange={(e) => handleAmountChange(e.target.value)}
                    onBlur={(e) => formatCurrency(e.target)}
                  />
                  <span className="currency">VNĐ</span>
                </AmountInput>
              </FormGroup>

              <AmountSuggestions>
                <AmountBtn onClick={() => selectAmount(100000)}>100,000</AmountBtn>
                <AmountBtn onClick={() => selectAmount(200000)}>200,000</AmountBtn>
                <AmountBtn onClick={() => selectAmount(500000)}>500,000</AmountBtn>
                <AmountBtn onClick={() => selectAmount(1000000)}>
                  1,000,000
                </AmountBtn>
                <AmountBtn onClick={() => selectAmount(2000000)}>
                  2,000,000
                </AmountBtn>
                <AmountBtn onClick={() => selectAmount(5000000)}>
                  5,000,000
                </AmountBtn>
              </AmountSuggestions>

              <FormGroup>
                <label>Chọn phương thức thanh toán:</label>
                <PaymentMethods>
                  <PaymentMethod>
                    <input
                      type="radio"
                      id="method-card"
                      name="payment-method"
                      value="card"
                      checked={selectedMethod === "card"}
                      onChange={onMethodChange}
                    />
                    <label htmlFor="method-card">
                      <MethodIcon><i className="fa fa-credit-card"></i></MethodIcon>
                      <MethodInfo>
                        <MethodName>Thẻ ATM/Thẻ tín dụng</MethodName>
                        <MethodDesc>Thanh toán qua cổng VNPAY</MethodDesc>
                      </MethodInfo>
                    </label>
                  </PaymentMethod>

                  <PaymentMethod>
                    <input
                      type="radio"
                      id="method-momo"
                      name="payment-method"
                      value="momo"
                      checked={selectedMethod === "momo"}
                      onChange={onMethodChange}
                    />
                    <label htmlFor="method-momo">
                      <MethodIcon><i className="fa fa-mobile"></i></MethodIcon>
                      <MethodInfo>
                        <MethodName>Ví MoMo</MethodName>
                        <MethodDesc>Thanh toán qua ví điện tử MoMo</MethodDesc>
                      </MethodInfo>
                    </label>
                  </PaymentMethod>

                  <PaymentMethod>
                    <input
                      type="radio"
                      id="method-zalopay"
                      name="payment-method"
                      value="zalopay"
                      checked={selectedMethod === "zalopay"}
                      onChange={onMethodChange}
                    />
                    <label htmlFor="method-zalopay">
                      <MethodIcon><i className="fa fa-money"></i></MethodIcon>
                      <MethodInfo>
                        <MethodName>ZaloPay</MethodName>
                        <MethodDesc>Thanh toán qua ví điện tử ZaloPay</MethodDesc>
                      </MethodInfo>
                    </label>
                  </PaymentMethod>

                  <PaymentMethod>
                    <input
                      type="radio"
                      id="method-bank"
                      name="payment-method"
                      value="bank"
                      checked={selectedMethod === "bank"}
                      onChange={onMethodChange}
                    />
                    <label htmlFor="method-bank">
                      <MethodIcon><i className="fa fa-university"></i></MethodIcon>
                      <MethodInfo>
                        <MethodName>Chuyển khoản ngân hàng</MethodName>
                        <MethodDesc>
                          Chuyển khoản trực tiếp vào tài khoản trường
                        </MethodDesc>
                      </MethodInfo>
                    </label>
                  </PaymentMethod>
                </PaymentMethods>
              </FormGroup>

              <FormActions>
                <CancelBtn onClick={resetForm}>
                  <i className="fa fa-times"></i> Hủy
                </CancelBtn>
                <DepositBtn 
                  onClick={processDeposit}
                  disabled={!depositAmount || processingDeposit}
                >
                  <i className="fa fa-check"></i> Nạp tiền
                </DepositBtn>
              </FormActions>
            </DepositForm>

            {/* Thông tin chuyển khoản (hiển thị khi chọn phương thức chuyển khoản) */}
            <BankTransferInfo show={showBankInfo}>
              <BankInfoTitle>
                <i className="fa fa-info-circle"></i> Thông tin chuyển khoản
              </BankInfoTitle>

              <TransferDetails>
                <DetailRow>
                  <DetailLabel>Tên tài khoản:</DetailLabel>
                  <DetailValue>Trường Đại học Công nghệ Đồng Nai</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Số tài khoản:</DetailLabel>
                  <DetailValue>1234567890</DetailValue>
                  <CopyBtn
                    onClick={() => handleCopyToClipboard("1234567890")}
                    title="Sao chép"
                  >
                    <i className="fa fa-copy"></i>
                  </CopyBtn>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Ngân hàng:</DetailLabel>
                  <DetailValue>Vietcombank - Chi nhánh Đồng Nai</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Nội dung chuyển khoản:</DetailLabel>
                  <DetailValue>{accountInfo?.studentId} NAP TIEN</DetailValue>
                  <CopyBtn
                    onClick={() => handleCopyToClipboard(`${accountInfo?.studentId} NAP TIEN`)}
                    title="Sao chép"
                  >
                    <i className="fa fa-copy"></i>
                  </CopyBtn>
                </DetailRow>
              </TransferDetails>

              <QrCode>
                <img src="../assets/images/bank-qr.png" alt="QR Code chuyển khoản" />
                <p>Quét mã QR để chuyển khoản nhanh</p>
              </QrCode>

              <TransferNote>
                <h4><i className="fa fa-exclamation-circle"></i> Lưu ý quan trọng</h4>
                <ul>
                  <li>
                    Vui lòng ghi <strong>đúng nội dung chuyển khoản</strong> để hệ thống
                    có thể xác nhận giao dịch của bạn.
                  </li>
                  <li>Thời gian xử lý giao dịch: 5-15 phút trong giờ hành chính.</li>
                  <li>
                    Sau khi chuyển khoản, vui lòng chụp lại biên lai/màn hình xác nhận và
                    tải lên hệ thống bên dưới.
                  </li>
                </ul>
              </TransferNote>

              <UploadReceipt>
                <UploadTitle><i className="fa fa-upload"></i> Tải lên biên lai chuyển khoản</UploadTitle>
                <UploadArea 
                  ref={uploadAreaRef}
                  onClick={handleUploadAreaClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <i className="fa fa-cloud-upload"></i>
                  <p>Kéo và thả file hoặc click để chọn file</p>
                  <input
                    type="file"
                    id="receipt-file"
                    ref={fileInputRef}
                    accept="image/*,.pdf"
                    style={{ display: "none" }}
                    onChange={handleFileSelect}
                  />
                </UploadArea>
                <UploadActions>
                  <UploadBtn onClick={handleUploadReceipt}>
                    <i className="fa fa-upload"></i> Tải lên
                  </UploadBtn>
                </UploadActions>
              </UploadReceipt>
            </BankTransferInfo>
          </DepositSection>

          {/* Lịch sử nạp tiền */}
          <DepositHistory>
            <SectionTitle>Lịch sử nạp tiền</SectionTitle>

            <HistoryFilters>
              <FilterGroup>
                <label htmlFor="date-range">Thời gian:</label>
                <select 
                  id="date-range" 
                  value={dateRange}
                  onChange={onDateRangeChange}
                >
                  <option value="all">Tất cả</option>
                  <option value="today">Hôm nay</option>
                  <option value="week">7 ngày qua</option>
                  <option value="month">30 ngày qua</option>
                  <option value="year">Năm nay</option>
                </select>
              </FilterGroup>

              <FilterGroup>
                <label htmlFor="status-filter">Trạng thái:</label>
                <select 
                  id="status-filter" 
                  value={statusFilter}
                  onChange={onStatusFilterChange}
                >
                  <option value="all">Tất cả</option>
                  <option value="success">Thành công</option>
                  <option value="pending">Đang xử lý</option>
                  <option value="failed">Thất bại</option>
                </select>
              </FilterGroup>
            </HistoryFilters>

            <HistoryTableContainer>
              {historyLoading ? (
                <LoadingContainer>
                  <LoadingSpinner />
                </LoadingContainer>
              ) : (
                <HistoryTable>
                  <thead>
                    <tr>
                      <th>Mã giao dịch</th>
                      <th>Ngày giao dịch</th>
                      <th>Số tiền</th>
                      <th>Phương thức</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {depositHistory.length > 0 ? (
                      depositHistory.map((transaction) => (
                        <tr key={transaction.id} className={`history-row ${transaction.status}`}>
                          <td>{transaction.id}</td>
                          <td>{formatDateValue(transaction.date)}</td>
                          <td>{formatCurrencyValue(transaction.amount)}</td>
                          <td>{transaction.method}</td>
                          <td>{renderTransactionStatus(transaction.status)}</td>
                          <td>
                            <ActionBtn
                              className="view-btn"
                              title="Xem chi tiết"
                              onClick={() => fetchTransactionDetail(transaction.id)}
                            >
                              <i className="fa fa-eye"></i>
                            </ActionBtn>
                            {transaction.status === "success" && (
                              <ActionBtn
                                className="download-btn"
                                title="Tải biên lai"
                                onClick={() => handleDownloadReceipt(transaction.id)}
                              >
                                <i className="fa fa-download"></i>
                              </ActionBtn>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center", padding: "30px" }}>
                          Không có giao dịch nào phù hợp với tiêu chí tìm kiếm
                        </td>
                      </tr>
                    )}
                  </tbody>
                </HistoryTable>
              )}
            </HistoryTableContainer>

            <Pagination>
              <a href="#" className="active">1</a>
              <a href="#">2</a>
              <a href="#">3</a>
              <a href="#">&raquo;</a>
            </Pagination>
          </DepositHistory>
        </>
      )}

      {/* Modal xem chi tiết giao dịch */}
      <Modal 
        show={showTransactionModal} 
        onClick={(e) => {
          if (e.target === e.currentTarget) closeTransactionModal();
        }}
      >
        <ModalContent>
          <ModalHeader>
            <h3><i className="fa fa-info-circle"></i> Chi tiết giao dịch</h3>
            <CloseModal onClick={closeTransactionModal}>&times;</CloseModal>
          </ModalHeader>
          <ModalBody>
            <TransactionDetails>
              <DetailRow>
                <DetailLabel>Mã giao dịch:</DetailLabel>
                <DetailValue>{currentTransaction?.id}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Loại giao dịch:</DetailLabel>
                <DetailValue>Nạp tiền vào tài khoản</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Ngày giao dịch:</DetailLabel>
                <DetailValue>
                  {currentTransaction?.date
                    ? formatDateValue(currentTransaction.date)
                    : ""}
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Số tiền:</DetailLabel>
                <DetailValue>
                  {formatCurrencyValue(currentTransaction?.amount || 0)}
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Phương thức:</DetailLabel>
                <DetailValue>{currentTransaction?.method}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Trạng thái:</DetailLabel>
                <DetailValue>
                  {currentTransaction?.status
                    ? renderTransactionStatus(currentTransaction.status)
                    : ""}
                </DetailValue>
              </DetailRow>
              {currentTransaction?.status === "failed" && (
                <DetailRow>
                  <DetailLabel>Lý do thất bại:</DetailLabel>
                  <DetailValue>
                    Giao dịch bị từ chối bởi ngân hàng phát hành thẻ
                  </DetailValue>
                </DetailRow>
              )}
            </TransactionDetails>

            {currentTransaction?.status === "success" && (
              <FormActions>
                <DepositBtn onClick={() => handleDownloadReceipt(currentTransaction.id || "")}>
                  <i className="fa fa-download"></i> Tải biên lai
                </DepositBtn>
              </FormActions>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </PageContainer>
  );
};

export default Deposit;