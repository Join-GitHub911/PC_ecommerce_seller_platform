import { ConfigService } from "./ConfigService";
export declare class AlipayService {
    private configService;
    private alipayClient;
    constructor(configService: ConfigService);
    createPayment(params: {
        outTradeNo: string;
        totalAmount: number;
        subject: string;
        body?: string;
    }): Promise<{
        tradeNo: string;
        paymentUrl: any;
        qrCode: any;
    }>;
    queryPayment(tradeNo: string): Promise<{
        status: any;
        payTime: any;
        amount: number;
        raw: any;
    }>;
    refund(params: {
        tradeNo: string;
        refundAmount: number;
        refundReason?: string;
    }): Promise<{
        success: boolean;
        refundTime: any;
        raw: any;
    }>;
    verifyNotify(params: Record<string, string>): boolean;
}
