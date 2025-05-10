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
exports.WechatPayService = void 0;
const common_1 = require("@nestjs/common");
const ConfigService_1 = require("./ConfigService");
const logger_1 = require("../utils/logger");
const crypto_1 = require("crypto");
const axios_1 = require("axios");
let WechatPayService = class WechatPayService {
    constructor(configService) {
        this.configService = configService;
        this.appId = this.configService.get("WECHAT_APP_ID");
        this.mchId = this.configService.get("WECHAT_MCH_ID");
        this.apiKey = this.configService.get("WECHAT_API_KEY");
        this.notifyUrl = this.configService.get("WECHAT_NOTIFY_URL");
    }
    async createPayment(params) {
        try {
            const nonceStr = this.generateNonceStr();
            const timestamp = Math.floor(Date.now() / 1000).toString();
            const sign = this.generateSign({
                appid: this.appId,
                mch_id: this.mchId,
                nonce_str: nonceStr,
                body: params.body,
                out_trade_no: params.outTradeNo,
                total_fee: params.totalFee,
                spbill_create_ip: params.spbillCreateIp,
                notify_url: this.notifyUrl,
                trade_type: "NATIVE",
            });
            const response = await axios_1.default.post("https://api.mch.weixin.qq.com/pay/unifiedorder", this.buildXml({
                appid: this.appId,
                mch_id: this.mchId,
                nonce_str: nonceStr,
                sign,
                body: params.body,
                out_trade_no: params.outTradeNo,
                total_fee: params.totalFee,
                spbill_create_ip: params.spbillCreateIp,
                notify_url: this.notifyUrl,
                trade_type: "NATIVE",
            }), {
                headers: {
                    "Content-Type": "application/xml",
                },
            });
            const result = this.parseXml(response.data);
            if (result.return_code === "SUCCESS" &&
                result.result_code === "SUCCESS") {
                return {
                    tradeNo: params.outTradeNo,
                    paymentUrl: null,
                    qrCode: result.code_url,
                };
            }
            else {
                throw new Error(result.return_msg || result.err_code_des);
            }
        }
        catch (error) {
            logger_1.logger.error("Failed to create Wechat payment", { error, params });
            throw new Error("创建微信支付失败");
        }
    }
    async queryPayment(tradeNo) {
        try {
            const nonceStr = this.generateNonceStr();
            const sign = this.generateSign({
                appid: this.appId,
                mch_id: this.mchId,
                nonce_str: nonceStr,
                out_trade_no: tradeNo,
            });
            const response = await axios_1.default.post("https://api.mch.weixin.qq.com/pay/orderquery", this.buildXml({
                appid: this.appId,
                mch_id: this.mchId,
                nonce_str: nonceStr,
                sign,
                out_trade_no: tradeNo,
            }), {
                headers: {
                    "Content-Type": "application/xml",
                },
            });
            const result = this.parseXml(response.data);
            if (result.return_code === "SUCCESS" &&
                result.result_code === "SUCCESS") {
                return {
                    status: result.trade_state,
                    payTime: result.time_end,
                    amount: parseInt(result.total_fee) / 100,
                    raw: result,
                };
            }
            else {
                throw new Error(result.return_msg || result.err_code_des);
            }
        }
        catch (error) {
            logger_1.logger.error("Failed to query Wechat payment", { error, tradeNo });
            throw new Error("查询微信支付状态失败");
        }
    }
    async refund(params) {
        try {
            const nonceStr = this.generateNonceStr();
            const outRefundNo = `REFUND_${params.tradeNo}`;
            const sign = this.generateSign({
                appid: this.appId,
                mch_id: this.mchId,
                nonce_str: nonceStr,
                out_trade_no: params.tradeNo,
                out_refund_no: outRefundNo,
                total_fee: params.totalFee,
                refund_fee: params.refundFee,
                refund_desc: params.refundReason,
            });
            const response = await axios_1.default.post("https://api.mch.weixin.qq.com/secapi/pay/refund", this.buildXml({
                appid: this.appId,
                mch_id: this.mchId,
                nonce_str: nonceStr,
                sign,
                out_trade_no: params.tradeNo,
                out_refund_no: outRefundNo,
                total_fee: params.totalFee,
                refund_fee: params.refundFee,
                refund_desc: params.refundReason,
            }), {
                headers: {
                    "Content-Type": "application/xml",
                },
                httpsAgent: new (require("https").Agent)({
                    pfx: require("fs").readFileSync(this.configService.get("WECHAT_CERT_PATH")),
                    passphrase: this.mchId,
                }),
            });
            const result = this.parseXml(response.data);
            if (result.return_code === "SUCCESS" &&
                result.result_code === "SUCCESS") {
                return {
                    success: true,
                    refundTime: result.refund_time,
                    raw: result,
                };
            }
            else {
                throw new Error(result.return_msg || result.err_code_des);
            }
        }
        catch (error) {
            logger_1.logger.error("Failed to refund Wechat payment", { error, params });
            throw new Error("微信退款失败");
        }
    }
    verifyNotify(params) {
        const sign = params.sign;
        delete params.sign;
        return this.generateSign(params) === sign;
    }
    generateNonceStr() {
        return Math.random().toString(36).substr(2, 15);
    }
    generateSign(params) {
        const sortedParams = Object.keys(params)
            .sort()
            .filter((key) => params[key] !== undefined && params[key] !== "")
            .map((key) => `${key}=${params[key]}`)
            .join("&");
        return crypto_1.default
            .createHash("md5")
            .update(sortedParams + "&key=" + this.apiKey)
            .digest("hex")
            .toUpperCase();
    }
    buildXml(params) {
        const xml = Object.entries(params)
            .map(([key, value]) => `<${key}>${value}</${key}>`)
            .join("");
        return `<xml>${xml}</xml>`;
    }
    parseXml(xml) {
        const result = {};
        const matches = xml.match(/<(\w+)>([^<]+)<\/\1>/g);
        if (matches) {
            matches.forEach((match) => {
                const [, key, value] = match.match(/<(\w+)>([^<]+)<\/\1>/) || [];
                if (key && value) {
                    result[key] = value;
                }
            });
        }
        return result;
    }
};
exports.WechatPayService = WechatPayService;
exports.WechatPayService = WechatPayService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ConfigService_1.ConfigService])
], WechatPayService);
//# sourceMappingURL=WechatPayService.js.map