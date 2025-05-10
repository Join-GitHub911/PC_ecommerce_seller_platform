export declare enum PromotionType {
    DISCOUNT = "discount",
    PRICE_CUT = "price_cut",
    FREE_SHIPPING = "free_shipping",
    BUNDLE = "bundle"
}
export declare enum PromotionStatus {
    PENDING = "pending",
    ACTIVE = "active",
    ENDED = "ended",
    CANCELED = "canceled"
}
export declare class Promotion {
    id: number;
    name: string;
    description: string;
    type: PromotionType;
    discountRate: number;
    discountAmount: number;
    minOrderAmount: number;
    startTime: Date;
    endTime: Date;
    applicableProducts: number[];
    applicableCategories: number[];
    status: PromotionStatus;
    createdAt: Date;
    updatedAt: Date;
}
