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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const coupon_service_1 = require("../services/coupon.service");
const claim_coupon_dto_1 = require("../dto/claim-coupon.dto");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
const user_decorator_1 = require("../../../shared/decorators/user.decorator");
const user_entity_1 = require("@/modules/user/entities/user.entity");
const user_coupon_entity_1 = require("../entities/user-coupon.entity");
const nestjs_i18n_1 = require("nestjs-i18n");
let CouponController = class CouponController {
    constructor(couponService) {
        this.couponService = couponService;
    }
    async listAvailable() {
        return this.couponService.listAvailable();
    }
    async claim(user, dto) {
        return this.couponService.claim(user.id, dto.couponId);
    }
    async getUserCoupons(user, status) {
        return this.couponService.getUserCoupons(user.id, status);
    }
    async getCoupon(id, i18n) {
        const coupon = await this.couponService.findById(id);
        if (!coupon) {
            throw new common_1.NotFoundException(await i18n.t("COUPON.NOT_FOUND"));
        }
        return coupon;
    }
};
exports.CouponController = CouponController;
__decorate([
    (0, common_1.Get)("available"),
    (0, swagger_1.ApiOperation)({ summary: "获取可领取优惠券列表" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "listAvailable", null);
__decorate([
    (0, common_1.Post)("claim"),
    (0, swagger_1.ApiOperation)({ summary: "领取优惠券" }),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object, claim_coupon_dto_1.ClaimCouponDto]),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "claim", null);
__decorate([
    (0, common_1.Get)("my"),
    (0, swagger_1.ApiOperation)({ summary: "获取我的优惠券" }),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _b : Object, typeof (_c = typeof user_coupon_entity_1.UserCouponStatus !== "undefined" && user_coupon_entity_1.UserCouponStatus) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "getUserCoupons", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, nestjs_i18n_1.I18n)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, nestjs_i18n_1.I18nContext]),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "getCoupon", null);
exports.CouponController = CouponController = __decorate([
    (0, swagger_1.ApiTags)("coupons"),
    (0, common_1.Controller)("coupons"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [coupon_service_1.CouponService])
], CouponController);
//# sourceMappingURL=coupon.controller.js.map