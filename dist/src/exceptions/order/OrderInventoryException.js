"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderInventoryException = void 0;
const BaseException_1 = require("../BaseException");
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
//# sourceMappingURL=OrderInventoryException.js.map