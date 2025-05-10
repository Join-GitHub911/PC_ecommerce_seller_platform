import axios from 'axios';
import { API_BASE_URL } from '../config';

// 导入mockProducts以支持本地搜索
import { mockApiHandler } from './mockApi';

/**
 * 获取搜索建议
 * @param query 搜索关键词
 * @param limit 结果数量限制
 * @param categories 搜索类别
 * @param pageKey 页面标识
 * @param additionalParams 额外参数
 * @returns 
 */
export const getSearchSuggestions = async (
  query: string,
  limit: number = 10,
  categories: string[] = [],
  pageKey: string = 'default',
  additionalParams: Record<string, any> = {}
) => {
  try {
    const params = {
      query,
      limit,
      categories: categories.join(','),
      pageKey,
      ...additionalParams
    };
    
    const response = await axios.get(`${API_BASE_URL}/search/suggestions`, { params });
    return response.data;
  } catch (error) {
    console.error('获取搜索建议失败:', error);
    // 当API调用失败时，返回本地模拟数据
    return mockSearchSuggestions(query, limit, categories, additionalParams);
  }
};

/**
 * 获取热门搜索词
 * @param pageKey 页面标识
 * @returns 热门搜索词列表
 */
export const getHotKeywords = async (pageKey: string = 'default') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search/hot-keywords`, {
      params: { pageKey }
    });
    return response.data;
  } catch (error) {
    console.error('获取热门搜索词失败:', error);
    // 返回默认热门搜索词
    return getDefaultHotKeywords(pageKey);
  }
};

/**
 * 搜索商品
 * @param query 搜索关键词
 * @param page 页码
 * @param limit 每页数量
 * @param filters 筛选条件
 * @param sort 排序条件
 * @param pageKey 页面标识
 * @returns 搜索结果
 */
export const searchProducts = async (
  query: string,
  page: number = 1,
  limit: number = 20,
  filters: Record<string, any> = {},
  sort: Record<string, 'ASC' | 'DESC'> = {},
  pageKey: string = 'default'
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/search/search`, {
      query,
      page,
      limit,
      filters,
      sort,
      pageKey
    });
    return response.data;
  } catch (error) {
    console.error('搜索商品失败:', error);
    throw error;
  }
};

// 模拟搜索建议数据，基于已有的商品
const mockSearchSuggestions = async (
  query: string, 
  limit: number = 10,
  categories: string[] = [],
  additionalParams?: Record<string, any>
) => {
  if (!query) return [];
  
  // 检查是否是订单搜索范围限制
  if (additionalParams?.searchScope === 'orders_only') {
    // 仅返回订单相关结果
    return mockOrderSearchSuggestions(query);
  }
  
  try {
    // 从mock API获取所有产品
    const mockResponse = await mockApiHandler('/products', 'GET');
    const allProducts = mockResponse.data?.records || [];
    
    // 根据查询词过滤产品
    const filteredProducts = allProducts
      .filter((product: any) => {
        const nameMatch = product.name.toLowerCase().includes(query.toLowerCase());
        const brandMatch = product.brand?.toLowerCase().includes(query.toLowerCase());
        const categoryMatch = product.categoryName?.toLowerCase().includes(query.toLowerCase());
        return nameMatch || brandMatch || categoryMatch;
      })
      .slice(0, limit);
    
    // 转换为搜索建议格式
    const suggestions = filteredProducts.map((product: any) => {
      let category = '商品';
      if (product.categoryName) {
        category = product.categoryName;
      } else if (categories.length > 0) {
        category = categories[0];
      }
      
      return {
        id: product.id,
        value: product.name,
        category: category,
        price: product.price,
        image: product.mainImage,
        productId: product.id.replace('p', '')
      };
    });
    
    // 如果没有匹配的商品结果，添加一些通用建议
    if (suggestions.length === 0 && query.trim() !== '') {
      suggestions.push(
        { id: 'general1', value: `搜索"${query}"`, category: '搜索建议' },
        { id: 'general2', value: `查找与"${query}"相关的商品`, category: '搜索建议' }
      );
    }
    
    return suggestions;
  } catch (error) {
    console.error('处理本地搜索建议失败:', error);
    return fallbackSuggestions(query);
  }
};

