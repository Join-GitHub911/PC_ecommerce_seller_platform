import { Coupon } from './coupon.entity';
import { Order } from './order.entity';
import { User } from '@/modules/user/entities/user.entity';
export declare class CouponUsage {
    id: string;
    couponId: string;
    coupon: Coupon;
    userId: string;
    user: User;
    orderId: string;
    order: Order;
    discountAmount: number;
    status: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
