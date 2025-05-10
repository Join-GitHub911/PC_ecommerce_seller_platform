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
var OrderService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const order_type_1 = require("../../types/order.type");
const OrderStateManager_1 = require("../../services/OrderStateManager");
const order_address_entity_1 = require("./entities/order-address.entity");
const product_entity_1 = require("../product/entities/product.entity");
const product_sku_entity_1 = require("../product/entities/product-sku.entity");
const bull_1 = require("@nestjs/bull");
const bull_2 = require("bull");
const coupon_service_1 = require("../coupon/coupon.service");
const notification_service_1 = require("../notification/notification.service");
const order_statistics_service_1 = require("../statistics/order-statistics.service");
let OrderService = OrderService_1 = class OrderService {
    constructor(orderRepository, orderItemRepository, orderAddressRepository, productRepository, productSkuRepository, orderStateManager, couponService, notificationService, orderStatisticsService, orderQueue) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.orderAddressRepository = orderAddressRepository;
        this.productRepository = productRepository;
        this.productSkuRepository = productSkuRepository;
        this.orderStateManager = orderStateManager;
        this.couponService = couponService;
        this.notificationService = notificationService;
        this.orderStatisticsService = orderStatisticsService;
        this.orderQueue = orderQueue;
        this.logger = new common_1.Logger(OrderService_1.name);
    }
    async create(user, createOrderDto) {
        try {
            await this.validateProductInventory(createOrderDto.items);
            const orderNo = this.generateOrderNo();
            const { totalAmount, actualAmount, discountAmount } = await this.calculateOrderAmount(createOrderDto.items, createOrderDto.couponId);
            const orderItems = await this.createOrderItems(createOrderDto.items);
            const orderAddresses = createOrderDto.addresses.map(addr => {
                const orderAddress = this.orderAddressRepository.create({
                    receiver: addr.receiver,
                    phone: addr.phone,
                    province: addr.province,
                    city: addr.city,
                    district: addr.district,
                    detail: addr.detail,
                    postalCode: addr.postalCode,
                    isDefault: addr.isDefault || false,
                    type: addr.type
                });
                return orderAddress;
            });
            const order = this.orderRepository.create({
                orderNo,
                user,
                paymentMethod: createOrderDto.paymentMethod,
                totalAmount,
                actualAmount,
                discountAmount,
                status: order_type_1.OrderStatus.PENDING,
                items: orderItems,
                addresses: orderAddresses,
                remark: createOrderDto.remark
            });
            const savedOrder = await this.orderRepository.save(order);
            await this.decreaseProductInventory(createOrderDto.items);
            if (createOrderDto.couponId) {
                await this.couponService.markAsUsed(user.id, createOrderDto.couponId, savedOrder.id);
            }
            await this.setOrderExpiration(savedOrder.id);
            await this.notificationService.sendOrderCreatedNotification(savedOrder.id, user.id);
            return this.findOne(savedOrder.id);
        }
        catch (error) {
            this.logger.error(`Failed to create order: ${error.message}`, error.stack);
            throw new common_1.BadRequestException(`订单创建失败: ${error.message}`);
        }
    }
    async findAll(user) {
        return this.orderRepository.find({
            where: { userId: user.id },
            relations: ['items', 'items.product', 'items.sku', 'addresses'],
            order: { createdAt: 'DESC' }
        });
    }
    async findOne(id) {
        const order = await this.orderRepository.findOne({
            where: { id: Number(id) },
            relations: ['items', 'items.product', 'items.sku', 'addresses', 'user']
        });
        if (!order) {
            throw new common_1.NotFoundException(`订单 ID ${id} 不存在`);
        }
        return order;
    }
    async cancel(id, user, reason) {
        const order = await this.findOne(id);
        if (order.userId !== user.id) {
            throw new common_1.BadRequestException('您无权取消此订单');
        }
        if (order.status !== order_type_1.OrderStatus.PENDING) {
            throw new common_1.BadRequestException('只有待支付的订单可以取消');
        }
        await this.orderStateManager.handleCancellation(id, reason);
        await this.restoreInventory(order);
        if (order.couponId) {
            await this.couponService.restoreCoupon(order.couponId);
        }
        await this.notificationService.sendOrderCanceledNotification(id, user.id, reason);
        await this.orderStatisticsService.recordOrderCanceled(id, reason);
        return this.findOne(id);
    }
    generateOrderNo() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, '0');
        return `${year}${month}${day}${random}`;
    }
    async validateProductInventory(items) {
        for (const item of items) {
            if (item.skuId) {
                const sku = await this.productSkuRepository.findOne({
                    where: { id: Number(item.skuId) }
                });
                if (!sku) {
                    throw new common_1.BadRequestException(`商品规格 ID ${item.skuId} 不存在`);
                }
                if (sku.stock < item.quantity) {
                    throw new common_1.BadRequestException(`商品 ${sku.name} 库存不足，当前库存 ${sku.stock}`);
                }
            }
            else {
                const product = await this.productRepository.findOne({
                    where: { id: Number(item.productId) }
                });
                if (!product) {
                    throw new common_1.BadRequestException(`商品 ID ${item.productId} 不存在`);
                }
                if (product.stock < item.quantity) {
                    throw new common_1.BadRequestException(`商品 ${product.name} 库存不足，当前库存 ${product.stock}`);
                }
            }
        }
    }
    async calculateOrderAmount(items, couponId) {
        let totalAmount = 0;
        let originalAmount = 0;
        for (const item of items) {
            let price = 0;
            let originalPrice = 0;
            if (item.skuId) {
                const sku = await this.productSkuRepository.findOne({
                    where: { id: Number(item.skuId) }
                });
                price = sku.price;
                originalPrice = sku.originalPrice || sku.price;
            }
            else {
                const product = await this.productRepository.findOne({
                    where: { id: Number(item.productId) }
                });
                price = product.price;
                originalPrice = product.originalPrice || product.price;
            }
            totalAmount += price * item.quantity;
            originalAmount += originalPrice * item.quantity;
        }
        let couponDiscount = 0;
        if (couponId) {
            couponDiscount = await this.couponService.calculateDiscount(couponId, totalAmount);
        }
        const productDiscount = originalAmount - totalAmount;
        const finalDiscount = productDiscount + couponDiscount;
        const actualAmount = originalAmount - finalDiscount;
        return {
            totalAmount: originalAmount,
            actualAmount,
            discountAmount: finalDiscount
        };
    }
    async createOrderItems(items) {
        return Promise.all(items.map(async (item) => {
            const product = await this.productRepository.findOne({
                where: { id: Number(item.productId) }
            });
            let sku = null;
            if (item.skuId) {
                sku = await this.productSkuRepository.findOne({
                    where: { id: Number(item.skuId) }
                });
            }
            const price = sku ? sku.price : product.price;
            const originalPrice = sku ? (sku.originalPrice || sku.price) : (product.originalPrice || product.price);
            const discountAmount = originalPrice > price ? (originalPrice - price) * item.quantity : 0;
            return this.orderItemRepository.create({
                productId: product.id,
                skuId: sku === null || sku === void 0 ? void 0 : sku.id,
                product,
                sku,
                quantity: item.quantity,
                price,
                originalPrice,
                discountAmount
            });
        }));
    }
    async decreaseProductInventory(items) {
        for (const item of items) {
            if (item.skuId) {
                await this.productSkuRepository.decrement({ id: Number(item.skuId) }, 'stock', item.quantity);
            }
            else {
                await this.productRepository.decrement({ id: Number(item.productId) }, 'stock', item.quantity);
            }
        }
    }
    async restoreInventory(order) {
        for (const item of order.items) {
            if (item.skuId) {
                await this.productSkuRepository.increment({ id: Number(item.skuId) }, 'stock', item.quantity);
            }
            else {
                await this.productRepository.increment({ id: Number(item.productId) }, 'stock', item.quantity);
            }
        }
    }
    async setOrderExpiration(orderId) {
        await this.orderQueue.add('order-expiration', { orderId }, {
            delay: 15 * 60 * 1000,
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 60000
            }
        });
    }
    async handlePaymentSuccess(orderId, paymentId, amount) {
        const order = await this.findOne(orderId);
        order.status = order_type_1.OrderStatus.PAID;
        order.paymentId = paymentId;
        order.isPaid = true;
        order.paidAt = new Date();
        order.paidTime = new Date();
        return this.orderRepository.save(order);
    }
    async countByStatus(userId, status) {
        return this.orderRepository.count({
            where: {
                userId,
                status
            }
        });
    }
    async getOrderStatistics(userId) {
        const pending = await this.countByStatus(userId, order_type_1.OrderStatus.PENDING);
        const paid = await this.countByStatus(userId, order_type_1.OrderStatus.PAID);
        const shipped = await this.countByStatus(userId, order_type_1.OrderStatus.SHIPPED);
        const delivered = await this.countByStatus(userId, order_type_1.OrderStatus.DELIVERED);
        return {
            pending,
            paid,
            shipped,
            delivered,
            total: pending + paid + shipped + delivered
        };
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = OrderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(order_address_entity_1.OrderAddress)),
    __param(3, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(4, (0, typeorm_1.InjectRepository)(product_sku_entity_1.ProductSku)),
    __param(9, (0, bull_1.InjectQueue)('orders')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        OrderStateManager_1.OrderStateManager,
        coupon_service_1.CouponService,
        notification_service_1.NotificationService,
        order_statistics_service_1.OrderStatisticsService, typeof (_a = typeof bull_2.Queue !== "undefined" && bull_2.Queue) === "function" ? _a : Object])
], OrderService);
//# sourceMappingURL=order.service.js.map