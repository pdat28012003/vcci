import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import useNotifications, {
  Notification as NotificationData,
} from "../hooks/useNotifications";
import { useToast } from "../hooks/useUtils";

// Styled Components
const NotificationStats = styled.div`
  display: flex;
  margin-bottom: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
`;

const StatItem = styled.div`
  flex: 1;
  padding: 15px;
  text-align: center;
  border-right: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-right: none;
  }
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const SearchBox = styled.div`
  flex: 1;
  display: flex;
  min-width: 250px;

  input {
    flex: 1;
    padding: 10px 15px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-right: none;
    border-radius: 4px 0 0 4px;
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }

  button {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    border: none;
    padding: 0 15px;
    border-radius: 0 4px 4px 0;
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) => theme.colors.primaryDark};
    }
  }
`;

const FilterOptions = styled.div`
  display: flex;
  gap: 10px;

  select {
    padding: 10px 15px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 4px;
    font-size: 14px;
    background-color: white;
    min-width: 150px;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
`;

const NotificationItem = styled.div<{ unread?: boolean }>`
  display: flex;
  background-color: ${({ unread, theme }) =>
    unread ? "rgba(74, 144, 226, 0.05)" : "white"};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
  border-left: ${({ unread, theme }) =>
    unread ? `4px solid ${theme.colors.primary}` : "none"};
  padding: ${({ unread }) => (unread ? "15px 15px 15px 11px" : "15px")};
`;

const NotificationIcon = styled.div<{ type?: string }>`
  width: 50px;
  height: 50px;
  min-width: 50px;
  border-radius: 50%;
  background-color: ${({ type, theme }) => {
    switch (type) {
      case "important":
        return "rgba(255, 112, 67, 0.1)";
      case "academic":
        return "rgba(76, 175, 80, 0.1)";
      case "event":
        return "rgba(156, 39, 176, 0.1)";
      default:
        return "rgba(33, 150, 243, 0.1)";
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;

  i {
    font-size: 20px;
    color: ${({ type, theme }) => {
      switch (type) {
        case "important":
          return "#ff7043";
        case "academic":
          return "#4caf50";
        case "event":
          return "#9c27b0";
        default:
          return "#2196f3";
      }
    }};
  }
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

const NotificationBadge = styled.span<{ type: string }>`
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  background-color: ${({ type }) => {
    switch (type) {
      case "important":
        return "rgba(255, 112, 67, 0.1)";
      case "new":
        return "rgba(33, 150, 243, 0.1)";
      default:
        return "rgba(158, 158, 158, 0.1)";
    }
  }};
  color: ${({ type }) => {
    switch (type) {
      case "important":
        return "#ff7043";
      case "new":
        return "#2196f3";
      default:
        return "#9e9e9e";
    }
  }};
`;

const NotificationMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 8px;

  span {
    display: flex;
    align-items: center;

    i {
      margin-right: 5px;
    }
  }
`;

const NotificationPreview = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.5;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 20px;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 4px;
    background-color: white;
    color: ${({ theme }) => theme.colors.text};
    text-decoration: none;
    box-shadow: ${({ theme }) => theme.shadows.sm};
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
      background-color: ${({ theme }) => theme.colors.background};
    }

    &.active {
      background-color: ${({ theme }) => theme.colors.primary};
      color: white;
    }
  }
`;

// Interface cho dữ liệu thông báo hiển thị
interface PersonalNotification {
  id: string;
  title: string;
  department: string;
  date: string;
  content: string;
  isUnread: boolean;
  isImportant: boolean;
  isNew: boolean;
  type: "important" | "academic" | "event" | "default";
  icon: string;
}

// Hàm chuyển đổi từ NotificationData sang PersonalNotification
const mapNotificationToPersonal = (
  notification: NotificationData
): PersonalNotification => {
  // Xác định icon dựa trên loại thông báo
  let icon = "fa-info";
  if (notification.type === "important") {
    icon = "fa-exclamation";
  } else if (notification.type === "academic") {
    icon = "fa-graduation-cap";
  } else if (notification.type === "event") {
    icon = "fa-calendar-check-o";
  }

  return {
    id: notification.id,
    title: notification.title,
    department: notification.department,
    date: notification.date,
    content: notification.content,
    isUnread: notification.unread,
    isImportant: notification.important,
    isNew: notification.unread, // Giả định thông báo chưa đọc là mới
    type: notification.type,
    icon: icon,
  };
};

const PersonalNotifications: React.FC = () => {
  // State cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");

  // State cho thông báo cá nhân
  const [personalNotifications, setPersonalNotifications] = useState<
    PersonalNotification[]
  >([]);

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // Hooks
  const { notifications, loading, error, markAsRead, markAllAsRead } =
    useNotifications();
  const { showToast } = useToast();

  // Chuyển đổi thông báo từ API sang định dạng hiển thị
  useEffect(() => {
    if (notifications && notifications.length > 0) {
      const mappedNotifications = notifications.map(mapNotificationToPersonal);
      setPersonalNotifications(mappedNotifications);

      // Tính toán tổng số trang
      setTotalPages(Math.ceil(mappedNotifications.length / itemsPerPage));
    }
  }, [notifications, itemsPerPage]);

  // Tính toán số lượng thông báo
  const unreadCount = personalNotifications.filter((n) => n.isUnread).length;
  const importantCount = personalNotifications.filter(
    (n) => n.isImportant
  ).length;
  const totalCount = personalNotifications.length;

  // Hàm xử lý tìm kiếm
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Hàm xử lý lọc theo loại
  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
  };

  // Hàm xử lý lọc theo thời gian
  const handleTimeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeFilter(e.target.value);
  };

  // Hàm đánh dấu thông báo đã đọc
  const handleMarkAsRead = useCallback(
    async (id: string) => {
      try {
        // Gọi API để đánh dấu thông báo đã đọc (đã được xử lý trong hook useNotifications)
        await markAsRead(id);

        // Cập nhật UI
        setPersonalNotifications((prev) =>
          prev.map((notification) =>
            notification.id === id
              ? { ...notification, isUnread: false, isNew: false }
              : notification
          )
        );
      } catch (error) {
        showToast("Có lỗi xảy ra khi cập nhật trạng thái thông báo", "error");
      }
    },
    [markAsRead, showToast]
  );

  // Hàm đánh dấu tất cả thông báo đã đọc
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      // Gọi API để đánh dấu tất cả thông báo đã đọc (đã được xử lý trong hook useNotifications)
      await markAllAsRead();

      // Cập nhật UI
      setPersonalNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isUnread: false,
          isNew: false,
        }))
      );
    } catch (error) {
      showToast("Có lỗi xảy ra khi cập nhật trạng thái thông báo", "error");
    }
  }, [markAllAsRead, showToast]);

  // Hàm xử lý chuyển trang
  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return;
      setCurrentPage(page);
    },
    [totalPages]
  );

  // Hàm xử lý chuyển đến trang đầu tiên
  const handleFirstPage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handlePageChange(1);
    },
    [handlePageChange]
  );

  // Hàm xử lý chuyển đến trang trước
  const handlePrevPage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handlePageChange(currentPage - 1);
    },
    [currentPage, handlePageChange]
  );

  // Hàm xử lý chuyển đến trang tiếp theo
  const handleNextPage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handlePageChange(currentPage + 1);
    },
    [currentPage, handlePageChange]
  );

  // Hàm xử lý chuyển đến trang cuối cùng
  const handleLastPage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handlePageChange(totalPages);
    },
    [totalPages, handlePageChange]
  );

  // Hàm xử lý chuyển đến trang cụ thể
  const handleSpecificPage = useCallback(
    (e: React.MouseEvent, page: number) => {
      e.preventDefault();
      handlePageChange(page);
    },
    [handlePageChange]
  );

  return (
    <>
      {/* Tiêu đề trang */}
      <h1 className="page-title">
        <i className="fa fa-bell" style={{ color: "#ff7043" }}></i> Thông báo cá
        nhân
      </h1>

      {/* Thống kê thông báo */}
      <NotificationStats>
        <StatItem>
          <StatValue>{loading ? "..." : unreadCount}</StatValue>
          <StatLabel>Chưa đọc</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{loading ? "..." : importantCount}</StatValue>
          <StatLabel>Quan trọng</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{loading ? "..." : totalCount}</StatValue>
          <StatLabel>Tổng số</StatLabel>
        </StatItem>
      </NotificationStats>

      {/* Phần tìm kiếm và lọc */}
      <FilterSection>
        <SearchBox>
          <input
            type="text"
            placeholder="Tìm kiếm thông báo..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <button>
            <i className="fa fa-search"></i>
          </button>
        </SearchBox>
        <FilterOptions>
          <select value={categoryFilter} onChange={handleCategoryFilter}>
            <option value="">Tất cả loại</option>
            <option value="important">Quan trọng</option>
            <option value="academic">Học tập</option>
            <option value="event">Sự kiện</option>
            <option value="default">Khác</option>
          </select>
          <select value={timeFilter} onChange={handleTimeFilter}>
            <option value="">Tất cả thời gian</option>
            <option value="today">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="semester">Học kỳ hiện tại</option>
          </select>
        </FilterOptions>
      </FilterSection>

      {/* Nút đánh dấu tất cả đã đọc */}
      {unreadCount > 0 && (
        <div style={{ marginBottom: "20px", textAlign: "right" }}>
          <button
            onClick={handleMarkAllAsRead}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4a90e2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            <i
              className="fa fa-check-circle"
              style={{ marginRight: "5px" }}
            ></i>
            Đánh dấu tất cả đã đọc
          </button>
        </div>
      )}

      {/* Hiển thị thông báo lỗi */}
      {error && (
        <div
          style={{
            padding: "15px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          <i
            className="fa fa-exclamation-circle"
            style={{ marginRight: "10px" }}
          ></i>
          {error}
        </div>
      )}

      {/* Hiển thị loading */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "30px 0" }}>
          <div
            style={{ fontSize: "24px", color: "#4a90e2", marginBottom: "10px" }}
          >
            <i className="fa fa-spinner fa-spin"></i>
          </div>
          <div>Đang tải thông báo...</div>
        </div>
      ) : (
        /* Danh sách thông báo */
        <NotificationList>
          {personalNotifications.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "30px",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  fontSize: "48px",
                  color: "#9e9e9e",
                  marginBottom: "10px",
                }}
              >
                <i className="fa fa-bell-slash-o"></i>
              </div>
              <div style={{ fontSize: "16px", color: "#616161" }}>
                Không có thông báo nào
              </div>
            </div>
          ) : (
            personalNotifications
              .filter((notification) => {
                // Lọc theo từ khóa tìm kiếm
                if (
                  searchTerm &&
                  !notification.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) &&
                  !notification.content
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                ) {
                  return false;
                }

                // Lọc theo loại
                if (categoryFilter && notification.type !== categoryFilter) {
                  return false;
                }

                // Lọc theo thời gian (giả định đơn giản)
                if (timeFilter) {
                  const today = new Date();
                  const notifDate = new Date(
                    notification.date.split("/").reverse().join("-")
                  );

                  if (
                    timeFilter === "today" &&
                    !(
                      notifDate.getDate() === today.getDate() &&
                      notifDate.getMonth() === today.getMonth() &&
                      notifDate.getFullYear() === today.getFullYear()
                    )
                  ) {
                    return false;
                  }

                  // Các lọc thời gian khác có thể được thêm vào tương tự
                }

                return true;
              })
              // Phân trang
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((notification) => (
                <NotificationItem
                  key={notification.id}
                  unread={notification.isUnread}
                  onClick={() => handleMarkAsRead(notification.id)}
                  style={{ cursor: "pointer" }}
                >
                  <NotificationIcon type={notification.type}>
                    <i className={`fa ${notification.icon}`}></i>
                  </NotificationIcon>
                  <NotificationContent>
                    <NotificationTitle>
                      {notification.title}
                      {notification.isImportant && (
                        <NotificationBadge type="important">
                          Quan trọng
                        </NotificationBadge>
                      )}
                      {notification.isNew && (
                        <NotificationBadge type="new">Mới</NotificationBadge>
                      )}
                    </NotificationTitle>
                    <NotificationMeta>
                      <span>
                        <i className="fa fa-building-o"></i>{" "}
                        {notification.department}
                      </span>
                      <span>
                        <i className="fa fa-calendar"></i> {notification.date}
                      </span>
                    </NotificationMeta>
                    <NotificationPreview>
                      {notification.content}
                    </NotificationPreview>
                  </NotificationContent>
                </NotificationItem>
              ))
          )}
        </NotificationList>
      )}
      {!loading && personalNotifications.length > 0 && (
        <Pagination>
          <a
            href="#"
            onClick={handleFirstPage}
            style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
          >
            <i className="fa fa-angle-double-left"></i>
          </a>
          <a
            href="#"
            onClick={handlePrevPage}
            style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
          >
            <i className="fa fa-angle-left"></i>
          </a>

          {/* Hiển thị các trang */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Tính toán số trang để hiển thị (tối đa 5 trang)
            let pageToShow;
            if (totalPages <= 5) {
              // Nếu tổng số trang <= 5, hiển thị tất cả các trang
              pageToShow = i + 1;
            } else if (currentPage <= 3) {
              // Nếu đang ở gần đầu, hiển thị 5 trang đầu tiên
              pageToShow = i + 1;
            } else if (currentPage >= totalPages - 2) {
              // Nếu đang ở gần cuối, hiển thị 5 trang cuối cùng
              pageToShow = totalPages - 4 + i;
            } else {
              // Nếu đang ở giữa, hiển thị 2 trang trước và 2 trang sau trang hiện tại
              pageToShow = currentPage - 2 + i;
            }

            return (
              <a
                key={pageToShow}
                href="#"
                className={currentPage === pageToShow ? "active" : ""}
                onClick={(e) => handleSpecificPage(e, pageToShow)}
              >
                {pageToShow}
              </a>
            );
          })}

          <a
            href="#"
            onClick={handleNextPage}
            style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
          >
            <i className="fa fa-angle-right"></i>
          </a>
          <a
            href="#"
            onClick={handleLastPage}
            style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
          >
            <i className="fa fa-angle-double-right"></i>
          </a>
        </Pagination>
      )}
    </>
  );
};

export default PersonalNotifications;
