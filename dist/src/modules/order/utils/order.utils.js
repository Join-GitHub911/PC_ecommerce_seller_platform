"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderNumber = generateOrderNumber;
exports.generateAfterSaleNumber = generateAfterSaleNumber;
exports.calculateOrderAmount = calculateOrderAmount;
exports.canCancelOrder = canCancelOrder;
exports.canApplyAfterSale = canApplyAfterSale;
exports.getAfterSaleStatusText = getAfterSaleStatusText;
exports.formatOrderAmount = formatOrderAmount;
exports.validateRefundAmount = validateRefundAmount;
const date_fns_1 = require("date-fns");
const order_type_1 = require("../types/order.type");
const after_sale_type_1 = require("../types/after-sale.type");
function generateOrderNumber() {
    const timestamp = (0, date_fns_1.format)(new Date(), "yyyyMMddHHmmss");
    const random = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");
    return `O${timestamp}${random}`;
}
function generateAfterSaleNumber() {
    const timestamp = (0, date_fns_1.format)(new Date(), "yyyyMMddHHmmss");
    const random = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");
    return `R${timestamp}${random}`;
}
function calculateOrderAmount(items) {
    return items.reduce((total, item) => {
        const itemTotal = item.price * item.quantity;
        return total + (itemTotal - (item.discount || 0));
    }, 0);
}
function canCancelOrder(status) {
    return status === order_type_1.OrderStatus.PENDING_PAYMENT;
}
function canApplyAfterSale(status, completionTime) {
    if (status !== order_type_1.OrderStatus.COMPLETED) {
        return false;
    }
    const now = new Date();
    const days = Math.floor((now.getTime() - completionTime.getTime()) / (1000 * 60 * 60 * 24));
    return days <= 15;
}
function getAfterSaleStatusText(status) {
    const statusMap = {
        [after_sale_type_1.AfterSaleStatus.PENDING]: "待处理",
        [after_sale_type_1.AfterSaleStatus.APPROVED]: "已批准",
        [after_sale_type_1.AfterSaleStatus.REJECTED]: "已拒绝",
        [after_sale_type_1.AfterSaleStatus.PENDING_RETURN]: "待退货",
        [after_sale_type_1.AfterSaleStatus.RETURNING]: "退货中",
        [after_sale_type_1.AfterSaleStatus.RECEIVED]: "已收货",
        [after_sale_type_1.AfterSaleStatus.REFUNDING]: "退款中",
        [after_sale_type_1.AfterSaleStatus.COMPLETED]: "已完成",
        [after_sale_type_1.AfterSaleStatus.CLOSED]: "已关闭",
    };
    return statusMap[status] || status;
}
function formatOrderAmount(amount) {
    return `￥${amount.toFixed(2)}`;
}
function validateRefundAmount(orderAmount, refundAmount) {
    return refundAmount > 0 && refundAmount <= orderAmount;
}
//# sourceMappingURL=order.utils.js.map