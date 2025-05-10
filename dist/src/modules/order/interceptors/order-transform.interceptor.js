"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderTransformInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let OrderTransformInterceptor = class OrderTransformInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.map)((data) => {
            if (Array.isArray(data === null || data === void 0 ? void 0 : data.items)) {
                return {
                    items: data.items.map(this.transformOrder),
                    total: data.total,
                    page: data.page,
                    pageSize: data.pageSize,
                };
            }
            else if (data === null || data === void 0 ? void 0 : data.id) {
                return this.transformOrder(data);
            }
            return data;
        }));
    }
    transformOrder(order) {
        var _a;
        return Object.assign(Object.assign({}, order), { totalAmount: Number(order.totalAmount).toFixed(2), finalAmount: Number(order.finalAmount).toFixed(2), deliveryFee: Number(order.deliveryFee).toFixed(2), discount: order.discount ? Number(order.discount).toFixed(2) : null, createdAt: new Date(order.createdAt).toISOString(), updatedAt: new Date(order.updatedAt).toISOString(), paymentTime: order.paymentTime
                ? new Date(order.paymentTime).toISOString()
                : null, shipmentTime: order.shipmentTime
                ? new Date(order.shipmentTime).toISOString()
                : null, completionTime: order.completionTime
                ? new Date(order.completionTime).toISOString()
                : null, items: (_a = order.items) === null || _a === void 0 ? void 0 : _a.map((item) => (Object.assign(Object.assign({}, item), { price: Number(item.price).toFixed(2), amount: Number(item.amount).toFixed(2) }))) });
    }
};
exports.OrderTransformInterceptor = OrderTransformInterceptor;
exports.OrderTransformInterceptor = OrderTransformInterceptor = __decorate([
    (0, common_1.Injectable)()
], OrderTransformInterceptor);
//# sourceMappingURL=order-transform.interceptor.js.map