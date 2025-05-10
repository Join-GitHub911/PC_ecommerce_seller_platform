export declare enum PaymentMethod {
    ALIPAY = "ALIPAY",
    WECHAT = "WECHAT",
    BALANCE = "BALANCE"
}
export declare enum PaymentStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED",
    PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
    CANCELED = "CANCELED"
}
export declare enum PaymentChannel {
    ALIPAY = "ALIPAY",
    WECHAT = "WECHAT",
    BANK_TRANSFER = "BANK_TRANSFER",
    CREDIT_CARD = "CREDIT_CARD",
    CASH = "CASH"
}
export interface CreatePaymentDto {
    orderId: number;
    amount: number;
    method: PaymentMethod;
    channel: PaymentChannel;
    returnUrl?: string;
    verifyCode?: string;
    description?: string;
}
export interface PaymentQueryDto {
    orderId?: number;
    userId?: number;
    status?: PaymentStatus;
    method?: PaymentMethod;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}
export interface RefundPaymentDto {
    orderId: number;
    amount: number;
    reason?: string;
}
export interface PaymentResult {
    success: boolean;
    transactionId?: string;
    message: string;
    data?: any;
}
