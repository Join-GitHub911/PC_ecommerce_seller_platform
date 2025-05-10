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
exports.OrderEventListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const notification_service_1 = require("@/modules/notification/notification.service");
const inventory_service_1 = require("@/modules/inventory/inventory.service");
const order_event_interface_1 = require("../interfaces/order-event.interface");
const logger_1 = require("../../../utils/logger");
let OrderEventListener = class OrderEventListener {
    constructor(notificationService, inventoryService) {
        this.notificationService = notificationService;
        this.inventoryService = inventoryService;
    }
    async handleOrderEvent(event) {
        try {
            logger_1.logger.info("Handling order event", { event });
            switch (event.type) {
                case order_event_interface_1.OrderEventType.CREATED:
                    await this.handleOrderCreated(event);
                    break;
                case order_event_interface_1.OrderEventType.PAID:
                    await this.handleOrderPaid(event);
                    break;
                case order_event_interface_1.OrderEventType.SHIPPED:
                    await this.handleOrderShipped(event);
                    break;
                case order_event_interface_1.OrderEventType.COMPLETED:
                    await this.handleOrderCompleted(event);
                    break;
                case order_event_interface_1.OrderEventType.CANCELLED:
                    await this.handleOrderCancelled(event);
                    break;
                default:
                    logger_1.logger.warn("Unknown order event type", { event });
            }
        }
        catch (error) {
            logger_1.logger.error("Failed to handle order event", { error, event });
        }
    }
    async handleOrderCreated(event) {
        await this.notificationService.sendOrderCreatedNotification({
            orderId: event.orderId,
            userId: event.userId,
        });
        await this.inventoryService.preLockInventory(event.orderId);
    }
    async handleOrderPaid(event) {
        await this.notificationService.sendPaymentSuccessNotification({
            orderId: event.orderId,
            userId: event.userId,
            amount: event.data.amount,
        });
        await this.inventoryService.confirmInventoryLock(event.orderId);
    }
    async handleOrderShipped(event) {
        await this.notificationService.sendShipmentNotification({
            orderId: event.orderId,
            userId: event.userId,
            trackingNumber: event.data.trackingNumber,
            carrier: event.data.carrier,
        });
    }
    async handleOrderCompleted(event) {
        await this.notificationService.sendOrderCompletedNotification({
            orderId: event.orderId,
            userId: event.userId,
        });
        await this.updateProductSales(event.orderId);
    }
    async handleOrderCancelled(event) {
        await this.notificationService.sendOrderCancelledNotification({
            orderId: event.orderId,
            userId: event.userId,
            reason: event.data.reason,
        });
        await this.inventoryService.releaseInventory(event.orderId);
    }
    async updateProductSales(orderId) {
    }
};
exports.OrderEventListener = OrderEventListener;
__decorate([
    (0, event_emitter_1.OnEvent)("order.event"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof order_event_interface_1.IOrderEvent !== "undefined" && order_event_interface_1.IOrderEvent) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], OrderEventListener.prototype, "handleOrderEvent", null);
exports.OrderEventListener = OrderEventListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _a : Object, typeof (_b = typeof inventory_service_1.InventoryService !== "undefined" && inventory_service_1.InventoryService) === "function" ? _b : Object])
], OrderEventListener);
//# sourceMappingURL=order-event.listener.js.map