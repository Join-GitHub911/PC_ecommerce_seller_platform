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
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
let WechatPayService = class WechatPayService {
    constructor(configService) {
        this.configService = configService;
        const appId = this.configService.get("WECHAT_APP_ID");
        const mchId = this.configService.get("WECHAT_MCH_ID");
        const apiKey = this.configService.get("WECHAT_API_KEY");
        const notifyUrl = this.configService.get("WECHAT_NOTIFY_URL");
        if (!appId || !mchId || !apiKey || !notifyUrl) {
            throw new Error("Missing required Wechat Pay configuration");
        }
        this.appId = appId;
        this.mchId = mchId;
        this.apiKey = apiKey;
        this.notifyUrl = notifyUrl;
    }
    async createPayment(params) {
        const { orderId, amount, description } = params;
        return {
            transactionId: `WECHAT-${Date.now()}`,
            raw: {},
        };
    }
    async queryPayment(params) {
        const { orderId } = params;
        return {};
    }
    async refund(params) {
        const { tradeNo, totalFee, refundFee, refundReason } = params;
        return {};
    }
    async verifyNotify(data) {
        return true;
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
    __metadata("design:paramtypes", [config_1.ConfigService])
], WechatPayService);
//# sourceMappingURL=WechatPayService.js.map