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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const order_service_1 = require("./order.service");
const order_owner_guard_1 = require("./guards/order-owner.guard");
const order_status_guard_1 = require("./guards/order-status.guard");
const order_status_decorator_1 = require("./decorators/order-status.decorator");
const order_1 = require("../../types/order");
const create_order_response_dto_1 = require("./dto/create-order-response.dto");
const create_order_dto_1 = require("./dto/create-order.dto");
const current_user_decorator_1 = require("./decorators/current-user.decorator");
const order_list_response_dto_1 = require("./dto/order-list-response.dto");
const order_query_dto_1 = require("./dto/order-query.dto");
const order_detail_response_dto_1 = require("./dto/order-detail-response.dto");
const cancel_order_dto_1 = require("./dto/cancel-order.dto");
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async createOrder(createOrderDto, user) {
        return await this.orderService.createOrder(Object.assign({ userId: user.id }, createOrderDto));
    }
    async getOrders(query, user) {
        return await this.orderService.getOrders(Object.assign({ userId: user.id }, query));
    }
    async getOrderDetail(id, user) {
        return await this.orderService.getOrderDetail(id, user.id);
    }
    async cancelOrder(id, cancelOrderDto, user) {
        return await this.orderService.cancelOrder({
            orderId: id,
            userId: user.id,
            reason: cancelOrderDto.reason,
        });
    }
    async confirmReceipt(id, user) {
        return await this.orderService.confirmReceipt(id, user.id);
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "创建订单" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: "订单创建成功",
        type: create_order_response_dto_1.CreateOrderResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: "请求参数错误",
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "获取订单列表" }),
    (0, swagger_1.ApiQuery)({ name: "status", enum: order_1.OrderStatus, required: false }),
    (0, swagger_1.ApiQuery)({ name: "page", type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: "pageSize", type: Number, required: false }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "订单列表",
        type: order_list_response_dto_1.OrderListResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_query_dto_1.OrderQueryDto, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, common_1.UseGuards)(order_owner_guard_1.OrderOwnerGuard),
    (0, swagger_1.ApiOperation)({ summary: "获取订单详情" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "订单ID" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "订单详情",
        type: order_detail_response_dto_1.OrderDetailResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: "订单不存在",
    }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrderDetail", null);
__decorate([
    (0, common_1.Post)(":id/cancel"),
    (0, common_1.UseGuards)(order_owner_guard_1.OrderOwnerGuard, order_status_guard_1.OrderStatusGuard),
    (0, order_status_decorator_1.AllowedOrderStatuses)(order_1.OrderStatus.PENDING_PAYMENT),
    (0, swagger_1.ApiOperation)({ summary: "取消订单" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "订单ID" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "订单取消成功",
    }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, cancel_order_dto_1.CancelOrderDto, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "cancelOrder", null);
__decorate([
    (0, common_1.Post)(":id/confirm-receipt"),
    (0, common_1.UseGuards)(order_owner_guard_1.OrderOwnerGuard, order_status_guard_1.OrderStatusGuard),
    (0, order_status_decorator_1.AllowedOrderStatuses)(order_1.OrderStatus.PENDING_RECEIPT),
    (0, swagger_1.ApiOperation)({ summary: "确认收货" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "订单ID" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "确认收货成功",
    }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "confirmReceipt", null);
exports.OrderController = OrderController = __decorate([
    (0, swagger_1.ApiTags)("orders"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("orders"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map