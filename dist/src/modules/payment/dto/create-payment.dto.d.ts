import { PaymentChannel, PaymentStatus } from '../../../types/payment.type';
export declare class CreatePaymentDto {
    orderId: number;
    amount: number;
    channel: PaymentChannel;
    status?: PaymentStatus;
    transactionId?: string;
    paymentData?: string;
    returnUrl?: string;
    verifyCode?: string;
}
