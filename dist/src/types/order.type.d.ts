export declare enum OrderStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    PROCESSING = "PROCESSING",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED",
    REFUNDING = "REFUNDING",
    REFUNDED = "REFUNDED"
}
export interface CreateOrderParams {
    userId: number;
    items: Array<{
        productId: number;
        quantity: number;
        specifications?: Record<string, any>;
    }>;
    addressId: number;
    couponId?: number;
    remark?: string;
}
export interface CancelOrderParams {
    orderId: number;
    reason: string;
}
export interface RefundParams {
    orderId: number;
    reason: string;
    items?: Array<{
        orderItemId: number;
        quantity: number;
    }>;
}
export interface OrderItem {
    productId: number;
    quantity: number;
    price: number;
}
export interface CreateOrderDto {
    userId: number;
    items: OrderItem[];
    address: {
        receiver: string;
        phone: string;
        province: string;
        city: string;
        district: string;
        detail: string;
        postalCode?: string;
    };
}
export interface UpdateOrderDto {
    status?: OrderStatus;
    paymentMethod?: string;
    cancelReason?: string;
}
export interface OrderQueryParams {
    userId?: number;
    status?: OrderStatus;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
}
