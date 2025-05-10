import { API_BASE_URL } from '../config';
import authApi from './auth';

// 产品查询参数接口
export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

// 产品接口
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images: string[];
  category: string;
  tags?: string[];
  rating?: number;
  salesCount?: number;
  isNew?: boolean;
  isHot?: boolean;
  isOnSale?: boolean;
  attributes?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// 产品评论接口
export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
}

// 获取产品列表
export const getProducts = async (params: ProductQueryParams = {}) => {
  const response = await authApi.get('/products', { params });
  return response.data;
};

// 获取产品详情
export const getProductById = async (id: string) => {
  const response = await authApi.get(`/products/${id}`);
  return response.data;
};

// 获取产品评论
export const getProductReviews = async (productId: string, page: number = 1, limit: number = 10) => {
  const response = await authApi.get(`/products/${productId}/reviews`, {
    params: { page, limit }
  });
  return response.data;
};

// 添加产品评论
export const addProductReview = async (productId: string, data: { rating: number; comment: string; images?: string[] }) => {
  const response = await authApi.post(`/products/${productId}/reviews`, data);
  return response.data;
};

// 获取相关产品推荐
export const getRelatedProducts = async (productId: string, limit: number = 4) => {
  const response = await authApi.get(`/products/${productId}/related`, {
    params: { limit }
  });
  return response.data;
};

// 获取热门产品
export const getHotProducts = async (limit: number = 8) => {
  const response = await authApi.get('/products/hot', {
    params: { limit }
  });
  return response.data;
};

// 获取新品上架
export const getNewProducts = async (limit: number = 8) => {
  const response = await authApi.get('/products/new', {
    params: { limit }
  });
  return response.data;
};

// 获取促销产品
export const getPromotionProducts = async (limit: number = 8) => {
  const response = await authApi.get('/products/promotion', {
    params: { limit }
  });
  return response.data;
};

// 获取产品分类
export const getCategories = async () => {
  const response = await authApi.get('/categories');
  return response.data;
};

// 获取推荐商品
export const getRecommendedProducts = async (limit: number = 5) => {
  return authApi.get('/products/recommended', { params: { limit } });
};

// 搜索商品
export const searchProducts = async (keyword: string, params: any = {}) => {
  return authApi.get('/products/search', { 
    params: { 
      keyword,
      ...params
    } 
  });
};

// 添加商品到收藏夹
export const addToFavorites = async (productId: string) => {
  return authApi.post('/user-activity/favorites', { productId });
};

// 从收藏夹移除商品
export const removeFromFavorites = async (productId: string) => {
  return authApi.delete(`/user-activity/favorites/${productId}`);
};

// 获取收藏夹商品
export const getFavorites = async (page: number = 1, limit: number = 10) => {
  return authApi.get('/user-activity/favorites', {
    params: { page, limit }
  });
};

// 商品浏览历史记录
export const recordProductView = async (productId: string) => {
  return authApi.post('/user-activity/browse-history', { productId });
};

// 获取浏览历史
export const getBrowseHistory = async (page: number = 1, limit: number = 10) => {
  return authApi.get('/user-activity/browse-history', {
    params: { page, limit }
  });
};

export default {
  getProducts,
  getProductById,
  getProductReviews,
  addProductReview,
  getRelatedProducts,
  getHotProducts,
  getNewProducts,
  getPromotionProducts,
  getCategories,
  getRecommendedProducts,
  searchProducts,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  recordProductView,
  getBrowseHistory
}; 