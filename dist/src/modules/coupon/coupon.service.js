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
var CouponService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const coupon_entity_1 = require("./entities/coupon.entity");
const user_coupon_entity_1 = require("./entities/user-coupon.entity");
const coupon_type_enum_1 = require("./enums/coupon-type.enum");
const coupon_status_enum_1 = require("./enums/coupon-status.enum");
let CouponService = CouponService_1 = class CouponService {
    constructor(couponRepository, userCouponRepository) {
        this.couponRepository = couponRepository;
        this.userCouponRepository = userCouponRepository;
        this.logger = new common_1.Logger(CouponService_1.name);
    }
    async create(createCouponDto) {
        const coupon = this.couponRepository.create(Object.assign(Object.assign({}, createCouponDto), { status: coupon_status_enum_1.CouponStatus.ACTIVE }));
        return this.couponRepository.save(coupon);
    }
    async findAll() {
        return this.couponRepository.find({
            order: { createdAt: 'DESC' }
        });
    }
    async findOne(id) {
        const coupon = await this.couponRepository.findOne({
            where: { id: Number(id) }
        });
        if (!coupon) {
            throw new common_1.NotFoundException(`Coupon with ID ${id} not found`);
        }
        return coupon;
    }
    async update(id, updateCouponDto) {
        const coupon = await this.findOne(id);
        Object.assign(coupon, updateCouponDto);
        return this.couponRepository.save(coupon);
    }
    async remove(id) {
        const coupon = await this.findOne(id);
        coupon.status = coupon_status_enum_1.CouponStatus.INVALID;
        await this.couponRepository.save(coupon);
    }
    async issueToUser(couponId, userId) {
        const coupon = await this.findOne(couponId);
        if (coupon.status !== coupon_status_enum_1.CouponStatus.ACTIVE) {
            throw new common_1.BadRequestException('Coupon is not active');
        }
        const existing = await this.userCouponRepository.findOne({
            where: {
                userId,
                couponId: Number(couponId),
                status: coupon_status_enum_1.CouponStatus.UNUSED
            }
        });
        if (existing) {
            throw new common_1.BadRequestException('User already has this coupon');
        }
        if (coupon.totalQuantity > 0) {
            const issuedCount = await this.userCouponRepository.count({
                where: { couponId: Number(couponId) }
            });
            if (issuedCount >= coupon.totalQuantity) {
                throw new common_1.BadRequestException('Coupon has reached its issuance limit');
            }
        }
        const userCoupon = this.userCouponRepository.create({
            userId,
            couponId,
            coupon,
            status: coupon_status_enum_1.CouponStatus.UNUSED,
            validFrom: coupon.validFrom || new Date(),
            validTo: coupon.validTo
        });
        return this.userCouponRepository.save(userCoupon);
    }
    async getUserCoupons(userId) {
        const now = new Date();
        return this.userCouponRepository.find({
            where: {
                userId,
                status: coupon_status_enum_1.CouponStatus.UNUSED,
                validFrom: (0, typeorm_2.LessThanOrEqual)(now),
                validTo: (0, typeorm_2.MoreThanOrEqual)(now)
            },
            relations: ['coupon'],
            order: { validTo: 'ASC' }
        });
    }
    async markAsUsed(userId, couponId, orderId) {
        const userCoupon = await this.userCouponRepository.findOne({
            where: {
                userId,
                couponId: Number(couponId),
                status: coupon_status_enum_1.CouponStatus.UNUSED
            }
        });
        if (!userCoupon) {
            throw new common_1.NotFoundException('Coupon not found or already used');
        }
        userCoupon.status = coupon_status_enum_1.CouponStatus.USED;
        userCoupon.usedAt = new Date();
        userCoupon.orderId = orderId;
        await this.userCouponRepository.save(userCoupon);
        this.logger.log(`Coupon ${couponId} marked as used by user ${userId} for order ${orderId}`);
    }
    async restoreCoupon(couponId) {
        const userCoupon = await this.userCouponRepository.findOne({
            where: {
                id: Number(couponId),
                status: coupon_status_enum_1.CouponStatus.USED
            }
        });
        if (!userCoupon) {
            throw new common_1.NotFoundException('Used coupon not found');
        }
        userCoupon.status = coupon_status_enum_1.CouponStatus.UNUSED;
        userCoupon.usedAt = null;
        userCoupon.orderId = null;
        await this.userCouponRepository.save(userCoupon);
        this.logger.log(`Coupon ${couponId} restored to unused status`);
    }
    async calculateDiscount(userCouponId, orderAmount) {
        const userCoupon = await this.userCouponRepository.findOne({
            where: { id: Number(userCouponId) },
            relations: ['coupon']
        });
        if (!userCoupon || userCoupon.status !== coupon_status_enum_1.CouponStatus.UNUSED) {
            throw new common_1.BadRequestException('Invalid coupon');
        }
        const { coupon } = userCoupon;
        if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
            throw new common_1.BadRequestException(`Order amount must be at least ${coupon.minOrderAmount}`);
        }
        let discount = 0;
        switch (coupon.type) {
            case coupon_type_enum_1.CouponType.FIXED:
                discount = coupon.value;
                break;
            case coupon_type_enum_1.CouponType.PERCENTAGE:
                discount = (orderAmount * coupon.value) / 100;
                if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                    discount = coupon.maxDiscount;
                }
                break;
            default:
                throw new Error(`Unsupported coupon type: ${coupon.type}`);
        }
        if (discount > orderAmount) {
            discount = orderAmount;
        }
        return discount;
    }
    async scheduleCouponExpiration() {
        const now = new Date();
        await this.userCouponRepository.update({
            status: coupon_status_enum_1.CouponStatus.UNUSED,
            validTo: (0, typeorm_2.LessThanOrEqual)(now)
        }, {
            status: coupon_status_enum_1.CouponStatus.EXPIRED
        });
        this.logger.log('Expired coupons have been marked as expired');
    }
};
exports.CouponService = CouponService;
exports.CouponService = CouponService = CouponService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(coupon_entity_1.Coupon)),
    __param(1, (0, typeorm_1.InjectRepository)(user_coupon_entity_1.UserCoupon)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CouponService);
//# sourceMappingURL=coupon.service.js.map