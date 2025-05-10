import axios from './interceptor';
import { message } from 'antd';
import api from './auth';
import { CART_COUNT_UPDATE_EVENT } from '../components/Header';
// 导入模拟数据
import { mockCartItems, getRecommendedProductsData } from './mock/cartData';
// 导入模拟API处理函数
import { mockApiHandler, getMockCartItems, setMockCartItems } from './mockApi';

// 购物车商品类型定义
export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  specifications?: Record<string, string>;
  stock: number;
  selected?: boolean;
  shopId?: string;
  shopName?: string;
  isGift?: boolean;
  status: 'normal' | 'soldout' | 'removed' | 'limited'; // 商品状态：正常、售罄、已下架、库存紧张
  promotion?: {
    type: 'discount' | 'reduction' | 'gift'; // 促销类型：折扣、满减、赠品
    description: string; // 促销描述
    value: number; // 促销值（折扣比例或满减金额）
  };
  minBuy?: number; // 最少购买数量限制
  maxBuy?: number; // 最多购买数量限制
}

// 商品规格类型定义
export interface ProductSpecification {
  specType: string;
  options: string[];
}

// 获取购物车
export const getCart = async () => {
  try {
    // 使用模拟数据而不是发送API请求
    console.log('使用模拟购物车数据');
    const latestMockCartItems = getMockCartItems();
    return { data: { items: latestMockCartItems } };
    
    /* 原API请求代码
    const response = await axios.get('/api/cart');
    
    // 检查响应格式
    if (!response.data) {
      throw new Error('购物车数据为空');
    }
    
    // 统一处理响应格式
    if (response.data.success === false) {
      throw new Error(response.data.message || '获取购物车失败');
    }
    
    // 如果使用了统一的响应格式，则返回data字段的内容
    const cartData = response.data.data || response.data;
    return { data: cartData };
    */
  } catch (error) {
    console.error('获取购物车失败:', error);
    message.error('获取购物车失败，请稍后重试');
    throw error;
  }
};

