"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var OrderExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderExceptionFilter = exports.OrderException = void 0;
const common_1 = require("@nestjs/common");
class OrderException extends Error {
    constructor(message, statusCode = common_1.HttpStatus.BAD_REQUEST, orderData) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.orderData = orderData;
    }
}
exports.OrderException = OrderException;
let OrderExceptionFilter = OrderExceptionFilter_1 = class OrderExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(OrderExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.statusCode;
        this.logger.error(`Order exception: ${exception.message}`, exception.orderData);
        response.status(status).json({
            statusCode: status,
            message: exception.message,
            timestamp: new Date().toISOString(),
            path: ctx.getRequest().url,
        });
    }
};
exports.OrderExceptionFilter = OrderExceptionFilter;
exports.OrderExceptionFilter = OrderExceptionFilter = OrderExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(OrderException)
], OrderExceptionFilter);
//# sourceMappingURL=order-exception.filter.js.map