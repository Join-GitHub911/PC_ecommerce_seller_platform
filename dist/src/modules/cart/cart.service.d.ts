import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../product/entities/product.entity';
import { ProductSku } from '../product/entities/product-sku.entity';
import { PromotionService } from '../promotion/promotion.service';
import { CouponService } from '../coupon/coupon.service';
export declare class CartService {
    private cartRepository;
    private cartItemRepository;
    private productRepository;
    private productSkuRepository;
    private promotionService;
    private couponService;
    constructor(cartRepository: Repository<Cart>, cartItemRepository: Repository<CartItem>, productRepository: Repository<Product>, productSkuRepository: Repository<ProductSku>, promotionService: PromotionService, couponService: CouponService);
    getCart(userId: number): Promise<Cart>;
    addToCart(userId: number, productId: number, quantity: number, skuId?: number): Promise<Cart>;
    updateCartItemQuantity(userId: number, cartItemId: number, quantity: number): Promise<Cart>;
    removeFromCart(userId: number, cartItemId: number): Promise<Cart>;
    clearCart(userId: number): Promise<void>;
    getCartSummary(userId: number, couponId?: number): Promise<any>;
    private updateCartItemPrices;
}
