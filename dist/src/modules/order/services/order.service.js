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
const Order_1 = require("@/entities/Order");
const review_service_1 = require("../../review/services/review.service");
let OrderService = class OrderService {
    constructor(orderRepository, reviewService) {
        this.orderRepository = orderRepository;
        this.reviewService = reviewService;
    }
    async findById(orderId) {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ["user", "items"],
        });
        if (!order)
            throw new common_1.NotFoundException("订单不存在");
        return order;
    }
    async addRemark(orderId, remark, userId) {
        const order = await this.findById(orderId);
        if (order.userId !== userId)
            throw new common_1.ForbiddenException("无权操作");
        order.remark = remark;
        return this.orderRepository.save(order);
    }
    async urgeOrder(orderId, userId) {
        const order = await this.findById(orderId);
        if (order.userId !== userId)
            throw new common_1.ForbiddenException("无权操作");
        order.isUrged = true;
        return this.orderRepository.save(order);
    }
    async findOrdersToAutoComment() {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return this.orderRepository.find({
            where: {
                status: "completed",
                isAutoCommented: false,
                completedAt: { $lte: sevenDaysAgo },
            },
        });
    }
    async autoCommentOrder(orderId) {
        const order = await this.findById(orderId);
        if (order.isAutoCommented)
            return;
        const hasReview = await this.reviewService.hasOrderReview(orderId);
        if (!hasReview) {
            await this.reviewService.createAutoReview(order);
        }
        order.isAutoCommented = true;
        await this.orderRepository.save(order);
    }
    async splitOrder(orderId, splitRules) {
    }
    async mergeOrders(orderIds) {
    }
    async mergePay(orderIds) {
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Order_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        review_service_1.ReviewService])
], OrderService);
//# sourceMappingURL=order.service.js.map