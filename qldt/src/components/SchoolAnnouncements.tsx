import React, { useState } from 'react';
import styled from 'styled-components';
import { useNotifications } from '../hooks/useNotifications';

const AnnouncementsWrapper = styled.div`
  padding: 20px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.text};
  
  i {
    margin-right: 10px;
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  background-color: white;
  padding: 15px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const SearchBox = styled.div`
  flex: 1;
  min-width: 250px;
  display: flex;
  
  input {
    flex: 1;
    padding: 10px 15px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md} 0 0 ${({ theme }) => theme.borderRadius.md};
    outline: none;
    
    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
  
  button {
    padding: 10px 15px;
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    border: none;
    border-radius: 0 ${({ theme }) => theme.borderRadius.md} ${({ theme }) => theme.borderRadius.md} 0;
    cursor: pointer;
    transition: background-color ${({ theme }) => theme.transitions.fast};
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.secondary};
    }
  }
`;

const FilterOptions = styled.div`
  display: flex;
  gap: 10px;
  
  select {
    padding: 10px 15px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background-color: white;
    outline: none;
    cursor: pointer;
    
    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const NotificationCard = styled.div<{ unread?: boolean }>`
  background-color: ${({ unread, theme }) => unread ? 'rgba(74, 144, 226, 0.05)' : 'white'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border-left: 4px solid ${({ unread, theme }) => unread ? theme.colors.primary : theme.colors.border};
  transition: transform ${({ theme }) => theme.transitions.fast}, box-shadow ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const NotificationTitle = styled.h3`
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const NotificationBadge = styled.span<{ type: string }>`
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 12px;
  background-color: ${({ type }) => {
    switch (type) {
      case 'important': return '#ff6b6b';
      case 'new': return '#4a90e2';
      case 'academic': return '#28a745';
      case 'event': return '#ffc107';
      default: return '#aaa';
    }
  }};
  color: white;
  font-weight: 400;
`;

const NotificationDate = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const NotificationMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
  
  span {
    display: flex;
    align-items: center;
    
    i {
      margin-right: 5px;
    }
  }
`;

const NotificationContent = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
  margin-bottom: 15px;
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button<{ primary?: boolean }>`
  padding: 8px 15px;
  background-color: ${({ primary, theme }) => primary ? theme.colors.primary : 'transparent'};
  color: ${({ primary, theme }) => primary ? 'white' : theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 14px;
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.fast}, color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ primary, theme }) => primary ? theme.colors.secondary : 'rgba(0, 51, 102, 0.1)'};
  }
  
  i {
    margin-right: 5px;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 5px;
`;

const PageButton = styled.button<{ active?: boolean }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ active, theme }) => active ? theme.colors.primary : 'white'};
  color: ${({ active }) => active ? 'white' : 'inherit'};
  border: 1px solid ${({ active, theme }) => active ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.fast}, color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ active, theme }) => active ? theme.colors.secondary : theme.colors.background};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SchoolAnnouncements: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Sử dụng custom hook để lấy dữ liệu thông báo
  const { notifications, loading, error } = useNotifications();
  
  // Xử lý tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Thực hiện tìm kiếm với searchTerm
    console.log('Searching for:', searchTerm);
  };
  
  // Lọc và sắp xếp thông báo
  const filteredNotifications = notifications
    .filter(notification => {
      if (filter === 'all') return true;
      return notification.type === filter;
    })
    .sort((a, b) => {
      if (sort === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });
  
  // Phân trang
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  return (
    <AnnouncementsWrapper>
      <PageTitle>
        <i className="fa fa-bullhorn"></i> Thông báo từ nhà trường
      </PageTitle>
      
      <FilterSection>
        <SearchBox>
          <input
            type="text"
            placeholder="Tìm kiếm thông báo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>
            <i className="fa fa-search"></i>
          </button>
        </SearchBox>
        
        <FilterOptions>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Tất cả thông báo</option>
            <option value="important">Thông báo quan trọng</option>
            <option value="academic">Thông báo học vụ</option>
            <option value="event">Thông báo sự kiện</option>
          </select>
          
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
          </select>
        </FilterOptions>
      </FilterSection>
      
      {loading ? (
        <p>Đang tải thông báo...</p>
      ) : error ? (
        <p>Có lỗi xảy ra khi tải thông báo. Vui lòng thử lại sau.</p>
      ) : (
        <>
          <NotificationList>
            {paginatedNotifications.map((notification) => (
              <NotificationCard key={notification.id} unread={notification.unread}>
                <NotificationHeader>
                  <NotificationTitle>
                    {notification.title}
                    {notification.important && (
                      <NotificationBadge type="important">Quan trọng</NotificationBadge>
                    )}
                    {notification.unread && (
                      <NotificationBadge type="new">Mới</NotificationBadge>
                    )}
                    <NotificationBadge type={notification.type}>
                      {notification.type === 'academic' && 'Học vụ'}
                      {notification.type === 'event' && 'Sự kiện'}
                      {notification.type === 'important' && 'Quan trọng'}
                    </NotificationBadge>
                  </NotificationTitle>
                  <NotificationDate>{notification.date}</NotificationDate>
                </NotificationHeader>
                
                <NotificationMeta>
                  <span>
                    <i className="fa fa-building-o"></i> {notification.department}
                  </span>
                  <span>
                    <i className="fa fa-user"></i> {notification.author}
                  </span>
                </NotificationMeta>
                
                <NotificationContent>
                  {notification.content}
                </NotificationContent>
                
                <NotificationActions>
                  <ActionButton primary>
                    <i className="fa fa-eye"></i> Xem chi tiết
                  </ActionButton>
                  <ActionButton>
                    <i className="fa fa-download"></i> Tải xuống
                  </ActionButton>
                </NotificationActions>
              </NotificationCard>
            ))}
          </NotificationList>
          
          {totalPages > 1 && (
            <Pagination>
              <PageButton
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                <i className="fa fa-chevron-left"></i>
              </PageButton>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PageButton
                  key={page}
                  active={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PageButton>
              ))}
              
              <PageButton
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                <i className="fa fa-chevron-right"></i>
              </PageButton>
            </Pagination>
          )}
        </>
      )}
    </AnnouncementsWrapper>
  );
};

export default SchoolAnnouncements;