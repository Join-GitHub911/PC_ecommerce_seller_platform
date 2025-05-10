// 基础API URL
export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://api.youhongshop.com/api' 
  : 'http://localhost:3000/api';

// 支付相关配置
export const PAYMENT_CONFIG = {
  alipay: {
    returnUrl: import.meta.env.PROD
      ? 'https://youhongshop.com/payment/result'
      : 'http://localhost:5173/payment/result'
  },
  wechat: {
    appId: import.meta.env.VITE_REACT_APP_WECHAT_APP_ID
  }
};

// 分页默认配置
export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: ['10', '20', '50'],
  showSizeChanger: true
};

// 图片CDN前缀
export const IMAGE_PREFIX = import.meta.env.PROD
  ? 'https://cdn.youhongshop.com'
  : '';

// 网站基本信息
export const SITE_INFO = {
  name: '尤洪',
  slogan: '品质购物，美好生活',
  copyright: `© ${new Date().getFullYear()} 尤洪 版权所有`,
  contactEmail: 'support@youhongshop.com',
  contactPhone: '400-123-4567'
}; 