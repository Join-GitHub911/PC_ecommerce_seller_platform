import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import PageTransition from './PageTransition';
import { useLoading } from '../hooks/useLoading';

interface SearchResultWrapperProps {
  children: React.ReactNode;
}

const SearchResultWrapper: React.FC<SearchResultWrapperProps> = ({ children }) => {
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

export default SearchResultWrapper; 