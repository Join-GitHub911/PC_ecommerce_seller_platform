import axios from 'axios';
import { API_BASE_URL } from '../config';
import { mockApiHandler } from './mockApi';

// 判断是否使用模拟数据
const USE_MOCK_API = true;

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// 请求拦截器 - 添加认证token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 清除token并重定向到登录页
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 创建一个代理API函数，根据配置决定使用模拟API还是真实API
export const apiRequest = async (method: string, url: string, data?: any) => {
  // 如果使用模拟API
  if (USE_MOCK_API) {
    try {
      console.log(`调用模拟API: ${method} ${url}`, data);
      // 模拟API调用
      const mockResponse = await mockApiHandler(url.replace(API_BASE_URL, ''), method, data);
      console.log(`模拟API响应:`, mockResponse);
      
      // 直接返回mock响应，不再封装
      return mockResponse;
    } catch (error) {
      console.error('模拟API错误:', error);
      throw error;
    }
  }
  
  // 使用真实API
  try {
    let response;
    switch (method.toUpperCase()) {
      case 'GET':
        response = await api.get(url, { params: data });
        break;
      case 'POST':
        response = await api.post(url, data);
        break;
      case 'PUT':
        response = await api.put(url, data);
        break;
      case 'DELETE':
        response = await api.delete(url, { data });
        break;
      default:
        throw new Error(`不支持的请求方法: ${method}`);
    }
    
    // 返回response.data，保持与mockResponse一致的结构
    return response.data;
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
};

export default api; 