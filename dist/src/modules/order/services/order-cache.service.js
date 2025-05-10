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
exports.OrderCacheService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("@nestjs-modules/ioredis");
const ioredis_2 = require("ioredis");
let OrderCacheService = class OrderCacheService {
    constructor(redis) {
        this.redis = redis;
        this.CACHE_TTL = 3600;
        this.ORDER_DETAIL_PREFIX = "order:detail:";
        this.ORDER_LIST_PREFIX = "order:list:";
    }
    async cacheOrderDetail(order) {
        const key = this.getOrderDetailKey(order.id);
        await this.redis.setex(key, this.CACHE_TTL, JSON.stringify(order));
    }
    async getCachedOrderDetail(orderId) {
        const key = this.getOrderDetailKey(orderId);
        const cached = await this.redis.get(key);
        return cached ? JSON.parse(cached) : null;
    }
    async cacheOrderList(userId, params, orders) {
        const key = this.getOrderListKey(userId, params);
        await this.redis.setex(key, this.CACHE_TTL, JSON.stringify(orders));
    }
    async getCachedOrderList(userId, params) {
        const key = this.getOrderListKey(userId, params);
        const cached = await this.redis.get(key);
        return cached ? JSON.parse(cached) : null;
    }
    async invalidateOrderCache(orderId) {
        const detailKey = this.getOrderDetailKey(orderId);
        await this.redis.del(detailKey);
        const listPattern = `${this.ORDER_LIST_PREFIX}*`;
        const keys = await this.redis.keys(listPattern);
        if (keys.length > 0) {
            await this.redis.del(...keys);
        }
    }
    getOrderDetailKey(orderId) {
        return `${this.ORDER_DETAIL_PREFIX}${orderId}`;
    }
    getOrderListKey(userId, params) {
        const sortedParams = Object.entries(params)
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
            .map(([key, value]) => `${key}:${value}`)
            .join(":");
        return `${this.ORDER_LIST_PREFIX}${userId}:${sortedParams}`;
    }
};
exports.OrderCacheService = OrderCacheService;
exports.OrderCacheService = OrderCacheService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, ioredis_1.InjectRedis)()),
    __metadata("design:paramtypes", [ioredis_2.default])
], OrderCacheService);
//# sourceMappingURL=order-cache.service.js.map