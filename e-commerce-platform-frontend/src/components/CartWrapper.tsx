import React, { useEffect } from 'react';
import { EnhancedErrorBoundary } from './common/EnhancedErrorBoundary';
import { EnhancedPageTransition } from './common/EnhancedPageTransition';
import { SmartLoader } from './common/SmartLoader';
import { useCartLoading } from '../hooks/useCartLoading';
import { ErrorService } from '../services/errorService';

interface CartWrapperProps {
  children: React.ReactNode;
}

export const CartWrapper: React.FC<CartWrapperProps> = ({ children }) => {
  const { 
    isLoading, 
    message, 
    progress, 
    startCartLoading, 
    endLoading 
  } = useCartLoading();

  // 处理错误的回调函数
  const handleError = (error: Error) => {
    endLoading();
    ErrorService.handleCartError(error);
  };

  // 当组件重新挂载时，自动开始加载
  useEffect(() => {
    startCartLoading();
    
    // 模拟购物车数据加载完成
    const timer = setTimeout(() => {
      endLoading();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <EnhancedErrorBoundary 
      componentName="购物车" 
      onReset={() => window.location.reload()}
    >
      <EnhancedPageTransition type="fade" duration={300}>
        <SmartLoader 
          spinning={isLoading} 
          message={message} 
          progress={progress}
          transparent={true}
        >
          {children}
        </SmartLoader>
      </EnhancedPageTransition>
    </EnhancedErrorBoundary>
  );
}; 