// 添加商品到购物车
export const addToCart = async (
  productId: string | number, 
  quantity: number = 1, 
  specifications: Record<string, string> = {}, 
  productInfo?: {
    name?: string;
    price?: number;
    image?: string;
  }
) => {
  try {
    // 确保productId是数字
    const numericProductId = typeof productId === 'string' ? parseInt(productId, 10) : productId;
    
    if (isNaN(numericProductId)) {
      throw new Error('无效的商品ID');
    }
    
    const requestData = {
      productId: numericProductId, // 确保是数字类型
      quantity: Math.max(1, quantity), // 确保数量至少为1
      specifications,
      productInfo
    };
    
    console.log('添加到购物车请求数据:', JSON.stringify(requestData, null, 2));
    
    try {
      // 尝试添加请求头以排除格式问题
      const response = await axios.post('/api/cart/add', requestData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 5000, // 5秒超时
        validateStatus: (status) => status < 500 // 排除服务器错误
      });
      
      console.log('添加到购物车响应数据:', JSON.stringify(response.data, null, 2));
      
      // 检查响应格式
      if (response.status === 200 && response.data) {
        // 统一处理响应格式
        if (response.data.success === false) {
          throw new Error(response.data.message || '添加到购物车失败');
        }
        
        // 如果使用了统一的响应格式，则返回data字段的内容
        return { data: response.data.data || response.data, source: 'server' };
      } else {
        throw new Error('服务器响应异常: ' + response.status);
      }
    } catch (error) {
      // 请求失败，尝试添加到本地购物车
      console.warn('服务器请求失败，正在回退到本地购物车:', error);
      
      // 检查是否有必要的商品信息用于本地购物车
      if (!productInfo || !productInfo.name || productInfo.price === undefined || !productInfo.image) {
        console.error('缺少必要的商品信息，无法添加到本地购物车');
        throw new Error('添加到购物车失败: 缺少必要的商品信息');
      }
      
      // 生成本地购物车项
      const cartItem: CartItem = {
        id: `local_${Date.now()}_${numericProductId}`,
        productId: numericProductId.toString(),
        productName: productInfo.name,
        productImage: productInfo.image,
        price: productInfo.price,
        quantity: quantity,
        specifications: specifications,
        stock: 999, // 默认库存充足
        status: 'normal',
        selected: true, // 默认选中
      };
      
      // 获取当前本地购物车
      const localCart = getLocalCart();
      
      // 检查是否已存在相同商品（相同ID和规格）
      const existingItemIndex = localCart.findIndex(item => 
        item.productId === cartItem.productId && 
        JSON.stringify(item.specifications) === JSON.stringify(cartItem.specifications)
      );
      
      if (existingItemIndex >= 0) {
        // 更新已有商品数量
        localCart[existingItemIndex].quantity += quantity;
        console.log(`更新本地购物车中商品数量，ID: ${cartItem.productId}，新数量: ${localCart[existingItemIndex].quantity}`);
      } else {
        // 添加新商品
        localCart.push(cartItem);
        console.log(`添加新商品到本地购物车，ID: ${cartItem.productId}，数量: ${quantity}`);
      }
      
      // 保存到本地存储
      saveLocalCart(localCart);
      
      // 显示提示
      message.success('已添加到本地购物车');
      
      // 更新全局购物车数量
      window.dispatchEvent(new CustomEvent(CART_COUNT_UPDATE_EVENT));
      
      return { data: cartItem, source: 'local' };
    }
  } catch (error) {
    console.error('添加到购物车最终失败:', error);
    message.error('添加到购物车失败，请稍后重试');
    
    // 返回错误结果
    return { 
      data: null, 
      source: 'error',
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
};

// 更新购物车商品数量
export const updateCartItem = async (itemId: string, quantity: number) => {
  try {
    const requestData = { quantity };
    console.log('更新购物车商品数量请求数据:', { itemId, ...requestData });
    
    const response = await axios.put(`/api/cart/items/${itemId}`, requestData);
    if (!response.data) {
      throw new Error('更新购物车商品失败：响应数据为空');
    }
    return response;
  } catch (error) {
    console.error('更新购物车商品失败:', error);
    message.error('更新购物车商品失败，请稍后重试');
    throw error;
  }
};

// 更新购物车商品规格
export const updateCartItemSpec = async (itemId: string, specifications: Record<string, string>) => {
  try {
    const requestData = { specifications };
    console.log('更新购物车商品规格请求数据:', { itemId, ...requestData });
    
    const response = await axios.put(`/api/cart/items/${itemId}/specifications`, requestData);
    if (!response.data) {
      throw new Error('更新购物车商品规格失败：响应数据为空');
    }
    return response;
  } catch (error) {
    console.error('更新购物车商品规格失败:', error);
    message.error('更新购物车商品规格失败，请稍后重试');
    throw error;
  }
};

// 批量更新购物车商品选中状态
export const updateCartItemsSelection = async (itemIds: string[], selected: boolean) => {
  try {
    const requestData = { itemIds, selected };
    console.log('批量更新购物车商品选中状态请求数据:', requestData);
    
    const response = await axios.put('/api/cart/items/selection', requestData);
    if (!response.data) {
      throw new Error('更新购物车商品选中状态失败：响应数据为空');
    }
    return response;
  } catch (error) {
    console.error('更新购物车商品选中状态失败:', error);
    message.error('更新购物车商品选中状态失败，请稍后重试');
    throw error;
  }
};

// 删除购物车商品
export const removeCartItem = async (itemId: string) => {
  try {
    // 先尝试调用真实API
    try {
      const response = await axios.delete(`/api/cart/items/${itemId}`);
      if (response.data) {
        // 更新全局缓存中的购物车数据
        const currentMockCart = getMockCartItems();
        const updatedMockCart = currentMockCart.filter(item => item.id !== itemId);
        setMockCartItems(updatedMockCart);
        
        return response;
      }
    } catch (apiError) {
      console.error('API删除购物车商品失败，转为使用模拟数据:', apiError);
      
      // 更新全局缓存中的购物车数据
      const currentMockCart = getMockCartItems();
      const updatedMockCart = currentMockCart.filter(item => item.id !== itemId);
      setMockCartItems(updatedMockCart);
      
      // API请求失败，使用模拟数据
      const mockResponse = {
        data: {
          success: true,
          message: '商品已从购物车中移除',
          data: {
            itemId: itemId,
            removed: true
          }
        }
      };
      
      return mockResponse;
    }
    
    throw new Error('删除购物车商品失败：响应数据为空');
  } catch (error) {
    console.error('删除购物车商品失败:', error);
    message.error('删除购物车商品失败，请稍后重试');
    throw error;
  }
};

// 批量删除购物车商品
export const batchRemoveCartItems = async (itemIds: string[]) => {
  try {
    // 先尝试调用真实API
    try {
      const response = await axios.delete('/api/cart/items', {
        data: { itemIds }
      });
      if (response.data) {
        // 更新全局缓存中的购物车数据
        const currentMockCart = getMockCartItems();
        const updatedMockCart = currentMockCart.filter(item => !itemIds.includes(item.id));
        setMockCartItems(updatedMockCart);
        
        return response;
      }
    } catch (apiError) {
      console.error('API批量删除购物车商品失败，转为使用模拟数据:', apiError);
      
      // 更新全局缓存中的购物车数据
      const currentMockCart = getMockCartItems();
      const updatedMockCart = currentMockCart.filter(item => !itemIds.includes(item.id));
      setMockCartItems(updatedMockCart);
      
      // API请求失败，使用模拟数据
      const mockResponse = {
        data: {
          success: true,
          message: '商品已批量从购物车中移除',
          data: {
            itemIds: itemIds,
            removed: true
          }
        }
      };
      
      return mockResponse;
    }
    
    throw new Error('批量删除购物车商品失败：响应数据为空');
  } catch (error) {
    console.error('批量删除购物车商品失败:', error);
    message.error('批量删除购物车商品失败，请稍后重试');
    throw error;
  }
};

// 清空购物车
export const clearCart = async () => {
  try {
    // 先尝试调用真实API
    try {
      const response = await axios.delete('/api/cart');
      if (response.data) {
        // 清空全局缓存中的购物车数据
        setMockCartItems([]);
        
        return response;
      }
    } catch (apiError) {
      console.error('API清空购物车失败，转为使用模拟数据:', apiError);
      
      // 清空全局缓存中的购物车数据
      setMockCartItems([]);
      
      // API请求失败，使用模拟数据
      const mockResponse = {
        data: {
          success: true,
          message: '购物车已清空',
          data: {
            cleared: true
          }
        }
      };
      
      return mockResponse;
    }
    
    throw new Error('清空购物车失败：响应数据为空');
  } catch (error) {
    console.error('清空购物车失败:', error);
    message.error('清空购物车失败，请稍后重试');
    throw error;
  }
};

// 校验购物车商品库存
export const validateCartItemStock = async (items: { itemId: string, quantity: number }[]) => {
  try {
    console.log('校验购物车商品库存:', items);
    
    // 先尝试调用真实API
    try {
      const response = await axios.post('/api/cart/validate-stock', { items });
      if (response.data) {
        return response;
      }
    } catch (apiError) {
      console.error('API校验购物车商品库存失败，转为使用模拟数据:', apiError);
      
      // API请求失败，使用模拟数据
      // 所有商品默认库存充足
      const validationResults = items.map(({ itemId, quantity }) => ({
        itemId,
        valid: true,
        quantity,
        stock: 999,
        message: '库存充足'
      }));
      
      const mockResponse = {
        data: {
          success: true,
          valid: true,
          items: validationResults
        }
      };
      
      return mockResponse;
    }
    
    throw new Error('校验购物车商品库存失败：响应数据为空');
  } catch (error) {
    console.error('校验购物车商品库存失败:', error);
    
    // 不显示错误消息，静默处理
    // message.error('校验购物车商品库存失败，请稍后重试');
    
    // 返回默认的验证结果，所有商品都视为库存充足
    const validationResults = items.map(({ itemId, quantity }) => ({
      itemId,
      valid: true,
      quantity,
      stock: 999,
      message: '库存充足(默认)'
    }));
    
    return {
      data: {
        success: true,
        valid: true,
        items: validationResults
      }
    };
  }
};

// 获取商品可用规格
export const getProductSpecifications = async (productId: string) => {
  try {
    console.log('获取商品规格，商品ID:', productId);
    
    // 先尝试调用真实API
    try {
      const response = await axios.get(`/api/products/${productId}/specifications`);
      if (response.data) {
        return response;
      }
    } catch (apiError) {
      console.error('API获取商品规格失败，转为使用模拟数据:', apiError);
      
      // API请求失败，使用模拟数据
      const mockResponse = {
        data: {
          success: true,
          specifications: {
            颜色: ['红色', '蓝色', '黑色', '白色'],
            尺寸: ['S', 'M', 'L', 'XL'],
            型号: ['标准版', '豪华版', '至尊版']
          }
        }
      };
      
      return mockResponse;
    }
    
    throw new Error('获取商品规格失败：响应数据为空');
  } catch (error) {
    console.error('获取商品规格失败:', error);
    // 不显示错误提示，使用静默处理
    // message.error('获取商品规格失败，请稍后重试');
    
    // 返回默认规格数据
    return {
      data: {
        success: true,
        specifications: {}
      }
    };
  }
};

// 购物车结算
export const checkout = async (addressId: string, couponCodes: string[] = []) => {
  try {
    const requestData = { addressId, couponCodes };
    console.log('结算请求数据:', requestData);
    
    const response = await axios.post('/api/cart/checkout', requestData);
    if (!response.data) {
      throw new Error('结算失败：响应数据为空');
    }
    return response;
  } catch (error) {
    console.error('结算失败:', error);
    message.error('结算失败，请稍后重试');
    throw error;
  }
};

// 获取购物车商品数量
export const getCartCount = async () => {
  try {
    console.log('获取购物车商品数量');
    
    // 先尝试调用真实API
    try {
      const response = await axios.get('/api/cart/count');
      if (response.data) {
        return response.data.data.count;
      }
    } catch (apiError) {
      console.error('API获取购物车数量失败，转为使用模拟数据:', apiError);
      
      // API请求失败，使用模拟数据计算数量
      try {
        // 使用模拟API处理请求
        const mockResponse = await mockApiHandler('/api/cart/count', 'GET');
        
        if (mockResponse && mockResponse.data && mockResponse.data.count !== undefined) {
          console.log('使用模拟API获取购物车数量成功:', mockResponse.data.count);
          return mockResponse.data.count;
        }
      } catch (mockError) {
        console.error('模拟API处理失败:', mockError);
      }
      
      // 如果模拟API也失败了，那么使用本地购物车
      console.log('API请求失败，回退到本地购物车:', apiError);
      const localCartItems = getLocalCart();
      const count = localCartItems.reduce((sum, item) => sum + item.quantity, 0);
      console.log('本地购物车商品数量:', count);
      return count;
    }
    
    console.warn('获取购物车数量失败：响应数据为空');
    return 0;
  } catch (error) {
    console.error('获取购物车数量失败:', error);
    
    // 尝试从本地存储获取购物车数据
    try {
      console.log('尝试从本地存储获取购物车数据');
      const localCartItems = getLocalCart();
      const count = localCartItems.reduce((sum, item) => sum + item.quantity, 0);
      console.log('获取本地购物车成功:', localCartItems);
      return count;
    } catch (localError) {
      console.error('获取本地购物车失败:', localError);
      return 0;
    }
  }
};

// 将商品移入收藏夹
export const moveToWishlist = async (itemId: string) => {
  try {
    const response = await axios.post(`/api/wishlist/add-from-cart/${itemId}`);
    if (!response.data) {
      throw new Error('移入收藏夹失败：响应数据为空');
    }
    return response;
  } catch (error) {
    console.error('移入收藏夹失败:', error);
    message.error('移入收藏夹失败，请稍后重试');
    throw error;
  }
};

// 批量将商品移入收藏夹
export const batchMoveToWishlist = async (itemIds: string[]) => {
  try {
    const response = await axios.post('/api/wishlist/batch-add-from-cart', { itemIds });
    if (!response.data) {
      throw new Error('批量移入收藏夹失败：响应数据为空');
    }
    return response;
  } catch (error) {
    console.error('批量移入收藏夹失败:', error);
    message.error('批量移入收藏夹失败，请稍后重试');
    throw error;
  }
};

// 本地购物车操作
// 保存购物车到本地
export const saveLocalCart = (items: CartItem[]) => {
  try {
    localStorage.setItem('localCart', JSON.stringify(items));
    
    // 同时更新本地存储的购物车数量
    const totalCount = calculateLocalCartCount(items);
    localStorage.setItem('cartCount', totalCount.toString());
    
    // 触发自定义事件，通知其他组件更新
    window.dispatchEvent(new Event(CART_COUNT_UPDATE_EVENT));
    
    console.log('保存本地购物车成功:', items);
  } catch (error) {
    console.error('保存本地购物车失败:', error);
    message.error('保存本地购物车失败');
  }
};

// 获取本地购物车
export const getLocalCart = (): CartItem[] => {
  try {
    const cartData = localStorage.getItem('localCart');
    const items = cartData ? JSON.parse(cartData) : [];
    console.log('获取本地购物车成功:', items);
    return Array.isArray(items) ? items : [];
  } catch (error) {
    console.error('获取本地购物车失败:', error);
    message.error('获取本地购物车失败');
    return [];
  }
};

// 计算本地购物车商品总数量
export const calculateLocalCartCount = (items: CartItem[] = []): number => {
  if (items.length === 0) {
    items = getLocalCart();
  }
  return items.reduce((total, item) => total + item.quantity, 0);
};

// 从本地存储移除购物车商品，并更新购物车数量
export const removeLocalCartItem = (itemId: string) => {
  try {
    // 获取当前购物车
    const items = getLocalCart();
    
    // 找到要删除的商品，获取其数量
    const itemToRemove = items.find(item => item.id === itemId);
    const itemQuantity = itemToRemove ? itemToRemove.quantity : 0;
    
    // 移除指定商品
    const updatedCart = items.filter(item => item.id !== itemId);
    
    // 保存更新后的购物车
    saveLocalCart(updatedCart);
    
    // 更新购物车数量
    const newCount = calculateLocalCartCount(updatedCart);
    localStorage.setItem('cartCount', newCount.toString());
    
    // 触发自定义事件，通知其他组件更新
    window.dispatchEvent(new Event(CART_COUNT_UPDATE_EVENT));
    
    console.log(`已从本地购物车移除商品：${itemId}，新数量：${newCount}`);
    return updatedCart;
  } catch (error) {
    console.error('从本地购物车移除商品失败:', error);
    message.error('从本地购物车移除商品失败');
    return getLocalCart();
  }
};

// 清空本地购物车
export const clearLocalCart = () => {
  try {
    localStorage.removeItem('localCart');
    localStorage.setItem('cartCount', '0');
    
    // 触发自定义事件，通知其他组件更新
    window.dispatchEvent(new Event(CART_COUNT_UPDATE_EVENT));
    
    console.log('清空本地购物车成功');
  } catch (error) {
    console.error('清空本地购物车失败:', error);
    message.error('清空本地购物车失败');
  }
};

// 更新本地购物车商品
export const updateLocalCartItem = (itemId: string, updates: Partial<CartItem>) => {
  try {
    // 获取当前购物车
    const items = getLocalCart();
    
    // 找到要更新的商品索引
    const itemIndex = items.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      console.warn(`本地购物车中未找到商品：${itemId}`);
      return items;
    }
    
    // 更新商品
    const updatedItems = [...items];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      ...updates
    };
    
    // 保存更新后的购物车
    saveLocalCart(updatedItems);
    
    // 更新购物车数量
    const newCount = calculateLocalCartCount(updatedItems);
    localStorage.setItem('cartCount', newCount.toString());
    
    // 触发自定义事件，通知其他组件更新
    window.dispatchEvent(new Event(CART_COUNT_UPDATE_EVENT));
    
    console.log(`已更新本地购物车商品：${itemId}，新数量：${newCount}`);
    return updatedItems;
  } catch (error) {
    console.error('更新本地购物车商品失败:', error);
    message.error('更新本地购物车商品失败');
    return getLocalCart();
  }
};

