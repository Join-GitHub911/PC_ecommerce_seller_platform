import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import PageTransition from './PageTransition';
import { useLoading } from '../hooks/useLoading';

interface UserProfileWrapperProps {
  children: React.ReactNode;
}

const UserProfileWrapper: React.FC<UserProfileWrapperProps> = ({ children }) => {
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

export default UserProfileWrapper; 