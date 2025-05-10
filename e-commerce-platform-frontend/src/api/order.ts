import api from './auth';

// 创建订单
export const createOrder = async (orderData: any) => {
  return api.post('/orders', orderData);
};

// 获取用户订单列表
export const getUserOrders = async (params: any = {}) => {
  return api.get('/orders', { params });
};

// 获取订单详情
export const getOrderById = async (orderId: string) => {
  const response = await api.get(`/orders/${orderId}`);
  // 如果是模拟数据，尝试直接使用获取的响应
  if (response && response.data && typeof response.data === 'object') {
    // 如果response.data本身就是符合APIResponse格式，直接返回
    if (response.data.code !== undefined && response.data.message !== undefined) {
      return response.data;
    }
    // 否则正常返回response
  }
  return response;
};

// 取消订单
export const cancelOrder = async (orderId: string, reason: string) => {
  return api.post(`/orders/${orderId}/cancel`, { reason });
};

// 确认收货
export const confirmReceipt = async (orderId: string) => {
  return api.post(`/orders/${orderId}/receipt`);
};

// 申请退款
export const applyRefund = async (orderId: string, refundData: any) => {
  return api.post(`/orders/${orderId}/refund`, refundData);
};

// 支付订单
export const payOrder = async (orderId: string, paymentMethod: string) => {
  return api.post(`/payments/pay`, {
    orderId,
    method: paymentMethod
  });
};

// 获取订单支付状态
export const getPaymentStatus = async (orderId: string) => {
  return api.get(`/payments/status/${orderId}`);
};

// 模拟支付
export const simulatePayment = async (orderId: string) => {
  return api.post(`/payments/simulate`, { orderId });
};

// 获取用户待支付订单数量
export const getPendingPaymentCount = async () => {
  return api.get('/orders/count/pending-payment');
};

// 获取用户待收货订单数量
export const getPendingReceiptCount = async () => {
  return api.get('/orders/count/pending-receipt');
};

// 获取订单物流信息
export const getOrderTracking = async (orderId: string) => {
  const response = await api.get(`/orders/${orderId}/tracking`);
  // 如果是模拟数据，尝试直接使用获取的响应
  if (response && response.data && typeof response.data === 'object') {
    // 如果response.data本身就是符合APIResponse格式，直接返回
    if (response.data.code !== undefined && response.data.message !== undefined) {
      return response.data;
    }
    // 否则正常返回response
  }
  return response;
}; 