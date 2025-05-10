"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderId = generateOrderId;
exports.calculateOrderAmount = calculateOrderAmount;
exports.calculateDeliveryFee = calculateDeliveryFee;
exports.calculateDiscount = calculateDiscount;
exports.getOrderStatusText = getOrderStatusText;
exports.canCancelOrder = canCancelOrder;
exports.canPayOrder = canPayOrder;
exports.canConfirmReceipt = canConfirmReceipt;
const date_fns_1 = require("date-fns");
function generateOrderId() {
    const timestamp = (0, date_fns_1.format)(new Date(), 'yyyyMMddHHmmss');
    const random = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');
    return `O${timestamp}${random}`;
}
function calculateOrderAmount(items) {
    return items.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);
}
function calculateDeliveryFee(totalAmount, weight, region) {
    if (totalAmount >= 199) {
        return 0;
    }
    let baseFee = 12;
    if (weight > 2) {
        baseFee += Math.ceil((weight - 2) / 0.5) * 2;
    }
    const regionFees = {
        'remote': 10,
        'overseas': 30
    };
    return baseFee + (regionFees[region] || 0);
}
function calculateDiscount(params) {
    const { totalAmount, items, coupons } = params;
    let totalDiscount = 0;
    for (const coupon of coupons) {
        if (totalAmount < coupon.minAmount) {
            continue;
        }
        switch (coupon.type) {
            case 'amount':
                totalDiscount += coupon.value;
                break;
            case 'percentage':
                const discountAmount = totalAmount * (coupon.value / 100);
                totalDiscount += discountAmount;
                break;
            case 'product':
                if (coupon.productIds) {
                    const eligibleItems = items.filter(item => coupon.productIds.includes(item.productId));
                    const eligibleAmount = calculateOrderAmount(eligibleItems);
                    totalDiscount += eligibleAmount * (coupon.value / 100);
                }
                break;
        }
    }
    return Math.min(totalDiscount, totalAmount);
}
function getOrderStatusText(status) {
    const statusMap = {
        pending_payment: '待付款',
        pending_shipment: '待发货',
        pending_receipt: '待收货',
        completed: '已完成',
        cancelled: '已取消'
    };
    return statusMap[status] || status;
}
function canCancelOrder(status) {
    return status === 'pending_payment';
}
function canPayOrder(status) {
    return status === 'pending_payment';
}
function canConfirmReceipt(status) {
    return status === 'pending_receipt';
}
//# sourceMappingURL=order.js.map