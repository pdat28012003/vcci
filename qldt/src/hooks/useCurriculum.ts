import { useState, useEffect, useCallback } from 'react';
import { 
  useCurriculumService, 
  CurriculumInfo, 
  CreditSummary, 
  AcademicYear, 
  CurriculumFilter 
} from '../services/curriculumService';
import { useToast } from './useUtils';

export const useCurriculum = () => {
  // State cho dữ liệu
  const [curriculumInfo, setCurriculumInfo] = useState<CurriculumInfo | null>(null);
  const [creditSummary, setCreditSummary] = useState<CreditSummary | null>(null);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  
  // State cho bộ lọc
  const [filter, setFilter] = useState<CurriculumFilter>({
    year: 'all',
    semester: 'all',
    courseType: 'all',
    searchText: ''
  });
  
  // State cho UI
  const [loading, setLoading] = useState<boolean>(true);
  const [filterLoading, setFilterLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Hooks
  const { 
    getCurriculumInfo, 
    getCreditSummary, 
    getAcademicYears,
    exportCurriculum
  } = useCurriculumService();
  const { showToast } = useToast();

  // Lấy dữ liệu ban đầu
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Gọi API lấy dữ liệu từ service
      const [infoData, summaryData, yearsData] = await Promise.all([
        getCurriculumInfo(),
        getCreditSummary(),
        getAcademicYears()
      ]);
      
      setCurriculumInfo(infoData);
      setCreditSummary(summaryData);
      setAcademicYears(yearsData);
      
      setLoading(false);
    } catch (err) {
      setError('Có lỗi xảy ra khi tải dữ liệu khung chương trình. Vui lòng thử lại sau.');
      setLoading(false);
      showToast('Có lỗi xảy ra khi tải dữ liệu khung chương trình', 'error');
    }
  }, [getCurriculumInfo, getCreditSummary, getAcademicYears, showToast]);

  // Áp dụng bộ lọc
  const applyFilter = useCallback(async (newFilter: Partial<CurriculumFilter>) => {
    try {
      setFilterLoading(true);
      
      // Cập nhật state filter
      const updatedFilter = { ...filter, ...newFilter };
      setFilter(updatedFilter);
      
      // Gọi API với bộ lọc mới
      const filteredYears = await getAcademicYears(updatedFilter);
      setAcademicYears(filteredYears);
      
      setFilterLoading(false);
    } catch (err) {
      showToast('Có lỗi xảy ra khi lọc dữ liệu', 'error');
      setFilterLoading(false);
    }
  }, [filter, getAcademicYears, showToast]);

  // Xử lý tìm kiếm học phần
  const searchCourses = useCallback((searchText: string) => {
    applyFilter({ searchText });
  }, [applyFilter]);

  // Xử lý in khung chương trình
  const printCurriculum = useCallback(() => {
    window.print();
  }, []);

  // Xử lý xuất file khung chương trình
  const handleExportCurriculum = useCallback(async (format: 'pdf' | 'excel' = 'pdf') => {
    try {
      showToast(`Đang xuất file khung chương trình dạng ${format.toUpperCase()}...`, 'info');
      
      // Gọi API xuất file
      const { url } = await exportCurriculum(format);
      
      // Trong thực tế, đây sẽ là tải file thực sự
      // window.open(url, '_blank');
      
      showToast(`Xuất file khung chương trình thành công`, 'success');
    } catch (err) {
      showToast('Có lỗi xảy ra khi xuất file khung chương trình', 'error');
    }
  }, [exportCurriculum, showToast]);

  // Tải dữ liệu khi component được mount
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return {
    // Dữ liệu
    curriculumInfo,
    creditSummary,
    academicYears,
    
    // Trạng thái
    filter,
    loading,
    filterLoading,
    error,
    
    // Hàm xử lý
    applyFilter,
    searchCourses,
    printCurriculum,
    exportCurriculum: handleExportCurriculum,
    refreshData: fetchInitialData
  };
};

export default useCurriculum;