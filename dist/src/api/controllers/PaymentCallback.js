"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentCallbackController = void 0;
const OrderService_1 = require("@/services/OrderService");
const PaymentService_1 = require("@/services/PaymentService");
const logger_util_1 = require("../../utils/logger.util");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../../entities/order.entity");
const order_item_entity_1 = require("../../entities/order-item.entity");
const cart_entity_1 = require("../../entities/cart.entity");
const product_entity_1 = require("../../entities/product.entity");
const OrderStateManager_1 = require("@/services/OrderStateManager");
const OrderExceptionHandler_1 = require("@/services/OrderExceptionHandler");
const payment_entity_1 = require("../../entities/payment.entity");
const payment_type_1 = require("../../types/payment.type");
const config_1 = require("@nestjs/config");
const AlipayService_1 = require("@/services/payment/AlipayService");
const WechatPayService_1 = require("@/services/payment/WechatPayService");
const NotificationService_1 = require("@/services/NotificationService");
const common_1 = require("@nestjs/common");
const payment_method_entity_1 = require("../../entities/payment-method.entity");
let PaymentCallbackController = class PaymentCallbackController {
    constructor(orderRepository, orderItemRepository, cartRepository, productRepository, orderStateManager, exceptionHandler, paymentRepository, configService, alipayService, wechatPayService, notificationService, paymentMethodRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.orderStateManager = orderStateManager;
        this.exceptionHandler = exceptionHandler;
        this.paymentRepository = paymentRepository;
        this.configService = configService;
        this.alipayService = alipayService;
        this.wechatPayService = wechatPayService;
        this.notificationService = notificationService;
        this.paymentMethodRepository = paymentMethodRepository;
        this.orderService = new OrderService_1.OrderService(this.orderRepository, this.orderItemRepository, this.cartRepository, this.productRepository, this.orderStateManager, this.exceptionHandler);
        this.paymentService = new PaymentService_1.PaymentService(this.paymentRepository, this.orderRepository, this.paymentMethodRepository, this.configService, this.alipayService, this.wechatPayService, this.notificationService);
    }
    async handleAlipayCallback(data, signature) {
        try {
            const verified = await this.alipayService.verifyNotify(data);
            if (!verified) {
                throw new Error("Invalid signature");
            }
            const { out_trade_no, trade_status } = data;
            const order = await this.orderRepository.findOne({
                where: { id: out_trade_no },
            });
            if (!order) {
                throw new Error("Order not found");
            }
            if (trade_status === "TRADE_SUCCESS") {
                await this.orderService.handlePaymentSuccess({
                    orderId: order.id,
                    paymentId: data.trade_no,
                    amount: parseFloat(data.total_amount),
                    payTime: data.gmt_payment,
                });
            }
            return "success";
        }
        catch (error) {
            logger_util_1.logger.error("Alipay callback error:", error);
            throw error;
        }
    }
    async handleWechatCallback(data) {
        try {
            const verified = await this.wechatPayService.verifyNotify(data);
            if (!verified) {
                throw new Error("Invalid signature");
            }
            const { out_trade_no, result_code } = data;
            const order = await this.orderRepository.findOne({
                where: { id: out_trade_no },
            });
            if (!order) {
                throw new Error("Order not found");
            }
            if (result_code === "SUCCESS") {
                await this.orderService.handlePaymentSuccess({
                    orderId: order.id,
                    paymentId: data.transaction_id,
                    amount: parseInt(data.total_fee) / 100,
                    payTime: new Date(parseInt(data.time_end) * 1000).toISOString(),
                });
            }
            return {
                return_code: "SUCCESS",
                return_msg: "OK",
            };
        }
        catch (error) {
            logger_util_1.logger.error("Wechat callback error:", error);
            return {
                return_code: "FAIL",
                return_msg: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
    async handlePaymentResult(params) {
        const { platform, orderId, transactionId, amount, status, payTime, raw } = params;
        await this.paymentService.updatePayment({
            orderId,
            platform,
            transactionId,
            status,
            payTime,
            raw,
        });
        if (status === payment_type_1.PaymentStatus.SUCCESS) {
            await this.orderService.handlePaymentSuccess({
                orderId,
                paymentId: transactionId,
                amount,
                payTime,
            });
            await this.orderService.sendPaymentNotification(orderId);
        }
    }
};
exports.PaymentCallbackController = PaymentCallbackController;
__decorate([
    (0, common_1.Post)("alipay"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)("x-alipay-signature")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PaymentCallbackController.prototype, "handleAlipayCallback", null);
__decorate([
    (0, common_1.Post)("wechat"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentCallbackController.prototype, "handleWechatCallback", null);
exports.PaymentCallbackController = PaymentCallbackController = __decorate([
    (0, common_1.Controller)("payment/callback"),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(cart_entity_1.Cart)),
    __param(3, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(6, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(11, (0, typeorm_1.InjectRepository)(payment_method_entity_1.PaymentMethodEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository, typeof (_a = typeof OrderStateManager_1.OrderStateManager !== "undefined" && OrderStateManager_1.OrderStateManager) === "function" ? _a : Object, typeof (_b = typeof OrderExceptionHandler_1.OrderExceptionHandler !== "undefined" && OrderExceptionHandler_1.OrderExceptionHandler) === "function" ? _b : Object, typeorm_2.Repository,
        config_1.ConfigService, typeof (_c = typeof AlipayService_1.AlipayService !== "undefined" && AlipayService_1.AlipayService) === "function" ? _c : Object, typeof (_d = typeof WechatPayService_1.WechatPayService !== "undefined" && WechatPayService_1.WechatPayService) === "function" ? _d : Object, typeof (_e = typeof NotificationService_1.NotificationService !== "undefined" && NotificationService_1.NotificationService) === "function" ? _e : Object, typeorm_2.Repository])
], PaymentCallbackController);
//# sourceMappingURL=PaymentCallback.js.map