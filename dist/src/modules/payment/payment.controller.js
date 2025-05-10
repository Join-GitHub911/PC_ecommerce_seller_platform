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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const create_payment_dto_1 = require("./dto/create-payment.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async create(req, createPaymentDto) {
        return this.paymentService.create(req.user, createPaymentDto);
    }
    async findOne(id) {
        return this.paymentService.findOne(+id);
    }
    async refund(id, reason) {
        return this.paymentService.refund(await this.paymentService.findOne(+id), reason);
    }
    async alipayNotify(req) {
        const params = req.body;
        const isValid = await this.paymentService.verifyAlipayNotify(params);
        if (!isValid) {
            return 'fail';
        }
        const payment = await this.paymentService.findByPaymentNo(params.out_trade_no);
        if (!payment) {
            return 'fail';
        }
        if (params.trade_status === 'TRADE_SUCCESS') {
            await this.paymentService.handlePaymentSuccess(payment);
        }
        else if (params.trade_status === 'TRADE_CLOSED') {
            await this.paymentService.handlePaymentFailure(payment);
        }
        return 'success';
    }
    async wechatNotify(req) {
        const params = req.body;
        const headers = req.headers;
        const isValid = await this.paymentService.verifyWechatNotify(params, headers);
        if (!isValid) {
            return { code: 'FAIL', message: '签名验证失败' };
        }
        const payment = await this.paymentService.findByPaymentNo(params.out_trade_no);
        if (!payment) {
            return { code: 'FAIL', message: '订单不存在' };
        }
        if (params.trade_state === 'SUCCESS') {
            await this.paymentService.handlePaymentSuccess(payment);
        }
        else if (params.trade_state === 'CLOSED') {
            await this.paymentService.handlePaymentFailure(payment);
        }
        return { code: 'SUCCESS', message: 'OK' };
    }
    async sendVerifyCode(req, orderId) {
        const order = await this.paymentService.getOrder(+orderId);
        return this.paymentService.sendPaymentVerifyCode(req.user, order);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_payment_dto_1.CreatePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/refund'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "refund", null);
__decorate([
    (0, common_1.Post)('alipay/notify'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "alipayNotify", null);
__decorate([
    (0, common_1.Post)('wechat/notify'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "wechatNotify", null);
__decorate([
    (0, common_1.Post)(':orderId/verify-code'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "sendVerifyCode", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)('payments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map