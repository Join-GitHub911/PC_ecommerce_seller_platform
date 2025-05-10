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
var OrderStateManager_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStateManager = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../modules/order/entities/order.entity");
const order_type_1 = require("../types/order.type");
const OrderExceptionHandler_1 = require("./OrderExceptionHandler");
const common_2 = require("@nestjs/common");
const notification_service_1 = require("../modules/notification/notification.service");
const order_statistics_service_1 = require("../modules/statistics/order-statistics.service");
let OrderStateManager = OrderStateManager_1 = class OrderStateManager {
    constructor(orderRepository, exceptionHandler, notificationService, orderStatisticsService) {
        this.orderRepository = orderRepository;
        this.exceptionHandler = exceptionHandler;
        this.notificationService = notificationService;
        this.orderStatisticsService = orderStatisticsService;
        this.logger = new common_2.Logger(OrderStateManager_1.name);
    }
    async handlePaymentSuccess(params) {
        const { orderId, paymentId, amount, payTime } = params;
        const order = await this.orderRepository.findOne({
            where: { id: Number(orderId) },
            relations: ['user']
        });
        if (!order) {
            this.exceptionHandler.handleOrderNotFound(orderId);
        }
        if (order.status !== order_type_1.OrderStatus.PENDING) {
            this.exceptionHandler.handleInvalidStatus(orderId, order.status, order_type_1.OrderStatus.PENDING);
        }
        order.status = order_type_1.OrderStatus.PAID;
        order.paymentId = paymentId;
        order.actualAmount = amount;
        order.paidTime = new Date(payTime);
        order.paidAt = new Date(payTime);
        order.isPaid = true;
        await this.orderRepository.save(order);
        await this.notificationService.sendOrderStatusNotification({
            orderId: order.id,
            status: order_type_1.OrderStatus.PAID,
            userId: order.user.id,
            title: '订单支付成功',
            content: `您的订单 ${order.orderNo} 已支付成功，我们将尽快为您发货!`,
        });
        await this.orderStatisticsService.recordOrderPaid(orderId, amount);
        this.logger.log("Order payment success", { orderId, paymentId });
    }
    async handleShipping(orderId, trackingInfo) {
        const order = await this.orderRepository.findOne({
            where: { id: Number(orderId) },
            relations: ['user']
        });
        if (!order) {
            this.exceptionHandler.handleOrderNotFound(orderId);
        }
        if (order.status !== order_type_1.OrderStatus.PAID && order.status !== order_type_1.OrderStatus.PROCESSING) {
            this.exceptionHandler.handleInvalidStatus(orderId, order.status, order_type_1.OrderStatus.PAID);
        }
        order.status = order_type_1.OrderStatus.SHIPPED;
        order.shippingTime = new Date();
        order.shippedAt = new Date();
        if (trackingInfo) {
            order.shippingCompany = trackingInfo.company;
            order.trackingNo = trackingInfo.trackingNo;
        }
        await this.orderRepository.save(order);
        await this.notificationService.sendOrderStatusNotification({
            orderId: order.id,
            status: order_type_1.OrderStatus.SHIPPED,
            userId: order.user.id,
            title: '订单已发货',
            content: `您的订单 ${order.orderNo} 已发货${trackingInfo ? `，物流公司：${trackingInfo.company}，单号：${trackingInfo.trackingNo}` : ''}`,
        });
        this.logger.log("Order shipped", { orderId });
    }
    async handleDelivery(orderId) {
        const order = await this.orderRepository.findOne({
            where: { id: Number(orderId) },
            relations: ['user']
        });
        if (!order) {
            this.exceptionHandler.handleOrderNotFound(orderId);
        }
        if (order.status !== order_type_1.OrderStatus.SHIPPED) {
            this.exceptionHandler.handleInvalidStatus(orderId, order.status, order_type_1.OrderStatus.SHIPPED);
        }
        order.status = order_type_1.OrderStatus.DELIVERED;
        order.deliveryTime = new Date();
        order.deliveredAt = new Date();
        await this.orderRepository.save(order);
        await this.notificationService.sendOrderStatusNotification({
            orderId: order.id,
            status: order_type_1.OrderStatus.DELIVERED,
            userId: order.user.id,
            title: '订单已送达',
            content: `您的订单 ${order.orderNo} 已送达，如有问题请联系客服`,
        });
        this.logger.log("Order delivered", { orderId });
    }
    async handleCompletion(orderId) {
        const order = await this.orderRepository.findOne({
            where: { id: Number(orderId) },
            relations: ['user']
        });
        if (!order) {
            this.exceptionHandler.handleOrderNotFound(orderId);
        }
        if (order.status !== order_type_1.OrderStatus.DELIVERED) {
            this.exceptionHandler.handleInvalidStatus(orderId, order.status, order_type_1.OrderStatus.DELIVERED);
        }
        order.status = order_type_1.OrderStatus.COMPLETED;
        order.completionTime = new Date();
        await this.orderRepository.save(order);
        await this.notificationService.sendOrderStatusNotification({
            orderId: order.id,
            status: order_type_1.OrderStatus.COMPLETED,
            userId: order.user.id,
            title: '订单已完成',
            content: `您的订单 ${order.orderNo} 已完成，期待您的评价！`,
        });
        this.logger.log("Order completed", { orderId });
    }
    async handleCancellation(orderId, reason) {
        const order = await this.orderRepository.findOne({
            where: { id: Number(orderId) },
            relations: ['user']
        });
        if (!order) {
            this.exceptionHandler.handleOrderNotFound(orderId);
        }
        if (![order_type_1.OrderStatus.PENDING, order_type_1.OrderStatus.PAID].includes(order.status)) {
            this.exceptionHandler.handleInvalidStatus(orderId, order.status, order_type_1.OrderStatus.PENDING);
        }
        order.status = order_type_1.OrderStatus.CANCELED;
        order.cancellationReason = reason;
        order.cancellationTime = new Date();
        order.canceledAt = new Date();
        await this.orderRepository.save(order);
        await this.notificationService.sendOrderStatusNotification({
            orderId: order.id,
            status: order_type_1.OrderStatus.CANCELED,
            userId: order.user.id,
            title: '订单已取消',
            content: `您的订单 ${order.orderNo} 已取消，取消原因：${reason}`,
        });
        this.logger.log("Order cancelled", { orderId, reason });
    }
    async handleRefund(orderId, reason) {
        const order = await this.orderRepository.findOne({
            where: { id: Number(orderId) },
            relations: ['user']
        });
        if (!order) {
            this.exceptionHandler.handleOrderNotFound(orderId);
        }
        if (![order_type_1.OrderStatus.PAID, order_type_1.OrderStatus.SHIPPED, order_type_1.OrderStatus.DELIVERED].includes(order.status)) {
            this.exceptionHandler.handleInvalidStatus(orderId, order.status, order_type_1.OrderStatus.PAID);
        }
        order.status = order_type_1.OrderStatus.REFUNDED;
        order.refundReason = reason;
        order.refundTime = new Date();
        await this.orderRepository.save(order);
        await this.notificationService.sendOrderStatusNotification({
            orderId: order.id,
            status: order_type_1.OrderStatus.REFUNDED,
            userId: order.user.id,
            title: '订单已退款',
            content: `您的订单 ${order.orderNo} 已退款，退款原因：${reason}`,
        });
        this.logger.log("Order refunded", { orderId, reason });
    }
    async handleOrderExpiration(orderId) {
        const order = await this.orderRepository.findOne({
            where: { id: Number(orderId) },
            relations: ['user']
        });
        if (!order || order.status !== order_type_1.OrderStatus.PENDING) {
            return;
        }
        await this.handleCancellation(orderId, '订单超时未支付，系统自动取消');
    }
    async updateOrderStatus(orderId, status) {
        const order = await this.orderRepository.findOne({ where: { id: Number(orderId) } });
        if (!order) {
            throw new Error(`Order with ID ${orderId} not found`);
        }
        if (!await this.canTransitionTo(order, status)) {
            throw new Error(`Cannot transition from ${order.status} to ${status}`);
        }
        switch (status) {
            case order_type_1.OrderStatus.PAID:
                order.isPaid = true;
                order.paidAt = new Date();
                order.paidTime = new Date();
                break;
            case order_type_1.OrderStatus.PROCESSING:
                break;
            case order_type_1.OrderStatus.SHIPPED:
                order.shippedAt = new Date();
                order.shippingTime = new Date();
                break;
            case order_type_1.OrderStatus.DELIVERED:
                order.deliveredAt = new Date();
                order.deliveryTime = new Date();
                break;
            case order_type_1.OrderStatus.COMPLETED:
                order.completionTime = new Date();
                break;
            case order_type_1.OrderStatus.CANCELED:
                order.canceledAt = new Date();
                order.cancellationTime = new Date();
                break;
            case order_type_1.OrderStatus.REFUNDING:
                break;
            case order_type_1.OrderStatus.REFUNDED:
                order.refundTime = new Date();
                break;
        }
        order.status = status;
        return this.orderRepository.save(order);
    }
    async canTransitionTo(order, targetStatus) {
        var _a;
        const currentStatus = order.status;
        const allowedTransitions = {
            [order_type_1.OrderStatus.PENDING]: [order_type_1.OrderStatus.PAID, order_type_1.OrderStatus.CANCELED],
            [order_type_1.OrderStatus.PAID]: [order_type_1.OrderStatus.PROCESSING, order_type_1.OrderStatus.REFUNDING, order_type_1.OrderStatus.CANCELED, order_type_1.OrderStatus.SHIPPED],
            [order_type_1.OrderStatus.PROCESSING]: [order_type_1.OrderStatus.SHIPPED, order_type_1.OrderStatus.CANCELED, order_type_1.OrderStatus.REFUNDING],
            [order_type_1.OrderStatus.SHIPPED]: [order_type_1.OrderStatus.DELIVERED, order_type_1.OrderStatus.REFUNDING],
            [order_type_1.OrderStatus.DELIVERED]: [order_type_1.OrderStatus.COMPLETED, order_type_1.OrderStatus.REFUNDING],
            [order_type_1.OrderStatus.COMPLETED]: [order_type_1.OrderStatus.REFUNDING],
            [order_type_1.OrderStatus.CANCELED]: [],
            [order_type_1.OrderStatus.REFUNDING]: [order_type_1.OrderStatus.REFUNDED],
            [order_type_1.OrderStatus.REFUNDED]: [],
        };
        return ((_a = allowedTransitions[currentStatus]) === null || _a === void 0 ? void 0 : _a.includes(targetStatus)) || false;
    }
};
exports.OrderStateManager = OrderStateManager;
exports.OrderStateManager = OrderStateManager = OrderStateManager_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        OrderExceptionHandler_1.OrderExceptionHandler,
        notification_service_1.NotificationService,
        order_statistics_service_1.OrderStatisticsService])
], OrderStateManager);
//# sourceMappingURL=OrderStateManager.js.map