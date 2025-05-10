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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("../entities/payment.entity");
const order_service_1 = require("../../order/services/order.service");
const config_1 = require("@nestjs/config");
const alipay_service_1 = require("./providers/alipay.service");
const wechat_pay_service_1 = require("./providers/wechat-pay.service");
const union_pay_service_1 = require("./providers/union-pay.service");
let PaymentService = class PaymentService {
    constructor(paymentRepository, orderService, configService, alipayService, wechatPayService, unionPayService) {
        this.paymentRepository = paymentRepository;
        this.orderService = orderService;
        this.configService = configService;
        this.alipayService = alipayService;
        this.wechatPayService = wechatPayService;
        this.unionPayService = unionPayService;
    }
    async createPayment(dto) {
        const order = await this.orderService.findById(dto.orderId);
        if (order.status !== "pending_payment") {
            throw new common_1.BadRequestException("订单状态不正确");
        }
        const payment = this.paymentRepository.create({
            orderId: order.id,
            amount: order.finalAmount,
            method: dto.method,
            status: payment_entity_1.PaymentStatus.PENDING,
            currency: dto.currency,
            isInstallment: dto.isInstallment,
            balanceUsed: dto.balanceUsed,
        });
        const savedPayment = await this.paymentRepository.save(payment);
        let paymentDetails;
        switch (dto.method) {
            case payment_entity_1.PaymentMethod.ALIPAY:
                paymentDetails = await this.alipayService.createPayment({
                    outTradeNo: savedPayment.id,
                    totalAmount: savedPayment.amount,
                    subject: `订单支付-${order.id}`,
                });
                break;
            case payment_entity_1.PaymentMethod.WECHAT:
                paymentDetails = await this.wechatPayService.createPayment({
                    outTradeNo: savedPayment.id,
                    totalFee: Math.round(savedPayment.amount * 100),
                    body: `订单支付-${order.id}`,
                });
                break;
            case payment_entity_1.PaymentMethod.UNIONPAY:
                paymentDetails = await this.unionPayService.createPayment({
                    orderId: savedPayment.id,
                    amount: savedPayment.amount,
                    description: `订单支付-${order.id}`,
                });
                break;
        }
        savedPayment.paymentDetails = paymentDetails;
        return this.paymentRepository.save(savedPayment);
    }
    async handlePaymentCallback(method, payload) {
        let paymentId;
        let verified = false;
        switch (method) {
            case payment_entity_1.PaymentMethod.ALIPAY:
                verified = await this.alipayService.verifyCallback(payload);
                paymentId = payload.out_trade_no;
                break;
            case payment_entity_1.PaymentMethod.WECHAT:
                verified = await this.wechatPayService.verifyCallback(payload);
                paymentId = payload.out_trade_no;
                break;
            case payment_entity_1.PaymentMethod.UNIONPAY:
                verified = await this.unionPayService.verifyCallback(payload);
                paymentId = payload.orderId;
                break;
        }
        if (!verified) {
            throw new common_1.BadRequestException("支付回调验证失败");
        }
        const payment = await this.findById(paymentId);
        payment.status = payment_entity_1.PaymentStatus.SUCCESS;
        payment.transactionId = payload.transaction_id || payload.trade_no;
        await this.paymentRepository.save(payment);
        await this.orderService.handlePaymentSuccess(payment.orderId);
    }
    async refund(paymentId, amount, reason) {
        const payment = await this.findById(paymentId);
        if (payment.status !== payment_entity_1.PaymentStatus.SUCCESS) {
            throw new common_1.BadRequestException("支付状态不正确");
        }
        if (amount > payment.amount - payment.refundedAmount) {
            throw new common_1.BadRequestException("退款金额超过可退款金额");
        }
        let refundResult;
        switch (payment.method) {
            case payment_entity_1.PaymentMethod.ALIPAY:
                refundResult = await this.alipayService.refund({
                    outTradeNo: payment.id,
                    refundAmount: amount,
                    reason,
                });
                break;
            case payment_entity_1.PaymentMethod.WECHAT:
                refundResult = await this.wechatPayService.refund({
                    outTradeNo: payment.id,
                    totalFee: Math.round(payment.amount * 100),
                    refundFee: Math.round(amount * 100),
                    reason,
                });
                break;
            case payment_entity_1.PaymentMethod.UNIONPAY:
                refundResult = await this.unionPayService.refund({
                    orderId: payment.id,
                    amount,
                    reason,
                });
                break;
        }
        payment.refundedAmount += amount;
        payment.status =
            payment.refundedAmount === payment.amount
                ? payment_entity_1.PaymentStatus.REFUNDED
                : payment_entity_1.PaymentStatus.PARTIALLY_REFUNDED;
        payment.refundId = refundResult.refundId;
        return this.paymentRepository.save(payment);
    }
    async findById(id) {
        const payment = await this.paymentRepository.findOne({
            where: { id },
            relations: ["order"],
        });
        if (!payment) {
            throw new common_1.NotFoundException("支付记录不存在");
        }
        return payment;
    }
    async queryPaymentStatus(id) {
        const payment = await this.findById(id);
        if (payment.status === payment_entity_1.PaymentStatus.PENDING) {
            let status;
            switch (payment.method) {
                case payment_entity_1.PaymentMethod.ALIPAY:
                    status = await this.alipayService.queryPayment(payment.id);
                    break;
                case payment_entity_1.PaymentMethod.WECHAT:
                    status = await this.wechatPayService.queryPayment(payment.id);
                    break;
                case payment_entity_1.PaymentMethod.UNIONPAY:
                    status = await this.unionPayService.queryPayment(payment.id);
                    break;
            }
            if (status !== payment.status) {
                payment.status = status;
                await this.paymentRepository.save(payment);
            }
        }
        return payment.status;
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        order_service_1.OrderService,
        config_1.ConfigService, typeof (_a = typeof alipay_service_1.AlipayService !== "undefined" && alipay_service_1.AlipayService) === "function" ? _a : Object, typeof (_b = typeof wechat_pay_service_1.WechatPayService !== "undefined" && wechat_pay_service_1.WechatPayService) === "function" ? _b : Object, typeof (_c = typeof union_pay_service_1.UnionPayService !== "undefined" && union_pay_service_1.UnionPayService) === "function" ? _c : Object])
], PaymentService);
//# sourceMappingURL=payment.service.js.map