import { useCallback } from 'react';

// Hook để hiển thị thông báo toast
export const useToast = () => {
  // Trong thực tế, đây sẽ là một hook thực sự để hiển thị toast
  // Ví dụ: sử dụng react-toastify, material-ui snackbar, etc.
  
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    // Giả lập hiển thị toast bằng console.log
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Trong thực tế, đây sẽ là code hiển thị toast UI
    // toast[type](message);
  }, []);
  
  return { showToast };
};

// Hook để xử lý các thao tác với form
export const useForm = <T extends Record<string, any>>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const handleReset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);
  
  return {
    values,
    errors,
    setValues,
    setErrors,
    handleChange,
    handleReset
  };
};

// Thêm import useState
import { useState } from 'react';

// Hook để xử lý các thao tác với modal
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);
  
  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);
  
  return {
    isOpen,
    openModal,
    closeModal
  };
};

// Hook để xử lý các thao tác với pagination
export const usePagination = (totalItems: number, itemsPerPage: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);
  
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);
  
  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);
  
  const getPageItems = useCallback((items: any[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage]);
  
  return {
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    getPageItems
  };
};

// Hook để xử lý các thao tác với local storage
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);
  
  return [storedValue, setValue] as const;
};