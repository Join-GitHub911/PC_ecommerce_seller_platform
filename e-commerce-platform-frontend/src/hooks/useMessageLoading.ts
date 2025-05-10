import { useLoading } from './useLoading';

export const useMessageLoading = () => {
  const { loadingState, startLoading, stopLoading } = useLoading();

  const startMessageLoading = (message?: string) => {
    startLoading(message || '正在加载消息...');
  };

  const startMessageReadLoading = () => {
    startLoading('正在标记消息已读...');
  };

  const startMessageDeleteLoading = () => {
    startLoading('正在删除消息...');
  };

  const startMessageListLoading = () => {
    startLoading('正在加载消息列表...');
  };

  return {
    loadingState,
    startMessageLoading,
    startMessageReadLoading,
    startMessageDeleteLoading,
    startMessageListLoading,
    stopLoading,
  };
}; 