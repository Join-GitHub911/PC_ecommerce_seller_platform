import { Repository } from "typeorm";
import { Order } from "../modules/order/entities/order.entity";
import { OrderStatus } from "../types/order.type";
import { OrderExceptionHandler } from "./OrderExceptionHandler";
import { NotificationService } from "../modules/notification/notification.service";
import { OrderStatisticsService } from "../modules/statistics/order-statistics.service";
export declare class OrderStateManager {
    private orderRepository;
    private exceptionHandler;
    private notificationService;
    private orderStatisticsService;
    private readonly logger;
    constructor(orderRepository: Repository<Order>, exceptionHandler: OrderExceptionHandler, notificationService: NotificationService, orderStatisticsService: OrderStatisticsService);
    handlePaymentSuccess(params: {
        orderId: number;
        paymentId: number;
        amount: number;
        payTime: string;
    }): Promise<void>;
    handleShipping(orderId: number, trackingInfo?: {
        company: string;
        trackingNo: string;
    }): Promise<void>;
    handleDelivery(orderId: number): Promise<void>;
    handleCompletion(orderId: number): Promise<void>;
    handleCancellation(orderId: number, reason: string): Promise<void>;
    handleRefund(orderId: number, reason: string): Promise<void>;
    handleOrderExpiration(orderId: number): Promise<void>;
    updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order>;
    canTransitionTo(order: Order, targetStatus: OrderStatus): Promise<boolean>;
}
