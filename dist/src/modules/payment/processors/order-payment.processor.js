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
var OrderPaymentProcessor_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderPaymentProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const bull_2 = require("bull");
const order_service_1 = require("../../order/order.service");
const OrderStateManager_1 = require("../../../services/OrderStateManager");
let OrderPaymentProcessor = OrderPaymentProcessor_1 = class OrderPaymentProcessor {
    constructor(orderService, orderStateManager) {
        this.orderService = orderService;
        this.orderStateManager = orderStateManager;
        this.logger = new common_1.Logger(OrderPaymentProcessor_1.name);
    }
    async handleOrderExpiration(job) {
        const { orderId } = job.data;
        this.logger.log(`Processing order expiration for order ${orderId}`);
        try {
            await this.orderStateManager.handleOrderExpiration(orderId);
            this.logger.log(`Successfully processed order expiration for order ${orderId}`);
        }
        catch (error) {
            this.logger.error(`Failed to process order expiration for order ${orderId}`, error.stack);
            throw error;
        }
    }
};
exports.OrderPaymentProcessor = OrderPaymentProcessor;
__decorate([
    (0, bull_1.Process)('order-expiration'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof bull_2.Job !== "undefined" && bull_2.Job) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], OrderPaymentProcessor.prototype, "handleOrderExpiration", null);
exports.OrderPaymentProcessor = OrderPaymentProcessor = OrderPaymentProcessor_1 = __decorate([
    (0, bull_1.Processor)('orders'),
    __metadata("design:paramtypes", [order_service_1.OrderService,
        OrderStateManager_1.OrderStateManager])
], OrderPaymentProcessor);
//# sourceMappingURL=order-payment.processor.js.map