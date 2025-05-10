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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponUsage = void 0;
const typeorm_1 = require("typeorm");
const user_coupon_entity_1 = require("./user-coupon.entity");
const order_entity_1 = require("@/modules/order/entities/order.entity");
let CouponUsage = class CouponUsage {
};
exports.CouponUsage = CouponUsage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], CouponUsage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_coupon_entity_1.UserCoupon),
    __metadata("design:type", user_coupon_entity_1.UserCoupon)
], CouponUsage.prototype, "userCoupon", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_1.Order),
    __metadata("design:type", typeof (_a = typeof order_entity_1.Order !== "undefined" && order_entity_1.Order) === "function" ? _a : Object)
], CouponUsage.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], CouponUsage.prototype, "orderAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], CouponUsage.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CouponUsage.prototype, "remark", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CouponUsage.prototype, "createdAt", void 0);
exports.CouponUsage = CouponUsage = __decorate([
    (0, typeorm_1.Entity)("coupon_usages")
], CouponUsage);
//# sourceMappingURL=coupon-usage.entity.js.map