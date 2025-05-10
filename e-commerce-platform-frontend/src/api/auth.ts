import { API_BASE_URL } from '../config';
import { apiRequest } from './index';
import axios from 'axios';
import { message } from 'antd';
import { mockApiHandler } from './mockApi';
import { ApiResponse, AuthData, isValidResponse } from './responseFormat';

interface RegisterData {
  username: string;
  email?: string;
  password: string;
  phone?: string;
  address?: string;
  captcha?: string;
}

interface LoginData {
  username?: string;
  password: string;
  phone?: string;
  email?: string;
  verificationCode?: string;
  captcha?: string;
}

// 使用新定义的接口
interface AuthResponse extends ApiResponse<AuthData> {}

// Token 刷新计时器
let refreshTokenTimer: any = null;

// 用户注册
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await apiRequest('POST', '/auth/register', data);
    
    // 使用通用验证方法
    if (!isValidResponse(response)) {
      throw new Error('注册返回格式错误');
    }
    
    // 确保响应有正确的状态码和数据结构
    if (response.code === 200 && response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('tokenTimestamp', Date.now().toString());
      
      // 设置token刷新
      setupTokenRefresh();
    } else {
      throw new Error(response.message || '注册失败，响应格式不符合预期');
    }
    
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || '注册失败，请稍后重试';
    message.error(errorMessage);
    throw error;
  }
};

// 用户登录
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await apiRequest('POST', '/auth/login', data);
    
    // 使用通用验证方法
    if (!isValidResponse(response)) {
      throw new Error('登录返回格式错误');
    }
    
    // 确保响应有正确的状态码和数据结构
    if (response.code === 200 && response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('tokenTimestamp', Date.now().toString());
      
      // 保存最近登录方式
      if (data.username) {
        localStorage.setItem('lastLoginType', 'account');
      } else if (data.phone) {
        localStorage.setItem('lastLoginType', 'phone');
      } else if (data.email) {
        localStorage.setItem('lastLoginType', 'email');
      }
      
      // 设置token刷新
      setupTokenRefresh();
    } else {
      throw new Error(response.message || '登录失败，响应格式不符合预期');
    }
    
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || '登录失败，请检查用户名和密码';
    message.error(errorMessage);
    throw error;
  }
};

// 发送手机验证码
export const sendPhoneVerificationCode = async (phone: string): Promise<ApiResponse> => {
  try {
    const response = await apiRequest('POST', '/auth/sendSmsCode', { phone });
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || '发送验证码失败，请稍后重试';
    message.error(errorMessage);
    throw error;
  }
};

// 发送邮箱验证码
export const sendEmailVerificationCode = async (email: string): Promise<ApiResponse> => {
  try {
    const response = await apiRequest('POST', '/auth/sendEmailCode', { email });
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || '发送验证码失败，请稍后重试';
    message.error(errorMessage);
    throw error;
  }
};

// 手机验证码登录
export const phoneLogin = async (phone: string, verificationCode: string): Promise<AuthResponse> => {
  try {
    const response = await apiRequest('POST', '/auth/phoneLogin', { phone, verificationCode });
    
    // 使用通用验证方法
    if (!isValidResponse(response)) {
      throw new Error('手机登录返回格式错误');
    }
    
    // 确保响应有正确的状态码和数据结构
    if (response.code === 200 && response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('tokenTimestamp', Date.now().toString());
      localStorage.setItem('lastLoginType', 'phone');
      
      // 设置token刷新
      setupTokenRefresh();
    } else {
      throw new Error(response.message || '手机登录失败，响应格式不符合预期');
    }
    
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || '登录失败，请检查手机号和验证码';
    message.error(errorMessage);
    throw error;
  }
};

// 第三方登录
export const thirdPartyLogin = async (platform: string, code: string): Promise<AuthResponse> => {
  try {
    const response = await apiRequest('POST', `/auth/${platform}Login`, { code });
    
    // 使用通用验证方法
    if (!isValidResponse(response)) {
      throw new Error('第三方登录返回格式错误');
    }
    
    // 确保响应有正确的状态码和数据结构
    if (response.code === 200 && response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('tokenTimestamp', Date.now().toString());
      localStorage.setItem('lastLoginType', platform);
      
      // 设置token刷新
      setupTokenRefresh();
    } else {
      throw new Error(response.message || `${platform}登录失败，响应格式不符合预期`);
    }
    
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || `${platform}登录失败，请稍后重试`;
    message.error(errorMessage);
    throw error;
  }
};

