import { useLoading } from './useLoading';

export const useAddressLoading = () => {
  const { loadingState, startLoading, stopLoading } = useLoading();

  const startAddressLoading = (message?: string) => {
    startLoading(message || '正在加载地址列表...');
  };

  const startAddressAddLoading = () => {
    startLoading('正在添加新地址...');
  };

  const startAddressEditLoading = () => {
    startLoading('正在修改地址...');
  };

  const startAddressDeleteLoading = () => {
    startLoading('正在删除地址...');
  };

  return {
    loadingState,
    startAddressLoading,
    startAddressAddLoading,
    startAddressEditLoading,
    startAddressDeleteLoading,
    stopLoading,
  };
}; 