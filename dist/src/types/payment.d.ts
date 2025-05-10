export declare enum PaymentMethod {
    ALIPAY = "alipay",
    WECHAT = "wechat",
    BALANCE = "balance"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed",
    REFUNDED = "refunded"
}
export interface QueryPaymentParams {
    orderId: string;
    transactionId?: string;
}
export interface PaymentResult {
    success: boolean;
    transactionId?: string;
    raw?: any;
}
