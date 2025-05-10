import { Order } from './order.entity';
export declare class OrderAddress {
    id: string;
    orderId: string;
    order: Order;
    receiver: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    detail: string;
    postalCode: string;
}
