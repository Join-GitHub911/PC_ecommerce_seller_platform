import { Repository } from "typeorm";
import { Order } from "../entities/Order";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { OrderService } from "../services/order.service";
export declare class OrderTasksService {
    private readonly orderRepository;
    private readonly eventEmitter;
    private readonly orderService;
    constructor(orderRepository: Repository<Order>, eventEmitter: EventEmitter2, orderService: OrderService);
    handleUnpaidOrders(): Promise<void>;
    handlePendingReceiptOrders(): Promise<void>;
    handleExpiredAfterSales(): Promise<void>;
    calculateOrderStatistics(): Promise<void>;
    autoCommentOrders(): Promise<void>;
}