// 同步本地购物车到服务器
export const syncLocalCartToServer = async () => {
  try {
    const localCart = getLocalCart();
    if (localCart.length === 0) return;
    
    const items = localCart.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      specifications: item.specifications || {}
    }));
    
    const response = await axios.post('/api/cart/sync', { items });
    if (response.data) {
      // 同步成功后清空本地购物车
      clearLocalCart();
    }
    return response;
  } catch (error) {
    console.error('同步本地购物车失败:', error);
    // 不显示错误提示，静默处理
    return null;
  }
};

// 获取推荐商品
export const getRecommendedProducts = async (count: number = 4) => {
  try {
    // 使用模拟数据
    console.log('使用模拟推荐商品数据');
    const recommendedProducts = getRecommendedProductsData();
    
    // 如果指定了数量，则返回相应数量的商品
    const limitedProducts = count ? recommendedProducts.slice(0, count) : recommendedProducts;
    
    return { data: limitedProducts };
    
    /* 原API请求代码
    const response = await axios.get(`/api/products/recommended?count=${count}`);
    if (!response.data) {
      throw new Error('获取推荐商品失败：响应数据为空');
    }
    return response;
    */
  } catch (error) {
    console.error('获取推荐商品失败:', error);
    // 不显示错误提示，因为这不是关键功能
    // message.error('获取推荐商品失败，请稍后重试');
    
    // 返回空数组，避免前端出错
    return { data: [] };
  }
}; 