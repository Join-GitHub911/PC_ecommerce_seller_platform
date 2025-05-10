import { useLoading } from './useLoading';

export const useFavoriteLoading = () => {
  const { loadingState, startLoading, stopLoading } = useLoading();

  const startFavoriteLoading = (message?: string) => {
    startLoading(message || '正在加载收藏列表...');
  };

  const startAddFavoriteLoading = () => {
    startLoading('正在添加到收藏...');
  };

  const startRemoveFavoriteLoading = () => {
    startLoading('正在取消收藏...');
  };

  const startFavoriteListLoading = () => {
    startLoading('正在加载收藏商品...');
  };

  return {
    loadingState,
    startFavoriteLoading,
    startAddFavoriteLoading,
    startRemoveFavoriteLoading,
    startFavoriteListLoading,
    stopLoading,
  };
}; 