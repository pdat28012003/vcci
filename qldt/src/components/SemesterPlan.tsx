import React, { useEffect } from 'react';
import styled from 'styled-components';
import useSemesterPlan from '../hooks/useSemesterPlan';

// Styled components
const SemesterPlanWrapper = styled.div`
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
  border-top: 4px solid #2196f3;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SemesterPlan: React.FC = () => {
  // Sử dụng custom hook để lấy dữ liệu và các hàm xử lý
  const {
    semesterPlanInfo,
    creditSummary,
    requiredCourses,
    electiveCourses,
    roadmap,
    notes,
    semesters,
    selectedSemesterId,
    loading,
    semesterLoading,
    error,
    changeSemester,
    printSemesterPlan,
    exportSemesterPlan,
    refreshData
  } = useSemesterPlan();
  
  // Load CSS
  useEffect(() => {
    // Thêm link CSS vào head
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/khung-theo-ky.css';
    document.head.appendChild(link);
    
    // Cleanup khi component unmount
    return () => {
      // Tìm và xóa link CSS
      const links = document.head.getElementsByTagName('link');
      for (let i = 0; i < links.length; i++) {
        if (links[i].href.includes('khung-theo-ky.css')) {
          document.head.removeChild(links[i]);
          break;
        }
      }
    };
  }, []);
  
  // Xử lý khi thay đổi học kỳ
  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeSemester(e.target.value);
  };
  
  // Xử lý khi nhấn nút in
  const handlePrint = () => {
    printSemesterPlan();
  };
  
  // Xử lý khi nhấn nút xuất file
  const handleExport = () => {
    exportSemesterPlan('pdf');
  };
  
  // Hiển thị dấu gạch ngang cho các ô trống
  const renderDash = (value: string | string[] | undefined | null) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return '-';
    }
    
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    return value;
  };
  
  // Lấy tên hiển thị cho trạng thái học phần
  const getStatusName = (status: string): string => {
    switch (status) {
      case 'in-progress':
        return 'Đang học';
      case 'completed':
        return 'Đã hoàn thành';
      case 'not-started':
        return 'Chưa đăng ký';
      case 'not-registered':
        return 'Chưa đăng ký';
      case 'not-available':
        return 'Không mở lớp';
      default:
        return status;
    }
  };
  
  // Lấy tên học kỳ hiện tại
  const getCurrentSemesterName = () => {
    const currentSemester = semesters.find(sem => sem.id === selectedSemesterId);
    return currentSemester ? currentSemester.name : '';
  };
  
  return (
    <SemesterPlanWrapper>
      {/* Hiển thị loading overlay khi đang tải dữ liệu */}
      {loading && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}
      
      {/* Tiêu đề trang */}
      <h1 className="page-title">
        <i className="fa fa-th-large"></i> Khung chương trình theo kỳ
      </h1>
      
      {/* Thông tin chung */}
      {semesterPlanInfo && (
        <div className="program-info">
          <div className="info-item">
            <div className="info-label">Ngành học:</div>
            <div className="info-value">{semesterPlanInfo.major}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Chuyên ngành:</div>
            <div className="info-value">{semesterPlanInfo.specialization}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Khóa học:</div>
            <div className="info-value">{semesterPlanInfo.batch}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Học kỳ hiện tại:</div>
            <div className="info-value">{semesterPlanInfo.currentSemester}</div>
          </div>
        </div>
      )}
      
      {/* Bộ lọc và điều khiển */}
      <div className="semester-controls">
        <div className="control-group">
          <label htmlFor="semester-select">Học kỳ:</label>
          <select 
            id="semester-select" 
            value={selectedSemesterId} 
            onChange={handleSemesterChange}
          >
            {semesters.map(semester => (
              <option key={semester.id} value={semester.id}>
                {semester.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="action-controls">
          <button className="action-btn" onClick={handlePrint}>
            <i className="fa fa-print"></i> In
          </button>
          <button className="action-btn" onClick={handleExport}>
            <i className="fa fa-download"></i> Xuất file
          </button>
        </div>
      </div>
      
      {/* Thống kê học kỳ */}
      {creditSummary && (
        <div className="semester-stats">
          <div className="stat-item">
            <div className="stat-value">{creditSummary.total}</div>
            <div className="stat-label">Tổng số tín chỉ</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{creditSummary.required}</div>
            <div className="stat-label">Bắt buộc</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{creditSummary.elective}</div>
            <div className="stat-label">Tự chọn</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{creditSummary.general}</div>
            <div className="stat-label">Đại cương</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{creditSummary.specialized}</div>
            <div className="stat-label">Chuyên ngành</div>
          </div>
        </div>
      )}
      
      {/* Kế hoạch học tập học kỳ */}
      <div className="semester-plan">
        <h2>Kế hoạch học tập {getCurrentSemesterName()}</h2>
        
        {semesterLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Đang tải dữ liệu học kỳ...
          </div>
        ) : (
          <>
            {/* Học phần bắt buộc */}
            <div className="course-section">
              <h3 className="subsection-title">Học phần bắt buộc</h3>
              {requiredCourses.length > 0 ? (
                <table className="course-table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Mã học phần</th>
                      <th>Tên học phần</th>
                      <th>Số tín chỉ</th>
                      <th>Học phần tiên quyết</th>
                      <th>Học phần học trước</th>
                      <th>Học phần song hành</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requiredCourses.map((course, index) => (
                      <tr 
                        key={course.id} 
                        className={`course-row required`}
                      >
                        <td>{index + 1}</td>
                        <td>{course.code}</td>
                        <td>{course.name}</td>
                        <td>{course.credits}</td>
                        <td>{renderDash(course.prerequisites)}</td>
                        <td>{renderDash(course.previousCourses)}</td>
                        <td>{renderDash(course.corequisites)}</td>
                        <td>
                          <span className={`status-badge ${course.status}`}>
                            {getStatusName(course.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  Không có học phần bắt buộc nào trong học kỳ này
                </div>
              )}
            </div>
            
            {/* Học phần tự chọn */}
            <div className="course-section">
              <h3 className="subsection-title">Học phần tự chọn (chọn ít nhất 9 tín chỉ)</h3>
              {electiveCourses.length > 0 ? (
                <table className="course-table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Mã học phần</th>
                      <th>Tên học phần</th>
                      <th>Số tín chỉ</th>
                      <th>Học phần tiên quyết</th>
                      <th>Học phần học trước</th>
                      <th>Học phần song hành</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {electiveCourses.map((course, index) => (
                      <tr 
                        key={course.id} 
                        className={`course-row elective`}
                      >
                        <td>{index + 1}</td>
                        <td>{course.code}</td>
                        <td>{course.name}</td>
                        <td>{course.credits}</td>
                        <td>{renderDash(course.prerequisites)}</td>
                        <td>{renderDash(course.previousCourses)}</td>
                        <td>{renderDash(course.corequisites)}</td>
                        <td>
                          <span className={`status-badge ${course.status}`}>
                            {getStatusName(course.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  Không có học phần tự chọn nào trong học kỳ này
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      {/* Lộ trình học tập */}
      <div className="learning-roadmap">
        <h2>Lộ trình học tập</h2>
        
        <div className="roadmap-container">
          <div className="roadmap-timeline">
            {roadmap.map(semester => (
              <div 
                key={semester.id} 
                className={`timeline-item ${semester.status}`}
              >
                <div className="timeline-semester">
                  <div className="semester-name">{semester.name}</div>
                  <div className="semester-year">{semester.year}</div>
                </div>
                <div className="timeline-content">
                  <div className="timeline-status">
                    {semester.status === 'completed' ? 'Đã hoàn thành' : 
                     semester.status === 'current' ? 'Đang học' : 'Sắp tới'}
                  </div>
                  <div className="timeline-credits">
                    {semester.completedCredits}/{semester.totalCredits} tín chỉ
                  </div>
                  <div className="timeline-courses">
                    {semester.courses.map(course => (
                      <span key={course} className="course-code">{course}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Ghi chú */}
      <div className="semester-notes">
        {notes.map((note, index) => (
          <div key={index}>
            <h3 className="note-title">
              <i className={`fa fa-${note.icon}`}></i> {note.title}
            </h3>
            <div className="note-content">
              {note.isOrderedList ? (
                <ol className="note-list">
                  {note.content.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ol>
              ) : (
                <ul className="note-list">
                  {note.content.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Hiển thị thông báo lỗi nếu có */}
      {error && (
        <div style={{ 
          textAlign: 'center', 
          padding: '1rem', 
          color: 'red', 
          backgroundColor: '#ffebee',
          borderRadius: '4px',
          marginTop: '1rem'
        }}>
          {error}
        </div>
      )}
    </SemesterPlanWrapper>
  );
};

export default SemesterPlan;