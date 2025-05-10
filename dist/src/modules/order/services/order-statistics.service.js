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
exports.OrderStatisticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Order_1 = require("@/entities/Order");
const order_1 = require("../../../types/order");
const cache_service_1 = require("@/shared/services/cache.service");
let OrderStatisticsService = class OrderStatisticsService {
    constructor(orderRepository, cacheService) {
        this.orderRepository = orderRepository;
        this.cacheService = cacheService;
    }
    async getDailyStatistics(date) {
        const cacheKey = `order:stats:daily:${date.toISOString().split("T")[0]}`;
        const cached = await this.cacheService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const [totalOrders, totalAmount, completedOrders, cancelledOrders] = await Promise.all([
            this.orderRepository.count({
                where: {
                    createdAt: Between(startOfDay, endOfDay),
                },
            }),
            this.orderRepository
                .createQueryBuilder("order")
                .select("SUM(order.finalAmount)", "total")
                .where("order.createdAt BETWEEN :start AND :end", {
                start: startOfDay,
                end: endOfDay,
            })
                .getRawOne(),
            this.orderRepository.count({
                where: {
                    status: order_1.OrderStatus.COMPLETED,
                    createdAt: Between(startOfDay, endOfDay),
                },
            }),
            this.orderRepository.count({
                where: {
                    status: order_1.OrderStatus.CANCELLED,
                    createdAt: Between(startOfDay, endOfDay),
                },
            }),
        ]);
        const statistics = {
            date: date.toISOString().split("T")[0],
            totalOrders,
            totalAmount: Number((totalAmount === null || totalAmount === void 0 ? void 0 : totalAmount.total) || 0),
            completedOrders,
            cancelledOrders,
            completionRate: totalOrders ? (completedOrders / totalOrders) * 100 : 0,
            cancellationRate: totalOrders ? (cancelledOrders / totalOrders) * 100 : 0,
        };
        await this.cacheService.set(cacheKey, JSON.stringify(statistics), 24 * 60 * 60);
        return statistics;
    }
    async getProductRanking(params) {
        const { startDate, endDate, limit = 10 } = params;
        return this.orderRepository
            .createQueryBuilder("order")
            .leftJoin("order.items", "item")
            .select([
            "item.productId AS productId",
            "item.productName AS productName",
            "SUM(item.quantity) AS totalQuantity",
            "SUM(item.amount) AS totalAmount",
        ])
            .where("order.status = :status", { status: order_1.OrderStatus.COMPLETED })
            .andWhere("order.createdAt BETWEEN :start AND :end", {
            start: startDate,
            end: endDate,
        })
            .groupBy("item.productId")
            .orderBy("totalQuantity", "DESC")
            .limit(limit)
            .getRawMany();
    }
    async getUserStatistics(userId) {
        const [totalOrders, totalSpent, lastOrder] = await Promise.all([
            this.orderRepository.count({
                where: { userId, status: order_1.OrderStatus.COMPLETED },
            }),
            this.orderRepository
                .createQueryBuilder("order")
                .select("SUM(order.finalAmount)", "total")
                .where("order.userId = :userId", { userId })
                .andWhere("order.status = :status", {
                status: order_1.OrderStatus.COMPLETED,
            })
                .getRawOne(),
            this.orderRepository.findOne({
                where: { userId },
                order: { createdAt: "DESC" },
            }),
        ]);
        return {
            totalOrders,
            totalSpent: Number((totalSpent === null || totalSpent === void 0 ? void 0 : totalSpent.total) || 0),
            averageOrderAmount: totalOrders
                ? Number((totalSpent === null || totalSpent === void 0 ? void 0 : totalSpent.total) || 0) / totalOrders
                : 0,
            lastOrderDate: lastOrder === null || lastOrder === void 0 ? void 0 : lastOrder.createdAt,
        };
    }
};
exports.OrderStatisticsService = OrderStatisticsService;
exports.OrderStatisticsService = OrderStatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Order_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository, typeof (_a = typeof cache_service_1.CacheService !== "undefined" && cache_service_1.CacheService) === "function" ? _a : Object])
], OrderStatisticsService);
//# sourceMappingURL=order-statistics.service.js.map