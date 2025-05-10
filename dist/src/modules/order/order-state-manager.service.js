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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStateManager = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const order_1 = require("../../types/order");
const order_event_interface_1 = require("./interfaces/order-event.interface");
const order_exception_handler_service_1 = require("./order-exception-handler.service");
const notification_service_1 = require("../notification/notification.service");
const inventory_service_1 = require("../inventory/inventory.service");
const payment_service_1 = require("../payment/payment.service");
let OrderStateManager = class OrderStateManager {
    constructor(eventEmitter, exceptionHandler, notificationService, inventoryService, paymentService) {
        this.eventEmitter = eventEmitter;
        this.exceptionHandler = exceptionHandler;
        this.notificationService = notificationService;
        this.inventoryService = inventoryService;
        this.paymentService = paymentService;
        this.stateTransitions = new Map([
            [
                order_1.OrderStatus.PENDING_PAYMENT,
                new Set([order_1.OrderStatus.PENDING_SHIPMENT, order_1.OrderStatus.CANCELLED]),
            ],
            [
                order_1.OrderStatus.PENDING_SHIPMENT,
                new Set([order_1.OrderStatus.PENDING_RECEIPT, order_1.OrderStatus.CANCELLED]),
            ],
            [order_1.OrderStatus.PENDING_RECEIPT, new Set([order_1.OrderStatus.COMPLETED])],
            [order_1.OrderStatus.COMPLETED, new Set()],
            [order_1.OrderStatus.CANCELLED, new Set()],
        ]);
    }
    validateStateTransition(currentStatus, newStatus) {
        const allowedTransitions = this.stateTransitions.get(currentStatus);
        return (allowedTransitions === null || allowedTransitions === void 0 ? void 0 : allowedTransitions.has(newStatus)) || false;
    }
    async emitOrderEvent(event) {
        try {
            await this.eventEmitter.emit("order.event", event);
        }
        catch (error) {
            console.error("Failed to emit order event:", error);
        }
    }
    async handlePaymentSuccess(params) {
        const { orderId, paymentId, amount, payTime } = params;
        try {
            const order = await this.orderRepository.findOne({
                where: { id: orderId },
            });
            if (!order) {
                this.exceptionHandler.handleOrderNotFound(orderId);
            }
            if (!this.validateStateTransition(order.status, order_1.OrderStatus.PENDING_SHIPMENT)) {
                this.exceptionHandler.handleInvalidStatus(orderId, order.status, order_1.OrderStatus.PENDING_SHIPMENT);
            }
            await this.orderRepository.update(orderId, {
                status: order_1.OrderStatus.PENDING_SHIPMENT,
                paymentId,
                paymentTime: new Date(payTime),
                updatedAt: new Date(),
            });
            await this.inventoryService.lockInventory(orderId);
            await this.notificationService.sendOrderStatusNotification({
                orderId,
                status: order_1.OrderStatus.PENDING_SHIPMENT,
                userId: order.userId,
            });
            await this.emitOrderEvent({
                orderId,
                userId: order.userId,
                type: order_event_interface_1.OrderEventType.PAID,
                data: { paymentId, amount },
                timestamp: new Date(),
            });
        }
        catch (error) {
            await this.handlePaymentFailure(orderId, error);
            throw error;
        }
    }
    async handleShipment(params) {
        const { orderId, trackingNumber, carrier } = params;
        try {
            const order = await this.orderRepository.findOne({
                where: { id: orderId },
            });
            if (!order) {
                this.exceptionHandler.handleOrderNotFound(orderId);
            }
            if (!this.validateStateTransition(order.status, order_1.OrderStatus.PENDING_RECEIPT)) {
                this.exceptionHandler.handleInvalidStatus(orderId, order.status, order_1.OrderStatus.PENDING_RECEIPT);
            }
            await this.orderRepository.update(orderId, {
                status: order_1.OrderStatus.PENDING_RECEIPT,
                trackingNumber,
                carrier,
                shipmentTime: new Date(),
                updatedAt: new Date(),
            });
            await this.inventoryService.deductInventory(orderId);
            await this.notificationService.sendOrderStatusNotification({
                orderId,
                status: order_1.OrderStatus.PENDING_RECEIPT,
                userId: order.userId,
                trackingNumber,
                carrier,
            });
            await this.emitOrderEvent({
                orderId,
                userId: order.userId,
                type: order_event_interface_1.OrderEventType.SHIPPED,
                data: { trackingNumber, carrier },
                timestamp: new Date(),
            });
        }
        catch (error) {
            this.exceptionHandler.handleShipmentError(orderId, error);
        }
    }
};
exports.OrderStateManager = OrderStateManager;
exports.OrderStateManager = OrderStateManager = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _a : Object, typeof (_b = typeof order_exception_handler_service_1.OrderExceptionHandler !== "undefined" && order_exception_handler_service_1.OrderExceptionHandler) === "function" ? _b : Object, notification_service_1.NotificationService, typeof (_c = typeof inventory_service_1.InventoryService !== "undefined" && inventory_service_1.InventoryService) === "function" ? _c : Object, payment_service_1.PaymentService])
], OrderStateManager);
//# sourceMappingURL=order-state-manager.service.js.map