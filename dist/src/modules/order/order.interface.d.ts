import { OrderStatus } from "@/types/order";
export interface IOrderItem {
    id: string;
    productId: string;
    productName: string;
    productImage: string;
    specifications: Record<string, string>;
    price: number;
    quantity: number;
    amount: number;
}
export interface IOrder {
    id: string;
    userId: string;
    addressId: string;
    items: IOrderItem[];
    totalAmount: number;
    deliveryFee: number;
    discount?: number;
    finalAmount: number;
    status: OrderStatus;
    paymentId?: string;
    paymentTime?: Date;
    trackingNumber?: string;
    carrier?: string;
    shipmentTime?: Date;
    completionTime?: Date;
    cancelReason?: string;
    cancelledBy?: string;
    cancelledAt?: Date;
    remark?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IOrderEvent {
    orderId: string;
    userId: string;
    type: OrderEventType;
    data?: any;
    timestamp: Date;
}
export declare enum OrderEventType {
    CREATED = "created",
    PAID = "paid",
    SHIPPED = "shipped",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    REFUND_REQUESTED = "refund_requested",
    REFUND_APPROVED = "refund_approved",
    REFUND_REJECTED = "refund_rejected"
}
export interface IOrderService {
    createOrder(params: CreateOrderParams): Promise<IOrder>;
    getOrderDetail(orderId: string, userId: string): Promise<IOrder>;
    getOrders(params: OrderQueryParams): Promise<OrderListResult>;
    cancelOrder(params: CancelOrderParams): Promise<void>;
    confirmReceipt(orderId: string, userId: string): Promise<void>;
    applyRefund(params: RefundParams): Promise<void>;
}
export interface CreateOrderParams {
    userId: string;
    items: Array<{
        productId: string;
        quantity: number;
        specifications: Record<string, string>;
    }>;
    addressId: string;
    remark?: string;
}
export interface OrderQueryParams {
    userId: string;
    status?: OrderStatus;
    page: number;
    pageSize: number;
    startDate?: Date;
    endDate?: Date;
    keyword?: string;
}
export interface OrderListResult {
    items: IOrder[];
    total: number;
    page: number;
    pageSize: number;
}
