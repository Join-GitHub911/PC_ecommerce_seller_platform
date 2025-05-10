"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cart_entity_1 = require("./entities/cart.entity");
const cart_item_entity_1 = require("./entities/cart-item.entity");
const product_entity_1 = require("../product/entities/product.entity");
const product_sku_entity_1 = require("../product/entities/product-sku.entity");
const promotion_service_1 = require("../promotion/promotion.service");
const coupon_service_1 = require("../coupon/coupon.service");
let CartService = class CartService {
    constructor(cartRepository, cartItemRepository, productRepository, productSkuRepository, promotionService, couponService) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.productSkuRepository = productSkuRepository;
        this.promotionService = promotionService;
        this.couponService = couponService;
    }
    async getCart(userId) {
        let cart = await this.cartRepository.findOne({
            where: { userId },
            relations: ['items', 'items.product', 'items.sku']
        });
        if (!cart) {
            cart = this.cartRepository.create({ userId });
            cart = await this.cartRepository.save(cart);
        }
        await this.updateCartItemPrices(cart);
        return cart;
    }
    async addToCart(userId, productId, quantity, skuId) {
        const product = await this.productRepository.findOne({
            where: { id: Number(productId) }
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${productId} not found`);
        }
        if (!product.isActive) {
            throw new common_1.BadRequestException(`Product ${product.name} is not available`);
        }
        let sku = null;
        if (skuId) {
            sku = await this.productSkuRepository.findOne({
                where: { id: Number(skuId) }
            });
            if (!sku) {
                throw new common_1.NotFoundException(`Product SKU with ID ${skuId} not found`);
            }
            if (sku.productId !== Number(productId)) {
                throw new common_1.BadRequestException(`SKU ${skuId} does not belong to product ${productId}`);
            }
            if (!sku.isActive) {
                throw new common_1.BadRequestException(`Selected product option is not available`);
            }
            if (sku.stock < quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for selected product option`);
            }
        }
        else {
            if (product.stock < quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for product ${product.name}`);
            }
        }
        let cart = await this.getCart(userId);
        const existingItem = cart.items.find(item => item.productId === Number(productId) && item.skuId === (skuId ? Number(skuId) : null));
        if (existingItem) {
            existingItem.quantity += quantity;
            const stockAvailable = sku ? sku.stock : product.stock;
            if (existingItem.quantity > stockAvailable) {
                throw new common_1.BadRequestException(`Cannot add ${quantity} more units. Stock available: ${stockAvailable}`);
            }
            await this.cartItemRepository.save(existingItem);
        }
        else {
            const cartItem = this.cartItemRepository.create({
                cartId: cart.id,
                productId: Number(productId),
                skuId: skuId ? Number(skuId) : null,
                quantity,
                price: sku ? sku.price : product.price,
                product,
                sku
            });
            await this.cartItemRepository.save(cartItem);
        }
        return this.getCart(userId);
    }
    async updateCartItemQuantity(userId, cartItemId, quantity) {
        const cart = await this.getCart(userId);
        const cartItem = cart.items.find(item => item.id === Number(cartItemId));
        if (!cartItem) {
            throw new common_1.NotFoundException(`Cart item with ID ${cartItemId} not found`);
        }
        if (quantity <= 0) {
            await this.cartItemRepository.remove(cartItem);
        }
        else {
            const product = cartItem.product;
            const sku = cartItem.sku;
            const stockAvailable = sku ? sku.stock : product.stock;
            if (quantity > stockAvailable) {
                throw new common_1.BadRequestException(`Cannot update quantity. Stock available: ${stockAvailable}`);
            }
            cartItem.quantity = quantity;
            await this.cartItemRepository.save(cartItem);
        }
        return this.getCart(userId);
    }
    async removeFromCart(userId, cartItemId) {
        const cart = await this.getCart(userId);
        const cartItem = cart.items.find(item => item.id === Number(cartItemId));
        if (!cartItem) {
            throw new common_1.NotFoundException(`Cart item with ID ${cartItemId} not found`);
        }
        await this.cartItemRepository.remove(cartItem);
        return this.getCart(userId);
    }
    async clearCart(userId) {
        const cart = await this.getCart(userId);
        await this.cartItemRepository.remove(cart.items);
    }
    async getCartSummary(userId, couponId) {
        const cart = await this.getCart(userId);
        const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let promotionDiscount = 0;
        for (const item of cart.items) {
            const productPromotions = await this.promotionService.getProductPromotions(item.productId);
            if (productPromotions.length > 0) {
                const bestPromotion = productPromotions.reduce((best, current) => {
                    const currentDiscount = current.discountRate
                        ? (item.price * item.quantity * current.discountRate / 100)
                        : (current.discountAmount || 0);
                    const bestDiscount = best.discountRate
                        ? (item.price * item.quantity * best.discountRate / 100)
                        : (best.discountAmount || 0);
                    return currentDiscount > bestDiscount ? current : best;
                });
                const discount = bestPromotion.discountRate
                    ? (item.price * item.quantity * bestPromotion.discountRate / 100)
                    : (bestPromotion.discountAmount || 0);
                promotionDiscount += discount;
            }
        }
        let couponDiscount = 0;
        if (couponId) {
            try {
                couponDiscount = await this.couponService.calculateDiscount(couponId, subtotal - promotionDiscount);
            }
            catch (error) {
                couponDiscount = 0;
            }
        }
        const total = Math.max(0, subtotal - promotionDiscount - couponDiscount);
        return {
            items: cart.items.length,
            totalQuantity: cart.items.reduce((sum, item) => sum + item.quantity, 0),
            subtotal,
            promotionDiscount,
            couponDiscount,
            total
        };
    }
    async updateCartItemPrices(cart) {
        for (const item of cart.items) {
            if (item.sku) {
                const sku = await this.productSkuRepository.findOne({
                    where: { id: Number(item.skuId) }
                });
                if (sku && sku.price !== item.price) {
                    item.price = sku.price;
                    await this.cartItemRepository.save(item);
                }
            }
            else {
                const product = await this.productRepository.findOne({
                    where: { id: Number(item.productId) }
                });
                if (product && product.price !== item.price) {
                    item.price = product.price;
                    await this.cartItemRepository.save(item);
                }
            }
        }
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cart_entity_1.Cart)),
    __param(1, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItem)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(3, (0, typeorm_1.InjectRepository)(product_sku_entity_1.ProductSku)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        promotion_service_1.PromotionService,
        coupon_service_1.CouponService])
], CartService);
//# sourceMappingURL=cart.service.js.map