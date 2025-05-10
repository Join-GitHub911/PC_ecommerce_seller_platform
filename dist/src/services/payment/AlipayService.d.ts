import { ConfigService } from "@nestjs/config";
interface CreatePaymentParams {
    orderId: string;
    amount: number;
    description?: string;
}
interface QueryPaymentParams {
    orderId: string;
}
interface RefundParams {
    tradeNo: string;
    refundAmount: number;
    refundReason?: string;
}
export declare class AlipayService {
    private configService;
    private alipay;
    constructor(configService: ConfigService);
    createPayment(params: CreatePaymentParams): Promise<{
        transactionId: any;
        raw: any;
    }>;
    queryPayment(params: QueryPaymentParams): Promise<any>;
    refund(params: RefundParams): Promise<any>;
    verifyNotify(data: any): Promise<boolean>;
    closePayment(tradeNo: string): Promise<{
        success: boolean;
        raw: any;
    }>;
}
export {};
