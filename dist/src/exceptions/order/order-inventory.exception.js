"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderInventoryException = void 0;
const common_1 = require("@nestjs/common");
const base_exception_1 = require("../base.exception");
class OrderInventoryException extends base_exception_1.BaseException {
    constructor(productId, requestedQuantity, availableQuantity) {
        super(`Insufficient inventory for product ${productId}: requested ${requestedQuantity}, available ${availableQuantity}`, common_1.HttpStatus.BAD_REQUEST, { productId, requestedQuantity, availableQuantity });
    }
}
exports.OrderInventoryException = OrderInventoryException;
//# sourceMappingURL=order-inventory.exception.js.map