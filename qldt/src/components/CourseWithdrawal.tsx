import React, { useEffect } from 'react';
import styled from 'styled-components';
import useCourseWithdrawal from '../hooks/useCourseWithdrawal';

// Styled components
const CourseWithdrawalWrapper = styled.div`
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
  border-top: 4px solid #f44336;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Modal = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
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

const ResultModalContent = styled(ModalContent)`
  max-width: 500px;
`;

const CourseWithdrawal: React.FC = () => {
  const {
    // Dữ liệu
    withdrawalPeriod,
    registeredCourses,
    withdrawalHistory,
    withdrawalReasons,
    selectedCourse,
    withdrawalReason,
    otherReason,
    withdrawalResult,
    
    // State modal
    isModalOpen,
    isResultModalOpen,
    
    // Loading và error
    loading,
    
    // Các hàm xử lý
    openWithdrawModal,
    closeWithdrawModal,
    closeResultModal,
    handleReasonChange,
    handleOtherReasonChange,
    withdrawCourse
  } = useCourseWithdrawal();
  
  // Load CSS
  useEffect(() => {
    // Thêm link CSS vào head
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/rut-hoc-phan.css';
    document.head.appendChild(link);
    
    // Cleanup khi component unmount
    return () => {
      // Tìm và xóa link CSS
      const links = document.head.getElementsByTagName('link');
      for (let i = 0; i < links.length; i++) {
        if (links[i].href.includes('rut-hoc-phan.css')) {
          document.head.removeChild(links[i]);
          break;
        }
      }
    };
  }, []);
  
  // Xử lý khi click bên ngoài modal
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeWithdrawModal();
    }
  };
  
  // Xử lý khi click bên ngoài modal kết quả
  const handleResultModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeResultModal();
    }
  };
  
  // Hiển thị trạng thái học phần
  const getStatusName = (status: string): string => {
    switch (status) {
      case 'active':
        return 'Đang học';
      case 'pending':
        return 'Chờ xử lý';
      case 'withdrawn':
        return 'Đã rút';
      default:
        return status;
    }
  };
  
  // Hiển thị trạng thái lịch sử rút học phần
  const getHistoryStatusName = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'Đã duyệt';
      case 'pending':
        return 'Chờ duyệt';
      case 'rejected':
        return 'Từ chối';
      default:
        return status;
    }
  };
  
  return (
    <CourseWithdrawalWrapper>
      {/* Hiển thị loading overlay khi đang tải dữ liệu */}
      {(loading.period || loading.courses || loading.history || loading.withdraw) && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}
      
      {/* Tiêu đề trang */}
      <h1 className="page-title">
        <i className="fa fa-minus-circle" style={{ color: '#f44336' }}></i> Rút học phần
      </h1>
      
      {/* Thông tin chung */}
      <div className="withdraw-info">
        <div className="info-item">
          <div className="info-label">Học kỳ hiện tại:</div>
          <div className="info-value">{withdrawalPeriod?.currentSemester || 'Đang tải...'}</div>
        </div>
        <div className="info-item">
          <div className="info-label">Thời gian rút học phần:</div>
          <div className="info-value">{withdrawalPeriod?.withdrawalPeriod || 'Đang tải...'}</div>
        </div>
        <div className="info-item">
          <div className="info-label">Trạng thái:</div>
          <div className={`info-value ${withdrawalPeriod?.status === 'active' ? 'status-active' : ''}`}>
            {withdrawalPeriod?.status === 'active' ? 'Đang mở' : 'Đã đóng'}
          </div>
        </div>
        <div className="info-item">
          <div className="info-label">Số học phần đã đăng ký:</div>
          <div className="info-value">{withdrawalPeriod?.registeredCourses || 0}</div>
        </div>
        <div className="info-item">
          <div className="info-label">Số tín chỉ đã đăng ký:</div>
          <div className="info-value">{withdrawalPeriod?.totalCredits || 0}</div>
        </div>
      </div>
      
      {/* Thông báo quan trọng */}
      <div className="important-notice">
        <div className="notice-icon"><i className="fa fa-exclamation-triangle"></i></div>
        <div className="notice-content">
          <h3>Lưu ý quan trọng</h3>
          <ul>
            <li>Sinh viên chỉ được phép rút học phần trong thời gian quy định.</li>
            <li>Học phần đã rút sẽ không được hoàn học phí.</li>
            <li>
              Sau khi rút học phần, sinh viên phải đảm bảo số tín chỉ tối thiểu trong
              học kỳ là 14 tín chỉ (trừ học kỳ cuối).
            </li>
            <li>
              Học phần đã rút sẽ không được tính vào kết quả học tập và không hiển thị
              trong bảng điểm.
            </li>
            <li>
              Sinh viên có thể đăng ký lại học phần đã rút trong các học kỳ sau.
            </li>
          </ul>
        </div>
      </div>
      
      {/* Danh sách học phần đã đăng ký */}
      <div className="registered-courses">
        <h2 className="section-title">Danh sách học phần đã đăng ký</h2>
        
        <table className="course-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã học phần</th>
              <th>Tên học phần</th>
              <th>Nhóm</th>
              <th>Số tín chỉ</th>
              <th>Lịch học</th>
              <th>Phòng học</th>
              <th>Giảng viên</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {registeredCourses.length > 0 ? (
              registeredCourses.map((course, index) => (
                <tr key={course.id} className="course-row">
                  <td>{index + 1}</td>
                  <td>{course.courseCode}</td>
                  <td>{course.courseName}</td>
                  <td>{course.group}</td>
                  <td>{course.credits}</td>
                  <td>{course.schedule}</td>
                  <td>{course.room}</td>
                  <td>{course.lecturer}</td>
                  <td>
                    <span className={`status-badge ${course.status}`}>
                      {getStatusName(course.status)}
                    </span>
                  </td>
                  <td>
                    <button
                      className="withdraw-btn"
                      onClick={() => openWithdrawModal(course)}
                      disabled={withdrawalPeriod?.status !== 'active'}
                    >
                      <i className="fa fa-minus-circle"></i> Rút
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '2rem' }}>
                  {loading.courses ? 'Đang tải dữ liệu...' : 'Không có học phần nào'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Lịch sử rút học phần */}
      <div className="withdraw-history">
        <h2 className="section-title">Lịch sử rút học phần</h2>
        
        <table className="history-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã học phần</th>
              <th>Tên học phần</th>
              <th>Nhóm</th>
              <th>Số tín chỉ</th>
              <th>Học kỳ</th>
              <th>Ngày rút</th>
              <th>Lý do</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {withdrawalHistory.length > 0 ? (
              withdrawalHistory.map((history, index) => (
                <tr key={history.id} className="history-row">
                  <td>{index + 1}</td>
                  <td>{history.courseCode}</td>
                  <td>{history.courseName}</td>
                  <td>{history.group}</td>
                  <td>{history.credits}</td>
                  <td>{history.semester}</td>
                  <td>{history.withdrawalDate}</td>
                  <td>{history.reason}</td>
                  <td>
                    <span className={`status-badge ${history.status}`}>
                      {getHistoryStatusName(history.status)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '2rem' }}>
                  {loading.history ? 'Đang tải dữ liệu...' : 'Không có lịch sử rút học phần'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Modal xác nhận rút học phần */}
      <Modal isOpen={isModalOpen} onClick={handleModalClick}>
        <ModalContent>
          <div className="modal-header">
            <h3>Xác nhận rút học phần</h3>
            <span className="close-modal" onClick={closeWithdrawModal}>&times;</span>
          </div>
          <div className="modal-body">
            {selectedCourse && (
              <>
                <p>
                  Bạn có chắc chắn muốn rút học phần
                  <strong> {selectedCourse.courseName}</strong> (<span>{selectedCourse.courseCode}</span>) - Nhóm <span>{selectedCourse.group}</span>?
                </p>
                
                <div className="warning-box">
                  <div className="warning-icon">
                    <i className="fa fa-exclamation-triangle"></i>
                  </div>
                  <div className="warning-text">
                    <p><strong>Lưu ý:</strong></p>
                    <ul>
                      <li>Học phần đã rút sẽ không được hoàn học phí.</li>
                      <li>Học phần đã rút sẽ không được tính vào kết quả học tập.</li>
                      <li>Bạn có thể đăng ký lại học phần này trong các học kỳ sau.</li>
                    </ul>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="withdraw-reason">Lý do rút học phần:</label>
                  <select 
                    id="withdraw-reason" 
                    value={withdrawalReason}
                    onChange={(e) => handleReasonChange(e.target.value)}
                    required
                  >
                    <option value="">-- Chọn lý do --</option>
                    {withdrawalReasons.map(reason => (
                      <option key={reason.id} value={reason.value}>
                        {reason.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {withdrawalReason === 'other' && (
                  <div className="form-group" id="other-reason-group">
                    <label htmlFor="other-reason">Lý do khác:</label>
                    <textarea
                      id="other-reason"
                      rows={3}
                      placeholder="Nhập lý do rút học phần..."
                      value={otherReason}
                      onChange={(e) => handleOtherReasonChange(e.target.value)}
                    ></textarea>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="modal-footer">
            <button className="cancel-btn" onClick={closeWithdrawModal}>Hủy</button>
            <button 
              className="confirm-btn" 
              onClick={withdrawCourse}
              disabled={loading.withdraw}
            >
              {loading.withdraw ? 'Đang xử lý...' : 'Xác nhận rút'}
            </button>
          </div>
        </ModalContent>
      </Modal>
      
      {/* Modal thông báo kết quả */}
      <Modal isOpen={isResultModalOpen} onClick={handleResultModalClick}>
        <ResultModalContent>
          <div className="modal-header">
            <h3>Kết quả rút học phần</h3>
            <span className="close-modal" onClick={closeResultModal}>&times;</span>
          </div>
          <div className="modal-body">
            {withdrawalResult && withdrawalResult.success ? (
              <>
                <div className="result-icon success">
                  <i className="fa fa-check-circle"></i>
                </div>
                <div className="result-message">
                  {selectedCourse && (
                    <p>
                      Bạn đã rút học phần
                      <strong> {selectedCourse.courseName}</strong> (<span>{selectedCourse.courseCode}</span>) - Nhóm <span>{selectedCourse.group}</span> thành công!
                    </p>
                  )}
                  <p>{withdrawalResult.message}</p>
                </div>
              </>
            ) : (
              <>
                <div className="result-icon error">
                  <i className="fa fa-times-circle"></i>
                </div>
                <div className="result-message">
                  <p>Có lỗi xảy ra khi rút học phần. Vui lòng thử lại sau!</p>
                </div>
              </>
            )}
          </div>
          <div className="modal-footer">
            <button className="close-btn" onClick={closeResultModal}>Đóng</button>
          </div>
        </ResultModalContent>
      </Modal>
    </CourseWithdrawalWrapper>
  );
};

export default CourseWithdrawal;