import Redis from "ioredis";
import { Order } from "@/entities/Order";
export declare class OrderCacheService {
    private readonly redis;
    private readonly CACHE_TTL;
    private readonly ORDER_DETAIL_PREFIX;
    private readonly ORDER_LIST_PREFIX;
    constructor(redis: Redis);
    cacheOrderDetail(order: Order): Promise<void>;
    getCachedOrderDetail(orderId: string): Promise<Order | null>;
    cacheOrderList(userId: string, params: Record<string, any>, orders: Order[]): Promise<void>;
    getCachedOrderList(userId: string, params: Record<string, any>): Promise<Order[] | null>;
    invalidateOrderCache(orderId: string): Promise<void>;
    private getOrderDetailKey;
    private getOrderListKey;
}
