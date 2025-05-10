import { useLoading } from './useLoading';

export const useUserProfileLoading = () => {
  const { loadingState, startLoading, stopLoading } = useLoading();

  const startProfileLoading = (message?: string) => {
    startLoading(message || '加载用户信息...');
  };

  const startProfileUpdateLoading = () => {
    startLoading('正在更新个人信息...');
  };

  const startPasswordChangeLoading = () => {
    startLoading('正在修改密码...');
  };

  const startAvatarUploadLoading = () => {
    startLoading('正在上传头像...');
  };

  return {
    loadingState,
    startProfileLoading,
    startProfileUpdateLoading,
    startPasswordChangeLoading,
    startAvatarUploadLoading,
    stopLoading,
  };
}; 