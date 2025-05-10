import { useLoading } from './useLoading';

export const useSearchResultLoading = () => {
  const { loadingState, startLoading, stopLoading } = useLoading();

  const startSearchLoading = (message?: string) => {
    startLoading(message || '正在搜索商品...');
  };

  const startFilterLoading = () => {
    startLoading('正在应用筛选条件...');
  };

  const startSortLoading = () => {
    startLoading('正在排序商品...');
  };

  const startPaginationLoading = () => {
    startLoading('正在加载更多商品...');
  };

  return {
    loadingState,
    startSearchLoading,
    startFilterLoading,
    startSortLoading,
    startPaginationLoading,
    stopLoading,
  };
}; 