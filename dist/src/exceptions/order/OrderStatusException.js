"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatusException = void 0;
const BaseException_1 = require("../BaseException");
class OrderStatusException extends BaseException_1.BaseException {
    constructor(orderId, currentStatus, expectedStatus) {
        super("INVALID_ORDER_STATUS", `订单 ${orderId} 当前状态为 ${currentStatus}，无法执行此操作，需要状态为 ${expectedStatus}`, 400);
    }
}
exports.OrderStatusException = OrderStatusException;
//# sourceMappingURL=OrderStatusException.js.map