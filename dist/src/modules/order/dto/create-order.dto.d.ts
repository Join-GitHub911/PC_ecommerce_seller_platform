import { PaymentMethod } from '../entities/order.entity';
import { AddressType } from '../entities/order-address.entity';
export declare class OrderItemDto {
    productId: number;
    skuId?: number;
    quantity: number;
}
export declare class OrderAddressDto {
    type: AddressType;
    receiver: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    detail: string;
    postalCode?: string;
    isDefault?: boolean;
}
export declare class CreateOrderDto {
    paymentMethod: PaymentMethod;
    items: OrderItemDto[];
    addresses: OrderAddressDto[];
    remark?: string;
    couponId?: number;
}
