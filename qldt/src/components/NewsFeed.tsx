import React, { useState } from "react";
import styled from "styled-components";

// Styled Components
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

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const FeaturedNews = styled.div`
  margin-bottom: 25px;
`;

const FeaturedNewsItem = styled.div`
  display: flex;
  background-color: white;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const FeaturedNewsIcon = styled.div`
  width: 100px;
  min-width: 100px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;

  i {
    font-size: 36px;
    margin-bottom: 10px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    padding: 15px 0;
    flex-direction: row;

    i {
      margin-bottom: 0;
      margin-right: 10px;
    }
  }
`;

const FeaturedNewsCategory = styled.div`
  font-size: 14px;
  font-weight: 500;
  text-align: center;
`;

const FeaturedNewsContent = styled.div`
  flex: 1;
  padding: 20px;
`;

const FeaturedNewsTitle = styled.h2`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 20px;
  }
`;

const FeaturedNewsMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 15px;

  span {
    display: flex;
    align-items: center;

    i {
      margin-right: 5px;
    }
  }
`;

const FeaturedNewsExcerpt = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
  margin-bottom: 15px;
`;

const ReadMoreBtn = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }

  i {
    margin-left: 5px;
  }
`;

const NewsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const NewsItem = styled.div`
  display: flex;
  background-color: white;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
  height: 100%;
`;

const NewsIcon = styled.div`
  width: 70px;
  min-width: 70px;
  background-color: ${({ theme }) => theme.colors.light};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 0;

  i {
    font-size: 24px;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 8px;
  }
`;

const NewsCategory = styled.div`
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  padding: 0 5px;
`;

const NewsContent = styled.div`
  flex: 1;
  padding: 15px;
  display: flex;
  flex-direction: column;
`;

const NewsTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.text};
`;

const NewsMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 10px;

  span {
    display: flex;
    align-items: center;

    i {
      margin-right: 5px;
    }
  }
`;

const NewsExcerpt = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.5;
  margin-bottom: 12px;
  flex: 1;
`;

const ReadMoreLink = styled.a`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  margin-top: auto;

  &:hover {
    text-decoration: underline;
  }

  i {
    margin-left: 5px;
  }
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

// Interface cho dữ liệu tin tức
interface NewsItem {
  id: number;
  title: string;
  date: string;
  views: number;
  content: string;
  category: string;
  icon: string;
}

// Interface cho tin nổi bật
interface FeaturedNews {
  id: number;
  title: string;
  date: string;
  views: number;
  content: string;
  category: string;
  icon: string;
}

