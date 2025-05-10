export declare enum PaymentMethod {
    ALIPAY = "alipay",
    WECHAT = "wechat",
    UNIONPAY = "unionpay"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    SUCCESS = "success",
    FAILED = "failed",
    REFUNDED = "refunded"
}
export declare class Payment {
    id: string;
    orderId: string;
    userId: string;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    transactionId: string;
    paymentDetails: Record<string, any>;
    paidAt: Date;
    refundedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
