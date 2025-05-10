import { Repository } from "typeorm";
import { Coupon } from "../entities/coupon.entity";
import { UserCoupon, UserCouponStatus } from "../entities/user-coupon.entity";
import { CouponUsage } from "../entities/coupon-usage.entity";
import { I18nService } from "nestjs-i18n";
export declare class CouponService {
    private readonly couponRepository;
    private readonly userCouponRepository;
    private readonly couponUsageRepository;
    private readonly i18n;
    constructor(couponRepository: Repository<Coupon>, userCouponRepository: Repository<UserCoupon>, couponUsageRepository: Repository<CouponUsage>, i18n: I18nService);
    findById(id: string): Promise<Coupon>;
    listAvailable(now?: Date): Promise<Coupon[]>;
    claim(userId: string, couponId: string): Promise<UserCoupon>;
    getUserCoupons(userId: string, status?: UserCouponStatus): Promise<UserCoupon[]>;
    useCoupon(userCouponId: string, orderAmount: number, orderId: string): Promise<Coupon>;
    handleExpiredCoupons(): Promise<void>;
    getCouponStats(couponId: string): Promise<any>;
    getCouponTypeText(type: string, lang?: string): Promise<string>;
}
