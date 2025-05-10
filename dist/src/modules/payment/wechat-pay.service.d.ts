import { ConfigService } from '@nestjs/config';
import { Payment } from './entities/payment.entity';
export declare class WechatPayService {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    createPayment(payment: Payment, returnUrl?: string): Promise<any>;
    verifyNotify(params: any, headers: any): Promise<boolean>;
    queryPayment(payment: Payment): Promise<any>;
    cancelPayment(payment: Payment): Promise<any>;
    refund(payment: Payment, reason: string): Promise<any>;
}
