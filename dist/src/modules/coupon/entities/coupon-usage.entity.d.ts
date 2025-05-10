import { UserCoupon } from "./user-coupon.entity";
import { Order } from "@/modules/order/entities/order.entity";
export declare class CouponUsage {
    id: string;
    userCoupon: UserCoupon;
    order: Order;
    orderAmount: number;
    discountAmount: number;
    remark: string;
    createdAt: Date;
}
