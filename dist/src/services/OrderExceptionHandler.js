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
var OrderExceptionHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderExceptionHandler = void 0;
const common_1 = require("@nestjs/common");
const order_type_1 = require("../types/order.type");
const order_entity_1 = require("../entities/order.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let OrderExceptionHandler = OrderExceptionHandler_1 = class OrderExceptionHandler {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
        this.logger = new common_1.Logger(OrderExceptionHandler_1.name);
    }
    handleOrderNotFound(orderId) {
        this.logger.error("Order not found", { orderId });
        throw new Error(`Order ${orderId} not found`);
    }
    handleInvalidStatus(orderId, currentStatus, expectedStatus) {
        this.logger.error("Invalid order status", { currentStatus, expectedStatus });
        throw new Error(`Invalid order status: expected ${expectedStatus}, got ${currentStatus}`);
    }
    handlePaymentError(error) {
        this.logger.error("Payment error occurred", { error });
        throw error;
    }
    handleInsufficientInventory(productId, requestedQuantity, availableQuantity) {
        this.logger.error("Insufficient inventory", {
            productId,
            requestedQuantity,
            availableQuantity,
        });
        throw new Error(`Insufficient inventory for product ${productId}: requested ${requestedQuantity}, available ${availableQuantity}`);
    }
    handleValidationError(message) {
        this.logger.error("Validation error", { message });
        throw new Error(`Validation error: ${message}`);
    }
    async handleOrderCreationFailure(error, cleanup) {
        this.logger.error("Order creation failed", { error });
        if (cleanup) {
            try {
                await cleanup();
            }
            catch (cleanupError) {
                this.logger.error("Cleanup after order creation failure failed", {
                    originalError: error,
                    cleanupError,
                });
            }
        }
        throw new Error("订单创建失败，请稍后重试");
    }
    handleCancellationFailure(orderId, error) {
        this.logger.error("Order cancellation failed", { orderId, error });
        throw new Error("订单取消失败，请稍后重试");
    }
    async handleRefundFailure(orderId, error, notifyAdmin = true) {
        this.logger.error("Order refund failed", { orderId, error });
        if (notifyAdmin) {
            try {
                await this.notifyAdminAboutRefundFailure(orderId, error);
            }
            catch (notifyError) {
                this.logger.error("Failed to notify admin about refund failure", {
                    orderId,
                    originalError: error,
                    notifyError,
                });
            }
        }
        throw new Error("退款处理失败，请联系客服");
    }
    async notifyAdminAboutRefundFailure(orderId, error) {
    }
    async handlePaymentFailure(orderId) {
        this.logger.warn(`Payment failed for order ${orderId}`);
        try {
            const order = await this.orderRepository.findOne({ where: { id: Number(orderId) } });
            if (!order) {
                throw new Error(`Order with ID ${orderId} not found`);
            }
            order.status = order_type_1.OrderStatus.CANCELED;
            order.canceledAt = new Date();
            await this.orderRepository.save(order);
        }
        catch (error) {
            this.logger.error(`Failed to handle payment failure for order ${orderId}`, error);
            throw error;
        }
    }
    async handleInventoryException(orderId) {
        this.logger.warn(`Inventory exception for order ${orderId}`);
        try {
            const order = await this.orderRepository.findOne({ where: { id: Number(orderId) } });
            if (!order) {
                throw new Error(`Order with ID ${orderId} not found`);
            }
        }
        catch (error) {
            this.logger.error(`Failed to handle inventory exception for order ${orderId}`, error);
            throw error;
        }
    }
    async handleException(order, error) {
        this.logger.error(`Order ${order.id} exception:`, error);
        if (error.message.includes("payment")) {
            this.logger.error(`Payment exception for order ${order.id}:`, error);
        }
        else if (error.message.includes("inventory")) {
            await this.handleInventoryException(Number(order.id));
        }
        else {
            this.logger.error(`General exception for order ${order.id}:`, error);
        }
    }
    handleOrderError(error) {
        this.logger.error("Order error occurred", { error });
        throw error;
    }
    handleCartError(error) {
        this.logger.error("Cart error occurred", { error });
        throw error;
    }
    handleProductNotFound(productId) {
        this.logger.error("Product not found", { productId });
        throw new Error(`Product ${productId} not found`);
    }
    handleInvalidQuantity(quantity) {
        this.logger.error("Invalid quantity", { quantity });
        throw new Error(`Invalid quantity: ${quantity}`);
    }
    handleInvalidPrice(price) {
        this.logger.error("Invalid price", { price });
        throw new Error(`Invalid price: ${price}`);
    }
    handleInvalidUser(userId) {
        this.logger.error("Invalid user", { userId });
        throw new Error(`Invalid user: ${userId}`);
    }
};
exports.OrderExceptionHandler = OrderExceptionHandler;
exports.OrderExceptionHandler = OrderExceptionHandler = OrderExceptionHandler_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OrderExceptionHandler);
//# sourceMappingURL=OrderExceptionHandler.js.map