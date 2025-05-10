import { Order } from './order.entity';
export declare class OrderItem {
    id: string;
    orderId: string;
    order: Order;
    productId: string;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
    totalAmount: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
