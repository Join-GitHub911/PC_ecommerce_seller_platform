export declare class Coupon {
    id: string;
    code: string;
    name: string;
    description: string;
    amount: number;
    minPurchaseAmount: number;
    type: string;
    status: string;
    startDate: Date;
    endDate: Date;
    totalCount: number;
    usedCount: number;
    rules?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
