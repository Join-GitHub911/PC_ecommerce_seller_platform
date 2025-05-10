import { useLoading } from './useLoading';

export const useOrderListLoading = () => {
  const { loadingState, startLoading, stopLoading } = useLoading();

  const startOrderListLoading = (message?: string) => {
    startLoading(message || '加载订单列表...');
  };

  const startOrderCancelLoading = () => {
    startLoading('正在取消订单...');
  };

  const startOrderSearchLoading = () => {
    startLoading('正在搜索订单...');
  };

  const startOrderDetailLoading = () => {
    startLoading('正在加载订单详情...');
  };

  return {
    loadingState,
    startOrderListLoading,
    startOrderCancelLoading,
    startOrderSearchLoading,
    startOrderDetailLoading,
    stopLoading,
  };
}; 