import { BaseException } from '../base.exception';
export declare class OrderInventoryException extends BaseException {
    constructor(productId: number, requestedQuantity: number, availableQuantity: number);
}
