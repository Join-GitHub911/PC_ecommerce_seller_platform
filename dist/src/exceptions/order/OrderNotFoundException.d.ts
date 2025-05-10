import { BaseException } from "../BaseException";
export declare class OrderNotFoundException extends BaseException {
    constructor(orderId: string);
}
import { OrderStatus } from "@/types/order";
export declare class OrderStatusException extends BaseException {
    constructor(orderId: string, currentStatus: OrderStatus, expectedStatus: OrderStatus);
}
export declare class OrderPaymentException extends BaseException {
    constructor(message: string, data?: any);
}
export declare class OrderInventoryException extends BaseException {
    constructor(productId: string, requestedQuantity: number, availableQuantity: number);
}
export declare class OrderValidationException extends BaseException {
    constructor(message: string, errors?: Record<string, string[]>);
}
