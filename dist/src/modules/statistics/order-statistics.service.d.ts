import { Repository } from 'typeorm';
import { OrderStatistics } from './entities/order-statistics.entity';
import { Order } from '../order/entities/order.entity';
export declare class OrderStatisticsService {
    private orderStatsRepository;
    private orderRepository;
    private readonly logger;
    constructor(orderStatsRepository: Repository<OrderStatistics>, orderRepository: Repository<Order>);
    recordOrderCreated(orderId: number, amount: number): Promise<void>;
    recordOrderPaid(orderId: number, amount: number): Promise<void>;
    recordOrderCanceled(orderId: number, reason: string): Promise<void>;
    recordOrderRefunded(orderId: number, amount: number, reason: string): Promise<void>;
    getDailyStatistics(startDate: Date, endDate: Date): Promise<any>;
    getMonthlyStatistics(year: number): Promise<any>;
    getOrderStatusCount(): Promise<any>;
    getRevenueByDateRange(startDate: Date, endDate: Date): Promise<number>;
    getTopSellingProducts(limit?: number): Promise<any>;
}
