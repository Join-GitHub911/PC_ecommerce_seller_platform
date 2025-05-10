"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderEventType = void 0;
var OrderEventType;
(function (OrderEventType) {
    OrderEventType["CREATED"] = "created";
    OrderEventType["PAID"] = "paid";
    OrderEventType["SHIPPED"] = "shipped";
    OrderEventType["COMPLETED"] = "completed";
    OrderEventType["CANCELLED"] = "cancelled";
    OrderEventType["REFUND_REQUESTED"] = "refund_requested";
    OrderEventType["REFUND_APPROVED"] = "refund_approved";
    OrderEventType["REFUND_REJECTED"] = "refund_rejected";
})(OrderEventType || (exports.OrderEventType = OrderEventType = {}));
//# sourceMappingURL=order.interface.js.map