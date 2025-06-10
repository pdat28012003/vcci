import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import useCurriculum from '../hooks/useCurriculum';

// Styled components
const CurriculumWrapper = styled.div`
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

const Curriculum: React.FC = () => {
  // Sử dụng custom hook để lấy dữ liệu và các hàm xử lý
  const {
    curriculumInfo,
    creditSummary,
    academicYears,
    filter,
    loading,
    filterLoading,
    error,
    applyFilter,
    searchCourses,
    printCurriculum,
    exportCurriculum,
    refreshData
  } = useCurriculum();
  
  // Refs cho các input
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Load CSS
  useEffect(() => {
    // Thêm link CSS vào head
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/khung-chuong-trinh.css';
    document.head.appendChild(link);
    
    // Cleanup khi component unmount
    return () => {
      // Tìm và xóa link CSS
      const links = document.head.getElementsByTagName('link');
      for (let i = 0; i < links.length; i++) {
        if (links[i].href.includes('khung-chuong-trinh.css')) {
          document.head.removeChild(links[i]);
          break;
        }
      }
    };
  }, []);
  
  // Xử lý khi thay đổi bộ lọc
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    
    switch (id) {
      case 'year-filter':
        applyFilter({ year: value });
        break;
      case 'semester-filter':
        applyFilter({ semester: value });
        break;
      case 'course-type-filter':
        applyFilter({ courseType: value });
        break;
    }
  };
  
  // Xử lý khi nhấn nút tìm kiếm
  const handleSearch = () => {
    if (searchInputRef.current) {
      searchCourses(searchInputRef.current.value);
    }
  };
  
  // Xử lý khi nhấn Enter trong ô tìm kiếm
  const handleSearchKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  // Xử lý khi nhấn nút in
  const handlePrint = () => {
    printCurriculum();
  };
  
  // Xử lý khi nhấn nút xuất file
  const handleExport = () => {
    exportCurriculum('pdf');
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
  
  return (
    <CurriculumWrapper>
      {/* Hiển thị loading overlay khi đang tải dữ liệu */}
      {loading && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}
      
      {/* Tiêu đề trang */}
      <h1 className="page-title">
        <i className="fa fa-graduation-cap"></i> Khung chương trình đào tạo
      </h1>
      
      {/* Thông tin chung */}
      {curriculumInfo && (
        <div className="program-info">
          <div className="info-item">
            <div className="info-label">Ngành học:</div>
            <div className="info-value">{curriculumInfo.major}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Chuyên ngành:</div>
            <div className="info-value">{curriculumInfo.specialization}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Khóa học:</div>
            <div className="info-value">{curriculumInfo.batch}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Tổng số tín chỉ:</div>
            <div className="info-value">{curriculumInfo.totalCredits}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Thời gian đào tạo:</div>
            <div className="info-value">{curriculumInfo.duration}</div>
          </div>
        </div>
      )}
      
      {/* Bộ lọc và điều khiển */}
      <div className="program-controls">
        <div className="control-group">
          <label htmlFor="year-filter">Năm học:</label>
          <select 
            id="year-filter" 
            value={filter.year} 
            onChange={handleFilterChange}
          >
            <option value="all">Tất cả</option>
            <option value="1">Năm thứ nhất</option>
            <option value="2">Năm thứ hai</option>
            <option value="3">Năm thứ ba</option>
            <option value="4">Năm thứ tư</option>
          </select>
        </div>
        
        <div className="control-group">
          <label htmlFor="semester-filter">Học kỳ:</label>
          <select 
            id="semester-filter" 
            value={filter.semester} 
            onChange={handleFilterChange}
          >
            <option value="all">Tất cả</option>
            <option value="1">Học kỳ 1</option>
            <option value="2">Học kỳ 2</option>
          </select>
        </div>
        
        <div className="control-group">
          <label htmlFor="course-type-filter">Loại học phần:</label>
          <select 
            id="course-type-filter" 
            value={filter.courseType} 
            onChange={handleFilterChange}
          >
            <option value="all">Tất cả</option>
            <option value="required">Bắt buộc</option>
            <option value="elective">Tự chọn</option>
            <option value="general">Đại cương</option>
            <option value="specialized">Chuyên ngành</option>
          </select>
        </div>
        
        <div className="search-group">
          <input
            type="text"
            id="course-search"
            placeholder="Tìm kiếm học phần..."
            ref={searchInputRef}
            onKeyUp={handleSearchKeyUp}
          />
          <button className="search-btn" onClick={handleSearch}>
            <i className="fa fa-search"></i>
          </button>
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
      
      {/* Thống kê tín chỉ */}
      {creditSummary && (
        <div className="credit-summary">
          <div className="summary-item">
            <div className="summary-value">{creditSummary.total}</div>
            <div className="summary-label">Tổng số tín chỉ</div>
          </div>
          <div className="summary-item">
            <div className="summary-value">{creditSummary.required}</div>
            <div className="summary-label">Bắt buộc</div>
          </div>
          <div className="summary-item">
            <div className="summary-value">{creditSummary.elective}</div>
            <div className="summary-label">Tự chọn</div>
          </div>
          <div className="summary-item">
            <div className="summary-value">{creditSummary.general}</div>
            <div className="summary-label">Đại cương</div>
          </div>
          <div className="summary-item">
            <div className="summary-value">{creditSummary.specialized}</div>
            <div className="summary-label">Chuyên ngành</div>
          </div>
        </div>
      )}
      
      {/* Khung chương trình theo năm học */}
      <div className="program-framework">
        {filterLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Đang tải dữ liệu...
          </div>
        ) : academicYears.length > 0 ? (
          academicYears.map((year) => (
            <div key={year.id} className="academic-year" data-year={year.yearNumber}>
              <div className="year-header">
                <h2 className="year-title">{year.name}</h2>
                <div className="year-summary">
                  <div className="summary-item">
                    <div className="summary-label">Tổng số tín chỉ:</div>
                    <div className="summary-value">{year.totalCredits}</div>
                  </div>
                </div>
              </div>
              
              {year.semesters.map((semester) => (
                <div key={semester.id} className="semester" data-semester={semester.semesterNumber}>
                  <h3 className="semester-title">{semester.name}</h3>
                  
                  {semester.courses.length > 0 ? (
                    <table className="course-table">
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Mã học phần</th>
                          <th>Tên học phần</th>
                          <th>Số tín chỉ</th>
                          <th>Loại học phần</th>
                          <th>Học phần tiên quyết</th>
                          <th>Học phần học trước</th>
                          <th>Học phần song hành</th>
                        </tr>
                      </thead>
                      <tbody>
                        {semester.courses.map((course, index) => (
                          <tr 
                            key={course.id} 
                            className={`course-row ${course.category} ${course.type}`}
                          >
                            <td>{index + 1}</td>
                            <td>{course.code}</td>
                            <td>{course.name}</td>
                            <td>{course.credits}</td>
                            <td>{course.type === 'required' ? 'Bắt buộc' : 'Tự chọn'}</td>
                            <td>{renderDash(course.prerequisites)}</td>
                            <td>{renderDash(course.previousCourses)}</td>
                            <td>{renderDash(course.corequisites)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                      Không có học phần nào phù hợp với bộ lọc
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Không có dữ liệu khung chương trình
          </div>
        )}
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
    </CurriculumWrapper>
  );
};

export default Curriculum;