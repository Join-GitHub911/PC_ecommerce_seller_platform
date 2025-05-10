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
var OrderStatisticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatisticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_statistics_entity_1 = require("./entities/order-statistics.entity");
const order_type_1 = require("../../types/order.type");
const order_entity_1 = require("../order/entities/order.entity");
let OrderStatisticsService = OrderStatisticsService_1 = class OrderStatisticsService {
    constructor(orderStatsRepository, orderRepository) {
        this.orderStatsRepository = orderStatsRepository;
        this.orderRepository = orderRepository;
        this.logger = new common_1.Logger(OrderStatisticsService_1.name);
    }
    async recordOrderCreated(orderId, amount) {
        const stats = this.orderStatsRepository.create({
            orderId,
            action: 'created',
            amount,
            date: new Date()
        });
        await this.orderStatsRepository.save(stats);
        this.logger.log(`Recorded order created: ${orderId}, amount: ${amount}`);
    }
    async recordOrderPaid(orderId, amount) {
        const stats = this.orderStatsRepository.create({
            orderId,
            action: 'paid',
            amount,
            date: new Date()
        });
        await this.orderStatsRepository.save(stats);
        this.logger.log(`Recorded order paid: ${orderId}, amount: ${amount}`);
    }
    async recordOrderCanceled(orderId, reason) {
        const order = await this.orderRepository.findOne({
            where: { id: Number(orderId) }
        });
        if (!order) {
            this.logger.warn(`Cannot record canceled order: Order ${orderId} not found`);
            return;
        }
        const stats = this.orderStatsRepository.create({
            orderId,
            action: 'canceled',
            amount: order.actualAmount,
            data: { reason },
            date: new Date()
        });
        await this.orderStatsRepository.save(stats);
        this.logger.log(`Recorded order canceled: ${orderId}, reason: ${reason}`);
    }
    async recordOrderRefunded(orderId, amount, reason) {
        const stats = this.orderStatsRepository.create({
            orderId,
            action: 'refunded',
            amount,
            data: { reason },
            date: new Date()
        });
        await this.orderStatsRepository.save(stats);
        this.logger.log(`Recorded order refunded: ${orderId}, amount: ${amount}, reason: ${reason}`);
    }
    async getDailyStatistics(startDate, endDate) {
        const result = await this.orderStatsRepository
            .createQueryBuilder('stats')
            .select("DATE(stats.date)", "day")
            .addSelect("COUNT(DISTINCT stats.orderId) FILTER (WHERE stats.action = 'created')", "created")
            .addSelect("COUNT(DISTINCT stats.orderId) FILTER (WHERE stats.action = 'paid')", "paid")
            .addSelect("COUNT(DISTINCT stats.orderId) FILTER (WHERE stats.action = 'canceled')", "canceled")
            .addSelect("COUNT(DISTINCT stats.orderId) FILTER (WHERE stats.action = 'refunded')", "refunded")
            .addSelect("SUM(stats.amount) FILTER (WHERE stats.action = 'paid')", "revenue")
            .addSelect("SUM(stats.amount) FILTER (WHERE stats.action = 'refunded')", "refundAmount")
            .where("stats.date BETWEEN :startDate AND :endDate", { startDate, endDate })
            .groupBy("DATE(stats.date)")
            .orderBy("DATE(stats.date)", "ASC")
            .getRawMany();
        return result;
    }
    async getMonthlyStatistics(year) {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59);
        const result = await this.orderStatsRepository
            .createQueryBuilder('stats')
            .select("MONTH(stats.date)", "month")
            .addSelect("COUNT(DISTINCT stats.orderId) FILTER (WHERE stats.action = 'created')", "created")
            .addSelect("COUNT(DISTINCT stats.orderId) FILTER (WHERE stats.action = 'paid')", "paid")
            .addSelect("COUNT(DISTINCT stats.orderId) FILTER (WHERE stats.action = 'canceled')", "canceled")
            .addSelect("COUNT(DISTINCT stats.orderId) FILTER (WHERE stats.action = 'refunded')", "refunded")
            .addSelect("SUM(stats.amount) FILTER (WHERE stats.action = 'paid')", "revenue")
            .addSelect("SUM(stats.amount) FILTER (WHERE stats.action = 'refunded')", "refundAmount")
            .where("stats.date BETWEEN :startDate AND :endDate", { startDate, endDate })
            .groupBy("MONTH(stats.date)")
            .orderBy("MONTH(stats.date)", "ASC")
            .getRawMany();
        return result;
    }
    async getOrderStatusCount() {
        const result = await this.orderRepository
            .createQueryBuilder('order')
            .select('order.status', 'status')
            .addSelect('COUNT(order.id)', 'count')
            .groupBy('order.status')
            .getRawMany();
        const statusCounts = {};
        for (const status of Object.values(order_type_1.OrderStatus)) {
            statusCounts[status] = 0;
        }
        for (const item of result) {
            statusCounts[item.status] = parseInt(item.count);
        }
        return statusCounts;
    }
    async getRevenueByDateRange(startDate, endDate) {
        const result = await this.orderStatsRepository
            .createQueryBuilder('stats')
            .select("SUM(stats.amount)", "revenue")
            .where("stats.action = 'paid'")
            .andWhere("stats.date BETWEEN :startDate AND :endDate", { startDate, endDate })
            .getRawOne();
        return result.revenue ? parseFloat(result.revenue) : 0;
    }
    async getTopSellingProducts(limit = 10) {
        const result = await this.orderRepository
            .createQueryBuilder('order')
            .innerJoin('order.items', 'item')
            .innerJoin('item.product', 'product')
            .select('product.id', 'productId')
            .addSelect('product.name', 'productName')
            .addSelect('SUM(item.quantity)', 'totalSold')
            .addSelect('SUM(item.price * item.quantity)', 'totalRevenue')
            .where("order.status IN (:...statuses)", { statuses: [order_type_1.OrderStatus.PAID, order_type_1.OrderStatus.SHIPPED, order_type_1.OrderStatus.DELIVERED, order_type_1.OrderStatus.COMPLETED] })
            .groupBy('product.id')
            .addGroupBy('product.name')
            .orderBy('totalSold', 'DESC')
            .limit(limit)
            .getRawMany();
        return result;
    }
};
exports.OrderStatisticsService = OrderStatisticsService;
exports.OrderStatisticsService = OrderStatisticsService = OrderStatisticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_statistics_entity_1.OrderStatistics)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], OrderStatisticsService);
//# sourceMappingURL=order-statistics.service.js.map