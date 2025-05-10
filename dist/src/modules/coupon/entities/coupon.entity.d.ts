import { UserCoupon } from './user-coupon.entity';
import { CouponType } from '../enums/coupon-type.enum';
import { CouponStatus } from '../enums/coupon-status.enum';
export declare enum CouponScope {
    ALL = "all",
    CATEGORY = "category",
    PRODUCT = "product"
}
export declare class Coupon {
    id: number;
    name: string;
    description: string;
    type: CouponType;
    value: number;
    minOrderAmount: number;
    maxDiscount: number;
    validFrom: Date;
    validTo: Date;
    totalQuantity: number;
    status: CouponStatus;
    applicableProducts: number[];
    applicableCategories: number[];
    userCoupons: UserCoupon[];
    createdAt: Date;
    updatedAt: Date;
}
