"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidationException = exports.OrderInventoryException = exports.OrderPaymentException = exports.OrderStatusException = exports.OrderNotFoundException = void 0;
const BaseException_1 = require("../BaseException");
class OrderNotFoundException extends BaseException_1.BaseException {
    constructor(orderId) {
        super("ORDER_NOT_FOUND", `订单 ${orderId} 不存在`, 404);
    }
}
exports.OrderNotFoundException = OrderNotFoundException;
class OrderStatusException extends BaseException_1.BaseException {
    constructor(orderId, currentStatus, expectedStatus) {
        super("INVALID_ORDER_STATUS", `订单 ${orderId} 当前状态为 ${currentStatus}，无法执行此操作，需要状态为 ${expectedStatus}`, 400);
    }
}
exports.OrderStatusException = OrderStatusException;
class OrderPaymentException extends BaseException_1.BaseException {
    constructor(message, data) {
        super("ORDER_PAYMENT_ERROR", message, 400, data);
    }
}
exports.OrderPaymentException = OrderPaymentException;
class OrderInventoryException extends BaseException_1.BaseException {
    constructor(productId, requestedQuantity, availableQuantity) {
        super("INSUFFICIENT_INVENTORY", `商品 ${productId} 库存不足，当前库存 ${availableQuantity}，需要数量 ${requestedQuantity}`, 400, {
            productId,
            requestedQuantity,
            availableQuantity,
        });
    }
}
exports.OrderInventoryException = OrderInventoryException;
class OrderValidationException extends BaseException_1.BaseException {
    constructor(message, errors) {
        super("ORDER_VALIDATION_ERROR", message, 400, errors);
    }
}
exports.OrderValidationException = OrderValidationException;
//# sourceMappingURL=OrderNotFoundException.js.map