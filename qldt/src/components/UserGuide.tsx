import React, { useEffect, useRef } from "react";
import styled from "styled-components";

// Styled Components
const GuideIntro = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  p {
    font-size: 16px;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
  }
`;

const QuickNav = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      flex-direction: column;
    }
  }

  li {
    flex: 1;
    min-width: 200px;
  }

  a {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: 6px;
    color: ${({ theme }) => theme.colors.text};
    text-decoration: none;
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
      background-color: ${({ theme }) => theme.colors.primary};
      color: white;
    }

    i {
      margin-right: 10px;
      font-size: 18px;
    }
  }
`;

const GuideCategories = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const GuideCategory = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const CategoryTitle = styled.h2`
  margin: 0;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;

  i {
    margin-right: 10px;
    font-size: 20px;
  }
`;

const GuideContent = styled.div`
  padding: 20px;
`;

const GuideItem = styled.div`
  margin-bottom: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  overflow: hidden;

  &:last-child {
    margin-bottom: 0;
  }

  h3 {
    margin: 0;
    padding: 15px;
    background-color: ${({ theme }) => theme.colors.background};
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;

    i:first-child {
      margin-right: 10px;
    }
  }

  .toggle-icon {
    transition: transform 0.3s ease;
  }

  &.collapsed .guide-details {
    display: none;
  }

  &.collapsed .toggle-icon {
    transform: rotate(180deg);
  }
`;

const GuideDetails = styled.div`
  padding: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  p {
    margin-top: 0;
    line-height: 1.6;
  }

  ol, ul {
    padding-left: 20px;
    line-height: 1.6;

    li {
      margin-bottom: 10px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const NoteBox = styled.div`
  background-color: rgba(255, 243, 224, 0.5);
  border-left: 4px solid #ff9800;
  padding: 15px;
  margin-top: 15px;
  border-radius: 4px;

  p {
    margin: 0;
    font-size: 14px;
  }
