import React from 'react';
import styled from 'styled-components';

const LoadingWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 30px;
  border-radius: 10px;
  background-color: white;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
`;

const LoadingTitle = styled.h2`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 10px;
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 16px;
`;

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Vui lòng đợi trong giây lát' 
}) => {
  return (
    <LoadingWrapper>
      <LoadingContainer>
        <Spinner />
        <LoadingTitle>Đang tải dữ liệu...</LoadingTitle>
        <LoadingText>{message}</LoadingText>
      </LoadingContainer>
    </LoadingWrapper>
  );
};

export default LoadingScreen;