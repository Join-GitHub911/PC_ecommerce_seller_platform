export declare const ORDER_STATUS: {
    readonly PENDING_PAYMENT: "pending_payment";
    readonly PENDING_SHIPMENT: "pending_shipment";
    readonly PENDING_RECEIPT: "pending_receipt";
    readonly COMPLETED: "completed";
    readonly CANCELLED: "cancelled";
};
export declare const AFTER_SALE_STATUS: {
    readonly PENDING: "pending";
    readonly APPROVED: "approved";
    readonly REJECTED: "rejected";
    readonly RETURNING: "returning";
    readonly RECEIVED: "received";
    readonly REFUNDED: "refunded";
    readonly CLOSED: "closed";
};
export declare const PAYMENT_STATUS: {
    readonly PENDING: "pending";
    readonly SUCCESS: "success";
    readonly FAILED: "failed";
    readonly REFUNDING: "refunding";
    readonly REFUNDED: "refunded";
};
export declare const ORDER_EVENTS: {
    readonly CREATED: "order.created";
    readonly PAID: "order.paid";
    readonly SHIPPED: "order.shipped";
    readonly RECEIVED: "order.received";
    readonly COMPLETED: "order.completed";
    readonly CANCELLED: "order.cancelled";
    readonly REFUND_REQUESTED: "order.refund.requested";
    readonly REFUND_APPROVED: "order.refund.approved";
    readonly REFUND_REJECTED: "order.refund.rejected";
};
export declare const ORDER_CACHE_KEYS: {
    readonly DETAIL: "detail";
    readonly LIST: "list";
    readonly STATS: "stats";
};
export declare const ORDER_ERROR_CODES: {
    readonly NOT_FOUND: "ORDER_NOT_FOUND";
    readonly INVALID_STATUS: "INVALID_ORDER_STATUS";
    readonly PAYMENT_TIMEOUT: "ORDER_PAYMENT_TIMEOUT";
    readonly INSUFFICIENT_STOCK: "INSUFFICIENT_STOCK";
    readonly INVALID_AMOUNT: "INVALID_ORDER_AMOUNT";
    readonly AFTER_SALE_EXPIRED: "AFTER_SALE_EXPIRED";
    readonly DUPLICATE_REFUND: "DUPLICATE_REFUND_REQUEST";
};
