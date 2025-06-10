import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Header from './Header';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import LoadingScreen from './LoadingScreen';
import GlobalStyles from '../styles/GlobalStyles';
import theme from '../styles/theme';

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [activeContent, setActiveContent] = useState('dashboard');
  
  // Giả lập thời gian tải trang
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Hàm toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarActive(!isSidebarActive);
  };
  
  // Hàm đóng sidebar
  const closeSidebar = () => {
    setIsSidebarActive(false);
  };
  
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <LayoutWrapper>
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <>
            <Header toggleSidebar={toggleSidebar} userName="Nguyễn Văn A" />
            
            <Sidebar 
              isActive={isSidebarActive} 
              onClose={closeSidebar} 
              activeContent={activeContent}
              setActiveContent={setActiveContent}
            />
            
            <MainContent 
              activeContent={activeContent} 
              setActiveContent={setActiveContent}
              isSidebarActive={isSidebarActive}
            />
          </>
        )}
      </LayoutWrapper>
    </ThemeProvider>
  );
};

export default Layout;