import { Repository } from "typeorm";
import { Order } from "@/entities/Order";
import { CacheService } from "@/shared/services/cache.service";
export declare class OrderStatisticsService {
    private orderRepository;
    private cacheService;
    constructor(orderRepository: Repository<Order>, cacheService: CacheService);
    getDailyStatistics(date: Date): Promise<any>;
    getProductRanking(params: {
        startDate: Date;
        endDate: Date;
        limit?: number;
    }): Promise<any[]>;
    getUserStatistics(userId: string): Promise<{
        totalOrders: any;
        totalSpent: number;
        averageOrderAmount: number;
        lastOrderDate: any;
    }>;
}
