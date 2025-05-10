import { message } from 'antd';

export const handleSearchResultError = (error: any, operation: string) => {
  console.error(`搜索${operation}失败:`, error);

  if (error.response) {
    switch (error.response.status) {
      case 400:
        message.error('搜索参数无效');
        break;
      case 401:
        message.error('请先登录');
        break;
      case 403:
        message.error('没有权限执行此操作');
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

export const handleFilterError = (error: any) => {
  console.error('应用筛选条件失败:', error);
  message.error('应用筛选条件失败，请稍后重试');
};

export const handleSortError = (error: any) => {
  console.error('排序失败:', error);
  message.error('排序失败，请稍后重试');
}; 