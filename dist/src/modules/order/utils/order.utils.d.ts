import { OrderStatus } from "../types/order.type";
import { AfterSaleStatus } from "../types/after-sale.type";
export declare function generateOrderNumber(): string;
export declare function generateAfterSaleNumber(): string;
export declare function calculateOrderAmount(items: Array<{
    price: number;
    quantity: number;
    discount?: number;
}>): number;
export declare function canCancelOrder(status: OrderStatus): boolean;
export declare function canApplyAfterSale(status: OrderStatus, completionTime: Date): boolean;
export declare function getAfterSaleStatusText(status: AfterSaleStatus): string;
export declare function formatOrderAmount(amount: number): string;
export declare function validateRefundAmount(orderAmount: number, refundAmount: number): boolean;
