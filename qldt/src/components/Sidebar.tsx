import React, { useState } from "react";
import styled from "styled-components";

const SidebarWrapper = styled.div<{ isActive: boolean }>`
  position: fixed;
  top: 60px;
  left: 0;
  width: 280px;
  height: calc(100vh - 60px);
  background-color: white;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  z-index: 900;
  overflow-y: auto;
  transition: transform ${({ theme }) => theme.transitions.normal} ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    transform: translateX(${({ isActive }) => (isActive ? "0" : "-100%")});
  }
`;

const SidebarOverlay = styled.div<{ isActive: boolean }>`
  position: fixed;
  top: 60px;
  left: 0;
  width: 100%;
  height: calc(100vh - 60px);
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 800;
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: ${({ isActive }) => (isActive ? "block" : "none")};
  }
`;

const SidebarHeader = styled.div`
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.light};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};

  i {
    margin-right: 10px;
  }
`;

const SidebarMenu = styled.ul`
  padding: 10px 0;
`;

const MenuItem = styled.li`
  position: relative;
`;

const MenuLink = styled.a<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: ${({ theme, isActive }) =>
    isActive ? theme.colors.primary : theme.colors.text};
  transition: background-color ${({ theme }) => theme.transitions.fast};
  font-weight: ${({ isActive }) => (isActive ? "500" : "400")};
  background-color: ${({ theme, isActive }) =>
    isActive ? "rgba(74, 144, 226, 0.1)" : "transparent"};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
  }

  i {
    margin-right: 10px;
    width: 20px;
    text-align: center;
  }
`;

const Submenu = styled.ul<{ isOpen: boolean }>`
  max-height: ${({ isOpen }) => (isOpen ? "1000px" : "0")};
  overflow: hidden;
  transition: max-height ${({ theme }) => theme.transitions.normal} ease;
  background-color: ${({ theme }) => theme.colors.light};
`;

const SubmenuItem = styled.li`
  padding-left: 20px;
`;

const SubmenuLink = styled.a<{ isActive?: boolean }>`
  display: block;
  padding: 10px 16px 10px 26px;
  color: ${({ theme, isActive }) =>
    isActive ? theme.colors.primary : theme.colors.text};
  transition: background-color ${({ theme }) => theme.transitions.fast};
  font-weight: ${({ isActive }) => (isActive ? "500" : "400")};
  background-color: ${({ theme, isActive }) =>
    isActive ? "rgba(74, 144, 226, 0.1)" : "transparent"};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  link?: string;
  submenu?: SubMenuItem[];
}

interface SubMenuItem {
  id: string;
  title: string;
  link?: string;
}