// 订单搜索专用的模拟数据
const mockOrderSearchSuggestions = (query: string) => {
  if (!query) return [];
  
  const suggestions = [];
  
  // 模拟订单编号搜索
  if (/^\d/.test(query)) {  // 以数字开头的情况，可能是订单号搜索
    suggestions.push(
      { id: '101', value: `订单 #${query}`, category: '订单', orderNumber: query.padEnd(8, 'x').substring(0, 8) },
      { id: '102', value: `含"${query}"的订单`, category: '订单' }
    );
  }
  
  // 模拟订单状态搜索
  if (query.includes('待支付') || query.includes('未支付')) {
    suggestions.push({ id: '201', value: '待支付订单', category: '订单', status: 'pending_payment' });
  } else if (query.includes('已支付') || query.includes('支付成功')) {
    suggestions.push({ id: '202', value: '已支付订单', category: '订单', status: 'paid' });
  } else if (query.includes('发货') || query.includes('物流')) {
    suggestions.push({ id: '203', value: '已发货订单', category: '订单', status: 'shipping' });
  } else if (query.includes('送达') || query.includes('收货')) {
    suggestions.push({ id: '204', value: '已送达订单', category: '订单', status: 'delivered' });
  } else if (query.includes('完成')) {
    suggestions.push({ id: '205', value: '已完成订单', category: '订单', status: 'completed' });
  } else if (query.includes('取消')) {
    suggestions.push({ id: '206', value: '已取消订单', category: '订单', status: 'cancelled' });
  } else if (query.includes('退款')) {
    suggestions.push({ id: '207', value: '退款中订单', category: '订单', status: 'refunding' });
    suggestions.push({ id: '208', value: '已退款订单', category: '订单', status: 'refunded' });
  }
  
  // 模拟商品名称搜索，但只搜索已购买的商品
  if (!(/^\d/.test(query)) && !suggestions.length) {
    suggestions.push(
      { id: '301', value: `订单中包含"${query}"的商品`, category: '订单' },
      { id: '302', value: `${query}相关订单`, category: '订单' }
    );
  }
  
  return suggestions;
};

// 备用搜索建议，当其他方法都失败时使用
const fallbackSuggestions = (query: string) => {
  if (!query.trim()) return [];
  
  const suggestions = [];
  
  if (query.includes('手机')) {
    suggestions.push(
      { id: '1', value: '智能手机', category: '商品' },
      { id: '2', value: '手机配件', category: '商品' }
    );
  } else if (query.includes('电脑')) {
    suggestions.push(
      { id: '5', value: '笔记本电脑', category: '商品' },
      { id: '6', value: '台式电脑', category: '商品' }
    );
  } else if (query.trim() !== '') {
    suggestions.push(
      { id: '17', value: `${query}相关商品`, category: '商品' },
      { id: '18', value: `${query}热卖`, category: '商品' }
    );
  }
  
  return suggestions;
};

// 获取默认热门搜索词
const getDefaultHotKeywords = (pageKey: string) => {
  const commonKeywords = ['智能手机', '笔记本电脑', '零食', '化妆品'];
  
  if (pageKey === 'home_page') {
    return [
      '智能手机', '笔记本电脑', '品利特级初榨橄榄油', '德亚酸奶', 
      '倩碧黄油', '凡茜眼霜', '面膜', '时尚女装'
    ];
  } else if (pageKey === 'product_list') {
    return [
      '手机', '电脑', '女装', '男装', '运动鞋', 
      '面膜', '食品', '零食', '家具', '电器'
    ];
  } else if (pageKey === 'order_list') {
    return ['待支付订单', '已发货', '待收货', '已完成', '退款中'];
  }
  
  return commonKeywords;
};