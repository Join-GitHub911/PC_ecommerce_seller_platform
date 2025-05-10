import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { message } from 'antd';
import { ErrorService } from './errorService';

// 配置项接口
interface ApiClientConfig extends AxiosRequestConfig {
  withCredentials?: boolean;
  baseURL?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  tokenRefreshEndpoint?: string;
  getAccessToken?: () => string | null;
  setAccessToken?: (token: string) => void;
  getRefreshToken?: () => string | null;
  onTokenRefreshed?: (accessToken: string, refreshToken?: string) => void;
  onUnauthorized?: () => void;
}

// 定义默认配置
const defaultConfig: ApiClientConfig = {
  baseURL: '/api',
  timeout: 10000,
  withCredentials: true,
  retries: 0,
  retryDelay: 1000,
  getAccessToken: () => localStorage.getItem('accessToken'),
  setAccessToken: (token) => localStorage.setItem('accessToken', token),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  onTokenRefreshed: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  },
  onUnauthorized: () => {
    window.location.href = '/login';
  },
};

// 刷新 token 的 promise，用于防止多个请求同时刷新 token
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// 订阅 token 刷新
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// 执行刷新 token 的回调函数
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// 创建增强型 API 客户端
export const createApiClient = (config: ApiClientConfig = {}) => {
  // 合并默认配置和用户配置
  const mergedConfig = {
    ...defaultConfig,
    ...config,
  };

  // 创建 axios 实例
  const axiosInstance = axios.create({
    baseURL: mergedConfig.baseURL,
    timeout: mergedConfig.timeout,
    withCredentials: mergedConfig.withCredentials,
  });

  // 请求拦截器
  axiosInstance.interceptors.request.use(
    (config) => {
      const accessToken = mergedConfig.getAccessToken?.();
      if (accessToken) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config;
      if (!originalRequest) {
        return Promise.reject(error);
      }

      // 如果是 401 错误，且有 token 刷新逻辑，尝试刷新 token
      if (
        error.response?.status === 401 &&
        mergedConfig.tokenRefreshEndpoint &&
        mergedConfig.getRefreshToken &&
        mergedConfig.onTokenRefreshed &&
        !originalRequest.headers?.['X-Retry']
      ) {
        if (isRefreshing) {
          // 如果已经在刷新了，就将请求推入队列
          return new Promise((resolve) => {
            subscribeTokenRefresh((token) => {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              originalRequest.headers['X-Retry'] = 'true';
              resolve(axiosInstance(originalRequest));
            });
          });
        }

        isRefreshing = true;

        try {
          const refreshToken = mergedConfig.getRefreshToken();
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await axios.post(
            mergedConfig.tokenRefreshEndpoint,
            { refreshToken }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          mergedConfig.onTokenRefreshed(accessToken, newRefreshToken);

          // 通知所有等待的请求
          onTokenRefreshed(accessToken);

          // 重试原始请求
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          originalRequest.headers['X-Retry'] = 'true';
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // 刷新 token 失败，执行未授权回调
          if (mergedConfig.onUnauthorized) {
            mergedConfig.onUnauthorized();
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // 如果启用了重试机制
      const retryCount = originalRequest.headers?.['X-Retry-Count'] as number || 0;
      if (
        mergedConfig.retries &&
        retryCount < mergedConfig.retries &&
        (error.code === 'ECONNABORTED' || error.response?.status === 408 || error.response?.status === 500)
      ) {
        // 指数退避策略
        const delay = (mergedConfig.retryDelay || 1000) * Math.pow(2, retryCount);
        
        return new Promise((resolve) => {
          setTimeout(() => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers['X-Retry-Count'] = retryCount + 1;
            resolve(axiosInstance(originalRequest));
          }, delay);
        });
      }

      // 显示错误信息
      ErrorService.handle(error, 'API');
      
      return Promise.reject(error);
    }
  );

  // 返回增强的 API 客户端
  return {
    instance: axiosInstance,
    
    async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
      try {
        const response = await axiosInstance.get<T>(url, config);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    
    async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
      try {
        const response = await axiosInstance.post<T>(url, data, config);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    
    async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
      try {
        const response = await axiosInstance.put<T>(url, data, config);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    
    async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
      try {
        const response = await axiosInstance.patch<T>(url, data, config);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    
    async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
      try {
        const response = await axiosInstance.delete<T>(url, config);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  };
};

// 创建默认的 API 客户端实例
export const apiClient = createApiClient(); 