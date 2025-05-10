import { Coupon } from './coupon.entity';
import { User } from '../../user/entities/user.entity';
import { CouponStatus } from '../enums/coupon-status.enum';
export declare class UserCoupon {
    id: number;
    userId: number;
    user: User;
    couponId: number;
    coupon: Coupon;
    status: CouponStatus;
    validFrom: Date;
    validTo: Date;
    usedAt: Date;
    orderId: number;
    createdAt: Date;
    updatedAt: Date;
}
