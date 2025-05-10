import { useEnhancedLoading } from './useEnhancedLoading';

export function useCartLoading() {
  const loading = useEnhancedLoading();
  
  const startCartLoading = (message: string = '正在加载购物车...') => {
    loading.startLoading(message, { loadingId: 'cart' });
  };
  
  const startAddToCartLoading = (productName?: string) => {
    const message = productName 
      ? `正在将 ${productName} 添加到购物车...` 
      : '正在添加商品到购物车...';
    loading.startLoading(message, { loadingId: 'addToCart', timeout: 8000 });
  };
  
  const startUpdateCartLoading = () => {
    loading.startLoading('正在更新购物车...', { loadingId: 'updateCart' });
  };
  
  const startRemoveFromCartLoading = () => {
    loading.startLoading('正在从购物车中移除商品...', { loadingId: 'removeFromCart' });
  };
  
  const startCheckoutLoading = () => {
    loading.startLoading('正在准备结算...', { loadingId: 'checkout' });
  };
  
  const startStockValidationLoading = () => {
    loading.startLoading('正在验证库存状态...', { loadingId: 'stockValidation' });
  };
  
  const startApplyCouponLoading = () => {
    loading.startLoading('正在应用优惠券...', { loadingId: 'applyCoupon' });
  };
  
  const updateCartProgress = (progress: number) => {
    loading.updateProgress(progress);
  };
  
  return {
    isLoading: loading.isLoading,
    message: loading.message,
    progress: loading.progress,
    startCartLoading,
    startAddToCartLoading,
    startUpdateCartLoading,
    startRemoveFromCartLoading,
    startCheckoutLoading,
    startStockValidationLoading,
    startApplyCouponLoading,
    updateCartProgress,
    endLoading: loading.endLoading
  };
} 