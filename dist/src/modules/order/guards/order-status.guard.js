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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderOwnerGuard = exports.OrderStatusGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const order_service_1 = require("../order.service");
const order_status_decorator_1 = require("../decorators/order-status.decorator");
let OrderStatusGuard = class OrderStatusGuard {
    constructor(reflector, orderService) {
        this.reflector = reflector;
        this.orderService = orderService;
    }
    async canActivate(context) {
        const allowedStatuses = this.reflector.get(order_status_decorator_1.ALLOWED_STATUSES, context.getHandler());
        if (!allowedStatuses) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const orderId = request.params.id;
        const userId = request.user.id;
        const order = await this.orderService.getOrderDetail(orderId, userId);
        return allowedStatuses.includes(order.status);
    }
};
exports.OrderStatusGuard = OrderStatusGuard;
exports.OrderStatusGuard = OrderStatusGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        order_service_1.OrderService])
], OrderStatusGuard);
let OrderOwnerGuard = class OrderOwnerGuard {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const orderId = request.params.id;
        const userId = request.user.id;
        const order = await this.orderService.getOrderDetail(orderId, userId);
        return order.userId === userId;
    }
};
exports.OrderOwnerGuard = OrderOwnerGuard;
exports.OrderOwnerGuard = OrderOwnerGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderOwnerGuard);
//# sourceMappingURL=order-status.guard.js.map