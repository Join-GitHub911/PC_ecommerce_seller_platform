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
exports.AfterSale = exports.AfterSaleStatus = exports.AfterSaleType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../user/entities/user.entity");
const order_entity_1 = require("../../order/entities/order.entity");
var AfterSaleType;
(function (AfterSaleType) {
    AfterSaleType["REFUND_ONLY"] = "refund_only";
    AfterSaleType["RETURN_REFUND"] = "return_refund";
    AfterSaleType["EXCHANGE"] = "exchange";
})(AfterSaleType || (exports.AfterSaleType = AfterSaleType = {}));
var AfterSaleStatus;
(function (AfterSaleStatus) {
    AfterSaleStatus["PENDING"] = "pending";
    AfterSaleStatus["APPROVED"] = "approved";
    AfterSaleStatus["REJECTED"] = "rejected";
    AfterSaleStatus["PROCESSING"] = "processing";
    AfterSaleStatus["COMPLETED"] = "completed";
    AfterSaleStatus["CANCELLED"] = "cancelled";
})(AfterSaleStatus || (exports.AfterSaleStatus = AfterSaleStatus = {}));
let AfterSale = class AfterSale {
};
exports.AfterSale = AfterSale;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], AfterSale.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AfterSale.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], AfterSale.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AfterSale.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_1.Order),
    __metadata("design:type", order_entity_1.Order)
], AfterSale.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: AfterSaleType }),
    __metadata("design:type", String)
], AfterSale.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: AfterSaleStatus,
        default: AfterSaleStatus.PENDING,
    }),
    __metadata("design:type", String)
], AfterSale.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AfterSale.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AfterSale.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], AfterSale.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array", { nullable: true }),
    __metadata("design:type", Array)
], AfterSale.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AfterSale.prototype, "logisticsCompany", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AfterSale.prototype, "logisticsNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AfterSale.prototype, "adminRemark", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], AfterSale.prototype, "applyCount", void 0);
__decorate([
    (0, typeorm_1.Column)("json", { nullable: true }),
    __metadata("design:type", Array)
], AfterSale.prototype, "progress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AfterSale.prototype, "userComment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AfterSale.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AfterSale.prototype, "updatedAt", void 0);
exports.AfterSale = AfterSale = __decorate([
    (0, typeorm_1.Entity)("after_sales")
], AfterSale);
//# sourceMappingURL=after-sale.entity.js.map