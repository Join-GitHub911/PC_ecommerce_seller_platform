"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatusException = void 0;
const common_1 = require("@nestjs/common");
const base_exception_1 = require("../base.exception");
class OrderStatusException extends base_exception_1.BaseException {
    constructor(orderId, currentStatus, expectedStatus) {
        super(`Invalid order status: expected ${expectedStatus}, got ${currentStatus}`, common_1.HttpStatus.BAD_REQUEST, { orderId, currentStatus, expectedStatus });
    }
}
exports.OrderStatusException = OrderStatusException;
//# sourceMappingURL=order-status.exception.js.map