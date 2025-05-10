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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("../entities/payment.entity");
const order_entity_1 = require("../entities/order.entity");
const payment_method_entity_1 = require("../entities/payment-method.entity");
const payment_type_1 = require("../types/payment.type");
const config_1 = require("@nestjs/config");
const AlipayService_1 = require("./payment/AlipayService");
const WechatPayService_1 = require("./payment/WechatPayService");
const NotificationService_1 = require("./NotificationService");
const logger_util_1 = require("../utils/logger.util");
let PaymentService = class PaymentService {
    constructor(paymentRepository, orderRepository, paymentMethodRepository, configService, alipayService, wechatPayService, notificationService) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.paymentMethodRepository = paymentMethodRepository;
        this.configService = configService;
        this.alipayService = alipayService;
        this.wechatPayService = wechatPayService;
        this.notificationService = notificationService;
    }
    async createPayment(createPaymentDto, userId) {
        const { orderId, amount, method, description } = createPaymentDto;
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
        });
        if (!order) {
            throw new Error("Order not found");
        }
        const payment = this.paymentRepository.create({
            orderId,
            userId,
            amount,
            method,
            status: payment_type_1.PaymentStatus.PENDING,
            description,
        });
        let paymentResult;
        switch (method) {
            case payment_type_1.PaymentMethod.ALIPAY:
                paymentResult = await this.alipayService.createPayment({
                    orderId,
                    amount,
                    description,
                });
                break;
            case payment_type_1.PaymentMethod.WECHAT:
                paymentResult = await this.wechatPayService.createPayment({
                    orderId,
                    amount,
                    description,
                });
                break;
            default:
                throw new Error("Unsupported payment method");
        }
        payment.transactionId = paymentResult.transactionId;
        payment.raw = paymentResult.raw;
        await this.paymentRepository.save(payment);
        await this.notificationService.sendPaymentCreatedNotification({
            userId,
            orderId,
            amount,
            method,
        });
        return payment;
    }
    async getPayment(id) {
        return this.paymentRepository.findOne({ where: { id } });
    }
    async getPaymentMethods() {
        return this.paymentMethodRepository.find({ where: { isActive: true } });
    }
    async handleBalancePayment(payment) {
        payment.status = payment_type_1.PaymentStatus.SUCCESS;
        payment.payTime = new Date();
        payment.transactionId = `BALANCE-${Date.now()}`;
        await this.paymentRepository.save(payment);
        await this.notificationService.sendPaymentSuccessEmail({
            email: payment.order.user.email,
            orderId: payment.orderId,
            amount: payment.amount,
            paymentMethod: payment.method,
            userName: payment.order.user.name,
        });
    }
    async getPaymentStatus(orderId) {
        const payment = await this.paymentRepository.findOne({
            where: { orderId },
        });
        if (!payment) {
            throw new Error("Payment not found");
        }
        if (payment.method === payment_type_1.PaymentMethod.ALIPAY) {
            return this.alipayService.queryPayment(orderId);
        }
        else if (payment.method === payment_type_1.PaymentMethod.WECHAT) {
            return this.wechatPayService.queryPayment(orderId);
        }
        throw new Error("Unsupported payment method");
    }
    async refundPayment(params) {
        const { orderId, amount, reason } = params;
        const payment = await this.paymentRepository.findOne({
            where: { orderId },
            relations: ["order", "order.user"],
        });
        if (!payment) {
            throw new Error("Payment not found");
        }
        try {
            let result;
            if (payment.method === payment_type_1.PaymentMethod.ALIPAY) {
                result = await this.alipayService.refund({
                    tradeNo: orderId,
                    refundAmount: amount,
                    refundReason: reason,
                });
            }
            else if (payment.method === payment_type_1.PaymentMethod.WECHAT) {
                result = await this.wechatPayService.refund({
                    tradeNo: orderId,
                    totalFee: Math.round(payment.amount * 100),
                    refundFee: Math.round(amount * 100),
                    refundReason: reason,
                });
            }
            else {
                throw new Error("Unsupported payment method");
            }
            await this.notificationService.sendRefundSuccessEmail({
                email: payment.order.user.email,
                orderId,
                amount: payment.amount,
                refundAmount: amount,
                paymentMethod: payment.method,
                userName: payment.order.user.name,
                refundReason: reason,
            });
            return result;
        }
        catch (error) {
            await this.notificationService.sendRefundFailedEmail({
                email: payment.order.user.email,
                orderId,
                amount: payment.amount,
                refundAmount: amount,
                errorMessage: error.message,
                paymentMethod: payment.method,
                userName: payment.order.user.name,
            });
            logger_util_1.logger.error("Failed to refund payment", { error, params });
            throw error;
        }
    }
    async updatePayment(params) {
        const { orderId, platform, transactionId, status, payTime, raw } = params;
        const payment = await this.paymentRepository.findOne({
            where: { orderId },
        });
        if (!payment) {
            throw new Error("Payment not found");
        }
        payment.transactionId = transactionId;
        payment.status = status;
        payment.payTime = new Date(payTime);
        payment.raw = raw;
        await this.paymentRepository.save(payment);
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(2, (0, typeorm_1.InjectRepository)(payment_method_entity_1.PaymentMethodEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService,
        AlipayService_1.AlipayService,
        WechatPayService_1.WechatPayService,
        NotificationService_1.NotificationService])
], PaymentService);
//# sourceMappingURL=PaymentService.js.map