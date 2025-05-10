"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORDER_ERROR_CODES = exports.ORDER_CACHE_KEYS = exports.ORDER_EVENTS = exports.PAYMENT_STATUS = exports.AFTER_SALE_STATUS = exports.ORDER_STATUS = void 0;
exports.ORDER_STATUS = {
    PENDING_PAYMENT: "pending_payment",
    PENDING_SHIPMENT: "pending_shipment",
    PENDING_RECEIPT: "pending_receipt",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
};
exports.AFTER_SALE_STATUS = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
    RETURNING: "returning",
    RECEIVED: "received",
    REFUNDED: "refunded",
    CLOSED: "closed",
};
exports.PAYMENT_STATUS = {
    PENDING: "pending",
    SUCCESS: "success",
    FAILED: "failed",
    REFUNDING: "refunding",
    REFUNDED: "refunded",
};
exports.ORDER_EVENTS = {
    CREATED: "order.created",
    PAID: "order.paid",
    SHIPPED: "order.shipped",
    RECEIVED: "order.received",
    COMPLETED: "order.completed",
    CANCELLED: "order.cancelled",
    REFUND_REQUESTED: "order.refund.requested",
    REFUND_APPROVED: "order.refund.approved",
    REFUND_REJECTED: "order.refund.rejected",
};
exports.ORDER_CACHE_KEYS = {
    DETAIL: "detail",
    LIST: "list",
    STATS: "stats",
};
exports.ORDER_ERROR_CODES = {
    NOT_FOUND: "ORDER_NOT_FOUND",
    INVALID_STATUS: "INVALID_ORDER_STATUS",
    PAYMENT_TIMEOUT: "ORDER_PAYMENT_TIMEOUT",
    INSUFFICIENT_STOCK: "INSUFFICIENT_STOCK",
    INVALID_AMOUNT: "INVALID_ORDER_AMOUNT",
    AFTER_SALE_EXPIRED: "AFTER_SALE_EXPIRED",
    DUPLICATE_REFUND: "DUPLICATE_REFUND_REQUEST",
};
//# sourceMappingURL=order.constants.js.map