import { message } from 'antd';

export const handleFavoriteError = (error: any, operation: string) => {
  console.error(`收藏${operation}失败:`, error);

  if (error.response) {
    switch (error.response.status) {
      case 400:
        message.error('操作参数无效');
        break;
      case 401:
        message.error('请先登录');
        break;
      case 403:
        message.error('没有权限执行此操作');
        break;
      case 404:
        message.error('商品不存在或已下架');
        break;
      case 409:
        message.error('商品已在收藏列表中');
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

export const handleAddFavoriteError = (error: any) => {
  console.error('添加到收藏失败:', error);
  message.error('添加到收藏失败，请稍后重试');
};

export const handleRemoveFavoriteError = (error: any) => {
  console.error('取消收藏失败:', error);
  message.error('取消收藏失败，请稍后重试');
}; 