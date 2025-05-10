import { message } from 'antd';

export const handleUserProfileError = (error: any, operation: string) => {
  console.error(`用户信息${operation}失败:`, error);

  if (error.response) {
    switch (error.response.status) {
      case 401:
        message.error('请先登录');
        break;
      case 403:
        message.error('没有权限执行此操作');
        break;
      case 409:
        message.error('用户名或邮箱已被使用');
        break;
      case 500:
        message.error('服务器错误，请稍后重试');
        break;
      default:
        message.error(`${operation}失败，请稍后重试`);
    }
  } else if (error.request) {
    message.error('网络错误，请检查网络连接');
  } else {
    message.error(`${operation}失败，请稍后重试`);
  }
};

export const handlePasswordChangeError = (error: any) => {
  console.error('修改密码失败:', error);
  message.error('修改密码失败，请稍后重试');
};

export const handleAvatarUploadError = (error: any) => {
  console.error('上传头像失败:', error);
  message.error('上传头像失败，请稍后重试');
}; 