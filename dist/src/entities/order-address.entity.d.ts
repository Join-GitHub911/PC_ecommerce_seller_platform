import { Order } from './order.entity';
export declare class OrderAddress {
    id: string;
    orderId: string;
    order: Order;
    name: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    detail: string;
    postalCode: string;
    createdAt: Date;
    updatedAt: Date;
}
