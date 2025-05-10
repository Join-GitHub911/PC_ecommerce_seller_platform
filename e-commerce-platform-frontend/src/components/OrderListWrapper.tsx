import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import PageTransition from './PageTransition';
import { useLoading } from '../hooks/useLoading';

interface OrderListWrapperProps {
  children: React.ReactNode;
}

const OrderListWrapper: React.FC<OrderListWrapperProps> = ({ children }) => {
  const { loadingState } = useLoading();

  return (
    <ErrorBoundary>
      <PageTransition>
        {loadingState.isLoading && (
          <div className="loading-spinner" />
        )}
        {children}
      </PageTransition>
    </ErrorBoundary>
  );
};

export default OrderListWrapper; 