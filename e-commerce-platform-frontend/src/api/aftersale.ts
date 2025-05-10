import axios from 'axios';
import api from './auth';
import { API_BASE_URL } from '../config';

// 判断是否使用模拟数据
const USE_MOCK_API = true;

// 获取售后服务列表
export const getAfterSaleList = async (params: any = {}) => {
  try {
    if (USE_MOCK_API) {
      const response = mockRefundList(params);
      return response;
    }
    
    return await api.get('/after-sales', { params });
  } catch (error) {
    console.error('获取售后列表失败', error);
    throw error;
  }
};

// 获取售后服务详情
export const getAfterSaleDetail = async (refundId: string) => {
  try {
    if (USE_MOCK_API) {
      const response = mockRefundDetail(refundId);
      return response;
    }
    
    return await api.get(`/after-sales/${refundId}`);
  } catch (error) {
    console.error('获取售后详情失败', error);
    throw error;
  }
};

// 提交退换货申请
export const applyRefund = async (orderId: string, refundData: any) => {
  try {
    return await api.post(`/orders/${orderId}/refund`, refundData);
  } catch (error) {
    console.error('提交退款申请失败', error);
    throw error;
  }
};

// 取消售后申请
export const cancelRefund = async (refundId: string) => {
  try {
    if (USE_MOCK_API) {
      const response = mockCancelRefund(refundId);
      return response;
    }
    
    return await api.post(`/after-sales/${refundId}/cancel`);
  } catch (error) {
    console.error('取消售后申请失败', error);
    throw error;
  }
};

// 上传售后凭证图片
export const uploadRefundImage = async (file: File) => {
  try {
    // 创建表单数据
    const formData = new FormData();
    formData.append('image', file);
    
    if (USE_MOCK_API) {
      // 模拟上传成功返回
      const mockResponse = {
        code: 200,
        message: 'success',
        data: {
          url: `https://example.com/uploads/${Date.now()}_${file.name}`,
          filename: file.name
        }
      };
      return mockResponse;
    }
    
    return await api.post('/upload/refund-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  } catch (error) {
    console.error('上传售后凭证失败', error);
    throw error;
  }
};

// 获取退款原因列表
export const getRefundReasons = async (type: string = 'refund') => {
  try {
    if (USE_MOCK_API) {
      const response = mockRefundReasons(type);
      return response;
    }
    
    return await api.get(`/config/refund-reasons?type=${type}`);
  } catch (error) {
    console.error('获取退款原因列表失败', error);
    throw error;
  }
};

// 以下为模拟数据函数
// 模拟售后列表数据
function mockRefundList(params: any) {
  const list = [
    {
      id: 'refund_1',
      orderId: 'order_1',
      orderNumber: '202305100001',
      type: 'refund',
      status: 'pending',
      amount: 299.00,
      reason: '商品质量问题',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'refund_2',
      orderId: 'order_2',
      orderNumber: '202305150002',
      type: 'return',
      status: 'approved',
      amount: 99.50,
      reason: '尺寸不合适',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
  
  return {
    code: 200,
    message: 'success',
    data: {
      total: list.length,
      list
    }
  };
}

// 模拟售后详情数据
function mockRefundDetail(refundId: string) {
  const detail = {
    id: refundId,
    orderId: 'order_1',
    orderNumber: '202305100001',
    type: 'refund',
    status: 'pending',
    amount: 299.00,
    reason: '商品质量问题',
    description: '收到的商品有明显划痕，不符合商品描述',
    items: [
      {
        id: 'item_1',
        productId: 'product_1',
        productName: 'iPhone 13',
        productImage: '/src/assets/iphone.png',
        quantity: 1,
        price: 299.00
      }
    ],
    images: [
      'https://example.com/evidence1.jpg',
      'https://example.com/evidence2.jpg'
    ],
    timeline: [
      {
        status: 'created',
        time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        operator: 'user',
        note: '用户创建了退款申请'
      },
      {
        status: 'pending',
        time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        operator: 'system',
        note: '系统已受理，等待商家审核'
      }
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  };
  
  return {
    code: 200,
    message: 'success',
    data: detail
  };
}

// 模拟取消售后申请
function mockCancelRefund(refundId: string) {
  return {
    code: 200,
    message: 'success',
    data: {
      success: true
    }
  };
}

// 模拟退款原因列表
function mockRefundReasons(type: string) {
  // 退款原因
  const refundReasons = [
    '商品质量问题',
    '商品与描述不符',
    '卖家少发/漏发',
    '收到商品损坏',
    '商品价格较贵',
    '不想要了/拍错了',
    '其他原因'
  ];
  
  // 退货原因
  const returnReasons = [
    '商品质量问题',
    '商品与描述不符',
    '尺寸/颜色与预期不符',
    '收到商品损坏',
    '商品性能/效果不好',
    '收到假货',
    '其他原因'
  ];
  
  const reasons = type === 'return' ? returnReasons : refundReasons;
  
  return {
    code: 200,
    message: 'success',
    data: reasons
  };
} 