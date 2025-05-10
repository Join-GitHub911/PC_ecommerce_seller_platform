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
exports.Order = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("@/modules/user/entities/user.entity");
const order_item_entity_1 = require("./order-item.entity");
const order_address_entity_1 = require("./order-address.entity");
const address_entity_1 = require("./address.entity");
const order_type_1 = require("../types/order.type");
let Order = class Order {
};
exports.Order = Order;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Order.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object)
], Order.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Order.prototype, "orderNo", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Order.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Order.prototype, "actualAmount", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Order.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Order.prototype, "shippingFee", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { nullable: true }),
    __metadata("design:type", Object)
], Order.prototype, "paymentInfo", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { nullable: true }),
    __metadata("design:type", Object)
], Order.prototype, "shippingInfo", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_item_entity_1.OrderItem, (item) => item.order),
    __metadata("design:type", Array)
], Order.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_address_entity_1.OrderAddress, (address) => address.order),
    __metadata("design:type", Array)
], Order.prototype, "addresses", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Order.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: "收货地址ID" }),
    __metadata("design:type", String)
], Order.prototype, "addressId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => address_entity_1.Address),
    (0, typeorm_1.JoinColumn)({ name: "address_id" }),
    __metadata("design:type", address_entity_1.Address)
], Order.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 10, scale: 2, comment: "运费" }),
    __metadata("design:type", Number)
], Order.prototype, "deliveryFee", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", {
        precision: 10,
        scale: 2,
        nullable: true,
        comment: "优惠金额",
    }),
    __metadata("design:type", Number)
], Order.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 10, scale: 2, comment: "实付金额" }),
    __metadata("design:type", Number)
], Order.prototype, "finalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: order_type_1.OrderStatus,
        default: order_type_1.OrderStatus.PENDING_PAYMENT,
        comment: "订单状态",
    }),
    __metadata("design:type", String)
], Order.prototype, "statusEnum", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: "支付ID" }),
    __metadata("design:type", String)
], Order.prototype, "paymentId", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", {
        precision: 10,
        scale: 2,
        nullable: true,
        comment: "支付金额",
    }),
    __metadata("design:type", Number)
], Order.prototype, "paymentAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true, comment: "支付时间" }),
    __metadata("design:type", Date)
], Order.prototype, "paymentTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: "物流单号" }),
    __metadata("design:type", String)
], Order.prototype, "trackingNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: "物流公司" }),
    __metadata("design:type", String)
], Order.prototype, "carrier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true, comment: "发货时间" }),
    __metadata("design:type", Date)
], Order.prototype, "shippingTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true, comment: "送达时间" }),
    __metadata("design:type", Date)
], Order.prototype, "deliveryTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true, comment: "完成时间" }),
    __metadata("design:type", Date)
], Order.prototype, "completionTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: "取消原因" }),
    __metadata("design:type", String)
], Order.prototype, "cancellationReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: "取消人ID" }),
    __metadata("design:type", String)
], Order.prototype, "cancelledByUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true, comment: "取消时间" }),
    __metadata("design:type", Date)
], Order.prototype, "cancellationTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: "备注" }),
    __metadata("design:type", String)
], Order.prototype, "remark", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: "退款原因" }),
    __metadata("design:type", String)
], Order.prototype, "refundReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true, comment: "退款时间" }),
    __metadata("design:type", Date)
], Order.prototype, "refundTime", void 0);
exports.Order = Order = __decorate([
    (0, typeorm_1.Entity)('orders')
], Order);
//# sourceMappingURL=order.entity.js.map