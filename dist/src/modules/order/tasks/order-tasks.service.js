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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderTasksService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Order_1 = require("../entities/Order");
const order_type_1 = require("../types/order.type");
const event_emitter_1 = require("@nestjs/event-emitter");
const order_events_1 = require("../events/order.events");
const logger_1 = require("../../../utils/logger");
const order_service_1 = require("../services/order.service");
let OrderTasksService = class OrderTasksService {
    constructor(orderRepository, eventEmitter, orderService) {
        this.orderRepository = orderRepository;
        this.eventEmitter = eventEmitter;
        this.orderService = orderService;
    }
    async handleUnpaidOrders() {
        try {
            const timeLimit = new Date();
            timeLimit.setMinutes(timeLimit.getMinutes() - 30);
            const unpaidOrders = await this.orderRepository.find({
                where: {
                    status: order_type_1.OrderStatus.PENDING_PAYMENT,
                    createdAt: (0, typeorm_2.LessThan)(timeLimit),
                },
            });
            for (const order of unpaidOrders) {
                await this.orderRepository.update(order.id, {
                    status: order_type_1.OrderStatus.CANCELLED,
                    cancelReason: "超时未支付，系统自动取消",
                    cancelledAt: new Date(),
                    updatedAt: new Date(),
                });
                this.eventEmitter.emit(order_events_1.OrderEventType.CANCELLED, {
                    orderId: order.id,
                    userId: order.userId,
                    reason: "超时未支付，系统自动取消",
                });
            }
            logger_1.logger.info("Processed unpaid orders", {
                count: unpaidOrders.length,
            });
        }
        catch (error) {
            logger_1.logger.error("Failed to process unpaid orders", { error });
        }
    }
    async handlePendingReceiptOrders() {
        try {
            const timeLimit = new Date();
            timeLimit.setDate(timeLimit.getDate() - 15);
            const pendingOrders = await this.orderRepository.find({
                where: {
                    status: order_type_1.OrderStatus.PENDING_RECEIPT,
                    shipmentTime: (0, typeorm_2.LessThan)(timeLimit),
                },
            });
            for (const order of pendingOrders) {
                await this.orderRepository.update(order.id, {
                    status: order_type_1.OrderStatus.COMPLETED,
                    completionTime: new Date(),
                    updatedAt: new Date(),
                });
                this.eventEmitter.emit(order_events_1.OrderEventType.COMPLETED, {
                    orderId: order.id,
                    userId: order.userId,
                    autoConfirmed: true,
                });
            }
            logger_1.logger.info("Processed pending receipt orders", {
                count: pendingOrders.length,
            });
        }
        catch (error) {
            logger_1.logger.error("Failed to process pending receipt orders", { error });
        }
    }
    async handleExpiredAfterSales() {
        try {
            const timeLimit = new Date();
            timeLimit.setDate(timeLimit.getDate() - 7);
            await this.orderRepository
                .createQueryBuilder()
                .update("after_sale_orders")
                .set({
                status: "closed",
                remark: "超时未处理，系统自动关闭",
                updatedAt: new Date(),
            })
                .where("status = :status", { status: "pending" })
                .andWhere("created_at < :timeLimit", { timeLimit })
                .execute();
        }
        catch (error) {
            logger_1.logger.error("Failed to process expired after-sales", { error });
        }
    }
    async calculateOrderStatistics() {
        try {
            const now = new Date();
            const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
            const [orderCount, totalAmount] = await Promise.all([
                this.orderRepository.count({
                    where: {
                        createdAt: Between(hourAgo, now),
                    },
                }),
                this.orderRepository
                    .createQueryBuilder("order")
                    .select("SUM(order.finalAmount)", "total")
                    .where("order.createdAt BETWEEN :start AND :end", {
                    start: hourAgo,
                    end: now,
                })
                    .getRawOne(),
            ]);
            await this.statisticsService.saveHourlyStatistics({
                timestamp: hourAgo,
                orderCount,
                totalAmount: Number((totalAmount === null || totalAmount === void 0 ? void 0 : totalAmount.total) || 0),
            });
        }
        catch (error) {
            logger_1.logger.error("Failed to calculate order statistics", { error });
        }
    }
    async autoCommentOrders() {
        const orders = await this.orderService.findOrdersToAutoComment();
        for (const order of orders) {
            await this.orderService.autoCommentOrder(order.id);
        }
    }
};
exports.OrderTasksService = OrderTasksService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrderTasksService.prototype, "handleUnpaidOrders", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_2AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrderTasksService.prototype, "handlePendingReceiptOrders", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_3AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrderTasksService.prototype, "handleExpiredAfterSales", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrderTasksService.prototype, "calculateOrderStatistics", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrderTasksService.prototype, "autoCommentOrders", null);
exports.OrderTasksService = OrderTasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Order_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository, typeof (_a = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _a : Object, order_service_1.OrderService])
], OrderTasksService);
//# sourceMappingURL=order-tasks.service.js.map