import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import PageTransition from './PageTransition';
import { useLoading } from '../hooks/useLoading';

interface ProductDetailWrapperProps {
  children: React.ReactNode;
}

const ProductDetailWrapper: React.FC<ProductDetailWrapperProps> = ({ children }) => {
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

export default ProductDetailWrapper; 