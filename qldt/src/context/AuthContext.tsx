import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  // Kiểm tra xem người dùng đã đăng nhập chưa khi trang được tải
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    
    if (storedToken) {
      setToken(storedToken);
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Hàm kiểm tra xác thực
  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Trong thực tế, đây sẽ là một API call để kiểm tra token
      // Ví dụ: const response = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Dữ liệu mẫu
      const mockUser: User = {
        id: '1',
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        role: 'student'
      };
      
      setUser(mockUser);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Lỗi khi kiểm tra xác thực:', error);
      logout();
      setIsLoading(false);
      return false;
    }
  }, [token]);

  // Hàm đăng nhập
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Trong thực tế, đây sẽ là một API call để đăng nhập
      // Ví dụ: const response = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Kiểm tra thông tin đăng nhập mẫu
      if (email === 'nguyenvana@example.com' && password === 'password') {
        const mockToken = 'mock_token_' + Date.now();
        const mockUser: User = {
          id: '1',
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@example.com',
          role: 'student'
        };
        
        localStorage.setItem('auth_token', mockToken);
        setToken(mockToken);
        setUser(mockUser);
        showToast('Đăng nhập thành công', 'success');
      } else {
        throw new Error('Email hoặc mật khẩu không đúng');
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      showToast(error instanceof Error ? error.message : 'Đăng nhập thất bại', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  // Hàm đăng xuất
  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
    showToast('Đã đăng xuất', 'info');
  }, [showToast]);

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;