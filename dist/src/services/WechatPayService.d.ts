import { ConfigService } from "./ConfigService";
export declare class WechatPayService {
    private configService;
    private appId;
    private mchId;
    private apiKey;
    private notifyUrl;
    constructor(configService: ConfigService);
    createPayment(params: {
        outTradeNo: string;
        totalFee: number;
        body: string;
        spbillCreateIp: string;
    }): Promise<{
        tradeNo: string;
        paymentUrl: any;
        qrCode: string;
    }>;
    queryPayment(tradeNo: string): Promise<{
        status: string;
        payTime: string;
        amount: number;
        raw: Record<string, string>;
    }>;
    refund(params: {
        tradeNo: string;
        totalFee: number;
        refundFee: number;
        refundReason?: string;
    }): Promise<{
        success: boolean;
        refundTime: string;
        raw: Record<string, string>;
    }>;
    verifyNotify(params: Record<string, string>): boolean;
    private generateNonceStr;
    private generateSign;
    private buildXml;
    private parseXml;
}
