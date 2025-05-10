"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderOwner = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("../order.service");
exports.OrderOwner = (0, common_1.createParamDecorator)(async (data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const orderId = request.params.id;
    const userId = request.user.id;
    const orderService = request.scope.resolve(order_service_1.OrderService);
    const order = await orderService.getOrderDetail(orderId, userId);
    if (order.userId !== userId) {
        throw new Error("无权访问此订单");
    }
    return order;
});
//# sourceMappingURL=order-owner.decorator.js.map