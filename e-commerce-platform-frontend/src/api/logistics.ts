import api from './auth';
import axios from 'axios';
import { API_BASE_URL } from '../config';

// 菜鸟物流API的基础URL和认证信息（实际使用时需替换为真实值）
const CAINIAO_API_URL = 'https://link.cainiao.com/gateway/link.do';
const CAINIAO_API_KEY = import.meta.env.VITE_CAINIAO_API_KEY || 'your-cainiao-api-key';
const CAINIAO_API_SECRET = import.meta.env.VITE_CAINIAO_API_SECRET || 'your-cainiao-api-secret';

// 顺丰物流API的基础URL和认证信息（实际使用时需替换为真实值）
const SF_API_URL = 'https://bsp-oisp.sf-express.com/bsp-oisp/sfexpressService';
const SF_CLIENT_ID = import.meta.env.VITE_SF_CLIENT_ID || 'your-sf-client-id';
const SF_CLIENT_SECRET = import.meta.env.VITE_SF_CLIENT_SECRET || 'your-sf-client-secret';

// 获取订单的物流信息（先尝试调用后端接口）
export const getOrderTracking = async (orderId: string) => {
  try {
    const response = await api.get(`/orders/${orderId}/tracking`);
    return response;
  } catch (error) {
    console.error('获取物流信息失败', error);
    throw error;
  }
};

// 直接查询菜鸟物流API
export const queryCainiaoTracking = async (trackingNumber: string, carrier?: string) => {
  try {
    // 构建请求参数
    const params = {
      method: 'cainiao.global.tracking.query',
      timestamp: new Date().toISOString(),
      format: 'json',
      v: '1.0',
      partner_id: CAINIAO_API_KEY,
      sign_method: 'md5',
      logistics_no: trackingNumber,
      carrier_code: carrier || 'SF'
    };

    // 在实际应用中，签名应在后端进行，这里简化处理
    // const sign = generateSignature(params, CAINIAO_API_SECRET);
    // params.sign = sign;

    // 实际应用中，应该通过后端代理发送请求，避免暴露密钥
    // 这里使用模拟响应
    return simulateCainiaoResponse(trackingNumber);
  } catch (error) {
    console.error('查询菜鸟物流信息失败', error);
    throw error;
  }
};

// 直接查询顺丰物流API
export const querySFTracking = async (trackingNumber: string) => {
  try {
    // 构建请求参数
    const requestBody = {
      language: 'zh-CN',
      trackingType: 1,
      trackingNumber: [trackingNumber]
    };

    // 在实际应用中，签名和请求应在后端进行，这里简化处理
    // 这里使用模拟响应
    return simulateSFResponse(trackingNumber);
  } catch (error) {
    console.error('查询顺丰物流信息失败', error);
    throw error;
  }
};

// 通过统一接口查询物流，自动判断使用哪个物流API
export const queryTracking = async (trackingNumber: string, company: string) => {
  try {
    // 判断物流公司，使用对应的API
    const companyLower = company.toLowerCase();
    
    // 如果使用真实环境API，应该调用实际的物流API
    // 这里为了简化，根据公司名称返回不同的模拟数据
    if (companyLower.includes('顺丰') || companyLower === 'sf') {
      return simulateSFResponse(trackingNumber);
    } else {
      return simulateCainiaoResponse(trackingNumber);
    }
  } catch (error) {
    console.error('查询物流信息失败', error);
    throw error;
  }
};

// 以下是模拟响应函数，实际使用时应替换为真实API调用

// 模拟菜鸟物流API响应
const simulateCainiaoResponse = (trackingNumber: string) => {
  // 生成当前时间
  const now = new Date();
  
  // 模拟预计送达时间（当前时间加3天）
  const estimatedDeliveryTime = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
  
  // 生成多个物流事件点
  const events = [
    {
      time: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      location: '广州市',
      content: '快件已到达 【广州转运中心】'
    },
    {
      time: new Date(now.getTime() - 18 * 60 * 60 * 1000).toISOString(),
      location: '广州市',
      content: '快件离开 【广州转运中心】，下一站 【深圳转运中心】'
    },
    {
      time: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      location: '深圳市',
      content: '快件已到达 【深圳转运中心】'
    },
    {
      time: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      location: '深圳市',
      content: '快件离开 【深圳转运中心】，正在发往 【深圳南山区】'
    },
    {
      time: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      location: '深圳市',
      content: '快件已到达 【深圳南山区公司】，准备派送'
    }
  ];

  return {
    code: 200,
    message: 'success',
    data: {
      trackingNumber: trackingNumber,
      trackingCompany: '菜鸟物流',
      status: '运输中',
      estimatedDeliveryTime: estimatedDeliveryTime,
      traces: events.reverse(),  // 最新的事件在最前面
      deliveryAddress: {
        province: '广东省',
        city: '深圳市',
        district: '南山区',
        detail: '科技园南区T3栋'
      },
      sourceAddress: {
        province: '北京市',
        city: '北京市',
        district: '朝阳区',
        detail: '朝阳大街100号'
      }
    }
  };
};

// 模拟顺丰物流API响应
const simulateSFResponse = (trackingNumber: string) => {
  // 生成当前时间
  const now = new Date();
  
  // 模拟预计送达时间（当前时间加2天）
  const estimatedDeliveryTime = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString();
  
  // 生成多个物流事件点
  const events = [
    {
      time: new Date(now.getTime() - 36 * 60 * 60 * 1000).toISOString(),
      location: '上海市',
      content: '快件已交给收件员：张三，正在派送'
    },
    {
      time: new Date(now.getTime() - 30 * 60 * 60 * 1000).toISOString(),
      location: '上海市',
      content: '快件已到达 【上海徐汇集散中心】'
    },
    {
      time: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      location: '上海市',
      content: '快件在 【上海浦东转运中心】完成分拣，准备发往下一站'
    },
    {
      time: new Date(now.getTime() - 18 * 60 * 60 * 1000).toISOString(),
      location: '杭州市',
      content: '快件已到达 【杭州转运中心】'
    },
    {
      time: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      location: '杭州市',
      content: '快件已揽收，正在安排配送'
    }
  ];

  return {
    code: 200,
    message: 'success',
    data: {
      trackingNumber: trackingNumber,
      trackingCompany: '顺丰速运',
      status: '派送中',
      estimatedDeliveryTime: estimatedDeliveryTime,
      traces: events.reverse(),  // 最新的事件在最前面
      deliveryAddress: {
        province: '上海市',
        city: '上海市',
        district: '徐汇区',
        detail: '漕河泾开发区'
      },
      sourceAddress: {
        province: '浙江省',
        city: '杭州市',
        district: '西湖区',
        detail: '西湖科技园'
      },
      courierInfo: {
        name: '张三',
        phone: '13800138000'
      }
    }
  };
}; 