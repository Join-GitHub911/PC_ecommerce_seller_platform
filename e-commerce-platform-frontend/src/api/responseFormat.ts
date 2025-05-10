/**
 * 统一API响应格式规范
 * 
 * 本文件定义了前后端交互的标准响应格式，所有API接口都应遵循此格式
 */

// 标准响应接口
export interface ApiResponse<T = any> {
  /** 状态码：200成功，非200为各种错误码 */
  code: number;
  
  /** 消息：成功或错误的具体描述 */
  message: string;
  
  /** 数据：接口返回的具体数据内容 */
  data?: T;
  
  /** 可选的分页信息 */
  pagination?: {
    total: number;
    current: number;
    pageSize: number;
  };
}

// 登录认证响应数据结构
export interface AuthData {
  /** 认证令牌 */
  token: string;
  
  /** 用户信息 */
  user: {
    id: string;
    username: string;
    email?: string;
    phone?: string;
    role: string;
    avatar?: string;
    lastLoginTime?: string;
    [key: string]: any;
  };
}

// 常见错误码定义
export enum ErrorCodes {
  /** 未认证 */
  UNAUTHORIZED = 401,
  
  /** 权限不足 */
  FORBIDDEN = 403,
  
  /** 请求资源不存在 */
  NOT_FOUND = 404,
  
  /** 用户输入数据验证失败 */
  VALIDATION_ERROR = 422,
  
  /** 服务器内部错误 */
  SERVER_ERROR = 500,
}

/**
 * 响应格式验证工具 - 检查响应是否符合标准格式
 * @param response 需要验证的响应对象
 * @returns 是否符合标准格式
 */
export const isValidResponse = (response: any): boolean => {
  if (!response || typeof response !== 'object') {
    return false;
  }
  
  // 校验必需字段
  if (typeof response.code !== 'number' || typeof response.message !== 'string') {
    return false;
  }
  
  return true;
};

/**
 * 创建标准成功响应
 * @param data 响应数据
 * @param message 成功消息
 * @returns 标准格式的成功响应
 */
export const createSuccessResponse = <T>(data?: T, message = '操作成功'): ApiResponse<T> => {
  return {
    code: 200,
    message,
    data
  };
};

/**
 * 创建标准错误响应
 * @param code 错误码
 * @param message 错误消息
 * @returns 标准格式的错误响应
 */
export const createErrorResponse = (code: number, message: string): ApiResponse => {
  return {
    code,
    message
  };
};

export default {
  isValidResponse,
  createSuccessResponse,
  createErrorResponse,
  ErrorCodes
}; 