import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Request } from 'express';
import { Payment } from './entities/payment.entity';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    create(req: Request, createPaymentDto: CreatePaymentDto): Promise<Payment>;
    findOne(id: string): Promise<Payment>;
    refund(id: string, reason: string): Promise<{
        payment: Payment;
        refundData: any;
    }>;
    alipayNotify(req: Request): Promise<"fail" | "success">;
    wechatNotify(req: Request): Promise<{
        code: string;
        message: string;
    }>;
    sendVerifyCode(req: Request, orderId: string): Promise<{
        success: boolean;
    }>;
}
