import { Repository } from 'typeorm';
import { Coupon } from './entities/coupon.entity';
import { UserCoupon } from './entities/user-coupon.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
export declare class CouponService {
    private couponRepository;
    private userCouponRepository;
    private readonly logger;
    constructor(couponRepository: Repository<Coupon>, userCouponRepository: Repository<UserCoupon>);
    create(createCouponDto: CreateCouponDto): Promise<Coupon>;
    findAll(): Promise<Coupon[]>;
    findOne(id: number): Promise<Coupon>;
    update(id: number, updateCouponDto: UpdateCouponDto): Promise<Coupon>;
    remove(id: number): Promise<void>;
    issueToUser(couponId: number, userId: number): Promise<UserCoupon>;
    getUserCoupons(userId: number): Promise<UserCoupon[]>;
    markAsUsed(userId: number, couponId: number, orderId: number): Promise<void>;
    restoreCoupon(couponId: number): Promise<void>;
    calculateDiscount(userCouponId: number, orderAmount: number): Promise<number>;
    scheduleCouponExpiration(): Promise<void>;
}
