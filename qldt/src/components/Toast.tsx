import React from 'react';
import styled from 'styled-components';

const ToastContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ToastItem = styled.div<{ type: string }>`
  min-width: 250px;
  max-width: 350px;
  padding: 15px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ type, theme }) => {
    switch (type) {
      case 'success': return theme.colors.success;
      case 'error': return theme.colors.danger;
      case 'warning': return theme.colors.warning;
      default: return theme.colors.info;
    }
  }};
  color: white;
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: slideIn 0.3s ease-out forwards;
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const ToastContent = styled.div`
  flex-grow: 1;
`;

const ToastClose = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  margin-left: 10px;
  opacity: 0.8;
  transition: opacity ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    opacity: 1;
  }
`;

interface ToastProps {
  toasts: Array<{ id: number; message: string; type: string }>;
  onClose: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;
  
  return (
    <ToastContainer>
      {toasts.map(toast => (
        <ToastItem key={toast.id} type={toast.type}>
          <ToastContent>{toast.message}</ToastContent>
          <ToastClose onClick={() => onClose(toast.id)}>×</ToastClose>
        </ToastItem>
      ))}
    </ToastContainer>
  );
};

export default Toast;