import { BaseException } from '../base.exception';
import { OrderStatus } from '../../types/order.types';
export declare class OrderStatusException extends BaseException {
    constructor(orderId: number, currentStatus: OrderStatus, expectedStatus: OrderStatus);
}
