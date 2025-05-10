import { message } from 'antd';

export const handleHelpError = (error: any, operation: string) => {
  console.error(`帮助中心${operation}失败:`, error);

  if (error.response) {
    switch (error.response.status) {
      case 400:
        message.error('请求参数无效');
        break;
      case 401:
        message.error('请先登录');
        break;
      case 403:
        message.error('没有权限访问此内容');
        break;
      case 404:
        message.error('帮助内容不存在');
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

export const handleHelpSearchError = (error: any) => {
  console.error('搜索帮助内容失败:', error);
  message.error('搜索帮助内容失败，请稍后重试');
};

export const handleHelpArticleError = (error: any) => {
  console.error('加载帮助文章失败:', error);
  message.error('加载帮助文章失败，请稍后重试');
}; 