`;

const GuideVideos = styled.div`
  margin-top: 30px;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  h2 {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: 600;
    display: flex;
    align-items: center;

    i {
      margin-right: 10px;
      font-size: 20px;
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const VideoList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const VideoItem = styled.div`
  cursor: pointer;
`;

const VideoThumbnail = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;

  img {
    width: 100%;
    display: block;
    transition: transform 0.3s ease;
  }

  .play-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;

    i {
      color: white;
      font-size: 24px;
    }
  }

  &:hover {
    img {
      transform: scale(1.05);
    }

    .play-button {
      background-color: rgba(74, 144, 226, 0.9);
    }
  }
`;

const VideoTitle = styled.div`
  font-weight: 500;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const SupportContact = styled.div`
  margin-top: 30px;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  h2 {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: 600;
    display: flex;
    align-items: center;

    i {
      margin-right: 10px;
      font-size: 20px;
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const ContactInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
`;

const ContactIcon = styled.div`
  width: 50px;
  height: 50px;
  min-width: 50px;
  border-radius: 50%;
  background-color: rgba(74, 144, 226, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;

  i {
    font-size: 20px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ContactDetails = styled.div`
  h3 {
    margin: 0 0 5px 0;
    font-size: 16px;
    font-weight: 500;
  }

  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const UserGuide: React.FC = () => {
  // Refs cho các phần của trang
  const accountManagementRef = useRef<HTMLDivElement>(null);
  const mainFeaturesRef = useRef<HTMLDivElement>(null);
  const troubleshootingRef = useRef<HTMLDivElement>(null);
  const videoGuidesRef = useRef<HTMLDivElement>(null);
  const supportContactRef = useRef<HTMLDivElement>(null);

  // Hàm xử lý cuộn đến phần tương ứng
  const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement>) => {
    if (sectionRef.current) {
      window.scrollTo({
        top: sectionRef.current.offsetTop - 20,
        behavior: "smooth",
      });
    }
  };

  // Hàm xử lý toggle mở/đóng hướng dẫn
  const toggleGuideItem = (e: React.MouseEvent<HTMLHeadingElement>) => {
    const parent = (e.currentTarget as HTMLElement).parentElement;
    if (parent) {
      parent.classList.toggle("collapsed");
      
      // Cập nhật biểu tượng mũi tên
      const toggleIcon = e.currentTarget.querySelector(".toggle-icon i");
      if (toggleIcon) {
        if (parent.classList.contains("collapsed")) {
          toggleIcon.className = "fa fa-angle-down";
        } else {
          toggleIcon.className = "fa fa-angle-up";
        }
      }
    }
  };

  return (
    <>
      {/* Tiêu đề trang */}
      <h1 className="page-title">
        <i className="fa fa-question-circle"></i> Hướng dẫn sử dụng
      </h1>

      {/* Giới thiệu */}
      <GuideIntro>
        <p>
          Chào mừng bạn đến với Cổng thông tin sinh viên của Trường Đại học Công nghệ
          Đồng Nai. Trang này cung cấp hướng dẫn chi tiết về cách sử dụng các tính
          năng của hệ thống để giúp bạn tận dụng tối đa các dịch vụ trực tuyến của nhà
          trường.
        </p>
      </GuideIntro>

      {/* Mục lục nhanh */}
      <QuickNav>
        <ul>
          <li>
            <a href="#account-management" onClick={(e) => {
              e.preventDefault();
              scrollToSection(accountManagementRef);
            }}>
              <i className="fa fa-user-circle"></i> Đăng nhập và quản lý tài khoản
            </a>
          </li>
          <li>
            <a href="#main-features" onClick={(e) => {
              e.preventDefault();
              scrollToSection(mainFeaturesRef);
            }}>
              <i className="fa fa-th"></i> Sử dụng các tính năng chính
            </a>
          </li>
          <li>
            <a href="#troubleshooting" onClick={(e) => {
              e.preventDefault();
              scrollToSection(troubleshootingRef);
            }}>
              <i className="fa fa-life-ring"></i> Xử lý sự cố thường gặp
            </a>
          </li>
          <li>
            <a href="#video-guides" onClick={(e) => {
              e.preventDefault();
              scrollToSection(videoGuidesRef);
            }}>
              <i className="fa fa-video-camera"></i> Video hướng dẫn
            </a>
          </li>
          <li>
            <a href="#support-contact" onClick={(e) => {
              e.preventDefault();
              scrollToSection(supportContactRef);
            }}>
              <i className="fa fa-headphones"></i> Liên hệ hỗ trợ
            </a>
          </li>
        </ul>
      </QuickNav>

      {/* Danh mục hướng dẫn */}
      <GuideCategories>
        {/* Hướng dẫn đăng nhập và quản lý tài khoản */}
        <GuideCategory ref={accountManagementRef} id="account-management">
          <CategoryTitle>
            <i className="fa fa-user-circle"></i> Đăng nhập và quản lý tài khoản
          </CategoryTitle>
          <GuideContent>
            <GuideItem>
              <h3 onClick={toggleGuideItem}>
                <i className="fa fa-sign-in"></i> Đăng nhập hệ thống
                <span className="toggle-icon"><i className="fa fa-angle-up"></i></span>
              </h3>
              <GuideDetails className="guide-details">
                <p>Để đăng nhập vào hệ thống, bạn cần thực hiện các bước sau:</p>
                <ol>
                  <li>
                    Truy cập trang đăng nhập tại địa chỉ:
                    <a href="#">https://sinhvien.dntu.edu.vn</a>
                  </li>
                  <li>Nhập mã sinh viên vào ô "Tên đăng nhập"</li>
                  <li>
                    Nhập mật khẩu của bạn (mật khẩu mặc định là ngày tháng năm sinh
                    theo định dạng ddmmyyyy)
                  </li>
                  <li>Nhấn nút "Đăng nhập"</li>
                </ol>
                <NoteBox>
                  <p>
                    <strong>Lưu ý:</strong> Vì lý do bảo mật, bạn nên đổi mật khẩu mặc
                    định ngay sau lần đăng nhập đầu tiên.
                  </p>
                </NoteBox>
              </GuideDetails>
            </GuideItem>

            <GuideItem>
              <h3 onClick={toggleGuideItem}>
                <i className="fa fa-lock"></i> Đổi mật khẩu
                <span className="toggle-icon"><i className="fa fa-angle-up"></i></span>
              </h3>
              <GuideDetails className="guide-details">
                <p>Để đổi mật khẩu, bạn thực hiện theo các bước sau:</p>
                <ol>
                  <li>Đăng nhập vào hệ thống</li>
                  <li>Nhấp vào tên của bạn ở góc trên bên phải màn hình</li>
                  <li>Chọn "Settings" từ menu dropdown</li>
                  <li>Trong trang Cài đặt, chọn tab "Đổi mật khẩu"</li>
                  <li>
                    Nhập mật khẩu hiện tại và mật khẩu mới (mật khẩu mới phải có ít
                    nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số)
                  </li>
                  <li>Nhấn nút "Lưu thay đổi"</li>
                </ol>
              </GuideDetails>
            </GuideItem>

            <GuideItem>
              <h3 onClick={toggleGuideItem}>
                <i className="fa fa-refresh"></i> Khôi phục mật khẩu
                <span className="toggle-icon"><i className="fa fa-angle-up"></i></span>
              </h3>
              <GuideDetails className="guide-details">
                <p>Nếu bạn quên mật khẩu, bạn có thể khôi phục bằng cách:</p>
                <ol>
                  <li>Truy cập trang đăng nhập</li>
                  <li>Nhấp vào liên kết "Quên mật khẩu"</li>
                  <li>Nhập mã sinh viên và email đã đăng ký với nhà trường</li>
                  <li>Làm theo hướng dẫn được gửi đến email của bạn</li>
                </ol>
                <NoteBox>
                  <p>
                    <strong>Lưu ý:</strong> Nếu bạn không nhận được email khôi phục,
                    vui lòng liên hệ Phòng Công nghệ thông tin tại phòng A105 hoặc gọi
                    số điện thoại 0251.3456.789.
                  </p>
                </NoteBox>
              </GuideDetails>
            </GuideItem>
          </GuideContent>
        </GuideCategory>

        {/* Hướng dẫn sử dụng các tính năng chính */}
        <GuideCategory ref={mainFeaturesRef} id="main-features">
          <CategoryTitle>
            <i className="fa fa-th"></i> Sử dụng các tính năng chính
          </CategoryTitle>
          <GuideContent>
            <GuideItem>
              <h3 onClick={toggleGuideItem}>
                <i className="fa fa-bullhorn"></i> Xem thông báo từ nhà trường
                <span className="toggle-icon"><i className="fa fa-angle-up"></i></span>
              </h3>
              <GuideDetails className="guide-details">
                <p>Để xem các thông báo từ nhà trường:</p>
                <ol>
                  <li>Đăng nhập vào hệ thống</li>
                  <li>
                    Từ menu bên trái, chọn "Tiện ích" > "Thông báo từ nhà trường"
                  </li>
                  <li>
                    Bạn có thể lọc thông báo theo phòng ban hoặc thời gian bằng các
                    tùy chọn ở phần đầu trang
                  </li>
                  <li>Nhấp vào tiêu đề thông báo để xem chi tiết</li>
                </ol>
              </GuideDetails>
            </GuideItem>

            <GuideItem>
              <h3 onClick={toggleGuideItem}>
                <i className="fa fa-tasks"></i> Sử dụng dịch vụ một cửa
                <span className="toggle-icon"><i className="fa fa-angle-up"></i></span>
              </h3>
              <GuideDetails className="guide-details">
                <p>Để đăng ký các dịch vụ sinh viên:</p>
                <ol>
                  <li>Từ menu bên trái, chọn "Tiện ích" > "Dịch vụ một cửa"</li>
                  <li>Chọn loại dịch vụ bạn muốn đăng ký từ danh sách</li>
                  <li>Nhấp vào dịch vụ cụ thể để mở form đăng ký</li>
                  <li>Điền đầy đủ thông tin vào form</li>
                  <li>Tải lên các tài liệu cần thiết (nếu có)</li>
                  <li>Nhấn nút "Đăng ký dịch vụ"</li>
                </ol>
                <p>
                  Sau khi đăng ký, bạn có thể theo dõi trạng thái xử lý trong phần
                  "Dịch vụ đã đăng ký".
                </p>
              </GuideDetails>
            </GuideItem>

            <GuideItem>
              <h3 onClick={toggleGuideItem}>
                <i className="fa fa-calendar"></i> Xem lịch học và lịch thi
                <span className="toggle-icon"><i className="fa fa-angle-up"></i></span>
              </h3>
              <GuideDetails className="guide-details">
                <p>Để xem lịch học và lịch thi:</p>
                <ol>
                  <li>Từ menu bên trái, chọn "Đào tạo" > "Lịch học - Lịch thi"</li>
                  <li>Chọn học kỳ bạn muốn xem từ dropdown menu</li>
                  <li>
                    Bạn có thể chuyển đổi giữa chế độ xem theo tuần, tháng hoặc danh
                    sách
                  </li>
                  <li>
                    Để xem chi tiết về một lớp học phần, nhấp vào ô tương ứng trong
                    lịch
                  </li>
                </ol>
              </GuideDetails>
            </GuideItem>

            <GuideItem>
              <h3 onClick={toggleGuideItem}>
                <i className="fa fa-graduation-cap"></i> Xem kết quả học tập
                <span className="toggle-icon"><i className="fa fa-angle-up"></i></span>
              </h3>
              <GuideDetails className="guide-details">
                <p>Để xem kết quả học tập của bạn:</p>
                <ol>
                  <li>Từ menu bên trái, chọn "Đào tạo" > "Kết quả học tập"</li>
                  <li>Hệ thống sẽ hiển thị bảng điểm tổng hợp của bạn</li>
                  <li>
                    Bạn có thể chọn xem theo học kỳ cụ thể hoặc toàn bộ khóa học
                  </li>
                  <li>
                    Để xem chi tiết điểm thành phần của một học phần, nhấp vào tên học
                    phần
                  </li>
                </ol>
                <NoteBox>
                  <p>
                    <strong>Lưu ý:</strong> Nếu phát hiện sai sót về điểm số, bạn cần
                    liên hệ với giảng viên phụ trách học phần hoặc phòng Đào tạo trong
                    vòng 7 ngày kể từ khi điểm được công bố.
                  </p>
                </NoteBox>
              </GuideDetails>
            </GuideItem>
          </GuideContent>
        </GuideCategory>

        {/* Hướng dẫn xử lý sự cố */}
        <GuideCategory ref={troubleshootingRef} id="troubleshooting">
          <CategoryTitle>
            <i className="fa fa-life-ring"></i> Xử lý sự cố thường gặp
          </CategoryTitle>
          <GuideContent>
            <GuideItem>
              <h3 onClick={toggleGuideItem}>
                <i className="fa fa-exclamation-triangle"></i> Không thể đăng nhập
                <span className="toggle-icon"><i className="fa fa-angle-up"></i></span>
              </h3>
              <GuideDetails className="guide-details">
                <p>Nếu bạn không thể đăng nhập, hãy kiểm tra:</p>
                <ul>
                  <li>Mã sinh viên và mật khẩu đã nhập chính xác</li>
                  <li>Phím Caps Lock đã tắt</li>
                  <li>Kết nối internet ổn định</li>
                  <li>Thử xóa cache và cookie của trình duyệt</li>
                  <li>Thử sử dụng trình duyệt khác (Chrome, Firefox, Edge)</li>
                </ul>
                <p>
                  Nếu vẫn không đăng nhập được, vui lòng liên hệ Phòng Công nghệ thông
                  tin để được hỗ trợ.
                </p>
              </GuideDetails>
            </GuideItem>

            <GuideItem>
              <h3 onClick={toggleGuideItem}>
                <i className="fa fa-clock-o"></i> Hệ thống chậm hoặc không phản hồi
                <span className="toggle-icon"><i className="fa fa-angle-up"></i></span>
              </h3>
              <GuideDetails className="guide-details">
                <p>Nếu hệ thống chậm hoặc không phản hồi:</p>
                <ul>
                  <li>Làm mới trang (F5)</li>
                  <li>Kiểm tra kết nối internet của bạn</li>
                  <li>Thử đăng xuất và đăng nhập lại</li>
                  <li>Xóa cache và cookie của trình duyệt</li>
                  <li>Thử truy cập vào thời điểm khác (tránh giờ cao điểm)</li>
                </ul>
              </GuideDetails>
            </GuideItem>

            <GuideItem>
              <h3 onClick={toggleGuideItem}>
                <i className="fa fa-file-text"></i> Không thể tải tài liệu
                <span className="toggle-icon"><i className="fa fa-angle-up"></i></span>
              </h3>
              <GuideDetails className="guide-details">
                <p>Nếu bạn không thể tải tài liệu:</p>
                <ul>
                  <li>Kiểm tra kết nối internet</li>
                  <li>Đảm bảo bạn có quyền truy cập vào tài liệu đó</li>
                  <li>Kiểm tra xem trình duyệt có chặn popup không</li>
                  <li>Thử sử dụng trình duyệt khác</li>
                  <li>Kiểm tra dung lượng lưu trữ trên thiết bị của bạn</li>
                </ul>
              </GuideDetails>
            </GuideItem>

            <GuideItem>
              <h3 onClick={toggleGuideItem}>
                <i className="fa fa-ban"></i> Tài khoản bị khóa
                <span className="toggle-icon"><i className="fa fa-angle-up"></i></span>
              </h3>
              <GuideDetails className="guide-details">
                <p>Nếu tài khoản của bạn bị khóa:</p>
                <ul>
                  <li>
                    Tài khoản có thể bị khóa tạm thời do nhập sai mật khẩu nhiều lần
                  </li>
                  <li>
                    Tài khoản có thể bị khóa do vi phạm quy định sử dụng hệ thống
                  </li>
                  <li>
                    Tài khoản có thể bị khóa do chưa hoàn thành nghĩa vụ học phí
                  </li>
                </ul>
                <p>
                  Để mở khóa tài khoản, vui lòng liên hệ trực tiếp với Phòng Công nghệ
                  thông tin hoặc gửi email đến địa chỉ hotro.cntt@dntu.edu.vn kèm theo
                  thông tin cá nhân và mã sinh viên của bạn.
                </p>
              </GuideDetails>
            </GuideItem>
          </GuideContent>
        </GuideCategory>
      </GuideCategories>

      {/* Video hướng dẫn */}
      <GuideVideos ref={videoGuidesRef} id="video-guides">
        <h2>
          <i className="fa fa-video-camera"></i> Video hướng dẫn
        </h2>
        <VideoList>
          <VideoItem>
            <VideoThumbnail>
              <img
                src="https://via.placeholder.com/320x180"
                alt="Video hướng dẫn đăng ký học phần"
              />
              <div className="play-button"><i className="fa fa-play"></i></div>
            </VideoThumbnail>
            <VideoTitle>Hướng dẫn đăng ký học phần trực tuyến</VideoTitle>
          </VideoItem>
          <VideoItem>
            <VideoThumbnail>
              <img
                src="https://via.placeholder.com/320x180"
                alt="Video hướng dẫn đăng ký dịch vụ"
              />
              <div className="play-button"><i className="fa fa-play"></i></div>
            </VideoThumbnail>
            <VideoTitle>Hướng dẫn sử dụng dịch vụ một cửa</VideoTitle>
          </VideoItem>
          <VideoItem>
            <VideoThumbnail>
              <img
                src="https://via.placeholder.com/320x180"
                alt="Video hướng dẫn xem điểm"
              />
              <div className="play-button"><i className="fa fa-play"></i></div>
            </VideoThumbnail>
            <VideoTitle>Hướng dẫn xem và kiểm tra điểm thi</VideoTitle>
          </VideoItem>
        </VideoList>
      </GuideVideos>

      {/* Liên hệ hỗ trợ */}
      <SupportContact ref={supportContactRef} id="support-contact">
        <h2><i className="fa fa-headphones"></i> Liên hệ hỗ trợ</h2>
        <ContactInfo>
          <ContactItem>
            <ContactIcon><i className="fa fa-map-marker"></i></ContactIcon>
            <ContactDetails>
              <h3>Phòng Công nghệ thông tin</h3>
              <p>Phòng A105, Tòa nhà A, Trường Đại học Công nghệ Đồng Nai</p>
            </ContactDetails>
          </ContactItem>
          <ContactItem>
            <ContactIcon><i className="fa fa-phone"></i></ContactIcon>
            <ContactDetails>
              <h3>Điện thoại hỗ trợ</h3>
              <p>(0251) 3456.789 (trong giờ hành chính)</p>
            </ContactDetails>
          </ContactItem>
          <ContactItem>
            <ContactIcon><i className="fa fa-envelope"></i></ContactIcon>
            <ContactDetails>
              <h3>Email hỗ trợ</h3>
              <p>hotro.cntt@dntu.edu.vn</p>
            </ContactDetails>
          </ContactItem>
          <ContactItem>
            <ContactIcon><i className="fa fa-clock-o"></i></ContactIcon>
            <ContactDetails>
              <h3>Thời gian hỗ trợ</h3>
              <p>Thứ 2 - Thứ 6: 7:30 - 17:00<br />Thứ 7: 7:30 - 11:30</p>
            </ContactDetails>
          </ContactItem>
        </ContactInfo>
      </SupportContact>
    </>
  );
};

export default UserGuide;