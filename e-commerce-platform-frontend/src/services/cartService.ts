import { apiClient } from './apiClient';
import { ErrorService } from './errorService';
import { ProductInfoCache } from './productInfoCache';

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  shopName: string;
  price: number;
  quantity: number;
  image: string;
  selected: boolean;
  stock: number;
  specifications?: string;
}

export interface CartData {
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
}

// 内存缓存购物车数据
let cartCache: CartData | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 60000; // 缓存有效期1分钟

export class CartService {
  /**
   * 获取购物车数据
   * @param forceRefresh 是否强制刷新
   */
  static async getCart(forceRefresh = false): Promise<CartData> {
    try {
      // 检查缓存是否可用
      const now = Date.now();
      if (!forceRefresh && cartCache && (now - lastFetchTime < CACHE_TTL)) {
        return cartCache;
      }

      const cart = await apiClient.get<CartData>('/cart');
      
      // 验证和净化数据
      let validatedCart = this.validateCartData(cart);
      
      // 尝试修复缺失的商品和店铺信息
      validatedCart = await this.fixCartItemsInfo(validatedCart);
      
      // 更新缓存
      cartCache = validatedCart;
      lastFetchTime = now;
      
      // 同步更新localStorage备份
      this.saveCartToLocalStorage(validatedCart);
      
      return validatedCart;
    } catch (error) {
      // 错误处理
      ErrorService.handleCartError(error);
      
      // 尝试从本地存储恢复
      const localCart = this.getCartFromLocalStorage();
      if (localCart) {
        return localCart;
      }
      
      // 返回空购物车
      return { items: [], totalPrice: 0, totalQuantity: 0 };
    }
  }

  /**
   * 添加商品到购物车
   */
  static async addToCart(productId: string, quantity: number, specifications?: string): Promise<boolean> {
    try {
      // 获取商品详细信息来进行前端验证
      const productDetails = await ProductInfoCache.getProductInfo(productId);
      
      if (!productDetails || !productDetails.id) {
        throw new Error('商品信息无效，无法添加到购物车');
      }
      
      if (productDetails.stock < quantity) {
        throw new Error('商品库存不足');
      }
      
      // 发送添加购物车请求
      const response = await apiClient.post('/cart/add', {
        productId,
        quantity,
        specifications,
        // 客户端主动提供商品和店铺信息，减少后续请求
        productInfo: {
          name: productDetails.name,
          shopName: productDetails.shopName,
          price: productDetails.price,
          image: productDetails.image
        }
      });
      
      // 强制刷新购物车数据
      await this.getCart(true);
      
      return true;
    } catch (error) {
      ErrorService.handleCartError(error);
      return false;
    }
  }

  /**
   * 更新购物车项
   */
  static async updateCartItem(itemId: string, quantity: number, selected?: boolean): Promise<boolean> {
    try {
      await apiClient.put(`/cart/items/${itemId}`, {
        quantity,
        selected
      });
      
      // 更新本地缓存
      if (cartCache) {
        const itemIndex = cartCache.items.findIndex(item => item.id === itemId);
        if (itemIndex >= 0) {
          cartCache.items[itemIndex].quantity = quantity;
          if (selected !== undefined) {
            cartCache.items[itemIndex].selected = selected;
          }
          
          // 重新计算总价和总数量
          this.recalculateCartTotals(cartCache);
          this.saveCartToLocalStorage(cartCache);
        }
      }
      
      return true;
    } catch (error) {
      ErrorService.handleCartError(error);
      return false;
    }
  }

  /**
   * 从购物车中移除商品
   */
  static async removeFromCart(itemId: string): Promise<boolean> {
    try {
      await apiClient.delete(`/cart/items/${itemId}`);
      
      // 更新本地缓存
      if (cartCache) {
        cartCache.items = cartCache.items.filter(item => item.id !== itemId);
        this.recalculateCartTotals(cartCache);
        this.saveCartToLocalStorage(cartCache);
      }
      
      return true;
    } catch (error) {
      ErrorService.handleCartError(error);
      return false;
    }
  }

  /**
   * 清空购物车
   */
  static async clearCart(): Promise<boolean> {
    try {
      await apiClient.delete('/cart');
      
      // 清空本地缓存
      cartCache = { items: [], totalPrice: 0, totalQuantity: 0 };
      this.saveCartToLocalStorage(cartCache);
      
      return true;
    } catch (error) {
      ErrorService.handleCartError(error);
      return false;
    }
  }

  /**
   * 验证和净化购物车数据
   */
  private static validateCartData(cart: any): CartData {
    if (!cart || !Array.isArray(cart.items)) {
      return { items: [], totalPrice: 0, totalQuantity: 0 };
    }
    
    // 验证每个购物车项
    const validItems = cart.items.filter((item: any) => {
      return item && 
             typeof item.id === 'string' && 
             typeof item.productId === 'string';
    });
    
    // 确保数值类型正确
    validItems.forEach((item: any) => {
      item.price = Number(item.price) || 0;
      item.quantity = Number(item.quantity) || 1;
      item.stock = Number(item.stock) || 0;
      item.selected = Boolean(item.selected);
      // 确保其他属性至少有空字符串
      item.productName = item.productName || '';
      item.shopName = item.shopName || '';
      item.image = item.image || '';
    });
    
    const validCart = {
      items: validItems,
      totalPrice: 0,
      totalQuantity: 0
    };
    
    // 重新计算总价和总数量
    this.recalculateCartTotals(validCart);
    
    return validCart;
  }

  /**
   * 修复购物车项中缺失的信息
   */
  private static async fixCartItemsInfo(cart: CartData): Promise<CartData> {
    if (!cart || !cart.items || cart.items.length === 0) {
      return cart;
    }
    
    const itemsWithMissingInfo = cart.items.some(
      item => !item.productName || !item.shopName || !item.image
    );
    
    if (itemsWithMissingInfo) {
      // 预加载流行商品信息，可能包含我们需要的商品
      await ProductInfoCache.preloadPopularProducts();
      
      // 尝试更新有缺失信息的购物车项
      const updatedItems = await ProductInfoCache.updateIncompleteItems(cart.items);
      cart.items = updatedItems;
    }
    
    return cart;
  }

  /**
   * 重新计算购物车总价和总数量
   */
  private static recalculateCartTotals(cart: CartData): void {
    let totalPrice = 0;
    let totalQuantity = 0;
    
    cart.items.forEach(item => {
      if (item.selected) {
        totalPrice += item.price * item.quantity;
        totalQuantity += item.quantity;
      }
    });
    
    cart.totalPrice = totalPrice;
    cart.totalQuantity = totalQuantity;
  }

  /**
   * 保存购物车到本地存储
   */
  private static saveCartToLocalStorage(cart: CartData): void {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }

  /**
   * 从本地存储获取购物车
   */
  private static getCartFromLocalStorage(): CartData | null {
    try {
      const cartString = localStorage.getItem('cart');
      if (!cartString) return null;
      
      const cart = JSON.parse(cartString);
      return this.validateCartData(cart);
    } catch (e) {
      console.error('Failed to get cart from localStorage:', e);
      return null;
    }
  }

  /**
   * 验证购物车项数据的完整性
   */
  static validateCartItem(item: CartItem): boolean {
    return (
      !!item.id &&
      !!item.productId &&
      !!item.productName &&
      !!item.shopName &&
      typeof item.price === 'number' &&
      typeof item.quantity === 'number' &&
      item.quantity > 0
    );
  }
} 