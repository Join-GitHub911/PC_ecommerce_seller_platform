import { Repository } from "typeorm";
import { Order } from "@/entities/order.entity";
import { OrderItem } from "@/entities/order-item.entity";
import { Cart } from "@/entities/cart.entity";
import { Product } from "@/entities/product.entity";
import { OrderStatus } from "@/types/order.type";
import { OrderStateManager } from "./OrderStateManager";
import { OrderExceptionHandler } from "./OrderExceptionHandler";
export declare class OrderService {
    private orderRepository;
    private orderItemRepository;
    private cartRepository;
    private productRepository;
    private orderStateManager;
    private exceptionHandler;
    constructor(orderRepository: Repository<Order>, orderItemRepository: Repository<OrderItem>, cartRepository: Repository<Cart>, productRepository: Repository<Product>, orderStateManager: OrderStateManager, exceptionHandler: OrderExceptionHandler);
    createOrder(params: {
        userId: string;
        items: Array<{
            productId: string;
            quantity: number;
            specifications: Record<string, string>;
        }>;
        addressId: string;
        remark?: string;
    }): Promise<Order>;
    getOrders(params: {
        userId: string;
        status?: OrderStatus;
        page: number;
        pageSize: number;
        startDate?: Date;
        endDate?: Date;
        keyword?: string;
    }): Promise<{
        items: Order[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    getOrderDetail(orderId: string, userId: string): Promise<Order>;
    handlePaymentSuccess(params: {
        orderId: string;
        paymentId: string;
        amount: number;
        payTime: string;
    }): Promise<boolean>;
    sendPaymentNotification(orderId: string): Promise<boolean>;
    confirmReceipt(orderId: string, userId: string): Promise<{
        success: boolean;
    }>;
    cancelOrder(params: {
        orderId: string;
        userId: string;
        reason: string;
    }): Promise<{
        success: boolean;
    }>;
}
