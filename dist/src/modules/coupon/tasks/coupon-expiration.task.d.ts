import { CouponService } from "../services/coupon.service";
export declare class CouponExpirationTask {
    private readonly couponService;
    constructor(couponService: CouponService);
    handleExpiredCoupons(): Promise<void>;
}
