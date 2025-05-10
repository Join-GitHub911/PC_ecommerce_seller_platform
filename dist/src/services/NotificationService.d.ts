import { ConfigService } from "@nestjs/config";
import { OrderStatus } from "@/types/order.type";
import { PaymentMethod } from "@/types/payment.type";
interface PaymentCreatedNotification {
    userId: string;
    orderId: string;
    amount: number;
    method: PaymentMethod;
}
interface PaymentSuccessEmail {
    email: string;
    orderId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    userName: string;
}
interface RefundSuccessEmail {
    email: string;
    orderId: string;
    amount: number;
    refundAmount: number;
    paymentMethod: PaymentMethod;
    userName: string;
    refundReason?: string;
}
interface RefundFailedEmail {
    email: string;
    orderId: string;
    amount: number;
    refundAmount: number;
    errorMessage: string;
    paymentMethod: PaymentMethod;
    userName: string;
}
export declare class NotificationService {
    private configService;
    private transporter;
    private templates;
    constructor(configService: ConfigService);
    private loadTemplates;
    sendPaymentCreatedNotification(params: PaymentCreatedNotification): Promise<void>;
    sendPaymentSuccessEmail(params: PaymentSuccessEmail): Promise<void>;
    sendPaymentFailedEmail(params: {
        email: string;
        orderId: string;
        amount: number;
        paymentMethod: PaymentMethod;
        errorMessage: string;
        userName: string;
    }): Promise<void>;
    sendRefundSuccessEmail(params: RefundSuccessEmail): Promise<void>;
    sendRefundFailedEmail(params: RefundFailedEmail): Promise<void>;
    sendOrderStatusNotification(orderId: string, status: OrderStatus, reason?: string): Promise<void>;
}
export {};
