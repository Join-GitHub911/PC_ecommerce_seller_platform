import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import PageTransition from './PageTransition';
import { useLoading } from '../hooks/useLoading';

interface AddressWrapperProps {
  children: React.ReactNode;
}

const AddressWrapper: React.FC<AddressWrapperProps> = ({ children }) => {
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

export default AddressWrapper; 