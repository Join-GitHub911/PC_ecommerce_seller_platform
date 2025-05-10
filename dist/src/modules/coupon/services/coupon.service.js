"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const coupon_entity_1 = require("../entities/coupon.entity");
const user_coupon_entity_1 = require("../entities/user-coupon.entity");
const coupon_usage_entity_1 = require("../entities/coupon-usage.entity");
const nestjs_i18n_1 = require("nestjs-i18n");
let CouponService = class CouponService {
    constructor(couponRepository, userCouponRepository, couponUsageRepository, i18n) {
        this.couponRepository = couponRepository;
        this.userCouponRepository = userCouponRepository;
        this.couponUsageRepository = couponUsageRepository;
        this.i18n = i18n;
    }
    async findById(id) {
        const coupon = await this.couponRepository.findOne({ where: { id } });
        if (!coupon) {
            throw new common_1.NotFoundException("优惠券不存在");
        }
        return coupon;
    }
    async listAvailable(now = new Date()) {
        return this.couponRepository.find({
            where: {
                isActive: true,
                startTime: (0, typeorm_2.LessThanOrEqual)(now),
                endTime: (0, typeorm_2.MoreThanOrEqual)(now),
                remainingQuantity: (0, typeorm_2.MoreThanOrEqual)(1),
            },
            order: { createdAt: "DESC" },
        });
    }
    async claim(userId, couponId) {
        const coupon = await this.findById(couponId);
        if (coupon.remainingQuantity <= 0) {
            throw new common_1.BadRequestException("优惠券已领完");
        }
        const userClaimCount = await this.userCouponRepository.count({
            where: {
                user: { id: userId },
                coupon: { id: couponId },
            },
        });
        if (userClaimCount >= coupon.perUserLimit) {
            throw new common_1.BadRequestException("已达到领取上限");
        }
        const existingCoupon = await this.userCouponRepository.findOne({
            where: {
                user: { id: userId },
                coupon: { id: couponId },
                status: user_coupon_entity_1.UserCouponStatus.UNUSED,
            },
        });
        if (existingCoupon) {
            throw new common_1.BadRequestException("您已领取过该优惠券");
        }
        const userCoupon = this.userCouponRepository.create({
            user: { id: userId },
            coupon: { id: couponId },
            status: user_coupon_entity_1.UserCouponStatus.UNUSED,
        });
        await this.couponRepository.update(couponId, {
            remainingQuantity: coupon.remainingQuantity - 1,
        });
        return this.userCouponRepository.save(userCoupon);
    }
    async getUserCoupons(userId, status) {
        const query = this.userCouponRepository
            .createQueryBuilder("userCoupon")
            .leftJoinAndSelect("userCoupon.coupon", "coupon")
            .where("userCoupon.user.id = :userId", { userId });
        if (status) {
            query.andWhere("userCoupon.status = :status", { status });
        }
        return query.getMany();
    }
    async useCoupon(userCouponId, orderAmount, orderId) {
        const userCoupon = await this.userCouponRepository.findOne({
            where: { id: userCouponId },
            relations: ["coupon"],
        });
        if (!userCoupon) {
            throw new common_1.NotFoundException("用户优惠券不存在");
        }
        if (userCoupon.status !== user_coupon_entity_1.UserCouponStatus.UNUSED) {
            throw new common_1.BadRequestException("优惠券不可用");
        }
        const coupon = userCoupon.coupon;
        const now = new Date();
        if (now < coupon.startTime || now > coupon.endTime) {
            throw new common_1.BadRequestException("优惠券已过期");
        }
        if (orderAmount < coupon.minAmount) {
            throw new common_1.BadRequestException("未满足最低使用金额");
        }
        let discountAmount = 0;
        if (coupon.type === coupon_entity_1.CouponType.FIXED) {
            discountAmount = coupon.value;
        }
        else {
            discountAmount = orderAmount * (coupon.value / 100);
            if (coupon.maxDiscount) {
                discountAmount = Math.min(discountAmount, coupon.maxDiscount);
            }
        }
        const usage = this.couponUsageRepository.create({
            userCoupon,
            order: { id: orderId },
            orderAmount,
            discountAmount,
        });
        userCoupon.status = user_coupon_entity_1.UserCouponStatus.USED;
        userCoupon.usedAt = new Date();
        userCoupon.orderId = orderId;
        await Promise.all([
            this.userCouponRepository.save(userCoupon),
            this.couponUsageRepository.save(usage),
        ]);
        return coupon;
    }
    async handleExpiredCoupons() {
        const now = new Date();
        await this.userCouponRepository.update({
            status: user_coupon_entity_1.UserCouponStatus.UNUSED,
            coupon: {
                endTime: (0, typeorm_2.LessThanOrEqual)(now),
            },
        }, {
            status: user_coupon_entity_1.UserCouponStatus.EXPIRED,
        });
    }
    async getCouponStats(couponId) {
        const [totalClaimed, totalUsed, totalDiscount] = await Promise.all([
            this.userCouponRepository.count({ where: { coupon: { id: couponId } } }),
            this.userCouponRepository.count({
                where: {
                    coupon: { id: couponId },
                    status: user_coupon_entity_1.UserCouponStatus.USED,
                },
            }),
            this.couponUsageRepository
                .createQueryBuilder("usage")
                .leftJoin("usage.userCoupon", "userCoupon")
                .where("userCoupon.coupon.id = :couponId", { couponId })
                .select("SUM(usage.discountAmount)", "total")
                .getRawOne(),
        ]);
        return {
            totalClaimed,
            totalUsed,
            totalDiscount: (totalDiscount === null || totalDiscount === void 0 ? void 0 : totalDiscount.total) || 0,
            usageRate: totalClaimed ? (totalUsed / totalClaimed) * 100 : 0,
        };
    }
    async getCouponTypeText(type, lang = "zh") {
        return this.i18n.translate(`COUPON.TYPE.${type}`, { lang });
    }
};
exports.CouponService = CouponService;
exports.CouponService = CouponService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(coupon_entity_1.Coupon)),
    __param(1, (0, typeorm_1.InjectRepository)(user_coupon_entity_1.UserCoupon)),
    __param(2, (0, typeorm_1.InjectRepository)(coupon_usage_entity_1.CouponUsage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        nestjs_i18n_1.I18nService])
], CouponService);
//# sourceMappingURL=coupon.service.js.map