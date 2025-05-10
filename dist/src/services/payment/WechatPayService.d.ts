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
    totalFee: number;
    refundFee: number;
    refundReason?: string;
}
export declare class WechatPayService {
    private configService;
    private appId;
    private mchId;
    private apiKey;
    private notifyUrl;
    constructor(configService: ConfigService);
    createPayment(params: CreatePaymentParams): Promise<{
        transactionId: string;
        raw: {};
    }>;
    queryPayment(params: QueryPaymentParams): Promise<{}>;
    refund(params: RefundParams): Promise<{}>;
    verifyNotify(data: any): Promise<boolean>;
    private generateNonceStr;
    private generateSign;
    private buildXml;
    private parseXml;
}
export {};
