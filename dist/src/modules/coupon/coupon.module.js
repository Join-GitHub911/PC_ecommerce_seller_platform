"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_1 = require("@nestjs/schedule");
const coupon_entity_1 = require("./entities/coupon.entity");
const user_coupon_entity_1 = require("./entities/user-coupon.entity");
const coupon_usage_entity_1 = require("./entities/coupon-usage.entity");
const coupon_service_1 = require("./coupon.service");
const coupon_controller_1 = require("./coupon.controller");
const coupon_expiration_task_1 = require("./tasks/coupon-expiration.task");
let CouponModule = class CouponModule {
};
exports.CouponModule = CouponModule;
exports.CouponModule = CouponModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([coupon_entity_1.Coupon, user_coupon_entity_1.UserCoupon, coupon_usage_entity_1.CouponUsage]),
            schedule_1.ScheduleModule.forRoot(),
        ],
        controllers: [coupon_controller_1.CouponController],
        providers: [coupon_service_1.CouponService, coupon_expiration_task_1.CouponExpirationTask],
        exports: [coupon_service_1.CouponService],
    })
], CouponModule);
//# sourceMappingURL=coupon.module.js.map