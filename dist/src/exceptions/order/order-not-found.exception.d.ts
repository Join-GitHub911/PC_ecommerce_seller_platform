import { BaseException } from '../base.exception';
export declare class OrderNotFoundException extends BaseException {
    constructor(orderId: number);
}
