import { BaseException } from "../BaseException";
import { OrderStatus } from "@/types/order";
export declare class OrderStatusException extends BaseException {
    constructor(orderId: string, currentStatus: OrderStatus, expectedStatus: OrderStatus);
}
