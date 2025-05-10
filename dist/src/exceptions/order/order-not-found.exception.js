"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderNotFoundException = void 0;
const common_1 = require("@nestjs/common");
const base_exception_1 = require("../base.exception");
class OrderNotFoundException extends base_exception_1.BaseException {
    constructor(orderId) {
        super(`Order with ID ${orderId} not found`, common_1.HttpStatus.NOT_FOUND, { orderId });
    }
}
exports.OrderNotFoundException = OrderNotFoundException;
//# sourceMappingURL=order-not-found.exception.js.map