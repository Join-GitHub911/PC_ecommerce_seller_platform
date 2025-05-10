import { Order } from './order.entity';
export declare enum AddressType {
    SHIPPING = "shipping",
    BILLING = "billing"
}
export declare class OrderAddress {
    id: number;
    orderId: number;
    order: Order;
    receiver: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    detail: string;
    postalCode: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}
