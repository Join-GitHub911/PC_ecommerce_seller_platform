"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfterSaleType = exports.AfterSaleStatus = void 0;
var AfterSaleStatus;
(function (AfterSaleStatus) {
    AfterSaleStatus["PENDING"] = "PENDING";
    AfterSaleStatus["APPROVED"] = "APPROVED";
    AfterSaleStatus["REJECTED"] = "REJECTED";
    AfterSaleStatus["COMPLETED"] = "COMPLETED";
    AfterSaleStatus["CANCELLED"] = "CANCELLED";
})(AfterSaleStatus || (exports.AfterSaleStatus = AfterSaleStatus = {}));
var AfterSaleType;
(function (AfterSaleType) {
    AfterSaleType["REFUND"] = "REFUND";
    AfterSaleType["RETURN"] = "RETURN";
    AfterSaleType["EXCHANGE"] = "EXCHANGE";
})(AfterSaleType || (exports.AfterSaleType = AfterSaleType = {}));
//# sourceMappingURL=after-sale.type.js.map