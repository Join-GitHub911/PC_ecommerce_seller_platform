"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidationException = void 0;
const BaseException_1 = require("../BaseException");
class OrderValidationException extends BaseException_1.BaseException {
    constructor(message, errors) {
        super("ORDER_VALIDATION_ERROR", message, 400, errors);
    }
}
exports.OrderValidationException = OrderValidationException;
//# sourceMappingURL=OrderValidationException.js.map