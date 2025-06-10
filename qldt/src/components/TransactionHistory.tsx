import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import useTransactionHistory from "../hooks/useTransactionHistory";
import {
  Transaction,
  TransactionFilter,
} from "../services/transactionHistoryService";
import { formatCurrency, formatDate } from "../utils/formatters";

// Styled components
const TransactionHistoryWrapper = styled.div`
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
  border-top: 4px solid #4a90e2;
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

const Modal = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  background-color: white;
  margin: 5% auto;
  padding: 0;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: modalFadeIn 0.3s;

  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const TransactionHistory: React.FC = () => {
  // Sử dụng custom hook để lấy dữ liệu và các hàm xử lý
  const {
    transactions,
    stats,
    chartData,
    selectedTransaction,
    loading,
    statsLoading,
    chartLoading,
    detailLoading,
    error,
    currentFilter,
    fetchTransactions,
    fetchTransactionDetail,
    downloadReceipt,
    retryTransaction,
    exportToExcel,
    exportToPDF,
    applyFilter,
    searchTransactions,
    applyDateFilter,
    printTransactions,
  } = useTransactionHistory();

  // Load CSS
  useEffect(() => {
    // Thêm link CSS vào head
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/css/lich-su-giao-dich.css";
    document.head.appendChild(link);

    // Cleanup khi component unmount
    return () => {
      // Tìm và xóa link CSS
      const links = document.head.getElementsByTagName("link");
      for (let i = 0; i < links.length; i++) {
        if (links[i].href.includes("lich-su-giao-dich.css")) {
          document.head.removeChild(links[i]);
          break;
        }
      }
    };
  }, []);

  // State cho modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Refs cho các input
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dateFromRef = useRef<HTMLInputElement>(null);
  const dateToRef = useRef<HTMLInputElement>(null);

  // Xử lý khi click vào nút xem chi tiết
  const handleViewTransaction = async (transactionId: string) => {
    await fetchTransactionDetail(transactionId);
    setIsModalOpen(true);
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Xử lý khi click bên ngoài modal
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Xử lý khi thay đổi bộ lọc
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;

    switch (id) {
      case "transaction-type":
        applyFilter({ type: value });
        break;
      case "transaction-status":
        applyFilter({ status: value });
        break;
      case "date-range":
        applyFilter({
          dateRange: value,
          dateFrom: undefined,
          dateTo: undefined,
        });
        break;
    }
  };

  // Xử lý khi nhấn nút tìm kiếm
  const handleSearch = () => {
    if (searchInputRef.current) {
      searchTransactions(searchInputRef.current.value);
    }
  };

  // Xử lý khi nhấn Enter trong ô tìm kiếm
  const handleSearchKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Xử lý khi nhấn nút áp dụng bộ lọc ngày
  const handleApplyDateFilter = () => {
    if (dateFromRef.current && dateToRef.current) {
      applyDateFilter(dateFromRef.current.value, dateToRef.current.value);
    }
  };

  // Format số tiền
  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VNĐ";
  };

  // Format ngày giờ
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Lấy tên hiển thị cho loại giao dịch
  const getTransactionTypeName = (type: string): string => {
    switch (type) {
      case "tuition":
        return "Học phí";
      case "deposit":
        return "Nạp tiền";
      case "fee":
        return "Các khoản thu khác";
      case "refund":
        return "Hoàn tiền";
      default:
        return type;
    }
  };

  // Lấy tên hiển thị cho trạng thái giao dịch
  const getStatusName = (status: string): string => {
    switch (status) {
      case "success":
        return "Thành công";
      case "pending":
        return "Đang xử lý";
      case "failed":
        return "Thất bại";
      default:
        return status;
    }
  };

  // Lấy class CSS cho trạng thái giao dịch
  const getStatusClass = (status: string): string => {
    return status;
  };

  return (
    <TransactionHistoryWrapper>
      {/* Hiển thị loading overlay khi đang tải dữ liệu */}
      {loading && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}

      {/* Tiêu đề trang */}
      <h1 className="page-title">
        <i className="fa fa-history"></i> Lịch sử giao dịch
      </h1>

      {/* Thống kê giao dịch */}
      <div className="transaction-stats">
        <div className="stat-item">
          <div className="stat-value">{stats?.totalCount || 0}</div>
          <div className="stat-label">Tổng số giao dịch</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            {formatAmount(stats?.totalAmount || 0)}
          </div>
          <div className="stat-label">Tổng tiền giao dịch</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats?.monthlyCount || 0}</div>
          <div className="stat-label">Giao dịch trong tháng</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            {formatAmount(stats?.monthlyAmount || 0)}
          </div>
          <div className="stat-label">Tổng tiền trong tháng</div>
        </div>
      </div>

      {/* Bộ lọc và điều khiển */}
      <div className="transaction-controls">
        <div className="filter-section">
          <div className="filter-group">
            <label htmlFor="transaction-type">
              <i className="fa fa-filter"></i> Loại giao dịch:
            </label>
            <select
              id="transaction-type"
              value={currentFilter.type || "all"}
              onChange={handleFilterChange}
            >
              <option value="all">Tất cả</option>
              <option value="tuition">Học phí</option>
              <option value="deposit">Nạp tiền</option>
              <option value="fee">Các khoản thu khác</option>
              <option value="refund">Hoàn tiền</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="transaction-status">
              <i className="fa fa-check-circle"></i> Trạng thái:
            </label>
            <select
              id="transaction-status"
              value={currentFilter.status || "all"}
              onChange={handleFilterChange}
            >
              <option value="all">Tất cả</option>
              <option value="success">Thành công</option>
              <option value="pending">Đang xử lý</option>
              <option value="failed">Thất bại</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="date-range">
              <i className="fa fa-calendar"></i> Thời gian:
            </label>
            <select
              id="date-range"
              value={currentFilter.dateRange || "all"}
              onChange={handleFilterChange}
            >
              <option value="all">Tất cả</option>
              <option value="today">Hôm nay</option>
              <option value="week">7 ngày qua</option>
              <option value="month">30 ngày qua</option>
              <option value="month-3">3 tháng qua</option>
              <option value="month-6">6 tháng qua</option>
              <option value="year">1 năm qua</option>
            </select>
          </div>

          <div className="filter-group date-picker">
            <label>
              <i className="fa fa-calendar-check-o"></i> Khoảng thời gian cụ
              thể:
            </label>
            <div className="date-inputs">
              <input
                type="date"
                id="date-from"
                placeholder="Từ ngày"
                ref={dateFromRef}
              />
              <span>đến</span>
              <input
                type="date"
                id="date-to"
                placeholder="Đến ngày"
                ref={dateToRef}
              />
              <button
                className="apply-date-btn"
                onClick={handleApplyDateFilter}
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>

        <div className="action-controls">
          <div className="search-box">
            <i className="fa fa-search search-icon"></i>
            <input
              type="text"
              id="transaction-search"
              placeholder="Tìm kiếm theo mã giao dịch, mô tả..."
              ref={searchInputRef}
              onKeyUp={handleSearchKeyUp}
            />
            <button className="search-btn" onClick={handleSearch}>
              Tìm kiếm
            </button>
          </div>

          <div className="action-buttons">
            <button
              className="action-btn print-btn"
              onClick={printTransactions}
            >
              <i className="fa fa-print"></i> In danh sách
            </button>
            <button className="action-btn export-btn" onClick={exportToExcel}>
              <i className="fa fa-file-excel-o"></i> Xuất Excel
            </button>
            <button className="action-btn export-pdf-btn" onClick={exportToPDF}>
              <i className="fa fa-file-pdf-o"></i> Xuất PDF
            </button>
          </div>
        </div>
      </div>

      {/* Bảng lịch sử giao dịch */}
      <div className="transaction-table-container">
        <h2 className="section-title">
          <i className="fa fa-list-alt"></i> Danh sách giao dịch
        </h2>

        <table className="transaction-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã giao dịch</th>
              <th>Ngày giao dịch</th>
              <th>Loại giao dịch</th>
              <th>Mô tả</th>
              <th>Số tiền</th>
              <th>Phương thức</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <tr
                  key={transaction.id}
                  className={`transaction-row ${transaction.status} ${transaction.type}`}
                >
                  <td>{index + 1}</td>
                  <td>{transaction.transactionId}</td>
                  <td>{formatDateTime(transaction.date)}</td>
                  <td>{getTransactionTypeName(transaction.type)}</td>
                  <td>{transaction.description}</td>
                  <td>{formatAmount(transaction.amount)}</td>
                  <td>{transaction.paymentMethod}</td>
                  <td>
                    <span
                      className={`status-badge ${getStatusClass(
                        transaction.status
                      )}`}
                    >
                      {getStatusName(transaction.status)}
                    </span>
                  </td>
                  <td>
                    <button
                      className="view-btn"
                      title="Xem chi tiết"
                      onClick={() =>
                        handleViewTransaction(transaction.transactionId)
                      }
                    >
                      <i className="fa fa-eye"></i>
                    </button>
                    {transaction.status === "success" && (
                      <button
                        className="download-btn"
                        title="Tải biên lai"
                        onClick={() =>
                          downloadReceipt(transaction.transactionId)
                        }
                      >
                        <i className="fa fa-download"></i>
                      </button>
                    )}
                    {transaction.status === "failed" && (
                      <button
                        className="retry-btn"
                        title="Thử lại"
                        onClick={() =>
                          retryTransaction(transaction.transactionId)
                        }
                      >
                        <i className="fa fa-refresh"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  {loading ? "Đang tải dữ liệu..." : "Không có giao dịch nào"}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Phân trang - Có thể thêm logic phân trang thực tế ở đây */}
        <div className="pagination">
          <a href="#" className="active">
            1
          </a>
          <a href="#">2</a>
          <a href="#">3</a>
          <a href="#">&raquo;</a>
        </div>
      </div>

      {/* Biểu đồ thống kê */}
      <div className="transaction-charts">
        <h2 className="section-title">
          <i className="fa fa-bar-chart"></i> Thống kê giao dịch
        </h2>

        <div className="charts-container">
          <div className="chart-item">
            <h3 className="chart-title">
              <i className="fa fa-pie-chart"></i> Giao dịch theo loại
            </h3>
            <div className="chart-placeholder">
              {chartLoading ? (
                <div>Đang tải biểu đồ...</div>
              ) : (
                <>
                  <div
                    className="pie-chart"
                    style={{
                      background: chartData?.byType
                        ? `conic-gradient(${chartData.byType
                            .map((item, index, arr) => {
                              const startPercent = arr
                                .slice(0, index)
                                .reduce((sum, i) => sum + i.percentage, 0);
                              return `${item.color} ${startPercent}% ${
                                startPercent + item.percentage
                              }%`;
                            })
                            .join(", ")})`
                        : "conic-gradient(#eee 0% 100%)",
                    }}
                  >
                    {/* Biểu đồ tròn được tạo bằng conic-gradient */}
                  </div>
                  <div className="chart-legend">
                    {chartData?.byType.map((item, index) => (
                      <div key={index} className="legend-item">
                        <span
                          className="legend-color"
                          style={{ backgroundColor: item.color }}
                        ></span>
                        <span className="legend-label">
                          {item.type} ({item.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal xem chi tiết giao dịch */}
      <Modal isOpen={isModalOpen} onClick={handleModalClick}>
        <ModalContent>
          <div className="modal-header">
            <h3>
              <i className="fa fa-info-circle"></i> Chi tiết giao dịch
            </h3>
            <span className="close-modal" onClick={closeModal}>
              &times;
            </span>
          </div>
          <div className="modal-body">
            {detailLoading ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                Đang tải chi tiết giao dịch...
              </div>
            ) : selectedTransaction ? (
              <div className="transaction-details">
                <div className="detail-row">
                  <div className="detail-label">
                    <i className="fa fa-hashtag"></i> Mã giao dịch:
                  </div>
                  <div className="detail-value">
                    {selectedTransaction.transactionId}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">
                    <i className="fa fa-tag"></i> Loại giao dịch:
                  </div>
                  <div className="detail-value">
                    {getTransactionTypeName(selectedTransaction.type)}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">
                    <i className="fa fa-file-text-o"></i> Mô tả:
                  </div>
                  <div className="detail-value">
                    {selectedTransaction.description}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">
                    <i className="fa fa-calendar"></i> Ngày giao dịch:
                  </div>
                  <div className="detail-value">
                    {formatDateTime(selectedTransaction.date)}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">
                    <i className="fa fa-money"></i> Số tiền:
                  </div>
                  <div className="detail-value">
                    {formatAmount(selectedTransaction.amount)}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">
                    <i className="fa fa-credit-card"></i> Phương thức thanh
                    toán:
                  </div>
                  <div className="detail-value">
                    {selectedTransaction.paymentMethod}
                  </div>
                </div>
                {selectedTransaction.details?.cardInfo && (
                  <div className="detail-row">
                    <div className="detail-label">
                      <i className="fa fa-credit-card-alt"></i> Thông tin thanh
                      toán:
                    </div>
                    <div className="detail-value">
                      Thẻ: {selectedTransaction.details.cardInfo}
                    </div>
                  </div>
                )}
                {selectedTransaction.details?.bank && (
                  <div className="detail-row">
                    <div className="detail-label">
                      <i className="fa fa-university"></i> Ngân hàng:
                    </div>
                    <div className="detail-value">
                      {selectedTransaction.details.bank}
                    </div>
                  </div>
                )}
                {selectedTransaction.details?.partnerTransactionId && (
                  <div className="detail-row">
                    <div className="detail-label">
                      <i className="fa fa-barcode"></i> Mã giao dịch đối tác:
                    </div>
                    <div className="detail-value">
                      {selectedTransaction.details.partnerTransactionId}
                    </div>
                  </div>
                )}
                <div className="detail-row">
                  <div className="detail-label">
                    <i className="fa fa-info-circle"></i> Trạng thái:
                  </div>
                  <div className="detail-value">
                    <span
                      className={`status-badge ${getStatusClass(
                        selectedTransaction.status
                      )}`}
                    >
                      {getStatusName(selectedTransaction.status)}
                    </span>
                  </div>
                </div>
                {selectedTransaction.details?.user && (
                  <div className="detail-row">
                    <div className="detail-label">
                      <i className="fa fa-user"></i> Người thực hiện:
                    </div>
                    <div className="detail-value">
                      {selectedTransaction.details.user}
                    </div>
                  </div>
                )}
                {selectedTransaction.details?.note && (
                  <div className="detail-row">
                    <div className="detail-label">
                      <i className="fa fa-sticky-note"></i> Ghi chú:
                    </div>
                    <div className="detail-value">
                      {selectedTransaction.details.note}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                Không tìm thấy thông tin giao dịch
              </div>
            )}
          </div>
          <div className="modal-footer">
            {selectedTransaction &&
              selectedTransaction.status === "success" && (
                <button
                  className="download-btn"
                  onClick={() =>
                    downloadReceipt(selectedTransaction.transactionId)
                  }
                >
                  <i className="fa fa-download"></i> Tải biên lai
                </button>
              )}
            <button className="close-btn" onClick={closeModal}>
              <i className="fa fa-times"></i> Đóng
            </button>
          </div>
        </ModalContent>
      </Modal>
    </TransactionHistoryWrapper>
  );
};

export default TransactionHistory;
