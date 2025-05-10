import { CouponService } from "../services/coupon.service";
import { ClaimCouponDto } from "../dto/claim-coupon.dto";
import { User } from "@/modules/user/entities/user.entity";
import { UserCouponStatus } from "../entities/user-coupon.entity";
import { I18nContext } from "nestjs-i18n";
export declare class CouponController {
    private readonly couponService;
    constructor(couponService: CouponService);
    listAvailable(): Promise<import("../entities/coupon.entity").Coupon[]>;
    claim(user: User, dto: ClaimCouponDto): Promise<import("../entities/user-coupon.entity").UserCoupon>;
    getUserCoupons(user: User, status?: UserCouponStatus): Promise<import("../entities/user-coupon.entity").UserCoupon[]>;
    getCoupon(id: string, i18n: I18nContext): Promise<import("../entities/coupon.entity").Coupon>;
}
