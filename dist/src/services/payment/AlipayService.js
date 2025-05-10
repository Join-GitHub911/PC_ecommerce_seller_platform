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
const config_1 = require("@nestjs/config");
const alipay_sdk_1 = require("alipay-sdk");
const logger_util_1 = require("../../utils/logger.util");
let AlipayService = class AlipayService {
    constructor(configService) {
        this.configService = configService;
        this.alipay = new alipay_sdk_1.default({
            appId: this.configService.get("ALIPAY_APP_ID"),
            privateKey: this.configService.get("ALIPAY_PRIVATE_KEY"),
            alipayPublicKey: this.configService.get("ALIPAY_PUBLIC_KEY"),
            gateway: this.configService.get("ALIPAY_GATEWAY"),
        });
    }
    async createPayment(params) {
        const { orderId, amount, description } = params;
        const result = await this.alipay.exec("alipay.trade.page.pay", {}, {
            bizContent: {
                out_trade_no: orderId,
                total_amount: amount,
                subject: description || `Order ${orderId}`,
                product_code: "FAST_INSTANT_TRADE_PAY",
            },
        });
        return {
            transactionId: result.trade_no,
            raw: result,
        };
    }
    async queryPayment(params) {
        const { orderId } = params;
        const result = await this.alipay.exec("alipay.trade.query", {}, {
            bizContent: {
                out_trade_no: orderId,
            },
        });
        return result;
    }
    async refund(params) {
        const { tradeNo, refundAmount, refundReason } = params;
        const result = await this.alipay.exec("alipay.trade.refund", {}, {
            bizContent: {
                out_trade_no: tradeNo,
                refund_amount: refundAmount,
                refund_reason: refundReason,
            },
        });
        return result;
    }
    async verifyNotify(data) {
        return this.alipay.checkNotifySign(data);
    }
    async closePayment(tradeNo) {
        try {
            const result = await this.alipay.exec("alipay.trade.close", {}, {
                bizContent: {
                    out_trade_no: tradeNo,
                },
            });
            return {
                success: result.code === "10000",
                raw: result,
            };
        }
        catch (error) {
            logger_util_1.logger.error("Failed to close Alipay payment", { error, tradeNo });
            throw new Error("关闭支付宝支付失败");
        }
    }
};
exports.AlipayService = AlipayService;
exports.AlipayService = AlipayService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AlipayService);
//# sourceMappingURL=AlipayService.js.map