export declare enum OrderStatus {
    PENDING = "pending",
    PAID = "paid",
    SHIPPED = "shipped",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}
export interface CancelOrderParams {
    orderId: string;
    reason: string;
}
export interface RefundParams {
    orderId: string;
    reason: string;
    amount?: number;
}
export interface OrderEvent {
    type: string;
    orderId: string;
    data?: any;
}