// 用户登出
export const logout = () => {
  // 清除本地存储的认证信息
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('tokenTimestamp');
  
  // 清除token刷新计时器
  if (refreshTokenTimer) {
    clearTimeout(refreshTokenTimer);
    refreshTokenTimer = null;
  }
  
  // 可以选择性地保留记住的用户名和密码
  // localStorage.removeItem('rememberedUsername');
  // localStorage.removeItem('rememberedPassword');
  
  // 清除登录失败计数
  sessionStorage.removeItem('loginFailCount');
  
  // 触发自定义事件，通知其他组件登录状态已改变
  window.dispatchEvent(new Event('login-status-change'));
  
  return true;
};

// 刷新 Token
export const refreshToken = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    const response = await apiRequest('POST', '/auth/refreshToken', { token });
    
    // 使用通用验证方法
    if (!isValidResponse(response)) {
      return false;
    }
    
    if (response.code === 200 && response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('tokenTimestamp', Date.now().toString());
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('刷新token失败:', error);
    return false;
  }
};

// 设置 Token 自动刷新 (假设 token 有效期为 1 小时，提前 5 分钟刷新)
const setupTokenRefresh = () => {
  // 清除之前的计时器
  if (refreshTokenTimer) {
    clearTimeout(refreshTokenTimer);
  }
  
  // 设置新的计时器，55 分钟后刷新 token
  refreshTokenTimer = setTimeout(async () => {
    const success = await refreshToken();
    if (success) {
      // 刷新成功，继续设置下一次刷新
      setupTokenRefresh();
    } else {
      // 刷新失败，可能需要重新登录
      message.warning('您的登录状态已过期，请重新登录');
      logout();
      // 可以选择重定向到登录页面
      window.location.href = '/login';
    }
  }, 55 * 60 * 1000); // 55分钟
};

// 获取当前登录用户信息
export const getCurrentUser = async () => {
  try {
    const response = await apiRequest('GET', '/auth/me');
    
    // 使用通用验证方法
    if (!isValidResponse(response)) {
      throw new Error('获取用户信息响应格式错误');
    }
    
    if (response.code !== 200) {
      throw new Error(response.message || '获取用户信息失败');
    }
    
    return response;
  } catch (error: any) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
};

// 检查用户是否已登录
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

// 获取当前用户数据
export const getUserData = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// 修改用户信息
export const updateUserProfile = async (userData: any) => {
  try {
    const response = await apiRequest('PUT', '/users/profile', userData);
    
    // 使用通用验证方法
    if (!isValidResponse(response)) {
      throw new Error('更新用户信息响应格式错误');
    }
    
    // 更新本地存储的用户信息
    if (response.code === 200) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const updatedUser = { ...user, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } else {
      throw new Error(response.message || '更新用户信息失败');
    }
    
    return response;
  } catch (error: any) {
    console.error('更新用户信息失败:', error);
    throw error;
  }
};

// 修改密码
export const changePassword = async (passwordData: any) => {
  try {
    return await apiRequest('POST', '/users/change-password', passwordData);
  } catch (error) {
    console.error('修改密码失败:', error);
    throw error;
  }
};

// 找回密码
export const forgotPassword = async (data: { email?: string, phone?: string }) => {
  try {
    return await apiRequest('POST', '/auth/forgot-password', data);
  } catch (error) {
    console.error('找回密码请求失败:', error);
    throw error;
  }
};

// 重置密码
export const resetPassword = async (data: { token: string, password: string }) => {
  try {
    return await apiRequest('POST', '/auth/reset-password', data);
  } catch (error) {
    console.error('重置密码失败:', error);
    throw error;
  }
};

// 检查用户是否已登录的简化方法
export const isUserLoggedIn = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// 检查token是否快过期 (假设 token 有效期为 1 小时)
export const isTokenExpiringSoon = () => {
  const tokenTimestamp = localStorage.getItem('tokenTimestamp');
  if (!tokenTimestamp) return true;
  
  const timePassed = Date.now() - parseInt(tokenTimestamp);
  // 如果距离上次更新token已经超过50分钟，就认为即将过期
  return timePassed > 50 * 60 * 1000;
};

// 初始化认证状态 - 应用启动时调用
export const initAuth = () => {
  // 检查是否已登录
  if (isUserLoggedIn()) {
    // 检查token是否即将过期
    if (isTokenExpiringSoon()) {
      // 刷新token
      refreshToken()
        .then(success => {
          if (success) {
            setupTokenRefresh();
          } else {
            // token刷新失败，清除登录状态
            logout();
          }
        })
        .catch(() => {
          // 发生错误，清除登录状态
          logout();
        });
    } else {
      // token还有较长有效期，设置正常的刷新计划
      setupTokenRefresh();
    }
  }
};

// 创建API函数的代理对象，将所有方法转发给apiRequest
const authApi = {
  get: (url: string, config?: any) => apiRequest('GET', url, config?.params),
  post: (url: string, data?: any) => apiRequest('POST', url, data),
  put: (url: string, data?: any) => apiRequest('PUT', url, data),
  delete: (url: string, config?: any) => apiRequest('DELETE', url, config?.data),
};

export default authApi; 