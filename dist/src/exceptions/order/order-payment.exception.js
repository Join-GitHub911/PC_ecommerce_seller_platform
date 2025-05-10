"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderPaymentException = void 0;
const common_1 = require("@nestjs/common");
const base_exception_1 = require("../base.exception");
class OrderPaymentException extends base_exception_1.BaseException {
    constructor(message, data) {
        super(message, common_1.HttpStatus.PAYMENT_REQUIRED, data);
    }
}
exports.OrderPaymentException = OrderPaymentException;
//# sourceMappingURL=order-payment.exception.js.map