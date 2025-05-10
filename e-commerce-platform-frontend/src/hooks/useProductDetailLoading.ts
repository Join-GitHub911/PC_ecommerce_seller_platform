import { useLoading } from './useLoading';

export const useProductDetailLoading = () => {
  const { loadingState, startLoading, stopLoading } = useLoading();

  const startProductLoading = (message?: string) => {
    startLoading(message || '加载商品信息...');
  };

  const startAddToCartLoading = () => {
    startLoading('正在添加到购物车...');
  };

  const startStockCheckLoading = () => {
    startLoading('正在检查库存...');
  };

  const startPriceCalculationLoading = () => {
    startLoading('正在计算价格...');
  };

  return {
    loadingState,
    startProductLoading,
    startAddToCartLoading,
    startStockCheckLoading,
    startPriceCalculationLoading,
    stopLoading,
  };
}; 