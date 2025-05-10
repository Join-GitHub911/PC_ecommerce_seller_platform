"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderId = generateOrderId;
exports.calculateOrderTotal = calculateOrderTotal;
const uuid_1 = require("uuid");
function generateOrderId() {
    const timestamp = Date.now().toString();
    const random = (0, uuid_1.v4)().split("-")[0];
    return `ORD${timestamp}${random}`;
}
function calculateOrderTotal(items) {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
}
//# sourceMappingURL=order.util.js.map