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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../entities/order.entity");
const order_item_entity_1 = require("../entities/order-item.entity");
const cart_entity_1 = require("../entities/cart.entity");
const product_entity_1 = require("../entities/product.entity");
const order_type_1 = require("../types/order.type");
const logger_util_1 = require("../utils/logger.util");
const OrderStateManager_1 = require("./OrderStateManager");
const OrderExceptionHandler_1 = require("./OrderExceptionHandler");
const BadRequestException_1 = require("../exceptions/BadRequestException");
const order_1 = require("../utils/order");
let OrderService = class OrderService {
    constructor(orderRepository, orderItemRepository, cartRepository, productRepository, orderStateManager, exceptionHandler) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.orderStateManager = orderStateManager;
        this.exceptionHandler = exceptionHandler;
    }
    async createOrder(params) {
        const { userId, items, addressId, remark } = params;
        try {
            const productIds = items.map((item) => item.productId);
            const products = await this.productRepository.findByIds(productIds);
            if (products.length !== productIds.length) {
                this.exceptionHandler.handleValidationError("部分商品不存在");
            }
            const productMap = new Map(products.map((p) => [p.id, p]));
            let totalAmount = 0;
            const orderItems = items.map((item) => {
                const product = productMap.get(item.productId);
                if (!product) {
                    this.exceptionHandler.handleValidationError(`商品 ${item.productId} 不存在`);
                }
                if (product.stock < item.quantity) {
                    this.exceptionHandler.handleInsufficientInventory(item.productId, item.quantity, product.stock);
                }
                const amount = product.price * item.quantity;
                totalAmount += amount;
                return this.orderItemRepository.create({
                    productId: item.productId,
                    productName: product.name,
                    productImage: product.mainImage,
                    specifications: item.specifications,
                    price: product.price,
                    quantity: item.quantity,
                    amount,
                });
            });
            const order = this.orderRepository.create({
                id: (0, order_1.generateOrderId)(),
                userId,
                addressId,
                items: orderItems,
                totalAmount,
                finalAmount: totalAmount,
                status: order_type_1.OrderStatus.PENDING_PAYMENT,
                remark,
            });
            await this.orderRepository.save(order);
            await this.cartRepository.delete({
                userId,
                productId: In(productIds),
            });
            return order;
        }
        catch (error) {
            await this.exceptionHandler.handleOrderCreationFailure(error, async () => {
            });
        }
    }
    async getOrders(params) {
        const { userId, status, page, pageSize, startDate, endDate, keyword } = params;
        const queryBuilder = this.orderRepository
            .createQueryBuilder("order")
            .leftJoinAndSelect("order.items", "items")
            .where("order.userId = :userId", { userId });
        if (status) {
            queryBuilder.andWhere("order.status = :status", { status });
        }
        if (startDate) {
            queryBuilder.andWhere("order.createdAt >= :startDate", { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere("order.createdAt <= :endDate", { endDate });
        }
        if (keyword) {
            queryBuilder.andWhere("(order.id LIKE :keyword OR items.productName LIKE :keyword)", { keyword: `%${keyword}%` });
        }
        const [orders, total] = await queryBuilder
            .orderBy("order.createdAt", "DESC")
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount();
        return {
            items: orders,
            total,
            page,
            pageSize,
        };
    }
    async getOrderDetail(orderId, userId) {
        const order = await this.orderRepository.findOne({
            where: { id: orderId, userId },
            relations: ["items"],
        });
        if (!order) {
            this.exceptionHandler.handleOrderNotFound(orderId);
        }
        return order;
    }
    async handlePaymentSuccess(params) {
        try {
            await this.orderStateManager.handlePaymentSuccess(params);
            await this.sendPaymentNotification(params.orderId);
            return true;
        }
        catch (error) {
            this.exceptionHandler.handlePaymentError(error);
            return false;
        }
    }
    async sendPaymentNotification(orderId) {
        try {
            const order = await this.orderRepository.findOne({
                where: { id: orderId },
                relations: ["user"],
            });
            if (!order) {
                throw new Error("Order not found");
            }
            return true;
        }
        catch (error) {
            logger_util_1.logger.error("Failed to send payment notification", { error, orderId });
            return false;
        }
    }
    async confirmReceipt(orderId, userId) {
        try {
            const order = await this.getOrderDetail(orderId, userId);
            if (order.status !== order_type_1.OrderStatus.PENDING_RECEIPT) {
                this.exceptionHandler.handleInvalidStatus(orderId, order.status, order_type_1.OrderStatus.PENDING_RECEIPT);
            }
            await this.orderStateManager.handleReceipt(orderId);
            return { success: true };
        }
        catch (error) {
            throw new BadRequestException_1.BadRequestException("确认收货失败，请稍后重试");
        }
    }
    async cancelOrder(params) {
        const { orderId, userId, reason } = params;
        try {
            const order = await this.getOrderDetail(orderId, userId);
            if (order.status !== order_type_1.OrderStatus.PENDING_PAYMENT) {
                this.exceptionHandler.handleInvalidStatus(orderId, order.status, order_type_1.OrderStatus.PENDING_PAYMENT);
            }
            await this.orderStateManager.handleCancel({
                orderId,
                reason,
                cancelledBy: userId,
            });
            return { success: true };
        }
        catch (error) {
            this.exceptionHandler.handleCancellationFailure(orderId, error);
        }
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(cart_entity_1.Cart)),
    __param(3, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        OrderStateManager_1.OrderStateManager,
        OrderExceptionHandler_1.OrderExceptionHandler])
], OrderService);
//# sourceMappingURL=OrderService.js.map