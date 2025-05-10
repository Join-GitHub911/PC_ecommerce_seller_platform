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
exports.AlipayService = void 0;
const common_1 = require("@nestjs/common");
const ConfigService_1 = require("./ConfigService");
const alipay_sdk_1 = require("alipay-sdk");
const form_1 = require("alipay-sdk/lib/form");
const logger_1 = require("../utils/logger");
let AlipayService = class AlipayService {
    constructor(configService) {
        this.configService = configService;
        this.alipayClient = new alipay_sdk_1.default({
            appId: this.configService.get("ALIPAY_APP_ID"),
            privateKey: this.configService.get("ALIPAY_PRIVATE_KEY"),
            alipayPublicKey: this.configService.get("ALIPAY_PUBLIC_KEY"),
            gateway: this.configService.get("ALIPAY_GATEWAY"),
            timeout: 5000,
            camelcase: true,
        });
    }
    async createPayment(params) {
        try {
            const formData = new form_1.default();
            formData.addField("notifyUrl", this.configService.get("ALIPAY_NOTIFY_URL"));
            formData.addField("bizContent", {
                outTradeNo: params.outTradeNo,
                totalAmount: params.totalAmount.toFixed(2),
                subject: params.subject,
                body: params.body,
                productCode: "FAST_INSTANT_TRADE_PAY",
            });
            const result = await this.alipayClient.exec("alipay.trade.page.pay", {}, { formData });
            return {
                tradeNo: params.outTradeNo,
                paymentUrl: result,
                qrCode: null,
            };
        }
        catch (error) {
            logger_1.logger.error("Failed to create Alipay payment", { error, params });
            throw new Error("创建支付宝支付失败");
        }
    }
    async queryPayment(tradeNo) {
        try {
            const result = await this.alipayClient.exec("alipay.trade.query", {}, {
                bizContent: {
                    outTradeNo: tradeNo,
                },
            });
            return {
                status: result.tradeStatus,
                payTime: result.sendPayDate,
                amount: parseFloat(result.totalAmount),
                raw: result,
            };
        }
        catch (error) {
            logger_1.logger.error("Failed to query Alipay payment", { error, tradeNo });
            throw new Error("查询支付宝支付状态失败");
        }
    }
    async refund(params) {
        try {
            const result = await this.alipayClient.exec("alipay.trade.refund", {}, {
                bizContent: {
                    outTradeNo: params.tradeNo,
                    refundAmount: params.refundAmount.toFixed(2),
                    refundReason: params.refundReason,
                },
            });
            return {
                success: result.code === "10000",
                refundTime: result.gmtRefundPay,
                raw: result,
            };
        }
        catch (error) {
            logger_1.logger.error("Failed to refund Alipay payment", { error, params });
            throw new Error("支付宝退款失败");
        }
    }
    verifyNotify(params) {
        return this.alipayClient.checkNotifySign(params);
    }
};
exports.AlipayService = AlipayService;
exports.AlipayService = AlipayService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ConfigService_1.ConfigService])
], AlipayService);
//# sourceMappingURL=AlipayService.js.map