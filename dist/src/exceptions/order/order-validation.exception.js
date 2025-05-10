"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidationException = void 0;
const common_1 = require("@nestjs/common");
const base_exception_1 = require("../base.exception");
class OrderValidationException extends base_exception_1.BaseException {
    constructor(message, data) {
        super(message, common_1.HttpStatus.BAD_REQUEST, data);
    }
}
exports.OrderValidationException = OrderValidationException;
//# sourceMappingURL=order-validation.exception.js.map