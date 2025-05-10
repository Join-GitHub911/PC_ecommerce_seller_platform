import { useState, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export const useLoading = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    message: '',
  });

  const startLoading = useCallback((message?: string) => {
    setLoadingState({
      isLoading: true,
      message,
    });
  }, []);

  const stopLoading = useCallback(() => {
    setLoadingState({
      isLoading: false,
      message: '',
    });
  }, []);

  return {
    loadingState,
    startLoading,
    stopLoading,
  };
}; 