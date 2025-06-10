import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useToast } from "../hooks/useUtils";
import useOneStopService, {
  Service,
  ServiceStat,
} from "../services/oneStopService";
import ServiceHistory from "./ServiceHistory";

// Styled Components
const ServiceIntro = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: 20px;

  p {
    margin: 0;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text};
  }
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
    min-width: 200px;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const ServiceStats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 25px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const StatItem = styled.div`
  flex: 1;
  min-width: 120px;
  background-color: white;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: 15px;
  text-align: center;
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

const ServiceCategories = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const ServiceCategory = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
`;

const CategoryTitle = styled.h2`
  margin: 0;
  padding: 15px 20px;
  background-color: ${({ theme }) => theme.colors.light};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};

  i {
    margin-right: 10px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ServiceList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
  padding: 15px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const ServiceItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const ServiceIcon = styled.div`
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 50%;
  background-color: rgba(74, 144, 226, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;

  i {
    font-size: 18px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ServiceName = styled.div`
  flex: 1;
  font-size: 14px;
  font-weight: 500;
`;

const ServiceArrow = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
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

// Interfaces đã được import từ service

const OneStopService: React.FC = () => {
  // State cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // State cho form dịch vụ
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);

  // State cho dữ liệu
  const [services, setServices] = useState<Service[]>([]);
  const [serviceStats, setServiceStats] = useState<ServiceStat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const { getServices, getServiceStats, registerService } = useOneStopService();
  const { showToast } = useToast();

  // Lấy dữ liệu khi component được mount
  useEffect(() => {
    let isMounted = true; // Biến để kiểm tra component còn mounted hay không

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Gọi API lấy dữ liệu từ service
        const [servicesData, statsData] = await Promise.all([
          getServices(),
          getServiceStats(),
        ]);

        // Chỉ cập nhật state nếu component vẫn mounted
        if (isMounted) {
          setServices(servicesData);
          setServiceStats(statsData);
          setLoading(false);
        }
      } catch (err) {
        // Chỉ cập nhật state nếu component vẫn mounted
        if (isMounted) {
          setError(
            "Có lỗi xảy ra khi tải dữ liệu dịch vụ. Vui lòng thử lại sau."
          );
          setLoading(false);
          showToast("Có lỗi xảy ra khi tải dữ liệu dịch vụ", "error");
        }
      }
    };

    fetchData();

    // Cleanup function để tránh memory leak
    return () => {
      isMounted = false;
    };
  }, [getServices, getServiceStats, showToast]);

  // Hàm xử lý tìm kiếm
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Hàm xử lý lọc theo loại
  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
  };

  // Hàm xử lý khi click vào dịch vụ
  const handleServiceClick = async (serviceId: string) => {
    try {
      setActiveServiceId(serviceId);

      const selectedService = services.find((s) => s.id === serviceId);

      // Hiển thị thông báo xác nhận
      if (
        window.confirm(
          `Bạn có chắc chắn muốn đăng ký dịch vụ: ${selectedService?.name}?`
        )
      ) {
        // Hiển thị thông báo đang xử lý
        showToast(`Đang đăng ký dịch vụ: ${selectedService?.name}`, "info");

        // Gọi API đăng ký dịch vụ
        await registerService(serviceId);

        // Hiển thị thông báo thành công
        showToast(
          `Đăng ký dịch vụ thành công: ${selectedService?.name}`,
          "success"
        );

        // Cập nhật lại thống kê sau khi đăng ký
        const updatedStats = await getServiceStats();
        setServiceStats(updatedStats);
      }
    } catch (error) {
      showToast("Có lỗi xảy ra khi đăng ký dịch vụ", "error");
    }
  };

  // Lọc dịch vụ theo tìm kiếm và danh mục
  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter
      ? service.category === categoryFilter
      : true;
    return matchesSearch && matchesCategory;
  });

  // Nhóm dịch vụ theo danh mục
  const servicesByCategory = {
    "giay-to": filteredServices.filter((s) => s.category === "giay-to"),
    "chung-chi": filteredServices.filter((s) => s.category === "chung-chi"),
    "hoc-phi": filteredServices.filter((s) => s.category === "hoc-phi"),
    khac: filteredServices.filter((s) => s.category === "khac"),
  };

  return (
    <>
      {/* Tiêu đề trang */}
      <h1 className="page-title">
        <i className="fa fa-tasks" style={{ color: "#1e3056" }}></i> Dịch vụ một
        cửa
      </h1>

      {/* Giới thiệu dịch vụ */}
      <ServiceIntro>
        <p>
          Dịch vụ một cửa giúp sinh viên dễ dàng đăng ký và theo dõi các thủ tục
          hành chính, giấy tờ trong quá trình học tập tại trường. Sinh viên có
          thể đăng ký trực tuyến và nhận thông báo khi hồ sơ được xử lý.
        </p>
      </ServiceIntro>

      {/* Tìm kiếm và lọc */}
      <FilterSection>
        <SearchBox>
          <input
            type="text"
            placeholder="Tìm kiếm dịch vụ..."
            value={searchTerm}
            onChange={handleSearch}
            disabled={loading}
          />
          <button disabled={loading}>
            <i className="fa fa-search"></i>
          </button>
        </SearchBox>
        <FilterOptions>
          <select
            value={categoryFilter}
            onChange={handleCategoryFilter}
            disabled={loading}
          >
            <option value="">Tất cả dịch vụ</option>
            <option value="giay-to">Giấy tờ, xác nhận</option>
            <option value="chung-chi">Chứng chỉ</option>
            <option value="hoc-phi">Học phí, miễn giảm</option>
            <option value="khac">Dịch vụ khác</option>
          </select>
        </FilterOptions>
      </FilterSection>

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
          {/* Thống kê dịch vụ */}
          <ServiceStats>
            {serviceStats.map((stat, index) => (
              <StatItem key={index}>
                <StatValue>{stat.value}</StatValue>
                <StatLabel>{stat.label}</StatLabel>
              </StatItem>
            ))}
          </ServiceStats>

          {/* Hiển thị trạng thái trống nếu không có dịch vụ nào */}
          {filteredServices.length === 0 && (
            <EmptyStateContainer>
              <i className="fa fa-search"></i>
              <h3>Không tìm thấy dịch vụ</h3>
              <p>
                Không có dịch vụ nào phù hợp với tiêu chí tìm kiếm của bạn. Vui
                lòng thử lại với từ khóa khác hoặc xóa bộ lọc.
              </p>
            </EmptyStateContainer>
          )}

          {/* Danh sách dịch vụ */}
          {filteredServices.length > 0 && (
            <ServiceCategories>
              {/* Giấy tờ, xác nhận */}
              {servicesByCategory["giay-to"].length > 0 && (
                <ServiceCategory>
                  <CategoryTitle>
                    <i className="fa fa-file-alt"></i> Giấy tờ, xác nhận
                  </CategoryTitle>
                  <ServiceList>
                    {servicesByCategory["giay-to"].map((service) => (
                      <ServiceItem
                        key={service.id}
                        onClick={() => handleServiceClick(service.id)}
                      >
                        <ServiceIcon>
                          <i className={`fa ${service.icon}`}></i>
                        </ServiceIcon>
                        <ServiceName>{service.name}</ServiceName>
                        <ServiceArrow>
                          <i className="fa fa-chevron-right"></i>
                        </ServiceArrow>
                      </ServiceItem>
                    ))}
                  </ServiceList>
                </ServiceCategory>
              )}

              {/* Chứng chỉ */}
              {servicesByCategory["chung-chi"].length > 0 && (
                <ServiceCategory>
                  <CategoryTitle>
                    <i className="fa fa-certificate"></i> Chứng chỉ
                  </CategoryTitle>
                  <ServiceList>
                    {servicesByCategory["chung-chi"].map((service) => (
                      <ServiceItem
                        key={service.id}
                        onClick={() => handleServiceClick(service.id)}
                      >
                        <ServiceIcon>
                          <i className={`fa ${service.icon}`}></i>
                        </ServiceIcon>
                        <ServiceName>{service.name}</ServiceName>
                        <ServiceArrow>
                          <i className="fa fa-chevron-right"></i>
                        </ServiceArrow>
                      </ServiceItem>
                    ))}
                  </ServiceList>
                </ServiceCategory>
              )}

              {/* Học phí, miễn giảm */}
              {servicesByCategory["hoc-phi"].length > 0 && (
                <ServiceCategory>
                  <CategoryTitle>
                    <i className="fa fa-money-bill-wave"></i> Học phí, miễn giảm
                  </CategoryTitle>
                  <ServiceList>
                    {servicesByCategory["hoc-phi"].map((service) => (
                      <ServiceItem
                        key={service.id}
                        onClick={() => handleServiceClick(service.id)}
                      >
                        <ServiceIcon>
                          <i className={`fa ${service.icon}`}></i>
                        </ServiceIcon>
                        <ServiceName>{service.name}</ServiceName>
                        <ServiceArrow>
                          <i className="fa fa-chevron-right"></i>
                        </ServiceArrow>
                      </ServiceItem>
                    ))}
                  </ServiceList>
                </ServiceCategory>
              )}

              {/* Dịch vụ khác */}
              {servicesByCategory["khac"].length > 0 && (
                <ServiceCategory>
                  <CategoryTitle>
                    <i className="fa fa-ellipsis-h"></i> Dịch vụ khác
                  </CategoryTitle>
                  <ServiceList>
                    {servicesByCategory["khac"].map((service) => (
                      <ServiceItem
                        key={service.id}
                        onClick={() => handleServiceClick(service.id)}
                      >
                        <ServiceIcon>
                          <i className={`fa ${service.icon}`}></i>
                        </ServiceIcon>
                        <ServiceName>{service.name}</ServiceName>
                        <ServiceArrow>
                          <i className="fa fa-chevron-right"></i>
                        </ServiceArrow>
                      </ServiceItem>
                    ))}
                  </ServiceList>
                </ServiceCategory>
              )}
            </ServiceCategories>
          )}

          {/* Lịch sử đăng ký dịch vụ */}
          {!loading && !error && <ServiceHistory />}
        </>
      )}
    </>
  );
};

export default OneStopService;
