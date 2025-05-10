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
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const nestjs_i18n_1 = require("nestjs-i18n");
const swagger_1 = require("@nestjs/swagger");
const order_service_1 = require("../services/order.service");
const dto_1 = require("../dto");
const user_decorator_1 = require("../decorators/user.decorator");
const user_entity_1 = require("../entities/user.entity");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
const user_decorator_2 = require("../../../shared/decorators/user.decorator");
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async createOrder(createOrderDto, user) {
        return this.orderService.createOrder(createOrderDto, user);
    }
    async getOrderDetail(id) {
        return this.orderService.getOrderDetail(id);
    }
    async payOrder(id, paymentDto) {
        return this.orderService.processPayment(id, paymentDto);
    }
    async cancelOrder(id) {
        return this.orderService.cancelOrder(id);
    }
    async getOrders(queryParams) {
        return this.orderService.getOrders(queryParams);
    }
    async requestRefund(id, refundDto) {
        return this.orderService.requestRefund(id, refundDto);
    }
    async addRemark(id, user, remark) {
        return this.orderService.addRemark(id, remark, user.id);
    }
    async urgeOrder(id, user) {
        return this.orderService.urgeOrder(id, user.id);
    }
    hello(i18n) {
        return i18n.t("HELLO", { args: { username: "Tom" } });
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "创建订单" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "订单创建成功",
        type: dto_1.OrderResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "无效的请求参数" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof dto_1.CreateOrderDto !== "undefined" && dto_1.CreateOrderDto) === "function" ? _a : Object, typeof (_b = typeof user_entity_1.UserEntity !== "undefined" && user_entity_1.UserEntity) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "获取订单详情" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "成功获取订单详情",
        type: dto_1.OrderDetailResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "订单不存在" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrderDetail", null);
__decorate([
    (0, common_1.Post)(":id/pay"),
    (0, swagger_1.ApiOperation)({ summary: "订单支付" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "支付请求处理成功",
        type: dto_1.PaymentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "无效的支付请求" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof dto_1.CreatePaymentDto !== "undefined" && dto_1.CreatePaymentDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "payOrder", null);
__decorate([
    (0, common_1.Post)(":id/cancel"),
    (0, swagger_1.ApiOperation)({ summary: "取消订单" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "订单取消成功",
        type: dto_1.OrderResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "订单无法取消" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "cancelOrder", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "获取订单列表" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "成功获取订单列表",
        type: dto_1.OrderListResponseDto,
    }),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof dto_1.OrderQueryParamsDto !== "undefined" && dto_1.OrderQueryParamsDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Post)(":id/refund"),
    (0, swagger_1.ApiOperation)({ summary: "申请退款" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "退款申请提交成功",
        type: dto_1.RefundResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "无效的退款申请" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof dto_1.CreateRefundDto !== "undefined" && dto_1.CreateRefundDto) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "requestRefund", null);
__decorate([
    (0, common_1.Post)(":id/remark"),
    (0, swagger_1.ApiOperation)({ summary: "添加订单备注" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, user_decorator_2.CurrentUser)()),
    __param(2, (0, common_1.Body)("remark")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_f = typeof user_decorator_1.User !== "undefined" && user_decorator_1.User) === "function" ? _f : Object, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "addRemark", null);
__decorate([
    (0, common_1.Post)(":id/urge"),
    (0, swagger_1.ApiOperation)({ summary: "催单" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, user_decorator_2.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_g = typeof user_decorator_1.User !== "undefined" && user_decorator_1.User) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "urgeOrder", null);
__decorate([
    (0, common_1.Get)(":id/hello"),
    __param(0, (0, nestjs_i18n_1.I18n)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [nestjs_i18n_1.I18nContext]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "hello", null);
exports.OrderController = OrderController = __decorate([
    (0, swagger_1.ApiTags)("orders"),
    (0, common_1.Controller)("orders"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map