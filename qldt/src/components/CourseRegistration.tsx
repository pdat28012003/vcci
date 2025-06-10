import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import useCourseRegistration from "../hooks/useCourseRegistration";
import { AvailableCourse } from "../services/courseRegistrationService";

// Styled components
const CourseRegistrationWrapper = styled.div`
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
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Modal = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
  transition: opacity 0.3s;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 0;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(${({ theme }) => (theme.isModalOpen ? "0" : "-20px")});
  transition: transform 0.3s;
`;

const CourseRegistration: React.FC = () => {
  // Sử dụng custom hook để lấy dữ liệu và các hàm xử lý
  const {
    registrationPeriod,
    availableCourses,
    registeredCourses,
    currentCourse,
    loading,
    filterLoading,
    registrationLoading,
    saveLoading,
    error,
    isModalOpen,
    applyFilter,
    searchCourses,
    openRegistrationModal,
    closeModal,
    registerCourse,
    cancelRegistration,
    cancelAllRegistrations,
    saveRegistration,
    calculateRemainingTime,
  } = useCourseRegistration();

  // Refs cho các input
  const searchInputRef = useRef<HTMLInputElement>(null);
  const departmentRef = useRef<HTMLSelectElement>(null);
  const courseTypeRef = useRef<HTMLSelectElement>(null);
  const statusRef = useRef<HTMLSelectElement>(null);

  // Xử lý khi thay đổi bộ lọc
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    
    switch (id) {
      case "course-department":
        applyFilter({ department: value });
        break;
      case "course-type":
        applyFilter({ type: value });
        break;
      case "course-status":
        applyFilter({ status: value });
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
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Xử lý khi click vào nút đăng ký
  const handleRegisterClick = (course: AvailableCourse) => {
    openRegistrationModal(course);
  };

  // Xử lý khi click bên ngoài modal
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Xử lý khi click vào nút xác nhận đăng ký
  const handleConfirmRegistration = () => {
    registerCourse();
  };

  // Xử lý khi click vào nút hủy đăng ký
  const handleCancelCourse = (courseId: string) => {
    // Tạo modal xác nhận
    const confirmDialog = document.createElement("div");
    confirmDialog.className = "modal confirm-dialog";
    confirmDialog.style.display = "flex";
    
    const course = registeredCourses.find(c => c.id === courseId);
    
    confirmDialog.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Xác nhận hủy đăng ký</h3>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <p>Bạn có chắc chắn muốn hủy đăng ký học phần <strong>${course?.name}</strong>?</p>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn cancel-action">Không</button>
          <button class="confirm-btn confirm-action">Có, hủy đăng ký</button>
        </div>
      </div>
    `;

    // Thêm vào body
    document.body.appendChild(confirmDialog);

    // Hiển thị với hiệu ứng
    setTimeout(() => {
      confirmDialog.classList.add("show");
    }, 10);

    // Xử lý sự kiện nút đóng
    confirmDialog
      .querySelector(".close-modal")?.addEventListener("click", () => {
        confirmDialog.classList.remove("show");
        setTimeout(() => {
          confirmDialog.remove();
        }, 300);
      });

    // Xử lý sự kiện nút hủy
    confirmDialog
      .querySelector(".cancel-action")?.addEventListener("click", () => {
        confirmDialog.classList.remove("show");
        setTimeout(() => {
          confirmDialog.remove();
        }, 300);
      });

    // Xử lý sự kiện nút xác nhận
    confirmDialog
      .querySelector(".confirm-action")?.addEventListener("click", () => {
        cancelRegistration(courseId);
        
        confirmDialog.classList.remove("show");
        setTimeout(() => {
          confirmDialog.remove();
        }, 300);
      });
  };

  // Xử lý khi click vào nút hủy tất cả
  const handleCancelAll = () => {
    if (registeredCourses.length === 0) {
      // Hiển thị thông báo
      const notification = document.createElement("div");
      notification.className = "notification warning";
      notification.innerHTML = `
        <div class="notification-content">
          <i class="fa fa-exclamation-triangle"></i>
          <span>Chưa có học phần nào được đăng ký!</span>
        </div>
        <button class="close-notification">&times;</button>
      `;

      // Thêm vào body
      document.body.appendChild(notification);

      // Hiển thị với hiệu ứng
      setTimeout(() => {
        notification.classList.add("show");
      }, 10);

      // Tự động ẩn sau 5 giây
      setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 5000);

      // Xử lý sự kiện đóng
      notification
        .querySelector(".close-notification")?.addEventListener("click", () => {
          notification.classList.remove("show");
          setTimeout(() => {
            notification.remove();
          }, 300);
        });
        
      return;
    }

    // Tạo modal xác nhận
    const confirmDialog = document.createElement("div");
    confirmDialog.className = "modal confirm-dialog";
    confirmDialog.style.display = "flex";
    confirmDialog.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Xác nhận hủy tất cả</h3>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <p>Bạn có chắc chắn muốn hủy <strong>tất cả</strong> học phần đã đăng ký?</p>
          <p>Thao tác này không thể hoàn tác.</p>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn cancel-action">Không</button>
          <button class="confirm-btn confirm-action">Có, hủy tất cả</button>
        </div>
      </div>
    `;

    // Thêm vào body
    document.body.appendChild(confirmDialog);

    // Hiển thị với hiệu ứng
    setTimeout(() => {
      confirmDialog.classList.add("show");
    }, 10);

    // Xử lý sự kiện nút đóng
    confirmDialog
      .querySelector(".close-modal")?.addEventListener("click", () => {
        confirmDialog.classList.remove("show");
        setTimeout(() => {
          confirmDialog.remove();
        }, 300);
      });

    // Xử lý sự kiện nút hủy
    confirmDialog
      .querySelector(".cancel-action")?.addEventListener("click", () => {
        confirmDialog.classList.remove("show");
        setTimeout(() => {
          confirmDialog.remove();
        }, 300);
      });

    // Xử lý sự kiện nút xác nhận
    confirmDialog
      .querySelector(".confirm-action")?.addEventListener("click", () => {
        cancelAllRegistrations();
        
        confirmDialog.classList.remove("show");
        setTimeout(() => {
          confirmDialog.remove();
        }, 300);
      });
  };

  // Xử lý khi click vào nút lưu đăng ký
  const handleSaveRegistration = () => {
    saveRegistration();
  };

  // Load CSS
  useEffect(() => {
    // Thêm link CSS vào head
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/css/dang-ky-hoc-phan.css";
    document.head.appendChild(link);
    
    // Cleanup khi component unmount
    return () => {
      // Tìm và xóa link CSS
      const links = document.head.getElementsByTagName("link");
      for (let i = 0; i < links.length; i++) {
        if (links[i].href.includes("dang-ky-hoc-phan.css")) {
          document.head.removeChild(links[i]);
          break;
        }
      }
    };
  }, []);

  return (
    <CourseRegistrationWrapper>
      {/* Hiển thị loading overlay khi đang tải dữ liệu */}
      {loading && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}
      
      {/* Tiêu đề trang */}
      <h1 className="page-title"><i className="fa fa-edit"></i> Đăng ký học phần</h1>
      
      {/* Thông tin đợt đăng ký */}
      <div className="registration-info">
        <div className="info-header">
          <h2 className="section-title">
            Thông tin đợt đăng ký học kỳ {registrationPeriod?.semester}, năm học {registrationPeriod?.academicYear}
          </h2>
          <div className="registration-status">
            <span className={`status-${registrationPeriod?.status}`}>
              {registrationPeriod?.status === "active" ? "Đang mở" : 
               registrationPeriod?.status === "closed" ? "Đã đóng" : "Sắp mở"}
            </span>
          </div>
        </div>

        <div className="info-details">
          <div className="info-item">
            <div className="info-label">Thời gian bắt đầu:</div>
            <div className="info-value">
              {registrationPeriod ? new Date(registrationPeriod.startDate).toLocaleString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }) : '--:--'}
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">Thời gian kết thúc:</div>
            <div className="info-value">
              {registrationPeriod ? new Date(registrationPeriod.endDate).toLocaleString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }) : '--:--'}
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">Thời gian còn lại:</div>
            <div className="info-value countdown">{calculateRemainingTime()}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Số tín chỉ tối đa:</div>
            <div className="info-value">{registrationPeriod?.maxCredits || 0} tín chỉ</div>
          </div>
          <div className="info-item">
            <div className="info-label">Số tín chỉ đã đăng ký:</div>
            <div className="info-value">{registrationPeriod?.registeredCredits || 0} tín chỉ</div>
          </div>
          <div className="info-item">
            <div className="info-label">Số tín chỉ còn lại:</div>
            <div className="info-value">{registrationPeriod?.remainingCredits || 0} tín chỉ</div>
          </div>
        </div>

        <div className="note-box">
          <p>
            <strong>Lưu ý:</strong> Sinh viên cần thanh toán học phí đúng hạn sau khi
            đăng ký học phần. Học phần sẽ bị hủy nếu không thanh toán trước ngày
            {registrationPeriod ? new Date(registrationPeriod.paymentDeadline).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }) : '--/--/----'}.
          </p>
        </div>
      </div>

      {/* Bộ lọc tìm kiếm học phần */}
      <div className="course-search">
        <h2 className="section-title">Tìm kiếm học phần</h2>

        <div className="search-filters">
          <div className="form-row">
            <div className="form-column">
              <label htmlFor="course-department">Khoa/Bộ môn:</label>
              <select 
                id="course-department" 
                ref={departmentRef}
                onChange={handleFilterChange}
              >
                <option value="">-- Tất cả --</option>
                <option value="cntt">Công nghệ thông tin</option>
                <option value="dtvt">Điện tử viễn thông</option>
                <option value="ktdl">Kỹ thuật điện</option>
                <option value="cokhi">Cơ khí</option>
                <option value="xaydung">Xây dựng</option>
                <option value="kinhte">Kinh tế</option>
                <option value="ngoaingu">Ngoại ngữ</option>
              </select>
            </div>
            <div className="form-column">
              <label htmlFor="course-type">Loại học phần:</label>
              <select 
                id="course-type" 
                ref={courseTypeRef}
                onChange={handleFilterChange}
              >
                <option value="">-- Tất cả --</option>
                <option value="required">Bắt buộc</option>
                <option value="elective">Tự chọn</option>
                <option value="general">Đại cương</option>
                <option value="specialized">Chuyên ngành</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-column">
              <label htmlFor="course-search">Tìm kiếm:</label>
              <div className="search-input">
                <input
                  type="text"
                  id="course-search"
                  placeholder="Nhập mã học phần hoặc tên học phần..."
                  ref={searchInputRef}
                  onKeyUp={handleSearchKeyUp}
                />
                <button onClick={handleSearch} title="Tìm kiếm">
                  <i className="fa fa-search"></i>
                </button>
              </div>
            </div>
            <div className="form-column">
              <label htmlFor="course-status">Trạng thái lớp:</label>
              <select 
                id="course-status" 
                ref={statusRef}
                onChange={handleFilterChange}
              >
                <option value="">-- Tất cả --</option>
                <option value="open">Còn chỗ</option>
                <option value="full">Đã đầy</option>
                <option value="almost-full">Sắp đầy</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách học phần */}
      <div className="course-list">
        <h2 className="section-title">Danh sách học phần có thể đăng ký</h2>

        <div className="course-table-container">
          <table className="course-table">
            <thead>
              <tr>
                <th width="5%">STT</th>
                <th width="10%">Mã học phần</th>
                <th width="25%">Tên học phần</th>
                <th width="8%">Số TC</th>
                <th width="10%">Lớp</th>
                <th width="15%">Lịch học</th>
                <th width="10%">Phòng học</th>
                <th width="10%">Sĩ số</th>
                <th width="7%">Thao tác</th>
              </tr>
            </thead>
            <tbody className={filterLoading ? "loading" : ""}>
              {availableCourses.length > 0 ? (
                availableCourses.map((course, index) => (
                  <tr key={course.id}>
                    <td>{index + 1}</td>
                    <td>{course.code}</td>
                    <td>{course.name}</td>
                    <td>{course.credits}</td>
                    <td>{course.classId}</td>
                    <td>{course.schedule}</td>
                    <td>{course.room}</td>
                    <td>{course.currentStudents}/{course.maxStudents}</td>
                    <td>
                      {course.status === "full" ? (
                        <button className="register-btn full" disabled>
                          <i className="fa fa-ban"></i> Đã đầy
                        </button>
                      ) : (
                        <button 
                          className={`register-btn ${course.status === "almost-full" ? "almost-full" : ""}`}
                          onClick={() => handleRegisterClick(course)}
                        >
                          <i className="fa fa-plus-circle"></i> Đăng ký
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "2rem" }}>
                    {filterLoading ? "Đang tải dữ liệu..." : "Không tìm thấy học phần nào"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <a href="#" className="active">1</a>
          <a href="#">2</a>
          <a href="#">3</a>
          <a href="#">&raquo;</a>
        </div>
      </div>

      {/* Danh sách học phần đã đăng ký */}
      <div className="registered-courses">
        <h2 className="section-title">Danh sách học phần đã đăng ký</h2>

        <div className="registered-table-container">
          <table className="registered-table">
            <thead>
              <tr>
                <th width="5%">STT</th>
                <th width="10%">Mã học phần</th>
                <th width="25%">Tên học phần</th>
                <th width="8%">Số TC</th>
                <th width="10%">Lớp</th>
                <th width="15%">Lịch học</th>
                <th width="10%">Phòng học</th>
                <th width="10%">Trạng thái</th>
                <th width="7%">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {registeredCourses.length > 0 ? (
                registeredCourses.map((course, index) => (
                  <tr key={course.id} className="show">
                    <td>{index + 1}</td>
                    <td>{course.code}</td>
                    <td>{course.name}</td>
                    <td>{course.credits}</td>
                    <td>{course.classId}</td>
                    <td>{course.schedule}</td>
                    <td>{course.room}</td>
                    <td className={`status-${course.status === "confirmed" ? "completed" : "processing"}`}>
                      {course.status === "confirmed" ? "Đã xác nhận" : 
                       course.status === "cancelled" ? "Đã hủy" : "Chờ xác nhận"}
                    </td>
                    <td>
                      <button 
                        className="cancel-course-btn" 
                        onClick={() => handleCancelCourse(course.id)}
                        title="Hủy đăng ký"
                      >
                        <i className="fa fa-times"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="empty-row">
                  <td colSpan={9} className="text-center">
                    Chưa có học phần nào được đăng ký
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="text-right"><strong>Tổng cộng:</strong></td>
                <td>
                  {registeredCourses.reduce((sum, course) => sum + course.credits, 0)}
                </td>
                <td colSpan={5}></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="registration-actions">
          <button 
            className="cancel-btn" 
            onClick={handleCancelAll}
          >
            <i className="fa fa-trash"></i> Hủy tất cả
          </button>
          <button 
            className="save-btn" 
            onClick={handleSaveRegistration}
            disabled={saveLoading}
          >
            {saveLoading ? (
              <>
                <i className="fa fa-spinner fa-spin"></i> Đang lưu...
              </>
            ) : (
              <>
                <i className="fa fa-save"></i> Lưu đăng ký
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal xác nhận đăng ký học phần */}
      <Modal isOpen={isModalOpen} onClick={handleModalClick}>
        <ModalContent>
          <div className="modal-header">
            <h3>Xác nhận đăng ký học phần</h3>
            <span className="close-modal" onClick={closeModal}>&times;</span>
          </div>
          <div className="modal-body">
            <p>Bạn có chắc chắn muốn đăng ký học phần này?</p>
            {currentCourse && (
              <div className="course-info">
                <div className="info-row">
                  <div className="info-label">Mã học phần:</div>
                  <div className="info-value">{currentCourse.code}</div>
                </div>
                <div className="info-row">
                  <div className="info-label">Tên học phần:</div>
                  <div className="info-value">{currentCourse.name}</div>
                </div>
                <div className="info-row">
                  <div className="info-label">Lớp:</div>
                  <div className="info-value">{currentCourse.classId}</div>
                </div>
                <div className="info-row">
                  <div className="info-label">Số tín chỉ:</div>
                  <div className="info-value">{currentCourse.credits}</div>
                </div>
                <div className="info-row">
                  <div className="info-label">Lịch học:</div>
                  <div className="info-value">{currentCourse.schedule}</div>
                </div>
                <div className="info-row">
                  <div className="info-label">Phòng học:</div>
                  <div className="info-value">{currentCourse.room}</div>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button className="cancel-btn" onClick={closeModal}>
              <i className="fa fa-times"></i> Hủy
            </button>
            <button 
              className="confirm-btn" 
              onClick={handleConfirmRegistration}
              disabled={registrationLoading}
            >
              {registrationLoading ? (
                <>
                  <i className="fa fa-spinner fa-spin"></i> Đang xử lý...
                </>
              ) : (
                <>
                  <i className="fa fa-check"></i> Xác nhận
                </>
              )}
            </button>
          </div>
        </ModalContent>
      </Modal>
    </CourseRegistrationWrapper>
  );
};

export default CourseRegistration;