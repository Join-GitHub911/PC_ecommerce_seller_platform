import { message } from 'antd';

export const handleCategoryError = (error: any, operation: string) => {
  console.error(`分类${operation}失败:`, error);

  if (error.response) {
    switch (error.response.status) {
      case 400:
        message.error('分类参数无效');
        break;
      case 401:
        message.error('请先登录');
        break;
      case 403:
        message.error('没有权限执行此操作');
        break;
      case 404:
        message.error('分类不存在或已下架');
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

export const handleSubCategoryError = (error: any) => {
  console.error('加载子分类失败:', error);
  message.error('加载子分类失败，请稍后重试');
};

export const handleCategoryProductError = (error: any) => {
  console.error('加载分类商品失败:', error);
  message.error('加载分类商品失败，请稍后重试');
}; 