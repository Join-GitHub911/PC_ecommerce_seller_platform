import { useLoading } from './useLoading';

export const useCouponLoading = () => {
  const { loadingState, startLoading, stopLoading } = useLoading();

  const startCouponLoading = (message?: string) => {
    startLoading(message || '正在加载优惠券...');
  };

  const startCouponReceiveLoading = () => {
    startLoading('正在领取优惠券...');
  };

  const startCouponListLoading = () => {
    startLoading('正在加载优惠券列表...');
  };

  const startCouponValidationLoading = () => {
    startLoading('正在验证优惠券...');
  };

  return {
    loadingState,
    startCouponLoading,
    startCouponReceiveLoading,
    startCouponListLoading,
    startCouponValidationLoading,
    stopLoading,
  };
}; 