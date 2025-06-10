import React from "react";
import styled from "styled-components";

const HeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  z-index: 1000;
`;

const ToggleSidebarButton = styled.button`
  color: white;
  font-size: 20px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const HeaderTitle = styled.div`
  font-size: 18px;
  font-weight: 500;
  flex-grow: 1;
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    text-align: left;
    margin-left: 20px;
  }
`;

const UserDropdown = styled.div`
  position: relative;
`;

const DropdownButton = styled.button`
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  i {
    margin-right: 8px;
  }
`;

const DropdownContent = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  min-width: 200px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 8px 0;
  z-index: 1000;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  margin-top: 8px;

  a {
    color: ${({ theme }) => theme.colors.text};
    padding: 10px 16px;
    display: flex;
    align-items: center;
    transition: background-color ${({ theme }) => theme.transitions.fast};

    &:hover {
      background-color: ${({ theme }) => theme.colors.background};
    }

    i {
      margin-right: 10px;
      width: 20px;
      text-align: center;
    }
  }
`;

interface HeaderProps {
  toggleSidebar: () => void;
  userName: string;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, userName }) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Đóng dropdown khi click ra ngoài
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDropdownOpen &&
        !(event.target as Element).closest(".user-dropdown")
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <HeaderWrapper>
      <ToggleSidebarButton onClick={toggleSidebar} aria-label="Mở menu">
        <i className="fa fa-bars"></i>
      </ToggleSidebarButton>

      <HeaderTitle>CỔNG THÔNG TIN SINH VIÊN - TRƯỜNG ĐẠI HỌC</HeaderTitle>

      <UserDropdown className="user-dropdown">
        <DropdownButton onClick={toggleDropdown}>
          <i className="fa fa-user-circle"></i> {userName}
        </DropdownButton>

        <DropdownContent isOpen={isDropdownOpen}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              closeDropdown();
            }}
          >
            <i className="fa fa-user"></i> Thông tin cá nhân
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              closeDropdown();
            }}
          >
            <i className="fa fa-cog"></i> Cài đặt
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              closeDropdown();
            }}
          >
            <i className="fa fa-sign-out"></i> Đăng xuất
          </a>
        </DropdownContent>
      </UserDropdown>
    </HeaderWrapper>
  );
};

export default Header;
