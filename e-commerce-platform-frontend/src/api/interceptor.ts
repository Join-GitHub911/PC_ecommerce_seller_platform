import axios from 'axios';
import { message } from 'antd';
import { mockApiHandler } from './mockApi';

// 设置基础URL
axios.defaults.baseURL = '/';
axios.defaults.timeout = 10000;

// 创建请求拦截器
axios.interceptors.request.use(
  (config) => {
    console.log('API请求:', {
      url: config.url,
      method: config.method,
      data: config.data,
      params: config.params
    });

    // 添加认证Token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 创建响应拦截器
axios.interceptors.response.use(
  (response) => {
    console.log('API响应:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    console.error('响应错误:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    // 如果服务器返回500错误，尝试使用模拟API处理
    if (error.response?.status === 500 && error.config) {
      try {
        console.log('尝试使用模拟API处理请求:', error.config.url);
        
        const url = error.config.url;
        const method = error.config.method?.toUpperCase() || 'GET';
        const data = error.config.data ? JSON.parse(error.config.data) : undefined;
        
        // 调用模拟API处理请求
        const mockResponse = await mockApiHandler(url, method, data);
        
        console.log('模拟API响应:', mockResponse);
        
        // 直接返回模拟API的响应，不再进行额外的包装
        return {
          status: mockResponse.code,
          statusText: mockResponse.code === 200 ? 'OK' : 'Error',
          headers: {},
          config: error.config,
          data: mockResponse
        };
      } catch (mockError) {
        console.error('模拟API处理失败:', mockError);
        // 如果模拟API也失败，继续抛出原始错误
        return Promise.reject(error);
      }
    }
    
    // 处理网络错误或超时错误
    if (!error.response && error.config) {
      try {
        console.log('网络错误或超时，尝试使用模拟API处理请求:', error.config.url);
        
        const url = error.config.url;
        const method = error.config.method?.toUpperCase() || 'GET';
        const data = error.config.data ? JSON.parse(error.config.data) : undefined;
        
        // 调用模拟API处理请求
        const mockResponse = await mockApiHandler(url, method, data);
        
        console.log('模拟API响应:', mockResponse);
        
        return {
          status: mockResponse.code,
          statusText: mockResponse.code === 200 ? 'OK' : 'Error',
          headers: {},
          config: error.config,
          data: mockResponse
        };
      } catch (mockError) {
        console.error('模拟API处理失败:', mockError);
      }
    }
    
    // 处理401未授权错误
    if (error.response?.status === 401) {
      // 清除本地存储的Token
      localStorage.removeItem('token');
      message.error('登录已过期，请重新登录');
      // 可以在这里添加重定向到登录页的逻辑
    }
    
    return Promise.reject(error);
  }
);

export default axios; 