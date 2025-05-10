import { message } from 'antd';

export class ErrorService {
  static handle(error: any, component: string) {
    console.error(`Error in ${component}:`, error);
    
    // 根据错误类型返回用户友好消息
    let errorMessage = '操作失败，请稍后重试';
    
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 401:
          errorMessage = '请先登录';
          break;
        case 403:
          errorMessage = '您没有权限执行此操作';
          break;
        case 404:
          errorMessage = '请求的资源不存在';
          break;
        case 409:
          errorMessage = '操作冲突，请刷新页面后重试';
          break;
        case 500:
          errorMessage = '服务器错误，请稍后再试';
          break;
        default:
          if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          }
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      errorMessage = '网络连接失败，请检查您的网络连接';
    } else if (error.message) {
      // 错误消息
      errorMessage = error.message;
    }
    
    // 显示错误消息
    message.error(errorMessage);
    
    return errorMessage;
  }
  
  static handleCartError(error: any) {
    console.error('Cart error:', error);
    
    let errorMessage = '购物车操作失败，请稍后重试';
    
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 400:
          if (error.response.data && error.response.data.message.includes('stock')) {
            errorMessage = '商品库存不足';
          } else {
            errorMessage = '请求参数错误';
          }
          break;
        case 404:
          errorMessage = '商品不存在或已下架';
          break;
        default:
          errorMessage = this.handle(error, 'Cart');
          return;
      }
    }
    
    message.error(errorMessage);
    return errorMessage;
  }
  
  static handleOrderError(error: any) {
    console.error('Order error:', error);
    
    let errorMessage = '订单操作失败，请稍后重试';
    
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 400:
          if (error.response.data && error.response.data.message.includes('stock')) {
            errorMessage = '部分商品库存不足，请修改订单';
          } else if (error.response.data && error.response.data.message.includes('address')) {
            errorMessage = '请选择有效的收货地址';
          } else {
            errorMessage = '请求参数错误';
          }
          break;
        case 409:
          errorMessage = '订单状态已变更，请刷新后重试';
          break;
        default:
          errorMessage = this.handle(error, 'Order');
          return;
      }
    }
    
    message.error(errorMessage);
    return errorMessage;
  }
  
  static handlePaymentError(error: any) {
    console.error('Payment error:', error);
    
    let errorMessage = '支付失败，请稍后重试';
    
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 400:
          if (error.response.data && error.response.data.message.includes('balance')) {
            errorMessage = '余额不足，请更换支付方式';
          } else {
            errorMessage = '支付信息有误，请检查后重试';
          }
          break;
        case 408:
        case 504:
          errorMessage = '支付超时，请查询订单状态或联系客服';
          break;
        default:
          errorMessage = this.handle(error, 'Payment');
          return;
      }
    }
    
    message.error(errorMessage);
    return errorMessage;
  }
} 