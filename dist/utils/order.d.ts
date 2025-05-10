export declare function generateOrderId(): string;
export declare function calculateOrderAmount(items: Array<{
    price: number;
    quantity: number;
}>): number;
export declare function calculateDeliveryFee(totalAmount: number, weight: number, region: string): number;
export declare function calculateDiscount(params: {
    totalAmount: number;
    items: Array<{
        productId: string;
        price: number;
        quantity: number;
    }>;
    coupons: Array<{
        type: string;
        value: number;
        minAmount: number;
        productIds?: string[];
    }>;
}): number;
export declare function getOrderStatusText(status: string): string;
export declare function canCancelOrder(status: string): boolean;
export declare function canPayOrder(status: string): boolean;
export declare function canConfirmReceipt(status: string): boolean;
