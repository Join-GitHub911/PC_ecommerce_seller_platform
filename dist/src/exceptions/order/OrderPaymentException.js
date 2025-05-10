"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderPaymentException = void 0;
const BaseException_1 = require("../BaseException");
class OrderPaymentException extends BaseException_1.BaseException {
    constructor(message, data) {
        super("ORDER_PAYMENT_ERROR", message, 400, data);
    }
}
exports.OrderPaymentException = OrderPaymentException;
//# sourceMappingURL=OrderPaymentException.js.map