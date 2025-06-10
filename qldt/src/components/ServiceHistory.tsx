import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useToast } from "../hooks/useUtils";
import useOneStopService, {
  Service,
  ServiceRegistration,
} from "../services/oneStopService";

// Styled Components
const HistoryContainer = styled.div`
  margin-top: 30px;
`;

const HistoryTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.colors.text};

  i {
    margin-right: 10px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const HistoryTable = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  padding: 15px;
  background-color: ${({ theme }) => theme.colors.light};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-weight: 500;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  padding: 15px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &:not(:last-child) {
      border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    }
  }
`;

const TableCell = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;

    &:before {
      content: attr(data-label);
      font-weight: 500;
      width: 40%;
      margin-right: 10px;
    }
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;

  background-color: ${({ status, theme }) => {
    switch (status) {
      case "pending":
        return "rgba(33, 150, 243, 0.1)";
      case "completed":
        return "rgba(76, 175, 80, 0.1)";
      case "rejected":
        return "rgba(244, 67, 54, 0.1)";
      case "additional_info_required":
        return "rgba(255, 152, 0, 0.1)";
      default:
        return "rgba(158, 158, 158, 0.1)";
    }
  }};

  color: ${({ status, theme }) => {
    switch (status) {
      case "pending":
        return "#2196f3";
      case "completed":
        return "#4caf50";
      case "rejected":
        return "#f44336";
      case "additional_info_required":
        return "#ff9800";
      default:
        return "#9e9e9e";
    }
  }};
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

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  text-align: center;

  i {
    font-size: 48px;
    color: ${({ theme }) => theme.colors.textLight};
    margin-bottom: 15px;
  }

  h3 {
    font-size: 18px;
    margin-bottom: 10px;
    color: ${({ theme }) => theme.colors.text};
  }

  p {
    color: ${({ theme }) => theme.colors.textLight};
    max-width: 500px;
    margin: 0 auto;
  }
`;

// Định nghĩa interface cho dữ liệu hiển thị
interface ServiceHistoryItem {
  id: string;
  serviceName: string;
  status: string;
  date: string;
}

// Component hiển thị lịch sử đăng ký dịch vụ
const ServiceHistory: React.FC = () => {
  // State
  const [historyItems, setHistoryItems] = useState<ServiceHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const { getUserServiceRegistrations, getServices } = useOneStopService();
  const { showToast } = useToast();

  // Lấy dữ liệu khi component được mount
  useEffect(() => {
    let isMounted = true; // Biến để kiểm tra component còn mounted hay không

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Lấy danh sách đăng ký dịch vụ và danh sách dịch vụ
        const [registrations, services] = await Promise.all([
          getUserServiceRegistrations(),
          getServices(),
        ]);

        // Chỉ cập nhật state nếu component vẫn mounted
        if (isMounted) {
          // Kết hợp dữ liệu để hiển thị
          const historyData: ServiceHistoryItem[] = registrations.map(
            (registration) => {
              const service = services.find(
                (s) => s.id === registration.serviceId
              );
              return {
                id: registration.serviceId,
                serviceName: service ? service.name : "Dịch vụ không xác định",
                status: registration.status,
                date: formatDate(registration.createdAt),
              };
            }
          );

          setHistoryItems(historyData);
          setLoading(false);
        }
      } catch (err) {
        // Chỉ cập nhật state nếu component vẫn mounted
        if (isMounted) {
          setError(
            "Có lỗi xảy ra khi tải lịch sử đăng ký dịch vụ. Vui lòng thử lại sau."
          );
          setLoading(false);
          showToast("Có lỗi xảy ra khi tải lịch sử đăng ký dịch vụ", "error");
        }
      }
    };

    fetchData();

    // Cleanup function để tránh memory leak
    return () => {
      isMounted = false;
    };
  }, [getUserServiceRegistrations, getServices, showToast]);

  // Hàm định dạng ngày tháng
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  // Hàm hiển thị trạng thái
  const getStatusText = (status: string): string => {
    switch (status) {
      case "pending":
        return "Đang xử lý";
      case "completed":
        return "Đã hoàn thành";
      case "rejected":
        return "Đã từ chối";
      case "additional_info_required":
        return "Cần bổ sung";
      default:
        return "Không xác định";
    }
  };

  return (
    <HistoryContainer>
      <HistoryTitle>
        <i className="fa fa-history"></i> Lịch sử đăng ký dịch vụ
      </HistoryTitle>

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
          {/* Hiển thị trạng thái trống nếu không có lịch sử */}
          {historyItems.length === 0 ? (
            <EmptyStateContainer>
              <i className="fa fa-history"></i>
              <h3>Chưa có lịch sử đăng ký dịch vụ</h3>
              <p>
                Bạn chưa đăng ký dịch vụ nào. Vui lòng đăng ký dịch vụ để xem
                lịch sử tại đây.
              </p>
            </EmptyStateContainer>
          ) : (
            <HistoryTable>
              <TableHeader>
                <div>Ngày đăng ký</div>
                <div>Tên dịch vụ</div>
                <div>Trạng thái</div>
                <div>Thao tác</div>
              </TableHeader>

              {historyItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell data-label="Ngày đăng ký:">{item.date}</TableCell>
                  <TableCell data-label="Tên dịch vụ:">
                    {item.serviceName}
                  </TableCell>
                  <TableCell data-label="Trạng thái:">
                    <StatusBadge status={item.status}>
                      {getStatusText(item.status)}
                    </StatusBadge>
                  </TableCell>
                  <TableCell data-label="Thao tác:">
                    <button
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#f0f0f0",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        showToast(
                          "Chức năng xem chi tiết đang được phát triển",
                          "info"
                        )
                      }
                    >
                      Xem chi tiết
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </HistoryTable>
          )}
        </>
      )}
    </HistoryContainer>
  );
};

export default ServiceHistory;