interface SidebarProps {
  isActive: boolean;
  onClose: () => void;
  activeContent: string;
  setActiveContent: (contentId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isActive,
  onClose,
  activeContent,
  setActiveContent,
}) => {
  // State để theo dõi submenu nào đang mở
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);

  // Danh sách menu
  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      title: "Trang chủ",
      icon: "fa-home",
      link: "#",
    },
    {
      id: "utilities",
      title: "Tiện ích",
      icon: "fa-th",
      submenu: [
        { id: "thong-bao-nha-truong", title: "Thông báo từ nhà trường" },
        { id: "thong-bao-ca-nhan", title: "Thông báo cá nhân" },
        { id: "bang-tin", title: "Bảng tin" },
        { id: "dich-vu-mot-cua", title: "Dịch vụ một cửa" },
        { id: "huong-dan-su-dung", title: "Hướng dẫn sử dụng" },
        { id: "bao-hong-thiet-bi", title: "Báo hỏng thiết bị" },
      ],
    },
    {
      id: "personal-info",
      title: "Thông tin cá nhân",
      icon: "fa-user",
      submenu: [
        { id: "ho-so-sinh-vien", title: "Hồ sơ sinh viên" },
        { id: "cap-nhat-thong-tin", title: "Cập nhật thông tin" },
      ],
    },
    {
      id: "transactions",
      title: "Theo dõi giao dịch",
      icon: "fa-money",
      submenu: [
        { id: "hoc-phi", title: "Học phí" },
        { id: "cac-khoan-thu-khac", title: "Các khoản thu khác" },
        { id: "nap-tien-vao-tai-khoan", title: "Nạp tiền vào tài khoản" },
        { id: "thanh-toan-cong-no", title: "Thanh toán công nợ" },
        { id: "lich-su-giao-dich", title: "Lịch sử giao dịch" },
      ],
    },
    {
      id: "curriculum",
      title: "Chương trình đào tạo",
      icon: "fa-graduation-cap",
      submenu: [
        { id: "khung-chuong-trinh", title: "Khung chương trình" },
        { id: "khung-theo-ky", title: "Khung theo kỳ" },
      ],
    },
    {
      id: "course-registration",
      title: "Đăng ký học phần",
      icon: "fa-calendar",
      submenu: [
        { id: "dang-ky-hoc-phan", title: "Đăng ký học phần" },
        { id: "rut-hoc-phan", title: "Rút học phần" },
        {
          id: "thong-tin-dang-ky-hoc-phan",
          title: "Thông tin đăng ký học phần",
        },
      ],
    },
    {
      id: "schedule",
      title: "Thời khóa biểu",
      icon: "fa-table",
      submenu: [{ id: "thoi-khoa-bieu", title: "Thời khóa biểu" }],
    },
    {
      id: "exam-schedule",
      title: "Theo dõi lịch thi",
      icon: "fa-calendar-check-o",
      submenu: [{ id: "lich-thi", title: "Lịch thi" }],
    },
    {
      id: "academic-results",
      title: "Theo dõi KQ học tập",
      icon: "fa-bar-chart",
      submenu: [
        { id: "ket-qua-hoc-tap", title: "Kết quả học tập" },
        { id: "ket-qua-thi", title: "Kết quả thi" },
        { id: "bang-diem", title: "Bảng điểm" },
      ],
    },
  ];

  // Hàm toggle submenu
  const toggleSubmenu = (menuId: string) => {
    setOpenSubmenus((prev) => {
      if (prev.includes(menuId)) {
        return prev.filter((id) => id !== menuId);
      } else {
        return [...prev, menuId];
      }
    });
  };

  // Hàm xử lý khi click vào menu item
  const handleMenuClick = (
    menuId: string,
    hasSubmenu: boolean,
    e: React.MouseEvent
  ) => {
    e.preventDefault();

    if (hasSubmenu) {
      toggleSubmenu(menuId);
    } else {
      setActiveContent(menuId);

      // Đóng sidebar trên mobile khi chọn menu
      if (window.innerWidth <= 992) {
        onClose();
      }
    }
  };

  // Hàm xử lý khi click vào submenu item
  const handleSubmenuClick = (contentId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveContent(contentId);

    // Đóng sidebar trên mobile khi chọn menu
    if (window.innerWidth <= 992) {
      onClose();
    }
  };

  return (
    <>
      <SidebarOverlay isActive={isActive} onClick={onClose} />
      <SidebarWrapper isActive={isActive}>
        <SidebarHeader>
          <i className="fa fa-bars"></i> MENU CHÍNH
        </SidebarHeader>
        <SidebarMenu>
          {menuItems.map((item) => (
            <MenuItem key={item.id}>
              <MenuLink
                href="#"
                isActive={activeContent === item.id}
                onClick={(e) => handleMenuClick(item.id, !!item.submenu, e)}
              >
                <i className={`fa ${item.icon}`}></i> {item.title}
              </MenuLink>

              {item.submenu && (
                <Submenu isOpen={openSubmenus.includes(item.id)}>
                  {item.submenu.map((subItem) => (
                    <SubmenuItem key={subItem.id}>
                      <SubmenuLink
                        href="#"
                        isActive={activeContent === subItem.id}
                        onClick={(e) => handleSubmenuClick(subItem.id, e)}
                      >
                        {subItem.title}
                      </SubmenuLink>
                    </SubmenuItem>
                  ))}
                </Submenu>
              )}
            </MenuItem>
          ))}
        </SidebarMenu>
      </SidebarWrapper>
    </>
  );
};

export default Sidebar;
