import { useState, useCallback } from 'react';
import { useToast } from './useUtils';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  showLoading?: boolean;
  showError?: boolean;
}

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Custom hook để gọi API
export const useApiService = () => {
  const [token, setToken] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  );
  const { showToast } = useToast();

  // Lưu token vào localStorage
  const saveToken = useCallback((newToken: string) => {
    localStorage.setItem('auth_token', newToken);
    setToken(newToken);
  }, []);

  // Xóa token khỏi localStorage
  const clearToken = useCallback(() => {
    localStorage.removeItem('auth_token');
    setToken(null);
  }, []);

  // Hàm gọi API chung
  const fetchApi = useCallback(async <T>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
    const baseUrl = 'https://api.example.com'; // URL cơ sở cho API
    const url = `${baseUrl}${endpoint}`;
    
    // Thiết lập mặc định cho options
    const defaultOptions: RequestInit = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers
      }
    };
    
    // Thêm body nếu có
    if (options.body) {
      defaultOptions.body = JSON.stringify(options.body);
    }
    
    try {
      // Hiển thị loading nếu cần
      if (options.showLoading) {
        // Hiển thị loading indicator
        // Trong thực tế, bạn có thể sử dụng một state global hoặc context
      }
      
      const response = await fetch(url, defaultOptions);
      
      // Kiểm tra response status
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Có lỗi xảy ra');
      }
      
      // Parse JSON response
      const data = await response.json();
      
      return data as T;
    } catch (error) {
      // Hiển thị thông báo lỗi nếu cần
      if (options.showError) {
        showToast(error instanceof Error ? error.message : 'Có lỗi xảy ra', 'error');
      }
      
      throw error;
    } finally {
      // Ẩn loading nếu cần
      if (options.showLoading) {
        // Ẩn loading indicator
      }
    }
  }, [token, showToast]);

  // Hook để sử dụng API với state
  const useApi = <T>(endpoint: string, options: ApiOptions = {}) => {
    const [state, setState] = useState<ApiState<T>>({
      data: null,
      loading: false,
      error: null
    });

    const fetchData = useCallback(async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const data = await fetchApi<T>(endpoint, options);
        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: error instanceof Error ? error.message : 'Có lỗi xảy ra' 
        }));
        throw error;
      }
    }, [endpoint, options]);

    return { ...state, fetchData };
  };

  return {
    fetchApi,
    useApi,
    token,
    saveToken,
    clearToken
  };
};

export default useApiService;