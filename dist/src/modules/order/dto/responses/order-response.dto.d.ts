import { OrderStatus } from "@/types/order";
export declare class OrderItemResponseDto {
    id: string;
    productId: string;
    productName: string;
    productImage: string;
    specifications: Record<string, string>;
    price: number;
    quantity: number;
    amount: number;
}
export declare class OrderDetailResponseDto {
    id: string;
    userId: string;
    addressId: string;
    items: OrderItemResponseDto[];
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
    createdAt: Date;
    updatedAt: Date;
}
export declare class OrderListResponseDto {
    items: OrderDetailResponseDto[];
    total: number;
    page: number;
    pageSize: number;
}
export declare class CreateOrderResponseDto {
    orderId: string;
    totalAmount: number;
    paymentUrl?: string;
}
