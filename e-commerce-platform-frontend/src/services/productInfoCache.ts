import { apiClient } from './apiClient';

interface ProductInfo {
  id: string;
  name: string;
  shopId: string;
  shopName: string;
  price: number;
  stock: number;
  image: string;
}

// 内存缓存
const productCache: Record<string, ProductInfo> = {};
const shopCache: Record<string, string> = {};
let cacheInitialized = false;

/**
 * 商品信息缓存服务
 * 用于在购物车或其他页面中快速获取商品和店铺信息
 */
export class ProductInfoCache {
  /**
   * 预加载常用商品信息
   */
  static async preloadPopularProducts(): Promise<void> {
    if (cacheInitialized) return;
    
    try {
      const popularProducts = await apiClient.get<ProductInfo[]>('/products/popular');
      
      if (Array.isArray(popularProducts)) {
        popularProducts.forEach(product => {
          this.cacheProduct(product);
          if (product.shopId && product.shopName) {
            shopCache[product.shopId] = product.shopName;
          }
        });
      }
      
      cacheInitialized = true;
    } catch (error) {
      console.error('Failed to preload popular products:', error);
    }
  }
  
  /**
   * 获取商品信息
   * @param productId 商品ID
   */
  static async getProductInfo(productId: string): Promise<ProductInfo | null> {
    // 如果缓存中有，直接返回
    if (productCache[productId]) {
      return productCache[productId];
    }
    
    // 否则请求API并缓存
    try {
      const product = await apiClient.get<ProductInfo>(`/products/${productId}`);
      if (product && product.id) {
        this.cacheProduct(product);
        return product;
      }
      return null;
    } catch (error) {
      console.error(`Failed to get product info for ${productId}:`, error);
      return null;
    }
  }
  
  /**
   * 获取店铺名称
   * @param shopId 店铺ID
   */
  static async getShopName(shopId: string): Promise<string | null> {
    // 如果缓存中有，直接返回
    if (shopCache[shopId]) {
      return shopCache[shopId];
    }
    
    // 否则请求API并缓存
    try {
      const shop = await apiClient.get<{id: string, name: string}>(`/shops/${shopId}`);
      if (shop && shop.name) {
        shopCache[shopId] = shop.name;
        return shop.name;
      }
      return null;
    } catch (error) {
      console.error(`Failed to get shop name for ${shopId}:`, error);
      return null;
    }
  }
  
  /**
   * 更新或添加有缺失信息的商品
   * @param cartItems 购物车项数组
   */
  static async updateIncompleteItems(cartItems: any[]): Promise<any[]> {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return cartItems;
    }
    
    const updatedItems = [...cartItems];
    const promises = [];
    
    for (let i = 0; i < updatedItems.length; i++) {
      const item = updatedItems[i];
      
      // 检查是否缺少名称或店铺名称
      const needsUpdate = 
        item.productId && (
          !item.productName || 
          !item.shopName
        );
      
      if (needsUpdate) {
        promises.push(
          this.getProductInfo(item.productId).then(productInfo => {
            if (productInfo) {
              if (!item.productName) {
                updatedItems[i].productName = productInfo.name;
              }
              if (!item.shopName && productInfo.shopName) {
                updatedItems[i].shopName = productInfo.shopName;
              }
              if (!item.image) {
                updatedItems[i].image = productInfo.image;
              }
            }
          })
        );
      }
    }
    
    if (promises.length > 0) {
      await Promise.all(promises);
    }
    
    return updatedItems;
  }
  
  /**
   * 缓存商品信息
   */
  private static cacheProduct(product: ProductInfo): void {
    productCache[product.id] = product;
  }
  
  /**
   * 清除缓存
   */
  static clearCache(): void {
    Object.keys(productCache).forEach(key => {
      delete productCache[key];
    });
    
    Object.keys(shopCache).forEach(key => {
      delete shopCache[key];
    });
    
    cacheInitialized = false;
  }
} 