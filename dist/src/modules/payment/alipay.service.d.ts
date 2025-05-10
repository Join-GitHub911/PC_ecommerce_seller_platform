import { ConfigService } from '@nestjs/config';
import { Payment } from './entities/payment.entity';
export declare class AlipayService {
    private configService;
    private readonly logger;
    private alipaySdk;
    constructor(configService: ConfigService);
    createPayment(payment: Payment, returnUrl?: string): Promise<any>;
    verifyNotify(params: any): Promise<boolean>;
    queryPayment(payment: Payment): Promise<any>;
    cancelPayment(payment: Payment): Promise<any>;
    refund(payment: Payment, reason: string): Promise<any>;
}
