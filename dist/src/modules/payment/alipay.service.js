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
var AlipayService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlipayService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const AlipaySdk = require('alipay-sdk');
const AlipayFormData = require('alipay-sdk/lib/form');
let AlipayService = AlipayService_1 = class AlipayService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(AlipayService_1.name);
        this.alipaySdk = new AlipaySdk({
            appId: this.configService.get('ALIPAY_APP_ID'),
            privateKey: this.configService.get('ALIPAY_PRIVATE_KEY'),
            alipayPublicKey: this.configService.get('ALIPAY_PUBLIC_KEY'),
        });
    }
    async createPayment(payment, returnUrl) {
        this.logger.log(`Creating Alipay payment for order ${payment.orderId}`);
        const formData = new AlipayFormData();
        formData.addField('notifyUrl', this.configService.get('ALIPAY_NOTIFY_URL'));
        formData.addField('bizContent', {
            outTradeNo: payment.paymentNo,
            productCode: 'FAST_INSTANT_TRADE_PAY',
            totalAmount: payment.amount.toString(),
            subject: `订单支付-${payment.paymentNo}`,
            body: `订单支付-${payment.paymentNo}`,
        });
        if (returnUrl) {
            formData.addField('returnUrl', returnUrl);
        }
        try {
            const result = await this.alipaySdk.exec('alipay.trade.page.pay', {}, { formData });
            return result;
        }
        catch (error) {
            this.logger.error('Failed to create Alipay payment', error);
            throw error;
        }
    }
    async verifyNotify(params) {
        this.logger.log('Verifying Alipay notification');
        try {
            return this.alipaySdk.checkNotifySign(params);
        }
        catch (error) {
            this.logger.error('Failed to verify Alipay notification', error);
            return false;
        }
    }
    async queryPayment(payment) {
        this.logger.log(`Querying Alipay payment status for ${payment.paymentNo}`);
        try {
            const result = await this.alipaySdk.exec('alipay.trade.query', {
                bizContent: {
                    outTradeNo: payment.paymentNo,
                },
            });
            return {
                tradeStatus: result.tradeStatus || 'UNKNOWN',
                tradeNo: result.tradeNo,
                totalAmount: result.totalAmount,
                receiptAmount: result.receiptAmount,
                buyerPayAmount: result.buyerPayAmount,
            };
        }
        catch (error) {
            this.logger.error(`Failed to query Alipay payment ${payment.paymentNo}`, error);
            throw error;
        }
    }
    async cancelPayment(payment) {
        this.logger.log(`Cancelling Alipay payment ${payment.paymentNo}`);
        try {
            const result = await this.alipaySdk.exec('alipay.trade.cancel', {
                bizContent: {
                    outTradeNo: payment.paymentNo,
                },
            });
            return {
                success: result.action === 'close',
                retryFlag: result.retryFlag,
            };
        }
        catch (error) {
            this.logger.error(`Failed to cancel Alipay payment ${payment.paymentNo}`, error);
            throw error;
        }
    }
    async refund(payment, reason) {
        this.logger.log(`Refunding Alipay payment ${payment.paymentNo}`);
        try {
            const result = await this.alipaySdk.exec('alipay.trade.refund', {
                bizContent: {
                    outTradeNo: payment.paymentNo,
                    refundAmount: payment.amount.toString(),
                    refundReason: reason,
                },
            });
            return {
                success: result.refund_fee ? true : false,
                refundAmount: result.refund_fee,
                refundTime: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error(`Failed to refund Alipay payment ${payment.paymentNo}`, error);
            throw error;
        }
    }
};
exports.AlipayService = AlipayService;
exports.AlipayService = AlipayService = AlipayService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AlipayService);
//# sourceMappingURL=alipay.service.js.map