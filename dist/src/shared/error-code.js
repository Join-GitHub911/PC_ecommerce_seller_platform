"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCode = void 0;
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
    ErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ErrorCode["NOT_FOUND"] = "NOT_FOUND";
    ErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
    ErrorCode["FORBIDDEN"] = "FORBIDDEN";
    ErrorCode["ORDER_NOT_FOUND"] = "ORDER_NOT_FOUND";
    ErrorCode["ORDER_STATUS_INVALID"] = "ORDER_STATUS_INVALID";
    ErrorCode["ORDER_CANCEL_FAILED"] = "ORDER_CANCEL_FAILED";
    ErrorCode["ORDER_PAYMENT_FAILED"] = "ORDER_PAYMENT_FAILED";
    ErrorCode["PAYMENT_NOT_FOUND"] = "PAYMENT_NOT_FOUND";
    ErrorCode["PAYMENT_STATUS_INVALID"] = "PAYMENT_STATUS_INVALID";
    ErrorCode["PAYMENT_METHOD_NOT_SUPPORTED"] = "PAYMENT_METHOD_NOT_SUPPORTED";
    ErrorCode["PRODUCT_NOT_FOUND"] = "PRODUCT_NOT_FOUND";
    ErrorCode["PRODUCT_STOCK_INSUFFICIENT"] = "PRODUCT_STOCK_INSUFFICIENT";
    ErrorCode["PRODUCT_PRICE_CHANGED"] = "PRODUCT_PRICE_CHANGED";
    ErrorCode["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    ErrorCode["USER_ADDRESS_NOT_FOUND"] = "USER_ADDRESS_NOT_FOUND";
    ErrorCode["USER_BALANCE_INSUFFICIENT"] = "USER_BALANCE_INSUFFICIENT";
    ErrorCode["COUPON_NOT_FOUND"] = "COUPON_NOT_FOUND";
    ErrorCode["COUPON_EXPIRED"] = "COUPON_EXPIRED";
    ErrorCode["COUPON_USED"] = "COUPON_USED";
    ErrorCode["COUPON_INVALID"] = "COUPON_INVALID";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
//# sourceMappingURL=error-code.js.map