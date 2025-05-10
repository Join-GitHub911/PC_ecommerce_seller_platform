import { useState, useCallback, useRef } from 'react';

interface LoadingState {
  isLoading: boolean;
  message: string;
  progress?: number;
  loadingId?: string;
}

export function useEnhancedLoading() {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    message: '',
    progress: undefined
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startLoading = useCallback((message: string = '加载中...', options?: { timeout?: number, loadingId?: string }) => {
    setState({ isLoading: true, message, loadingId: options?.loadingId });
    
    // 自动超时处理
    if (options?.timeout) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setState(prev => {
          if (prev.loadingId === options.loadingId) {
            return { ...prev, isLoading: false };
          }
          return prev;
        });
      }, options.timeout);
    }
  }, []);

  const updateProgress = useCallback((progress: number) => {
    setState(prev => ({ ...prev, progress }));
  }, []);

  const endLoading = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setState({ isLoading: false, message: '', progress: undefined });
  }, []);

  return {
    ...state,
    startLoading,
    updateProgress,
    endLoading
  };
} 