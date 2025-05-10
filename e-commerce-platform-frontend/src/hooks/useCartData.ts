import { useState, useEffect, useCallback } from 'react';
import { CartService, CartData, CartItem } from '../services/cartService';
import { useCartLoading } from './useCartLoading';
import { message } from 'antd';

export interface UseCartDataResult {
  cart: CartData | null;
  isLoading: boolean;
  error: Error | null;
  refreshCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number, specifications?: string) => Promise<boolean>;
  updateCartItem: (itemId: string, quantity: number, selected?: boolean) => Promise<boolean>;
  removeCartItem: (itemId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  isDataValid: boolean;
}

export function useCartData(): UseCartDataResult {
  const [cart, setCart] = useState<CartData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isDataValid, setIsDataValid] = useState(true);
  
  const { 
    isLoading, 
    startCartLoading, 
    startAddToCartLoading,
    startUpdateCartLoading,
    startRemoveFromCartLoading,
    endLoading 
  } = useCartLoading();

  // 获取购物车数据
  const fetchCartData = useCallback(async (forceRefresh = false) => {
    try {
      startCartLoading();
      const cartData = await CartService.getCart(forceRefresh);
      setCart(cartData);
      
      // 验证购物车数据的有效性
      const hasInvalidItems = cartData.items.some(item => !CartService.validateCartItem(item));
      setIsDataValid(!hasInvalidItems);
      
      setError(null);
      return cartData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('获取购物车数据失败');
      setError(error);
      message.error('获取购物车数据失败，请稍后重试');
      return null;
    } finally {
      endLoading();
    }
  }, [startCartLoading, endLoading]);

  // 刷新购物车数据
  const refreshCart = useCallback(async (): Promise<void> => {
    await fetchCartData(true);
  }, [fetchCartData]);

  // 添加商品到购物车
  const addToCart = useCallback(async (
    productId: string, 
    quantity: number, 
    specifications?: string
  ): Promise<boolean> => {
    try {
      startAddToCartLoading();
      const success = await CartService.addToCart(productId, quantity, specifications);
      
      if (success) {
        await fetchCartData(true);
        return true;
      }
      return false;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('添加商品到购物车失败');
      setError(error);
      message.error('添加商品到购物车失败，请稍后重试');
      return false;
    } finally {
      endLoading();
    }
  }, [startAddToCartLoading, fetchCartData, endLoading]);

  // 更新购物车项
  const updateCartItem = useCallback(async (
    itemId: string, 
    quantity: number, 
    selected?: boolean
  ): Promise<boolean> => {
    try {
      startUpdateCartLoading();
      const success = await CartService.updateCartItem(itemId, quantity, selected);
      
      if (success) {
        await fetchCartData(true);
        return true;
      }
      return false;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('更新购物车失败');
      setError(error);
      message.error('更新购物车失败，请稍后重试');
      return false;
    } finally {
      endLoading();
    }
  }, [startUpdateCartLoading, fetchCartData, endLoading]);

  // 移除购物车项
  const removeCartItem = useCallback(async (itemId: string): Promise<boolean> => {
    try {
      startRemoveFromCartLoading();
      const success = await CartService.removeFromCart(itemId);
      
      if (success) {
        await fetchCartData(true);
        return true;
      }
      return false;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('从购物车移除商品失败');
      setError(error);
      message.error('从购物车移除商品失败，请稍后重试');
      return false;
    } finally {
      endLoading();
    }
  }, [startRemoveFromCartLoading, fetchCartData, endLoading]);

  // 清空购物车
  const clearCart = useCallback(async (): Promise<boolean> => {
    try {
      startCartLoading('正在清空购物车...');
      const success = await CartService.clearCart();
      
      if (success) {
        setCart({ items: [], totalPrice: 0, totalQuantity: 0 });
        return true;
      }
      return false;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('清空购物车失败');
      setError(error);
      message.error('清空购物车失败，请稍后重试');
      return false;
    } finally {
      endLoading();
    }
  }, [startCartLoading, endLoading]);

  // 初始加载和定期刷新
  useEffect(() => {
    // 初始加载
    fetchCartData();
    
    // 每5分钟刷新一次购物车数据，确保数据最新
    const intervalId = setInterval(() => {
      fetchCartData(true);
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [fetchCartData]);

  return {
    cart,
    isLoading,
    error,
    refreshCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    isDataValid
  };
} 