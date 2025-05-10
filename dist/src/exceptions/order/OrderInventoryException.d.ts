import { BaseException } from "../BaseException";
export declare class OrderInventoryException extends BaseException {
    constructor(productId: string, requestedQuantity: number, availableQuantity: number);
}
