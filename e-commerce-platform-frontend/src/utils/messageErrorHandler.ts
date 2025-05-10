import { message } from 'antd';

export const handleMessageError = (error: any, operation: string) => {
  console.error(`消息${operation}失败:`, error);

  if (error.response) {
    switch (error.response.status) {
      case 400:
        message.error('消息操作参数无效');
        break;
      case 401:
        message.error('请先登录');
        break;
      case 403:
        message.error('没有权限执行此操作');
        break;
      case 404:
        message.error('消息不存在或已删除');
        break;
      case 409:
        message.error('消息状态冲突');
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

export const handleMessageReadError = (error: any) => {
  console.error('标记消息已读失败:', error);
  message.error('标记消息已读失败，请稍后重试');
};

export const handleMessageDeleteError = (error: any) => {
  console.error('删除消息失败:', error);
  message.error('删除消息失败，请稍后重试');
}; 