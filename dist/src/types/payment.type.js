"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentChannel = exports.PaymentStatus = exports.PaymentMethod = void 0;
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["ALIPAY"] = "ALIPAY";
    PaymentMethod["WECHAT"] = "WECHAT";
    PaymentMethod["BALANCE"] = "BALANCE";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PROCESSING"] = "PROCESSING";
    PaymentStatus["SUCCESS"] = "SUCCESS";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
    PaymentStatus["PARTIALLY_REFUNDED"] = "PARTIALLY_REFUNDED";
    PaymentStatus["CANCELED"] = "CANCELED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PaymentChannel;
(function (PaymentChannel) {
    PaymentChannel["ALIPAY"] = "ALIPAY";
    PaymentChannel["WECHAT"] = "WECHAT";
    PaymentChannel["BANK_TRANSFER"] = "BANK_TRANSFER";
    PaymentChannel["CREDIT_CARD"] = "CREDIT_CARD";
    PaymentChannel["CASH"] = "CASH";
})(PaymentChannel || (exports.PaymentChannel = PaymentChannel = {}));
//# sourceMappingURL=payment.type.js.map