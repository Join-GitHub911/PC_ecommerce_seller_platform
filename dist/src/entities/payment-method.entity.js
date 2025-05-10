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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethodEntity = void 0;
const typeorm_1 = require("typeorm");
const payment_type_1 = require("../types/payment.type");
let PaymentMethodEntity = class PaymentMethodEntity {
};
exports.PaymentMethodEntity = PaymentMethodEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], PaymentMethodEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: payment_type_1.PaymentMethod,
        default: payment_type_1.PaymentMethod.ALIPAY,
    }),
    __metadata("design:type", String)
], PaymentMethodEntity.prototype, "method", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: payment_type_1.PaymentStatus,
        default: payment_type_1.PaymentStatus.PENDING,
    }),
    __metadata("design:type", String)
], PaymentMethodEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PaymentMethodEntity.prototype, "config", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], PaymentMethodEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PaymentMethodEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PaymentMethodEntity.prototype, "updatedAt", void 0);
exports.PaymentMethodEntity = PaymentMethodEntity = __decorate([
    (0, typeorm_1.Entity)("payment_methods")
], PaymentMethodEntity);
//# sourceMappingURL=payment-method.entity.js.map