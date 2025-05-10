import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderQueryDto } from "./dto/order-query.dto";
import { CancelOrderDto } from "./dto/cancel-order.dto";
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    createOrder(createOrderDto: CreateOrderDto, user: any): Promise<{
        orderId: string;
        status: string;
    }>;
    getOrders(query: OrderQueryDto, user: any): Promise<{
        total: number;
        list: any[];
    }>;
    getOrderDetail(id: string, user: any): Promise<{
        orderId: string;
        status: string;
        items: any[];
    }>;
    cancelOrder(id: string, cancelOrderDto: CancelOrderDto, user: any): Promise<{
        success: boolean;
    }>;
    confirmReceipt(id: string, user: any): Promise<{
        success: boolean;
    }>;
}
