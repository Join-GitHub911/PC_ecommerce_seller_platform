import { User } from "../../user/entities/user.entity";
import { OrderItem } from "./order-item.entity";
import { OrderAddress } from "./order-address.entity";
import { OrderStatus } from "../../../types/order.type";
export declare enum PaymentMethod {
    ALIPAY = "alipay",
    WECHAT = "wechat",
    CREDIT_CARD = "credit_card",
    CASH = "cash"
}
export declare class Order {
    id: number;
    orderNo: string;
    userId: number;
    user: User;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    totalAmount: number;
    actualAmount: number;
    discountAmount: number;
    paymentId: number;
    isPaid: boolean;
    paidAt: Date;
    paidTime: Date;
    shippedAt: Date;
    shippingTime: Date;
    deliveredAt: Date;
    deliveryTime: Date;
    completionTime: Date;
    canceledAt: Date;
    cancellationTime: Date;
    cancellationReason: string;
    refundTime: Date;
    refundReason: string;
    remark: string;
    items: OrderItem[];
    addresses: OrderAddress[];
    createdAt: Date;
    updatedAt: Date;
}
