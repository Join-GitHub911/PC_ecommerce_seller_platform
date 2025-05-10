import { message } from 'antd';

export const handleOrderError = (error: any, operation: string) => {
  console.error(`订单${operation}失败:`, error);

  if (error.response) {
    switch (error.response.status) {
      case 401:
        message.error('请先登录');
        break;
      case 403:
        message.error('没有权限执行此操作');
        break;
      case 404:
        message.error('订单不存在');
        break;
      case 409:
        message.error('订单状态不允许此操作');
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

export const handleOrderCancelError = (error: any) => {
  console.error('取消订单失败:', error);
  message.error('取消订单失败，请稍后重试');
};

export const handleOrderSearchError = (error: any) => {
  console.error('搜索订单失败:', error);
  message.error('搜索订单失败，请稍后重试');
}; 