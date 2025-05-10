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
var PaymentExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentExceptionFilter = exports.PaymentException = void 0;
const common_1 = require("@nestjs/common");
const nestjs_i18n_1 = require("nestjs-i18n");
class PaymentException extends Error {
    constructor(message, statusCode = common_1.HttpStatus.BAD_REQUEST, paymentData) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.paymentData = paymentData;
    }
}
exports.PaymentException = PaymentException;
let PaymentExceptionFilter = PaymentExceptionFilter_1 = class PaymentExceptionFilter {
    constructor(i18n) {
        this.i18n = i18n;
        this.logger = new common_1.Logger(PaymentExceptionFilter_1.name);
    }
    async catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.statusCode;
        let message = exception.message;
        if (exception instanceof common_1.HttpException) {
            const errorResponse = exception.getResponse();
            message = typeof errorResponse === 'string'
                ? errorResponse
                : errorResponse.message;
        }
        const lang = request.headers['accept-language'] || 'zh';
        if (message.startsWith('payment.')) {
            message = await this.i18n.translate(message, { lang });
        }
        this.logger.error(`Payment exception: ${message}`, exception.paymentData);
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
        });
    }
};
exports.PaymentExceptionFilter = PaymentExceptionFilter;
exports.PaymentExceptionFilter = PaymentExceptionFilter = PaymentExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(PaymentException),
    __metadata("design:paramtypes", [nestjs_i18n_1.I18nService])
], PaymentExceptionFilter);
//# sourceMappingURL=payment-exception.filter.js.map