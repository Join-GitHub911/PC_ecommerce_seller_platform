import { Repository } from "typeorm";
import { Order } from "@/entities/Order";
import { ReviewService } from "../../review/services/review.service";
import { OrderStatus } from "@/types/order";
export declare class OrderService {
    private readonly orderRepository;
    private readonly reviewService;
    constructor(orderRepository: Repository<Order>, reviewService: ReviewService);
    findById(orderId: string): Promise<Order & {
        userId: string;
        status: OrderStatus;
    }>;
    addRemark(orderId: string, remark: string, userId: string): Promise<any>;
    urgeOrder(orderId: string, userId: string): Promise<any>;
    findOrdersToAutoComment(): Promise<Order[]>;
    autoCommentOrder(orderId: string): Promise<void>;
    splitOrder(orderId: string, splitRules: any): Promise<Order[]>;
    mergeOrders(orderIds: string[]): Promise<Order>;
    mergePay(orderIds: string[]): Promise<any>;
}