const NewsFeed: React.FC = () => {
  // State cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");

  // Dữ liệu mẫu cho tin nổi bật
  const featuredNews: FeaturedNews = {
    id: 1,
    title:
      "Lễ kỷ niệm 20 năm thành lập Trường Đại học Công nghệ Đồng Nai (2004-2024)",
    date: "15/05/2024",
    views: 1245,
    content:
      "Trường Đại học Công nghệ Đồng Nai long trọng tổ chức Lễ kỷ niệm 20 năm thành lập trường (2004-2024) vào ngày 20/06/2024. Buổi lễ sẽ có sự tham dự của lãnh đạo Bộ Giáo dục và Đào tạo, lãnh đạo tỉnh Đồng Nai, các đối tác doanh nghiệp và đông đảo cựu sinh viên qua các thời kỳ...",
    category: "Sự kiện",
    icon: "fa-university",
  };

  // Dữ liệu mẫu cho danh sách tin tức
  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: 'Hội thảo khoa học "Ứng dụng AI trong giáo dục đại học"',
      date: "12/05/2024",
      views: 856,
      content:
        'Khoa Công nghệ thông tin tổ chức Hội thảo khoa học "Ứng dụng AI trong giáo dục đại học" vào ngày 25/05/2024. Hội thảo có sự tham gia của các chuyên gia hàng đầu trong lĩnh vực AI và giáo dục...',
      category: "Học thuật",
      icon: "fa-laptop",
    },
    {
      id: 2,
      title: "FPT Software tuyển dụng sinh viên thực tập và mới tốt nghiệp",
      date: "10/05/2024",
      views: 1023,
      content:
        "FPT Software thông báo tuyển dụng sinh viên thực tập và mới tốt nghiệp ngành CNTT với nhiều vị trí hấp dẫn: Lập trình viên Front-end, Back-end, Mobile, Tester, BA... Ứng viên quan tâm nộp hồ sơ trước ngày 30/05/2024...",
      category: "Tuyển dụng",
      icon: "fa-briefcase",
    },
    {
      id: 3,
      title: 'Cuộc thi "Ý tưởng khởi nghiệp sáng tạo" dành cho sinh viên',
      date: "08/05/2024",
      views: 745,
      content:
        'Đoàn Thanh niên - Hội Sinh viên trường phối hợp với Sở Khoa học và Công nghệ tỉnh Đồng Nai tổ chức cuộc thi "Ý tưởng khởi nghiệp sáng tạo" dành cho sinh viên. Thời gian nhận bài dự thi từ 15/05/2024 đến 15/06/2024...',
      category: "Hoạt động sinh viên",
      icon: "fa-lightbulb-o",
    },
    {
      id: 4,
      title: "Chương trình học bổng du học Hàn Quốc năm 2024",
      date: "05/05/2024",
      views: 932,
      content:
        "Phòng Hợp tác quốc tế thông báo chương trình học bổng du học Hàn Quốc năm 2024 dành cho sinh viên xuất sắc. Học bổng bao gồm học phí, sinh hoạt phí và vé máy bay khứ hồi. Hạn nộp hồ sơ: 30/05/2024...",
      category: "Học bổng",
      icon: "fa-graduation-cap",
    },
    {
      id: 5,
      title: "Hội thao sinh viên năm học 2023-2024",
      date: "01/05/2024",
      views: 678,
      content:
        "Hội thao sinh viên năm học 2023-2024 sẽ được tổ chức từ ngày 10/06/2024 đến 20/06/2024 với nhiều môn thi đấu: Bóng đá, bóng chuyền, cầu lông, bóng bàn, cờ vua... Sinh viên đăng ký tham gia tại văn phòng Đoàn - Hội trước ngày 05/06/2024...",
      category: "Hoạt động sinh viên",
      icon: "fa-futbol-o",
    },
    {
      id: 6,
      title: "Hội nghị khoa học sinh viên năm 2024",
      date: "28/04/2024",
      views: 542,
      content:
        "Hội nghị khoa học sinh viên năm 2024 sẽ được tổ chức vào ngày 15/06/2024. Đây là cơ hội để sinh viên trình bày các kết quả nghiên cứu khoa học và trao đổi học thuật. Thời hạn nộp bài báo cáo: 01/06/2024...",
      category: "Sự kiện",
      icon: "fa-users",
    },
  ];

  // Hàm xử lý tìm kiếm
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Hàm xử lý lọc theo chủ đề
  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
  };

  // Hàm xử lý lọc theo thời gian
  const handleTimeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeFilter(e.target.value);
  };

  // Hàm định dạng số lượt xem
  const formatViews = (views: number): string => {
    return views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <>
      {/* Tiêu đề trang */}
      <h1 className="page-title">
        <i className="fa fa-newspaper-o" style={{ color: "#1e3056" }}></i> Bảng
        tin
      </h1>

      {/* Phần tìm kiếm và lọc */}
      <FilterSection>
        <SearchBox>
          <input
            type="text"
            placeholder="Tìm kiếm tin tức..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <button>
            <i className="fa fa-search"></i>
          </button>
        </SearchBox>
        <FilterOptions>
          <select value={categoryFilter} onChange={handleCategoryFilter}>
            <option value="">Tất cả chủ đề</option>
            <option value="su-kien">Sự kiện</option>
            <option value="hoc-thuat">Học thuật</option>
            <option value="hoat-dong">Hoạt động sinh viên</option>
            <option value="tuyen-dung">Tuyển dụng</option>
            <option value="hoc-bong">Học bổng</option>
          </select>
          <select value={timeFilter} onChange={handleTimeFilter}>
            <option value="">Tất cả thời gian</option>
            <option value="today">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="year">Năm nay</option>
          </select>
        </FilterOptions>
      </FilterSection>

      {/* Tin nổi bật */}
      <FeaturedNews>
        <FeaturedNewsItem>
          <FeaturedNewsIcon>
            <i className={`fa ${featuredNews.icon}`}></i>
            <FeaturedNewsCategory>{featuredNews.category}</FeaturedNewsCategory>
          </FeaturedNewsIcon>
          <FeaturedNewsContent>
            <FeaturedNewsTitle>{featuredNews.title}</FeaturedNewsTitle>
            <FeaturedNewsMeta>
              <span>
                <i className="fa fa-calendar"></i> {featuredNews.date}
              </span>
              <span>
                <i className="fa fa-eye"></i> {formatViews(featuredNews.views)}{" "}
                lượt xem
              </span>
            </FeaturedNewsMeta>
            <FeaturedNewsExcerpt>{featuredNews.content}</FeaturedNewsExcerpt>
            <ReadMoreBtn href="#">
              Xem chi tiết <i className="fa fa-angle-right"></i>
            </ReadMoreBtn>
          </FeaturedNewsContent>
        </FeaturedNewsItem>
      </FeaturedNews>

      {/* Danh sách tin tức */}
      <NewsList>
        {newsItems.map((item) => (
          <NewsItem key={item.id}>
            <NewsIcon>
              <i className={`fa ${item.icon}`}></i>
              <NewsCategory>{item.category}</NewsCategory>
            </NewsIcon>
            <NewsContent>
              <NewsTitle>{item.title}</NewsTitle>
              <NewsMeta>
                <span>
                  <i className="fa fa-calendar"></i> {item.date}
                </span>
                <span>
                  <i className="fa fa-eye"></i> {formatViews(item.views)} lượt
                  xem
                </span>
              </NewsMeta>
              <NewsExcerpt>{item.content}</NewsExcerpt>
              <ReadMoreLink href="#">
                Xem thêm <i className="fa fa-angle-right"></i>
              </ReadMoreLink>
            </NewsContent>
          </NewsItem>
        ))}
      </NewsList>

      {/* Phân trang */}
      <Pagination>
        <a href="#">
          <i className="fa fa-angle-double-left"></i>
        </a>
        <a href="#">
          <i className="fa fa-angle-left"></i>
        </a>
        <a href="#" className="active">
          1
        </a>
        <a href="#">2</a>
        <a href="#">3</a>
        <a href="#">4</a>
        <a href="#">5</a>
        <a href="#">
          <i className="fa fa-angle-right"></i>
        </a>
        <a href="#">
          <i className="fa fa-angle-double-right"></i>
        </a>
      </Pagination>
    </>
  );
};

export default NewsFeed;
